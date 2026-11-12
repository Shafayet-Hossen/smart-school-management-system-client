
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    CalendarDays,
    CalendarClock,
    CheckCircle2,
    XCircle,
    Clock,
    BookOpen,
    Search,
    RefreshCw,
    Filter,
    ClipboardList,
    GraduationCap,
    AlertCircle,
    ChevronRight,
    CalendarCheck,
    Timer,
    Calendar,
} from "lucide-react";

import {
    getStudentExamSchedule,
} from "../../../services/studentExamService.js";

const formatDate = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "short",
    });
};

const formatTime = (time) => {
    if (!time) return "N/A";

    const [hours, minutes] = time.split(":");
    const parsed = new Date();

    parsed.setHours(Number(hours), Number(minutes), 0, 0);

    return parsed.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
};

const getStatusBadge = (status) => {
    switch (String(status || "").toLowerCase()) {
        case "upcoming":
        case "scheduled":
            return "badge-info";

        case "completed":
            return "badge-success";

        case "cancelled":
            return "badge-error";

        default:
            return "badge-ghost";
    }
};

const SummaryCard = ({
    title,
    value,
    description,
    icon: Icon,
    color,
}) => (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body p-5">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-base-content/60">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {value ?? 0}
                    </h2>
                </div>

                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon size={24} />
                </div>
            </div>

            <p className="text-xs text-base-content/50 mt-3">
                {description}
            </p>
        </div>
    </div>
);

const StudentExamSchedule = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [monthFilter, setMonthFilter] = useState("all");

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["student-exam-schedule"],
        queryFn: () => getStudentExamSchedule(),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    const exams = data?.exams || [];
    const student = data?.student || {};
    const summary = data?.summary || {};

    const examTypes = useMemo(
        () => [
            ...new Set(
                exams
                    .map((exam) => exam.exam_type)
                    .filter(Boolean)
            ),
        ],
        [exams]
    );

    const months = useMemo(
        () => [
            ...new Set(
                exams
                    .map((exam) => exam.exam_date?.slice(0, 7))
                    .filter(Boolean)
            ),
        ].sort(),
        [exams]
    );

    const filteredExams = useMemo(() => {
        return exams.filter((exam) => {
            const normalizedSearch = search.toLowerCase();

            const matchesSearch =
                String(exam.exam_name || "")
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                String(exam.subject_name || "")
                    .toLowerCase()
                    .includes(normalizedSearch);

            const matchesStatus =
                statusFilter === "all" ||
                String(exam.status).toLowerCase() === statusFilter;

            const matchesType =
                typeFilter === "all" ||
                String(exam.exam_type).toLowerCase() === typeFilter;

            const matchesMonth =
                monthFilter === "all" ||
                exam.exam_date?.slice(0, 7) === monthFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesType &&
                matchesMonth
            );
        });
    }, [
        exams,
        search,
        statusFilter,
        typeFilter,
        monthFilter,
    ]);

    const groupedExams = useMemo(() => {
        return filteredExams.reduce((groups, exam) => {
            const date = exam.exam_date || "Unknown Date";

            if (!groups[date]) {
                groups[date] = [];
            }

            groups[date].push(exam);

            return groups;
        }, {});
    }, [filteredExams]);

    const sortedDates = Object.keys(groupedExams).sort();

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary" />
                <p className="text-base-content/60">
                    Loading examination schedule...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="card bg-base-100 border border-error/20 shadow-lg max-w-md w-full">
                    <div className="card-body items-center text-center">
                        <AlertCircle size={42} className="text-error" />

                        <h2 className="card-title">
                            Unable to Load Schedule
                        </h2>

                        <p className="text-sm text-base-content/60">
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Something went wrong."}
                        </p>

                        <button
                            onClick={() => refetch()}
                            className="btn btn-primary mt-3"
                        >
                            <RefreshCw size={17} />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-base-content/50 mb-2">
                        <GraduationCap size={17} />
                        Student Portal
                        <ChevronRight size={14} />
                        Examinations
                        <ChevronRight size={14} />
                        Schedule
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold">
                        Examination Schedule
                    </h1>

                    <p className="text-base-content/60 mt-2">
                        View your examination dates, subjects, times, and marks.
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
            <div className="card bg-gradient-to-r from-primary to-blue-600 text-primary-content shadow-md">
                <div className="card-body p-5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                            <h2 className="text-xl font-bold">
                                {student.full_name || "Student"}
                            </h2>

                            <p className="text-sm opacity-80 mt-1">
                                Student ID: {student.student_code || "N/A"}
                            </p>

                            <p className="text-sm opacity-80">
                                {student.class_name || "N/A"}
                                {" • "}
                                Section {student.section_name || "N/A"}
                            </p>
                        </div>

                        <div className="sm:text-right">
                            <p className="text-sm opacity-80">
                                Academic Year
                            </p>

                            <h3 className="text-2xl font-bold">
                                {data?.academic_year || "N/A"}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <SummaryCard
                    title="Total Examinations"
                    value={summary.total}
                    description="All scheduled examinations"
                    icon={ClipboardList}
                    color="bg-blue-100 text-blue-600"
                />

                <SummaryCard
                    title="Upcoming"
                    value={summary.upcoming}
                    description="Examinations yet to begin"
                    icon={CalendarClock}
                    color="bg-amber-100 text-amber-600"
                />

                <SummaryCard
                    title="Completed"
                    value={summary.completed}
                    description="Examinations already held"
                    icon={CheckCircle2}
                    color="bg-green-100 text-green-600"
                />

                <SummaryCard
                    title="Cancelled"
                    value={summary.cancelled}
                    description="Cancelled examination schedules"
                    icon={XCircle}
                    color="bg-red-100 text-red-600"
                />
            </div>

            {/* Filters */}
            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Filter size={19} className="text-primary" />

                        <h2 className="font-semibold">
                            Filter Examinations
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

                        {/* Search */}
                        <label className="input input-bordered flex items-center gap-2">
                            <Search size={17} className="text-base-content/40" />

                            <input
                                type="text"
                                className="grow"
                                placeholder="Search exam or subject..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />
                        </label>

                        {/* Status */}
                        <select
                            className="select select-bordered w-full"
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                        >
                            <option value="all">All Status</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        {/* Exam Type */}
                        <select
                            className="select select-bordered w-full"
                            value={typeFilter}
                            onChange={(e) =>
                                setTypeFilter(e.target.value)
                            }
                        >
                            <option value="all">All Exam Types</option>

                            {examTypes.map((type) => (
                                <option
                                    key={type}
                                    value={String(type).toLowerCase()}
                                >
                                    {type}
                                </option>
                            ))}
                        </select>

                        {/* Month */}
                        <select
                            className="select select-bordered w-full"
                            value={monthFilter}
                            onChange={(e) =>
                                setMonthFilter(e.target.value)
                            }
                        >
                            <option value="all">All Months</option>

                            {months.map((month) => (
                                <option key={month} value={month}>
                                    {new Date(
                                        `${month}-01T00:00:00`
                                    ).toLocaleDateString("en-US", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                        <p className="text-xs text-base-content/50">
                            Showing {filteredExams.length} of {exams.length} examinations
                        </p>

                        <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => {
                                setSearch("");
                                setStatusFilter("all");
                                setTypeFilter("all");
                                setMonthFilter("all");
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Examination Schedule */}
            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-5">

                    <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                            <h2 className="card-title text-lg">
                                <CalendarDays size={21} className="text-primary" />
                                Complete Schedule
                            </h2>

                            <p className="text-sm text-base-content/50 mt-1">
                                Examination schedule grouped by date
                            </p>
                        </div>

                        <span className="badge badge-primary badge-outline">
                            {filteredExams.length} Records
                        </span>
                    </div>

                    {filteredExams.length === 0 ? (
                        <div className="py-14 text-center">
                            <CalendarDays
                                size={45}
                                className="mx-auto text-base-content/30"
                            />

                            <h3 className="font-semibold mt-4">
                                No Examinations Found
                            </h3>

                            <p className="text-sm text-base-content/50 mt-2">
                                No examination matches your selected filters.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {sortedDates.map((date) => (
                                <div key={date}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Calendar size={18} />
                                        </div>

                                        <h3 className="font-semibold">
                                            {formatDate(date)}
                                        </h3>

                                        <span className="badge badge-ghost badge-sm">
                                            {groupedExams[date].length} Subject(s)
                                        </span>
                                    </div>

                                    <div className="overflow-x-auto border border-base-200 rounded-xl">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Examination</th>
                                                    <th>Subject</th>
                                                    <th>Time</th>
                                                    <th>Total Marks</th>
                                                    <th>Pass Marks</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {groupedExams[date].map((exam, index) => (
                                                    <tr
                                                        key={`${exam.exam_id}-${exam.subject_id}-${index}`}
                                                    >
                                                        <td>
                                                            <div className="font-semibold">
                                                                {exam.exam_name}
                                                            </div>

                                                            <div className="text-xs text-base-content/50">
                                                                {exam.exam_type || "Examination"}
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <div className="flex items-center gap-2">
                                                                <BookOpen
                                                                    size={16}
                                                                    className="text-primary"
                                                                />

                                                                <span>
                                                                    {exam.subject_name || "N/A"}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td className="whitespace-nowrap">
                                                            <div className="flex items-center gap-1">
                                                                <Clock
                                                                    size={14}
                                                                    className="text-base-content/50"
                                                                />

                                                                {formatTime(exam.start_time)}
                                                            </div>

                                                            <div className="text-xs text-base-content/50 ml-5">
                                                                to {formatTime(exam.end_time)}
                                                            </div>
                                                        </td>

                                                        <td className="font-semibold">
                                                            {exam.total_marks ?? "N/A"}
                                                        </td>

                                                        <td>
                                                            {exam.pass_marks ?? "N/A"}
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`badge ${getStatusBadge(exam.status)}`}
                                                            >
                                                                {exam.status || "N/A"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Preparation Reminder */}
            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-5">
                    <div className="flex items-start gap-3">
                        <div className="p-3 rounded-xl bg-warning/10 text-warning">
                            <Timer size={24} />
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Examination Preparation Reminder
                            </h3>

                            <p className="text-sm text-base-content/60 mt-1">
                                Check your examination dates carefully and prepare
                                your subjects according to the published schedule.
                                Arrive at the examination venue before the starting time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default StudentExamSchedule;
