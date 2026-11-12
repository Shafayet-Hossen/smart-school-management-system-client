
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    getChildrenAssignments,
    getParentChildren,
} from "../../services/parentAssignmentService";

const EMPTY_ARRAY = [];

const normalizeStatus = (assignment) => {
    const submissionStatus = String(
        assignment?.submission?.status ??
        assignment?.submission_status ??
        ""
    ).toLowerCase();

    if (["graded", "reviewed"].includes(submissionStatus)) {
        return "graded";
    }

    if (["submitted", "pending_review"].includes(submissionStatus)) {
        return "submitted";
    }

    const dueDate = assignment?.due_date
        ? new Date(assignment.due_date)
        : null;

    if (dueDate && !Number.isNaN(dueDate.getTime()) && dueDate < new Date()) {
        return "overdue";
    }

    return "pending";
};

const statusStyles = {
    pending: "badge-warning",
    submitted: "badge-info",
    graded: "badge-success",
    overdue: "badge-error",
};

const formatDate = (value) => {
    if (!value) return "Not specified";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Not specified";

    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again.";

const getStudentId = (child) =>
    String(child?._id ?? child?.student_id ?? "");

const getChildName = (child) =>
    [child?.first_name, child?.last_name].filter(Boolean).join(" ") ||
    child?.name ||
    child?.student_name ||
    "Student";

export default function ChildrenAssignments() {
    const [selectedChildId, setSelectedChildId] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    // Load children linked to the authenticated parent.
    const {
        data: childrenData,
        isLoading: childrenLoading,
        isError: childrenError,
        error: childrenErrorDetails,
        refetch: refetchChildren,
    } = useQuery({
        queryKey: ["parent-children"],
        queryFn: getParentChildren,
    });

    const children = Array.isArray(childrenData?.children)
        ? childrenData.children
        : Array.isArray(childrenData?.data?.children)
            ? childrenData.data.children
            : Array.isArray(childrenData)
                ? childrenData
                : EMPTY_ARRAY;
    // console.log("Children: ",children)
    const activeChildId =
        selectedChildId || getStudentId(children[0]);

    const selectedChild =
        children.find(
            (child) => getStudentId(child) === activeChildId
        ) ?? null;

    // Load assignments for the selected child.
    const {
        data: assignmentsData,
        isLoading: assignmentsLoading,
        isError: assignmentsError,
        error: assignmentsErrorDetails,
        refetch: refetchAssignments,
    } = useQuery({
        queryKey: ["parent-children-assignments", activeChildId],
        queryFn: () => getChildrenAssignments(activeChildId),
        enabled: Boolean(activeChildId),
    });
    // console.log("AssignmentData",assignmentsData)
    const assignments = Array.isArray(assignmentsData?.assignments)
        ? assignmentsData.assignments
        : Array.isArray(assignmentsData?.data?.assignments)
            ? assignmentsData.data.assignments
            : Array.isArray(assignmentsData)
                ? assignmentsData
                : EMPTY_ARRAY;

    const counts = {
        total: assignments.length,
        pending: 0,
        submitted: 0,
        graded: 0,
        overdue: 0,
    };

    assignments.forEach((assignment) => {
        counts[normalizeStatus(assignment)] += 1;
    });

    const filteredAssignments = assignments.filter((assignment) => {
        const status = normalizeStatus(assignment);
        const title = String(assignment?.title ?? "").toLowerCase();
        const subject = String(
            assignment?.subject_name ?? assignment?.subject ?? ""
        ).toLowerCase();
        const teacher = String(assignment?.teacher_name ?? "").toLowerCase();
        const search = searchTerm.trim().toLowerCase();

        const matchesStatus =
            statusFilter === "all" || status === statusFilter;

        const matchesSearch =
            !search ||
            title.includes(search) ||
            subject.includes(search) ||
            teacher.includes(search);

        return matchesStatus && matchesSearch;
    });

    if (childrenLoading) {
        return (
            <main className="p-4 md:p-6">
                <div className="flex min-h-64 items-center justify-center gap-3">
                    <span className="loading loading-spinner loading-lg" />
                    <span>Loading your children...</span>
                </div>
            </main>
        );
    }

    if (childrenError) {
        return (
            <main className="p-4 md:p-6">
                <div className="alert alert-error">
                    <span>{getErrorMessage(childrenErrorDetails)}</span>
                    <button
                        className="btn btn-sm"
                        onClick={() => refetchChildren()}
                    >
                        Try again
                    </button>
                </div>
            </main>
        );
    }

    if (children.length === 0) {
        return (
            <main className="space-y-4 p-4 md:p-6">
                <h1 className="text-2xl font-bold">Children's Assignments</h1>
                <div className="rounded-2xl border border-base-300 bg-base-100 p-8 text-center">
                    <div className="mb-3 text-4xl">📚</div>
                    <h2 className="text-lg font-semibold">
                        No children found
                    </h2>
                    <p className="mt-2 text-base-content/70">
                        No student profiles are currently linked to your parent account.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="space-y-6 p-4 md:p-6">
            {/* Page heading */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl">
                        Children's Assignments
                    </h1>
                    <p className="mt-1 text-sm text-base-content/70">
                        Track assignments, due dates, results, and teacher feedback.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => refetchAssignments()}
                    disabled={assignmentsLoading}
                >
                    <span className="mr-1">↻</span>
                    Refresh
                </button>
            </div>

            {/* Child selector */}
            <section className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body gap-3 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="font-semibold">Select child</h2>
                        <p className="text-sm text-base-content/60">
                            Choose which child's assignments to view.
                        </p>
                    </div>

                    <select
                        className="select select-bordered w-full md:max-w-sm"
                        value={activeChildId}
                        onChange={(event) => {
                            setSelectedChildId(event.target.value);
                            setStatusFilter("all");
                            setSearchTerm("");
                            setSelectedAssignment(null);
                        }}
                    >
                        {children.map((child) => {
                            const id = getStudentId(child);

                            return (
                                <option key={id} value={id}>
                                    {getChildName(child)}
                                    {child?.class_name
                                        ? ` — ${child.class_name}`
                                        : ""}
                                    {child?.section_name
                                        ? ` (${child.section_name})`
                                        : ""}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </section>

            {/* Selected child information */}
            {selectedChild && (
                <section className="flex flex-wrap items-center gap-4 rounded-2xl bg-primary/5 p-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                        {getChildName(selectedChild)
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">
                            {getChildName(selectedChild)}
                        </h2>
                        <p className="text-sm text-base-content/70">
                            {[
                                selectedChild?.class_name,
                                selectedChild?.section_name
                                    ? `Section ${selectedChild.section_name}`
                                    : null,
                                selectedChild?.roll_number
                                    ? `Roll ${selectedChild.roll_number}`
                                    : null,
                            ]
                                .filter(Boolean)
                                .join(" • ") || "Student"}
                        </p>
                    </div>
                </section>
            )}

            {/* Assignment summary */}
            <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                {[
                    {
                        label: "Total",
                        value: counts.total,
                        color: "text-primary",
                    },
                    {
                        label: "Pending",
                        value: counts.pending,
                        color: "text-warning",
                    },
                    {
                        label: "Submitted",
                        value: counts.submitted,
                        color: "text-info",
                    },
                    {
                        label: "Graded",
                        value: counts.graded,
                        color: "text-success",
                    },
                    {
                        label: "Overdue",
                        value: counts.overdue,
                        color: "text-error",
                    },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="card border border-base-300 bg-base-100 shadow-sm"
                    >
                        <div className="card-body gap-1 p-4">
                            <p className="text-sm text-base-content/70">
                                {item.label}
                            </p>
                            <p className={`text-2xl font-bold ${item.color}`}>
                                {item.value}
                            </p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Search and filters */}
            <section className="flex flex-col gap-3 sm:flex-row">
                <label className="input input-bordered flex flex-1 items-center gap-2">
                    <span aria-hidden="true">⌕</span>
                    <input
                        type="search"
                        className="grow"
                        placeholder="Search title, subject, or teacher..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </label>

                <select
                    className="select select-bordered w-full sm:w-48"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="Filter assignments by status"
                >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="submitted">Submitted</option>
                    <option value="graded">Graded</option>
                    <option value="overdue">Overdue</option>
                </select>
            </section>

            {/* Assignment results */}
            {assignmentsLoading ? (
                <div className="flex min-h-48 items-center justify-center gap-3">
                    <span className="loading loading-spinner loading-lg" />
                    <span>Loading assignments...</span>
                </div>
            ) : assignmentsError ? (
                <div className="alert alert-error">
                    <span>{getErrorMessage(assignmentsErrorDetails)}</span>
                    <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => refetchAssignments()}
                    >
                        Try again
                    </button>
                </div>
            ) : assignments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-base-300 p-10 text-center">
                    <div className="mb-3 text-4xl">📘</div>
                    <h2 className="text-lg font-semibold">
                        No assignments found
                    </h2>
                    <p className="mt-2 text-sm text-base-content/70">
                        There are no assignments available for this child yet.
                    </p>
                </div>
            ) : filteredAssignments.length === 0 ? (
                <div className="rounded-2xl border border-base-300 p-8 text-center">
                    <h2 className="font-semibold">No matching assignments</h2>
                    <p className="mt-1 text-sm text-base-content/70">
                        Try another search term or status filter.
                    </p>
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm mt-3"
                        onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                        }}
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <section className="grid gap-4 xl:grid-cols-2">
                    {filteredAssignments.map((assignment) => {
                        const status = normalizeStatus(assignment);
                        const subject =
                            assignment?.subject_name ??
                            assignment?.subject ??
                            "General";

                        const marks =
                            assignment?.submission?.marks ??
                            assignment?.marks_obtained;

                        const totalMarks =
                            assignment?.total_marks ??
                            assignment?.max_marks;

                        return (
                            <article
                                key={assignment._id}
                                className="card border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="card-body gap-4 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h2 className="break-words text-lg font-bold">
                                                {assignment?.title ??
                                                    "Untitled assignment"}
                                            </h2>
                                            <p className="mt-1 text-sm text-base-content/70">
                                                {subject}
                                            </p>
                                        </div>

                                        <span
                                            className={`badge ${statusStyles[status]} shrink-0`}
                                        >
                                            {status.charAt(0).toUpperCase() +
                                                status.slice(1)}
                                        </span>
                                    </div>

                                    <p className="line-clamp-3 text-sm text-base-content/80">
                                        {assignment?.description ||
                                            "No description provided."}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 rounded-xl bg-base-200/60 p-3 text-sm">
                                        <div>
                                            <p className="text-base-content/60">
                                                Due date
                                            </p>
                                            <p className="mt-1 font-medium">
                                                {formatDate(assignment?.due_date)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-base-content/60">
                                                Teacher
                                            </p>
                                            <p className="mt-1 break-words font-medium">
                                                {assignment?.teacher_name ||
                                                    "Not specified"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-base-content/60">
                                                Total marks
                                            </p>
                                            <p className="mt-1 font-medium">
                                                {totalMarks ?? "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-base-content/60">
                                                Result
                                            </p>
                                            <p className="mt-1 font-medium">
                                                {marks != null
                                                    ? `${marks}${totalMarks != null ? ` / ${totalMarks}` : ""}`
                                                    : status === "graded"
                                                        ? "Graded"
                                                        : "Not available"}
                                            </p>
                                        </div>
                                    </div>

                                    {assignment?.attachment_url && (
                                        <a
                                            href={assignment.attachment_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="link link-primary break-all text-sm"
                                        >
                                            View assignment attachment
                                        </a>
                                    )}

                                    <div className="card-actions justify-end">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm"
                                            onClick={() =>
                                                setSelectedAssignment(assignment)
                                            }
                                        >
                                            View details
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </section>
            )}

            {/* Assignment details modal */}
            {selectedAssignment && (
                <dialog
                    open
                    className="modal modal-bottom sm:modal-middle"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedAssignment(null);
                        }
                    }}
                >
                    <div className="modal-box max-h-[85vh]">
                        <h2 className="text-xl font-bold">
                            {selectedAssignment.title || "Assignment details"}
                        </h2>

                        <p className="mt-1 text-sm text-base-content/70">
                            {selectedAssignment.subject_name ??
                                selectedAssignment.subject ??
                                "General"}
                        </p>

                        <div className="divider" />

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">Description</h3>
                                <p className="mt-1 whitespace-pre-wrap text-sm text-base-content/80">
                                    {selectedAssignment.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-base-content/60">
                                        Due date
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {formatDate(selectedAssignment.due_date)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-base-content/60">
                                        Teacher
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {selectedAssignment.teacher_name ||
                                            "Not specified"}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl bg-base-200 p-4">
                                <h3 className="font-semibold">
                                    Submission information
                                </h3>
                                <p className="mt-2 text-sm">
                                    Status:{" "}
                                    <span className="font-medium">
                                        {normalizeStatus(selectedAssignment)}
                                    </span>
                                </p>

                                {selectedAssignment.submission?.submitted_at && (
                                    <p className="mt-1 text-sm">
                                        Submitted:{" "}
                                        {formatDate(
                                            selectedAssignment.submission.submitted_at
                                        )}
                                    </p>
                                )}

                                {selectedAssignment.submission?.answer && (
                                    <div className="mt-3">
                                        <p className="text-sm font-medium">
                                            Submitted answer
                                        </p>
                                        <p className="mt-1 whitespace-pre-wrap text-sm">
                                            {selectedAssignment.submission.answer}
                                        </p>
                                    </div>
                                )}

                                {selectedAssignment.submission?.submission_url && (
                                    <a
                                        href={
                                            selectedAssignment.submission
                                                .submission_url
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="link link-primary mt-3 block break-all text-sm"
                                    >
                                        View submitted work
                                    </a>
                                )}

                                {selectedAssignment.submission?.marks != null && (
                                    <p className="mt-3 text-sm font-semibold">
                                        Marks: {selectedAssignment.submission.marks}
                                        {(
                                            selectedAssignment.total_marks ??
                                            selectedAssignment.max_marks
                                        ) != null
                                            ? ` / ${selectedAssignment.total_marks ?? selectedAssignment.max_marks}`
                                            : ""}
                                    </p>
                                )}

                                {selectedAssignment.submission?.feedback && (
                                    <div className="mt-3">
                                        <p className="text-sm font-medium">
                                            Teacher feedback
                                        </p>
                                        <p className="mt-1 whitespace-pre-wrap text-sm">
                                            {selectedAssignment.submission.feedback}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {selectedAssignment.attachment_url && (
                                <a
                                    href={selectedAssignment.attachment_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-outline btn-sm"
                                >
                                    Open assignment attachment
                                </a>
                            )}
                        </div>

                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => setSelectedAssignment(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </main>
    );
}
