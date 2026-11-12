
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Award,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    GraduationCap,
    Search,
    TrendingDown,
    TrendingUp,
    Trophy,
    XCircle,
    BarChart3,
    Target,
    RefreshCw,
} from "lucide-react";

import {
    getParentSubjectWiseResults,
} from "../../../services/parentResultService.js";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const formatNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? Number(number.toFixed(2)).toString()
        : "0";
};

const formatPercentage = (value) =>
    `${formatNumber(value)}%`;

const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "N/A";
    }

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getGradeColor = (grade) => {
    const value = String(grade || "").toUpperCase();

    if (value === "A+") return "badge-success";
    if (value === "A" || value === "A-") return "badge-info";
    if (value === "B") return "badge-primary";
    if (value === "C") return "badge-warning";
    if (value === "D") return "badge-secondary";

    return "badge-error";
};

const getResultColor = (result) => {
    return String(result || "").toLowerCase() === "pass"
        ? "badge-success"
        : "badge-error";
};

const getPerformanceColor = (percentage) => {
    const value = Number(percentage || 0);

    if (value >= 80) return "text-success";
    if (value >= 60) return "text-info";
    if (value >= 40) return "text-warning";

    return "text-error";
};

const getProgressColor = (percentage) => {
    const value = Number(percentage || 0);

    if (value >= 80) return "progress-success";
    if (value >= 60) return "progress-info";
    if (value >= 40) return "progress-warning";

    return "progress-error";
};

// --------------------------------------------------
// Reusable Components
// --------------------------------------------------

const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
}) => {
    return (
        <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-sm text-base-content/60">
                            {title}
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                            {value}
                        </h3>

                        {subtitle && (
                            <p className="mt-1 text-xs text-base-content/50">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className={`rounded-xl p-3 ${color}`}>
                        <Icon size={23} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const EmptyState = ({ title, description }) => (
    <div className="rounded-xl border border-dashed border-base-300 bg-base-100 px-5 py-14 text-center">
        <BookOpen
            size={45}
            className="mx-auto text-base-content/30"
        />

        <h3 className="mt-4 text-lg font-semibold">
            {title}
        </h3>

        <p className="mt-2 text-sm text-base-content/50">
            {description}
        </p>
    </div>
);

// --------------------------------------------------
// Performance Trend Chart
// --------------------------------------------------

const PerformanceChart = ({ data }) => {
    const chartData = useMemo(() => {
        return [...(data || [])]
            .sort((a, b) => {
                const dateA = new Date(
                    a.exam_date || a.published_at || 0
                ).getTime();

                const dateB = new Date(
                    b.exam_date || b.published_at || 0
                ).getTime();

                return dateA - dateB;
            })
            .filter((item) =>
                Number.isFinite(Number(item.percentage))
            );
    }, [data]);

    if (!chartData.length) {
        return (
            <div className="flex h-64 items-center justify-center text-sm text-base-content/50">
                No performance history available.
            </div>
        );
    }

    const width = 700;
    const height = 260;
    const paddingLeft = 45;
    const paddingRight = 25;
    const paddingTop = 25;
    const paddingBottom = 55;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const getX = (index) => {
        if (chartData.length === 1) {
            return paddingLeft + chartWidth / 2;
        }

        return (
            paddingLeft +
            (index / (chartData.length - 1)) * chartWidth
        );
    };

    const getY = (percentage) => {
        const value = Math.max(
            0,
            Math.min(100, Number(percentage))
        );

        return (
            paddingTop +
            chartHeight -
            (value / 100) * chartHeight
        );
    };

    const points = chartData.map((item, index) => ({
        x: getX(index),
        y: getY(item.percentage),
        item,
    }));

    const linePath = points
        .map(
            (point, index) =>
                `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
        )
        .join(" ");

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    const areaPath = [
        linePath,
        `L ${lastPoint.x} ${paddingTop + chartHeight}`,
        `L ${firstPoint.x} ${paddingTop + chartHeight}`,
        "Z",
    ].join(" ");

    return (
        <div className="w-full overflow-x-auto">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-auto min-w-[500px] w-full"
                role="img"
                aria-label="Subject performance trend chart"
            >
                {[0, 25, 50, 75, 100].map((value) => {
                    const y = getY(value);

                    return (
                        <g key={value}>
                            <line
                                x1={paddingLeft}
                                y1={y}
                                x2={width - paddingRight}
                                y2={y}
                                stroke="currentColor"
                                opacity="0.12"
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
                                {value}%
                            </text>
                        </g>
                    );
                })}

                <path
                    d={areaPath}
                    fill="#3B82F6"
                    opacity="0.10"
                />

                <path
                    d={linePath}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {points.map((point, index) => (
                    <g key={`${point.item.exam_id}-${index}`}>
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
                            y={height - 27}
                            textAnchor="middle"
                            fontSize="11"
                            fill="currentColor"
                        >
                            {String(
                                point.item.exam_name || "Exam"
                            ).slice(0, 12)}
                        </text>

                        <text
                            x={point.x}
                            y={point.y - 12}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="bold"
                            fill="currentColor"
                        >
                            {formatNumber(point.item.percentage)}%
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

// --------------------------------------------------
// Subject-wise Results Page
// --------------------------------------------------

const ParentSubjectWiseResults = () => {
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [selectedAcademicYear, setSelectedAcademicYear] =
        useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // ----------------------------------------------
    // Fetch subject-wise results
    // ----------------------------------------------

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: [
            "parent-subject-wise-results",
            selectedStudentId,
            selectedSubjectId,
            selectedAcademicYear,
        ],
        queryFn: () =>
            getParentSubjectWiseResults({
                studentId: selectedStudentId,
                subjectId: selectedSubjectId,
                academicYear: selectedAcademicYear,
            }),
    });

    const children = data?.children || [];
    const subjects = data?.subjects || [];
    const results = data?.results || [];
    const summary = data?.summary || {};

    // ----------------------------------------------
    // Selected child
    // ----------------------------------------------

    const selectedChild = useMemo(
        () =>
            children.find(
                (child) =>
                    child.student_id === selectedStudentId
            ) || null,
        [children, selectedStudentId]
    );

    // ----------------------------------------------
    // Selected subject
    // ----------------------------------------------

    const selectedSubject = useMemo(
        () =>
            subjects.find(
                (subject) =>
                    subject.subject_id === selectedSubjectId
            ) || null,
        [subjects, selectedSubjectId]
    );

    // ----------------------------------------------
    // Academic years
    // ----------------------------------------------

    const academicYears = useMemo(() => {
        return [
            ...new Set(
                results
                    .map((item) => String(item.academic_year || ""))
                    .filter(Boolean)
            ),
        ].sort((a, b) => b.localeCompare(a));
    }, [results]);

    // ----------------------------------------------
    // Subject search
    // ----------------------------------------------

    const filteredSubjects = useMemo(() => {
        return subjects.filter((subject) =>
            String(subject.subject_name || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [subjects, searchTerm]);

    // ----------------------------------------------
    // Selected subject results
    // ----------------------------------------------

    const selectedSubjectResults = useMemo(() => {
        return results
            .filter(
                (item) =>
                    String(item.subject_id) ===
                    String(selectedSubjectId)
            )
            .sort((a, b) => {
                const dateA = new Date(
                    a.exam_date || a.published_at || 0
                ).getTime();

                const dateB = new Date(
                    b.exam_date || b.published_at || 0
                ).getTime();

                return dateA - dateB;
            });
    }, [results, selectedSubjectId]);

    // ----------------------------------------------
    // Performance calculations
    // ----------------------------------------------

    const subjectStats = useMemo(() => {
        const validResults = selectedSubjectResults;

        if (!validResults.length) {
            return {
                total_exams: 0,
                average_percentage: 0,
                average_gpa: 0,
                highest_percentage: 0,
                lowest_percentage: 0,
                passed_exams: 0,
                failed_exams: 0,
                total_obtained_marks: 0,
                total_marks: 0,
                improvement: 0,
            };
        }

        const percentages = validResults.map((item) =>
            Number(item.percentage || 0)
        );

        const totalObtained = validResults.reduce(
            (sum, item) =>
                sum + Number(item.obtained_marks || 0),
            0
        );

        const totalMaximum = validResults.reduce(
            (sum, item) =>
                sum + Number(item.total_marks || 0),
            0
        );

        const averagePercentage =
            percentages.reduce((sum, value) => sum + value, 0) /
            percentages.length;

        const averageGpa =
            validResults.reduce(
                (sum, item) =>
                    sum + Number(item.grade_point || 0),
                0
            ) / validResults.length;

        const passed = validResults.filter(
            (item) =>
                String(item.result).toLowerCase() === "pass"
        ).length;

        const failed = validResults.filter(
            (item) =>
                String(item.result).toLowerCase() === "fail"
        ).length;

        const improvement =
            percentages.length >= 2
                ? percentages[percentages.length - 1] -
                  percentages[0]
                : 0;

        return {
            total_exams: validResults.length,
            average_percentage: averagePercentage,
            average_gpa: averageGpa,
            highest_percentage: Math.max(...percentages),
            lowest_percentage: Math.min(...percentages),
            passed_exams: passed,
            failed_exams: failed,
            total_obtained_marks: totalObtained,
            total_marks: totalMaximum,
            improvement,
        };
    }, [selectedSubjectResults]);

    // ----------------------------------------------
    // Subject selection
    // ----------------------------------------------

    const handleStudentChange = (studentId) => {
        setSelectedStudentId(studentId);
        setSelectedSubjectId("");
        setSelectedAcademicYear("");
    };

    const handleSubjectChange = (subjectId) => {
        setSelectedSubjectId(subjectId);
    };

    // ----------------------------------------------
    // Loading state
    // ----------------------------------------------

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
                <span className="loading loading-spinner loading-lg text-primary" />

                <p className="text-sm text-base-content/60">
                    Loading subject-wise results...
                </p>
            </div>
        );
    }

    // ----------------------------------------------
    // Error state
    // ----------------------------------------------

    if (isError) {
        return (
            <div className="alert alert-error">
                <XCircle size={22} />

                <div className="flex-1">
                    <h3 className="font-bold">
                        Unable to load subject-wise results
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
                    Retry
                </button>
            </div>
        );
    }

    // ----------------------------------------------
    // Main UI
    // ----------------------------------------------

    return (
        <div className="space-y-6 p-4 md:p-6">

            {/* Page Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-base-content/50">
                        <GraduationCap size={17} />
                        <span>Parent Portal</span>
                        <span>/</span>
                        <span>Result Management</span>
                    </div>

                    <h1 className="text-2xl font-bold md:text-3xl">
                        Subject-wise Results
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        Monitor your child's academic performance
                        across different subjects and examinations.
                    </p>
                </div>

                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="btn btn-outline gap-2"
                >
                    <RefreshCw
                        size={17}
                        className={isFetching ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body grid grid-cols-1 gap-4 p-5 md:grid-cols-3">

                    {/* Child */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">
                                Select Child
                            </span>
                        </label>

                        <select
                            className="select select-bordered w-full"
                            value={selectedStudentId}
                            onChange={(e) =>
                                handleStudentChange(e.target.value)
                            }
                        >
                            <option value="">
                                Select a child
                            </option>

                            {children.map((child) => (
                                <option
                                    key={child.student_id}
                                    value={child.student_id}
                                >
                                    {child.full_name} - {child.class_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Academic year */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">
                                Academic Year
                            </span>
                        </label>

                        <select
                            className="select select-bordered w-full"
                            value={selectedAcademicYear}
                            onChange={(e) =>
                                setSelectedAcademicYear(e.target.value)
                            }
                            disabled={!selectedStudentId}
                        >
                            <option value="">
                                All Academic Years
                            </option>

                            {academicYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">
                                Select Subject
                            </span>
                        </label>

                        <select
                            className="select select-bordered w-full"
                            value={selectedSubjectId}
                            onChange={(e) =>
                                handleSubjectChange(e.target.value)
                            }
                            disabled={!selectedStudentId}
                        >
                            <option value="">
                                Select a subject
                            </option>

                            {subjects.map((subject) => (
                                <option
                                    key={subject.subject_id}
                                    value={subject.subject_id}
                                >
                                    {subject.subject_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* No child selected */}
            {!selectedStudentId && (
                <EmptyState
                    title="Select a Child"
                    description="Choose a child to explore their subject-wise academic performance."
                />
            )}

            {/* Child profile */}
            {selectedChild && (
                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <GraduationCap size={28} />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-xl font-bold">
                                    {selectedChild.full_name}
                                </h2>

                                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-base-content/60">
                                    <span>
                                        Student ID:{" "}
                                        {selectedChild.student_code || "N/A"}
                                    </span>

                                    <span>
                                        Class:{" "}
                                        {selectedChild.class_name || "N/A"}
                                    </span>

                                    <span>
                                        Section:{" "}
                                        {selectedChild.section_name || "N/A"}
                                    </span>

                                    <span>
                                        Roll:{" "}
                                        {selectedChild.roll_number || "N/A"}
                                    </span>
                                </div>
                            </div>

                            <span className="badge badge-primary badge-lg">
                                Student
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Subject overview */}
            {selectedStudentId && (
                <>
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                        <div>
                            <h2 className="text-lg font-bold">
                                Subject Overview
                            </h2>

                            <p className="text-sm text-base-content/50">
                                {subjects.length} subjects with published
                                results
                            </p>
                        </div>

                        <label className="input input-bordered flex items-center gap-2 md:w-72">
                            <Search
                                size={17}
                                className="text-base-content/40"
                            />

                            <input
                                type="text"
                                className="grow"
                                placeholder="Search subject..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                            />
                        </label>
                    </div>

                    {filteredSubjects.length === 0 ? (
                        <EmptyState
                            title="No Subjects Found"
                            description="No published subject results are available for this child."
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredSubjects.map((subject) => {
                                const active =
                                    selectedSubjectId ===
                                    subject.subject_id;

                                return (
                                    <button
                                        type="button"
                                        key={subject.subject_id}
                                        onClick={() =>
                                            handleSubjectChange(
                                                subject.subject_id
                                            )
                                        }
                                        className={`card border text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                                            active
                                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                : "border-base-300 bg-base-100"
                                        }`}
                                    >
                                        <div className="card-body p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                    <BookOpen size={22} />
                                                </div>

                                                {active && (
                                                    <span className="badge badge-primary">
                                                        Selected
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="mt-3 text-lg font-bold">
                                                {subject.subject_name}
                                            </h3>

                                            <p className="text-xs text-base-content/50">
                                                {subject.subject_code ||
                                                    "Subject"}
                                            </p>

                                            <div className="mt-3 flex items-center justify-between text-sm">
                                                <span className="text-base-content/60">
                                                    Average
                                                </span>

                                                <span
                                                    className={`font-bold ${getPerformanceColor(
                                                        subject.average_percentage
                                                    )}`}
                                                >
                                                    {formatPercentage(
                                                        subject.average_percentage
                                                    )}
                                                </span>
                                            </div>

                                            <progress
                                                className={`progress w-full ${getProgressColor(
                                                    subject.average_percentage
                                                )}`}
                                                value={Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        Number(
                                                            subject.average_percentage ||
                                                                0
                                                        )
                                                    )
                                                )}
                                                max="100"
                                            />

                                            <div className="mt-2 flex justify-between text-xs text-base-content/50">
                                                <span>
                                                    Exams:{" "}
                                                    {subject.exam_count || 0}
                                                </span>

                                                <span>
                                                    GPA:{" "}
                                                    {formatNumber(
                                                        subject.average_gpa
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* Selected subject details */}
            {selectedSubjectId && (
                <>
                    <div className="divider" />

                    <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <BookOpen
                                    size={21}
                                    className="text-primary"
                                />

                                <h2 className="text-xl font-bold">
                                    {selectedSubject?.subject_name ||
                                        "Subject Performance"}
                                </h2>
                            </div>

                            <p className="mt-1 text-sm text-base-content/50">
                                Examination-wise performance history
                            </p>
                        </div>

                        <span className="badge badge-primary badge-lg">
                            {subjectStats.total_exams} Examinations
                        </span>
                    </div>

                    {selectedSubjectResults.length === 0 ? (
                        <EmptyState
                            title="No Examination History"
                            description="There are no published results for this subject and academic year."
                        />
                    ) : (
                        <>
                            {/* Subject statistics */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <StatCard
                                    title="Average Percentage"
                                    value={formatPercentage(
                                        subjectStats.average_percentage
                                    )}
                                    subtitle="Across selected examinations"
                                    icon={Target}
                                    color="bg-primary/10 text-primary"
                                />

                                <StatCard
                                    title="Average GPA"
                                    value={formatNumber(
                                        subjectStats.average_gpa
                                    )}
                                    subtitle="Average grade point"
                                    icon={Award}
                                    color="bg-info/10 text-info"
                                />

                                <StatCard
                                    title="Highest Percentage"
                                    value={formatPercentage(
                                        subjectStats.highest_percentage
                                    )}
                                    subtitle="Best examination"
                                    icon={Trophy}
                                    color="bg-success/10 text-success"
                                />

                                <StatCard
                                    title="Lowest Percentage"
                                    value={formatPercentage(
                                        subjectStats.lowest_percentage
                                    )}
                                    subtitle="Lowest examination"
                                    icon={TrendingDown}
                                    color="bg-warning/10 text-warning"
                                />
                            </div>

                            {/* Performance improvement */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="card border border-base-300 bg-base-100 shadow-sm md:col-span-2">
                                    <div className="card-body">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <h3 className="font-bold">
                                                    Performance Trend
                                                </h3>

                                                <p className="text-xs text-base-content/50">
                                                    Percentage across examinations
                                                </p>
                                            </div>

                                            <BarChart3
                                                size={21}
                                                className="text-primary"
                                            />
                                        </div>

                                        <PerformanceChart
                                            data={selectedSubjectResults}
                                        />
                                    </div>
                                </div>

                                <div className="card border border-base-300 bg-base-100 shadow-sm">
                                    <div className="card-body">
                                        <h3 className="font-bold">
                                            Result Summary
                                        </h3>

                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <p className="text-sm text-base-content/50">
                                                    Passed Examinations
                                                </p>

                                                <div className="mt-1 flex items-center gap-2">
                                                    <CheckCircle2
                                                        size={19}
                                                        className="text-success"
                                                    />

                                                    <span className="text-2xl font-bold text-success">
                                                        {subjectStats.passed_exams}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-sm text-base-content/50">
                                                    Failed Examinations
                                                </p>

                                                <div className="mt-1 flex items-center gap-2">
                                                    <XCircle
                                                        size={19}
                                                        className="text-error"
                                                    />

                                                    <span className="text-2xl font-bold text-error">
                                                        {subjectStats.failed_exams}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-sm text-base-content/50">
                                                    Marks Obtained
                                                </p>

                                                <p className="mt-1 text-xl font-bold">
                                                    {formatNumber(
                                                        subjectStats.total_obtained_marks
                                                    )}{" "}
                                                    /{" "}
                                                    {formatNumber(
                                                        subjectStats.total_marks
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-base-content/50">
                                                    First to Latest Change
                                                </p>

                                                <div className="mt-1 flex items-center gap-2">
                                                    {subjectStats.improvement >= 0 ? (
                                                        <TrendingUp
                                                            size={19}
                                                            className="text-success"
                                                        />
                                                    ) : (
                                                        <TrendingDown
                                                            size={19}
                                                            className="text-error"
                                                        />
                                                    )}

                                                    <span
                                                        className={`text-xl font-bold ${
                                                            subjectStats.improvement >=
                                                            0
                                                                ? "text-success"
                                                                : "text-error"
                                                        }`}
                                                    >
                                                        {subjectStats.improvement >
                                                        0
                                                            ? "+"
                                                            : ""}
                                                        {formatNumber(
                                                            subjectStats.improvement
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Examination history table */}
                            <div className="card border border-base-300 bg-base-100 shadow-sm">
                                <div className="card-body p-0">
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold">
                                            Examination History
                                        </h3>

                                        <p className="text-sm text-base-content/50">
                                            Detailed marks and grades for{" "}
                                            {selectedSubject?.subject_name}
                                        </p>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="table table-zebra">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Examination</th>
                                                    <th>Academic Year</th>
                                                    <th>Date</th>
                                                    <th className="text-center">
                                                        Total Marks
                                                    </th>
                                                    <th className="text-center">
                                                        Obtained
                                                    </th>
                                                    <th className="text-center">
                                                        Percentage
                                                    </th>
                                                    <th className="text-center">
                                                        Grade
                                                    </th>
                                                    <th className="text-center">
                                                        GPA
                                                    </th>
                                                    <th className="text-center">
                                                        Result
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {selectedSubjectResults.map(
                                                    (item, index) => (
                                                        <tr
                                                            key={`${item.exam_id}-${item.subject_id}-${index}`}
                                                        >
                                                            <td>
                                                                {index + 1}
                                                            </td>

                                                            <td className="font-semibold">
                                                                {item.exam_name ||
                                                                    "Examination"}
                                                            </td>

                                                            <td>
                                                                {item.academic_year ||
                                                                    "N/A"}
                                                            </td>

                                                            <td className="whitespace-nowrap">
                                                                <span className="flex items-center gap-2">
                                                                    <CalendarDays
                                                                        size={15}
                                                                        className="text-base-content/40"
                                                                    />
                                                                    {formatDate(
                                                                        item.exam_date ||
                                                                            item.published_at
                                                                    )}
                                                                </span>
                                                            </td>

                                                            <td className="text-center">
                                                                {formatNumber(
                                                                    item.total_marks
                                                                )}
                                                            </td>

                                                            <td className="text-center font-bold">
                                                                {formatNumber(
                                                                    item.obtained_marks
                                                                )}
                                                            </td>

                                                            <td
                                                                className={`text-center font-semibold ${getPerformanceColor(
                                                                    item.percentage
                                                                )}`}
                                                            >
                                                                {formatPercentage(
                                                                    item.percentage
                                                                )}
                                                            </td>

                                                            <td className="text-center">
                                                                <span
                                                                    className={`badge ${getGradeColor(
                                                                        item.grade
                                                                    )}`}
                                                                >
                                                                    {item.grade ||
                                                                        "N/A"}
                                                                </span>
                                                            </td>

                                                            <td className="text-center font-semibold">
                                                                {formatNumber(
                                                                    item.grade_point
                                                                )}
                                                            </td>

                                                            <td className="text-center">
                                                                <span
                                                                    className={`badge ${getResultColor(
                                                                        item.result
                                                                    )}`}
                                                                >
                                                                    {item.result ||
                                                                        "N/A"}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex flex-wrap justify-between gap-3 border-t border-base-300 p-5 text-sm text-base-content/60">
                                        <span>
                                            Total examinations:{" "}
                                            {selectedSubjectResults.length}
                                        </span>

                                        <span>
                                            Average:{" "}
                                            {formatPercentage(
                                                subjectStats.average_percentage
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Footer */}
            {selectedStudentId && (
                <div className="rounded-xl border border-base-300 bg-base-100 p-5 text-center text-sm text-base-content/50">
                    <p>
                        This page displays published subject-wise
                        examination results only.
                    </p>

                    <p className="mt-1">
                        For any discrepancy, please contact the
                        school administration.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ParentSubjectWiseResults;
