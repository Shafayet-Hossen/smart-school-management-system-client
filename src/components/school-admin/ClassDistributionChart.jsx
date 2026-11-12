import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const ClassDistributionChart = ({ data = [] }) => {
    return (
        <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body">
                <h3 className="text-lg font-bold">
                    Class-wise Students
                </h3>
                <p className="text-sm text-base-content/50">
                    Student distribution across classes
                </p>

                <div className="mt-4 h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical">
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                                opacity={0.1}
                            />

                            <XAxis type="number" />
                            <YAxis
                                type="category"
                                dataKey="class_name"
                                width={75}
                            />

                            <Tooltip />

                            <Bar
                                dataKey="students"
                                name="Students"
                                fill="#0ea5e9"
                                radius={[0, 6, 6, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ClassDistributionChart;