import { useQuery } from "@tanstack/react-query";

import {
    Activity,
    Award,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    Clock,
    FileText,
    GraduationCap,
    Users,
    TrendingUp,
} from "lucide-react";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { getTeacherDashboard } from "../../../services/teacherDashboardService";


const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    trend,
}) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-base-300/70 bg-base-100 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div
                className={`absolute -right-8 -top-8 h-28 w-28 rounded-full ${color} opacity-10 blur-2xl transition-all group-hover:scale-150`}
            />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-base-content/60">
                        {title}
                    </p>

                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                        {value}
                    </h2>

                    <p className="mt-2 text-xs text-base-content/50">
                        {subtitle}
                    </p>
                </div>

                <div className={`rounded-xl p-3 ${color}`}>
                    <Icon size={22} />
                </div>
            </div>

            {trend && (
                <div className="relative mt-4 flex items-center gap-1 text-xs font-semibold text-success">
                    <TrendingUp size={14} />
                    {trend}
                </div>
            )}
        </div>
    );
};


const Panel = ({
    title,
    subtitle,
    children,
    className = "",
}) => (
    <section
        className={`rounded-2xl border border-base-300/70 bg-base-100 p-5 shadow-sm ${className}`}
    >
        <div className="mb-5">
            <h3 className="text-base font-bold">
                {title}
            </h3>

            {subtitle && (
                <p className="mt-1 text-xs text-base-content/50">
                    {subtitle}
                </p>
            )}
        </div>

        {children}
    </section>
);


const EmptyState = ({ message }) => (
    <div className="grid min-h-[150px] place-items-center text-center text-sm text-base-content/50">
        {message}
    </div>
);


const TeacherDashboard = () => {
    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["teacher-dashboard"],
        queryFn: getTeacherDashboard,
    });

    if (isLoading) {
        return (
            <div className="grid min-h-[400px] place-items-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (isError || !data?.data) {
        return (
            <div className="alert alert-error">
                Failed to load teacher dashboard.
            </div>
        );
    }

    const dashboard = data.data;

    const teacher = dashboard.teacher || {};
    const summary = dashboard.summary || {};

    const attendanceTrend = dashboard.attendance_trend || [];
    const classPerformance = dashboard.class_performance || [];
    const subjectPerformance = dashboard.subject_performance || [];
    const attendanceStatus = dashboard.attendance_status || [];

    const upcomingClasses = dashboard.upcoming_classes || [];
    const upcomingExams = dashboard.upcoming_exams || [];
    const pendingAssignments = dashboard.pending_assignments || [];
    const recentActivities = dashboard.recent_activities || [];

    return (
        <div className="space-y-6">

            {/* Welcome Header */}
            <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-800 p-6 text-white shadow-2xl md:p-8">

                <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[35px] border-white/5" />

                <div className="absolute -bottom-28 right-40 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

                <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">

                    <div>
                        <div className="mb-3 flex items-center gap-2 text-sm text-indigo-200">
                            <GraduationCap size={18} />
                            Teacher Workspace
                        </div>

                        <h1 className="text-2xl font-extrabold md:text-4xl">
                            Welcome back, {teacher.first_name || "Teacher"}!
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100/80">
                            Manage your classes, monitor student progress,
                            review assignments, and stay organized with
                            your teaching activities.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs">
                                Teacher ID: {teacher.teacher_id || "N/A"}
                            </span>

                            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs">
                                School: {teacher.school_name || "My School"}
                            </span>
                        </div>
                    </div>

                    <div className="relative flex h-36 w-36 shrink-0 items-center justify-center self-center rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl md:h-44 md:w-44">

                        <div className="absolute inset-3 rounded-full border border-dashed border-white/30" />

                        <div className="text-center">
                            <Award
                                size={34}
                                className="mx-auto mb-2 text-amber-300"
                            />

                            <p className="text-3xl font-extrabold">
                                {summary.total_classes ?? 0}
                            </p>

                            <p className="text-xs text-indigo-100">
                                Assigned Classes
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="My Classes"
                    value={summary.total_classes ?? 0}
                    subtitle="Assigned classes"
                    icon={BookOpen}
                    color="bg-indigo-500/10 text-indigo-500"
                />

                <StatCard
                    title="My Students"
                    value={summary.total_students ?? 0}
                    subtitle="Students under your supervision"
                    icon={Users}
                    color="bg-emerald-500/10 text-emerald-500"
                />

                <StatCard
                    title="Attendance"
                    value={`${summary.attendance_percentage ?? 0}%`}
                    subtitle="Average student attendance"
                    icon={CheckCircle2}
                    color="bg-sky-500/10 text-sky-500"
                />

                <StatCard
                    title="Pending Reviews"
                    value={summary.pending_submissions ?? 0}
                    subtitle="Assignments to review"
                    icon={ClipboardCheck}
                    color="bg-amber-500/10 text-amber-500"
                />

            </div>

            {/* Attendance and Student Performance */}
            <div className="grid gap-6 xl:grid-cols-3">

                <Panel
                    title="Student Attendance Trend"
                    subtitle="Monthly attendance percentage across your classes"
                    className="xl:col-span-2"
                >
                    {attendanceTrend.length === 0 ? (
                        <EmptyState message="No attendance records available." />
                    ) : (
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={attendanceTrend}>
                                    <defs>
                                        <linearGradient
                                            id="teacherAttendanceGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#6366f1"
                                                stopOpacity={0.4}
                                            />

                                            <stop
                                                offset="95%"
                                                stopColor="#6366f1"
                                                stopOpacity={0.02}
                                            />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        opacity={0.15}
                                    />

                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                    />

                                    <YAxis
                                        domain={[0, 100]}
                                        tickLine={false}
                                        axisLine={false}
                                    />

                                    <Tooltip />

                                    <Area
                                        type="monotone"
                                        dataKey="percentage"
                                        name="Attendance"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fill="url(#teacherAttendanceGradient)"
                                        activeDot={{ r: 6 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </Panel>

                <Panel
                    title="Attendance Breakdown"
                    subtitle="Student attendance distribution"
                >
                    {attendanceStatus.length === 0 ? (
                        <EmptyState message="No attendance breakdown available." />
                    ) : (
                        <>
                            <div className="relative h-[230px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={attendanceStatus}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={65}
                                            outerRadius={95}
                                            paddingAngle={4}
                                        >
                                            {attendanceStatus.map((item, index) => (
                                                <Cell
                                                    key={item.name}
                                                    fill={
                                                        item.color ||
                                                        ["#10b981", "#f43f5e", "#f59e0b", "#6366f1"][index % 4]
                                                    }
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {attendanceStatus.map((item) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center gap-2 text-xs"
                                    >
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{
                                                backgroundColor: item.color || "#6366f1",
                                            }}
                                        />

                                        <span className="text-base-content/60">
                                            {item.name}
                                        </span>

                                        <strong className="ml-auto">
                                            {item.value}
                                        </strong>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </Panel>

            </div>

            {/* Class and Subject Performance */}
            <div className="grid gap-6 xl:grid-cols-2">

                <Panel
                    title="Class Performance"
                    subtitle="Average examination results by class"
                >
                    {classPerformance.length === 0 ? (
                        <EmptyState message="No class performance data available." />
                    ) : (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={classPerformance}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        opacity={0.15}
                                    />

                                    <XAxis
                                        dataKey="class_name"
                                        tickLine={false}
                                        axisLine={false}
                                    />

                                    <YAxis
                                        domain={[0, 100]}
                                        tickLine={false}
                                        axisLine={false}
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="average_percentage"
                                        name="Average marks"
                                        fill="#6366f1"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={45}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </Panel>

                <Panel
                    title="Subject Performance"
                    subtitle="Academic performance across your subjects"
                >
                    {subjectPerformance.length === 0 ? (
                        <EmptyState message="No subject performance data available." />
                    ) : (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={subjectPerformance}>
                                    <PolarGrid opacity={0.25} />

                                    <PolarAngleAxis
                                        dataKey="subject_name"
                                        tick={{ fontSize: 11 }}
                                    />

                                    <PolarRadiusAxis
                                        domain={[0, 100]}
                                    />

                                    <Radar
                                        name="Average performance"
                                        dataKey="average_percentage"
                                        stroke="#8b5cf6"
                                        fill="#8b5cf6"
                                        fillOpacity={0.4}
                                    />

                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </Panel>

            </div>

            {/* Upcoming Classes and Exams */}
            <div className="grid gap-6 xl:grid-cols-2">

                <Panel
                    title="Upcoming Classes"
                    subtitle="Your scheduled teaching activities"
                >
                    <div className="space-y-3">
                        {upcomingClasses.length === 0 ? (
                            <EmptyState message="No upcoming classes." />
                        ) : (
                            upcomingClasses.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center gap-4 rounded-xl border border-base-200 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-500">
                                        <CalendarDays size={22} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold">
                                            {item.subject_name}
                                        </p>

                                        <p className="mt-1 text-xs text-base-content/50">
                                            {item.class_name} - {item.section_name}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs font-semibold">
                                            {item.date
                                                ? new Date(item.date).toLocaleDateString()
                                                : "Date N/A"}
                                        </p>

                                        <p className="mt-1 flex items-center justify-end gap-1 text-xs text-base-content/50">
                                            <Clock size={12} />
                                            {item.start_time || "Time N/A"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Panel>

                <Panel
                    title="Upcoming Examinations"
                    subtitle="Examinations assigned to your classes"
                >
                    <div className="space-y-3">
                        {upcomingExams.length === 0 ? (
                            <EmptyState message="No upcoming examinations." />
                        ) : (
                            upcomingExams.map((exam) => (
                                <div
                                    key={exam._id}
                                    className="flex items-center gap-4 rounded-xl border border-base-200 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="rounded-xl bg-violet-500/10 p-3 text-violet-500">
                                        <GraduationCap size={22} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold">
                                            {exam.exam_name}
                                        </p>

                                        <p className="mt-1 text-xs text-base-content/50">
                                            {exam.subject_name || "Examination"}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs font-semibold">
                                            {exam.exam_date
                                                ? new Date(exam.exam_date).toLocaleDateString()
                                                : "Date N/A"}
                                        </p>

                                        <p className="mt-1 text-xs text-base-content/50">
                                            {exam.start_time || ""}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Panel>

            </div>

            {/* Pending Assignment Reviews */}
            <Panel
                title="Pending Assignment Reviews"
                subtitle="Submissions that require your attention"
            >
                <div className="space-y-3">
                    {pendingAssignments.length === 0 ? (
                        <EmptyState message="No pending assignment reviews." />
                    ) : (
                        pendingAssignments.map((item) => (
                            <div
                                key={item._id}
                                className="flex flex-col gap-3 rounded-xl border border-base-200 p-4 transition hover:shadow-md sm:flex-row sm:items-center"
                            >
                                <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
                                    <FileText size={22} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold">
                                        {item.assignment_title}
                                    </p>

                                    <p className="mt-1 text-xs text-base-content/50">
                                        {item.class_name} - {item.section_name}
                                    </p>

                                    <p className="mt-1 text-xs text-base-content/50">
                                        {item.submission_count ?? 0} submissions
                                    </p>
                                </div>

                                <span className="badge badge-warning badge-outline">
                                    Pending Review
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </Panel>

            {/* Recent Activities */}
            <Panel
                title="Recent Activities"
                subtitle="Latest updates from your teaching workspace"
            >
                <div className="space-y-4">
                    {recentActivities.length === 0 ? (
                        <EmptyState message="No recent activities." />
                    ) : (
                        recentActivities.map((activity, index) => (
                            <div
                                key={activity._id || index}
                                className="flex items-start gap-3"
                            >
                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <Activity size={17} />
                                </div>

                                <div className="flex-1">
                                    <p className="text-sm font-semibold">
                                        {activity.title}
                                    </p>

                                    <p className="mt-1 text-xs text-base-content/50">
                                        {activity.description}
                                    </p>
                                </div>

                                <span className="whitespace-nowrap text-xs text-base-content/40">
                                    {activity.date
                                        ? new Date(activity.date).toLocaleDateString()
                                        : ""}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </Panel>

        </div>
    );
};

export default TeacherDashboard;