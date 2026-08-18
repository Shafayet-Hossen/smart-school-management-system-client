import RoleGuard from "./RoleGuard.jsx";
import  ROLES  from "../constants/Roles.js";

const Sidebar = ({ currentUser }) => {
  return (
    <aside>
      <nav>

        <RoleGuard
          allowedRoles={[ROLES.SCHOOL_ADMIN]}
          userRole={currentUser?.role}
        >
          <a href="/students">
            Students
          </a>
        </RoleGuard>

        <RoleGuard
          allowedRoles={[
            ROLES.SCHOOL_ADMIN,
            ROLES.TEACHER,
          ]}
          userRole={currentUser?.role}
        >
          <a href="/attendance">
            Attendance
          </a>
        </RoleGuard>

        <RoleGuard
          allowedRoles={[
            ROLES.SCHOOL_ADMIN,
            ROLES.TEACHER,
          ]}
          userRole={currentUser?.role}
        >
          <a href="/results">
            Results
          </a>
        </RoleGuard>

        <RoleGuard
          allowedRoles={[
            ROLES.STUDENT,
          ]}
          userRole={currentUser?.role}
        >
          <a href="/my-results">
            My Results
          </a>
        </RoleGuard>

      </nav>
    </aside>
  );
};

export default Sidebar;