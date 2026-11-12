import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

import {
    Users,
    CalendarCheck,
    GraduationCap,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    BookOpen,
    Bell,
    CreditCard,
    ChevronRight,
    CalendarDays,
    LoaderCircle,
    AlertCircle,
} from "lucide-react";

import { getParentDashboard } from "../../../services/parentDashboardService.js";

// --------------------------------------------------
// Reusable 3D-style statistic card
// --------------------------------------------------

const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    trend,
    trendValue,
}) => {
    const colors = {
        blue: "from-blue-500 to-indigo-600",
        green: "from-emerald-400 to-teal-600",
        purple: "from-purple-500 to-violet-700",
        orange: "from-orange-400 to-rose-500",
    };

    return (
        <div className="group relative">
            <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors[color]} opacity-20 blur-xl transition duration-300 group-hover:opacity-40`}
            />

            <div className="relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="absolute -right-7 -top-7 h-28 w-28 rounded-full bg-base-200/70" />

                <div className="relative flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-base-content/60">
                            {title}
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight">
                            {value}
                        </h2>

                        <p className="mt-2 text-xs text-base-content/50">
                            {subtitle}
                        </p>
                    </div>

                    <div
                        className={`rounded-xl bg-gradient-to-br ${colors[color]} p-3 text-white shadow-lg transition duration-300 group-hover:rotate-6`}
                    >
                        <Icon size={23} />
                    </div>
                </div>

                {trendValue && (
                    <div className="relative mt-4 flex items-center gap-2">
                        {trend === "up" ? (
                            <ArrowUpRight
                                size={16}
                                className="text-success"
                            />
                        ) : (
                            <ArrowDownRight
                                size={16}
                                className="text-error"
                            />
                        )}

                        <span
                            className={`text-xs font-semibold ${
                                trend === "up"
                                    ? "text-success"
                                    : "text-error"
                            }`}
                        >
                            {trendValue}
                        </span>

                        <span className="text-xs text-base-content/40">
                            compared to last month
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

// --------------------------------------------------
// Chart container
// --------------------------------------------------

const ChartCard = ({ title, subtitle, children, className = "" }) => (
    <div
        className={`rounded-2xl border border-base-300 bg-base-100 p-5 shadow-lg ${className}`}
    >
        <div className="mb-5">
            <h3 className="text-base font-bold">{title}</h3>
            <p className="mt-1 text-xs text-base-content/50">
                {subtitle}
            </p>
        </div>

        {children}
    </div>
);

// --------------------------------------------------
// Custom tooltip
// --------------------------------------------------

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-base-300 bg-base-100 p-3 shadow-xl">
            <p className="mb-2 text-xs font-semibold">{label}</p>

            {payload.map((item, index) => (
                <p
                    key={index}
                    className="text-xs"
                    style={{ color: item.color }}
                >
                    {item.name}: {item.value}
                </p>
            ))}
        </div>
    );
};

// --------------------------------------------------
// Main dashboard
// --------------------------------------------------

const ParentDashboard = () => {
    const [selectedStudentId, setSelectedStudentId] = useState("");

    const {
        data: response,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["parent-dashboard", selectedStudentId],
        queryFn: () => getParentDashboard(selectedStudentId || undefined),
    });

    const dashboard = response?.data ?? response ?? {};

    const children = dashboard.children ?? [];

    const attendance = dashboard.attendance_trend ?? [];
    const examPerformance = dashboard.exam_performance ?? [];

    const attendanceStatus = dashboard.attendance_status ?? [];

    const feeData = dashboard.fee_overview ?? {
        paid: 0,
        due: 0,
    };

    const upcomingEvents = dashboard.upcoming_events ?? [];
    const activities = dashboard.recent_activities ?? [];

    const selectedChild =
        children.find(
            (child) =>
                String(child.student_id) === String(selectedStudentId)
        ) ?? children[0];

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <LoaderCircle
                        className="mx-auto animate-spin text-primary"
                        size={38}
                    />
                    <p className="mt-3 text-sm text-base-content/60">
                        Loading parent dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-error">
                <AlertCircle size={20} />
                <span>
                    {error?.response?.data?.message ||
                        "Unable to load parent dashboard."}
                </span>
            </div>
        );
    }

    const summary = dashboard.summary ?? {};

    return (
        <div className="space-y-6 pb-8">

            {/* ---------------------------------- */}
            {/* Welcome Header */}
            {/* ---------------------------------- */}

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 p-6 text-white shadow-xl md:p-8">

                <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[35px] border-white/10" />

                <div className="absolute -bottom-24 right-48 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

                <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">

                    <div>
                        <p className="text-sm text-blue-100">
                            Parent Portal
                        </p>

                        <h1 className="mt-2 text-2xl font-bold md:text-3xl">
                            Welcome back, {dashboard.parent?.first_name || "Parent"}!
                        </h1>

                        <p className="mt-2 max-w-xl text-sm text-blue-100">
                            Stay connected with your children's academic
                            progress, attendance, examinations and payments.
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-xs text-blue-100">
                            <CalendarDays size={15} />
                            <span>
                                {new Date().toLocaleDateString("en-BD", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="relative w-full md:w-64">
                        <label className="mb-2 block text-xs font-semibold text-blue-100">
                            Select Child
                        </label>

                        <select
                            className="select w-full border-white/20 bg-white/15 text-white focus:border-white"
                            value={selectedStudentId || selectedChild?.student_id || ""}
                            onChange={(e) =>
                                setSelectedStudentId(e.target.value)
                            }
                        >
                            {children.map((child) => (
                                <option
                                    key={child.student_id}
                                    value={child.student_id}
                                    className="text-base-content"
                                >
                                    {child.first_name} {child.last_name}
                                </option>
                            ))}
                        </select>

                        {selectedChild && (
                            <p className="mt-2 text-xs text-blue-100">
                                Class: {selectedChild.class_name || "N/A"}
                                {" • "}
                                Roll: {selectedChild.roll_number || "N/A"}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ---------------------------------- */}
            {/* Statistics */}
            {/* ---------------------------------- */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="My Children"
                    value={summary.total_children ?? children.length}
                    subtitle="Registered children"
                    icon={Users}
                    color="blue"
                    trend="up"
                    trendValue={summary.children_trend}
                />

                <StatCard
                    title="Attendance Rate"
                    value={`${summary.attendance_rate ?? 0}%`}
                    subtitle="Current academic year"
                    icon={CalendarCheck}
                    color="green"
                    trend="up"
                    trendValue={summary.attendance_trend}
                />

                <StatCard
                    title="Upcoming Exams"
                    value={summary.upcoming_exams ?? 0}
                    subtitle="Scheduled examinations"
                    icon={GraduationCap}
                    color="purple"
                />

                <StatCard
                    title="Outstanding Fees"
                    value={`৳${Number(summary.outstanding_fees ?? 0).toLocaleString("en-BD")}`}
                    subtitle="Total unpaid amount"
                    icon={Wallet}
                    color="orange"
                />

            </div>

            {/* ---------------------------------- */}
            {/* Graphs */}
            {/* ---------------------------------- */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* Attendance curved line chart */}

                <ChartCard
                    title="Attendance Performance"
                    subtitle="Monthly attendance percentage"
                >
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={attendance}>
                                <defs>
                                    <linearGradient
                                        id="attendanceGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#6366f1"
                                            stopOpacity={0.35}
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#6366f1"
                                            stopOpacity={0.02}
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
                                    tick={{ fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `${value}%`}
                                />

                                <Tooltip
                                    content={<CustomTooltip />}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="percentage"
                                    name="Attendance"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fill="url(#attendanceGradient)"
                                    activeDot={{ r: 6 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Exam performance bar chart */}

                <ChartCard
                    title="Examination Performance"
                    subtitle="Marks obtained in recent examinations"
                >
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={examPerformance}
                                barSize={30}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="currentColor"
                                    opacity={0.1}
                                />

                                <XAxis
                                    dataKey="exam_name"
                                    tick={{ fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip
                                    content={<CustomTooltip />}
                                />

                                <Legend />

                                <Bar
                                    dataKey="obtained_percentage"
                                    name="Obtained"
                                    fill="#6366f1"
                                    radius={[8, 8, 0, 0]}
                                />

                                <Bar
                                    dataKey="average_percentage"
                                    name="Class Average"
                                    fill="#22c55e"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

            </div>

            {/* ---------------------------------- */}
            {/* Attendance + Fees */}
            {/* ---------------------------------- */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* Attendance donut chart */}

                <ChartCard
                    title="Attendance Overview"
                    subtitle="Attendance breakdown"
                >
                    <div className="flex flex-col items-center justify-center gap-4 md:flex-row">

                        <div className="h-64 w-full md:w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={attendanceStatus}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={65}
                                        outerRadius={95}
                                        paddingAngle={4}
                                        cornerRadius={6}
                                    >
                                        {attendanceStatus.map((item, index) => {
                                            const colors = [
                                                "#22c55e",
                                                "#ef4444",
                                                "#f59e0b",
                                                "#6366f1",
                                            ];

                                            return (
                                                <Cell
                                                    key={index}
                                                    fill={colors[index % colors.length]}
                                                />
                                            );
                                        })}
                                    </Pie>

                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="w-full space-y-4 md:w-1/2">
                            {attendanceStatus.map((item, index) => {
                                const colors = [
                                    "bg-success",
                                    "bg-error",
                                    "bg-warning",
                                    "bg-primary",
                                ];

                                return (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`h-3 w-3 rounded-full ${colors[index % colors.length]}`}
                                            />

                                            <span className="text-sm text-base-content/70">
                                                {item.name}
                                            </span>
                                        </div>

                                        <span className="text-sm font-bold">
                                            {item.value}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </ChartCard>

                {/* Fee chart */}

                <ChartCard
                    title="Fee Overview"
                    subtitle="Paid fees versus outstanding fees"
                >
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    {
                                        name: "Fee Status",
                                        paid: feeData.paid,
                                        due: feeData.due,
                                    },
                                ]}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="currentColor"
                                    opacity={0.1}
                                />

                                <XAxis dataKey="name" />

                                <YAxis
                                    tickFormatter={(value) =>
                                        `৳${value.toLocaleString("en-BD")}`
                                    }
                                />

                                <Tooltip
                                    formatter={(value) =>
                                        `৳${Number(value).toLocaleString("en-BD")}`
                                    }
                                />

                                <Legend />

                                <Bar
                                    dataKey="paid"
                                    name="Paid"
                                    fill="#22c55e"
                                    radius={[8, 8, 0, 0]}
                                    barSize={55}
                                />

                                <Bar
                                    dataKey="due"
                                    name="Due"
                                    fill="#f97316"
                                    radius={[8, 8, 0, 0]}
                                    barSize={55}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

            </div>

            {/* ---------------------------------- */}
            {/* Upcoming Events + Recent Activities */}
            {/* ---------------------------------- */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* Upcoming events */}

                <ChartCard
                    title="Upcoming Events"
                    subtitle="Examinations and school activities"
                >
                    <div className="space-y-4">
                        {upcomingEvents.length === 0 && (
                            <p className="py-8 text-center text-sm text-base-content/50">
                                No upcoming events.
                            </p>
                        )}

                        {upcomingEvents.map((event, index) => (
                            <div
                                key={event._id || index}
                                className="flex items-center gap-4 rounded-xl bg-base-200/60 p-4 transition hover:bg-base-200"
                            >
                                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                    <CalendarDays size={21} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h4 className="truncate text-sm font-semibold">
                                        {event.title}
                                    </h4>

                                    <p className="mt-1 text-xs text-base-content/50">
                                        {event.type}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs font-semibold">
                                        {event.date}
                                    </p>
                                    <p className="mt-1 text-xs text-base-content/50">
                                        {event.time || ""}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                {/* Recent activities */}

                <ChartCard
                    title="Recent Activities"
                    subtitle="Latest updates about your children"
                >
                    <div className="space-y-5">
                        {activities.length === 0 && (
                            <p className="py-8 text-center text-sm text-base-content/50">
                                No recent activities.
                            </p>
                        )}

                        {activities.map((activity, index) => (
                            <div
                                key={activity._id || index}
                                className="flex items-start gap-4"
                            >
                                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                    {activity.type === "attendance" ? (
                                        <CalendarCheck size={19} />
                                    ) : activity.type === "payment" ? (
                                        <CreditCard size={19} />
                                    ) : activity.type === "result" ? (
                                        <GraduationCap size={19} />
                                    ) : (
                                        <Bell size={19} />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-semibold">
                                        {activity.title}
                                    </h4>

                                    <p className="mt-1 text-xs text-base-content/60">
                                        {activity.description}
                                    </p>

                                    <p className="mt-2 flex items-center gap-1 text-xs text-base-content/40">
                                        <Clock size={12} />
                                        {activity.time}
                                    </p>
                                </div>

                                <ChevronRight
                                    size={17}
                                    className="text-base-content/30"
                                />
                            </div>
                        ))}
                    </div>
                </ChartCard>

            </div>

            {/* ---------------------------------- */}
            {/* Quick Actions */}
            {/* ---------------------------------- */}

            <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-lg">
                <h3 className="mb-4 text-base font-bold">
                    Quick Access
                </h3>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                    {[
                        {
                            label: "Attendance",
                            path: "/parent/attendance",
                            icon: CalendarCheck,
                        },
                        {
                            label: "Examinations",
                            path: "/parent/exams",
                            icon: GraduationCap,
                        },
                        {
                            label: "Results",
                            path: "/parent/results",
                            icon: BookOpen,
                        },
                        {
                            label: "Fee Payments",
                            path: "/parent/fees",
                            icon: CreditCard,
                        },
                    ].map((item) => (
                        <a
                            key={item.label}
                            href={item.path}
                            className="flex items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-200/40 p-4 text-sm font-semibold transition hover:-translate-y-1 hover:border-primary hover:bg-primary/10"
                        >
                            <item.icon
                                size={19}
                                className="text-primary"
                            />
                            {item.label}
                        </a>
                    ))}

                </div>
            </div>

        </div>
    );
};

export default ParentDashboard;