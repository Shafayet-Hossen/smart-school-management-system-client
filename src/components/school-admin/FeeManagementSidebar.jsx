import { NavLink } from "react-router-dom";

const feeMenuItems = [
    { label: "Dashboard", path: "dashboard", icon: "📊" },
    { label: "Fee Categories", path: "categories", icon: "📁" },
    { label: "Fee Structures", path: "structures", icon: "🏗️" },
    { label: "Assign Fees", path: "assign", icon: "📝" },
    { label: "Student Fee Records", path: "records", icon: "👨‍🎓" },
    { label: "Collect Payment", path: "collect", icon: "💰" },
    { label: "Payment History", path: "payments", icon: "📜" },
    { label: "Outstanding Dues", path: "due", icon: "⏳" },
    { label: "Fee Reminders", path: "reminders", icon: "🔔" },
    { label: "Stripe Settings", path: "stripe-settings", icon: "💳" },
    { label: "Fee Reports", path: "reports", icon: "📈" },
];

const FeeManagementSidebar = () => {
    return (
        <div className="bg-base-100 border border-base-200 rounded-xl p-3">
            <h2 className="font-semibold px-3 py-2">
                💰 Fee Management
            </h2>

            <nav className="flex flex-wrap gap-2">
                {feeMenuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={`/student-fees/${item.path}`}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                                isActive
                                    ? "bg-primary text-primary-content"
                                    : "hover:bg-base-200"
                            }`
                        }
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default FeeManagementSidebar;