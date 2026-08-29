import DashboardHeader
    from "../../components/dashboard/DashboardHeader.jsx";

import DashboardSidebar
    from "../../components/dashboard/DashboardSidebar.jsx";


function ParentDashboard({ user }) {

    return (

        <div className="min-h-screen bg-base-200">

            <DashboardSidebar
                role="parent"
            />


            <div className="lg:pl-72">

                <DashboardHeader
                    user={user}
                />


                <main className="p-4 sm:p-6 lg:p-8">

                    <h1 className="text-2xl font-bold sm:text-3xl">
                        Parent Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-base-content/60">
                        Monitor your children's academic
                        progress, attendance and activities.
                    </p>


                    {/* Child Selector */}

                    <div className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-5">

                        <label className="label">

                            <span className="label-text font-semibold">
                                Select Child
                            </span>

                        </label>

                        <select className="select select-bordered w-full max-w-md">

                            <option>
                                Select a child
                            </option>

                        </select>

                    </div>


                    {/* Statistics */}

                    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

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

                        <DashboardCard
                            title="Subjects"
                            value="0"
                            icon="📚"
                        />

                        <DashboardCard
                            title="Upcoming"
                            value="0"
                            icon="📅"
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


export default ParentDashboard;