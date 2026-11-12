// import { useQuery } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
// import { getTeacherResultExams } from "../../../services/teacherResultService";

// const TeacherResultExams = () => {
//     const { data, isLoading, isError, error } = useQuery({
//         queryKey: ["teacher-result-exams"],
//         queryFn: () => getTeacherResultExams(),
//     });

//     const exams = Array.isArray(data?.exams) ? data.exams : [];

//     console.log("Exams: ",exams)

//     if (isLoading) {
//         return (
//             <div className="flex justify-center py-20">
//                 <span className="loading loading-spinner loading-lg" />
//             </div>
//         );
//     }

//     if (isError) {
//         return (
//             <div className="alert alert-error">
//                 {error?.response?.data?.message ||
//                     "Unable to load examinations."}
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-5">
//             <div>
//                 <h2 className="text-2xl font-bold">
//                     Available Examinations
//                 </h2>
//                 <p className="text-base-content/60 mt-1">
//                     Select an examination to enter student marks.
//                 </p>
//             </div>

//             {exams.length === 0 ? (
//                 <div className="alert">
//                     No examinations are currently available for marks entry.
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//                     {exams.map((exam) => (
//                         <div
//                             key={exam._id}
//                             className="card bg-base-100 shadow-sm border border-base-300"
//                         >
//                             <div className="card-body">
//                                 <h3 className="card-title">
//                                     {exam.exam_name}
//                                 </h3>

//                                 <div className="text-sm space-y-2 text-base-content/70">
//                                     <p>
//                                         <strong>Academic Year:</strong>{" "}
//                                         {exam.academic_year || "—"}
//                                     </p>
//                                     <p>
//                                         <strong>Term:</strong>{" "}
//                                         {exam.term || "—"}
//                                     </p>
//                                     <p>
//                                         <strong>Exam Date:</strong>{" "}
//                                         {exam.exam_date
//                                             ? new Date(
//                                                 exam.exam_date
//                                             ).toLocaleDateString()
//                                             : "Not specified"}
//                                     </p>
//                                 </div>

//                                 <div className="card-actions justify-end mt-3">
//                                     <Link
//                                         to={`/teacher/results-marks-entry/${exam._id}`}
//                                         className="btn btn-primary btn-sm"
//                                     >
//                                         Enter Marks
//                                     </Link>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TeacherResultExams;