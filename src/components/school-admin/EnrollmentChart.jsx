import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const EnrollmentChart = ({ data = [] }) => {
    return (
        <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body">
                <div className="mb-4">
                    <h3 className="text-lg font-bold">
                        Student Enrollment
                    </h3>
                    <p className="text-sm text-base-content/50">
                        Monthly student admission overview
                    </p>
                </div>

                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient
                                    id="enrollmentGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#6366f1"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#6366f1"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="currentColor"
                                opacity={0.1}
                            />

                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip />

                            <Area
                                type="monotone"
                                dataKey="students"
                                stroke="#6366f1"
                                strokeWidth={3}
                                fill="url(#enrollmentGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentChart;