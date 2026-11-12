import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  createSchoolAdminExam,
  deleteSchoolAdminExam,
  getSchoolAdminExamOptions,
  getSchoolAdminExams,
  updateSchoolAdminExam,
} from "../../services/schoolAdminExamService";

const EMPTY_SCHEDULE = {
  class_id: "",
  class_code: "",
  section_id: "",
  subject_id: "",
  exam_date: "",
  start_time: "",
  end_time: "",
  total_marks: 100,
  pass_marks: 33,
};

const EMPTY_FORM = {
  name: "",
  academic_year: "",
  exam_type: "terminal",
  start_date: "",
  end_date: "",
  description: "",
  status: "scheduled",
  schedules: [{ ...EMPTY_SCHEDULE }],
};

const EXAM_TYPES = [
  { value: "class_test", label: "Class Test" },
  { value: "monthly", label: "Monthly Examination" },
  { value: "terminal", label: "Terminal Examination" },
  { value: "half_yearly", label: "Half-Yearly Examination" },
  { value: "annual", label: "Annual Examination" },
  { value: "model_test", label: "Model Test" },
  { value: "other", label: "Other" },
];

const STATUSES = [
  { value: "scheduled", label: "Scheduled" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const getId = (item) => String(item?._id ?? item?.id ?? "");

const getName = (item) =>
  item?.name ??
  item?.class_name ??
  item?.section_name ??
  item?.subject_name ??
  item?.title ??
  "Unnamed";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong. Please try again.";

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}`.slice(0, 10));

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getExamName = (exam) =>
  exam?.name ?? exam?.examination_name ?? exam?.title ?? "Untitled exam";

const getSchedules = (exam) =>
{
  // console.log("exam",exam)
 return Array.isArray(exam?.schedules) ? exam.schedules : [];}

const unwrapList = (response, key) => {
  const data = response?.data ?? response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data?.[key])) return data.data[key];

  return [];
};

const getStatusClass = (status) => {
  switch (status) {
    case "ongoing":
      return "badge-info";
    case "completed":
      return "badge-success";
    case "cancelled":
      return "badge-error";
    case "scheduled":
    default:
      return "badge-warning";
  }
};

function SummaryCard({ title, value, icon: Icon, description }) {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body flex-row items-center gap-4 p-5">
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <Icon size={23} />
        </div>

        <div className="min-w-0">
          <p className="text-sm text-base-content/65">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className="mt-1 text-xs text-base-content/55">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function FieldError({ children }) {
  if (!children) return null;

  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-error">
      <AlertCircle size={13} />
      {children}
    </p>
  );
}

function ScheduleEditor({
  schedule,
  index,
  options,
  onChange,
  onRemove,
  canRemove,
}) {
  // console.log("Options", options)
  // console.log("schedule",schedule)
  const classes = options.classes;
  const allSections = options.sections;
  const allSubjects = options.subjects;

  const availableSections = allSections.filter(
    (section) =>
      !schedule.class_code ||
      String(section.class_code ?? section.classId ?? "") ===
        schedule.class_code
  );

  const availableSubjects = allSubjects.filter((subject) => {
    const subjectClassId =
      subject.class_code ?? subject.classId ?? "";

    return (
      !schedule.class_code ||
      !subjectClassId ||
      String(subjectClassId) === schedule.class_code
    );
  });
  // console.log("availableSubjects: ",availableSubjects)

  const update = (field, value) => {
    const changes = { [field]: value };

    if (field === "class_code") {
      changes.section_id = "";
      changes.subject_id = "";
    }

    onChange(index, changes);
  };

  return (
    <div className="rounded-xl border border-base-300 bg-base-200/40 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h4 className="font-semibold">
            Subject timetable #{index + 1}
          </h4>
          <p className="text-xs text-base-content/60">
            Configure the class, section, subject and exam time.
          </p>
        </div>

        {canRemove && (
          <button
            type="button"
            className="btn btn-ghost btn-sm text-error"
            onClick={() => onRemove(index)}
            aria-label={`Remove timetable entry ${index + 1}`}
          >
            <Trash2 size={16} />
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="form-control">
          <span className="label-text mb-1 font-medium">Class *</span>
          <select
            className="select select-bordered w-full"
            value={schedule.class_code}
            
            onChange={(event) => update("class_code", event.target.value)}
            required
          >
            <option value="">Select class</option>
            {classes.map((item) => (
              <option key={getId(item)} value={item.class_code}>
                {getName(item)}
              </option>
            ))}
          </select>
        </label>

        <label className="form-control">
          <span className="label-text mb-1 font-medium">Section *</span>
          <select
            className="select select-bordered w-full"
            value={schedule.section_id}
            onChange={(event) => update("section_id", event.target.value)}
            disabled={!schedule.class_code}
            required
          >
            <option value="">Select section</option>
            {availableSections.map((item) => (
              <option key={getId(item)} value={getId(item)}>
                {getName(item)}
              </option>
            ))}
          </select>
        </label>

        <label className="form-control">
          <span className="label-text mb-1 font-medium">Subject *</span>
          <select
            className="select select-bordered w-full"
            value={schedule.subject_id}
            onChange={(event) => update("subject_id", event.target.value)}
            required
          >
            <option value="">Select subject</option>
            {availableSubjects.map((item) => (
              <option key={getId(item)} value={getId(item)}>
                {getName(item)}
              </option>
            ))}
          </select>
        </label>

        <label className="form-control">
          <span className="label-text mb-1 font-medium">Exam date *</span>
          <input
            type="date"
            className="input input-bordered w-full"
            value={schedule.exam_date}
            onChange={(event) => update("exam_date", event.target.value)}
            required
          />
        </label>

        <label className="form-control">
          <span className="label-text mb-1 font-medium">Start time *</span>
          <input
            type="time"
            className="input input-bordered w-full"
            value={schedule.start_time}
            onChange={(event) => update("start_time", event.target.value)}
            required
          />
        </label>

        <label className="form-control">
          <span className="label-text mb-1 font-medium">End time *</span>
          <input
            type="time"
            className="input input-bordered w-full"
            value={schedule.end_time}
            onChange={(event) => update("end_time", event.target.value)}
            required
          />
        </label>

        <label className="form-control">
          <span className="label-text mb-1 font-medium">Total marks *</span>
          <input
            type="number"
            min="1"
            max="10000"
            className="input input-bordered w-full"
            value={schedule.total_marks}
            onChange={(event) =>
              update("total_marks", event.target.value)
            }
            required
          />
        </label>

        <label className="form-control">
          <span className="label-text mb-1 font-medium">Pass marks *</span>
          <input
            type="number"
            min="0"
            max="10000"
            className="input input-bordered w-full"
            value={schedule.pass_marks}
            onChange={(event) =>
              update("pass_marks", event.target.value)
            }
            required
          />
        </label>
      </div>
    </div>
  );
}

export default function Exams() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formError, setFormError] = useState("");

  const examsQuery = useQuery({
    queryKey: ["school-admin-exams", search, statusFilter, yearFilter],
    queryFn: () =>
      getSchoolAdminExams({
        search: search.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        academic_year: yearFilter !== "all" ? yearFilter : undefined,
      }),
  });

  const optionsQuery = useQuery({
    queryKey: ["school-admin-exam-options"],
    queryFn: () => getSchoolAdminExamOptions(),
    staleTime: 5 * 60 * 1000,
  });

  const exams = useMemo(
    () => unwrapList(examsQuery.data, "exams"),
    [examsQuery.data]
  );

  // console.log("exams",exams)

  const optionsData = optionsQuery.data?.data ?? optionsQuery.data ?? {};

  const options = useMemo(
    () => ({
      classes: unwrapList(optionsData, "classes"),
      sections: unwrapList(optionsData, "sections"),
      subjects: unwrapList(optionsData, "subjects"),
      academicYears: unwrapList(optionsData, "academic_years"),
    }),
    [optionsData]
  );

  const refreshExams = () =>
    queryClient.invalidateQueries({
      queryKey: ["school-admin-exams"],
    });

  const createMutation = useMutation({
    mutationFn: createSchoolAdminExam,
    onSuccess: async () => {
      await refreshExams();
      setIsModalOpen(false);
      setEditingExam(null);
      setForm({ ...EMPTY_FORM });
      setFormError("");
    },
    onError: (error) => setFormError(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: updateSchoolAdminExam,
    onSuccess: async () => {
      await refreshExams();
      setIsModalOpen(false);
      setEditingExam(null);
      setForm({ ...EMPTY_FORM });
      setFormError("");
    },
    onError: (error) => setFormError(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSchoolAdminExam,
    onSuccess: refreshExams,
  });

  const summary = useMemo(() => {
    const counts = {
      total: exams.length,
      scheduled: 0,
      ongoing: 0,
      completed: 0,
    };

    for (const exam of exams) {
      const status = exam.status ?? "scheduled";
      if (status === "scheduled") counts.scheduled += 1;
      if (status === "ongoing") counts.ongoing += 1;
      if (status === "completed") counts.completed += 1;
    }

    return counts;
  }, [exams]);

  const openCreateModal = () => {
    setEditingExam(null);
    setForm({
      ...EMPTY_FORM,
      academic_year:
        options.academicYears[0]?.year ??
        options.academicYears[0]?.name ??
        "",
      schedules: [{ ...EMPTY_SCHEDULE }],
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (exam) => {
    setEditingExam(exam);
    setForm({
      name: getExamName(exam),
      academic_year: exam.academic_year ?? "",
      exam_type: exam.exam_type ?? "terminal",
      start_date: exam.start_date ?? "",
      end_date: exam.end_date ?? "",
      description: exam.description ?? "",
      status: exam.status ?? "scheduled",
      schedules: getSchedules(exam).length
        ? getSchedules(exam).map((schedule) => ({
            class_id: String(schedule.class_id),
            class_code: String(schedule.class_code ?? ""),
            section_id: String(schedule.section_id ?? ""),
            subject_id: String(schedule.subject_id ?? ""),
            exam_date: schedule.exam_date ?? "",
            start_time: schedule.start_time ?? "",
            end_time: schedule.end_time ?? "",
            total_marks: schedule.total_marks ?? 100,
            pass_marks: schedule.pass_marks ?? 33,
          }))
        : [{ ...EMPTY_SCHEDULE }],
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const updateSchedule = (index, changes) => {
    setForm((current) => ({
      ...current,
      schedules: current.schedules.map((schedule, scheduleIndex) =>
        scheduleIndex === index
          ? { ...schedule, ...changes }
          : schedule
      ),
    }));
  };

  const addSchedule = () => {
    setForm((current) => ({
      ...current,
      schedules: [...current.schedules, { ...EMPTY_SCHEDULE }],
    }));
  };

  const removeSchedule = (index) => {
    setForm((current) => ({
      ...current,
      schedules: current.schedules.filter(
        (_, scheduleIndex) => scheduleIndex !== index
      ),
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Enter an examination name.";
    if (!form.academic_year) return "Select an academic year.";
    if (!form.start_date || !form.end_date) {
      return "Select the examination start and end dates.";
    }
    if (form.end_date < form.start_date) {
      return "The end date cannot be before the start date.";
    }
    if (!form.schedules.length) {
      return "Add at least one subject timetable entry.";
    }

    const seenEntries = new Set();

    for (let index = 0; index < form.schedules.length; index += 1) {
      const schedule = form.schedules[index];
      const label = `Timetable entry ${index + 1}`;

      if (
        !schedule.class_code ||
        !schedule.section_id ||
        !schedule.subject_id ||
        !schedule.exam_date ||
        !schedule.start_time ||
        !schedule.end_time
      ) {
        return `${label}: complete all required fields.`;
      }

      if (schedule.end_time <= schedule.start_time) {
        return `${label}: the end time must be after the start time.`;
      }

      if (
        schedule.exam_date < form.start_date ||
        schedule.exam_date > form.end_date
      ) {
        return `${label}: its date must be within the examination date range.`;
      }

      const totalMarks = Number(schedule.total_marks);
      const passMarks = Number(schedule.pass_marks);

      if (!Number.isFinite(totalMarks) || totalMarks <= 0) {
        return `${label}: total marks must be greater than zero.`;
      }

      if (
        !Number.isFinite(passMarks) ||
        passMarks < 0 ||
        passMarks > totalMarks
      ) {
        return `${label}: pass marks must be between zero and total marks.`;
      }

      const key = [
        schedule.class_code,
        schedule.section_id,
        schedule.subject_id,
      ].join(":");

      if (seenEntries.has(key)) {
        return `${label}: this subject already has a timetable entry for the same class and section.`;
      }

      seenEntries.add(key);
    }

    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");

    const payload = {
      name: form.name.trim(),
      academic_year: form.academic_year,
      exam_type: form.exam_type,
      start_date: form.start_date,
      end_date: form.end_date,
      description: form.description.trim(),
      status: form.status,
      schedules: form.schedules.map((schedule) => ({
        
        class_code: schedule.class_code,
        section_id: schedule.section_id,
        subject_id: schedule.subject_id,
        exam_date: schedule.exam_date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        total_marks: Number(schedule.total_marks),
        pass_marks: Number(schedule.pass_marks),
      })),
    };

    if (editingExam) {
      updateMutation.mutate({
        examId: getId(editingExam),
        ...payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (exam) => {
    const confirmed = window.confirm(
      `Delete "${getExamName(exam)}"? This action cannot be undone.`
    );

    if (confirmed) {
      deleteMutation.mutate(getId(exam));
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (examsQuery.isLoading || optionsQuery.isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
        <span className="ml-3 text-base-content/70">
          Loading examination management...
        </span>
      </div>
    );
  }

  if (examsQuery.isError || optionsQuery.isError) {
    const error = examsQuery.error || optionsQuery.error;

    return (
      <div className="alert alert-error mx-auto max-w-3xl">
        <AlertCircle />
        <div className="flex-1">
          <h3 className="font-bold">Unable to load examinations</h3>
          <p className="text-sm">{getErrorMessage(error)}</p>
        </div>
        <button
          className="btn btn-sm"
          onClick={() => {
            examsQuery.refetch();
            optionsQuery.refetch();
          }}
        >
          <RefreshCw size={15} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            Examination Management
          </h1>
          <p className="mt-1 text-sm text-base-content/65">
            Create school-wide examinations and manage class-wise subject
            timetables.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} />
          Create Examination
        </button>
      </div>

      {deleteMutation.isError && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{getErrorMessage(deleteMutation.error)}</span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => deleteMutation.reset()}
          >
            Dismiss
          </button>
        </div>
      )}

      {deleteMutation.isPending && (
        <div className="alert">
          <span className="loading loading-spinner loading-sm" />
          Deleting examination...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Examinations"
          value={summary.total}
          icon={ClipboardList}
          description="Matching current filters"
        />
        <SummaryCard
          title="Scheduled"
          value={summary.scheduled}
          icon={CalendarDays}
          description="Upcoming examinations"
        />
        <SummaryCard
          title="Ongoing"
          value={summary.ongoing}
          icon={Clock3}
          description="Currently in progress"
        />
        <SummaryCard
          title="Completed"
          value={summary.completed}
          icon={CheckCircle2}
          description="Finished examinations"
        />
      </div>

      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="input input-bordered flex flex-1 items-center gap-2">
              <Search size={18} className="text-base-content/50" />
              <input
                type="search"
                className="grow"
                placeholder="Search examination name..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <select
              className="select select-bordered w-full lg:w-48"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by examination status"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered w-full lg:w-48"
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              aria-label="Filter by academic year"
            >
              <option value="all">All academic years</option>
              {options.academicYears.map((year) => {
                const value = String(
                  year.year ?? year.name ?? year.academic_year ?? ""
                );

                return value ? (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ) : null;
              })}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Examination</th>
                  <th>Academic year</th>
                  <th>Date range</th>
                  <th>Timetable entries</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {exams.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex flex-col items-center gap-3 py-12 text-center">
                        <ClipboardList
                          size={36}
                          className="text-base-content/30"
                        />
                        <h3 className="font-semibold">
                          No examinations found
                        </h3>
                        <p className="max-w-md text-sm text-base-content/60">
                          Create your first school-wide examination, or adjust
                          your search and filters.
                        </p>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={openCreateModal}
                        >
                          <Plus size={16} />
                          Create Examination
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  exams.map((exam) => {
                    const id = getId(exam);
                    const schedules = getSchedules(exam);
                    const status = exam.status ?? "scheduled";

                    return (
                      <tr key={id}>
                        <td>
                          <div className="font-semibold">
                            {getExamName(exam)}
                          </div>
                          <div className="mt-1 text-xs capitalize text-base-content/60">
                            {(exam.exam_type ?? "other").replaceAll("_", " ")}
                          </div>
                        </td>

                        <td>{exam.academic_year ?? "—"}</td>

                        <td>
                          <div>{formatDate(exam.start_date)}</div>
                          <div className="text-xs text-base-content/55">
                            to {formatDate(exam.end_date)}
                          </div>
                        </td>

                        <td>
                          <div className="font-semibold">
                            {schedules.length}
                          </div>
                          <div className="text-xs text-base-content/55">
                            subject timetable entries
                          </div>
                        </td>

                        <td>
                          <span
                            className={`badge ${getStatusClass(status)} capitalize`}
                          >
                            {status.replaceAll("_", " ")}
                          </span>
                        </td>

                        <td>
                          <div className="flex justify-end gap-2">
                            <button
                              className="btn btn-ghost btn-sm text-primary"
                              onClick={() => navigate(`/exams/${id}`)}
                              title="View exam details"
                              aria-label={`View details of ${getExamName(exam)}`}
                            >
                              <ClipboardList size={16} />
                            </button>

                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => openEditModal(exam)}
                              title="Edit examination"
                              aria-label={`Edit ${getExamName(exam)}`}
                            >
                              <Edit3 size={16} />
                            </button>

                            <button
                              className="btn btn-ghost btn-sm text-error"
                              onClick={() => handleDelete(exam)}
                              disabled={deleteMutation.isPending}
                              title="Delete examination"
                              aria-label={`Delete ${getExamName(exam)}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-base-content/55">
            <span>{exams.length} examination(s) returned</span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => examsQuery.refetch()}
              disabled={examsQuery.isFetching}
            >
              <RefreshCw
                size={14}
                className={examsQuery.isFetching ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-6xl">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">
                  {editingExam ? "Edit Examination" : "Create Examination"}
                </h2>
                <p className="mt-1 text-sm text-base-content/60">
                  Set the overall exam details, then configure a timetable
                  entry for each class, section and subject.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-circle btn-ghost btn-sm"
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <div className="alert alert-error">
                  <AlertCircle size={18} />
                  <span>{formError}</span>
                </div>
              )}

              <section>
                <h3 className="mb-3 font-semibold">Examination details</h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="form-control">
                    <span className="label-text mb-1 font-medium">
                      Examination name *
                    </span>
                    <input
                      className="input input-bordered w-full"
                      placeholder="e.g. Half-Yearly Examination"
                      value={form.name}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      required
                    />
                  </label>

                  <label className="form-control">
                    <span className="label-text mb-1 font-medium">
                      Academic year *
                    </span>
                    {options.academicYears.length > 0 ? (
                      <select
                        className="select select-bordered w-full"
                        value={form.academic_year}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            academic_year: event.target.value,
                          }))
                        }
                        required
                      >
                        <option value="">Select academic year</option>
                        {options.academicYears.map((year) => {
                          const value = String(
                            year.year ??
                              year.name ??
                              year.academic_year ??
                              ""
                          );

                          return value ? (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ) : null;
                        })}
                      </select>
                    ) : (
                      <input
                        className="input input-bordered w-full"
                        placeholder="e.g. 2026"
                        value={form.academic_year}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            academic_year: event.target.value,
                          }))
                        }
                        required
                      />
                    )}
                  </label>

                  <label className="form-control">
                    <span className="label-text mb-1 font-medium">
                      Exam type *
                    </span>
                    <select
                      className="select select-bordered w-full"
                      value={form.exam_type}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          exam_type: event.target.value,
                        }))
                      }
                      required
                    >
                      {EXAM_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="form-control">
                    <span className="label-text mb-1 font-medium">
                      Start date *
                    </span>
                    <input
                      type="date"
                      className="input input-bordered w-full"
                      value={form.start_date}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          start_date: event.target.value,
                        }))
                      }
                      required
                    />
                  </label>

                  <label className="form-control">
                    <span className="label-text mb-1 font-medium">
                      End date *
                    </span>
                    <input
                      type="date"
                      className="input input-bordered w-full"
                      value={form.end_date}
                      min={form.start_date || undefined}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          end_date: event.target.value,
                        }))
                      }
                      required
                    />
                  </label>

                  <label className="form-control">
                    <span className="label-text mb-1 font-medium">
                      Status *
                    </span>
                    <select
                      className="select select-bordered w-full"
                      value={form.status}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          status: event.target.value,
                        }))
                      }
                    >
                      {STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="form-control sm:col-span-2 lg:col-span-3">
                    <span className="label-text mb-1 font-medium">
                      Description / instructions
                    </span>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      rows={2}
                      placeholder="Optional examination instructions..."
                      value={form.description}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
              </section>

              <div className="divider" />

              <section className="space-y-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-semibold">Subject timetable</h3>
                    <p className="mt-1 text-sm text-base-content/60">
                      Each entry represents one subject exam for a specific
                      class and section.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={addSchedule}
                  >
                    <Plus size={16} />
                    Add subject
                  </button>
                </div>

                {options.classes.length === 0 ||
                options.sections.length === 0 ||
                options.subjects.length === 0 ? (
                  <div className="alert alert-warning">
                    <AlertCircle size={18} />
                    <span>
                      Classes, sections and subjects must exist in your school
                      before you can configure the timetable.
                    </span>
                  </div>
                ) : null}

                {form.schedules.map((schedule, index) => (
                  <ScheduleEditor
                    key={index}
                    schedule={schedule}
                    index={index}
                    options={options}
                    onChange={updateSchedule}
                    onRemove={removeSchedule}
                    canRemove={form.schedules.length > 1}
                  />
                ))}
              </section>

              <div className="modal-action sticky bottom-0 -mx-6 -mb-6 mt-6 border-t border-base-300 bg-base-100 px-6 py-4">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
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
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={17} />
                      {editingExam ? "Save Changes" : "Create Examination"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <button
            className="modal-backdrop"
            onClick={() => {
              if (!isSaving) setIsModalOpen(false);
            }}
            aria-label="Close examination modal"
          />
        </div>
      )}
    </div>
  );
}
