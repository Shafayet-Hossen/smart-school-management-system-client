import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    CalendarDays,
    CalendarClock,
    ClipboardCheck,
    Award,
    ChevronDown,
    TrendingUp,
    BookOpen,
    Clock3,
    ArrowUpRight,
    RefreshCw,
    AlertCircle,
    Users,
    CalendarRange,
    FileText,
    Bell,
    GraduationCap,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { getParentExamDashboard } from "../../../services/parentExamService";

// --------------------------------------------------
// Helper functions
// --------------------------------------------------

const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    const date = new Date(`${String(dateString).slice(0, 10)}T00:00:00`);

    if (Number.isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatShortDate = (dateString) => {
    if (!dateString) return "--";

    const date = new Date(`${String(dateString).slice(0, 10)}T00:00:00`);

    if (Number.isNaN(date.getTime())) return "--";

    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
    });
};

const getStudentName = (student) => {
    if (!student) return "Student";

    return (
        student.full_name ||
        `${student.first_name || ""} ${student.last_name || ""}`.trim() ||
        student.student_name ||
        student.name ||
        "Student"
    );
};

const getExamDate = (exam) =>
    exam.exam_date || exam.start_date || exam.date || null;

const getExamSubject = (exam) =>
    exam.subject_name || exam.subject?.subject_name || exam.subject || "Subject";

const getExamStatus = (exam) => {
    const status = String(exam.status || "").toLowerCase();

    if (status === "completed") return "completed";
    if (status === "cancelled") return "cancelled";
    if (status === "published") return "published";

    return "upcoming";
};

const getInitials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "ST";

const getGradeColor = (grade) => {
    const normalized = String(grade || "").toUpperCase();

    if (normalized === "A+" || normalized === "A") {
        return "badge-success";
    }

    if (normalized === "A-" || normalized === "B") {
        return "badge-info";
    }

    if (normalized === "C" || normalized === "D") {
        return "badge-warning";
    }

    if (normalized === "F") {
        return "badge-error";
    }

    return "badge-ghost";
};

// --------------------------------------------------
// Reusable components
// --------------------------------------------------

const SummaryCard = ({
    title,
    value,
    description,
    icon: Icon,
    iconColor,
    iconBackground,
}) => (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body p-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm text-base-content/60">{title}</p>

                    <h2 className="text-3xl font-bold mt-2">
                        {value ?? 0}
                    </h2>

                    <p className="text-xs text-base-content/50 mt-2">
                        {description}
                    </p>
                </div>

                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBackground}`}
                >
                    <Icon size={23} className={iconColor} />
                </div>
            </div>
        </div>
    </div>
);

const LoadingCard = () => (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body p-5">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-9 w-16 mt-3" />
            <div className="skeleton h-3 w-32 mt-2" />
        </div>
    </div>
);

const EmptyState = ({
    icon: Icon = CalendarDays,
    title,
    description,
}) => (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
        <div className="w-14 h-14 rounded-full bg-base-200 flex items-center justify-center mb-3">
            <Icon size={25} className="text-base-content/50" />
        </div>

        <h3 className="font-semibold text-base-content">
            {title}
        </h3>

        <p className="text-sm text-base-content/50 mt-1 max-w-sm">
            {description}
        </p>
    </div>
);

// --------------------------------------------------
// Upcoming examination item
// --------------------------------------------------

const UpcomingExamItem = ({ exam }) => {
    const date = getExamDate(exam);
    const status = getExamStatus(exam);

    return (
        <div className="flex gap-4 p-4 rounded-xl border border-base-200 hover:bg-base-200/40 transition">
            <div className="flex flex-col items-center justify-center min-w-[58px] h-[65px] rounded-xl bg-primary/10 text-primary">
                <span className="text-xl font-bold leading-none">
                    {date
                        ? new Date(`${date.slice(0, 10)}T00:00:00`).getDate()
                        : "--"}
                </span>

                <span className="text-xs mt-1 font-medium">
                    {date
                        ? new Date(`${date.slice(0, 10)}T00:00:00`)
                              .toLocaleDateString("en-US", {
                                  month: "short",
                              })
                        : "N/A"}
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold truncate">
                        {getExamSubject(exam)}
                    </h4>

                    <span
                        className={`badge badge-sm ${
                            status === "cancelled"
                                ? "badge-error"
                                : status === "completed"
                                  ? "badge-success"
                                  : "badge-info"
                        }`}
                    >
                        {status}
                    </span>
                </div>

                <p className="text-xs text-base-content/55 mt-1">
                    {exam.exam_name || exam.name || "Examination"}
                    {exam.exam_type ? ` · ${exam.exam_type}` : ""}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-base-content/60">
                    <span className="flex items-center gap-1">
                        <Clock3 size={13} />
                        {exam.start_time || "Time not set"}
                        {exam.end_time ? ` - ${exam.end_time}` : ""}
                    </span>

                    {exam.class_name && (
                        <span className="flex items-center gap-1">
                            <GraduationCap size={13} />
                            {exam.class_name}
                            {exam.section_name
                                ? ` - ${exam.section_name}`
                                : ""}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// --------------------------------------------------
// Exam calendar
// --------------------------------------------------

const ExamCalendar = ({ exams = [] }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];

    const examDates = useMemo(() => {
        const dates = {};

        exams.forEach((exam) => {
            const examDate = getExamDate(exam);

            if (!examDate) return;

            const date = new Date(
                `${String(examDate).slice(0, 10)}T00:00:00`
            );

            if (
                date.getFullYear() === year &&
                date.getMonth() === month
            ) {
                const day = date.getDate();

                dates[day] = (dates[day] || 0) + 1;
            }
        });

        return dates;
    }, [exams, year, month]);

    const changeMonth = (direction) => {
        setCurrentMonth(
            new Date(year, month + direction, 1)
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold">
                    {currentMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                    })}
                </h3>

                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => changeMonth(-1)}
                        className="btn btn-sm btn-ghost btn-square"
                        aria-label="Previous month"
                    >
                        <ChevronLeft size={17} />
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentMonth(new Date())}
                        className="btn btn-sm btn-ghost"
                    >
                        Today
                    </button>

                    <button
                        type="button"
                        onClick={() => changeMonth(1)}
                        className="btn btn-sm btn-ghost btn-square"
                        aria-label="Next month"
                    >
                        <ChevronRight size={17} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                        <div
                            key={day}
                            className="text-xs font-medium text-base-content/50 py-2"
                        >
                            {day}
                        </div>
                    )
                )}

                {calendarDays.map((day, index) => {
                    const isToday =
                        day === new Date().getDate() &&
                        month === new Date().getMonth() &&
                        year === new Date().getFullYear();

                    const hasExam = day && examDates[day];

                    return (
                        <div
                            key={`${year}-${month}-${index}`}
                            className="flex justify-center"
                        >
                            {day ? (
                                <div
                                    className={`relative w-9 h-9 flex items-center justify-center rounded-full text-sm ${
                                        isToday
                                            ? "bg-primary text-primary-content font-bold"
                                            : hasExam
                                              ? "bg-primary/10 text-primary font-semibold"
                                              : "text-base-content"
                                    }`}
                                    title={
                                        hasExam
                                            ? `${examDates[day]} examination(s)`
                                            : ""
                                    }
                                >
                                    {day}

                                    {hasExam && (
                                        <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </div>
                            ) : (
                                <div className="w-9 h-9" />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center gap-4 mt-5 text-xs text-base-content/60">
                <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    Today
                </span>

                <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                    Examination
                </span>
            </div>
        </div>
    );
};

// --------------------------------------------------
// Performance chart
// No additional chart library required.
// --------------------------------------------------

const PerformanceChart = ({ data = [] }) => {
    const chartData = data
        .filter((item) =>
            Number.isFinite(Number(item.average_percentage))
        )
        .slice(-7);

    if (!chartData.length) {
        return (
            <EmptyState
                icon={TrendingUp}
                title="No performance data"
                description="Performance trends will appear after examination results are published."
            />
        );
    }

    const width = 600;
    const height = 230;
    const paddingX = 35;
    const paddingY = 25;

    const getX = (index) =>
        chartData.length === 1
            ? width / 2
            : paddingX +
              (index * (width - paddingX * 2)) /
                  (chartData.length - 1);

    const getY = (value) => {
        const score = Math.min(100, Math.max(0, Number(value)));

        return (
            height -
            paddingY -
            (score / 100) * (height - paddingY * 2)
        );
    };

    const points = chartData
        .map(
            (item, index) =>
                `${getX(index)},${getY(item.average_percentage)}`
        )
        .join(" ");

    const areaPoints = [
        `${getX(0)},${height - paddingY}`,
        ...chartData.map(
            (item, index) =>
                `${getX(index)},${getY(item.average_percentage)}`
        ),
        `${getX(chartData.length - 1)},${height - paddingY}`,
    ].join(" ");

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm text-base-content/60">
                        Average performance
                    </p>

                    <h3 className="text-2xl font-bold mt-1">
                        {(
                            chartData.reduce(
                                (sum, item) =>
                                    sum +
                                    Number(item.average_percentage),
                                0
                            ) / chartData.length
                        ).toFixed(1)}
                        %
                    </h3>
                </div>

                <span className="badge badge-success gap-1">
                    <TrendingUp size={13} />
                    Results trend
                </span>
            </div>

            <div className="w-full overflow-hidden">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full"
                    role="img"
                    aria-label="Examination performance trend chart"
                >
                    {[0, 25, 50, 75, 100].map((value) => {
                        const y = getY(value);

                        return (
                            <g key={value}>
                                <line
                                    x1={paddingX}
                                    y1={y}
                                    x2={width - paddingX}
                                    y2={y}
                                    stroke="currentColor"
                                    strokeOpacity="0.12"
                                    strokeDasharray="4 4"
                                />

                                <text
                                    x="0"
                                    y={y + 4}
                                    fontSize="11"
                                    fill="currentColor"
                                    opacity="0.55"
                                >
                                    {value}
                                </text>
                            </g>
                        );
                    })}

                    <polygon
                        points={areaPoints}
                        fill="#3B82F6"
                        fillOpacity="0.10"
                    />

                    <polyline
                        points={points}
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {chartData.map((item, index) => (
                        <g key={item.exam_id || item.exam_name || index}>
                            <circle
                                cx={getX(index)}
                                cy={getY(item.average_percentage)}
                                r="5"
                                fill="#3B82F6"
                                stroke="currentColor"
                                strokeWidth="2"
                            />

                            <text
                                x={getX(index)}
                                y={height - 3}
                                textAnchor="middle"
                                fontSize="11"
                                fill="currentColor"
                                opacity="0.65"
                            >
                                {String(
                                    item.exam_name || `Exam ${index + 1}`
                                ).slice(0, 9)}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
};

// --------------------------------------------------
// Recent results
// --------------------------------------------------

const RecentResultItem = ({ result }) => (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-base-200 last:border-0">
        <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                <FileText size={19} />
            </div>

            <div className="min-w-0">
                <h4 className="font-medium text-sm truncate">
                    {result.exam_name || result.name || "Examination"}
                </h4>

                <p className="text-xs text-base-content/50 mt-1">
                    {result.subject_name || "Subject"}
                    {result.published_at
                        ? ` · ${formatShortDate(result.published_at)}`
                        : ""}
                </p>
            </div>
        </div>

        <div className="text-right shrink-0">
            <p className="font-bold text-sm">
                {result.obtained_marks ?? "--"}
                {result.total_marks != null
                    ? `/${result.total_marks}`
                    : ""}
            </p>

            <span
                className={`badge badge-sm ${getGradeColor(result.grade)}`}
            >
                {result.grade || result.result || "Published"}
            </span>
        </div>
    </div>
);

// --------------------------------------------------
// Main Parent Exam Dashboard
// --------------------------------------------------

const ParentExamDashboard = () => {
    const [selectedStudentId, setSelectedStudentId] = useState("all");

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: [
            "parent-exam-dashboard",
            selectedStudentId,
        ],
        queryFn: () =>
            getParentExamDashboard(
                selectedStudentId !== "all"
                    ? { studentId: selectedStudentId }
                    : {}
            ),
        staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false,
    });

    const children = data?.children || [];

    const summary = data?.summary || {};

    const upcomingExams = data?.upcoming_exams || [];

    const recentResults = data?.recent_results || [];

    const performance = data?.performance || [];

    const notifications = data?.notifications || [];

    const selectedStudent = children.find(
        (student) =>
            String(student.student_id || student._id) ===
            String(selectedStudentId)
    );

    const selectedStudentName = selectedStudent
        ? getStudentName(selectedStudent)
        : "All Children";

    const handleStudentChange = (event) => {
        setSelectedStudentId(event.target.value);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <div className="skeleton h-8 w-64" />
                    <div className="skeleton h-4 w-80 mt-3" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <LoadingCard key={item} />
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    <div className="xl:col-span-2 skeleton h-80 rounded-xl" />
                    <div className="skeleton h-80 rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-[350px] flex items-center justify-center">
                <div className="text-center max-w-md p-6">
                    <div className="w-14 h-14 mx-auto rounded-full bg-error/10 flex items-center justify-center text-error">
                        <AlertCircle size={27} />
                    </div>

                    <h2 className="text-lg font-semibold mt-4">
                        Unable to load exam dashboard
                    </h2>

                    <p className="text-sm text-base-content/60 mt-2">
                        {error?.response?.data?.message ||
                            error?.message ||
                            "Something went wrong while loading examination information."}
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="btn btn-primary btn-sm mt-5"
                    >
                        <RefreshCw size={15} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* -------------------------------- */}
            {/* Page Header */}
            {/* -------------------------------- */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <CalendarDays size={22} />
                        </div>

                        <h1 className="text-2xl font-bold">
                            Exam Dashboard
                        </h1>
                    </div>

                    <p className="text-sm text-base-content/55 mt-2">
                        Monitor your children's examinations, schedules,
                        and academic performance.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Child Selector */}

                    <div className="relative">
                        <select
                            value={selectedStudentId}
                            onChange={handleStudentChange}
                            className="select select-bordered w-full sm:w-56 pr-10"
                        >
                            <option value="all">
                                All Children
                            </option>

                            {children.map((student) => {
                                const studentId =
                                    student.student_id || student._id;

                                return (
                                    <option
                                        key={studentId}
                                        value={studentId}
                                    >
                                        {getStudentName(student)}
                                    </option>
                                );
                            })}
                        </select>

                        <ChevronDown
                            size={15}
                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-base-content/50"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="btn btn-outline"
                    >
                        <RefreshCw
                            size={16}
                            className={
                                isFetching ? "animate-spin" : ""
                            }
                        />
                        Refresh
                    </button>
                </div>
            </div>

            {/* -------------------------------- */}
            {/* Selected Student Information */}
            {/* -------------------------------- */}

            {selectedStudent && (
                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                {getInitials(selectedStudentName)}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold">
                                    {selectedStudentName}
                                </h3>

                                <p className="text-xs text-base-content/55 mt-1">
                                    {selectedStudent.class_name ||
                                        selectedStudent.class?.class_name ||
                                        "Class not available"}

                                    {" · "}

                                    {selectedStudent.section_name ||
                                        selectedStudent.section?.name ||
                                        "Section not available"}
                                </p>
                            </div>

                            <span className="badge badge-success badge-outline">
                                {selectedStudent.status || "Active"}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* -------------------------------- */}
            {/* Summary Cards */}
            {/* -------------------------------- */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Examinations"
                    value={summary.total_exams}
                    description="Examinations available"
                    icon={CalendarDays}
                    iconColor="text-blue-500"
                    iconBackground="bg-blue-500/10"
                />

                <SummaryCard
                    title="Upcoming Exams"
                    value={summary.upcoming_exams}
                    description="Scheduled examinations"
                    icon={CalendarClock}
                    iconColor="text-orange-500"
                    iconBackground="bg-orange-500/10"
                />

                <SummaryCard
                    title="Completed Exams"
                    value={summary.completed_exams}
                    description="Examinations completed"
                    icon={ClipboardCheck}
                    iconColor="text-green-500"
                    iconBackground="bg-green-500/10"
                />

                <SummaryCard
                    title="Published Results"
                    value={summary.published_results}
                    description="Results available to parents"
                    icon={Award}
                    iconColor="text-purple-500"
                    iconBackground="bg-purple-500/10"
                />
            </div>

            {/* -------------------------------- */}
            {/* Upcoming Exams and Calendar */}
            {/* -------------------------------- */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Upcoming Exams */}

                <div className="xl:col-span-2 card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex items-center justify-between gap-3 mb-2">
                            <div>
                                <h2 className="font-bold text-lg">
                                    Upcoming Examinations
                                </h2>

                                <p className="text-xs text-base-content/50 mt-1">
                                    Next scheduled examinations
                                </p>
                            </div>

                            <span className="badge badge-primary badge-outline">
                                {upcomingExams.length} Exams
                            </span>
                        </div>

                        {upcomingExams.length > 0 ? (
                            <div className="space-y-3">
                                {upcomingExams.slice(0, 6).map(
                                    (exam, index) => (
                                        <UpcomingExamItem
                                            key={
                                                exam._id ||
                                                `${exam.exam_id}-${exam.subject_id}-${index}`
                                            }
                                            exam={exam}
                                        />
                                    )
                                )}
                            </div>
                        ) : (
                            <EmptyState
                                icon={CalendarClock}
                                title="No upcoming examinations"
                                description="There are currently no scheduled examinations for this selection."
                            />
                        )}
                    </div>
                </div>

                {/* Calendar */}

                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <CalendarRange
                                size={20}
                                className="text-primary"
                            />

                            <div>
                                <h2 className="font-bold text-lg">
                                    Exam Calendar
                                </h2>

                                <p className="text-xs text-base-content/50 mt-1">
                                    Examination dates
                                </p>
                            </div>
                        </div>

                        <ExamCalendar exams={upcomingExams} />
                    </div>
                </div>
            </div>

            {/* -------------------------------- */}
            {/* Performance and Results */}
            {/* -------------------------------- */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {/* Performance Chart */}

                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp
                                size={20}
                                className="text-primary"
                            />

                            <div>
                                <h2 className="font-bold text-lg">
                                    Academic Performance
                                </h2>

                                <p className="text-xs text-base-content/50 mt-1">
                                    Published examination results
                                </p>
                            </div>
                        </div>

                        <PerformanceChart data={performance} />
                    </div>
                </div>

                {/* Recent Results */}

                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h2 className="font-bold text-lg">
                                    Recent Results
                                </h2>

                                <p className="text-xs text-base-content/50 mt-1">
                                    Recently published results
                                </p>
                            </div>

                            <Award
                                size={21}
                                className="text-success"
                            />
                        </div>

                        {recentResults.length > 0 ? (
                            <div>
                                {recentResults.slice(0, 6).map(
                                    (result, index) => (
                                        <RecentResultItem
                                            key={
                                                result._id ||
                                                `${result.exam_id}-${result.subject_id}-${index}`
                                            }
                                            result={result}
                                        />
                                    )
                                )}
                            </div>
                        ) : (
                            <EmptyState
                                icon={FileText}
                                title="No published results"
                                description="Published examination results will appear here."
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* -------------------------------- */}
            {/* Children Overview */}
            {/* -------------------------------- */}

            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="font-bold text-lg">
                                My Children
                            </h2>

                            <p className="text-xs text-base-content/50 mt-1">
                                Examination overview for linked children
                            </p>
                        </div>

                        <Users
                            size={21}
                            className="text-primary"
                        />
                    </div>

                    {children.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {children.map((student) => {
                                const studentId =
                                    student.student_id || student._id;

                                const isSelected =
                                    String(studentId) ===
                                    String(selectedStudentId);

                                return (
                                    <button
                                        type="button"
                                        key={studentId}
                                        onClick={() =>
                                            setSelectedStudentId(
                                                String(studentId)
                                            )
                                        }
                                        className={`text-left p-4 rounded-xl border transition ${
                                            isSelected
                                                ? "border-primary bg-primary/5"
                                                : "border-base-200 hover:border-primary/50 hover:bg-base-200/30"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                {getInitials(
                                                    getStudentName(student)
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="font-semibold truncate">
                                                    {getStudentName(student)}
                                                </h3>

                                                <p className="text-xs text-base-content/50 mt-1">
                                                    {student.class_name ||
                                                        "Class N/A"}
                                                    {" · "}
                                                    {student.section_name ||
                                                        "Section N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-base-200">
                                            <span className="text-xs text-base-content/50">
                                                View examinations
                                            </span>

                                            <ArrowUpRight
                                                size={16}
                                                className="text-primary"
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Users}
                            title="No linked children found"
                            description="No student profiles are currently linked to your parent account."
                        />
                    )}
                </div>
            </div>

            {/* -------------------------------- */}
            {/* Notifications */}
            {/* -------------------------------- */}

            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Bell
                            size={20}
                            className="text-primary"
                        />

                        <div>
                            <h2 className="font-bold text-lg">
                                Examination Notifications
                            </h2>

                            <p className="text-xs text-base-content/50 mt-1">
                                Important examination updates
                            </p>
                        </div>
                    </div>

                    {notifications.length > 0 ? (
                        <div className="space-y-3">
                            {notifications.slice(0, 5).map(
                                (notification, index) => (
                                    <div
                                        key={
                                            notification._id ||
                                            notification.id ||
                                            index
                                        }
                                        className="flex items-start gap-3 p-3 rounded-lg bg-base-200/40"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Bell size={17} />
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-sm">
                                                {notification.title ||
                                                    "Examination update"}
                                            </h4>

                                            <p className="text-xs text-base-content/60 mt-1">
                                                {notification.message ||
                                                    notification.description ||
                                                    ""}
                                            </p>

                                            {notification.created_at && (
                                                <p className="text-xs text-base-content/40 mt-2">
                                                    {formatDate(
                                                        notification.created_at
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Bell}
                            title="No new notifications"
                            description="Examination announcements and updates will appear here."
                        />
                    )}
                </div>
            </div>

            {/* Footer */}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-base-content/40">
                <p>
                    Showing examination information for{" "}
                    <span className="font-medium text-base-content/60">
                        {selectedStudentName}
                    </span>
                </p>

                <p>
                    Academic Year:{" "}
                    {data?.academic_year || "Not specified"}
                </p>
            </div>
        </div>
    );
};

export default ParentExamDashboard;