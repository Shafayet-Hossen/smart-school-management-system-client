// import { useQuery } from "@tanstack/react-query";
// import { getTeacherResultSubmissions } from "../../../services/teacherResultService";

// const statusClass = {
//     draft: "badge-warning",
//     submitted: "badge-info",
//     rejected: "badge-error",
//     approved: "badge-success",
//     published: "badge-secondary",
// };

// const TeacherResultSubmissions = () => {
//     const { data, isLoading, isError, error } = useQuery({
//         queryKey: ["teacher-result-submissions"],
//         queryFn: () => getTeacherResultSubmissions(),
//     });

//     const submissions = Array.isArray(data?.submissions)
//         ? data.submissions
//         : [];

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
//                     "Unable to load submissions."}
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-5">
//             <div>
//                 <h2 className="text-2xl font-bold">
//                     Result Submissions
//                 </h2>
//                 <p className="text-base-content/60 mt-1">
//                     Track your submitted examination marks and approval status.
//                 </p>
//             </div>

//             <div className="card bg-base-100 shadow-sm">
//                 <div className="card-body p-3 md:p-6">
//                     {submissions.length === 0 ? (
//                         <div className="alert">
//                             You have not submitted any examination marks yet.
//                         </div>
//                     ) : (
//                         <div className="overflow-x-auto">
//                             <table className="table table-zebra">
//                                 <thead>
//                                     <tr>
//                                         <th>Exam</th>
//                                         <th>Subject</th>
//                                         <th>Class</th>
//                                         <th>Section</th>
//                                         <th>Submitted At</th>
//                                         <th>Status</th>
//                                         <th>Admin Feedback</th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {submissions.map((item) => (
//                                         <tr key={item._id}>
//                                             <td>{item.exam_name || "—"}</td>
//                                             <td>{item.subject_name || "—"}</td>
//                                             <td>{item.class_name || "—"}</td>
//                                             <td>{item.section_name || "—"}</td>
//                                             <td>
//                                                 {item.submitted_at
//                                                     ? new Date(
//                                                         item.submitted_at
//                                                     ).toLocaleString()
//                                                     : "—"}
//                                             </td>
//                                             <td>
//                                                 <span
//                                                     className={`badge ${
//                                                         statusClass[item.status] ||
//                                                         "badge-ghost"
//                                                     }`}
//                                                 >
//                                                     {item.status || "unknown"}
//                                                 </span>
//                                             </td>
//                                             <td>
//                                                 {item.admin_feedback ||
//                                                     item.rejection_reason ||
//                                                     "—"}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TeacherResultSubmissions;