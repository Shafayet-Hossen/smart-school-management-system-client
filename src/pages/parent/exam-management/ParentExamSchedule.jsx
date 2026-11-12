
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    CalendarDays,
    Clock,
    BookOpen,
    Search,
    RefreshCw,
    AlertCircle,
    GraduationCap,
    Filter,
} from "lucide-react";

import { getParentExamSchedule } from "../../../services/parentExamService";

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (time) => {
    if (!time) return "—";

    const [hours, minutes] = time.split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
};

const getToday = () => {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const values = Object.fromEntries(
        parts.map((part) => [part.type, part.value])
    );

    return `${values.year}-${values.month}-${values.day}`;
};

const getExamStatus = (exam) => {
    if (exam.status === "cancelled") return "cancelled";
    if (exam.status === "completed") return "completed";

    return exam.exam_date < getToday() ? "completed" : "upcoming";
};

const statusStyles = {
    upcoming: "badge-info",
    completed: "badge-success",
    cancelled: "badge-error",
};

export default function ParentExamSchedule() {
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState("");

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: [
            "parent-exam-schedule",
            selectedStudentId,
        ],
        queryFn: () =>
            getParentExamSchedule({
                ...(selectedStudentId
                    ? { studentId: selectedStudentId }
                    : {}),
            }),
        staleTime: 1000 * 60 * 5,
    });

    const children = data?.children || [];
    const exams = data?.exams || [];

    const filteredExams = useMemo(() => {
        return exams.filter((exam) => {
            const status = getExamStatus(exam);

            const matchesSearch = [
                exam.exam_name,
                exam.subject_name,
                exam.class_name,
                exam.section_name,
            ]
                .filter(Boolean)
                .some((value) =>
                    value.toLowerCase().includes(search.toLowerCase())
                );

            const matchesStatus =
                statusFilter === "all" || status === statusFilter;

            const matchesMonth =
                !selectedMonth ||
                exam.exam_date?.startsWith(selectedMonth);

            return matchesSearch && matchesStatus && matchesMonth;
        });
    }, [exams, search, statusFilter, selectedMonth]);

    const summary = useMemo(() => {
        const today = getToday();

        return {
            total: exams.length,
            upcoming: exams.filter(
                (exam) => getExamStatus(exam) === "upcoming"
            ).length,
            completed: exams.filter(
                (exam) => getExamStatus(exam) === "completed"
            ).length,
            cancelled: exams.filter(
                (exam) => getExamStatus(exam) === "cancelled"
            ).length,
        };
    }, [exams]);

    const groupedExams = useMemo(() => {
        const groups = {};

        filteredExams.forEach((exam) => {
            const date = exam.exam_date || "Unknown date";

            if (!groups[date]) {
                groups[date] = [];
            }

            groups[date].push(exam);
        });

        return Object.entries(groups).sort(([a], [b]) =>
            a.localeCompare(b)
        );
    }, [filteredExams]);

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
                        Unable to load exam schedule
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
            {/* Page Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-primary" size={26} />
                        <h1 className="text-2xl font-bold">
                            Exam Schedule
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-base-content/60">
                        View your children's examination timetable.
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
                        <label className="label">
                            <span className="label-text font-semibold">
                                Select Child
                            </span>
                        </label>

                        <select
                            className="select select-bordered w-full max-w-md"
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
                                    {child.full_name} — {child.class_name}
                                    {child.section_name
                                        ? ` (${child.section_name})`
                                        : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    title="Total Exams"
                    value={summary.total}
                    icon={<BookOpen size={22} />}
                    color="text-primary"
                    bg="bg-primary/10"
                />

                <SummaryCard
                    title="Upcoming Exams"
                    value={summary.upcoming}
                    icon={<CalendarDays size={22} />}
                    color="text-info"
                    bg="bg-info/10"
                />

                <SummaryCard
                    title="Completed Exams"
                    value={summary.completed}
                    icon={<GraduationCap size={22} />}
                    color="text-success"
                    bg="bg-success/10"
                />

                <SummaryCard
                    title="Cancelled Exams"
                    value={summary.cancelled}
                    icon={<AlertCircle size={22} />}
                    color="text-error"
                    bg="bg-error/10"
                />
            </div>

            {/* Filters */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body gap-4 p-4">
                    <div className="flex items-center gap-2 font-semibold">
                        <Filter size={18} />
                        Filter Examination Schedule
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <label className="input input-bordered flex items-center gap-2">
                            <Search size={18} className="opacity-50" />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Search exam or subject..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </label>

                        <select
                            className="select select-bordered"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <option value="all">All Exams</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <input
                            type="month"
                            className="input input-bordered"
                            value={selectedMonth}
                            onChange={(event) =>
                                setSelectedMonth(event.target.value)
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Schedule List */}
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">
                        Examination Timetable
                    </h2>

                    <span className="badge badge-outline">
                        {filteredExams.length} schedules
                    </span>
                </div>

                {groupedExams.length === 0 ? (
                    <div className="card border border-base-300 bg-base-100">
                        <div className="card-body items-center py-12 text-center">
                            <CalendarDays
                                size={42}
                                className="text-base-content/30"
                            />
                            <h3 className="mt-2 text-lg font-semibold">
                                No exams found
                            </h3>
                            <p className="text-sm text-base-content/60">
                                There are no examination schedules matching
                                your selected filters.
                            </p>
                        </div>
                    </div>
                ) : (
                    groupedExams.map(([date, dateExams]) => (
                        <div
                            key={date}
                            className="card border border-base-300 bg-base-100 shadow-sm"
                        >
                            <div className="flex items-center gap-3 border-b border-base-300 p-4">
                                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                    <CalendarDays size={22} />
                                </div>

                                <div>
                                    <h3 className="font-bold">
                                        {formatDate(date)}
                                    </h3>
                                    <p className="text-xs text-base-content/60">
                                        {dateExams.length} examination(s)
                                    </p>
                                </div>
                            </div>

                            <div className="divide-y divide-base-300">
                                {dateExams.map((exam, index) => {
                                    const status = getExamStatus(exam);

                                    return (
                                        <div
                                            key={`${exam.exam_id}-${exam.subject_id}-${exam.section_id}-${index}`}
                                            className="flex flex-col justify-between gap-4 p-4 md:flex-row md:items-center"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="rounded-lg bg-base-200 p-3">
                                                    <BookOpen
                                                        size={21}
                                                        className="text-primary"
                                                    />
                                                </div>

                                                <div>
                                                    <h4 className="font-bold">
                                                        {exam.subject_name ||
                                                            "Subject"}
                                                    </h4>

                                                    <p className="text-sm text-base-content/70">
                                                        {exam.exam_name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-base-content/60">
                                                        {exam.class_name}
                                                        {exam.section_name
                                                            ? ` • Section ${exam.section_name}`
                                                            : ""}
                                                    </p>

                                                    {exam.student_name && (
                                                        <p className="mt-1 text-xs text-base-content/60">
                                                            Student:{" "}
                                                            {exam.student_name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-sm md:min-w-[230px]">
                                                <div>
                                                    <p className="text-xs text-base-content/50">
                                                        Exam Time
                                                    </p>
                                                    <p className="flex items-center gap-1 font-medium">
                                                        <Clock size={14} />
                                                        {formatTime(
                                                            exam.start_time
                                                        )}
                                                        {" - "}
                                                        {formatTime(
                                                            exam.end_time
                                                        )}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-base-content/50">
                                                        Total Marks
                                                    </p>
                                                    <p className="font-medium">
                                                        {exam.total_marks ?? "—"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-base-content/50">
                                                        Pass Marks
                                                    </p>
                                                    <p className="font-medium">
                                                        {exam.pass_marks ?? "—"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-base-content/50">
                                                        Status
                                                    </p>
                                                    <span
                                                        className={`badge ${
                                                            statusStyles[status] ||
                                                            "badge-ghost"
                                                        } badge-sm`}
                                                    >
                                                        {status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon, color, bg }) {
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
                </div>

                <div className={`rounded-xl p-3 ${bg} ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
