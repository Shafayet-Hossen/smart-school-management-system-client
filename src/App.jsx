import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import JwtTest from "./pages/JwtTest.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
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
import RegistrationBranch from "./components/Register/RegistrationBranch.jsx"
import SchoolAdminSchool from "./components/Register/SchoolAdminSchool.jsx";
import TeacherSchool from "./components/Register/TeacherSchool.jsx";
import StudentSchool from "./components/Register/StudentSchool.jsx";
import ParentSchool from "./components/Register/ParentSchool.jsx";
import AccountCredentials from "./components/Register/AccountCredentials.jsx";
import EmailVerification from "./components/Register/EmailVerification.jsx";
import RegistrationComplete from "./components/Register/RegistrationComplete.jsx";


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

        {/* Registration Routes */}
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/register/role"
          element={<RoleSelection />}
        />
        {/* <Route
          path="/register/:role/school"
          element={<PersonalInformation />}
        /> */}
        <Route
          path="/register/:role"
          element={<PersonalInformation />}
        />
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

        {/* <Route
          path="/register/school_admin/verify"
          element={<EmailVerification />}
        />

        <Route
          path="/register/school_admin/complete"
          element={<RegistrationComplete />}
        /> */}

        <Route
          path="/register/teacher/school"
          element={<TeacherSchool />}
        />
        <Route
          path="/register/student/school"
          element={<StudentSchool />}
        />
        <Route
          path="/register/parent/school"
          element={<ParentSchool />}
        />



        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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