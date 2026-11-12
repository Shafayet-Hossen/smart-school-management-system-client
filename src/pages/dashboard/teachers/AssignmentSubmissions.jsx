
import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  FileText,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  ExternalLink,
  Save,
  GraduationCap,
  CalendarDays,
} from "lucide-react";

import {
  getAssignmentSubmissions,
  gradeAssignmentSubmission,
} from "../../../services/teacherAssignmentSubmissionService.js";

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
};

const getStudentName = (submission) => {
  if (submission.student_name) return submission.student_name;

  const first = submission.first_name ?? "";
  const last = submission.last_name ?? "";
  const name = `${first} ${last}`.trim();

  return name || "Unknown student";
};

const getStatus = (submission) => {
  if (
    submission.status === "graded" ||
    submission.graded === true ||
    submission.marks_obtained != null
  ) {
    return "graded";
  }

  if (
    submission.status === "late" ||
    submission.is_late === true
  ) {
    return "late";
  }

  return "submitted";
};

const statusClass = {
  submitted: "badge-info",
  graded: "badge-success",
  late: "badge-warning",
};

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body flex-row items-center justify-between p-5">
        <div>
          <p className="text-sm text-base-content/60">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>

        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}

export default function AssignmentSubmissions() {
  const { id: assignmentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [formError, setFormError] = useState("");

  const {
    data: submissions = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["teacher-assignment-submissions", assignmentId],
    queryFn: () => getAssignmentSubmissions(assignmentId),
    enabled: Boolean(assignmentId),
  });

  // The API should return the assignment details with its submissions.
  const assignment =
    submissions[0]?.assignment ?? null;

  const maxMarks = Number(
    assignment?.max_marks ??
      submissions[0]?.max_marks ??
      100
  );

  const gradeMutation = useMutation({
    mutationFn: gradeAssignmentSubmission,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "teacher-assignment-submissions",
          assignmentId,
        ],
      });

      setSelectedSubmission(null);
      setMarks("");
      setFeedback("");
      setFormError("");
    },

    onError: (err) => {
      setFormError(
        err?.response?.data?.message ??
          err?.message ??
          "Could not save the grade."
      );
    },
  });

  const stats = useMemo(() => {
    const graded = submissions.filter(
      (item) => getStatus(item) === "graded"
    ).length;

    const late = submissions.filter(
      (item) => getStatus(item) === "late"
    ).length;

    return {
      total: submissions.length,
      graded,
      pending: submissions.length - graded,
      late,
    };
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return submissions.filter((item) => {
      const name = getStudentName(item).toLowerCase();
      const roll = String(
        item.roll_number ?? item.student_id ?? ""
      ).toLowerCase();
      const email = String(item.email ?? "").toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        roll.includes(query) ||
        email.includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        getStatus(item) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, search, statusFilter]);

  const openReview = (submission) => {
    setSelectedSubmission(submission);

    const existingMarks =
      submission.marks_obtained ?? submission.marks;

    setMarks(
      existingMarks == null ? "" : String(existingMarks)
    );

    setFeedback(submission.feedback ?? "");
    setFormError("");
  };

  const saveGrade = (event) => {
    event.preventDefault();
    setFormError("");

    if (!selectedSubmission?._id) {
      setFormError("Submission ID is missing.");
      return;
    }

    if (marks === "" || !Number.isFinite(Number(marks))) {
      setFormError("Please enter valid marks.");
      return;
    }

    if (Number(marks) < 0 || Number(marks) > maxMarks) {
      setFormError(
        `Marks must be between 0 and ${maxMarks}.`
      );
      return;
    }

    gradeMutation.mutate({
      assignmentId,
      submissionId: selectedSubmission._id,
      marks,
      feedback,
    });
  };

  if (!assignmentId) {
    return (
      <div className="alert alert-error m-6">
        Assignment ID is missing from the URL.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200/50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              className="btn btn-ghost btn-sm mb-3 gap-2"
              onClick={() => navigate("/assignments")}
            >
              <ArrowLeft size={16} />
              Back to Assignments
            </button>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Assignment Submissions
            </h1>

            <p className="mt-2 text-sm text-base-content/60">
              Review students' work, award marks, and provide feedback.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline gap-2"
            disabled={isFetching}
            onClick={() => refetch()}
          >
            <RefreshCw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-60 items-center justify-center">
            <span className="loading loading-spinner loading-lg" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <div className="flex-1">
              <p className="font-semibold">
                Failed to load submissions
              </p>
              <p className="text-sm">
                {error?.response?.data?.message ??
                  error?.message ??
                  "Please try again."}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Main content */}
        {!isLoading && !isError && (
          <>
            {/* Assignment information */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <FileText size={28} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold">
                      {assignment?.title ??
                        submissions[0]?.assignment_title ??
                        "Assignment"}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-base-content/70">
                      <span className="flex items-center gap-2">
                        <GraduationCap size={16} />
                        {assignment?.class_name ??
                          submissions[0]?.class_name ??
                          "Class not provided"}
                      </span>

                      <span className="flex items-center gap-2">
                        <Users size={16} />
                        {assignment?.section_name ??
                          submissions[0]?.section_name ??
                          "Section not provided"}
                      </span>

                      <span className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        Due:{" "}
                        {formatDate(
                          assignment?.due_date ??
                            submissions[0]?.due_date
                        )}
                      </span>

                      <span>Maximum marks: {maxMarks}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Submissions"
                value={stats.total}
                icon={Users}
              />

              <StatCard
                title="Graded"
                value={stats.graded}
                icon={CheckCircle2}
              />

              <StatCard
                title="Awaiting Review"
                value={stats.pending}
                icon={Clock}
              />

              <StatCard
                title="Late Submissions"
                value={stats.late}
                icon={AlertCircle}
              />
            </div>

            {/* Search and filter */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body gap-4 p-4 sm:p-5">
                <div className="flex flex-col gap-3 md:flex-row">
                  <label className="input input-bordered flex flex-1 items-center gap-2">
                    <Search size={18} className="opacity-50" />
                    <input
                      type="search"
                      className="grow"
                      placeholder="Search student name, ID, or email..."
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                    />
                  </label>

                  <select
                    className="select select-bordered w-full md:w-56"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                  >
                    <option value="all">All Submissions</option>
                    <option value="submitted">Awaiting Review</option>
                    <option value="graded">Graded</option>
                    <option value="late">Late</option>
                  </select>
                </div>

                <p className="text-sm text-base-content/60">
                  Showing {filteredSubmissions.length} of{" "}
                  {submissions.length} submissions
                </p>
              </div>
            </div>

            {/* Submissions table */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body p-0">
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Submitted At</th>
                        <th>Status</th>
                        <th>Marks</th>
                        <th>Submission</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredSubmissions.map((item) => {
                        const status = getStatus(item);

                        const fileUrl =
                          item.file_url ??
                          item.attachment_url ??
                          item.submission_url;

                        const answer =
                          item.answer_text ?? item.content ?? "";

                        return (
                          <tr key={item._id}>
                            <td>
                              <div>
                                <p className="font-semibold">
                                  {getStudentName(item.student)}
                                </p>
                                <p className="text-xs text-base-content/60">{'Roll: '}
                                  {item.student.roll_number ??
                                    item.student_id ??
                                    item.email ??
                                    "Student"}
                                </p>
                              </div>
                            </td>

                            <td className="whitespace-nowrap">
                              {formatDate(
                                item.submitted_at ?? item.created_at
                              )}
                            </td>

                            <td>
                              <span
                                className={`badge ${
                                  statusClass[status] ?? "badge-ghost"
                                }`}
                              >
                                {status === "graded"
                                  ? "Graded"
                                  : status === "late"
                                    ? "Late"
                                    : "Submitted"}
                              </span>
                            </td>

                            <td className="font-semibold">
                              {item.marks_obtained ??
                                item.marks ??
                                "—"}
                              <span className="font-normal text-base-content/50">
                                {" "}/ {maxMarks}
                              </span>
                            </td>

                            <td>
                              {fileUrl ? (
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-ghost btn-sm gap-2"
                                >
                                  <ExternalLink size={15} />
                                  Open file
                                </a>
                              ) : answer ? (
                                <span className="badge badge-outline">
                                  Text answer
                                </span>
                              ) : (
                                <span className="text-sm text-base-content/50">
                                  No attachment
                                </span>
                              )}
                            </td>

                            <td>
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm gap-2"
                                  onClick={() => openReview(item)}
                                >
                                  <Eye size={15} />
                                  Review
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredSubmissions.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-14 text-center"
                          >
                            <FileText
                              size={36}
                              className="mx-auto mb-3 opacity-30"
                            />
                            <p className="font-semibold">
                              No submissions found
                            </p>
                            <p className="mt-1 text-sm text-base-content/60">
                              Try changing your search or filter.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Review and grading modal */}
      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">
                  Review Submission
                </h3>
                <p className="mt-1 text-sm text-base-content/60">
                  {getStudentName(selectedSubmission.student)}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-circle btn-ghost btn-sm"
                aria-label="Close review"
                onClick={() => setSelectedSubmission(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="divider" />

            <div className="space-y-4">
              <div className="rounded-lg bg-base-200 p-4">
                <p className="mb-2 text-sm font-semibold">
                  Student Answer
                </p>

                <p className="whitespace-pre-wrap break-words text-sm">
                  {selectedSubmission.answer ??
                    selectedSubmission.content ??
                    "No text answer was provided."}
                </p>
              </div>

              {(selectedSubmission.file_url ??
                selectedSubmission.attachment_url ??
                selectedSubmission.submission_url) && (
                <a
                  href={
                    selectedSubmission.file_url ??
                    selectedSubmission.attachment_url ??
                    selectedSubmission.submission_url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm gap-2"
                >
                  <ExternalLink size={16} />
                  Open attachment
                </a>
              )}

              <p className="text-sm text-base-content/60">
                Submitted:{" "}
                {formatDate(
                  selectedSubmission.submitted_at ??
                    selectedSubmission.created_at
                )}
              </p>

              <form onSubmit={saveGrade} className="space-y-4">
                <div>
                  <label
                    htmlFor="submission-marks"
                    className="label"
                  >
                    <span className="label-text font-semibold">
                      Marks obtained (out of {maxMarks})
                    </span>
                  </label>

                  <input
                    id="submission-marks"
                    type="number"
                    min="0"
                    max={maxMarks}
                    step="any"
                    required
                    className="input input-bordered w-full"
                    placeholder="Enter marks"
                    value={marks}
                    onChange={(event) =>
                      setMarks(event.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="submission-feedback"
                    className="label"
                  >
                    <span className="label-text font-semibold">
                      Feedback
                    </span>
                  </label>

                  <textarea
                    id="submission-feedback"
                    rows={4}
                    className="textarea textarea-bordered w-full"
                    placeholder="Write feedback for the student..."
                    value={feedback}
                    onChange={(event) =>
                      setFeedback(event.target.value)
                    }
                  />
                </div>

                {formError && (
                  <div className="alert alert-error text-sm">
                    <AlertCircle size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    disabled={gradeMutation.isPending}
                    onClick={() => setSelectedSubmission(null)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary gap-2"
                    disabled={gradeMutation.isPending}
                  >
                    {gradeMutation.isPending ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <Save size={17} />
                    )}

                    {gradeMutation.isPending
                      ? "Saving..."
                      : "Save Grade"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <button
            type="button"
            className="modal-backdrop"
            aria-label="Close review modal"
            onClick={() => setSelectedSubmission(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
