import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaChartPie,
    FaUsers,
    FaExclamationCircle,
    FaMoneyBillWave,
} from "react-icons/fa";

const TeacherFeeManagementLayout = () => {
    const navigate = useNavigate();

    const navItems = [
        {
            label: "Fee Dashboard",
            path: "/teacher-fees",
            icon: FaChartPie,
            end: true,
        },
        {
            label: "Student Fees",
            path: "/teacher-fees/students",
            icon: FaUsers,
        },
        {
            label: "Due Fees",
            path: "/teacher-fees/due",
            icon: FaExclamationCircle,
        },
        {
            label: "Payment History",
            path: "/teacher-fees/payments",
            icon: FaMoneyBillWave,
        },
    ];

    return (
        <div className="min-h-screen bg-base-200">
            <div className="drawer lg:drawer-open">
                <input
                    id="teacher-fee-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                />

                <div className="drawer-content">
                    <div className="navbar border-b border-base-300 bg-base-100 px-4 lg:hidden">
                        <label
                            htmlFor="teacher-fee-drawer"
                            className="btn btn-square btn-ghost"
                        >
                            <span className="text-xl">☰</span>
                        </label>

                        <span className="ml-3 font-semibold">
                            Fee Management
                        </span>
                    </div>

                    <main className="p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </main>
                </div>

                <div className="drawer-side z-40">
                    <label
                        htmlFor="teacher-fee-drawer"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    />

                    <aside className="flex min-h-full w-72 flex-col border-r border-base-300 bg-base-100">
                        <div className="border-b border-base-300 p-6">
                            <h2 className="text-xl font-bold">
                                Fee Management
                            </h2>

                            <p className="mt-1 text-sm text-base-content/60">
                                Teacher Portal
                            </p>
                        </div>

                        <nav className="flex-1 space-y-2 p-4">
                            {navItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                                                isActive
                                                    ? "bg-primary text-primary-content"
                                                    : "hover:bg-base-200"
                                            }`
                                        }
                                    >
                                        <Icon />
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                        </nav>

                        <div className="border-t border-base-300 p-4">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="btn btn-outline btn-sm w-full"
                            >
                                <FaArrowLeft />
                                Back to Dashboard
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default TeacherFeeManagementLayout;