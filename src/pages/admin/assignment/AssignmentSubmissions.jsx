
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  ClipboardList,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Eye,
  Filter,
  RefreshCw,
  X,
  CalendarDays,
  Award,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getSchoolAdminAssignmentSubmissions,
} from "../../../services/schoolAdminAssignmentService";

const PAGE_SIZE = 10;

const statusStyles = {
  submitted: "badge-info",
  late: "badge-warning",
  reviewed: "badge-success",
  pending: "badge-ghost",
  missing: "badge-error",
  returned: "badge-secondary",
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeStatus = (status) => {
  const value = String(status || "pending").toLowerCase();

  if (["submitted", "late", "reviewed", "pending", "missing", "returned"].includes(value)) {
    return value;
  }

  return "pending";
};

const getStudentName = (submission) =>
  submission.student?.full_name ||
  submission.student?.name ||
  [
    submission.student?.first_name,
    submission.student?.last_name,
  ].filter(Boolean).join(" ") ||
  submission.student_name ||
  "Unknown Student";

const getStudentId = (submission) =>
  submission.student?.student_id ||
  submission.student?.student_code ||
  submission.student_id ||
  "—";

const getSubmissionStatus = (submission) => {
  if (submission.status) {
    return normalizeStatus(submission.status);
  }

  if (submission.reviewed_at || submission.marks_obtained != null) {
    return "reviewed";
  }

  return "pending";
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="card bg-base-100 border border-base-300 shadow-sm">
    <div className="card-body p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-base-content/60">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value ?? 0}</h3>
        </div>

        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  </div>
);

const AssignmentSubmissions = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const fetchSubmissions = async (isRefresh = false) => {
    if (!assignmentId) {
      setError("Assignment ID is missing.");
      setLoading(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await getSchoolAdminAssignmentSubmissions(assignmentId);

      setData(response || null);
    } catch (err) {
      console.error("Assignment Submissions Error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load assignment submissions."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const assignment = data?.assignment || {};
  const summary = data?.summary || {};

  const submissions = Array.isArray(data?.submissions)
    ? data.submissions
    : [];

  const filteredSubmissions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return submissions.filter((submission) => {
      const studentName = getStudentName(submission).toLowerCase();
      const studentId = String(getStudentId(submission)).toLowerCase();

      const matchesSearch =
        !keyword ||
        studentName.includes(keyword) ||
        studentId.includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        getSubmissionStatus(submission) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubmissions.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const handleDownload = (submission) => {
    const attachment =
      submission.attachment ||
      submission.file ||
      submission.file_url;

    const url =
      typeof attachment === "string"
        ? attachment
        : attachment?.url;

    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>

        <button
          onClick={() => fetchSubmissions()}
          className="btn btn-primary btn-sm"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-circle btn-ghost btn-sm mt-1"
            title="Go back"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">
                Assignment Submissions
              </h1>

              <span className="badge badge-primary badge-outline">
                {assignment.assignment_id || "Assignment"}
              </span>
            </div>

            <p className="text-sm text-base-content/60 mt-1">
              Review student submissions and monitor assignment progress.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchSubmissions(true)}
          disabled={refreshing}
          className="btn btn-outline btn-sm"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Assignment Information */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                {assignment.title || "Assignment"}
              </h2>

              <p className="text-sm text-base-content/60 mt-2">
                {assignment.description || "No description available."}
              </p>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm">
                <span>
                  <strong>Class:</strong>{" "}
                  {assignment.class_name || "—"}
                </span>

                <span>
                  <strong>Section:</strong>{" "}
                  {assignment.section_name || "—"}
                </span>

                <span>
                  <strong>Subject:</strong>{" "}
                  {assignment.subject_name || "—"}
                </span>

                <span>
                  <strong>Teacher:</strong>{" "}
                  {assignment.teacher_name || "—"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="bg-base-200 rounded-xl p-3 min-w-[120px]">
                <p className="text-xs text-base-content/60">
                  Issue Date
                </p>
                <p className="font-semibold mt-1">
                  {formatDate(assignment.issue_date)}
                </p>
              </div>

              <div className="bg-base-200 rounded-xl p-3 min-w-[120px]">
                <p className="text-xs text-base-content/60">
                  Due Date
                </p>
                <p className="font-semibold mt-1">
                  {formatDate(assignment.due_date)}
                </p>
              </div>

              <div className="bg-base-200 rounded-xl p-3 min-w-[100px]">
                <p className="text-xs text-base-content/60">
                  Total Marks
                </p>
                <p className="font-semibold mt-1">
                  {assignment.total_marks ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={summary.total_students}
          icon={Users}
          color="bg-primary/10 text-primary"
        />

        <StatCard
          title="Submitted"
          value={summary.submitted}
          icon={ClipboardList}
          color="bg-info/10 text-info"
        />

        <StatCard
          title="Pending"
          value={summary.pending}
          icon={Clock}
          color="bg-warning/10 text-warning"
        />

        <StatCard
          title="Late Submissions"
          value={summary.late}
          icon={AlertCircle}
          color="bg-error/10 text-error"
        />

        <StatCard
          title="Reviewed"
          value={summary.reviewed}
          icon={CheckCircle2}
          color="bg-success/10 text-success"
        />
      </div>

      {/* Submission Progress */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-5">
          <div className="flex justify-between items-center gap-3">
            <div>
              <h3 className="font-semibold">
                Submission Progress
              </h3>
              <p className="text-sm text-base-content/60 mt-1">
                Students who have submitted this assignment
              </p>
            </div>

            <span className="text-xl font-bold text-primary">
              {summary.submission_percentage ?? 0}%
            </span>
          </div>

          <progress
            className="progress progress-primary w-full mt-3"
            value={summary.submission_percentage || 0}
            max="100"
          />

          <div className="flex justify-between text-xs text-base-content/60 mt-1">
            <span>
              {summary.submitted || 0} submitted
            </span>
            <span>
              {summary.total_students || 0} total students
            </span>
          </div>
        </div>
      </div>

      {/* Submission Table */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-0">

          <div className="p-5 border-b border-base-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Student Submissions
                </h3>

                <p className="text-sm text-base-content/60 mt-1">
                  {filteredSubmissions.length} student records found
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <label className="input input-bordered input-sm flex items-center gap-2">
                  <Search size={16} className="text-base-content/50" />

                  <input
                    type="text"
                    className="grow"
                    placeholder="Search student..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="btn btn-ghost btn-xs btn-circle"
                    >
                      <X size={14} />
                    </button>
                  )}
                </label>

                <label className="select select-bordered select-sm">
                  <Filter size={15} />
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                  >
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="pending">Pending</option>
                    <option value="late">Late</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="returned">Returned</option>
                    <option value="missing">Missing</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th>Marks</th>
                  <th>Attachment</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedSubmissions.length > 0 ? (
                  paginatedSubmissions.map((submission) => {
                    const status = getSubmissionStatus(submission);

                    const attachment =
                      submission.attachment ||
                      submission.file ||
                      submission.file_url;

                    const hasAttachment =
                      typeof attachment === "string"
                        ? Boolean(attachment)
                        : Boolean(attachment?.url);

                    return (
                      <tr key={submission._id || submission.submission_id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="bg-primary/10 text-primary rounded-full w-10">
                                <span className="font-semibold">
                                  {getStudentName(submission)
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                            </div>

                            <div>
                              <p className="font-semibold">
                                {getStudentName(submission)}
                              </p>

                              <p className="text-xs text-base-content/60">
                                {getStudentId(submission)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td>
                          {submission.student?.roll_number ||
                            submission.roll_number ||
                            "—"}
                        </td>

                        <td>
                          {formatDateTime(
                            submission.submitted_at
                          )}
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              statusStyles[status] || "badge-ghost"
                            }`}
                          >
                            {status.charAt(0).toUpperCase() +
                              status.slice(1)}
                          </span>
                        </td>

                        <td>
                          {submission.marks_obtained != null ? (
                            <span className="font-semibold">
                              {submission.marks_obtained}
                              {" / "}
                              {assignment.total_marks ?? "—"}
                            </span>
                          ) : (
                            <span className="text-base-content/50">
                              Not graded
                            </span>
                          )}
                        </td>

                        <td>
                          {hasAttachment ? (
                            <button
                              onClick={() =>
                                handleDownload(submission)
                              }
                              className="btn btn-ghost btn-xs"
                              title="Open attachment"
                            >
                              <Download size={15} />
                              View File
                            </button>
                          ) : (
                            <span className="text-xs text-base-content/50">
                              No file
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="flex justify-end">
                            <button
                              onClick={() =>
                                handleViewSubmission(submission)
                              }
                              className="btn btn-primary btn-xs"
                            >
                              <Eye size={14} />
                              Review
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7">
                      <div className="text-center py-12">
                        <ClipboardList
                          size={40}
                          className="mx-auto text-base-content/30"
                        />

                        <h3 className="font-semibold mt-3">
                          No submissions found
                        </h3>

                        <p className="text-sm text-base-content/60 mt-1">
                          No student records match your search or filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-base-300 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-sm text-base-content/60">
              Showing{" "}
              {filteredSubmissions.length === 0
                ? 0
                : (currentPage - 1) * PAGE_SIZE + 1}
              {" – "}
              {Math.min(
                currentPage * PAGE_SIZE,
                filteredSubmissions.length
              )}
              {" of "}
              {filteredSubmissions.length}
            </p>

            <div className="join">
              <button
                className="btn btn-sm join-item"
                disabled={currentPage <= 1}
                onClick={() =>
                  setPage((previous) => Math.max(1, previous - 1))
                }
              >
                <ChevronLeft size={16} />
              </button>

              <button className="btn btn-sm join-item no-animation">
                {currentPage} / {totalPages}
              </button>

              <button
                className="btn btn-sm join-item"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setPage((previous) =>
                    Math.min(totalPages, previous + 1)
                  )
                }
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Review Modal */}
      {selectedSubmission && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">
                  Submission Details
                </h3>

                <p className="text-sm text-base-content/60 mt-1">
                  Review the student's submitted assignment.
                </p>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X size={18} />
              </button>
            </div>

            <div className="divider" />

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-base-content/60">
                  Student Name
                </p>
                <p className="font-semibold mt-1">
                  {getStudentName(selectedSubmission)}
                </p>
              </div>

              <div>
                <p className="text-xs text-base-content/60">
                  Student ID
                </p>
                <p className="font-semibold mt-1">
                  {getStudentId(selectedSubmission)}
                </p>
              </div>

              <div>
                <p className="text-xs text-base-content/60">
                  Submission Date
                </p>
                <p className="font-semibold mt-1">
                  {formatDateTime(selectedSubmission.submitted_at)}
                </p>
              </div>

              <div>
                <p className="text-xs text-base-content/60">
                  Status
                </p>
                <span className={`badge mt-1 ${
                  statusStyles[getSubmissionStatus(selectedSubmission)] ||
                  "badge-ghost"
                }`}>
                  {getSubmissionStatus(selectedSubmission)}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText size={17} />
                Student Answer
              </h4>

              <div className="bg-base-200 rounded-xl p-4 mt-2 whitespace-pre-wrap text-sm min-h-20">
                {selectedSubmission.answer ||
                  selectedSubmission.content ||
                  selectedSubmission.text_answer ||
                  "No written answer provided."}
              </div>
            </div>

            <div className="mt-5">
              <h4 className="font-semibold flex items-center gap-2">
                <MessageSquare size={17} />
                Teacher Feedback
              </h4>

              <div className="bg-base-200 rounded-xl p-4 mt-2 whitespace-pre-wrap text-sm">
                {selectedSubmission.feedback ||
                  "No feedback available yet."}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-base-content/60">
                  Marks Obtained
                </p>
                <p className="text-xl font-bold mt-1">
                  {selectedSubmission.marks_obtained ?? "Not graded"}
                  {selectedSubmission.marks_obtained != null &&
                    ` / ${assignment.total_marks ?? "—"}`}
                </p>
              </div>

              {(selectedSubmission.attachment ||
                selectedSubmission.file ||
                selectedSubmission.file_url) && (
                <button
                  onClick={() => handleDownload(selectedSubmission)}
                  className="btn btn-outline btn-sm"
                >
                  <Download size={16} />
                  Open Attachment
                </button>
              )}
            </div>

            <div className="modal-action">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>

          <form
            method="dialog"
            className="modal-backdrop"
            onSubmit={(event) => {
              event.preventDefault();
              setSelectedSubmission(null);
            }}
          >
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default AssignmentSubmissions;
