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
                path: "/school-admin/dashboard",
                icon: LayoutDashboard,
                end: true,
            },
        ],
    },
    {
        title: "ACADEMIC MANAGEMENT",
        items: [
            {
                label: "Students",
                icon: Users,
                children: [
                    { label: "All Students", path: "/school-admin/students" },
                    { label: "Student Requests", path: "/school-admin/student-requests" },
                    { label: "Add Student", path: "/school-admin/add-students" },
                ],
            },
            {
                label: "Teachers",
                icon: GraduationCap,
                children: [
                    { label: "All Teachers", path: "/school-admin/teachers" },
                    { label: "Teacher Requests", path: "/school-admin/teacher-requests" },
                    { label: "Add Teacher", path: "/school-admin/add-teachers" },
                ],
            },
            {
                label: "Parents",
                icon: UserRound,
                children: [
                    { label: "All Parents", path: "/school-admin/parents" },
                    { label: "Parent Requests", path: "/school-admin/parent-requests" },
                    { label: "Add Parent", path: "/school-admin/add-parents" },
                ],
            },
            {
                label: "Classes",
                icon: BookOpen,
                children: [
                    { label: "All Classes", path: "/school-admin/classes" },
                    { label: "Add Class", path: "/school-admin/add-classes" },
                    { label: "TeacherClass Assign", path: "/school-admin/teacher-class-assign" },
                ],
            },
            // {
            //     label: "Sections",
            //     path: "/school-admin/sections",
            //     icon: Layers,
            // },
            {
                label: "Subjects",
                icon: BookMarked,
                children: [
                    { label: "All Subjects", path: "/school-admin/subjects" },
                    // { label: "TeacherSubject Assign", path: "/school-admin/teacher-subject-assign" },

                ],
            },
        ],
    },
    {
        title: "SCHOOL OPERATIONS",
        items: [
            {
                label: "Attendance",
                icon: CalendarCheck,
                children: [
                    { label: "Attendance Details", path: "/school-admin/attendance" },
                    { label: "Mark Attendance", path: "/school-admin/attendance-mark" },
                    
                ],
            },
            {
                label: "Examinations",
                icon: ClipboardList,
                children: [
                    {
                        label: "All Examinations",
                        path: "/school-admin/examinations",
                    },
                    // {
                    //     label: "Create Examination",
                    //     path: "/school-admin/examinations/create",
                    // },
                ],
            },
            {
                label: "Results",
                icon: ClipboardCheck,
                children: [
                    // {
                    //     label: "Review Submissions",
                    //     path: "/school-admin/results/review",
                    // },
                    {
                        label: "Published Results",
                        path: "/school-admin/results",
                    },
                ],
            },
            {
                label: "Assignments",
                icon: ClipboardCheck,
                children: [
                    {
                        label: "Assignments Overview",
                        path: "/school-admin/assignment-overview",
                    },
                    {
                        label: "All Assignments",
                        path: "/school-admin/assignments",
                    },
                    {
                        label: "Create Assignments",
                        path: "/school-admin/create-assignment",
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
                    { label: "Fee Overview", path: "/school-admin/fees-dashboard" },
                    { label: "Fee Categories", path: "/school-admin/fees-categories" },
                    { label: "Fee Structure", path: "/school-admin/fees-structures" },
                    { label: "Fee Assign", path: "/school-admin/fees-assign" },
                    { label: "Student Fees", path: "/school-admin/fees-records" },
                    { label: "Fee Collection", path: "/school-admin/fees-collect" },
                    { label: "Payments", path: "/school-admin/fees-payments" },
                    { label: "Due Fees", path: "/school-admin/fees-due" },
                    { label: "Fee Reports", path: "/school-admin/fees-reports" }
                ],
            },
            {
                label: "Subscriptions",
                path: "/school-admin/fees-stripe-settings",
                icon: CreditCard,
            },
        ],
    },
    {
        title: "INSIGHTS & SETTINGS",
        items: [
            {
                label: "Reports",
                path: "/school-admin/reports",
                icon: FileBarChart,
            },
            {
                label: "Notifications",
                path: "/school-admin/notifications",
                icon: Bell,
            },
            {
                label: "School Profile",
                path: "/school-admin/school-profile",
                icon: School,
            },
            {
                label: "Settings",
                path: "/school-admin/settings",
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
                                    ADMIN PANEL
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