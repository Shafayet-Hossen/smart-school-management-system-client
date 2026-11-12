
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Award,
    BookOpen,
    TrendingUp,
    TrendingDown,
    GraduationCap,
    Users,
    RefreshCw,
    AlertCircle,
    Trophy,
    CalendarDays,
    Target,
    BarChart3,
} from "lucide-react";

import { getParentResultDashboard } from "../../../services/parentResultService";

const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatPercentage = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? `${number.toFixed(2)}%`
        : "—";
};

const getGradeColor = (grade) => {
    const normalized = String(grade || "").toUpperCase();

    if (normalized === "F") return "badge-error";
    if (normalized === "A+" || normalized === "A") {
        return "badge-success";
    }
    if (normalized === "A-" || normalized === "B") {
        return "badge-info";
    }

    return "badge-warning";
};

const getResultColor = (result) => {
    return String(result || "").toLowerCase() === "pass"
        ? "badge-success"
        : "badge-error";
};

export default function ParentResultDashboard() {
    const [selectedStudentId, setSelectedStudentId] = useState("");

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: [
            "parent-result-dashboard",
            selectedStudentId,
        ],
        queryFn: () =>
            getParentResultDashboard({
                ...(selectedStudentId
                    ? { studentId: selectedStudentId }
                    : {}),
            }),
        staleTime: 1000 * 60 * 5,
    });
    // console.log("parent result dashboard ",data);
    const children = data?.children || [];
    const summary = data?.summary || {};
    const recentResults = data?.recent_results || [];
    const performance = data?.performance || [];
    const subjectPerformance = data?.subject_performance || [];
    const examSummaries = data?.exam_summaries || [];

    const selectedChild = children.find(
        (child) => child.student_id === selectedStudentId
    );

    const averagePercentage = Number(
        summary.average_percentage ?? 0
    );

    const passedSubjects = Number(summary.passed_subjects ?? 0);
    const failedSubjects = Number(summary.failed_subjects ?? 0);

    const passRate = useMemo(() => {
        const total = passedSubjects + failedSubjects;

        if (!total) return 0;

        return (passedSubjects / total) * 100;
    }, [passedSubjects, failedSubjects]);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-error">
                <AlertCircle size={20} />

                <div className="flex-1">
                    <h3 className="font-semibold">
                        Unable to load result dashboard
                    </h3>

                    <p className="text-sm">
                        {error?.response?.data?.message ||
                            error?.message ||
                            "Something went wrong."}
                    </p>
                </div>

                <button
                    className="btn btn-sm"
                    onClick={() => refetch()}
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <GraduationCap
                            size={28}
                            className="text-primary"
                        />

                        <h1 className="text-2xl font-bold">
                            Result Dashboard
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-base-content/60">
                        Monitor your children's academic performance
                        and examination results.
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

            {/* Child Selector */}
            {children.length > 0 && (
                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-4">
                        <div className="flex items-center gap-2">
                            <Users
                                size={20}
                                className="text-primary"
                            />

                            <span className="font-semibold">
                                Select Child
                            </span>
                        </div>

                        <select
                            className="select select-bordered mt-2 w-full max-w-md"
                            value={selectedStudentId}
                            onChange={(event) =>
                                setSelectedStudentId(event.target.value)
                            }
                        >
                            <option value="">All Children</option>

                            {children.map((child) => (
                                <option
                                    key={child.student_id}
                                    value={child.student_id}
                                >
                                    {child.full_name}
                                    {child.class_name
                                        ? ` — ${child.class_name}`
                                        : ""}
                                    {child.section_name
                                        ? ` (${child.section_name})`
                                        : ""}
                                </option>
                            ))}
                        </select>

                        {selectedChild && (
                            <p className="mt-2 text-xs text-base-content/60">
                                Student ID: {selectedChild.student_code || "—"}
                                {" | "}
                                Roll: {selectedChild.roll_number || "—"}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Selected Student Information */}
            {selectedChild && (
                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body flex-row items-center gap-4 p-4">
                        <div className="avatar placeholder">
                            <div className="w-14 rounded-full bg-primary/10 text-primary">
                                <span className="text-xl font-bold">
                                    {selectedChild.full_name
                                        ?.charAt(0)
                                        ?.toUpperCase() || "S"}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h2 className="font-bold">
                                {selectedChild.full_name}
                            </h2>

                            <p className="text-sm text-base-content/60">
                                {selectedChild.class_name || "Class"}
                                {selectedChild.section_name
                                    ? ` • Section ${selectedChild.section_name}`
                                    : ""}
                                {selectedChild.roll_number
                                    ? ` • Roll ${selectedChild.roll_number}`
                                    : ""}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    title="Total Examinations"
                    value={summary.total_exams ?? 0}
                    description="Examinations with published results"
                    icon={<BookOpen size={22} />}
                    color="text-primary"
                    bg="bg-primary/10"
                />

                <SummaryCard
                    title="Published Results"
                    value={summary.published_results ?? 0}
                    description="Available examination results"
                    icon={<Award size={22} />}
                    color="text-success"
                    bg="bg-success/10"
                />

                <SummaryCard
                    title="Passed Subjects"
                    value={passedSubjects}
                    description="Subjects successfully passed"
                    icon={<TrendingUp size={22} />}
                    color="text-info"
                    bg="bg-info/10"
                />

                <SummaryCard
                    title="Failed Subjects"
                    value={failedSubjects}
                    description="Subjects requiring improvement"
                    icon={<TrendingDown size={22} />}
                    color="text-error"
                    bg="bg-error/10"
                />
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="card border border-base-300 bg-base-100 shadow-sm lg:col-span-2">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Overall Performance
                                </h2>

                                <p className="text-sm text-base-content/60">
                                    Published examination results
                                </p>
                            </div>

                            <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                <BarChart3 size={22} />
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-base-content/60">
                                    Average Percentage
                                </p>

                                <h2 className="mt-2 text-4xl font-bold">
                                    {formatPercentage(
                                        summary.average_percentage
                                    )}
                                </h2>

                                <progress
                                    className="progress progress-primary mt-4 w-full"
                                    value={Math.min(
                                        100,
                                        Math.max(0, averagePercentage)
                                    )}
                                    max="100"
                                />

                                <p className="mt-2 text-xs text-base-content/60">
                                    Average of published subject results
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Average GPA
                                </p>

                                <h2 className="mt-2 text-4xl font-bold">
                                    {Number.isFinite(
                                        Number(summary.average_gpa)
                                    )
                                        ? Number(
                                              summary.average_gpa
                                          ).toFixed(2)
                                        : "—"}
                                </h2>

                                <p className="mt-2 text-xs text-base-content/60">
                                    Based on published results
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pass Rate */}
                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body items-center justify-center text-center">
                        <div className="flex w-full items-center justify-between">
                            <h2 className="text-lg font-bold">
                                Pass Rate
                            </h2>

                            <Target
                                size={22}
                                className="text-success"
                            />
                        </div>

                        <div
                            className="radial-progress text-success my-4"
                            style={{
                                "--value": passRate,
                                "--size": "9rem",
                                "--thickness": "10px",
                            }}
                            role="progressbar"
                            aria-valuenow={Math.round(passRate)}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            <span className="text-2xl font-bold text-base-content">
                                {passRate.toFixed(1)}%
                            </span>
                        </div>

                        <p className="text-sm text-base-content/60">
                            {passedSubjects} passed out of{" "}
                            {passedSubjects + failedSubjects} subjects
                        </p>
                    </div>
                </div>
            </div>

            {/* Performance Trend */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold">
                                Academic Performance Trend
                            </h2>

                            <p className="text-sm text-base-content/60">
                                Average percentage across examinations
                            </p>
                        </div>

                        <TrendingUp
                            size={22}
                            className="text-primary"
                        />
                    </div>

                    {performance.length > 0 ? (
                        <PerformanceChart data={performance} />
                    ) : (
                        <EmptyState message="No performance trend is available yet." />
                    )}
                </div>
            </div>

            {/* Subject Performance */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <div>
                        <h2 className="text-lg font-bold">
                            Subject-wise Performance
                        </h2>

                        <p className="text-sm text-base-content/60">
                            Average marks by subject from published results
                        </p>
                    </div>

                    {subjectPerformance.length === 0 ? (
                        <EmptyState message="No subject performance data is available yet." />
                    ) : (
                        <div className="mt-3 space-y-5">
                            {subjectPerformance.map((subject, index) => {
                                const percentage = Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        Number(subject.average_percentage) || 0
                                    )
                                );

                                return (
                                    <div
                                        key={`${subject.subject_id || subject.subject_name}-${index}`}
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="font-semibold">
                                                    {subject.subject_name}
                                                </p>

                                                <p className="text-xs text-base-content/60">
                                                    {subject.exam_count ?? 0}{" "}
                                                    examination(s)
                                                </p>
                                            </div>

                                            <span className="font-bold">
                                                {formatPercentage(percentage)}
                                            </span>
                                        </div>

                                        <progress
                                            className="progress progress-primary w-full"
                                            value={percentage}
                                            max="100"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Examination Overview */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <div>
                        <h2 className="text-lg font-bold">
                            Examination Overview
                        </h2>

                        <p className="text-sm text-base-content/60">
                            Summary of published examination results
                        </p>
                    </div>

                    {examSummaries.length === 0 ? (
                        <EmptyState message="No examination summaries are available yet." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Examination</th>
                                        <th>Academic Year</th>
                                        <th>Subjects</th>
                                        <th>Average</th>
                                        <th>GPA</th>
                                        <th>Result</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {examSummaries.map((exam, index) => (
                                        <tr
                                            key={`${exam.exam_id}-${index}`}
                                        >
                                            <td className="font-semibold">
                                                {exam.exam_name}
                                            </td>

                                            <td>
                                                {exam.academic_year || "—"}
                                            </td>

                                            <td>
                                                {exam.total_subjects ?? 0}
                                            </td>

                                            <td>
                                                {formatPercentage(
                                                    exam.average_percentage
                                                )}
                                            </td>

                                            <td>
                                                {Number.isFinite(
                                                    Number(exam.gpa)
                                                )
                                                    ? Number(
                                                          exam.gpa
                                                      ).toFixed(2)
                                                    : "—"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${
                                                        String(
                                                            exam.result
                                                        ).toLowerCase() === "pass"
                                                            ? "badge-success"
                                                            : String(
                                                                  exam.result
                                                              ).toLowerCase() === "fail"
                                                            ? "badge-error"
                                                            : "badge-ghost"
                                                    }`}
                                                >
                                                    {exam.result || "—"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Results */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold">
                                Recent Results
                            </h2>

                            <p className="text-sm text-base-content/60">
                                Latest published subject results
                            </p>
                        </div>

                        <CalendarDays
                            size={22}
                            className="text-primary"
                        />
                    </div>

                    {recentResults.length === 0 ? (
                        <EmptyState message="No published results are available yet." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Examination</th>
                                        {children.length > 1 && (
                                            <th>Student</th>
                                        )}
                                        <th>Subject</th>
                                        <th>Marks</th>
                                        <th>Percentage</th>
                                        <th>Grade</th>
                                        <th>Result</th>
                                        <th>Published</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentResults.map((result, index) => (
                                        <tr
                                            key={`${result.exam_id}-${result.subject_id}-${result.student_id}-${index}`}
                                        >
                                            <td className="font-semibold">
                                                {result.exam_name}
                                            </td>

                                            {children.length > 1 && (
                                                <td>
                                                    {result.student_name ||
                                                        "—"}
                                                </td>
                                            )}

                                            <td>
                                                {result.subject_name}
                                            </td>

                                            <td>
                                                <span className="font-medium">
                                                    {result.obtained_marks}
                                                </span>
                                                {" / "}
                                                {result.total_marks}
                                            </td>

                                            <td>
                                                {formatPercentage(
                                                    result.percentage
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getGradeColor(
                                                        result.grade
                                                    )}`}
                                                >
                                                    {result.grade || "—"}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getResultColor(
                                                        result.result
                                                    )}`}
                                                >
                                                    {result.result || "—"}
                                                </span>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    result.published_at
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Empty State for no linked children */}
            {children.length === 0 && (
                <div className="alert alert-warning">
                    <AlertCircle size={20} />

                    <span>
                        No linked student profiles were found for your
                        parent account.
                    </span>
                </div>
            )}

            <p className="text-xs text-base-content/50">
                Only published examination results are displayed.
                Draft and pending results are not visible to parents.
            </p>
        </div>
    );
}

/* Summary Card */
function SummaryCard({
    title,
    value,
    description,
    icon,
    color,
    bg,
}) {
    return (
        <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body flex-row items-center justify-between p-5">
                <div>
                    <p className="text-sm text-base-content/60">
                        {title}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                        {value}
                    </h2>

                    <p className="mt-1 text-xs text-base-content/50">
                        {description}
                    </p>
                </div>

                <div className={`rounded-xl p-3 ${bg} ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

/* Performance Trend Chart */
function PerformanceChart({ data }) {
    const chartData = [...data].sort((a, b) => {
        const dateA = a.exam_date || a.exam_name || "";
        const dateB = b.exam_date || b.exam_name || "";

        return String(dateA).localeCompare(String(dateB));
    });

    const width = 700;
    const height = 260;
    const padding = {
        top: 25,
        right: 25,
        bottom: 55,
        left: 45,
    };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const getX = (index) =>
        chartData.length === 1
            ? padding.left + chartWidth / 2
            : padding.left +
              (index / (chartData.length - 1)) * chartWidth;

    const getY = (value) =>
        padding.top +
        chartHeight -
        (Math.min(100, Math.max(0, Number(value) || 0)) /
            100) *
            chartHeight;

    const points = chartData.map((item, index) => ({
        x: getX(index),
        y: getY(item.average_percentage),
        label: item.exam_name || "Exam",
        value: Number(item.average_percentage) || 0,
    }));

    const linePath = points
        .map(
            (point, index) =>
                `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
        )
        .join(" ");

    const areaPath =
        points.length > 0
            ? `${linePath} L ${points[points.length - 1].x} ${
                  padding.top + chartHeight
              } L ${points[0].x} ${
                  padding.top + chartHeight
              } Z`
            : "";

    return (
        <div className="mt-5 w-full overflow-x-auto">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="min-w-[550px] w-full"
                role="img"
                aria-label="Academic performance trend chart"
            >
                {[0, 25, 50, 75, 100].map((value) => {
                    const y = getY(value);

                    return (
                        <g key={value}>
                            <line
                                x1={padding.left}
                                y1={y}
                                x2={width - padding.right}
                                y2={y}
                                stroke="currentColor"
                                opacity="0.12"
                                strokeDasharray="4 4"
                            />

                            <text
                                x={padding.left - 10}
                                y={y + 4}
                                textAnchor="end"
                                fill="currentColor"
                                fontSize="11"
                                opacity="0.65"
                            >
                                {value}
                            </text>
                        </g>
                    );
                })}

                {areaPath && (
                    <path
                        d={areaPath}
                        fill="#3B82F6"
                        opacity="0.10"
                    />
                )}

                {linePath && (
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )}

                {points.map((point, index) => (
                    <g key={index}>
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill="#3B82F6"
                            stroke="white"
                            strokeWidth="2"
                        />

                        <text
                            x={point.x}
                            y={height - 25}
                            textAnchor="middle"
                            fill="currentColor"
                            fontSize="11"
                        >
                            {point.label.length > 12
                                ? `${point.label.slice(0, 12)}...`
                                : point.label}
                        </text>

                        <text
                            x={point.x}
                            y={point.y - 12}
                            textAnchor="middle"
                            fill="currentColor"
                            fontSize="11"
                            fontWeight="bold"
                        >
                            {point.value.toFixed(1)}%
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}

/* Empty State */
function EmptyState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-base-200 p-4">
                <Trophy
                    size={30}
                    className="text-base-content/40"
                />
            </div>

            <p className="mt-3 text-sm text-base-content/60">
                {message}
            </p>
        </div>
    );
}
