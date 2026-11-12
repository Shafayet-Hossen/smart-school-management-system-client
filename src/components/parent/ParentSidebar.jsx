import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    CalendarCheck,
    ClipboardList,
    Wallet,
    CreditCard,
    FileBarChart,
    Bell,
    Settings,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    School,
    UserRound,
    Layers,
    BookMarked,
    ClipboardCheck,
    X,
} from "lucide-react";

const navigation = [
    {
        title: "OVERVIEW",
        items: [
            {
                label: "Dashboard",
                path: "/parent/dashboard",
                icon: LayoutDashboard,
                end: true,
            },
            {
                label: "Children",
                icon: Users,
                path: "/parent/students",
            },
            {
                label: "Attendance",
                icon: CalendarCheck,
                path: "/parent/children-attendance",
            },
            {
                label: "Assignments",
                icon: BookOpen,
                path: "/parent/children-assignments",
            },
             {
                label: "Examinations",
                icon: ClipboardList,
                children: [
                    {
                        label: "Exam Dashboard",
                        path: "/parent/exams",
                    },
                    {
                        label: "Exam Schedule",
                        path: "/parent/exams-schedule",
                    },
                    // {
                    //     label: "Upcoming Exams",
                    //     path: "/parent/exams-upcoming",
                    // },
                    // {
                    //     label: "Completed Exams",
                    //     path: "/parent/exams-completed",
                    // },
                ],
            },
             {
                label: "Results",
                icon: ClipboardCheck,
                children: [
                    {
                        label: "Result Overview",
                        path: "/parent/results"
                    },
                    {
                        label: "Examination Result",
                        path: "/parent/examination-results",
                    },
                    {
                        label: "results-subject-wise Result",
                        path: "/parent/results-subject-wise",
                    },
                ],
            },
        ],
    },
  
    {
        title: "FINANCE",
        items: [
            {
                label: "Fee Management",
                icon: Wallet,
                children: [
                    { label: "Fee Overview", path: "/parent/fees-dashboard" },
                    { label: "Student Fees", path: "/parent/fees-records" },
                    { label: "Due Fees", path: "/parent/fees-due" },
                    {label: "Payments", path: "/parent/fees-payments" },
                    { label: "Fee Receipts", path: "/parent/fees-receipts" }
                ],
            },
           
        ],
    },
    {
        title: "INSIGHTS & SETTINGS",
        items: [
            {
                label: "Reports",
                path: "/parent/reports",
                icon: FileBarChart,
            },
            {
                label: "Notifications",
                path: "/parent/notifications",
                icon: Bell,
            },

            {
                label: "Settings",
                path: "/parent/settings",
                icon: Settings,
            },
        ],
    },
];

const AdminSidebar = ({
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
}) => {
    const [expandedMenus, setExpandedMenus] = useState([
        "Students",
    ]);

    const toggleMenu = (label) => {
        setExpandedMenus((previous) =>
            previous.includes(label)
                ? previous.filter((item) => item !== label)
                : [...previous, label]
        );
    };

    const closeMobile = () => setMobileOpen(false);

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${isActive
            ? "bg-primary text-primary-content font-semibold shadow-md shadow-primary/20"
            : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
        }`;

    return (
        <>
            {mobileOpen && (
                <button
                    aria-label="Close sidebar overlay"
                    onClick={closeMobile}
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-base-200 bg-base-100 transition-all duration-300
                    ${collapsed ? "w-[82px]" : "w-[270px]"}
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0`}
            >
                {/* Brand */}
                <div className="flex h-[76px] items-center justify-between border-b border-base-200 px-5">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-content">
                            <School size={23} />
                        </div>

                        {!collapsed && (
                            <div className="min-w-0">
                                <h2 className="truncate text-lg font-bold">
                                    Smart School
                                </h2>
                                <p className="text-[10px] font-semibold tracking-widest text-base-content/50">
                                    PARENT PANEL
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={closeMobile}
                        className="btn btn-ghost btn-sm btn-square lg:hidden"
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
                    {navigation.map((group) => (
                        <div key={group.title}>
                            {!collapsed && (
                                <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.15em] text-base-content/40">
                                    {group.title}
                                </p>
                            )}

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;

                                    if (item.children) {
                                        const isExpanded =
                                            expandedMenus.includes(item.label);

                                        const hasActiveChild =
                                            item.children.some(
                                                (child) =>
                                                    window.location.pathname === child.path
                                            );

                                        return (
                                            <div key={item.label}>
                                                <button
                                                    title={collapsed ? item.label : ""}
                                                    onClick={() => {
                                                        if (collapsed) {
                                                            setCollapsed(false);
                                                        } else {
                                                            toggleMenu(item.label);
                                                        }
                                                    }}
                                                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition ${hasActiveChild
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-base-content/70 hover:bg-base-200"
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <Icon size={19} />
                                                        {!collapsed && (
                                                            <span>{item.label}</span>
                                                        )}
                                                    </span>

                                                    {!collapsed && (
                                                        <ChevronDown
                                                            size={15}
                                                            className={`transition-transform ${isExpanded
                                                                ? "rotate-180"
                                                                : ""
                                                                }`}
                                                        />
                                                    )}
                                                </button>

                                                {!collapsed && isExpanded && (
                                                    <div className="ml-5 mt-1 space-y-1 border-l border-base-300 pl-3">
                                                        {item.children.map((child) => (
                                                            <NavLink
                                                                key={child.path}
                                                                to={child.path}
                                                                onClick={closeMobile}
                                                                className={linkClass}
                                                            >
                                                                <span>{child.label}</span>
                                                            </NavLink>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            end={item.end}
                                            title={collapsed ? item.label : ""}
                                            onClick={closeMobile}
                                            className={linkClass}
                                        >
                                            <Icon size={19} />
                                            {!collapsed && (
                                                <span>{item.label}</span>
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Sidebar footer */}
                <div className="border-t border-base-200 p-3">
                    {!collapsed && (
                        <div className="mb-3 rounded-xl bg-primary/5 p-3">
                            <p className="text-xs font-bold">
                                Smart School SaaS
                            </p>
                            <p className="mt-1 text-[10px] text-base-content/50">
                                Manage your school efficiently.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden w-full items-center justify-center gap-2 rounded-xl p-3 text-sm text-base-content/60 hover:bg-base-200 lg:flex"
                    >
                        {collapsed ? (
                            <ChevronRight size={18} />
                        ) : (
                            <>
                                <ChevronLeft size={18} />
                                Collapse sidebar
                            </>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;