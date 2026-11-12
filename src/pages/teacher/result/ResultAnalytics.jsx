
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend,
} from "recharts";
import {
    Users,
    TrendingUp,
    TrendingDown,
    Award,
    Search,
    RefreshCw,
    BookOpen,
    GraduationCap,
    Target,
    AlertCircle,
} from "lucide-react";

import api from "../../../services/api.js";

const COLORS = {
    primary: "#4F46E5",
    success: "#16A34A",
    danger: "#DC2626",
    warning: "#D97706",
    purple: "#9333EA",
    blue: "#2563EB",
};

const GRADE_COLORS = [
    "#4F46E5",
    "#2563EB",
    "#0891B2",
    "#16A34A",
    "#84CC16",
    "#D97706",
    "#DC2626",
];

const getData = (response) =>
    response?.data?.data ?? response?.data ?? response ?? {};

const formatNumber = (value, decimals = 1) => {
    const number = Number(value ?? 0);
    return Number.isFinite(number) ? number.toFixed(decimals) : "0.0";
};

const formatPercentage = (value) => `${formatNumber(value)}%`;

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-base-300 bg-base-100 p-3 shadow-lg">
            <p className="mb-2 text-sm font-semibold">{label}</p>

            {payload.map((item, index) => (
                <p
                    key={index}
                    className="text-sm"
                    style={{ color: item.color }}
                >
                    {item.name}: {item.value}
                    {item.name?.toLowerCase().includes("percentage") ? "%" : ""}
                </p>
            ))}
        </div>
    );
};

const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    color,
    trend,
}) => (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-base-content/60">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {value}
                    </h2>

                    <p className="mt-2 text-xs text-base-content/50">
                        {description}
                    </p>
                </div>

                <div
                    className="rounded-2xl p-3"
                    style={{
                        backgroundColor: `${color}18`,
                        color,
                    }}
                >
                    <Icon size={25} />
                </div>
            </div>

            {trend !== undefined && trend !== null && (
                <div className="mt-3 flex items-center gap-1 text-xs">
                    {Number(trend) >= 0 ? (
                        <TrendingUp size={15} className="text-success" />
                    ) : (
                        <TrendingDown size={15} className="text-error" />
                    )}

                    <span
                        className={
                            Number(trend) >= 0
                                ? "text-success"
                                : "text-error"
                        }
                    >
                        {formatNumber(Math.abs(Number(trend)))}% compared
                        with previous examination
                    </span>
                </div>
            )}
        </div>
    </div>
);

const ChartCard = ({ title, subtitle, children }) => (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
            <div className="mb-4">
                <h3 className="text-lg font-bold">{title}</h3>
                {subtitle && (
                    <p className="mt-1 text-sm text-base-content/50">
                        {subtitle}
                    </p>
                )}
            </div>

            {children}
        </div>
    </div>
);

const EmptyChart = ({ message = "No analytics data available." }) => (
    <div className="flex h-64 flex-col items-center justify-center text-center text-base-content/50">
        <AlertCircle size={35} className="mb-3 opacity-50" />
        <p className="text-sm">{message}</p>
    </div>
);

const ResultAnalytics = () => {
    const [selectedSection, setSelectedSection] = useState("");
    const [selectedExam, setSelectedExam] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const filters = useMemo(
        () => ({
            ...(selectedSection && { sectionId: selectedSection }),
            ...(selectedExam && { examId: selectedExam }),
        }),
        [selectedSection, selectedExam]
    );

    // 1. Overall analytics
    const {
        data: overviewResponse,
        isLoading: overviewLoading,
        isError: overviewError,
        refetch: refetchOverview,
    } = useQuery({
        queryKey: ["teacher-result-analytics-overview", filters],
        queryFn: async () => {
            const response = await api.get(
                "/teacher/results/analytics/overview",
                { params: filters }
            );
            return getData(response);
        },
    });

    // 2. Subject-wise performance
    const { data: subjectResponse, isLoading: subjectLoading } = useQuery({
        queryKey: ["teacher-result-subject-performance", filters],
        queryFn: async () => {
            const response = await api.get(
                "/teacher/results/analytics/subject-performance",
                { params: filters }
            );
            return getData(response);
        },
    });

    // 3. Grade distribution
    const { data: gradeResponse, isLoading: gradeLoading } = useQuery({
        queryKey: ["teacher-result-grade-distribution", filters],
        queryFn: async () => {
            const response = await api.get(
                "/teacher/results/analytics/grade-distribution",
                { params: filters }
            );
            return getData(response);
        },
    });

    // 4. Student performance
    const { data: studentResponse, isLoading: studentLoading } = useQuery({
        queryKey: ["teacher-result-student-performance", filters],
        queryFn: async () => {
            const response = await api.get(
                "/teacher/results/analytics/student-performance",
                { params: filters }
            );
            return getData(response);
        },
    });

    // 5. Examination comparison
    const { data: comparisonResponse, isLoading: comparisonLoading } =
        useQuery({
            queryKey: ["teacher-result-exam-comparison", filters],
            queryFn: async () => {
                const response = await api.get(
                    "/teacher/results/analytics/exam-comparison",
                    { params: filters }
                );
                return getData(response);
            },
        });

    const overview = overviewResponse?.overview ?? overviewResponse ?? {};

    const subjectPerformance =
        subjectResponse?.subjects ??
        subjectResponse?.subjectPerformance ??
        [];

    const gradeDistribution =
        gradeResponse?.grades ??
        gradeResponse?.distribution ??
        [];

    const studentPerformance =
        studentResponse?.students ??
        studentResponse?.studentPerformance ??
        [];

    const examComparison =
        comparisonResponse?.examinations ??
        comparisonResponse?.comparison ??
        [];

    // Filters can be populated by the overview API.
    const sections = overviewResponse?.sections ?? [];
    const examinations = overviewResponse?.examinations ?? [];

    const filteredStudents = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) return studentPerformance;

        return studentPerformance.filter((student) =>
            [
                student.student_name,
                student.full_name,
                student.student_id,
                student.roll_number,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(search)
                )
        );
    }, [studentPerformance, searchTerm]);

    const isLoading =
        overviewLoading ||
        subjectLoading ||
        gradeLoading ||
        studentLoading ||
        comparisonLoading;

    const handleRefresh = () => {
        refetchOverview();
    };

    if (overviewError) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
                <AlertCircle size={45} className="text-error" />

                <h2 className="text-xl font-bold">
                    Unable to load result analytics
                </h2>

                <p className="text-sm text-base-content/60">
                    Please check your connection and try again.
                </p>

                <button
                    onClick={handleRefresh}
                    className="btn btn-primary"
                >
                    <RefreshCw size={17} />
                    Try Again
                </button>
            </div>
        );
    }

    if (isLoading && !overviewResponse) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-primary/10 p-2 text-primary">
                            <GraduationCap size={25} />
                        </div>

                        <h1 className="text-2xl font-bold md:text-3xl">
                            Result Analytics
                        </h1>
                    </div>

                    <p className="mt-2 text-sm text-base-content/60">
                        Analyze examination results and monitor student
                        academic performance.
                    </p>
                </div>

                <button
                    onClick={handleRefresh}
                    className="btn btn-outline btn-sm"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body gap-4 p-4 md:flex-row md:items-end">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">
                                Select Section
                            </span>
                        </label>

                        <select
                            className="select select-bordered w-full"
                            value={selectedSection}
                            onChange={(event) =>
                                setSelectedSection(event.target.value)
                            }
                        >
                            <option value="">All Assigned Sections</option>

                            {sections.map((section) => (
                                <option
                                    key={section.section_id ?? section._id}
                                    value={section.section_id ?? section._id}
                                >
                                    {section.class_name
                                        ? `${section.class_name} - ${section.name}`
                                        : section.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">
                                Select Examination
                            </span>
                        </label>

                        <select
                            className="select select-bordered w-full"
                            value={selectedExam}
                            onChange={(event) =>
                                setSelectedExam(event.target.value)
                            }
                        >
                            <option value="">All Examinations</option>

                            {examinations.map((exam) => (
                                <option
                                    key={exam.exam_id ?? exam._id}
                                    value={exam.exam_id ?? exam._id}
                                >
                                    {exam.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => {
                            setSelectedSection("");
                            setSelectedExam("");
                        }}
                        className="btn btn-ghost"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Students"
                    value={overview.total_students ?? 0}
                    description="Students in assigned sections"
                    icon={Users}
                    color={COLORS.primary}
                />

                <StatCard
                    title="Average Percentage"
                    value={formatPercentage(
                        overview.average_percentage ??
                        overview.average_marks_percentage
                    )}
                    description="Overall average performance"
                    icon={TrendingUp}
                    color={COLORS.success}
                    trend={overview.average_change}
                />

                <StatCard
                    title="Pass Rate"
                    value={formatPercentage(overview.pass_rate)}
                    description={`${overview.passed_students ?? 0} students passed`}
                    icon={Award}
                    color={COLORS.blue}
                />

                <StatCard
                    title="Fail Rate"
                    value={formatPercentage(overview.fail_rate)}
                    description={`${overview.failed_students ?? 0} students failed`}
                    icon={Target}
                    color={COLORS.danger}
                />
            </div>

            {/* Secondary Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <p className="text-sm text-base-content/60">
                        Highest Marks
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-success">
                        {formatNumber(overview.highest_marks, 0)}
                    </h3>
                </div>

                <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <p className="text-sm text-base-content/60">
                        Lowest Marks
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-error">
                        {formatNumber(overview.lowest_marks, 0)}
                    </h3>
                </div>

                <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <p className="text-sm text-base-content/60">
                        Results Submitted
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-primary">
                        {overview.submitted_students ?? 0}
                        <span className="ml-2 text-sm font-normal text-base-content/50">
                            / {overview.total_students ?? 0}
                        </span>
                    </h3>
                </div>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {/* Subject Performance */}
                <ChartCard
                    title="Subject-wise Performance"
                    subtitle="Average percentage achieved in each subject"
                >
                    {subjectPerformance.length === 0 ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={subjectPerformance}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -15,
                                    bottom: 10,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    opacity={0.2}
                                />

                                <XAxis
                                    dataKey="subject_name"
                                    tick={{ fontSize: 11 }}
                                    interval={0}
                                />

                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fontSize: 12 }}
                                />

                                <Tooltip content={<CustomTooltip />} />

                                <Bar
                                    dataKey="average_percentage"
                                    name="Average Percentage"
                                    fill={COLORS.primary}
                                    radius={[7, 7, 0, 0]}
                                    maxBarSize={55}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                {/* Pass Fail Distribution */}
                <ChartCard
                    title="Pass / Fail Distribution"
                    subtitle="Percentage of students who passed or failed"
                >
                    {(overview.passed_students ?? 0) +
                        (overview.failed_students ?? 0) === 0 ? (
                        <EmptyChart />
                    ) : (
                        <div className="relative">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            {
                                                name: "Passed",
                                                value: overview.passed_students ?? 0,
                                            },
                                            {
                                                name: "Failed",
                                                value: overview.failed_students ?? 0,
                                            },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={75}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill={COLORS.success} />
                                        <Cell fill={COLORS.danger} />
                                    </Pie>

                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-5">
                                <span className="text-3xl font-bold">
                                    {formatPercentage(overview.pass_rate)}
                                </span>
                                <span className="text-xs text-base-content/50">
                                    Pass Rate
                                </span>
                            </div>
                        </div>
                    )}
                </ChartCard>

                {/* Grade Distribution */}
                <ChartCard
                    title="Grade Distribution"
                    subtitle="Number of students in each grade"
                >
                    {gradeDistribution.length === 0 ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={gradeDistribution}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -15,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    opacity={0.2}
                                />

                                <XAxis
                                    dataKey="grade"
                                    tick={{ fontSize: 12 }}
                                />

                                <YAxis tick={{ fontSize: 12 }} />

                                <Tooltip />

                                <Bar
                                    dataKey="count"
                                    name="Students"
                                    radius={[7, 7, 0, 0]}
                                >
                                    {gradeDistribution.map((item, index) => (
                                        <Cell
                                            key={item.grade ?? index}
                                            fill={
                                                GRADE_COLORS[
                                                    index % GRADE_COLORS.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                {/* Examination Comparison */}
                <ChartCard
                    title="Examination Performance Trend"
                    subtitle="Average percentage across examinations"
                >
                    {examComparison.length === 0 ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={examComparison}
                                margin={{
                                    top: 10,
                                    right: 15,
                                    left: -15,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    opacity={0.2}
                                />

                                <XAxis
                                    dataKey="exam_name"
                                    tick={{ fontSize: 11 }}
                                />

                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fontSize: 12 }}
                                />

                                <Tooltip content={<CustomTooltip />} />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="average_percentage"
                                    name="Average Percentage"
                                    stroke={COLORS.primary}
                                    strokeWidth={3}
                                    dot={{ r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>
            </div>

            {/* Student Performance */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body p-5">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <h3 className="text-lg font-bold">
                                Student Performance
                            </h3>

                            <p className="mt-1 text-sm text-base-content/50">
                                Individual student examination performance
                            </p>
                        </div>

                        <div className="relative w-full md:w-72">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                            />

                            <input
                                type="text"
                                placeholder="Search student..."
                                className="input input-bordered w-full pl-10"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student</th>
                                    <th>Student ID</th>
                                    <th>Roll</th>
                                    <th>Obtained Marks</th>
                                    <th>Percentage</th>
                                    <th>Grade</th>
                                    <th>Result</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="py-10 text-center text-base-content/50"
                                        >
                                            No student performance data found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student, index) => {
                                        const passed =
                                            student.result === "pass";

                                        return (
                                            <tr
                                                key={
                                                    student.student_id ??
                                                    student._id ??
                                                    index
                                                }
                                            >
                                                <td>{index + 1}</td>

                                                <td className="font-medium">
                                                    {student.student_name ??
                                                        student.full_name ??
                                                        "Unknown Student"}
                                                </td>

                                                <td>
                                                    {student.student_id ?? "-"}
                                                </td>

                                                <td>
                                                    {student.roll_number ?? "-"}
                                                </td>

                                                <td>
                                                    {formatNumber(
                                                        student.obtained_marks,
                                                        0
                                                    )}
                                                    {" / "}
                                                    {formatNumber(
                                                        student.total_marks,
                                                        0
                                                    )}
                                                </td>

                                                <td>
                                                    {formatPercentage(
                                                        student.percentage
                                                    )}
                                                </td>

                                                <td>
                                                    <span className="font-bold">
                                                        {student.grade ?? "-"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            passed
                                                                ? "badge-success"
                                                                : "badge-error"
                                                        } badge-outline`}
                                                    >
                                                        {student.result ??
                                                            "Pending"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm text-base-content/50">
                        <span>
                            Showing {filteredStudents.length} students
                        </span>

                        <span className="flex items-center gap-1">
                            <BookOpen size={15} />
                            Result Analytics
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultAnalytics;
