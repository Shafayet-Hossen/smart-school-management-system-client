import { NavLink, Outlet, Link } from "react-router-dom";

const navigation = [
    {
        label: "Dashboard",
        path: "/teacher-results",
        icon: "📊",
        end: true,
    },
    {
        label: "Examinations",
        path: "/teacher-results/exams",
        icon: "📝",
    },
    {
        label: "Submissions",
        path: "/teacher-results/submissions",
        icon: "📤",
    },
    {
        label: "Result History",
        path: "/teacher-results/history",
        icon: "📚",
    },
];

const TeacherResultManagementLayout = () => {
    return (
        <div className="min-h-screen bg-base-200">
            <div className="drawer lg:drawer-open">
                <input
                    id="teacher-result-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                />

                <div className="drawer-content flex flex-col">
                    <header className="navbar bg-base-100 shadow-sm px-4">
                        <div className="flex-none lg:hidden">
                            <label
                                htmlFor="teacher-result-drawer"
                                className="btn btn-square btn-ghost"
                            >
                                ☰
                            </label>
                        </div>

                        <div className="flex-1">
                            <h1 className="text-lg font-bold">
                                Result Management
                            </h1>
                        </div>

                        <Link
                            to="/teacher-dashboard"
                            className="btn btn-sm btn-outline"
                        >
                            Back to Dashboard
                        </Link>
                    </header>

                    <main className="p-4 md:p-6">
                        <Outlet />
                    </main>
                </div>

                <div className="drawer-side z-40">
                    <label
                        htmlFor="teacher-result-drawer"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    />

                    <aside className="min-h-full w-72 bg-base-100 border-r">
                        <div className="p-5 border-b">
                            <h2 className="text-xl font-bold text-primary">
                                Teacher Portal
                            </h2>
                            <p className="text-sm text-base-content/60 mt-1">
                                Result Management
                            </p>
                        </div>

                        <ul className="menu p-4 gap-2">
                            {navigation.map((item) => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "active font-semibold"
                                                : ""
                                        }
                                    >
                                        <span>{item.icon}</span>
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default TeacherResultManagementLayout;