// import { useQuery } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
// import { getTeacherResultDashboard } from "../../../services/teacherResultService";

// const TeacherResultDashboard = () => {
//     const { data, isLoading, isError, error } = useQuery({
//         queryKey: ["teacher-result-dashboard"],
//         queryFn: getTeacherResultDashboard,
//     });
//     // console.log("result dashboard",data.summary);
//     const summary = data?.summary || {};

//     const statistics = [
//         {
//             label: "Available Exams",
//             value: summary.total_exams ?? 0,
//             color: "text-primary",
//         },
//         {
//             label: "Draft Results",
//             value: summary.draft_count ?? 0,
//             color: "text-warning",
//         },
//         {
//             label: "Pending Approval",
//             value: summary.pending_count ?? 0,
//             color: "text-info",
//         },
//         {
//             label: "Rejected Results",
//             value: summary.rejected_count ?? 0,
//             color: "text-error",
//         },
//         {
//             label: "Approved Results",
//             value: summary.approved_count ?? 0,
//             color: "text-success",
//         },
//         {
//             label: "Published Results",
//             value: summary.published_count ?? 0,
//             color: "text-secondary",
//         },
//     ];

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
//                     "Unable to load result dashboard."}
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             <div>
//                 <h2 className="text-2xl font-bold">
//                     Result Dashboard
//                 </h2>
//                 <p className="text-base-content/60 mt-1">
//                     Manage examination marks and track approval status.
//                 </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//                 {statistics.map((item) => (
//                     <div
//                         key={item.label}
//                         className="card bg-base-100 shadow-sm"
//                     >
//                         <div className="card-body">
//                             <p className="text-sm text-base-content/60">
//                                 {item.label}
//                             </p>
//                             <h3 className={`text-3xl font-bold ${item.color}`}>
//                                 {item.value}
//                             </h3>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             <div className="card bg-base-100 shadow-sm">
//                 <div className="card-body">
//                     <h3 className="card-title">
//                         Result Management
//                     </h3>

//                     <p className="text-base-content/70">
//                         Select an examination to enter marks for your
//                         assigned students and subjects.
//                     </p>

//                     <div className="card-actions mt-3">
//                         <Link
//                             to="/teacher-results/exams"
//                             className="btn btn-primary"
//                         >
//                             View Examinations
//                         </Link>

//                         <Link
//                             to="/teacher-results/submissions"
//                             className="btn btn-outline"
//                         >
//                             View Submissions
//                         </Link>
//                     </div>
//                 </div>
//             </div>

//             <div className="alert alert-info">
//                 <span>
//                     Only the School Admin can approve and publish official
//                     examination results.
//                 </span>
//             </div>
//         </div>
//     );
// };

// export default TeacherResultDashboard;