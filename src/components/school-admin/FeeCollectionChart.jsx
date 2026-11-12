import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const FeeCollectionChart = ({ data = [] }) => {
    return (
        <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body">
                <h3 className="text-lg font-bold">
                    Monthly Fee Collection
                </h3>
                <p className="text-sm text-base-content/50">
                    Collected fees versus outstanding fees
                </p>

                <div className="mt-4 h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
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
                                tickFormatter={(value) =>
                                    `৳${value.toLocaleString()}`
                                }
                            />

                            <Tooltip
                                formatter={(value) =>
                                    `৳${Number(value).toLocaleString()}`
                                }
                            />

                            <Bar
                                dataKey="collected"
                                name="Collected"
                                fill="#6366f1"
                                radius={[6, 6, 0, 0]}
                            />

                            <Bar
                                dataKey="due"
                                name="Outstanding"
                                fill="#f59e0b"
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default FeeCollectionChart;