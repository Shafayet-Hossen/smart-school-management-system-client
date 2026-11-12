
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getStudentAssignments,
    submitStudentAssignment,
} from "../../services/studentAssignmentService";

const EMPTY_ASSIGNMENTS = [];

const getStatus = (assignment) => {
    const submissionStatus = String(
        assignment.submission?.status ?? ""
    ).toLowerCase();

    if (["submitted", "graded", "reviewed"].includes(submissionStatus)) {
        return submissionStatus === "reviewed" ? "graded" : submissionStatus;
    }

    if (assignment.submission) {
        return assignment.submission.marks != null
            ? "graded"
            : "submitted";
    }

    const dueDate = assignment.due_date
        ? new Date(assignment.due_date)
        : null;

    if (dueDate && !Number.isNaN(dueDate.getTime()) && dueDate < new Date()) {
        return "overdue";
    }

    return "pending";
};

const formatDate = (value) => {
    if (!value) return "No deadline";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const statusClasses = {
    pending: "badge-info",
    overdue: "badge-error",
    submitted: "badge-warning",
    graded: "badge-success",
};

const statusLabels = {
    pending: "Pending",
    overdue: "Overdue",
    submitted: "Submitted",
    graded: "Graded",
};

function StatusBadge({ status }) {
    return (
        <span
            className={`badge ${
                statusClasses[status] ?? "badge-ghost"
            } badge-outline`}
        >
            {statusLabels[status] ?? status}
        </span>
    );
}

function SummaryCard({ title, value, color }) {
    return (
        <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-2 p-5">
                <p className="text-sm text-base-content/70">{title}</p>
                <p className={`text-3xl font-bold ${color ?? ""}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function MyAssignments() {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [answer, setAnswer] = useState("");
    const [submissionUrl, setSubmissionUrl] = useState("");
    const [formError, setFormError] = useState("");

    const {
        data,
        isPending,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["student-assignments"],
        queryFn: getStudentAssignments,
        staleTime: 60 * 1000,
    });

    const assignments = Array.isArray(data?.assignments)
        ? data.assignments
        : Array.isArray(data)
            ? data
            : EMPTY_ASSIGNMENTS;
    
    const summary = useMemo(() => {
        const counts = {
            total: assignments.length,
            pending: 0,
            overdue: 0,
            submitted: 0,
            graded: 0,
        };

        assignments.forEach((assignment) => {
            const status = getStatus(assignment);
            if (Object.hasOwn(counts, status)) counts[status] += 1;
        });

        return counts;
    }, [assignments]);

    const filteredAssignments = useMemo(() => {
        const query = search.trim().toLowerCase();

        return assignments
            .filter((assignment) => {
                const status = getStatus(assignment);

                const matchesStatus =
                    statusFilter === "all" || status === statusFilter;

                const matchesSearch = [
                    assignment.title,
                    assignment.subject,
                    assignment.subject_name,
                    assignment.description,
                    assignment.teacher_name,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value).toLowerCase().includes(query)
                    );

                return matchesStatus && matchesSearch;
            })
            .sort((a, b) => {
                const dateA = a.due_date
                    ? new Date(a.due_date).getTime()
                    : Infinity;
                const dateB = b.due_date
                    ? new Date(b.due_date).getTime()
                    : Infinity;

                return dateA - dateB;
            });
    }, [assignments, search, statusFilter]);

    // console.log("FilteredAssignment: ",filteredAssignments)

    const submissionMutation = useMutation({
        mutationFn: submitStudentAssignment,
        onSuccess: async () => {
            setSelectedAssignment(null);
            setAnswer("");
            setSubmissionUrl("");
            setFormError("");

            await queryClient.invalidateQueries({
                queryKey: ["student-assignments"],
            });
        },
        onError: (mutationError) => {
            setFormError(
                mutationError?.response?.data?.message ||
                    mutationError?.message ||
                    "Could not submit the assignment. Please try again."
            );
        },
    });

    const openSubmission = (assignment) => {
        setSelectedAssignment(assignment);
        setAnswer(assignment.submission?.answer ?? "");
        setSubmissionUrl(
            assignment.submission?.submission_url ?? ""
        );
        setFormError("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormError("");

        if (!selectedAssignment?._id) {
            setFormError("Assignment ID is missing.");
            return;
        }

        if (!answer.trim() && !submissionUrl.trim()) {
            setFormError("Enter an answer or provide a submission link.");
            return;
        }

        if (["submitted", "graded"].includes(getStatus(selectedAssignment))) {
            setFormError("This assignment has already been submitted.");
            return;
        }

        submissionMutation.mutate({
            assignmentId: selectedAssignment._id,
            answer: answer.trim(),
            submissionUrl: submissionUrl.trim(),
        });
    };

    if (isPending) {
        return (
            <div className="flex min-h-64 items-center justify-center gap-3">
                <span className="loading loading-spinner loading-lg text-primary" />
                <span className="text-base-content/70">
                    Loading your assignments...
                </span>
            </div>
        );
    }

    if (isError) {
        return (
            <main className="mx-auto max-w-4xl p-6">
                <div role="alert" className="alert alert-error">
                    <div>
                        <h2 className="font-bold">
                            Could not load assignments
                        </h2>
                        <p className="text-sm">
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Please try again."}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => refetch()}
                    >
                        Try again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-base-200/50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-semibold text-primary">
                            STUDENT PORTAL
                        </p>
                        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                            My Assignments
                        </h1>
                        <p className="mt-2 text-sm text-base-content/70">
                            View your tasks, track deadlines, and submit
                            your work.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-outline btn-primary"
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        {isFetching ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : (
                            "Refresh"
                        )}
                    </button>
                </div>

                {/* Summary */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <SummaryCard title="Total" value={summary.total} />
                    <SummaryCard
                        title="Pending"
                        value={summary.pending}
                        color="text-info"
                    />
                    <SummaryCard
                        title="Overdue"
                        value={summary.overdue}
                        color="text-error"
                    />
                    <SummaryCard
                        title="Submitted"
                        value={summary.submitted}
                        color="text-warning"
                    />
                    <SummaryCard
                        title="Graded"
                        value={summary.graded}
                        color="text-success"
                    />
                </section>

                {/* Filters */}
                <section className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body gap-4 p-4 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <label className="form-control md:col-span-2">
                                <span className="label-text mb-2 font-medium">
                                    Search assignments
                                </span>
                                <input
                                    type="search"
                                    className="input input-bordered w-full"
                                    placeholder="Search by title, subject, teacher..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                />
                            </label>

                            <label className="form-control">
                                <span className="label-text mb-2 font-medium">
                                    Filter by status
                                </span>
                                <select
                                    className="select select-bordered w-full"
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(event.target.value)
                                    }
                                >
                                    <option value="all">All assignments</option>
                                    <option value="pending">Pending</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="submitted">Submitted</option>
                                    <option value="graded">Graded</option>
                                </select>
                            </label>
                        </div>

                        <p className="text-sm text-base-content/60">
                            Showing {filteredAssignments.length} of{" "}
                            {assignments.length} assignments
                        </p>
                    </div>
                </section>

                {/* Assignment cards */}
                {filteredAssignments.length === 0 ? (
                    <div className="card border border-base-300 bg-base-100">
                        <div className="card-body items-center py-14 text-center">
                            <span className="text-4xl">📚</span>
                            <h2 className="text-lg font-bold">
                                No assignments found
                            </h2>
                            <p className="max-w-md text-sm text-base-content/60">
                                {assignments.length === 0
                                    ? "You don't have any assignments yet."
                                    : "Try a different search term or status filter."}
                            </p>
                            {(search || statusFilter !== "all") && (
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm mt-2"
                                    onClick={() => {
                                        setSearch("");
                                        setStatusFilter("all");
                                    }}
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {filteredAssignments.map((assignment) => {
                            const status = getStatus(assignment);
                            const canSubmit =
                                status === "pending" || status === "overdue";

                            return (
                                <article
                                    key={assignment._id}
                                    className="card border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="card-body gap-4 p-5 sm:p-6">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                                    {assignment.subject_name ||
                                                        assignment.subject ||
                                                        "General"}
                                                </p>
                                                <h2 className="mt-1 break-words text-lg font-bold">
                                                    {assignment.title ||
                                                        "Untitled assignment"}
                                                </h2>
                                            </div>
                                            <StatusBadge status={status} />
                                        </div>

                                        <p className="line-clamp-3 text-sm leading-6 text-base-content/70">
                                            {assignment.description ||
                                                "No description provided."}
                                        </p>

                                        <div className="grid grid-cols-1 gap-3 rounded-lg bg-base-200/60 p-4 sm:grid-cols-2">
                                            <div>
                                                <p className="text-xs text-base-content/60">
                                                    Due date
                                                </p>
                                                <p className="mt-1 text-sm font-semibold">
                                                    {formatDate(
                                                        assignment.due_date
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-base-content/60">
                                                    Total marks
                                                </p>
                                                <p className="mt-1 text-sm font-semibold">
                                                    {assignment.total_marks ??
                                                        assignment.max_marks ??
                                                        "—"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-base-content/60">
                                                    Teacher
                                                </p>
                                                <p className="mt-1 text-sm font-semibold">
                                                    {assignment.teacher_name ||
                                                        "—"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-base-content/60">
                                                    Marks obtained
                                                </p>
                                                <p className="mt-1 text-sm font-semibold">
                                                    {assignment.submission.marks_obtained ??
                                                        "Not graded"}
                                                </p>
                                            </div>
                                        </div>

                                        {assignment.submission?.feedback && (
                                            <div className="rounded-lg border border-success/30 bg-success/5 p-4">
                                                <p className="text-sm font-semibold">
                                                    Teacher feedback
                                                </p>
                                                <p className="mt-1 whitespace-pre-wrap text-sm text-base-content/80">
                                                    {assignment.submission.feedback}
                                                </p>
                                            </div>
                                        )}

                                        <div className="card-actions justify-end">
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-primary"
                                                onClick={() =>
                                                    openSubmission(assignment)
                                                }
                                            >
                                                View details
                                            </button>

                                            {canSubmit && (
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        openSubmission(assignment)
                                                    }
                                                >
                                                    Submit assignment
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}
            </div>

            {/* Assignment detail / submission modal */}
            {selectedAssignment && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-h-[90vh] max-w-2xl overflow-y-auto">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-primary">
                                    {selectedAssignment.subject_name ||
                                        selectedAssignment.subject ||
                                        "Assignment"}
                                </p>
                                <h3 className="mt-1 text-xl font-bold">
                                    {selectedAssignment.title ||
                                        "Assignment details"}
                                </h3>
                            </div>

                            <button
                                type="button"
                                className="btn btn-circle btn-ghost btn-sm"
                                aria-label="Close assignment details"
                                onClick={() => {
                                    setSelectedAssignment(null);
                                    setFormError("");
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-4 space-y-4">
                            <div>
                                <p className="text-sm font-semibold">
                                    Instructions
                                </p>
                                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-base-content/70">
                                    {selectedAssignment.description ||
                                        "No instructions provided."}
                                </p>
                            </div>

                            <div className="rounded-lg bg-base-200 p-4">
                                <p className="text-sm">
                                    <strong>Deadline:</strong>{" "}
                                    {formatDate(selectedAssignment.due_date)}
                                </p>
                                <p className="mt-1 text-sm">
                                    <strong>Total marks:</strong>{" "}
                                    {selectedAssignment.total_marks ??
                                        selectedAssignment.max_marks ??
                                        "—"}
                                </p>
                            </div>

                            {selectedAssignment.attachment_url && (
                                <a
                                    href={selectedAssignment.attachment_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="link link-primary break-all text-sm"
                                >
                                    View assignment attachment
                                </a>
                            )}

                            {selectedAssignment.submission && (
                                <div className="rounded-lg border border-base-300 p-4">
                                    <p className="font-semibold">
                                        Your submission
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm">
                                        {selectedAssignment.submission.answer ||
                                            "No written answer provided."}
                                    </p>

                                    {selectedAssignment.submission.submission_url && (
                                        <a
                                            href={
                                                selectedAssignment.submission
                                                    .submission_url
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="link link-primary mt-2 block break-all text-sm"
                                        >
                                            Open submitted link
                                        </a>
                                    )}
                                </div>
                            )}

                            {["pending", "overdue"].includes(
                                getStatus(selectedAssignment)
                            ) && (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <h4 className="font-bold">
                                        Submit your work
                                    </h4>

                                    <label className="form-control">
                                        <span className="label-text mb-2 font-medium">
                                            Written answer
                                        </span>
                                        <textarea
                                            className="textarea textarea-bordered min-h-32"
                                            placeholder="Write your answer here..."
                                            value={answer}
                                            onChange={(event) =>
                                                setAnswer(event.target.value)
                                            }
                                            maxLength={20000}
                                        />
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text mb-2 font-medium">
                                            Submission link (optional)
                                        </span>
                                        <input
                                            type="url"
                                            className="input input-bordered"
                                            placeholder="https://..."
                                            value={submissionUrl}
                                            onChange={(event) =>
                                                setSubmissionUrl(
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </label>

                                    <p className="text-xs text-base-content/60">
                                        For files, upload them using your
                                        configured storage service and paste
                                        the resulting link here.
                                    </p>

                                    {formError && (
                                        <div
                                            role="alert"
                                            className="alert alert-error text-sm"
                                        >
                                            {formError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full"
                                        disabled={
                                            submissionMutation.isPending
                                        }
                                    >
                                        {submissionMutation.isPending ? (
                                            <>
                                                <span className="loading loading-spinner loading-sm" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit assignment"
                                        )}
                                    </button>
                                </form>
                            )}

                            {["submitted", "graded"].includes(
                                getStatus(selectedAssignment)
                            ) && (
                                <div className="alert alert-info text-sm">
                                    This assignment has already been submitted.
                                    {getStatus(selectedAssignment) === "graded"
                                        ? " Your grade and feedback are shown on the assignment card."
                                        : " Await your teacher's review."}
                                </div>
                            )}
                        </div>

                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                    setSelectedAssignment(null);
                                    setFormError("");
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="modal-backdrop"
                        aria-label="Close modal"
                        onClick={() => {
                            setSelectedAssignment(null);
                            setFormError("");
                        }}
                    >
                        Close
                    </button>
                </dialog>
            )}
        </main>
    );
}
