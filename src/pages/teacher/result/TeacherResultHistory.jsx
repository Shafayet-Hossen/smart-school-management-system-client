// import { useQuery } from "@tanstack/react-query";
// import { getTeacherResultHistory } from "../../../services/teacherResultService";

// const TeacherResultHistory = () => {
//     const { data, isLoading, isError, error } = useQuery({
//         queryKey: ["teacher-result-history"],
//         queryFn: () => getTeacherResultHistory(),
//     });

//     const results = Array.isArray(data?.results)
//         ? data.results
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
//                     "Unable to load result history."}
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-5">
//             <div>
//                 <h2 className="text-2xl font-bold">
//                     Result History
//                 </h2>
//                 <p className="text-base-content/60 mt-1">
//                     View examination results that have been approved or
//                     published.
//                 </p>
//             </div>

//             <div className="card bg-base-100 shadow-sm">
//                 <div className="card-body p-3 md:p-6">
//                     {results.length === 0 ? (
//                         <div className="alert">
//                             No approved or published results found.
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
//                                         <th>Total Students</th>
//                                         <th>Approved At</th>
//                                         <th>Status</th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {results.map((item) => (
//                                         <tr key={item._id}>
//                                             <td>{item.exam_name || "—"}</td>
//                                             <td>{item.subject_name || "—"}</td>
//                                             <td>{item.class_name || "—"}</td>
//                                             <td>{item.section_name || "—"}</td>
//                                             <td>{item.total_students ?? 0}</td>
//                                             <td>
//                                                 {item.approved_at
//                                                     ? new Date(
//                                                         item.approved_at
//                                                     ).toLocaleDateString()
//                                                     : "—"}
//                                             </td>
//                                             <td>
//                                                 <span
//                                                     className={`badge ${
//                                                         item.status === "published"
//                                                             ? "badge-success"
//                                                             : "badge-info"
//                                                     }`}
//                                                 >
//                                                     {item.status}
//                                                 </span>
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

// export default TeacherResultHistory;