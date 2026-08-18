import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext.jsx";

import RoleGuard from "../components/RoleGuard.jsx";

import ROLES from "../constants/Roles.js";

import Sidebar from "../components/Sidebar.jsx";
const Dashboard = () => {
  const navigate =
    useNavigate();

  const { user, logout } =
    useAuth();

  const handleLogout =
    async () => {
      await logout();
      
      navigate("/login");
    };

  return (
    <div className="p-8">
      <div>
        <Sidebar user={user}></Sidebar>
      </div>
      <h1 className="text-3xl font-bold">
        Smart School Dashboard
      </h1>

      <p className="mt-2">
        Welcome,{" "}
        {user?.full_name}
      </p>

      <div>
        <RoleGuard
          allowedRoles={[ROLES.SCHOOL_ADMIN]}
          userRole={user?.role}
        >
          <button>Add Student</button>
        </RoleGuard>
        <br />
        <br />
        <RoleGuard
          allowedRoles={[ROLES.SCHOOL_ADMIN, ROLES.TEACHER]}
          userRole={user?.role}
        >
          <button>Mark Attendance</button>
        </RoleGuard>
      </div>

      <button
        onClick={handleLogout}
        className="btn btn-error mt-6"
      >
        Logout
      </button>

    </div>
  );
};

export default Dashboard;