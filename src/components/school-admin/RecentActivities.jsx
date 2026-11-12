import {
    UserPlus,
    Wallet,
    ClipboardCheck,
    GraduationCap,
} from "lucide-react";

const activityIcons = {
    admission: UserPlus,
    payment: Wallet,
    attendance: ClipboardCheck,
    result: GraduationCap,
};

const RecentActivities = ({ activities = [] }) => {
    return (
        <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold">
                            Recent Activities
                        </h3>
                        <p className="text-sm text-base-content/50">
                            Latest school updates
                        </p>
                    </div>

                    <span className="badge badge-primary badge-outline">
                        Recent
                    </span>
                </div>

                <div className="mt-3 space-y-4">
                    {activities.length === 0 ? (
                        <p className="py-6 text-center text-sm text-base-content/50">
                            No recent activities.
                        </p>
                    ) : (
                        activities.map((activity) => {
                            const Icon =
                                activityIcons[activity.type] || GraduationCap;

                            return (
                                <div
                                    key={activity._id}
                                    className="flex items-start gap-3"
                                >
                                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                                        <Icon size={19} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium">
                                            {activity.title}
                                        </p>

                                        <p className="text-xs text-base-content/50">
                                            {activity.description}
                                        </p>

                                        <p className="mt-1 text-xs text-base-content/40">
                                            {activity.time_label}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecentActivities;