
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Plus,
  Search,
  CalendarDays,
  Clock,
  BookOpen,
  Pencil,
  Trash2,
  Eye,
  X,
  RotateCcw,
  FileText,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import { getTeacherClasses } from "../../../services/teacherClassService.js";

import {
  getTeacherAssignments,
  createTeacherAssignment,
  updateTeacherAssignment,
  deleteTeacherAssignment,
} from "../../../services/teacherAssignmentService.js";

const EMPTY_FORM = {
  title: "",
  description: "",
  class_id: "",
  section_id: "",
  subject: "",
  due_date: "",
  max_marks: "100",
  status: "published",
};

const getId = (value) =>
  value?._id?.toString?.() ??
  value?.id?.toString?.() ??
  value?.toString?.() ??
  "";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isOverdue = (assignment) => {
  if (!assignment.due_date) return false;

  const dueDate = new Date(`${assignment.due_date}T23:59:59`);
  return (
    dueDate.getTime() < Date.now() &&
    assignment.status === "published"
  );
};

const getAssignmentStatus = (assignment) => {
  if (isOverdue(assignment)) return "overdue";

  return String(assignment.status || "published").toLowerCase();
};

const StatusBadge = ({ status }) => {
  const styles = {
    published: "badge-success",
    draft: "badge-ghost",
    overdue: "badge-error",
    archived: "badge-neutral",
  };

  return (
    <span
      className={`badge ${styles[status] || "badge-outline"
        } capitalize`}
    >
      {status}
    </span>
  );
};

const SummaryCard = ({ title, value, icon: Icon, color }) => (
  <div className="card border border-base-300 bg-base-100 shadow-sm">
    <div className="card-body p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-base-content/70">{title}</p>
          <h2 className="mt-2 text-3xl font-bold">
            {value.toLocaleString()}
          </h2>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  </div>
);

const AssignmentFormModal = ({
  isOpen,
  onClose,
  initialData,
  classes,
  onSubmit,
  isSaving,
  error,
}) => {
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    ...(initialData || {}),
    max_marks: String(initialData?.max_marks ?? 100),
    due_date: initialData?.due_date
      ? String(initialData.due_date).slice(0, 10)
      : "",
  }));

  const [validationError, setValidationError] = useState("");

  // Class and section structures can vary by implementation.
  const availableSections = useMemo(() => {
    const selectedClass = classes.find(
      (item) => getId(item) === form.class_id
    );

    if (!selectedClass) return [];

    const sections =
      selectedClass.sections ??
      selectedClass.assigned_sections ??
      [];

    return sections.filter((section) => {
      if (section.status) return section.status === "active";
      return true;
    });
  }, [classes, form.class_id]);

  // Conditional return comes after all Hooks.
  if (!isOpen) return null;


  const updateField = (field, value) => {
    setForm((previous) => {
      const next = { ...previous, [field]: value };

      if (field === "class_id") {
        next.section_id = "";
      }

      return next;
    });

    setValidationError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.class_id ||
      !form.section_id ||
      !form.subject.trim() ||
      !form.due_date
    ) {
      setValidationError("Please complete all required fields.");
      return;
    }

    const marks = Number(form.max_marks);

    if (!Number.isFinite(marks) || marks <= 0) {
      setValidationError("Maximum marks must be greater than zero.");
      return;
    }

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      class_id: form.class_id,
      section_id: form.section_id,
      subject: form.subject.trim(),
      due_date: form.due_date,
      max_marks: marks,
      status: form.status,
    });
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-h-[90vh] max-w-2xl overflow-y-auto">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold">
              {initialData ? "Edit Assignment" : "Create Assignment"}
            </h3>
            <p className="mt-1 text-sm text-base-content/60">
              Provide the assignment details for your students.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-circle btn-ghost btn-sm"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="form-control">
            <span className="label-text mb-2 font-medium">
              Assignment title *
            </span>
            <input
              className="input input-bordered w-full"
              value={form.title}
              onChange={(event) =>
                updateField("title", event.target.value)
              }
              placeholder="e.g. Chapter 3 Homework"
              maxLength={150}
              required
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-2 font-medium">
              Instructions *
            </span>
            <textarea
              className="textarea textarea-bordered min-h-28 w-full"
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Describe the assignment and what students need to submit."
              maxLength={10000}
              required
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="form-control">
              <span className="label-text mb-2 font-medium">
                Class *
              </span>
              <select
                className="select select-bordered w-full"
                value={form.class_id}
                onChange={(event) =>
                  updateField("class_id", event.target.value)
                }
                required
              >
                <option value="">Select class</option>

                {classes.map((item) => (
                  <option key={getId(item)} value={getId(item)}>
                    {item.class_name || item.name || item.label || "Class"}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-medium">
                Section *
              </span>
              <select
                className="select select-bordered w-full"
                value={form.section_id}
                onChange={(event) =>
                  updateField("section_id", event.target.value)
                }
                disabled={!form.class_id}
                required
              >
                <option value="">Select section</option>

                {availableSections.map((section) => (
                  <option key={getId(section)} value={getId(section)}>
                    {section.section_name ||
                      section.name ||
                      section.label ||
                      "Section"}
                  </option>
                ))}
              </select>

              {form.class_id && availableSections.length === 0 && (
                <span className="mt-1 text-xs text-warning">
                  No sections were returned for this class. Check the
                  teacher classes API response structure.
                </span>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="form-control">
              <span className="label-text mb-2 font-medium">
                Subject *
              </span>
              <input
                className="input input-bordered w-full"
                value={form.subject}
                onChange={(event) =>
                  updateField("subject", event.target.value)
                }
                placeholder="e.g. Mathematics"
                maxLength={100}
                required
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-medium">
                Maximum marks *
              </span>
              <input
                className="input input-bordered w-full"
                type="number"
                min="1"
                max="100000"
                step="1"
                value={form.max_marks}
                onChange={(event) =>
                  updateField("max_marks", event.target.value)
                }
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="form-control">
              <span className="label-text mb-2 font-medium">
                Due date *
              </span>
              <input
                className="input input-bordered w-full"
                type="date"
                value={form.due_date}
                onChange={(event) =>
                  updateField("due_date", event.target.value)
                }
                required
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-medium">
                Assignment status
              </span>
              <select
                className="select select-bordered w-full"
                value={form.status}
                onChange={(event) =>
                  updateField("status", event.target.value)
                }
              >
                <option value="published">Published</option>
                <option value="draft">Save as draft</option>
              </select>
            </label>
          </div>

          {(validationError || error) && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{validationError || error}</span>
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <Plus size={17} />
              )}
              {initialData ? "Save Changes" : "Create Assignment"}
            </button>
          </div>
        </form>
      </div>

      <button
        type="button"
        className="modal-backdrop"
        aria-label="Close modal"
        onClick={onClose}
        disabled={isSaving}
      >
        Close
      </button>
    </div>
  );
};

export default function Assignments() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const PAGE_SIZE = 10;

  const classesQuery = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: getTeacherClasses,
  });

  const assignmentsQuery = useQuery({
    queryKey: ["teacher-assignments"],
    queryFn: () => getTeacherAssignments(),
  });

  const rawClasses = classesQuery.data;
  const classes = Array.isArray(rawClasses)
    ? rawClasses
    : rawClasses?.classes ?? rawClasses?.data ?? [];

  const assignments = assignmentsQuery.data ?? [];

  // Support both a flat class list and a class list containing sections.
  const allSections = useMemo(() => {
    const result = [];

    classes.forEach((item) => {
      const classId = getId(item);
      const className = item.class_name || item.name || "";

      const sections =
        item.sections ??
        item.assigned_sections ??
        [];

      sections.forEach((section) => {
        result.push({
          ...section,
          _id: getId(section),
          class_id: getId(section.class_id) || classId,
          class_name:
            section.class_name || className,
          section_name:
            section.section_name || section.name || "",
        });
      });

      // Some teacher-class APIs return one class/section per row.
      if (item.section_id) {
        result.push({
          _id: getId(item.section_id),
          class_id: classId || getId(item.class_id),
          class_name: className,
          section_name:
            item.section_name || item.section?.name || "",
        });
      }
    });

    const unique = new Map();

    result.forEach((section) => {
      if (section._id) unique.set(section._id, section);
    });

    return [...unique.values()];
  }, [classes]);

  const filteredSections = useMemo(
    () =>
      allSections.filter(
        (section) =>
          !classFilter || section.class_id === classFilter
      ),
    [allSections, classFilter]
  );

  const createMutation = useMutation({
    mutationFn: createTeacherAssignment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["teacher-assignments"],
      });
      setModalOpen(false);
      setEditingAssignment(null);
      setFormError("");
    },
    onError: (error) => setFormError(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: updateTeacherAssignment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["teacher-assignments"],
      });
      setModalOpen(false);
      setEditingAssignment(null);
      setFormError("");
    },
    onError: (error) => setFormError(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeacherAssignment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["teacher-assignments"],
      });
      setDeleteTarget(null);
    },
  });

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assignments.filter((assignment) => {
      const matchesSearch =
        !query ||
        [
          assignment.title,
          assignment.description,
          assignment.subject,
          assignment.class_name,
          assignment.section_name,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesClass =
        !classFilter ||
        getId(assignment.class_id) === classFilter;

      const matchesSection =
        !sectionFilter ||
        getId(assignment.section_id) === sectionFilter;

      const status = getAssignmentStatus(assignment);
      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter ||
        (statusFilter === "published" &&
          assignment.status === "published");

      return (
        matchesSearch &&
        matchesClass &&
        matchesSection &&
        matchesStatus
      );
    });
  }, [
    assignments,
    search,
    classFilter,
    sectionFilter,
    statusFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAssignments.length / PAGE_SIZE)
  );

  const visibleAssignments = filteredAssignments.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const publishedCount = assignments.filter(
    (item) => item.status === "published" && !isOverdue(item)
  ).length;

  const draftCount = assignments.filter(
    (item) => item.status === "draft"
  ).length;

  const overdueCount = assignments.filter(isOverdue).length;

  const openCreateModal = () => {
    setEditingAssignment(null);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (assignment) => {
    setEditingAssignment({
      ...assignment,
      class_id: getId(assignment.class_id),
      section_id: getId(assignment.section_id),
      status: assignment.status || "published",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = (assignmentData) => {
    setFormError("");

    if (editingAssignment) {
      updateMutation.mutate({
        assignmentId: getId(editingAssignment),
        assignmentData,
      });
    } else {
      createMutation.mutate(assignmentData);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setClassFilter("");
    setSectionFilter("");
    setStatusFilter("all");
    setPage(1);
  };

  const handleClassFilterChange = (value) => {
    setClassFilter(value);
    setSectionFilter("");
    setPage(1);
  };

  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  const pageError =
    assignmentsQuery.error || classesQuery.error;

  const handleBack = () => {

    navigate("/dashboard");

  };
  return (
    <div className="space-y-2 p-4 md:p-6">
      <div>
        <button
          onClick={handleBack}
          className="text-sm font-medium text-base-content/50 hover:text-primary hover:cursor-pointer"
        >
          ← Dashboard
        </button>

      </div>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="text-primary" size={28} />
            <h1 className="text-2xl font-bold md:text-3xl">
              Assignments
            </h1>
          </div>
          <p className="mt-2 text-sm text-base-content/70">
            Create assignments and manage your students&apos; work.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              assignmentsQuery.refetch();
              classesQuery.refetch();
            }}
            disabled={
              assignmentsQuery.isFetching ||
              classesQuery.isFetching
            }
          >
            <RotateCcw size={17} />
            Refresh
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Create Assignment
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Assignments"
          value={assignments.length}
          icon={ClipboardList}
          color="bg-primary/10 text-primary"
        />
        <SummaryCard
          title="Published"
          value={publishedCount}
          icon={CheckCircle2}
          color="bg-success/10 text-success"
        />
        <SummaryCard
          title="Drafts"
          value={draftCount}
          icon={FileText}
          color="bg-base-200 text-base-content"
        />
        <SummaryCard
          title="Overdue"
          value={overdueCount}
          icon={Clock}
          color="bg-error/10 text-error"
        />
      </div>

      {/* Filters */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-5">
          <h2 className="font-semibold">Search and Filter</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <label className="form-control">
              <span className="label-text mb-2 font-medium">
                Search
              </span>
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
                />
                <input
                  className="input input-bordered w-full pl-10"
                  value={search}
                  onChange={(event) =>
                    handleFilterChange(setSearch, event.target.value)
                  }
                  placeholder="Search assignments..."
                />
              </div>
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-medium">
                Class
              </span>
              <select
                className="select select-bordered w-full"
                value={classFilter}
                onChange={(event) =>
                  handleClassFilterChange(event.target.value)
                }
              >
                <option value="">All classes</option>
                {classes.map((item) => (
                  <option key={getId(item)} value={getId(item)}>
                    {item.class_name || item.name || "Class"}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-medium">
                Section
              </span>
              <select
                className="select select-bordered w-full"
                value={sectionFilter}
                onChange={(event) =>
                  handleFilterChange(
                    setSectionFilter,
                    event.target.value
                  )
                }
                disabled={!classFilter}
              >
                <option value="">All sections</option>
                {filteredSections.map((section) => (
                  <option key={section._id} value={section._id}>
                    {section.section_name || "Section"}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-medium">
                Status
              </span>
              <select
                className="select select-bordered w-full"
                value={statusFilter}
                onChange={(event) =>
                  handleFilterChange(
                    setStatusFilter,
                    event.target.value
                  )
                }
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="overdue">Overdue</option>
              </select>
            </label>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={resetFilters}
            >
              <RotateCcw size={15} />
              Reset filters
            </button>
          </div>
        </div>
      </div>

      {/* Errors */}
      {pageError && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{getErrorMessage(pageError)}</span>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              assignmentsQuery.refetch();
              classesQuery.refetch();
            }}
          >
            Retry
          </button>
        </div>
      )}

      {deleteMutation.error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{getErrorMessage(deleteMutation.error)}</span>
        </div>
      )}

      {/* Assignments table */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-base-300 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Assignment List
            </h2>
            <p className="text-sm text-base-content/60">
              {filteredAssignments.length} matching assignment(s)
            </p>
          </div>
        </div>

        {assignmentsQuery.isLoading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : !pageError && visibleAssignments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
            <ClipboardList
              size={44}
              className="text-base-content/30"
            />
            <h3 className="text-lg font-semibold">
              No assignments found
            </h3>
            <p className="max-w-md text-sm text-base-content/60">
              Create your first assignment or change your filters to
              see other assignments.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={openCreateModal}
            >
              <Plus size={16} />
              Create Assignment
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Class / Section</th>
                    <th>Subject</th>
                    <th>Due Date</th>
                    <th>Marks</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleAssignments.map((assignment) => {
                    const id = getId(assignment);
                    const status = getAssignmentStatus(assignment);

                    return (
                      <tr key={id}>
                        <td>
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                              <BookOpen size={19} />
                            </div>
                            <div className="min-w-40">
                              <p className="font-semibold">
                                {assignment.title}
                              </p>
                              <p className="mt-1 max-w-xs truncate text-xs text-base-content/60">
                                {assignment.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="font-medium">
                            {assignment.class_name ||
                              classes.find(
                                (item) =>
                                  getId(item) ===
                                  getId(assignment.class_id)
                              )?.class_name ||
                              classes.find(
                                (item) =>
                                  getId(item) ===
                                  getId(assignment.class_id)
                              )?.name ||
                              "—"}
                          </div>
                          <div className="text-xs text-base-content/60">
                            {assignment.section_name ||
                              allSections.find(
                                (section) =>
                                  section._id ===
                                  getId(assignment.section_id)
                              )?.section_name ||
                              "—"}
                          </div>
                        </td>

                        <td>{assignment.subject || "—"}</td>

                        <td>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <CalendarDays
                              size={15}
                              className="text-base-content/50"
                            />
                            {formatDate(assignment.due_date)}
                          </div>
                        </td>

                        <td>{assignment.max_marks ?? "—"}</td>

                        <td>
                          <StatusBadge status={status} />
                        </td>

                        <td>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              className="btn btn-square btn-ghost btn-sm"
                              title="Review submissions"
                              aria-label="Review submissions"
                              onClick={() =>
                                navigate(
                                  `/assignments/${encodeURIComponent(id)}/submissions`
                                )
                              }
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              type="button"
                              className="btn btn-square btn-ghost btn-sm"
                              title="Edit assignment"
                              aria-label="Edit assignment"
                              onClick={() =>
                                openEditModal(assignment)
                              }
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              className="btn btn-square btn-ghost btn-sm text-error"
                              title="Delete assignment"
                              aria-label="Delete assignment"
                              onClick={() =>
                                setDeleteTarget(assignment)
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-base-300 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-base-content/70">
                Showing{" "}
                {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(
                  page * PAGE_SIZE,
                  filteredAssignments.length
                )}{" "}
                of {filteredAssignments.length}
              </p>

              <div className="join">
                <button
                  type="button"
                  className="btn btn-sm join-item"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-sm join-item no-animation"
                  disabled
                >
                  {page} / {totalPages}
                </button>
                <button
                  type="button"
                  className="btn btn-sm join-item"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((current) =>
                      Math.min(totalPages, current + 1)
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create / edit modal */}
      <AssignmentFormModal
        key={
          editingAssignment
            ? `edit-${getId(editingAssignment)}`
            : "create-assignment"
        }
        isOpen={modalOpen}
        onClose={() => {
          if (isSaving) return;
          setModalOpen(false);
          setEditingAssignment(null);
          setFormError("");
        }}
        initialData={editingAssignment}
        classes={classes}
        onSubmit={handleSave}
        isSaving={isSaving}
        error={formError}
      />

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-error/10 p-3 text-error">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  Delete assignment?
                </h3>
                <p className="mt-2 text-sm text-base-content/70">
                  Are you sure you want to delete{" "}
                  <strong>{deleteTarget.title}</strong>? This action
                  cannot be undone.
                </p>
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error"
                onClick={() =>
                  deleteMutation.mutate(getId(deleteTarget))
                }
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && (
                  <span className="loading loading-spinner loading-sm" />
                )}
                Delete
              </button>
            </div>
          </div>
          <button
            type="button"
            className="modal-backdrop"
            aria-label="Close confirmation"
            onClick={() => setDeleteTarget(null)}
            disabled={deleteMutation.isPending}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
