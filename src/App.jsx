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

import ParentDashboard from "./pages/parent/parentDashboard.jsx";
import Home from "./pages/Home.jsx";
import SubscriptionPlans from "./pages/SubscriptionPlans.jsx";
import RoleSelection from "./components/Register/RoleSelection.jsx";
import PersonalInformation from "./components/Register/PersonalInformation.jsx";

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
import Profile from "./pages/profiles/Profile.jsx";
import Teachers from "./pages/dashboard/teachers/Teachers.jsx";
import AddTeacher from "./pages/dashboard/teachers/AddTeacher.jsx";
import ViewTeacher from "./pages/dashboard/teachers/ViewTeacher.jsx";
import EditTeacher from "./pages/dashboard/teachers/EditTeacher.jsx";
import AddClass from "./pages/dashboard/classes/AddClass.jsx";
import Classes from "./pages/dashboard/classes/Classes.jsx";
import AddStudent from "./pages/dashboard/students/AddStudent.jsx";
import Students from "./pages/dashboard/students/Students.jsx";
import EditStudent from "./pages/dashboard/students/EditStudent.jsx";
import AddParent from "./pages/dashboard/parents/AddParent.jsx";
import Parents from "./pages/dashboard/parents/Parents.jsx";
import ViewParent from "./pages/dashboard/parents/ViewParent.jsx";
import Attendance from "./pages/dashboard/attendance/Attendance.jsx";
import MyStudents from "./pages/teacher/MyStudents.jsx";
import Assignments from "./pages/dashboard/teachers/Assignments.jsx";
import CreateAssignment from "./pages/dashboard/teachers/CreateAssignment.jsx";
import MyClasses from "./pages/dashboard/classes/MyClasses.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import StudentDashboard from "./pages/dashboard/StudentDashboard.jsx";



function App() {

  const { user } = useAuth();

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
              <RoleGuard
                allowedRoles={["school_admin"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <TeacherRequests />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/parents"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["school_admin"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <ParentRequests />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/students"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["school_admin"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <StudentRequests />
              </RoleGuard>
            </ProtectedRoute>
          }
        />


        {/* Accout Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Add Teachers */}
        <Route
          path="/teachers/add"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["school_admin"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <AddTeacher />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        {/* Get Teachers */}
        <Route
          path="/teachers"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["school_admin",]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <Teachers />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        {/* View Teacher */}
        <Route
          path="/teachers/:teacherId"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["school_admin"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <ViewTeacher />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        {/* Edit Teacher */}
        <Route
          path="/teachers/:teacherId/edit"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["school_admin"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <EditTeacher />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Class Routes */}
        <Route
          path="/classes/add"
          element={
            <ProtectedRoute >
              <RoleGuard
                allowedRoles={["school_admin"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <AddClass />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        {/* Get Classes */}
        <Route
          path="/classes"
          element={
            <ProtectedRoute>
              <Classes />
            </ProtectedRoute>
          }
        />
        {/* add Student */}
        <Route
          path="/students/add"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["school_admin"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <AddStudent />
              </RoleGuard>
              <AddStudent />
            </ProtectedRoute>
          }
        />
        {/* View Students */}
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["school_admin"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <Students />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        {/* Edit Student */}
        <Route
          path="/students/:studentId/edit"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["school_admin"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <EditStudent />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* teacher Classes */}
        <Route
          path="/my-classes"
          element={
            <ProtectedRoute>
                <MyClasses />
            </ProtectedRoute>
          }
        />
        {/* teacher Students */}
        <Route
          path="/my-students"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["teacher"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <MyStudents />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        {/* Create Assignment */}
        <Route
          path="/assignments/create"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["teacher"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <CreateAssignment />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        {/* Teacher Assignments */}
        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <Assignments />
            </ProtectedRoute>
          }
        />

        {/* add parent */}
        <Route
          path="/parents/add"
          element={
            <ProtectedRoute>
              <AddParent />
            </ProtectedRoute>
          }
        />
        {/* View Parents */}
        <Route
          path="/parents"
          element={
            <ProtectedRoute>
              <Parents />
            </ProtectedRoute>
          }
        />
        {/*View parent details */}
        <Route
          path="/parents/:parentId"
          element={
            <ProtectedRoute>
              <ViewParent />
            </ProtectedRoute>
          }
        />

        {/* Attendance Dashboard */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />


        {/* <Route
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
        ></Route> */}

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