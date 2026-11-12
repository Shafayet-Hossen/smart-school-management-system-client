import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

const AttendanceChart = ({ data = [] }) => {
    return (
        <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body">
                <h3 className="text-lg font-bold">
                    Attendance Overview
                </h3>
                <p className="text-sm text-base-content/50">
                    Present, absent and late students
                </p>

                <div className="mt-4 h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barGap={5}>
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
                            />

                            <Tooltip />
                            <Legend />

                            <Bar
                                dataKey="present"
                                name="Present"
                                fill="#16a34a"
                                radius={[5, 5, 0, 0]}
                            />

                            <Bar
                                dataKey="absent"
                                name="Absent"
                                fill="#ef4444"
                                radius={[5, 5, 0, 0]}
                            />

                            <Bar
                                dataKey="late"
                                name="Late"
                                fill="#f59e0b"
                                radius={[5, 5, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AttendanceChart;