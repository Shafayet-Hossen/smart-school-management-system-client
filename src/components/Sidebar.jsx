import RoleGuard from "./RoleGuard.jsx";
import ROLES from "../constants/Roles.js";
import { NavLink } from "react-router-dom";


const Sidebar = ({ user }) => {
  return (
    <aside>
      <nav className="flex gap-6">
        <RoleGuard
          allowedRoles={[ROLES.SCHOOL_ADMIN]}
          userRole={user?.role}
        >
          <a href="/students">
            Students
          </a>
        </RoleGuard>

        <RoleGuard
          allowedRoles={[
            ROLES.SCHOOL_ADMIN,
          ]}
          userRole={user?.role}
        >
          <a href="/admin/attendance">
            Attendance
          </a>
        </RoleGuard>

        <RoleGuard
          allowedRoles={[
            ROLES.PARENT,
          ]}
          userRole={user?.role}
        >
          <NavLink
            to="/parent/dashboard"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            ParentDashboard
          </NavLink>
        </RoleGuard>

        <RoleGuard
          allowedRoles={[
            ROLES.SCHOOL_ADMIN,
            ROLES.TEACHER,
          ]}
          userRole={user?.role}
        >
          <a href="/results">
            Results
          </a>
        </RoleGuard>

        <RoleGuard
          allowedRoles={[
            ROLES.STUDENT,
          ]}
          userRole={user?.role}
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