import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api.js";

function AddClass() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // -----------------------------------------
  // Handle Input Change
  // -----------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // -----------------------------------------
  // Validate Form
  // -----------------------------------------
  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Class name is required.";
    }

    if (formData.name.trim().length < 2) {
      return "Class name must be at least 2 characters.";
    }

    return "";
  };

  // -----------------------------------------
  // Submit Form
  // -----------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
      };

      const response = await api.post("/classes", payload);

      if (response.data?.success) {
        setSuccess(
          response.data.message || "Class created successfully."
        );

        setFormData({
          name: "",
          description: "",
          status: "active",
        });

        // Redirect after successful creation
        setTimeout(() => {
          navigate("/school-admin/classes");
        }, 1000);
      }
    } catch (err) {
      console.error("Create class error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create class. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------------------
  // Reset Form
  // -----------------------------------------
  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      status: "active",
    });

    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">

        {/* -------------------------------- */}
        {/* Page Header */}
        {/* -------------------------------- */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            {/* <div className="breadcrumbs text-sm">
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/classes")}
                  >
                    Classes
                  </button>
                </li>

                <li>Add Class</li>
              </ul>
            </div> */}

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Add Class
            </h1>

            <p className="mt-1 text-sm text-base-content/60">
              Create a new class for your school.
            </p>
          </div>

          {/* <button
            type="button"
            onClick={() => navigate("/classes")}
            className="btn btn-outline"
          >
            ← Back to Classes
          </button> */}
        </div>

        {/* -------------------------------- */}
        {/* Error Message */}
        {/* -------------------------------- */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* -------------------------------- */}
        {/* Success Message */}
        {/* -------------------------------- */}
        {success && (
          <div className="alert alert-success mb-6">
            <span>{success}</span>
          </div>
        )}

        {/* -------------------------------- */}
        {/* Form Card */}
        {/* -------------------------------- */}
        <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm">

          <div className="border-b border-base-300 p-5 sm:p-6">
            <h2 className="text-lg font-semibold">
              Class Information
            </h2>

            <p className="mt-1 text-sm text-base-content/50">
              Enter the basic information for this class.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5 p-5 sm:p-6">

              {/* -------------------------------- */}
              {/* Class Name */}
              {/* -------------------------------- */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Class Name *
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Class 6"
                  className="input input-bordered w-full"
                  disabled={submitting}
                />

                <label className="label">
                  <span className="label-text-alt text-base-content/50">
                    Example: Class 6, Class 7, Class 8
                  </span>
                </label>
              </div>

              {/* -------------------------------- */}
              {/* Description */}
              {/* -------------------------------- */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Description
                  </span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter a short description about this class..."
                  rows="4"
                  className="textarea textarea-bordered w-full"
                  disabled={submitting}
                />

                <label className="label">
                  <span className="label-text-alt text-base-content/50">
                    Optional
                  </span>
                </label>
              </div>

              {/* -------------------------------- */}
              {/* Status */}
              {/* -------------------------------- */}
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
                  disabled={submitting}
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            {/* -------------------------------- */}
            {/* Form Actions */}
            {/* -------------------------------- */}
            <div className="flex flex-col-reverse gap-3 border-t border-base-300 p-5 sm:flex-row sm:justify-end sm:p-6">

              <button
                type="button"
                onClick={handleReset}
                disabled={submitting}
                className="btn btn-outline"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => navigate("/school-admin/classes")}
                disabled={submitting}
                className="btn btn-ghost"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating Class...
                  </>
                ) : (
                  "Create Class"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddClass;