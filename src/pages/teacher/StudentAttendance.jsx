import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  //   RefreshCw,
} from "lucide-react";

import { getTeacherClasses } from "../../services/teacherClassService.js";
import { getTeacherStudents } from "../../services/teacherStudentService.js";
import { markTeacherAttendance } from "../../services/teacherAttendanceService.js";
import { useNavigate } from "react-router-dom";

const getLocalDate = () => {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

const StudentAttendance = () => {
  const queryClient = useQueryClient();

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(getLocalDate());
  const [attendance, setAttendance] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  // Fetch classes and sections assigned to this teacher.
  const {
    data: classes = [],
    isLoading: classesLoading,
    isError: classesError,
    refetch: refetchClasses,
  } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: getTeacherClasses,
  });

  // console.log("classes", classes);

  // Fetch students assigned to this teacher.
  const {
    data: allStudents = [],
    isLoading: studentsLoading,
    isError: studentsError,
    refetch: refetchStudents,
  } = useQuery({
    queryKey: ["teacher-students"],
    queryFn: getTeacherStudents,
  });

  // console.log("selectedClassId", selectedClassId);

  // Find the selected class.
  const selectedClass = useMemo(
    () =>
      classes.find(
        (item) => String(item.class_code) === selectedClassId
      ),
    [classes, selectedClassId]
  );
  // console.log("selectedClass", selectedClass);

  // Get sections for the selected class.
  const sections = selectedClass?.sections ?? [];

  const selectedSection = sections.find(
    (section) => String(section._id) === selectedSectionId
  );

  // Display only students from the selected section.
  const students = useMemo(() => {
    if (!selectedSectionId) return [];

    return allStudents
      .filter(
        (student) =>
          String(student.section_id) === selectedSectionId
      )
      .sort((a, b) => {
        const rollA = String(a.roll_number ?? "");
        const rollB = String(b.roll_number ?? "");

        return rollA.localeCompare(rollB, undefined, {
          numeric: true,
        });
      });
  }, [allStudents, selectedSectionId]);

  // Attendance defaults to present unless a teacher changes it.
  const getAttendanceStatus = (studentId) =>
    attendance[studentId] ?? "present";

  const counts = useMemo(() => {
    const result = {
      present: 0,
      absent: 0,
      late: 0,
    };

    students.forEach((student) => {
      result[getAttendanceStatus(student._id)] += 1;
    });

    return result;
  }, [students, attendance]);

  const attendanceMutation = useMutation({
    mutationFn: markTeacherAttendance,

    onSuccess: async () => {
      setSuccessMessage("Attendance saved successfully.");
      setErrorMessage("");

      await queryClient.invalidateQueries({
        queryKey: ["teacher-attendance-history"],
      });
    },

    onError: (error) => {
      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Failed to save attendance."
      );
      setSuccessMessage("");
    },
  });

  const handleClassChange = (event) => {
    setSelectedClassId(event.target.value);
    setSelectedSectionId("");
    setAttendance({});
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSectionChange = (event) => {
    setSelectedSectionId(event.target.value);
    setAttendance({});
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleDateChange = (event) => {
    setAttendanceDate(event.target.value);
    setAttendance({});
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleAllPresent = () => {
    setAttendance({});
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleAllAbsent = () => {
    const allAbsent = {};

    students.forEach((student) => {
      allAbsent[student._id] = "absent";
    });

    setAttendance(allAbsent);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleAllLate = () => {
    const allLate = {};

    students.forEach((student) => {
      allLate[student._id] = "late";
    });

    setAttendance(allLate);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!selectedClassId) {
      setErrorMessage("Please select a class.");
      return;
    }

    if (!selectedSectionId) {
      setErrorMessage("Please select a section.");
      return;
    }

    if (!attendanceDate) {
      setErrorMessage("Please select an attendance date.");
      return;
    }

    if (students.length === 0) {
      setErrorMessage("There are no students in this section.");
      return;
    }

    attendanceMutation.mutate({
      section_id: selectedSectionId,
      date: attendanceDate,
      attendance: students.map((student) => ({
        student_id: student._id,
        status: getAttendanceStatus(student._id),
      })),
    });


  };

  if (classesLoading || studentsLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (classesError || studentsError) {
    return (
      <div className="alert alert-error">
        <span>
          Failed to load class or student information.
        </span>

        <button
          type="button"
          className="btn btn-sm"
          onClick={() => {
            refetchClasses();
            refetchStudents();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const handleBack = () => {

    navigate("/dashboard");

  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <button
          onClick={handleBack}
          className="text-sm font-medium text-base-content/50 hover:text-primary hover:cursor-pointer"
        >
          ← Dashboard
        </button>

      </div>
      {/* Page heading */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
          <ClipboardCheck className="h-7 w-7" />
          Student Attendance
        </h1>

        <p className="mt-2 text-base-content/60">
          Mark and submit attendance for your assigned students.
        </p>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Attendance Information</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Class
              </legend>

              <select
                className="select select-bordered w-full"
                value={selectedClassId}
                onChange={handleClassChange}
              >
                <option value="">Select class</option>

                {classes.map((item) => (
                  <option key={item.class_code} value={item.class_code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Section
              </legend>

              <select
                className="select select-bordered w-full"
                value={selectedSectionId}
                onChange={handleSectionChange}
                disabled={!selectedClassId}
              >
                <option value="">Select section</option>

                {sections.map((section) => (
                  <option
                    key={section._id}
                    value={section._id}
                  >
                    {section.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Attendance Date
              </legend>

              <input
                type="date"
                className="input input-bordered w-full"
                value={attendanceDate}
                max={getLocalDate()}
                onChange={handleDateChange}
              />
            </fieldset>
          </div>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="alert alert-success">
          <CheckCircle className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-error">
          <XCircle className="h-5 w-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Attendance form */}
      {selectedSectionId && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="stat rounded-box bg-base-100 shadow">
              <div className="stat-figure text-primary">
                <Users className="h-8 w-8" />
              </div>
              <div className="stat-title">Total Students</div>
              <div className="stat-value text-primary">
                {students.length}
              </div>
            </div>

            <div className="stat rounded-box bg-base-100 shadow">
              <div className="stat-figure text-success">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div className="stat-title">Present</div>
              <div className="stat-value text-success">
                {counts.present}
              </div>
            </div>

            <div className="stat rounded-box bg-base-100 shadow">
              <div className="stat-figure text-error">
                <XCircle className="h-8 w-8" />
              </div>
              <div className="stat-title">Absent</div>
              <div className="stat-value text-error">
                {counts.absent}
              </div>
            </div>

            <div className="stat rounded-box bg-base-100 shadow">
              <div className="stat-figure text-warning">
                <Clock className="h-8 w-8" />
              </div>
              <div className="stat-title">Late</div>
              <div className="stat-value text-warning">
                {counts.late}
              </div>
            </div>
          </div>

          {/* Student attendance table */}
          <form
            onSubmit={handleSubmit}
            className="card bg-base-100 shadow"
          >
            <div className="card-body">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="card-title">
                    Mark Student Attendance
                  </h2>

                  <p className="text-sm text-base-content/60">
                    {selectedClass?.name} /{" "}
                    {selectedSection?.name} · {attendanceDate}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={handleAllPresent}
                  >
                    All Present
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-error"
                    onClick={handleAllAbsent}
                  >
                    All Absent
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-warning"
                    onClick={handleAllLate}
                  >
                    All Late
                  </button>
                </div>
              </div>

              {students.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="mx-auto mb-3 h-12 w-12 opacity-40" />

                  <h3 className="font-semibold">
                    No students found
                  </h3>

                  <p className="mt-1 text-sm text-base-content/60">
                    No assigned students were found in this section.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Late</th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((student, index) => {
                        const status = getAttendanceStatus(
                          student._id
                        );

                        return (
                          <tr key={student._id}>
                            <td>{index + 1}</td>

                            <td>
                              {student.student_id || "—"}
                            </td>

                            <td className="font-medium">
                              {[
                                student.first_name,
                                student.last_name,
                              ]
                                .filter(Boolean)
                                .join(" ") || "—"}
                            </td>

                            <td>{student.roll_number || "—"}</td>

                            {["present", "absent", "late"].map(
                              (option) => (
                                <td key={option}>
                                  <input
                                    type="radio"
                                    className={`radio ${option === "present"
                                      ? "radio-success"
                                      : option === "absent"
                                        ? "radio-error"
                                        : "radio-warning"
                                      }`}
                                    name={`attendance-${student._id}`}
                                    value={option}
                                    checked={status === option}
                                    onChange={() =>
                                      handleStatusChange(
                                        student._id,
                                        option
                                      )
                                    }
                                    aria-label={`${option} for ${student.first_name
                                      }`}
                                  />
                                </td>
                              )
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    students.length === 0 ||
                    attendanceMutation.isPending
                  }
                >
                  {attendanceMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Saving Attendance...
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="h-5 w-5" />
                      Submit Attendance
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </>
      )}

      {!selectedSectionId && (
        <div className="alert">
          <CalendarDays className="h-5 w-5" />
          <span>
            Select a class and section to load students and mark attendance.
          </span>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;




// import { useEffect, useMemo, useState } from "react";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import {
//     getTeacherClasses,
//     getTeacherStudents,
//     markTeacherAttendance,
// } from "../../services/teacherAttendanceService";

// const StudentAttendance = () => {
//     // ----------------------------------------
//     // State
//     // ----------------------------------------

//     const [selectedClassId, setSelectedClassId] = useState("");
//     const [selectedSectionId, setSelectedSectionId] = useState("");

//     const [attendanceDate, setAttendanceDate] = useState(
//         new Date().toISOString().split("T")[0]
//     );

//     const [attendance, setAttendance] = useState({});

//     const [successMessage, setSuccessMessage] = useState("");
//     const [errorMessage, setErrorMessage] = useState("");

//     // ----------------------------------------
//     // Get teacher's assigned classes
//     // ----------------------------------------

//     const {
//         data: classes = [],
//         isLoading: classesLoading,
//         isError: classesError,
//     } = useQuery({
//         queryKey: ["teacher-classes"],
//         queryFn: getTeacherClasses,
//     });
//     console.log("classes", classes);

//     // ----------------------------------------
//     // Selected class
//     // ----------------------------------------

//     const selectedClass = useMemo(() => {
//         return classes.find(
//             (item) => item._id === selectedClassId
//         );
//     }, [classes, selectedClassId]);

//     // ----------------------------------------
//     // Sections of selected class
//     // ----------------------------------------

//     const sections = selectedClass?.sections || [];

//     // ----------------------------------------
//     // Get students
//     // ----------------------------------------

//     const {
//         data: students = [],
//         isLoading: studentsLoading,
//         isError: studentsError,
//     } = useQuery({
//         queryKey: [
//             "teacher-students",
//             selectedSectionId,
//         ],
//         queryFn: () =>
//             getTeacherStudents(selectedSectionId),
//         enabled: Boolean(selectedSectionId),
//     });
//     console.log("students", students);

//     // ----------------------------------------
//     // Set default attendance
//     // ----------------------------------------

//     useEffect(() => {
//         if (!students.length) {
//             setAttendance({});
//             return;
//         }

//         const initialAttendance = {};

//         students.forEach((student) => {
//             initialAttendance[student._id] = "present";
//         });

//         setAttendance(initialAttendance);
//     }, [students]);

//     // ----------------------------------------
//     // Select class
//     // ----------------------------------------

//     const handleClassChange = (event) => {
//         const classId = event.target.value;

//         setSelectedClassId(classId);
//         setSelectedSectionId("");

//         setAttendance({});
//         setSuccessMessage("");
//         setErrorMessage("");
//     };

//     // ----------------------------------------
//     // Select section
//     // ----------------------------------------

//     const handleSectionChange = (event) => {
//         const sectionId = event.target.value;

//         setSelectedSectionId(sectionId);

//         setAttendance({});
//         setSuccessMessage("");
//         setErrorMessage("");
//     };

//     // ----------------------------------------
//     // Change attendance
//     // ----------------------------------------

//     const handleAttendanceChange = (
//         studentId,
//         status
//     ) => {
//         setAttendance((previous) => ({
//             ...previous,
//             [studentId]: status,
//         }));

//         setSuccessMessage("");
//         setErrorMessage("");
//     };

//     // ----------------------------------------
//     // Mutation
//     // ----------------------------------------

//     const attendanceMutation = useMutation({
//         mutationFn: markTeacherAttendance,

//         onSuccess: (response) => {
//             setSuccessMessage(
//                 response.message ||
//                 "Attendance marked successfully."
//             );

//             setErrorMessage("");
//         },

//         onError: (error) => {
//             setErrorMessage(
//                 error.response?.data?.message ||
//                 "Failed to mark attendance."
//             );

//             setSuccessMessage("");
//         },
//     });

//     // ----------------------------------------
//     // Submit attendance
//     // ----------------------------------------

//     const handleSubmit = (event) => {
//         event.preventDefault();

//         setSuccessMessage("");
//         setErrorMessage("");

//         if (!selectedSectionId) {
//             setErrorMessage(
//                 "Please select a section."
//             );

//             return;
//         }

//         if (!attendanceDate) {
//             setErrorMessage(
//                 "Please select an attendance date."
//             );

//             return;
//         }

//         if (!students.length) {
//             setErrorMessage(
//                 "No students found for this section."
//             );

//             return;
//         }

//         const attendanceRecords = students.map(
//             (student) => ({
//                 student_id: student._id,
//                 status:
//                     attendance[student._id] ||
//                     "present",
//             })
//         );

//         attendanceMutation.mutate({
//             section_id: selectedSectionId,
//             date: attendanceDate,
//             attendance: attendanceRecords,
//         });
//     };

//     // ----------------------------------------
//     // Mark all present
//     // ----------------------------------------

//     const handleMarkAllPresent = () => {
//         const updatedAttendance = {};

//         students.forEach((student) => {
//             updatedAttendance[student._id] =
//                 "present";
//         });

//         setAttendance(updatedAttendance);
//     };

//     // ----------------------------------------
//     // Mark all absent
//     // ----------------------------------------

//     const handleMarkAllAbsent = () => {
//         const updatedAttendance = {};

//         students.forEach((student) => {
//             updatedAttendance[student._id] =
//                 "absent";
//         });

//         setAttendance(updatedAttendance);
//     };

//     // ----------------------------------------
//     // Counts
//     // ----------------------------------------

//     const presentCount = students.filter(
//         (student) =>
//             attendance[student._id] === "present"
//     ).length;

//     const absentCount = students.filter(
//         (student) =>
//             attendance[student._id] === "absent"
//     ).length;

//     const lateCount = students.filter(
//         (student) =>
//             attendance[student._id] === "late"
//     ).length;

//     // ----------------------------------------
//     // Loading classes
//     // ----------------------------------------

//     if (classesLoading) {
//         return (
//             <div className="flex min-h-[400px] items-center justify-center">
//                 <span className="loading loading-spinner loading-lg" />
//             </div>
//         );
//     }

//     // ----------------------------------------
//     // Classes error
//     // ----------------------------------------

//     if (classesError) {
//         return (
//             <div className="p-6">
//                 <div className="alert alert-error">
//                     <span>
//                         Failed to load your assigned
//                         classes.
//                     </span>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-4 md:p-6">

//             {/* -------------------------------- */}
//             {/* Header */}
//             {/* -------------------------------- */}

//             <div className="mb-6">
//                 <h1 className="text-2xl font-bold">
//                     Student Attendance
//                 </h1>

//                 <p className="mt-1 text-sm text-base-content/60">
//                     Mark attendance for your assigned
//                     students.
//                 </p>
//             </div>

//             {/* -------------------------------- */}
//             {/* Messages */}
//             {/* -------------------------------- */}

//             {successMessage && (
//                 <div className="alert alert-success mb-4">
//                     <span>
//                         {successMessage}
//                     </span>
//                 </div>
//             )}

//             {errorMessage && (
//                 <div className="alert alert-error mb-4">
//                     <span>
//                         {errorMessage}
//                     </span>
//                 </div>
//             )}

//             {/* -------------------------------- */}
//             {/* Selection Card */}
//             {/* -------------------------------- */}

//             <div className="card bg-base-100 shadow-md">
//                 <div className="card-body">

//                     <h2 className="card-title mb-4">
//                         Attendance Information
//                     </h2>

//                     <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

//                         {/* Class */}

//                         <div className="form-control">
//                             <label className="label">
//                                 <span className="label-text font-medium">
//                                     Class
//                                 </span>
//                             </label>

//                             <select
//                                 className="select select-bordered w-full"
//                                 value={selectedClassId}
//                                 onChange={
//                                     handleClassChange
//                                 }
//                             >
//                                 <option value="">
//                                     Select Class
//                                 </option>

//                                 {classes.map((item) => (
//                                     <option
//                                         key={item._id}
//                                         value={item._id}
//                                     >
//                                         {item.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Section */}

//                         <div className="form-control">
//                             <label className="label">
//                                 <span className="label-text font-medium">
//                                     Section
//                                 </span>
//                             </label>

//                             <select
//                                 className="select select-bordered w-full"
//                                 value={
//                                     selectedSectionId
//                                 }
//                                 onChange={
//                                     handleSectionChange
//                                 }
//                                 disabled={
//                                     !selectedClassId
//                                 }
//                             >
//                                 <option value="">
//                                     Select Section
//                                 </option>

//                                 {sections.map(
//                                     (section) => (
//                                         <option
//                                             key={
//                                                 section._id
//                                             }
//                                             value={
//                                                 section._id
//                                             }
//                                         >
//                                             {section.name}
//                                         </option>
//                                     )
//                                 )}
//                             </select>
//                         </div>

//                         {/* Date */}

//                         <div className="form-control">
//                             <label className="label">
//                                 <span className="label-text font-medium">
//                                     Date
//                                 </span>
//                             </label>

//                             <input
//                                 type="date"
//                                 className="input input-bordered w-full"
//                                 value={attendanceDate}
//                                 onChange={(event) =>
//                                     setAttendanceDate(
//                                         event.target
//                                             .value
//                                     )
//                                 }
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* -------------------------------- */}
//             {/* Student Attendance */}
//             {/* -------------------------------- */}

//             {selectedSectionId && (
//                 <div className="card mt-6 bg-base-100 shadow-md">

//                     <div className="card-body">

//                         {/* Top */}

//                         <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

//                             <div>
//                                 <h2 className="card-title">
//                                     Students
//                                 </h2>

//                                 <p className="text-sm text-base-content/60">
//                                     Total Students:{" "}
//                                     {students.length}
//                                 </p>
//                             </div>

//                             <div className="flex gap-2">

//                                 <button
//                                     type="button"
//                                     className="btn btn-success btn-sm"
//                                     onClick={
//                                         handleMarkAllPresent
//                                     }
//                                     disabled={
//                                         !students.length
//                                     }
//                                 >
//                                     All Present
//                                 </button>

//                                 <button
//                                     type="button"
//                                     className="btn btn-error btn-sm"
//                                     onClick={
//                                         handleMarkAllAbsent
//                                     }
//                                     disabled={
//                                         !students.length
//                                     }
//                                 >
//                                     All Absent
//                                 </button>

//                             </div>
//                         </div>

//                         {/* Statistics */}

//                         {students.length > 0 && (
//                             <div className="my-4 grid grid-cols-3 gap-3">

//                                 <div className="rounded-lg bg-success/10 p-3 text-center">
//                                     <div className="text-2xl font-bold text-success">
//                                         {presentCount}
//                                     </div>

//                                     <div className="text-sm">
//                                         Present
//                                     </div>
//                                 </div>

//                                 <div className="rounded-lg bg-error/10 p-3 text-center">
//                                     <div className="text-2xl font-bold text-error">
//                                         {absentCount}
//                                     </div>

//                                     <div className="text-sm">
//                                         Absent
//                                     </div>
//                                 </div>

//                                 <div className="rounded-lg bg-warning/10 p-3 text-center">
//                                     <div className="text-2xl font-bold text-warning">
//                                         {lateCount}
//                                     </div>

//                                     <div className="text-sm">
//                                         Late
//                                     </div>
//                                 </div>

//                             </div>
//                         )}

//                         {/* Student Loading */}

//                         {studentsLoading && (
//                             <div className="flex justify-center py-10">
//                                 <span className="loading loading-spinner loading-lg" />
//                             </div>
//                         )}

//                         {/* Student Error */}

//                         {studentsError && (
//                             <div className="alert alert-error">
//                                 <span>
//                                     Failed to load students.
//                                 </span>
//                             </div>
//                         )}

//                         {/* No Students */}

//                         {!studentsLoading &&
//                             !studentsError &&
//                             students.length === 0 && (
//                                 <div className="py-10 text-center">
//                                     <p className="text-base-content/60">
//                                         No students found
//                                         in this section.
//                                     </p>
//                                 </div>
//                             )}

//                         {/* Students Table */}

//                         {!studentsLoading &&
//                             students.length > 0 && (
//                                 <form
//                                     onSubmit={
//                                         handleSubmit
//                                     }
//                                 >
//                                     <div className="overflow-x-auto">

//                                         <table className="table">

//                                             <thead>
//                                                 <tr>
//                                                     <th>
//                                                         #
//                                                     </th>

//                                                     <th>
//                                                         Student
//                                                     </th>

//                                                     <th>
//                                                         Student ID
//                                                     </th>

//                                                     <th>
//                                                         Roll
//                                                     </th>

//                                                     <th>
//                                                         Attendance
//                                                     </th>
//                                                 </tr>
//                                             </thead>

//                                             <tbody>

//                                                 {students.map(
//                                                     (
//                                                         student,
//                                                         index
//                                                     ) => (
//                                                         <tr
//                                                             key={
//                                                                 student._id
//                                                             }
//                                                         >

//                                                             <td>
//                                                                 {index +
//                                                                     1}
//                                                             </td>

//                                                             <td>
//                                                                 <div className="font-medium">
//                                                                     {
//                                                                         student.first_name
//                                                                     }{" "}
//                                                                     {
//                                                                         student.last_name
//                                                                     }
//                                                                 </div>

//                                                                 {student.email && (
//                                                                     <div className="text-xs text-base-content/50">
//                                                                         {
//                                                                             student.email
//                                                                         }
//                                                                     </div>
//                                                                 )}
//                                                             </td>

//                                                             <td>
//                                                                 {
//                                                                     student.student_id
//                                                                 }
//                                                             </td>

//                                                             <td>
//                                                                 {
//                                                                     student.roll_number
//                                                                 }
//                                                             </td>

//                                                             <td>

//                                                                 <div className="flex flex-wrap gap-2">

//                                                                     {/* Present */}

//                                                                     <label className="cursor-pointer">
//                                                                         <input
//                                                                             type="radio"
//                                                                             name={`attendance-${student._id}`}
//                                                                             className="radio radio-success"
//                                                                             checked={
//                                                                                 attendance[
//                                                                                 student
//                                                                                     ._id
//                                                                                 ] ===
//                                                                                 "present"
//                                                                             }
//                                                                             onChange={() =>
//                                                                                 handleAttendanceChange(
//                                                                                     student._id,
//                                                                                     "present"
//                                                                                 )
//                                                                             }
//                                                                         />

//                                                                         <span className="ml-2">
//                                                                             Present
//                                                                         </span>
//                                                                     </label>

//                                                                     {/* Absent */}

//                                                                     <label className="cursor-pointer">
//                                                                         <input
//                                                                             type="radio"
//                                                                             name={`attendance-${student._id}`}
//                                                                             className="radio radio-error"
//                                                                             checked={
//                                                                                 attendance[
//                                                                                 student
//                                                                                     ._id
//                                                                                 ] ===
//                                                                                 "absent"
//                                                                             }
//                                                                             onChange={() =>
//                                                                                 handleAttendanceChange(
//                                                                                     student._id,
//                                                                                     "absent"
//                                                                                 )
//                                                                             }
//                                                                         />

//                                                                         <span className="ml-2">
//                                                                             Absent
//                                                                         </span>
//                                                                     </label>

//                                                                     {/* Late */}

//                                                                     <label className="cursor-pointer">
//                                                                         <input
//                                                                             type="radio"
//                                                                             name={`attendance-${student._id}`}
//                                                                             className="radio radio-warning"
//                                                                             checked={
//                                                                                 attendance[
//                                                                                 student
//                                                                                     ._id
//                                                                                 ] ===
//                                                                                 "late"
//                                                                             }
//                                                                             onChange={() =>
//                                                                                 handleAttendanceChange(
//                                                                                     student._id,
//                                                                                     "late"
//                                                                                 )
//                                                                             }
//                                                                         />

//                                                                         <span className="ml-2">
//                                                                             Late
//                                                                         </span>
//                                                                     </label>

//                                                                 </div>

//                                                             </td>

//                                                         </tr>
//                                                     )
//                                                 )}

//                                             </tbody>

//                                         </table>

//                                     </div>

//                                     {/* Submit */}

//                                     <div className="mt-6 flex justify-end">

//                                         <button
//                                             type="submit"
//                                             className="btn btn-primary"
//                                             disabled={
//                                                 attendanceMutation.isPending
//                                             }
//                                         >
//                                             {attendanceMutation.isPending ? (
//                                                 <>
//                                                     <span className="loading loading-spinner loading-sm" />

//                                                     Saving...
//                                                 </>
//                                             ) : (
//                                                 "Save Attendance"
//                                             )}
//                                         </button>

//                                     </div>

//                                 </form>
//                             )}

//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// };

// export default StudentAttendance;