// import { useEffect, useMemo, useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useParams, Link } from "react-router-dom";

// import {
//     getExamStudents,
//     getExamMarks,
//     saveExamMarks,
//     submitExamMarks,
// } from "../../../services/teacherResultService";

// const TeacherMarksEntry = () => {
//     const { examId } = useParams();
//     const queryClient = useQueryClient();

//     const [subjectId, setSubjectId] = useState("");
//     const [marks, setMarks] = useState({});
//     const [feedback, setFeedback] = useState("");

//     const {
//         data: studentData,
//         isLoading: studentsLoading,
//         isError: studentsError,
//     } = useQuery({
//         queryKey: ["teacher-exam-students", examId],
//         queryFn: () => getExamStudents(examId),
//         enabled: Boolean(examId),
//     });

//     const {
//         data: marksData,
//         isLoading: marksLoading,
//     } = useQuery({
//         queryKey: ["teacher-exam-marks", examId, subjectId],
//         queryFn: () => getExamMarks(examId, { subject_id: subjectId }),
//         enabled: Boolean(examId && subjectId),
//     });

//     const students = Array.isArray(studentData?.students)
//         ? studentData.students
//         : [];

//     const subjects = Array.isArray(studentData?.subjects)
//         ? studentData.subjects
//         : [];
//         console.log("Student Data",studentData)

//     const selectedSubject = useMemo(
//         () => subjects.find((subject) => subject._id === subjectId),
//         [subjects, subjectId]
//     );

//     const maxMarks = Number(selectedSubject?.max_marks || 0);

//     useEffect(() => {
//         if (!subjectId) {
//             setMarks({});
//             return;
//         }

//         const existingMarks = Array.isArray(marksData?.marks)
//             ? marksData.marks
//             : [];

//         const nextMarks = {};

//         existingMarks.forEach((item) => {
//             nextMarks[String(item.student_id)] =
//                 item.marks_obtained ?? "";
//         });

//         setMarks(nextMarks);
//     }, [subjectId, marksData]);

//     const saveMutation = useMutation({
//         mutationFn: (payload) => saveExamMarks(examId, payload),
//         onSuccess: () => {
//             setFeedback("Marks saved successfully as a draft.");

//             queryClient.invalidateQueries({
//                 queryKey: ["teacher-exam-marks", examId, subjectId],
//             });
//         },
//         onError: (error) => {
//             setFeedback(
//                 error?.response?.data?.message ||
//                 "Unable to save marks."
//             );
//         },
//     });

//     const submitMutation = useMutation({
//         mutationFn: (payload) => submitExamMarks(examId, payload),
//         onSuccess: () => {
//             setFeedback("Marks submitted successfully for approval.");

//             queryClient.invalidateQueries({
//                 queryKey: ["teacher-exam-marks", examId, subjectId],
//             });

//             queryClient.invalidateQueries({
//                 queryKey: ["teacher-result-submissions"],
//             });

//             queryClient.invalidateQueries({
//                 queryKey: ["teacher-result-dashboard"],
//             });
//         },
//         onError: (error) => {
//             setFeedback(
//                 error?.response?.data?.message ||
//                 "Unable to submit marks."
//             );
//         },
//     });

//     const handleMarksChange = (studentId, value) => {
//         setMarks((previous) => ({
//             ...previous,
//             [studentId]: value,
//         }));
//     };

//     const buildPayload = () => {
//         return {
//             subject_id: subjectId,
//             marks: students.map((student) => ({
//                 student_id: student._id,
//                 marks_obtained:
//                     marks[String(student._id)] === "" ||
//                     marks[String(student._id)] === undefined
//                         ? null
//                         : Number(marks[String(student._id)]),
//             })),
//         };
//     };

//     const validateMarks = () => {
//         if (!subjectId) {
//             setFeedback("Please select a subject.");
//             return false;
//         }

//         if (!maxMarks || maxMarks <= 0) {
//             setFeedback("The subject maximum marks are not configured.");
//             return false;
//         }

//         for (const student of students) {
//             const value = marks[String(student._id)];

//             if (value === "" || value === undefined || value === null) {
//                 setFeedback(
//                     `Please enter marks for ${student.first_name || student.student_name}.`
//                 );
//                 return false;
//             }

//             const numericValue = Number(value);

//             if (
//                 !Number.isFinite(numericValue) ||
//                 numericValue < 0 ||
//                 numericValue > maxMarks
//             ) {
//                 setFeedback(
//                     `Marks must be between 0 and ${maxMarks}.`
//                 );
//                 return false;
//             }
//         }

//         return true;
//     };

//     const handleSave = () => {
//         setFeedback("");

//         if (!validateMarks()) return;

//         saveMutation.mutate(buildPayload());
//     };

//     const handleSubmit = () => {
//         setFeedback("");

//         if (!validateMarks()) return;

//         const confirmed = window.confirm(
//             "Are you sure you want to submit these marks for School Admin approval? You may not be able to edit them while they are under review."
//         );

//         if (!confirmed) return;

//         submitMutation.mutate(buildPayload());
//     };

//     if (studentsLoading || marksLoading) {
//         return (
//             <div className="flex justify-center py-20">
//                 <span className="loading loading-spinner loading-lg" />
//             </div>
//         );
//     }

//     if (studentsError) {
//         return (
//             <div className="alert alert-error">
//                 Unable to load students for this examination.
//             </div>
//         );
//     }

//     const submissionStatus = marksData?.submission_status;
//     const isLocked = ["submitted", "approved", "published"].includes(
//         submissionStatus
//     );

//     return (
//         <div className="space-y-5">
//             <div className="flex flex-wrap justify-between items-center gap-3">
//                 <div>
//                     <h2 className="text-2xl font-bold">
//                         Student Marks Entry
//                     </h2>
//                     <p className="text-base-content/60 mt-1">
//                         Enter marks for students in your assigned sections.
//                     </p>
//                 </div>

//                 <Link
//                     to="/teacher/results-dashboard"
//                     className="btn btn-outline btn-sm"
//                 >
//                     Back to Examinations
//                 </Link>
//             </div>

//             {feedback && (
//                 <div className="alert alert-info">
//                     {feedback}
//                 </div>
//             )}

//             <div className="card bg-base-100 shadow-sm">
//                 <div className="card-body">
//                     <label className="label">
//                         <span className="label-text font-semibold">
//                             Select Subject
//                         </span>
//                     </label>

//                     <select
//                         className="select select-bordered w-full max-w-md"
//                         value={subjectId}
//                         onChange={(event) => {
//                             setSubjectId(event.target.value);
//                             setFeedback("");
//                         }}
//                     >
//                         <option value="">Choose a subject</option>

//                         {subjects.map((subject) => (
//                             <option
//                                 key={subject._id}
//                                 value={subject._id}
//                             >
//                                 {subject.subject_name} — Maximum marks:{" "}
//                                 {subject.max_marks}
//                             </option>
//                         ))}
//                     </select>

//                     {selectedSubject && (
//                         <p className="text-sm text-base-content/60 mt-2">
//                             Maximum marks: {maxMarks}
//                         </p>
//                     )}

//                     {submissionStatus && (
//                         <p className="mt-3">
//                             Submission status:{" "}
//                             <span className="badge badge-info">
//                                 {submissionStatus}
//                             </span>
//                         </p>
//                     )}

//                     {submissionStatus === "rejected" && (
//                         <div className="alert alert-warning mt-3">
//                             <span>
//                                 Rejected by School Admin. Please review the
//                                 feedback, correct the marks, and resubmit.
//                                 {marksData?.rejection_reason && (
//                                     <>
//                                         {" "}Reason:{" "}
//                                         {marksData.rejection_reason}
//                                     </>
//                                 )}
//                             </span>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {subjectId && (
//                 <div className="card bg-base-100 shadow-sm">
//                     <div className="card-body p-3 md:p-6">
//                         <div className="flex flex-wrap justify-between gap-2">
//                             <h3 className="card-title">
//                                 Student Marks
//                             </h3>
//                             <span className="text-sm text-base-content/60">
//                                 Students: {students.length}
//                             </span>
//                         </div>

//                         {students.length === 0 ? (
//                             <div className="alert mt-3">
//                                 No students found for this examination.
//                             </div>
//                         ) : (
//                             <div className="overflow-x-auto mt-4">
//                                 <table className="table table-zebra">
//                                     <thead>
//                                         <tr>
//                                             <th>SL</th>
//                                             <th>Student</th>
//                                             <th>Roll</th>
//                                             <th>Marks</th>
//                                             <th>Maximum</th>
//                                         </tr>
//                                     </thead>

//                                     <tbody>
//                                         {students.map((student, index) => (
//                                             <tr key={student._id}>
//                                                 <td>{index + 1}</td>

//                                                 <td>
//                                                     {student.student_name ||
//                                                         `${student.first_name || ""} ${student.last_name || ""}`}
//                                                 </td>

//                                                 <td>
//                                                     {student.roll_number || "—"}
//                                                 </td>

//                                                 <td>
//                                                     <input
//                                                         type="number"
//                                                         min="0"
//                                                         max={maxMarks}
//                                                         step="0.01"
//                                                         className="input input-bordered input-sm w-28"
//                                                         value={
//                                                             marks[String(student._id)] ?? ""
//                                                         }
//                                                         disabled={isLocked}
//                                                         onChange={(event) =>
//                                                             handleMarksChange(
//                                                                 String(student._id),
//                                                                 event.target.value
//                                                             )
//                                                         }
//                                                         placeholder="Marks"
//                                                     />
//                                                 </td>

//                                                 <td>{maxMarks}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}

//                         {!isLocked && students.length > 0 && (
//                             <div className="flex flex-wrap justify-end gap-3 mt-5">
//                                 <button
//                                     type="button"
//                                     className="btn btn-outline"
//                                     onClick={handleSave}
//                                     disabled={
//                                         saveMutation.isPending ||
//                                         submitMutation.isPending
//                                     }
//                                 >
//                                     {saveMutation.isPending
//                                         ? "Saving..."
//                                         : "Save Draft"}
//                                 </button>

//                                 <button
//                                     type="button"
//                                     className="btn btn-primary"
//                                     onClick={handleSubmit}
//                                     disabled={
//                                         saveMutation.isPending ||
//                                         submitMutation.isPending
//                                     }
//                                 >
//                                     {submitMutation.isPending
//                                         ? "Submitting..."
//                                         : "Submit for Approval"}
//                                 </button>
//                             </div>
//                         )}

//                         {isLocked && (
//                             <div className="alert alert-info mt-4">
//                                 This submission is locked while it is under
//                                 review or after approval. Contact the School
//                                 Admin if changes are required.
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TeacherMarksEntry;