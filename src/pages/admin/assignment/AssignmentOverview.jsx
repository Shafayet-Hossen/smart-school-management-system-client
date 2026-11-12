
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    ClipboardList,
    ClipboardCheck,
    Clock,
    CheckCircle2,
    XCircle,
    Users,
    BookOpen,
    GraduationCap,
    TrendingUp,
    TrendingDown,
    CalendarDays,
    ArrowRight,
    RefreshCw,
    FileText,
    AlertCircle,
    Eye,
    Plus,
    BarChart3,
    Search,
} from "lucide-react";

import { Link } from "react-router-dom";
import { getSchoolAdminAssignmentOverview } from "../../../services/schoolAdminAssignmentService";

const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getStatusBadge = (status) => {
    const styles = {
        active: "badge-success",
        published: "badge-success",
        completed: "badge-info",
        expired: "badge-error",
        draft: "badge-warning",
        pending: "badge-warning",
    };

    return styles[String(status || "").toLowerCase()] || "badge-ghost";
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
        <div className="card-body gap-3 p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-base-content/60">
                    {title}
                </p>

                <div className={`rounded-xl p-3 ${color}`}>
                    <Icon size={22} />
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold">
                    {Number(value || 0).toLocaleString()}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <p className="text-xs text-base-content/60">
                        {description}
                    </p>

                    {trend !== undefined && trend !== null && (
                        <span
                            className={`flex items-center gap-1 text-xs font-semibold ${
                                trend >= 0
                                    ? "text-success"
                                    : "text-error"
                            }`}
                        >
                            {trend >= 0 ? (
                                <TrendingUp size={13} />
                            ) : (
                                <TrendingDown size={13} />
                            )}
                            {Math.abs(trend)}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const ProgressBar = ({ value, color = "bg-primary" }) => {
    const percentage = Math.min(
        100,
        Math.max(0, Number(value) || 0)
    );

    return (
        <div className="h-2 w-full overflow-hidden rounded-full bg-base-300">
            <div
                className={`h-full rounded-full transition-all ${color}`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

const AssignmentOverview = () => {
    const [period, setPeriod] = useState("all");
    const [search, setSearch] = useState("");

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["school-admin-assignment-overview", period],
        queryFn: () =>
            getSchoolAdminAssignmentOverview({ period }),
    });

    const summary = data?.summary || {};
    const recentAssignments = data?.recent_assignments || [];
    const upcomingDeadlines = data?.upcoming_deadlines || [];
    const classStatistics = data?.class_statistics || [];
    const submissionStatistics = data?.submission_statistics || {};

    const filteredRecentAssignments = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return recentAssignments;

        return recentAssignments.filter((item) =>
            [
                item.title,
                item.subject_name,
                item.class_name,
                item.teacher_name,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(keyword)
                )
        );
    }, [recentAssignments, search]);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body items-center py-12 text-center">
                    <AlertCircle size={42} className="text-error" />

                    <h2 className="text-xl font-bold">
                        Unable to load assignment overview
                    </h2>

                    <p className="max-w-md text-sm text-base-content/60">
                        {error?.response?.data?.message ||
                            error?.message ||
                            "Something went wrong while loading assignment data."}
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
        );
    }

    const totalSubmissions =
        submissionStatistics.total_submissions || 0;

    const submitted =
        submissionStatistics.submitted || 0;

    const pending =
        submissionStatistics.pending || 0;

    const late =
        submissionStatistics.late || 0;

    const submissionRate =
        Number(submissionStatistics.submission_rate) || 0;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                        <ClipboardList size={18} />
                        School Administration
                    </div>

                    <h1 className="text-2xl font-bold md:text-3xl">
                        Assignment Overview
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        Monitor assignments and student submission
                        activities across your school.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="btn btn-outline btn-sm"
                    >
                        <RefreshCw
                            size={16}
                            className={
                                isFetching ? "animate-spin" : ""
                            }
                        />
                        Refresh
                    </button>

                    <Link
                        to="/school-admin/assignments/create"
                        className="btn btn-primary btn-sm"
                    >
                        <Plus size={17} />
                        Create Assignment
                    </Link>
                </div>
            </div>

            {/* Period Filter */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="font-bold">
                        Assignment Statistics
                    </h2>
                    <p className="text-xs text-base-content/60">
                        School-wide assignment summary
                    </p>
                </div>

                <select
                    className="select select-bordered select-sm w-full sm:w-48"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </div>

            {/* Main Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Assignments"
                    value={summary.total_assignments}
                    description="Assignments created"
                    icon={ClipboardList}
                    color="bg-primary/10 text-primary"
                />

                <StatCard
                    title="Active Assignments"
                    value={summary.active_assignments}
                    description="Currently available"
                    icon={Clock}
                    color="bg-success/10 text-success"
                />

                <StatCard
                    title="Completed Assignments"
                    value={summary.completed_assignments}
                    description="Deadline completed"
                    icon={CheckCircle2}
                    color="bg-info/10 text-info"
                />

                <StatCard
                    title="Expired Assignments"
                    value={summary.expired_assignments}
                    description="Past deadline"
                    icon={XCircle}
                    color="bg-error/10 text-error"
                />
            </div>

            {/* Submission Statistics */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">

                <div className="card border border-base-300 bg-base-100 shadow-sm xl:col-span-2">
                    <div className="card-body">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Submission Overview
                                </h2>
                                <p className="text-sm text-base-content/60">
                                    Student assignment submission status
                                </p>
                            </div>

                            <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                <ClipboardCheck size={23} />
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div>
                                <p className="text-sm text-base-content/60">
                                    Total
                                </p>
                                <h3 className="mt-1 text-2xl font-bold">
                                    {totalSubmissions}
                                </h3>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Submitted
                                </p>
                                <h3 className="mt-1 text-2xl font-bold text-success">
                                    {submitted}
                                </h3>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Pending
                                </p>
                                <h3 className="mt-1 text-2xl font-bold text-warning">
                                    {pending}
                                </h3>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Late
                                </p>
                                <h3 className="mt-1 text-2xl font-bold text-error">
                                    {late}
                                </h3>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-semibold">
                                    Overall Submission Rate
                                </span>

                                <span className="text-lg font-bold text-primary">
                                    {submissionRate.toFixed(1)}%
                                </span>
                            </div>

                            <ProgressBar
                                value={submissionRate}
                                color="bg-primary"
                            />
                        </div>

                        <div className="mt-5 flex flex-wrap gap-4 text-xs">
                            <span className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-success" />
                                Submitted
                            </span>

                            <span className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                                Pending
                            </span>

                            <span className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-error" />
                                Late
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <div className="flex items-center gap-2">
                            <Users size={20} className="text-primary" />
                            <h2 className="font-bold">
                                Assignment Coverage
                            </h2>
                        </div>

                        <div className="mt-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <GraduationCap
                                        size={17}
                                        className="text-primary"
                                    />
                                    Classes Covered
                                </div>

                                <span className="font-bold">
                                    {summary.classes_covered || 0}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <BookOpen
                                        size={17}
                                        className="text-info"
                                    />
                                    Subjects Covered
                                </div>

                                <span className="font-bold">
                                    {summary.subjects_covered || 0}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <Users
                                        size={17}
                                        className="text-success"
                                    />
                                    Teachers Involved
                                </div>

                                <span className="font-bold">
                                    {summary.teachers_involved || 0}
                                </span>
                            </div>

                            <div className="divider my-1" />

                            <div className="rounded-xl bg-primary/5 p-3">
                                <p className="text-xs text-base-content/60">
                                    Average submissions per assignment
                                </p>

                                <p className="mt-1 text-2xl font-bold text-primary">
                                    {Number(
                                        summary.average_submissions || 0
                                    ).toFixed(1)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Class-wise Statistics */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold">
                                Class-wise Assignment Statistics
                            </h2>
                            <p className="text-sm text-base-content/60">
                                Assignment activity across different classes
                            </p>
                        </div>

                        <BarChart3
                            size={22}
                            className="text-primary"
                        />
                    </div>

                    {classStatistics.length > 0 ? (
                        <div className="mt-4 space-y-5">
                            {classStatistics.map((item) => (
                                <div
                                    key={`${item.class_code}-${item.class_name}`}
                                    className="space-y-2"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <p className="font-semibold">
                                                {item.class_name}
                                            </p>
                                            <p className="text-xs text-base-content/50">
                                                {item.total_assignments || 0}{" "}
                                                assignments ·{" "}
                                                {item.submitted || 0}{" "}
                                                submissions
                                            </p>
                                        </div>

                                        <span className="text-sm font-bold">
                                            {Number(
                                                item.submission_rate || 0
                                            ).toFixed(1)}
                                            %
                                        </span>
                                    </div>

                                    <ProgressBar
                                        value={item.submission_rate}
                                        color="bg-primary"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center text-sm text-base-content/50">
                            No class-wise statistics available.
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Assignments */}
            <div className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm">
                <div className="flex flex-col justify-between gap-3 border-b border-base-300 p-5 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-lg font-bold">
                            Recent Assignments
                        </h2>
                        <p className="text-sm text-base-content/60">
                            Latest assignments created in your school
                        </p>
                    </div>

                    <Link
                        to="/school-admin/assignments"
                        className="btn btn-outline btn-sm"
                    >
                        View All
                        <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="border-b border-base-300 p-4">
                    <label className="input input-bordered flex w-full items-center gap-2 sm:max-w-sm">
                        <Search
                            size={17}
                            className="text-base-content/50"
                        />
                        <input
                            type="text"
                            className="grow"
                            placeholder="Search assignments..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Assignment</th>
                                <th>Class</th>
                                <th>Subject</th>
                                <th>Teacher</th>
                                <th>Due Date</th>
                                <th>Submissions</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRecentAssignments.length > 0 ? (
                                filteredRecentAssignments.map((item) => (
                                    <tr key={item.assignment_id}>
                                        <td>
                                            <div className="font-semibold">
                                                {item.title}
                                            </div>
                                            <div className="text-xs text-base-content/50">
                                                {item.assignment_id}
                                            </div>
                                        </td>

                                        <td>{item.class_name || "N/A"}</td>

                                        <td>{item.subject_name || "N/A"}</td>

                                        <td>{item.teacher_name || "N/A"}</td>

                                        <td>
                                            {formatDate(item.due_date)}
                                        </td>

                                        <td>
                                            <span className="font-semibold">
                                                {item.submitted_count || 0}
                                            </span>
                                            /
                                            {item.expected_submissions || 0}
                                        </td>

                                        <td>
                                            <span
                                                className={`badge ${getStatusBadge(
                                                    item.status
                                                )}`}
                                            >
                                                {item.status || "Unknown"}
                                            </span>
                                        </td>

                                        <td>
                                            <Link
                                                to={`/school-admin/assignments/${item.assignment_id}`}
                                                className="btn btn-ghost btn-sm text-primary"
                                                title="View assignment"
                                            >
                                                <Eye size={17} />
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="py-10 text-center text-sm text-base-content/50"
                                    >
                                        No assignments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold">
                                Upcoming Assignment Deadlines
                            </h2>

                            <p className="text-sm text-base-content/60">
                                Assignments approaching their due dates
                            </p>
                        </div>

                        <CalendarDays
                            size={22}
                            className="text-warning"
                        />
                    </div>

                    {upcomingDeadlines.length > 0 ? (
                        <div className="mt-3 space-y-3">
                            {upcomingDeadlines.map((item) => (
                                <div
                                    key={item.assignment_id}
                                    className="flex flex-col justify-between gap-3 rounded-xl border border-base-300 p-4 sm:flex-row sm:items-center"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-xl bg-warning/10 p-3 text-warning">
                                            <CalendarDays size={20} />
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                {item.title}
                                            </p>

                                            <p className="text-xs text-base-content/60">
                                                {item.class_name} ·{" "}
                                                {item.subject_name}
                                            </p>

                                            <p className="mt-1 text-xs text-base-content/50">
                                                Teacher:{" "}
                                                {item.teacher_name || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="sm:text-right">
                                        <p className="text-sm font-semibold text-warning">
                                            Due {formatDate(item.due_date)}
                                        </p>

                                        <p className="text-xs text-base-content/50">
                                            {item.pending_count || 0} pending
                                            submissions
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-sm text-base-content/50">
                            No upcoming assignment deadlines.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AssignmentOverview;
