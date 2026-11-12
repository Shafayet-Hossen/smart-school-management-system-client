import { NavLink, Outlet } from "react-router-dom";

const menuItems = [
    {
        label: "Dashboard",
        path: "/student-exams",
        end: true,
    },
    {
        label: "Exam Schedule",
        path: "/student-exams/schedule",
    },
    {
        label: "Upcoming Exams",
        path: "/student-exams/upcoming",
    },
    {
        label: "Completed Exams",
        path: "/student-exams/completed",
    },
];

const StudentExamManagementLayout = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-base-content">
                    Exam Management
                </h1>

                <p className="mt-1 text-sm text-base-content/60">
                    View your examination schedules and details.
                </p>
            </div>

            <div className="border-b border-base-300">
                <div className="flex flex-wrap gap-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `rounded-t-lg px-4 py-3 text-sm font-medium transition ${
                                    isActive
                                        ? "border-b-2 border-primary text-primary"
                                        : "text-base-content/60 hover:text-primary"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>

            <Outlet />
        </div>
    );
};

export default StudentExamManagementLayout;