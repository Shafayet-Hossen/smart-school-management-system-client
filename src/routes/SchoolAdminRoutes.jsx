// import { Routes, Route, Navigate } from "react-router-dom";
// import SchoolAdminLayout from "../layouts/SchoolAdminLayout";

// import FeeManagementLayout from "../components/schoolAdmin/FeeManagementLayout";

// import FeeDashboard from "../pages/schoolAdmin/fees/FeeDashboard";
// import FeeCategories from "../pages/schoolAdmin/fees/FeeCategories";
// import FeeStructures from "../pages/schoolAdmin/fees/FeeStructures";
// import AssignFees from "../pages/schoolAdmin/fees/AssignFees";
// import StudentFeeManagement from "../pages/schoolAdmin/fees/StudentFeeManagement";
// import CollectPayment from "../pages/schoolAdmin/fees/CollectPayment";
// import PaymentHistory from "../pages/schoolAdmin/fees/PaymentHistory";
// import OutstandingDues from "../pages/schoolAdmin/fees/OutstandingDues";
// import FeeReminders from "../pages/schoolAdmin/fees/FeeReminders";
// import StripeSettings from "../pages/schoolAdmin/fees/StripeSettings";
// import FeeReports from "../pages/schoolAdmin/fees/FeeReports";
// import ProtectedRoute from "./ProtectedRoute";
// import RoleGuard from "../components/RoleGuard";
// import { useAuth } from "../context/AuthContext";

// const SchoolAdminRoutes = () => {

//     const { user } = useAuth();

//     return (
//         <Routes>
//             <Route
//                 element={
//                     <ProtectedRoute>
//                         <RoleGuard
//                             allowedRoles={["school_admin"]}
//                             userRole={user?.role}
//                             fallback={<Navigate to="/unauthorized" replace />}
//                         >
//                             <SchoolAdminLayout />
//                         </RoleGuard>
//                     </ProtectedRoute>
//                 }
//             >
//                 <Route
//                     path="/student-fees"
//                     element={<FeeManagementLayout />}
//                 >
//                     <Route
//                         index
//                         element={<Navigate to="dashboard" replace />}
//                     />

//                     <Route path="dashboard" element={<FeeDashboard />} />
//                     <Route path="categories" element={<FeeCategories />} />
//                     <Route path="structures" element={<FeeStructures />} />
//                     <Route path="assign" element={<AssignFees />} />
//                     <Route path="records" element={<StudentFeeManagement />} />
//                     <Route path="collect" element={<CollectPayment />} />
//                     <Route path="payments" element={<PaymentHistory />} />
//                     <Route path="due" element={<OutstandingDues />} />
//                     <Route path="reminders" element={<FeeReminders />} />
//                     <Route path="stripe-settings" element={<StripeSettings />} />
//                     <Route path="reports" element={<FeeReports />} />
//                 </Route>
//             </Route>
//         </Routes >
//     );
// };

// export default SchoolAdminRoutes;