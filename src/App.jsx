import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import JwtTest from "./pages/JwtTest.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Register from "./pages/Register.jsx";
import RoleGuard from "./components/RoleGuard.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import AttendanceDashboard from "./pages/admin/AttendanceDashboard.jsx";
import ROLES from "./constants/Roles.js";
import ParentDashboard from "./pages/parent/parentDashboard.jsx";
import Home from "./pages/Home.jsx";
import SubscriptionPlans from "./pages/SubscriptionPlans.jsx";
import RoleSelection from "./components/Register/RoleSelection.jsx";
import PersonalInformation from "./components/Register/PersonalInformation.jsx";
// import RegistrationBranch from "./components/Register/RegistrationBranch.jsx"
import SchoolAdminSchool from "./components/Register/SchoolAdminSchool.jsx";
import TeacherSchool from "./components/Register/TeacherSchool.jsx";
import StudentSchool from "./components/Register/StudentSchool.jsx";
import ParentSchool from "./components/Register/ParentSchool.jsx";
import AccountCredentials from "./components/Register/AccountCredentials.jsx";
import EmailVerification from "./components/Register/EmailVerification.jsx";
import RegistrationComplete from "./components/Register/RegistrationComplete.jsx";
import TeacherAccount from "./components/Register/TeacherAccount.jsx";
import TeacherVerify from "./components/Register/TeacherVerify.jsx";
import TeacherComplete from "./components/Register/TeacherComplete.jsx";
import StudentAcademic from "./components/Register/StudentAcademic.jsx";
import StudentAccount from "./components/Register/StudentAccout.jsx";
import StudentVerify from "./components/Register/StudentVerify.jsx";
import StudentComplete from "./components/Register/StudentComplete.jsx";
import ParentAcademic from "./components/Register/ParentAcademic.jsx";
import ParentAccount from "./components/Register/ParentAccount.jsx";
import ParentVerify from "./components/Register/ParentVerify.jsx";
import ParentComplete from "./components/Register/ParentComplete.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import TeacherRequests from "./pages/requests/TeacherRequests.jsx";
import ParentRequests from "./pages/requests/parentRequests.jsx";
import StudentRequests from "./pages/requests/studentRequests.jsx";

function App() {
  const { user } = useAuth();
  // console.log("app:", user);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home />
          }
        />
        <Route
          path="/pricing"
          element={
            <SubscriptionPlans />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* Registration Common Routes */}
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/register/role"
          element={<RoleSelection />}
        />
        <Route
          path="/register/:role"
          element={<PersonalInformation />}
        />

        {/* School_Admin Registration Routes */}
        <Route
          path="/register/school_admin/school"
          element={<SchoolAdminSchool />}
        />
        <Route
          path="/register/school_admin/account"
          element={<AccountCredentials />}
        />
        <Route
          path="/register/school_admin/verify"
          element={<EmailVerification />}
        />
        <Route
          path="/register/school_admin/complete"
          element={<RegistrationComplete />}
        />

        {/* Teacher Registration Routes */}
        <Route
          path="/register/teacher/school"
          element={<TeacherSchool />}
        />
        <Route
          path="/register/teacher/account"
          element={<TeacherAccount />}
        />
        <Route
          path="/register/teacher/verify"
          element={<TeacherVerify />}
        />
        <Route
          path="/register/teacher/complete"
          element={<TeacherComplete />}
        />


        {/* Students Registration Routes */}
        <Route
          path="/register/student/school"
          element={<StudentSchool />}
        />
        <Route
          path="/register/student/academic"
          element={<StudentAcademic />}
        />
        <Route
          path="/register/student/account"
          element={<StudentAccount />}
        />
        <Route
          path="/register/student/verify"
          element={<StudentVerify />}
        />
        <Route
          path="/register/student/complete"
          element={<StudentComplete />}
        />


        {/* Parents Registration Routes */}
        <Route
          path="/register/parent/school"
          element={<ParentSchool />}
        />
        <Route
          path="/register/parent/academic"
          element={<ParentAcademic />}
        />
        <Route
          path="/register/parent/account"
          element={<ParentAccount />}
        />
        <Route
          path="/register/parent/verify"
          element={<ParentVerify />}
        />
        <Route
          path="/register/parent/complete"
          element={<ParentComplete />}
        />


        {/* Dashboard Role based */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/teachers"
          element={
            <ProtectedRoute>
              <TeacherRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/parents"
          element={
            <ProtectedRoute>
              <ParentRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/students"
          element={
            <ProtectedRoute>
              <StudentRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/attendance"
          element={
            <RoleGuard
              allowedRoles={[
                ROLES.SCHOOL_ADMIN,
              ]}
              userRole={user?.role}
            >
              <AttendanceDashboard></AttendanceDashboard>
            </RoleGuard>
          }
        ></Route>

        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["student"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <StudentDashboard></StudentDashboard>
              </RoleGuard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path="/parent/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["parent"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <ParentDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/jwt-test"
          element={
            <ProtectedRoute>
              <JwtTest />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Login />}
        />



      </Routes>
    </BrowserRouter>
  );
}

export default App;