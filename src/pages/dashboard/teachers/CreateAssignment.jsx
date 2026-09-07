import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api.js";

const CreateAssignment = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    class_id: "",
    section_id: "",
    subject: "",
    due_date: "",
    total_marks: "",
    status: "draft",
  });

  // --------------------------------------
  // Load teacher's assigned classes
  // --------------------------------------
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoadingClasses(true);
        setError("");

        const response = await api.get("/teachers/classes");

        setClasses(response.data?.data || []);
      } catch (err) {
        console.error("Failed to load teacher classes:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load your assigned classes."
        );
      } finally {
        setLoadingClasses(false);
      }
    };

    loadClasses();
  }, []);

  // --------------------------------------
  // Input change
  // --------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear section when class changes
    if (name === "class_id") {
      setFormData((prev) => ({
        ...prev,
        class_id: value,
        section_id: "",
      }));
    }
  };

  // --------------------------------------
  // Selected class
  // --------------------------------------
  const selectedClass = classes.find(
    (item) => item._id === formData.class_id
  );

  const sections = selectedClass?.sections || [];

  // --------------------------------------
  // Submit
  // --------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic frontend validation
    if (!formData.title.trim()) {
      setError("Assignment title is required.");
      return;
    }

    if (!formData.class_id) {
      setError("Please select a class.");
      return;
    }

    if (!formData.section_id) {
      setError("Please select a section.");
      return;
    }

    if (!formData.subject.trim()) {
      setError("Subject is required.");
      return;
    }

    if (!formData.due_date) {
      setError("Due date is required.");
      return;
    }

    if (
      !formData.total_marks ||
      Number(formData.total_marks) <= 0
    ) {
      setError("Total marks must be greater than 0.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        class_id: formData.class_id,
        section_id: formData.section_id,
        subject: formData.subject.trim(),
        due_date: formData.due_date,
        total_marks: Number(formData.total_marks),
        status: formData.status,
      };

      const response = await api.post(
        "/teachers/assignment",
        payload
      );

      if (response.data?.success) {
        setSuccess("Assignment created successfully.");

        // Navigate to assignment list
        setTimeout(() => {
          navigate("/assignments");
        }, 800);
      }
    } catch (err) {
      console.error("Create assignment error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create assignment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Create Assignment
            </h1>

            <p className="mt-1 text-sm text-base-content/60">
              Create an assignment for one of your assigned sections.
            </p>
          </div>

          <Link
            to="/assignments"
            className="btn btn-outline"
          >
            ← Back to Assignments
          </Link>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-6">
            <span>{success}</span>
          </div>
        )}

        {/* Loading */}
        {loadingClasses ? (
          <div className="flex min-h-60 items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {/* Assignment Information */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">

                <h2 className="card-title mb-4">
                  Assignment Information
                </h2>

                {/* Title */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">
                      Assignment Title
                    </span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Chapter 3 Mathematics"
                    className="input input-bordered w-full"
                    maxLength={200}
                  />
                </div>

                {/* Subject */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">
                      Subject
                    </span>
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Mathematics"
                    className="input input-bordered w-full"
                    maxLength={100}
                  />
                </div>

                {/* Description */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">
                      Description
                    </span>
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write assignment instructions..."
                    className="textarea textarea-bordered h-32 w-full"
                  />
                </div>

                {/* Class & Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  {/* Class */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Class
                      </span>
                    </label>

                    <select
                      name="class_id"
                      value={formData.class_id}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >
                      <option value="">
                        Select class
                      </option>

                      {classes.map((item) => (
                        <option
                          key={item._id}
                          value={item._id}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Section */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Section
                      </span>
                    </label>

                    <select
                      name="section_id"
                      value={formData.section_id}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                      disabled={!formData.class_id}
                    >
                      <option value="">
                        {!formData.class_id
                          ? "Select class first"
                          : "Select section"}
                      </option>

                      {sections.map((section) => (
                        <option
                          key={section._id}
                          value={section._id}
                        >
                          {section.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Due Date & Marks */}
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                  {/* Due Date */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Due Date
                      </span>
                    </label>

                    <input
                      type="date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                    />
                  </div>

                  {/* Total Marks */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Total Marks
                      </span>
                    </label>

                    <input
                      type="number"
                      name="total_marks"
                      value={formData.total_marks}
                      onChange={handleChange}
                      placeholder="20"
                      min="1"
                      step="1"
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Publishing */}
            <div className="card mt-6 bg-base-100 shadow">
              <div className="card-body">

                <h2 className="card-title mb-4">
                  Assignment Status
                </h2>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Status
                    </span>
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>
                  </select>

                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      Draft assignments are not published to students.
                    </span>
                  </label>
                </div>

              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <Link
                to="/assignments"
                className="btn btn-ghost"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  "Create Assignment"
                )}
              </button>

            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default CreateAssignment;