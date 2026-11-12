import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Register from "./pages/Register.jsx";
import RoleGuard from "./components/RoleGuard.jsx";
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
import MyStudents from "./pages/teacher/MyStudents.jsx";
import Assignments from "./pages/dashboard/teachers/Assignments.jsx";
import MyClasses from "./pages/dashboard/classes/MyClasses.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import EditClass from "./pages/dashboard/classes/EditClass.jsx";
import EditParent from "./pages/dashboard/parents/EditParent.jsx";
import MarkAttendance from "./pages/dashboard/attendance/MarkAttendance.jsx";
import TeacherClasses from "./pages/dashboard/teachers/TeacherClasses.jsx";
import StudentAttendance from "./pages/teacher/StudentAttendance.jsx";
import StudentAttendanceHistory from "./pages/teacher/StudentAttendanceHistory.jsx";
import AdminAttendance from "./pages/dashboard/attendance/AdminAttendance.jsx";
import AssignmentSubmissions from "./pages/dashboard/teachers/AssignmentSubmissions.jsx";
import SchoolAdminSubscription from "./components/Register/SchoolAdminSubscription.jsx";
import SchoolAdminPaymentSuccess from "./components/Register/SchoolAdminPaymentSuccess.jsx";
import MyAttendance from "./pages/student/MyAttendance.jsx";
import Children from "./pages/parent/Children.jsx";
import ChildrenAttendance from "./pages/parent/ChildrenAttendance.jsx";
import MyAssignments from "./pages/student/MyAssignments.jsx";
import ChildrenAssignments from "./pages/parent/ChildrenAssignments.jsx";
import Result from "./pages/admin/Result.jsx";
import Exams from "./pages/admin/Exams.jsx";
import AcademicSubjects from "./pages/admin/AcademicSubjects.jsx";
import ExamDetails from "./pages/admin/ExamDetails.jsx";
import FeeDashboard from "./pages/admin/fee-management/FeeDashboard.jsx";
import FeeCategories from "./pages/admin/fee-management/FeeCategories.jsx";
import FeeStructures from "./pages/admin/fee-management/FeeStructures.jsx";
import AssignFees from "./pages/admin/fee-management/AssignFees.jsx";
import StudentFeeRecords from "./pages/admin/fee-management/StudentFeeRecords.jsx";
import CollectPayment from "./pages/admin/fee-management/CollectPayment.jsx";
import FeePayments from "./pages/admin/fee-management/FeePayments.jsx";
import DueFees from "./pages/admin/fee-management/DueFees.jsx";
import FeeReminders from "./pages/admin/fee-management/FeeReminders.jsx";
import StripeSettings from "./pages/admin/fee-management/StripeSettings.jsx";
import FeeReports from "./pages/admin/fee-management/FeeReports.jsx";
import ParentFeeDashboard from "./pages/parent/fee-management/ParentFeeDashboard.jsx";
import ParentFeeRecords from "./pages/parent/fee-management/ParentFeeRecords.jsx";
import ParentDueFees from "./pages/parent/fee-management/ParentDueFees.jsx";
import ParentFeePayments from "./pages/parent/fee-management/ParentFeePayments.jsx";
import ParentFeeReceipts from "./pages/parent/fee-management/ParentFeeReceipts.jsx";
import ParentPaymentSuccess from "./pages/parent/fee-management/ParentPaymentSuccess.jsx";
import ParentPaymentCancel from "./pages/parent/fee-management/ParentPaymentCancel.jsx";
import StudentFeeDashboard from "./pages/student/fee-management/StudentFeeDashboard.jsx";
import StudentsFeeRecords from "./pages/student/fee-management/StudentsFeeRecords.jsx";
import StudentDueFees from "./pages/student/fee-management/StudentDueFees.jsx";
import StudentFeePayments from "./pages/student/fee-management/StudentFeePayments.jsx";
import StudentFeeReceipts from "./pages/student/fee-management/StudentFeeReceipts.jsx";
import TeacherFeeDashboard from "./pages/teacher/fee-management/TeacherFeeDashboard.jsx";
import TeacherStudentFeeDetails from "./pages/teacher/fee-management/TeacherStudentFeeDetails.jsx";
import TeacherFeePayments from "./pages/teacher/fee-management/TeacherFeePayments.jsx";
import TeacherDueFees from "./pages/teacher/fee-management/TeacherDueFees.jsx";
import TeacherFeeStudents from "./pages/teacher/fee-management/TeacherFeeStudents.jsx";
// import TeacherResultExams from "./pages/teacher/result/TeacherResultExams.jsx";
import MarksEntry from "./pages/teacher/result/MarksEntry.jsx";
// import TeacherResultSubmissions from "./pages/teacher/result/TeacherResultSubmissions.jsx";
// import TeacherResultHistory from "./pages/teacher/result/TeacherResultHistory.jsx";
import TeacherExamDashboard from "./pages/teacher/exam/TeacherExamDashboard.jsx";
import TeacherExamSchedule from "./pages/teacher/exam/TeacherExamSchedule.jsx";
import TeacherUpcomingExams from "./pages/teacher/exam/TeacherUpcomingExams.jsx";
import TeacherCompletedExams from "./pages/teacher/exam/TeacherCompletedExams.jsx";
import TeacherExamDetails from "./pages/teacher/exam/TeacherExamDetails.jsx";

import StudentExamDashboard from "./pages/student/exam-management/StudentExamDashboard.jsx";
import StudentExamSchedule from "./pages/student/exam-management/StudentExamSchedule.jsx";
import StudentUpcomingExams from "./pages/student/exam-management/StudentUpcomingExams.jsx";
import StudentCompletedExams from "./pages/student/exam-management/StudentCompletedExams.jsx";
import StudentExamDetails from "./pages/student/exam-management/StudentExamDetails.jsx";
import ParentExamDashboard from "./pages/parent/exam-management/ParentExamDashboard.jsx";
import ParentExamSchedule from "./pages/parent/exam-management/ParentExamSchedule.jsx";
import ParentUpcomingExams from "./pages/parent/exam-management/ParentUpcomingExams.jsx";
import ParentCompletedExams from "./pages/parent/exam-management/ParentCompletedExams.jsx";
import ParentExamDetails from "./pages/parent/exam-management/ParentExamDetails.jsx";
import StudentResultDashboard from "./pages/student/result-management/StudentResultDashboard.jsx";
import StudentResultList from "./pages/student/result-management/StudentResultList.jsx";
import StudentResultHistory from "./pages/student/result-management/StudentResultHistory.jsx";
import StudentResultDetails from "./pages/student/result-management/StudentResultDetails.jsx";
import SchoolAdminDashboard from "./pages/admin/dashboard/SchoolAdminDashboard.jsx";
import SchoolAdminLayout from "./layouts/school-admin/SchoolAdminLayout.jsx";
import TeacherLayout from "./layouts/teacher/TeacherLayout.jsx";
import ParentLayout from "./layouts/parent/ParentLayout.jsx";
import ParentDashboard from "./pages/parent/dashboard/ParentDashboard.jsx";
import StudentLayout from "./layouts/student/StudentLayout.jsx";
import TeacherDashboard from "./pages/dashboard/teachers/TeacherDashboard.jsx";
import AssignedExaminations from "./pages/teacher/exam/AssignedExaminations.jsx";
import ResultAnalytics from "./pages/teacher/result/ResultAnalytics.jsx";
import ResultsHistory from "./pages/teacher/result/ResultsHistory.jsx";
import ParentResultDashboard from "./pages/parent/result-management/ParentResultDashboard.jsx";
import ParentExaminationResults from "./pages/parent/result-management/ParentExaminationResults.jsx";
import ParentSubjectWiseResults from "./pages/parent/result-management/ParentSubjectWiseResults.jsx";
import ResultList from "./pages/student/result-management/ResultList.jsx";
import AssignmentOverview from "./pages/admin/assignment/AssignmentOverview.jsx";
import AllAssignments from "./pages/admin/assignment/AllAssignments.jsx";
import CreateAssignment from "./pages/admin/assignment/CreateAssignment.jsx";



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
          path="/register/school_admin/school/subscription"
          element={<SchoolAdminSubscription />}
        />

        <Route
          path="/register/school_admin/payment/success"
          element={<SchoolAdminPaymentSuccess />}
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


        {/* School Admin */}
        <Route
          path="/school-admin"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["school_admin"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <SchoolAdminLayout />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />
          <Route
            path="dashboard"
            element={<SchoolAdminDashboard />}
          />

          {/* Add other admin Management pages here */}
          {/*Students */}
          <Route path="students" element={<Students />} />
          <Route path="student-requests" element={<StudentRequests />} />
          <Route path="add-students" element={<AddStudent />} />
          <Route path="students/:studentId/edit" element={<EditStudent />} />

          {/* Teachers */}
          <Route path="teachers" element={<Teachers />} />
          <Route path="teacher-requests" element={<TeacherRequests />} />
          <Route path="add-teachers" element={<AddTeacher />} />
          <Route path="teachers/:teacherId" element={<ViewTeacher />} />
          <Route path="teachers/:teacherId/edit" element={<EditTeacher />} />

          {/* Parents */}
          <Route path="parents" element={<Parents />} />
          <Route path="parent-requests" element={<ParentRequests />} />
          <Route path="add-parents" element={<AddParent />} />
          <Route path="parents/:parentId" element={<ViewParent />} />
          <Route path="parents/:parentId/edit" element={<EditParent />} />

          {/* Classes */}
          <Route path="classes" element={<Classes />} />
          <Route path="add-classes" element={<AddClass />} />
          <Route path="teacher-class-assign" element={<TeacherClasses />} />
          <Route path="classes/:class_id/edit" element={<EditClass />} />

          {/* Subjects */}
          <Route path="subjects" element={<AcademicSubjects />} />

          {/* Profile */}
          <Route path="profile" element={<Profile />} />

          {/* Attendance */}
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="attendance-mark" element={<MarkAttendance />} />

          {/* Examinations */}
          <Route path="examinations" element={<Exams />} />
          {/* <Route path="examinations/create" element={<CreateExam />} /> */}
          <Route path="examinations/:examId" element={<ExamDetails />} />

          {/* Results */}
          <Route path="results" element={<Result />} />

          {/* Fee Management */}
          <Route path="fees-dashboard" element={<FeeDashboard />} />
          <Route path="fees-categories" element={<FeeCategories />} />
          <Route path="fees-structures" element={<FeeStructures />} />
          <Route path="fees-assign" element={<AssignFees />} />
          <Route path="fees-records" element={<StudentFeeRecords />} />
          <Route path="fees-collect" element={<CollectPayment />} />
          <Route path="fees-payments" element={<FeePayments />} />
          <Route path="fees-due" element={<DueFees />} />
          <Route path="fees-reminders" element={<FeeReminders />} />
          <Route path="fees-stripe-settings" element={<StripeSettings />} />
          <Route path="fees-reports" element={<FeeReports />} />

          {/* Assignemnt Management */}
          <Route path="assignment-overview" element={<AssignmentOverview />} />
          <Route path="assignments" element={<AllAssignments />} />
          <Route path="create-assignment" element={<CreateAssignment />} />
          <Route path="assignments/:assignmentId/submissions" element={<AssignmentSubmissions />} />


        </Route>


        {/* Teacher */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["teacher"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <TeacherLayout />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />
          <Route
            path="dashboard"
            element={<TeacherDashboard />} />

          {/* teacher Classes */}
          <Route
            path="my-classes"
            element={<MyClasses />} />

          {/* teacher Students */}
          <Route
            path="my-students"
            element={<MyStudents />} />

          {/* Assignments */}
          <Route
            path="assignments"
            element={<Assignments />} />

          {/* Assignment Submissions */}
          <Route
            path="assignments/:id/submissions"
            element={<AssignmentSubmissions />} />

          {/* Student Attendance */}
          <Route
            path="student-attendance"
            element={<StudentAttendance />} />

          <Route
            path="student-attendance-history"
            element={<StudentAttendanceHistory />} />

          {/* Teacher Fee Management */}
          <Route
            path="fees-dashboard"
            element={<TeacherFeeDashboard />} />

          <Route
            path="fees-students"
            element={<TeacherFeeStudents />} />

          <Route
            path="fees-due"
            element={<TeacherDueFees />} />

          <Route
            path="fees-payments"
            element={<TeacherFeePayments />} />

          <Route
            path="fees-students/:studentId"
            element={<TeacherStudentFeeDetails />} />

          {/* Teacher Result Management */}
          <Route
            path="results-dashboard"
            element={<AssignedExaminations />} />

          <Route
            path="results-history"
            element={<ResultsHistory />} />

          <Route
            path="results/enter-marks/:examId/:sectionId/:subjectId"
            element={<MarksEntry />} />

          {/* <Route
            path="results-submissions"
            element={<TeacherResultSubmissions />} />
           */}
          {/* <Route
            path="results-history"
            element={<TeacherResultHistory />} /> */}

          {/* Teacher Exam Management */}
          <Route
            path="exams-dashboard"
            element={<TeacherExamDashboard />} />

          <Route
            path="exams-schedule"
            element={<TeacherExamSchedule />} />

          <Route
            path="exams-upcoming"
            element={<TeacherUpcomingExams />} />

          <Route
            path="exams-completed"
            element={<TeacherCompletedExams />} />

          <Route
            path="exams/:examId"
            element={<TeacherExamDetails />} />

        </Route>


        {/* Parent */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["parent"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <ParentLayout />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />
          <Route path="dashboard" element={<ParentDashboard />} />

          {/* Children */}
          <Route path="students" element={<Children />} />

          {/* Children Attendance */}
          <Route path="children-attendance" element={<ChildrenAttendance />} />

          {/* Children Assignments */}
          <Route path="children-assignments" element={<ChildrenAssignments />} />

          {/* Children Fee Management */}
          <Route path="fees-dashboard" element={<ParentFeeDashboard />} />
          <Route path="fees-records" element={<ParentFeeRecords />}
          />
          <Route path="fees-due" element={<ParentDueFees />}
          />
          <Route path="fees-payments" element={<ParentFeePayments />}
          />
          <Route path="fees-receipts" element={<ParentFeeReceipts />}
          />
          <Route path="fees-payment-success" element={<ParentPaymentSuccess />}
          />
          <Route path="fees-payment-cancel" element={<ParentPaymentCancel />}
          />

          {/* Children Exam Management */}
          <Route path="exams" element={<ParentExamDashboard />} />
          <Route path="exams-schedule" element={<ParentExamSchedule />} />
          <Route path="exams-upcoming" element={<ParentUpcomingExams />} />
          <Route path="exams-completed" element={<ParentCompletedExams />} />
          <Route path="exams/:examId" element={<ParentExamDetails />} />

          {/* Children Result Management */}
          <Route path="results" element={<ParentResultDashboard />} />
          <Route
            path="examination-results"
            element={<ParentExaminationResults />}
          />
          <Route
            path="results-subject-wise"
            element={<ParentSubjectWiseResults />}
          />

        </Route>


        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <RoleGuard
                allowedRoles={["student"]}
                userRole={user?.role}
                fallback={<Navigate to="/unauthorized" replace />}
              >
                <StudentLayout />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />
          <Route path="dashboard" element={<StudentDashboard />} />
          {/* Add other student Management pages here */}
          <Route path="profile" element={<Profile />} />
          <Route path="my-attendance" element={<MyAttendance />} />
          <Route path="my-assignments" element={<MyAssignments />} />

          {/* Fee Management */}
          <Route path="fees-dashboard" element={<StudentFeeDashboard />} />
          <Route path="fees-records" element={<StudentsFeeRecords />} />
          <Route path="fees-due" element={<StudentDueFees />} />
          <Route path="fees-payments" element={<StudentFeePayments />} />
          <Route path="fees-receipts" element={<StudentFeeReceipts />} />

          {/* Exam Management */}
          <Route path="exams" element={<StudentExamDashboard />} />
          <Route path="exams-schedule" element={<StudentExamSchedule />} />
          {/* <Route path="exams-upcoming" element={<StudentUpcomingExams />} /> */}
          {/* <Route path="exams-completed" element={<StudentCompletedExams />} /> */}
          <Route path="exams/:examId" element={<StudentExamDetails />} />

          {/* Student Result Management */}
          <Route path="results" element={<StudentResultDashboard />} />
          <Route path="results-all" element={<ResultList />} />
          <Route path="results-history" element={<StudentResultHistory />} />
          <Route path="results/:resultId" element={<StudentResultDetails />} />

        </Route>



        <Route
          path="*"
          element={<Login />}
        />



      </Routes>
    </BrowserRouter>
  );
}

export default App;