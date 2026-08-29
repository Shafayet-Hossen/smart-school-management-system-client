import { NavLink } from "react-router-dom";


const menuByRole = {

    school_admin: [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: "📊",
        },
        {
            label: "Teachers",
            path: "/teachers",
            icon: "👨‍🏫",
        },
        {
            label: "Students",
            path: "/students",
            icon: "🎓",
        },
        {
            label: "Parents",
            path: "/parents",
            icon: "👨‍👩‍👧",
        },
        {
            label: "Classes",
            path: "/classes",
            icon: "🏫",
        },
        {
            label: "Attendance",
            path: "/attendance",
            icon: "📋",
        },
    ],


    teacher: [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: "📊",
        },
        {
            label: "My Classes",
            path: "/my-classes",
            icon: "🏫",
        },
        {
            label: "Students",
            path: "/my-students",
            icon: "🎓",
        },
        {
            label: "Attendance",
            path: "/attendance",
            icon: "📋",
        },
        {
            label: "Assignments",
            path: "/assignments",
            icon: "📝",
        },
    ],


    student: [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: "📊",
        },
        {
            label: "My Classes",
            path: "/my-classes",
            icon: "🏫",
        },
        {
            label: "Attendance",
            path: "/attendance",
            icon: "📋",
        },
        {
            label: "Assignments",
            path: "/assignments",
            icon: "📝",
        },
        {
            label: "Results",
            path: "/results",
            icon: "📈",
        },
    ],


    parent: [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: "📊",
        },
        {
            label: "My Children",
            path: "/children",
            icon: "👨‍👩‍👧",
        },
        {
            label: "Attendance",
            path: "/attendance",
            icon: "📋",
        },
        {
            label: "Assignments",
            path: "/assignments",
            icon: "📝",
        },
        {
            label: "Academic",
            path: "/academic",
            icon: "📚",
        },
    ],

};


const requestMenu = [

    {
        label: "Teacher Requests",
        path: "/requests/teachers",
        icon: "👨‍🏫",
    },

    {
        label: "Student Requests",
        path: "/requests/students",
        icon: "🎓",
    },

    {
        label: "Parent Requests",
        path: "/requests/parents",
        icon: "👨‍👩‍👧",
    },

];


function DashboardSidebar({ role }) {

    const menu =
        menuByRole[role] || [];


    return (

        <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-base-300 bg-base-100 lg:block">

            {/* =========================================================
                LOGO
            ========================================================= */}

            <div className="flex h-16 items-center border-b border-base-300 px-6">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-primary-content">
                        S
                    </div>

                    <div>

                        <p className="font-bold">
                            Smart School
                        </p>

                        <p className="text-xs capitalize text-base-content/50">
                            {role?.replace("_", " ")}
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================================================
                NAVIGATION
            ========================================================= */}

            <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-4">

                <ul className="menu gap-1">

                    {/* =================================================
                        NORMAL ROLE MENU
                    ================================================= */}

                    {menu.map((item) => (

                        <li key={item.path}>

                            <NavLink
                                to={item.path}
                                end={
                                    item.path ===
                                    "/dashboard"
                                }
                            >

                                <span className="text-lg">
                                    {item.icon}
                                </span>

                                {item.label}

                            </NavLink>

                        </li>

                    ))}


                    {/* =================================================
                        SCHOOL ADMIN REQUESTS
                    ================================================= */}

                    {role === "school_admin" && (

                        <>

                            {/* Divider */}

                            <li className="my-3">

                                <div className="pointer-events-none h-px bg-base-300 p-0" />

                            </li>


                            {/* Section Title */}

                            <li>

                                <div className="pointer-events-none px-3 py-2 text-xs font-bold uppercase tracking-wider text-base-content/40">

                                    Requests

                                </div>

                            </li>


                            {/* Request Items */}

                            {requestMenu.map((item) => (

                                <li key={item.path}>

                                    <NavLink
                                        to={item.path}
                                    >

                                        <span className="text-lg">
                                            {item.icon}
                                        </span>

                                        {item.label}

                                    </NavLink>

                                </li>

                            ))}

                        </>

                    )}

                </ul>

            </nav>

        </aside>

    );

}


export default DashboardSidebar;