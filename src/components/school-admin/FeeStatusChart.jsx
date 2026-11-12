import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = ["#16a34a", "#f59e0b", "#ef4444"];

const FeeStatusChart = ({ data = [] }) => {
    return (
        <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body">
                <h3 className="text-lg font-bold">
                    Fee Payment Status
                </h3>
                <p className="text-sm text-base-content/50">
                    Distribution of student fee records
                </p>

                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="45%"
                                innerRadius={65}
                                outerRadius={95}
                                paddingAngle={4}
                            >
                                {data.map((item, index) => (
                                    <Cell
                                        key={item.name}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default FeeStatusChart;