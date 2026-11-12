import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api.js";

const EditClass = () => {
  const { class_id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------------------------------------
  // Load class
  // ---------------------------------------
  useEffect(() => {
    let mounted = true;

    const loadClass = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/classes/${class_id}`);

        // console.log("Class data response:", response.data);

        if (!mounted) return;

        const classData = response.data?.data;

        if (!classData) {
          throw new Error("Class data not found");
        }

        setFormData({
          name: classData.name || "",
          description: classData.description || "",
          status: classData.status || "active",
        });
      } catch (err) {
        console.error("Failed to load class:", err);

        if (mounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load class."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (class_id) {
      loadClass();
    }

    return () => {
      mounted = false;
    };
  }, [class_id]);

  // ---------------------------------------
  // Handle input
  // ---------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------------------------------
  // Submit
  // ---------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Class name is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
      };

      const response = await api.put(
        `/classes/${class_id}`,
        payload
      );
      
      if (response.data?.success) {
        setSuccess("Class updated successfully.");

        setTimeout(() => {
          navigate("/classes");
        }, 800);
      }
    } catch (err) {
      console.error("Update class error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update class."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------
  // Loading
  // ---------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 p-6">
        <div className="flex min-h-60 items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Edit Class
            </h1>

            <p className="mt-1 text-sm text-base-content/60">
              Update class information.
            </p>
          </div>

          <Link
            to="/school-admin/classes"
            className="btn btn-outline"
          >
            ← Back to Classes
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="alert alert-success mb-6">
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="card bg-base-100 shadow"
        >
          <div className="card-body">

            <h2 className="card-title mb-4">
              Class Information
            </h2>

            {/* Class Name */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">
                  Class Name
                </span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Class 8"
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
                placeholder="Enter class description..."
                className="textarea textarea-bordered h-32 w-full"
              />
            </div>

            {/* Status */}
            <div className="form-control mb-6">
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
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <Link
                to="/school-admin/classes"
                className="btn btn-ghost"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Saving...
                  </>
                ) : (
                  "Update Class"
                )}
              </button>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClass;