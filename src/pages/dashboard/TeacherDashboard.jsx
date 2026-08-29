import DashboardHeader
    from "../../components/dashboard/DashboardHeader.jsx";

import DashboardSidebar
    from "../../components/dashboard/DashboardSidebar.jsx";


function TeacherDashboard({ user }) {

    return (

        <div className="min-h-screen bg-base-200">

            <DashboardSidebar
                role="teacher"
            />


            <div className="lg:pl-72">

                <DashboardHeader
                    user={user}
                />


                <main className="p-4 sm:p-6 lg:p-8">

                    <h1 className="text-2xl font-bold sm:text-3xl">
                        Teacher Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-base-content/60">
                        Manage your classes, students, attendance
                        and academic activities.
                    </p>


                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        <DashboardCard
                            title="My Classes"
                            value="0"
                            icon="🏫"
                        />

                        <DashboardCard
                            title="Students"
                            value="0"
                            icon="🎓"
                        />

                        <DashboardCard
                            title="Attendance"
                            value="0%"
                            icon="📋"
                        />

                        <DashboardCard
                            title="Assignments"
                            value="0"
                            icon="📝"
                        />

                    </div>

                </main>

            </div>

        </div>

    );

}


function DashboardCard({
    title,
    value,
    icon,
}) {

    return (

        <div className="rounded-2xl border border-base-300 bg-base-100 p-5">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-base-content/50">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {value}
                    </p>

                </div>

                <div className="text-2xl">
                    {icon}
                </div>

            </div>

        </div>

    );

}


export default TeacherDashboard;