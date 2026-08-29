import DashboardHeader
    from "../../components/dashboard/DashboardHeader.jsx";

import DashboardSidebar
    from "../../components/dashboard/DashboardSidebar.jsx";


function SchoolAdminDashboard({ user }) {

    return (

        <div className="min-h-screen bg-base-200">

            <DashboardSidebar
                role="school_admin"
            />


            <div className="lg:pl-72">

                <DashboardHeader
                    user={user}
                />


                <main className="p-4 sm:p-6 lg:p-8">

                    <div className="mb-8">

                        <h1 className="text-2xl font-bold sm:text-3xl">
                            School Admin Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-base-content/60">
                            Manage your school, staff, students,
                            parents and academic activities.
                        </p>

                    </div>


                    {/* Statistics */}

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        <DashboardCard
                            title="Students"
                            value="0"
                            icon="🎓"
                        />

                        <DashboardCard
                            title="Teachers"
                            value="0"
                            icon="👨‍🏫"
                        />

                        <DashboardCard
                            title="Parents"
                            value="0"
                            icon="👨‍👩‍👧"
                        />

                        <DashboardCard
                            title="Classes"
                            value="0"
                            icon="🏫"
                        />

                    </div>


                    {/* Content */}

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">

                        <div className="rounded-2xl border border-base-300 bg-base-100 p-6">

                            <h2 className="font-bold">
                                Recent Activity
                            </h2>

                            <p className="mt-3 text-sm text-base-content/50">
                                No recent activity.
                            </p>

                        </div>


                        <div className="rounded-2xl border border-base-300 bg-base-100 p-6">

                            <h2 className="font-bold">
                                Quick Actions
                            </h2>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">

                                <button className="btn btn-primary">
                                    Add Teacher
                                </button>

                                <button className="btn btn-outline">
                                    Add Student
                                </button>

                            </div>

                        </div>

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

        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-base-content/50">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {value}
                    </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                    {icon}
                </div>

            </div>

        </div>

    );

}


export default SchoolAdminDashboard;