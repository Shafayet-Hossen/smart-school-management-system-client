
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    ClipboardList,
    Plus,
    Eye,
    Edit,
    Trash2,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    BookOpen,
    GraduationCap,
    User,
    X,
    AlertCircle,
    Clock,
    CheckCircle2,
    XCircle,
    FileText,
    ClipboardCheck,
    SlidersHorizontal,
} from "lucide-react";

import {
    getSchoolAdminAssignments,
} from "../../../services/schoolAdminAssignmentService";

const PAGE_SIZE = 10;

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
        cancelled: "badge-ghost",
    };

    return styles[String(status || "").toLowerCase()] || "badge-ghost";
};

const getSubmissionPercentage = (submitted, expected) => {
    if (!expected) return 0;

    return Math.min(
        100,
        Math.max(0, (submitted / expected) * 100)
    );
};

const SubmissionProgress = ({ submitted, expected }) => {
    const percentage = getSubmissionPercentage(
        submitted,
        expected
    );

    return (
        <div className="min-w-28 space-y-1">
            <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold">
                    {submitted}/{expected}
                </span>
                <span className="text-base-content/50">
                    {percentage.toFixed(0)}%
                </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-base-300">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

const AllAssignments = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [classId, setClassId] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [dueDateFilter, setDueDateFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedAssignment, setSelectedAssignment] =
        useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);

    const filters = useMemo(
        () => ({
            search: search.trim(),
            status,
            classId,
            subjectId,
            academicYear,
            dueDateFilter,
            page: currentPage,
            limit: PAGE_SIZE,
        }),
        [
            search,
            status,
            classId,
            subjectId,
            academicYear,
            dueDateFilter,
            currentPage,
        ]
    );

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["school-admin-all-assignments", filters],
        queryFn: () => getSchoolAdminAssignments(filters),
        placeholderData: (previousData) => previousData,
    });

    const assignments = data?.assignments || [];
    const pagination = data?.pagination || {};
    const summary = data?.summary || {};

    const totalPages = Math.max(
        1,
        Number(pagination.total_pages || 1)
    );

    const totalAssignments = Number(
        pagination.total || 0
    );

    const startRecord =
        totalAssignments === 0
            ? 0
            : (currentPage - 1) * PAGE_SIZE + 1;

    const endRecord = Math.min(
        currentPage * PAGE_SIZE,
        totalAssignments
    );

    const handleFilterChange = (setter, value) => {
        setter(value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("");
        setClassId("");
        setSubjectId("");
        setAcademicYear("");
        setDueDateFilter("");
        setCurrentPage(1);
    };

    const hasFilters = Boolean(
        search ||
        status ||
        classId ||
        subjectId ||
        academicYear ||
        dueDateFilter
    );

    const handleView = (assignment) => {
        setSelectedAssignment(assignment);
    };

    const handleDelete = (assignment) => {
        setDeleteTarget(assignment);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;

        navigate(
            `/school-admin/assignments/${deleteTarget.assignment_id}/delete`,
            {
                state: {
                    assignment: deleteTarget,
                    returnTo: "/school-admin/assignments",
                },
            }
        );

        setDeleteTarget(null);
    };

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
                        Unable to load assignments
                    </h2>

                    <p className="max-w-md text-sm text-base-content/60">
                        {error?.response?.data?.message ||
                            error?.message ||
                            "Something went wrong."}
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
                        All Assignments
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        View and manage assignments created across
                        your school.
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-base-content/60">
                                Total Assignments
                            </p>
                            <ClipboardList
                                size={23}
                                className="text-primary"
                            />
                        </div>

                        <h2 className="text-3xl font-bold">
                            {summary.total_assignments ?? totalAssignments}
                        </h2>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-base-content/60">
                                Active
                            </p>
                            <Clock
                                size={23}
                                className="text-success"
                            />
                        </div>

                        <h2 className="text-3xl font-bold text-success">
                            {summary.active_assignments ?? 0}
                        </h2>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-base-content/60">
                                Completed
                            </p>
                            <CheckCircle2
                                size={23}
                                className="text-info"
                            />
                        </div>

                        <h2 className="text-3xl font-bold text-info">
                            {summary.completed_assignments ?? 0}
                        </h2>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-base-content/60">
                                Expired
                            </p>
                            <XCircle
                                size={23}
                                className="text-error"
                            />
                        </div>

                        <h2 className="text-3xl font-bold text-error">
                            {summary.expired_assignments ?? 0}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal
                                size={19}
                                className="text-primary"
                            />
                            <h2 className="font-bold">
                                Search & Filters
                            </h2>
                        </div>

                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="btn btn-ghost btn-xs text-error"
                            >
                                <X size={14} />
                                Clear Filters
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {/* Search */}
                        <label className="input input-bordered flex items-center gap-2">
                            <Search
                                size={17}
                                className="text-base-content/50"
                            />

                            <input
                                type="text"
                                className="grow"
                                placeholder="Search title, teacher, class..."
                                value={search}
                                onChange={(e) =>
                                    handleFilterChange(
                                        setSearch,
                                        e.target.value
                                    )
                                }
                            />
                        </label>

                        {/* Status */}
                        <select
                            className="select select-bordered w-full"
                            value={status}
                            onChange={(e) =>
                                handleFilterChange(
                                    setStatus,
                                    e.target.value
                                )
                            }
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="expired">Expired</option>
                            <option value="draft">Draft</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        {/* Class */}
                        <select
                            className="select select-bordered w-full"
                            value={classId}
                            onChange={(e) =>
                                handleFilterChange(
                                    setClassId,
                                    e.target.value
                                )
                            }
                        >
                            <option value="">All Classes</option>

                            {(data?.filters?.classes || []).map(
                                (item) => (
                                    <option
                                        key={item.class_id}
                                        value={item.class_id}
                                    >
                                        {item.class_name}
                                    </option>
                                )
                            )}
                        </select>

                        {/* Subject */}
                        <select
                            className="select select-bordered w-full"
                            value={subjectId}
                            onChange={(e) =>
                                handleFilterChange(
                                    setSubjectId,
                                    e.target.value
                                )
                            }
                        >
                            <option value="">All Subjects</option>

                            {(data?.filters?.subjects || []).map(
                                (item) => (
                                    <option
                                        key={item.subject_id}
                                        value={item.subject_id}
                                    >
                                        {item.subject_name}
                                    </option>
                                )
                            )}
                        </select>

                        {/* Academic Year */}
                        <select
                            className="select select-bordered w-full"
                            value={academicYear}
                            onChange={(e) =>
                                handleFilterChange(
                                    setAcademicYear,
                                    e.target.value
                                )
                            }
                        >
                            <option value="">All Academic Years</option>

                            {(data?.filters?.academic_years || []).map(
                                (year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                )
                            )}
                        </select>

                        {/* Due Date */}
                        <select
                            className="select select-bordered w-full"
                            value={dueDateFilter}
                            onChange={(e) =>
                                handleFilterChange(
                                    setDueDateFilter,
                                    e.target.value
                                )
                            }
                        >
                            <option value="">All Due Dates</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="today">Due Today</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Assignment Table */}
            <div className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm">

                <div className="flex flex-col justify-between gap-2 border-b border-base-300 p-5 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-lg font-bold">
                            Assignment Records
                        </h2>

                        <p className="text-sm text-base-content/60">
                            {totalAssignments} assignment(s) found
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-base-content/50">
                        <FileText size={15} />
                        Page {currentPage} of {totalPages}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Assignment</th>
                                <th>Class / Section</th>
                                <th>Subject</th>
                                <th>Teacher</th>
                                <th>Due Date</th>
                                <th>Submissions</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {assignments.length > 0 ? (
                                assignments.map((item, index) => (
                                    <tr key={item.assignment_id}>
                                        <td>
                                            {(currentPage - 1) *
                                                PAGE_SIZE +
                                                index +
                                                1}
                                        </td>

                                        <td>
                                            <div className="min-w-40">
                                                <p className="font-semibold">
                                                    {item.title}
                                                </p>

                                                <p className="text-xs text-base-content/50">
                                                    {item.assignment_id}
                                                </p>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="flex items-center gap-2">
                                                <GraduationCap
                                                    size={16}
                                                    className="text-primary"
                                                />

                                                <div>
                                                    <p className="font-medium">
                                                        {item.class_name || "N/A"}
                                                    </p>

                                                    <p className="text-xs text-base-content/50">
                                                        {item.section_name
                                                            ? `Section ${item.section_name}`
                                                            : "All Sections"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="flex items-center gap-2">
                                                <BookOpen
                                                    size={15}
                                                    className="text-info"
                                                />
                                                {item.subject_name || "N/A"}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="flex items-center gap-2">
                                                <User
                                                    size={15}
                                                    className="text-base-content/50"
                                                />
                                                {item.teacher_name || "N/A"}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="flex items-center gap-1 whitespace-nowrap">
                                                <CalendarDays
                                                    size={14}
                                                    className="text-base-content/50"
                                                />
                                                {formatDate(item.due_date)}
                                            </div>
                                        </td>

                                        <td>
                                            <SubmissionProgress
                                                submitted={
                                                    item.submitted_count || 0
                                                }
                                                expected={
                                                    item.expected_submissions || 0
                                                }
                                            />
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
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() =>
                                                        handleView(item)
                                                    }
                                                    className="btn btn-ghost btn-square btn-sm text-primary"
                                                    title="View details"
                                                >
                                                    <Eye size={17} />
                                                </button>

                                                <Link
                                                    to={`/school-admin/assignments/${item.assignment_id}/edit`}
                                                    className="btn btn-ghost btn-square btn-sm text-warning"
                                                    title="Edit assignment"
                                                >
                                                    <Edit size={17} />
                                                </Link>

                                                <Link
                                                    to={`/school-admin/assignments/${item.assignment_id}/submissions`}
                                                    className="btn btn-ghost btn-square btn-sm text-success"
                                                    title="View submissions"
                                                >
                                                    <ClipboardCheck size={17} />
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(item)
                                                    }
                                                    className="btn btn-ghost btn-square btn-sm text-error"
                                                    title="Delete assignment"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="9"
                                        className="py-12 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <ClipboardList
                                                size={38}
                                                className="text-base-content/30"
                                            />

                                            <p className="font-semibold">
                                                No assignments found
                                            </p>

                                            <p className="text-sm text-base-content/50">
                                                Try changing your filters or
                                                create a new assignment.
                                            </p>

                                            <Link
                                                to="/school-admin/assignments/create"
                                                className="btn btn-primary btn-sm mt-2"
                                            >
                                                <Plus size={15} />
                                                Create Assignment
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col justify-between gap-3 border-t border-base-300 p-4 sm:flex-row sm:items-center">
                    <p className="text-sm text-base-content/60">
                        Showing {startRecord} to {endRecord} of{" "}
                        {totalAssignments} assignments
                    </p>

                    <div className="join">
                        <button
                            className="btn btn-sm join-item"
                            disabled={currentPage <= 1}
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.max(1, page - 1)
                                )
                            }
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <button className="btn btn-sm join-item">
                            {currentPage} / {totalPages}
                        </button>

                        <button
                            className="btn btn-sm join-item"
                            disabled={currentPage >= totalPages}
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.min(totalPages, page + 1)
                                )
                            }
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Assignment Details Modal */}
            {selectedAssignment && (
                <dialog open className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box max-w-2xl">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-primary">
                                    <ClipboardList size={20} />
                                    <span className="text-sm font-semibold">
                                        Assignment Details
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold">
                                    {selectedAssignment.title}
                                </h3>

                                <p className="mt-1 text-sm text-base-content/60">
                                    {selectedAssignment.assignment_id}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedAssignment(null)}
                                className="btn btn-circle btn-ghost btn-sm"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="my-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                                ["Class", selectedAssignment.class_name],
                                ["Section", selectedAssignment.section_name || "All Sections"],
                                ["Subject", selectedAssignment.subject_name],
                                ["Teacher", selectedAssignment.teacher_name],
                                ["Due Date", formatDate(selectedAssignment.due_date)],
                                ["Total Marks", selectedAssignment.total_marks],
                                ["Academic Year", selectedAssignment.academic_year],
                                ["Status", selectedAssignment.status],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="rounded-xl bg-base-200 p-3"
                                >
                                    <p className="text-xs text-base-content/60">
                                        {label}
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {value ?? "N/A"}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-xl border border-base-300 p-4">
                            <h4 className="mb-2 font-bold">
                                Submission Progress
                            </h4>

                            <SubmissionProgress
                                submitted={
                                    selectedAssignment.submitted_count || 0
                                }
                                expected={
                                    selectedAssignment.expected_submissions || 0
                                }
                            />

                            <div className="mt-3 flex flex-wrap gap-4 text-sm">
                                <span>
                                    Submitted:{" "}
                                    <strong>
                                        {selectedAssignment.submitted_count || 0}
                                    </strong>
                                </span>

                                <span>
                                    Pending:{" "}
                                    <strong>
                                        {selectedAssignment.pending_count || 0}
                                    </strong>
                                </span>

                                <span>
                                    Late:{" "}
                                    <strong>
                                        {selectedAssignment.late_count || 0}
                                    </strong>
                                </span>
                            </div>
                        </div>

                        <div className="modal-action flex-wrap">
                            <Link
                                to={`/school-admin/assignments/${selectedAssignment.assignment_id}/submissions`}
                                className="btn btn-outline btn-sm"
                            >
                                <ClipboardCheck size={16} />
                                Submissions
                            </Link>

                            <Link
                                to={`/school-admin/assignments/${selectedAssignment.assignment_id}/edit`}
                                className="btn btn-primary btn-sm"
                            >
                                <Edit size={16} />
                                Edit
                            </Link>

                            <button
                                onClick={() => setSelectedAssignment(null)}
                                className="btn btn-ghost btn-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    <form
                        method="dialog"
                        className="modal-backdrop"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setSelectedAssignment(null);
                        }}
                    >
                        <button type="submit">close</button>
                    </form>
                </dialog>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <dialog open className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box max-w-md">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-error/10 p-3 text-error">
                                <Trash2 size={24} />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold">
                                    Delete Assignment?
                                </h3>
                                <p className="text-sm text-base-content/60">
                                    This action needs confirmation.
                                </p>
                            </div>
                        </div>

                        <p className="my-5 text-sm">
                            Are you sure you want to delete{" "}
                            <strong>{deleteTarget.title}</strong>?
                            Consider whether student submissions need
                            to be retained for school records.
                        </p>

                        <div className="modal-action">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="btn btn-error"
                            >
                                Continue
                            </button>
                        </div>
                    </div>

                    <form
                        method="dialog"
                        className="modal-backdrop"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setDeleteTarget(null);
                        }}
                    >
                        <button type="submit">close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
};

export default AllAssignments;
