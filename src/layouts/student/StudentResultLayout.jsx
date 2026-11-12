import { NavLink, Outlet } from "react-router-dom";

const StudentResultLayout = () => {

    const navClass = ({ isActive }) =>
        `btn btn-sm ${
            isActive
                ? "btn-primary"
                : "btn-ghost"
        }`;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">
                    My Academic Results
                </h1>

                <p className="text-sm text-base-content/60">
                    View your published examination results and academic performance.
                </p>
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap gap-2">

                <NavLink
                    to="/student-results"
                    end
                    className={navClass}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/student-results/all"
                    className={navClass}
                >
                    All Results
                </NavLink>

                <NavLink
                    to="/student-results/history"
                    className={navClass}
                >
                    Result History
                </NavLink>

            </div>

            {/* Nested pages */}
            <Outlet />

        </div>
    );
};

export default StudentResultLayout;