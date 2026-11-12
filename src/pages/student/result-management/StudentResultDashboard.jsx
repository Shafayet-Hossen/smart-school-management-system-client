
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Award,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ClipboardList,
    Download,
    FileText,
    GraduationCap,
    Search,
    TrendingUp,
    TrendingDown,
    Trophy,
    XCircle,
    RefreshCw,
    Target,
    BarChart3,
    Filter,
    Loader2,
    AlertCircle,
} from "lucide-react";

import { getStudentResultOverview } from "../../../services/studentResultService";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const formatNumber = (value, digits = 2) => {
    const number = Number(value);
    return Number.isFinite(number) ? number.toFixed(digits) : "0.00";
};

const getGradeColor = (grade) => {
    if (grade === "A+" || grade === "A") {
        return "badge-success";
    }

    if (grade === "A-" || grade === "B") {
        return "badge-info";
    }

    if (grade === "C" || grade === "D") {
        return "badge-warning";
    }

    return "badge-error";
};

const getResultColor = (result) => {
    return String(result).toLowerCase() === "pass"
        ? "badge-success"
        : "badge-error";
};

const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

// --------------------------------------------------
// Summary Card
// --------------------------------------------------

const SummaryCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    trend,
}) => {
    const colorClasses = {
        primary: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        error: "bg-error/10 text-error",
        info: "bg-info/10 text-info",
        secondary: "bg-secondary/10 text-secondary",
    };

    return (
        <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm text-base-content/60">
                            {title}
                        </p>

                        <h3 className="text-2xl font-bold mt-2">
                            {value}
                        </h3>

                        {subtitle && (
                            <p className="text-xs text-base-content/50 mt-2">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div
                        className={`p-3 rounded-xl ${
                            colorClasses[color] || colorClasses.primary
                        }`}
                    >
                        <Icon size={23} />
                    </div>
                </div>

                {trend && (
                    <div className="flex items-center gap-1 mt-3 text-xs">
                        {trend.direction === "up" ? (
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
                                trend.direction === "up"
                                    ? "text-success"
                                    : "text-error"
                            }
                        >
                            {trend.label}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

// --------------------------------------------------
// Performance Bar
// --------------------------------------------------

const PerformanceBar = ({ subject, percentage }) => {
    const value = Math.min(
        100,
        Math.max(0, Number(percentage) || 0)
    );

    const color =
        value >= 80
            ? "progress-success"
            : value >= 60
            ? "progress-info"
            : value >= 40
            ? "progress-warning"
            : "progress-error";

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center gap-3">
                <span className="text-sm font-medium truncate">
                    {subject}
                </span>

                <span className="text-sm font-semibold">
                    {formatNumber(value, 1)}%
                </span>
            </div>

            <progress
                className={`progress ${color} w-full`}
                value={value}
                max="100"
            />
        </div>
    );
};

// --------------------------------------------------
// Examination Performance Chart
// --------------------------------------------------

const PerformanceChart = ({ data = [] }) => {
    const chartData = useMemo(() => {
        return [...data]
            .sort((a, b) => {
                return (
                    new Date(a.exam_date || 0) -
                    new Date(b.exam_date || 0)
                );
            })
            .slice(-8);
    }, [data]);

    if (!chartData.length) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-base-content/50">
                <BarChart3 size={42} className="mb-3 opacity-40" />
                <p>No performance data available.</p>
            </div>
        );
    }

    const width = 700;
    const height = 260;
    const paddingLeft = 42;
    const paddingRight = 15;
    const paddingTop = 20;
    const paddingBottom = 48;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const points = chartData.map((item, index) => {
        const percentage = Math.min(
            100,
            Math.max(0, Number(item.average_percentage) || 0)
        );

        const x =
            paddingLeft +
            (chartData.length === 1
                ? chartWidth / 2
                : (index / (chartData.length - 1)) * chartWidth);

        const y =
            paddingTop +
            chartHeight -
            (percentage / 100) * chartHeight;

        return {
            x,
            y,
            percentage,
            name: item.exam_name,
        };
    });

    const path = points
        .map(
            (point, index) =>
                `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
        )
        .join(" ");

    const areaPath = [
        `M ${points[0].x} ${paddingTop + chartHeight}`,
        ...points.map((point) => `L ${point.x} ${point.y}`),
        `L ${points[points.length - 1].x} ${paddingTop + chartHeight}`,
        "Z",
    ].join(" ");

    return (
        <div className="w-full overflow-x-auto">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full min-w-[500px]"
                role="img"
                aria-label="Examination performance trend chart"
            >
                {[0, 25, 50, 75, 100].map((value) => {
                    const y =
                        paddingTop +
                        chartHeight -
                        (value / 100) * chartHeight;

                    return (
                        <g key={value}>
                            <line
                                x1={paddingLeft}
                                y1={y}
                                x2={width - paddingRight}
                                y2={y}
                                stroke="currentColor"
                                strokeOpacity="0.12"
                                strokeDasharray="4 4"
                            />

                            <text
                                x={paddingLeft - 10}
                                y={y + 4}
                                textAnchor="end"
                                fontSize="11"
                                fill="currentColor"
                                opacity="0.6"
                            >
                                {value}
                            </text>
                        </g>
                    );
                })}

                <path
                    d={areaPath}
                    fill="currentColor"
                    opacity="0.08"
                />

                <path
                    d={path}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {points.map((point, index) => (
                    <g key={`${point.name}-${index}`}>
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill="#3B82F6"
                            stroke="currentColor"
                            strokeWidth="2"
                        />

                        <text
                            x={point.x}
                            y={point.y - 12}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="600"
                            fill="currentColor"
                        >
                            {formatNumber(point.percentage, 0)}%
                        </text>

                        <text
                            x={point.x}
                            y={height - 18}
                            textAnchor="middle"
                            fontSize="10"
                            fill="currentColor"
                            opacity="0.7"
                        >
                            {point.name?.length > 12
                                ? `${point.name.slice(0, 12)}...`
                                : point.name || "Exam"}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

// --------------------------------------------------
// Main Component
// --------------------------------------------------

const StudentResultDashboard = () => {
    const [academicYear, setAcademicYear] = useState("");
    const [examId, setExamId] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: [
            "student-result-overview",
            academicYear,
            examId,
            subjectId,
        ],
        queryFn: () =>
            getStudentResultOverview({
                academicYear,
                examId,
                subjectId,
            }),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    const summary = data?.summary || {};
    const student = data?.student || {};
    const recentResults = data?.recent_results || [];
    const subjectPerformance = data?.subject_performance || [];
    const performance = data?.performance || [];
    const examinations = data?.examinations || [];
    const subjects = data?.subjects || [];

    const academicYears = data?.academic_years || [];

    const filteredResults = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) return recentResults;

        return recentResults.filter((item) =>
            [
                item.exam_name,
                item.subject_name,
                item.grade,
                item.result,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(search)
                )
        );
    }, [recentResults, searchTerm]);

    const handleResetFilters = () => {
        setAcademicYear("");
        setExamId("");
        setSubjectId("");
        setSearchTerm("");
    };

    // --------------------------------------------------
    // Loading
    // --------------------------------------------------

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
                <span className="loading loading-spinner loading-lg text-primary" />
                <p className="text-sm text-base-content/60">
                    Loading your academic results...
                </p>
            </div>
        );
    }

    // --------------------------------------------------
    // Error
    // --------------------------------------------------

    if (isError) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center p-5">
                <div className="card bg-base-100 border border-error/20 shadow-sm max-w-md w-full">
                    <div className="card-body items-center text-center">
                        <AlertCircle
                            size={45}
                            className="text-error"
                        />

                        <h2 className="card-title">
                            Unable to Load Results
                        </h2>

                        <p className="text-sm text-base-content/60">
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Something went wrong while loading your results."}
                        </p>

                        <button
                            onClick={() => refetch()}
                            className="btn btn-primary btn-sm mt-3"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --------------------------------------------------
    // Main UI
    // --------------------------------------------------

    return (
        <div className="space-y-6 pb-10">
            {/* Page Header */}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-base-content/50 mb-2">
                        <GraduationCap size={17} />
                        <span>Student Portal</span>
                        <span>/</span>
                        <span>Result Management</span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold">
                        Result Overview
                    </h1>

                    <p className="text-sm text-base-content/60 mt-1">
                        Track your academic performance and examination results.
                    </p>
                </div>

                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="btn btn-outline btn-sm"
                >
                    <RefreshCw
                        size={16}
                        className={isFetching ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Student Information */}

            <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-md">
                <div className="card-body p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                                <GraduationCap size={30} />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold">
                                    {student.full_name || "Student"}
                                </h2>

                                <p className="text-sm opacity-80">
                                    Student ID: {student.student_code || "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div>
                                <p className="opacity-70">Class</p>
                                <p className="font-semibold">
                                    {student.class_name || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="opacity-70">Section</p>
                                <p className="font-semibold">
                                    {student.section_name || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="opacity-70">Roll Number</p>
                                <p className="font-semibold">
                                    {student.roll_number || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="opacity-70">Academic Year</p>
                                <p className="font-semibold">
                                    {data?.academic_year || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}

            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <h2 className="font-semibold flex items-center gap-2">
                            <Filter size={18} />
                            Filter Results
                        </h2>

                        <button
                            onClick={handleResetFilters}
                            className="btn btn-ghost btn-xs text-primary"
                        >
                            <XCircle size={15} />
                            Reset Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <label className="form-control">
                            <span className="label-text text-xs mb-1">
                                Academic Year
                            </span>

                            <select
                                className="select select-bordered select-sm"
                                value={academicYear}
                                onChange={(e) =>
                                    setAcademicYear(e.target.value)
                                }
                            >
                                <option value="">All Academic Years</option>

                                {academicYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="form-control">
                            <span className="label-text text-xs mb-1">
                                Examination
                            </span>

                            <select
                                className="select select-bordered select-sm"
                                value={examId}
                                onChange={(e) =>
                                    setExamId(e.target.value)
                                }
                            >
                                <option value="">All Examinations</option>

                                {examinations.map((exam) => (
                                    <option
                                        key={exam.exam_id}
                                        value={exam.exam_id}
                                    >
                                        {exam.exam_name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="form-control">
                            <span className="label-text text-xs mb-1">
                                Subject
                            </span>

                            <select
                                className="select select-bordered select-sm"
                                value={subjectId}
                                onChange={(e) =>
                                    setSubjectId(e.target.value)
                                }
                            >
                                <option value="">All Subjects</option>

                                {subjects.map((subject) => (
                                    <option
                                        key={subject.subject_id}
                                        value={subject.subject_id}
                                    >
                                        {subject.subject_name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="form-control">
                            <span className="label-text text-xs mb-1">
                                Search Results
                            </span>

                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                                />

                                <input
                                    type="text"
                                    className="input input-bordered input-sm w-full pl-9"
                                    placeholder="Search exam or subject..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Examinations"
                    value={summary.total_exams ?? 0}
                    subtitle="Examinations with published results"
                    icon={ClipboardList}
                    color="primary"
                />

                <SummaryCard
                    title="Average Percentage"
                    value={`${formatNumber(summary.average_percentage, 1)}%`}
                    subtitle="Your overall average"
                    icon={Target}
                    color="info"
                />

                <SummaryCard
                    title="Overall GPA"
                    value={formatNumber(summary.average_gpa)}
                    subtitle="Average grade point"
                    icon={Award}
                    color="success"
                />

                <SummaryCard
                    title="Passed Subjects"
                    value={summary.passed_subjects ?? 0}
                    subtitle={`${summary.failed_subjects ?? 0} failed subjects`}
                    icon={CheckCircle2}
                    color="warning"
                />
            </div>

            {/* Additional Statistics */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard
                    title="Failed Subjects"
                    value={summary.failed_subjects ?? 0}
                    subtitle="Subjects below passing marks"
                    icon={XCircle}
                    color="error"
                />

                <SummaryCard
                    title="Highest Marks"
                    value={summary.highest_marks ?? 0}
                    subtitle="Best obtained marks"
                    icon={Trophy}
                    color="success"
                />

                <SummaryCard
                    title="Lowest Marks"
                    value={summary.lowest_marks ?? 0}
                    subtitle="Lowest obtained marks"
                    icon={TrendingDown}
                    color="warning"
                />
            </div>

            {/* Charts */}

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
                {/* Examination Performance */}

                <div className="card bg-base-100 border border-base-200 shadow-sm xl:col-span-3">
                    <div className="card-body p-5">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="font-bold text-lg">
                                    Academic Performance
                                </h2>

                                <p className="text-xs text-base-content/50 mt-1">
                                    Examination-wise average percentage
                                </p>
                            </div>

                            <BarChart3
                                size={21}
                                className="text-primary"
                            />
                        </div>

                        <div className="mt-5">
                            <PerformanceChart data={performance} />
                        </div>
                    </div>
                </div>

                {/* Performance Summary */}

                <div className="card bg-base-100 border border-base-200 shadow-sm xl:col-span-2">
                    <div className="card-body p-5">
                        <h2 className="font-bold text-lg">
                            Performance Summary
                        </h2>

                        <p className="text-xs text-base-content/50">
                            Your overall result distribution
                        </p>

                        <div className="space-y-5 mt-5">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Pass Rate</span>
                                    <span className="font-bold">
                                        {formatNumber(summary.pass_rate, 1)}%
                                    </span>
                                </div>

                                <progress
                                    className="progress progress-success w-full"
                                    value={summary.pass_rate || 0}
                                    max="100"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Average Percentage</span>
                                    <span className="font-bold">
                                        {formatNumber(
                                            summary.average_percentage,
                                            1
                                        )}
                                        %
                                    </span>
                                </div>

                                <progress
                                    className="progress progress-info w-full"
                                    value={summary.average_percentage || 0}
                                    max="100"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Passed Subjects</span>
                                    <span className="font-bold text-success">
                                        {summary.passed_subjects || 0}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Failed Subjects</span>
                                    <span className="font-bold text-error">
                                        {summary.failed_subjects || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="divider my-2" />

                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <Award size={23} />
                            </div>

                            <div>
                                <p className="text-xs text-base-content/50">
                                    Overall Academic GPA
                                </p>

                                <p className="text-xl font-bold">
                                    {formatNumber(summary.average_gpa)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subject Performance */}

            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-5">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="font-bold text-lg">
                                Subject-wise Performance
                            </h2>

                            <p className="text-xs text-base-content/50 mt-1">
                                Your average performance in each subject
                            </p>
                        </div>

                        <BookOpen
                            size={22}
                            className="text-primary"
                        />
                    </div>

                    {subjectPerformance.length === 0 ? (
                        <div className="text-center py-10 text-base-content/50">
                            <BookOpen
                                size={35}
                                className="mx-auto mb-3 opacity-40"
                            />
                            <p>No subject performance data available.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                            {subjectPerformance.map((subject) => (
                                <div key={subject.subject_id}>
                                    <PerformanceBar
                                        subject={subject.subject_name}
                                        percentage={
                                            subject.average_percentage
                                        }
                                    />

                                    <p className="text-xs text-base-content/50 mt-1">
                                        {subject.exam_count || 0} examination(s)
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Results */}

            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="font-bold text-lg">
                                Recent Examination Results
                            </h2>

                            <p className="text-xs text-base-content/50 mt-1">
                                Your recently published subject results
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-base-content/50">
                            <FileText size={17} />
                            {filteredResults.length} result(s)
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Examination</th>
                                    <th>Subject</th>
                                    <th>Marks</th>
                                    <th>Percentage</th>
                                    <th>Grade</th>
                                    <th>GPA</th>
                                    <th>Result</th>
                                    <th>Published Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredResults.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="text-center py-12 text-base-content/50"
                                        >
                                            No published results found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredResults.map((result, index) => (
                                        <tr
                                            key={`${result.exam_id}-${result.subject_id}-${index}`}
                                        >
                                            <td>{index + 1}</td>

                                            <td>
                                                <div className="font-medium">
                                                    {result.exam_name}
                                                </div>

                                                <div className="text-xs text-base-content/50">
                                                    {result.academic_year || ""}
                                                </div>
                                            </td>

                                            <td className="font-medium">
                                                {result.subject_name}
                                            </td>

                                            <td>
                                                <span className="font-semibold">
                                                    {result.obtained_marks}
                                                </span>
                                                <span className="text-base-content/50">
                                                    {" "}
                                                    / {result.total_marks}
                                                </span>
                                            </td>

                                            <td>
                                                {formatNumber(
                                                    result.percentage,
                                                    1
                                                )}
                                                %
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getGradeColor(
                                                        result.grade
                                                    )}`}
                                                >
                                                    {result.grade || "N/A"}
                                                </span>
                                            </td>

                                            <td className="font-semibold">
                                                {formatNumber(
                                                    result.grade_point
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getResultColor(
                                                        result.result
                                                    )}`}
                                                >
                                                    {result.result || "N/A"}
                                                </span>
                                            </td>

                                            <td className="text-xs whitespace-nowrap">
                                                {formatDate(
                                                    result.published_at
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer Information */}

            <div className="alert bg-info/10 border border-info/20 text-base-content">
                <AlertCircle
                    size={20}
                    className="text-info shrink-0"
                />

                <div>
                    <h3 className="font-semibold text-sm">
                        Result Information
                    </h3>

                    <p className="text-xs text-base-content/60 mt-1">
                        This overview displays only officially published
                        examination results. Draft and unpublished marks
                        are not included.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentResultDashboard;
