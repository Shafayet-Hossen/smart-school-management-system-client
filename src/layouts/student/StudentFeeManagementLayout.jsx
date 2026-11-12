import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaChartPie,
    FaFileInvoiceDollar,
    FaMoneyBillWave,
    FaHistory,
    FaReceipt,
} from "react-icons/fa";

const menuItems = [
    {
        name: "Fee Dashboard",
        path: "/my-fees",
        icon: FaChartPie,
        end: true,
    },
    {
        name: "Fee Records",
        path: "/my-fees/records",
        icon: FaFileInvoiceDollar,
    },
    {
        name: "Due Fees",
        path: "/my-fees/due",
        icon: FaMoneyBillWave,
    },
    {
        name: "Payment History",
        path: "/my-fees/payments",
        icon: FaHistory,
    },
    {
        name: "Receipts",
        path: "/my-fees/receipts",
        icon: FaReceipt,
    },
];

const StudentFeeManagementLayout = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-base-200">

            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100">
                <div className="navbar mx-auto max-w-7xl px-4">

                    <div className="flex-1">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="btn btn-ghost btn-sm gap-2"
                        >
                            <FaArrowLeft />
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="flex-none">
                        <h1 className="text-lg font-bold text-primary">
                            Student Fee Management
                        </h1>
                    </div>

                </div>
            </header>

            {/* Main Layout */}
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row">

                {/* Sidebar */}
                <aside className="w-full shrink-0 md:w-64">

                    <div className="rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm">

                        <h2 className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-base-content/50">
                            Fee Management
                        </h2>

                        <nav className="flex flex-col gap-2">

                            {menuItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                                isActive
                                                    ? "bg-primary text-primary-content shadow-sm"
                                                    : "text-base-content hover:bg-base-200"
                                            }`
                                        }
                                    >
                                        <Icon className="text-base" />
                                        <span>{item.name}</span>
                                    </NavLink>
                                );
                            })}

                        </nav>

                        {/* Payment Information */}
                        <div className="mt-6 rounded-lg bg-info/10 p-3">
                            <p className="text-sm font-semibold text-info">
                                Payment Information
                            </p>

                            <p className="mt-1 text-xs leading-relaxed text-base-content/70">
                                You can view your fees and payment history here.
                                For online fee payments, please contact your
                                parent or guardian.
                            </p>
                        </div>

                    </div>
                </aside>

                {/* Page Content */}
                <main className="min-w-0 flex-1">
                    <div className="rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
};

export default StudentFeeManagementLayout;