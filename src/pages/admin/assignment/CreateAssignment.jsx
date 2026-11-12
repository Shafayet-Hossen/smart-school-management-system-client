
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  Loader2,
  Save,
  Send,
  UserRound,
  X,
} from "lucide-react";
import {
  createSchoolAdminAssignment,
  getAssignmentFormOptions,
} from "../../../services/schoolAdminAssignmentService";

const initialForm = {
  title: "",
  description: "",
  instructions: "",
  academic_year: new Date().getFullYear().toString(),
  assignment_type: "homework",
  class_id: "",
  section_id: "",
  subject_id: "",
  teacher_id: "",
  issue_date: new Date().toISOString().slice(0, 10),
  due_date: "",
  total_marks: "100",
  allow_late_submission: false,
  status: "draft",
};

const InputLabel = ({ children, required }) => (
  <label className="label pb-1">
    <span className="label-text font-semibold">
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </span>
  </label>
);

const FormField = ({ label, required, children, error }) => (
  <div>
    <InputLabel required={required}>{label}</InputLabel>
    {children}
    {error && (
      <p className="text-error text-xs mt-1">{error}</p>
    )}
  </div>
);

const CreateAssignment = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [attachment, setAttachment] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const { data: optionsData, isLoading: optionsLoading, isError: optionsError } = useQuery({
    queryKey: ["school-admin-assignment-form-options"],
    queryFn: getAssignmentFormOptions,
    staleTime: 5 * 60 * 1000,
  });

//   console.log("Option Data", optionsData)

  const options = optionsData || {
    classes: [],
    sections: [],
    subjects: [],
    teachers: [],
    academic_years: [],
  };

  const sections = useMemo(
    () =>
      options.sections.filter(
        (section) =>
          String(section.class_id || section.class_code) ===
          String(form.class_id)
      ),
    [options.sections, form.class_id]
  );

  const subjects = useMemo(
    () =>
      options.subjects.filter((subject) => {
        if (!form.class_id) return true;

        const subjectClassId =
          subject.class_id || subject.class_code;

        return (
          !subjectClassId ||
          String(subjectClassId) === String(form.class_id)
        );
      }),
    [options.subjects, form.class_id]
  );

  const teachers = options.teachers || [];

  const mutation = useMutation({
    mutationFn: createSchoolAdminAssignment,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["school-admin-all-assignments"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["school-admin-assignment-overview"],
        }),
      ]);

      setSuccessMessage("Assignment created successfully.");

      setTimeout(() => {
        navigate("/school-admin/assignments");
      }, 1000);
    },
  });

  useEffect(() => {
    if (form.class_id && form.section_id) {
      const sectionExists = sections.some(
        (section) =>
          String(section.value) === String(form.section_id)
      );

      if (!sectionExists) {
        setForm((previous) => ({
          ...previous,
          section_id: "",
        }));
      }
    }
  }, [form.class_id, form.section_id, sections]);

  const updateField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Assignment title is required.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!form.academic_year) {
      newErrors.academic_year = "Academic year is required.";
    }

    if (!form.class_id) {
      newErrors.class_id = "Please select a class.";
    }

    if (!form.section_id) {
      newErrors.section_id = "Please select a section.";
    }

    if (!form.subject_id) {
      newErrors.subject_id = "Please select a subject.";
    }

    if (!form.teacher_id) {
      newErrors.teacher_id = "Please select a teacher.";
    }

    if (!form.issue_date) {
      newErrors.issue_date = "Issue date is required.";
    }

    if (!form.due_date) {
      newErrors.due_date = "Due date is required.";
    }

    if (
      form.issue_date &&
      form.due_date &&
      form.due_date < form.issue_date
    ) {
      newErrors.due_date =
        "Due date cannot be earlier than issue date.";
    }

    if (
      !Number.isFinite(Number(form.total_marks)) ||
      Number(form.total_marks) <= 0
    ) {
      newErrors.total_marks = "Enter valid total marks.";
    }

    if (!["draft", "active"].includes(form.status)) {
      newErrors.status = "Invalid assignment status.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const payload = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      payload.append(key, String(value));
    });

    if (attachment) {
      payload.append("attachment", attachment);
    }

    mutation.mutate(payload);
  };

  if (optionsLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (optionsError) {
    return (
      <div className="alert alert-error">
        Failed to load assignment form options.
        <button
          className="btn btn-sm"
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: ["school-admin-assignment-form-options"],
            })
          }
        >
          Retry
        </button>
      </div>
    );
  }

  const getSelectValue = (items, id) => {
    const selected = items.find(
      (item) => String(item.value) === String(id)
    );

    return selected?.label || "";
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-circle btn-ghost btn-sm mt-1"
            type="button"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold">
              Create Assignment
            </h1>
            <p className="text-sm text-base-content/60 mt-1">
              Create and assign academic tasks to students.
            </p>
          </div>
        </div>

        <div className="badge badge-primary badge-outline gap-2 p-3">
          <ClipboardList size={15} />
          New Assignment
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success">
          <CheckCircle2 size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {mutation.isError && (
        <div className="alert alert-error">
          <X size={20} />
          <span>
            {mutation.error?.response?.data?.message ||
              mutation.error?.message ||
              "Failed to create assignment."}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Assignment Details */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FileText size={21} />
              </div>
              <div>
                <h2 className="font-bold text-lg">
                  Assignment Details
                </h2>
                <p className="text-xs text-base-content/60">
                  Provide the basic information.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Assignment Title"
                required
                error={errors.title}
              >
                <input
                  className={`input input-bordered w-full ${
                    errors.title ? "input-error" : ""
                  }`}
                  placeholder="e.g. Mathematics Chapter 5 Homework"
                  value={form.title}
                  onChange={(e) =>
                    updateField("title", e.target.value)
                  }
                  maxLength={150}
                />
              </FormField>

              <FormField
                label="Academic Year"
                required
                error={errors.academic_year}
              >
                <select
                  className="select select-bordered w-full"
                  value={form.academic_year}
                  onChange={(e) =>
                    updateField("academic_year", e.target.value)
                  }
                >
                  <option value="">Select academic year</option>

                  {options.academicYears.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}

                  {!options.academicYears.some(
                    (year) =>
                      String(year.value) === form.academic_year
                  ) && (
                    <option value={form.academic_year}>
                      {form.academic_year}
                    </option>
                  )}
                </select>
              </FormField>

              <FormField label="Assignment Type" required>
                <select
                  className="select select-bordered w-full"
                  value={form.assignment_type}
                  onChange={(e) =>
                    updateField("assignment_type", e.target.value)
                  }
                >
                  <option value="homework">Homework</option>
                  <option value="classwork">Classwork</option>
                  <option value="project">Project</option>
                  <option value="quiz">Quiz</option>
                  <option value="research">Research</option>
                  <option value="other">Other</option>
                </select>
              </FormField>

              <FormField
                label="Total Marks"
                required
                error={errors.total_marks}
              >
                <input
                  type="number"
                  min="1"
                  className="input input-bordered w-full"
                  value={form.total_marks}
                  onChange={(e) =>
                    updateField("total_marks", e.target.value)
                  }
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField
                  label="Description"
                  required
                  error={errors.description}
                >
                  <textarea
                    className="textarea textarea-bordered w-full min-h-28"
                    placeholder="Describe the assignment..."
                    value={form.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    maxLength={5000}
                  />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField label="Instructions">
                  <textarea
                    className="textarea textarea-bordered w-full min-h-24"
                    placeholder="Provide additional instructions for students..."
                    value={form.instructions}
                    onChange={(e) =>
                      updateField("instructions", e.target.value)
                    }
                    maxLength={5000}
                  />
                </FormField>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Assignment */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                <GraduationCap size={21} />
              </div>
              <div>
                <h2 className="font-bold text-lg">
                  Academic Assignment
                </h2>
                <p className="text-xs text-base-content/60">
                  Choose the class, section, subject and teacher.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Class"
                required
                error={errors.class_id}
              >
                <select
                  className="select select-bordered w-full"
                  value={form.class_id}
                  onChange={(e) => {
                    setForm((previous) => ({
                      ...previous,
                      class_id: e.target.value,
                      section_id: "",
                      subject_id: "",
                    }));

                    setErrors((previous) => ({
                      ...previous,
                      class_id: "",
                      section_id: "",
                      subject_id: "",
                    }));
                  }}
                >
                  <option value="">Select class</option>

                  {options.classes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Section"
                required
                error={errors.section_id}
              >
                <select
                  className="select select-bordered w-full"
                  value={form.section_id}
                  onChange={(e) =>
                    updateField("section_id", e.target.value)
                  }
                  disabled={!form.class_id}
                >
                  <option value="">Select section</option>

                  {sections.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Subject"
                required
                error={errors.subject_id}
              >
                <select
                  className="select select-bordered w-full"
                  value={form.subject_id}
                  onChange={(e) =>
                    updateField("subject_id", e.target.value)
                  }
                >
                  <option value="">Select subject</option>

                  {subjects.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Assigned Teacher"
                required
                error={errors.teacher_id}
              >
                <select
                  className="select select-bordered w-full"
                  value={form.teacher_id}
                  onChange={(e) =>
                    updateField("teacher_id", e.target.value)
                  }
                >
                  <option value="">Select teacher</option>

                  {teachers.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            {form.class_id && (
              <div className="mt-3 p-3 rounded-lg bg-base-200 text-sm">
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  <span>
                    <strong>Class:</strong>{" "}
                    {getSelectValue(options.classes, form.class_id)}
                  </span>

                  <span>
                    <strong>Section:</strong>{" "}
                    {getSelectValue(sections, form.section_id) || "Not selected"}
                  </span>

                  <span>
                    <strong>Subject:</strong>{" "}
                    {getSelectValue(subjects, form.subject_id) || "Not selected"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submission Settings */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-info/10 text-info">
                <CalendarDays size={21} />
              </div>
              <div>
                <h2 className="font-bold text-lg">
                  Submission Settings
                </h2>
                <p className="text-xs text-base-content/60">
                  Set dates and submission preferences.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Issue Date"
                required
                error={errors.issue_date}
              >
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={form.issue_date}
                  onChange={(e) =>
                    updateField("issue_date", e.target.value)
                  }
                />
              </FormField>

              <FormField
                label="Due Date"
                required
                error={errors.due_date}
              >
                <input
                  type="date"
                  min={form.issue_date}
                  className="input input-bordered w-full"
                  value={form.due_date}
                  onChange={(e) =>
                    updateField("due_date", e.target.value)
                  }
                />
              </FormField>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-base-300">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={form.allow_late_submission}
                    onChange={(e) =>
                      updateField(
                        "allow_late_submission",
                        e.target.checked
                      )
                    }
                  />

                  <div>
                    <p className="font-semibold text-sm">
                      Allow late submissions
                    </p>
                    <p className="text-xs text-base-content/60">
                      Students can submit after the due date.
                    </p>
                  </div>
                </label>
              </div>

              <div className="md:col-span-2">
                <FormField label="Attachment (Optional)">
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.ppt,.pptx"
                    onChange={(e) =>
                      setAttachment(e.target.files?.[0] || null)
                    }
                  />

                  {attachment && (
                    <div className="flex items-center justify-between mt-2 p-2 rounded-lg bg-base-200 text-sm">
                      <span className="truncate">
                        {attachment.name}
                      </span>

                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => setAttachment(null)}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  )}
                </FormField>
              </div>
            </div>
          </div>
        </div>

        {/* Publishing */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-success/10 text-success">
                <BookOpen size={21} />
              </div>
              <div>
                <h2 className="font-bold text-lg">
                  Publishing
                </h2>
                <p className="text-xs text-base-content/60">
                  Choose whether to save as a draft or publish now.
                </p>
              </div>
            </div>

            <FormField
              label="Assignment Status"
              required
              error={errors.status}
            >
              <select
                className="select select-bordered w-full md:max-w-md"
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value)
                }
              >
                <option value="draft">Save as Draft</option>
                <option value="active">Publish Assignment</option>
              </select>
            </FormField>

            {form.status === "active" && (
              <div className="alert alert-info mt-3 text-sm">
                <Send size={18} />
                Publishing makes this assignment available to the selected class.
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/school-admin/assignments")}
            disabled={mutation.isPending}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating...
              </>
            ) : (
              <>
                {form.status === "active" ? (
                  <Send size={18} />
                ) : (
                  <Save size={18} />
                )}
                {form.status === "active"
                  ? "Publish Assignment"
                  : "Save as Draft"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssignment;
