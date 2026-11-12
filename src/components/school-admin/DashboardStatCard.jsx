import {
    TrendingUp,
    TrendingDown,
} from "lucide-react";

const DashboardStatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "primary",
    trend,
}) => {
    const colorClasses = {
        primary: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        info: "bg-info/10 text-info",
        error: "bg-error/10 text-error",
        secondary: "bg-secondary/10 text-secondary",
    };

    const positive = trend?.direction === "up";

    return (
        <div className="card border border-base-200 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="card-body p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-base-content/60">
                            {title}
                        </p>

                        <h2 className="mt-2 text-2xl font-bold tracking-tight">
                            {value}
                        </h2>

                        <p className="mt-1 text-xs text-base-content/50">
                            {subtitle}
                        </p>
                    </div>

                    <div
                        className={`rounded-2xl p-3 ${
                            colorClasses[color] || colorClasses.primary
                        }`}
                    >
                        {Icon && <Icon size={23} />}
                    </div>
                </div>

                {trend && (
                    <div className="mt-4 flex items-center gap-1 text-xs">
                        {positive ? (
                            <TrendingUp
                                size={15}
                                className="text-success"
                            />
                        ) : (
                            <TrendingDown
                                size={15}
                                className="text-error"
                            />
                        )}

                        <span
                            className={
                                positive
                                    ? "font-semibold text-success"
                                    : "font-semibold text-error"
                            }
                        >
                            {trend.value}
                        </span>

                        <span className="text-base-content/50">
                            {trend.label || "compared to last month"}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardStatCard;