import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api.js";

const Students = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // Fetch Classes
  // --------------------------------------------------
  const fetchClasses = async () => {
    try {
      const response = await api.get("/classes");

      setClasses(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch classes:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load classes."
      );
    }
  };

  // --------------------------------------------------
  // Fetch Sections
  // --------------------------------------------------
  const fetchSections = async (selectedClassId) => {
    if (!selectedClassId) {
      setSections([]);
      return;
    }

    try {
      setFilterLoading(true);

      const response = await api.get(
        `/sections/classes/${selectedClassId}`
      );

      setSections(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch sections:", error);

      setSections([]);

      setError(
        error.response?.data?.message ||
          "Failed to load sections."
      );
    } finally {
      setFilterLoading(false);
    }
  };

  // --------------------------------------------------
  // Fetch Students
  // --------------------------------------------------
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (classId) {
        params.class_id = classId;
      }

      if (sectionId) {
        params.section_id = sectionId;
      }

      const response = await api.get("/students", {
        params,
      });

      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch students:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load students."
      );

      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Initial Load
  // --------------------------------------------------
  useEffect(() => {
    fetchClasses();
  }, []);

  // --------------------------------------------------
  // Fetch Sections when Class Changes
  // --------------------------------------------------
  useEffect(() => {
    if (!classId) {
      setSections([]);
      setSectionId("");
      return;
    }

    setSectionId("");
    fetchSections(classId);
  }, [classId]);

  // --------------------------------------------------
  // Fetch Students
  // --------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, classId, sectionId]);

  // --------------------------------------------------
  // Delete Student
  // --------------------------------------------------
  const handleDelete = async (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.first_name} ${student.last_name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(student._id);
      setError("");
      setSuccess("");

      await api.delete(`/students/${student._id}`);

      setStudents((prevStudents) =>
        prevStudents.filter(
          (item) => item._id !== student._id
        )
      );

      setSuccess("Student deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Delete student error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete student."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // --------------------------------------------------
  // Reset Filters
  // --------------------------------------------------
  const handleResetFilters = () => {
    setSearch("");
    setClassId("");
    setSectionId("");
    setSections([]);
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Students
          </h1>

          <p className="text-sm text-base-content/60 mt-1">
            Manage students in your school.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/students/add")}
          className="btn btn-primary"
        >
          + Add Student
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="alert alert-success mb-4">
          <span>{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>

          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => setError("")}
          >
            ✕
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="label">
                <span className="label-text">
                  Search Student
                </span>
              </label>

              <input
                type="text"
                placeholder="Name, ID, email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="input input-bordered w-full"
              />
            </div>

            {/* Class */}
            <div>
              <label className="label">
                <span className="label-text">
                  Class
                </span>
              </label>

              <select
                value={classId}
                onChange={(e) =>
                  setClassId(e.target.value)
                }
                className="select select-bordered w-full"
              >
                <option value="">
                  All Classes
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
            <div>
              <label className="label">
                <span className="label-text">
                  Section
                </span>
              </label>

              <select
                value={sectionId}
                onChange={(e) =>
                  setSectionId(e.target.value)
                }
                disabled={!classId || filterLoading}
                className="select select-bordered w-full"
              >
                <option value="">
                  {filterLoading
                    ? "Loading..."
                    : "All Sections"}
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

            {/* Reset */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-outline w-full"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Count */}
      <div className="mb-4">
        <span className="text-sm text-base-content/60">
          Showing{" "}
          <span className="font-semibold">
            {students.length}
          </span>{" "}
          student{students.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Students Table */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Roll</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Registration</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-center py-10"
                    >
                      <span className="loading loading-spinner loading-md"></span>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-center py-10"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-base-content/50">
                          No students found.
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            navigate("/students/add")
                          }
                          className="btn btn-sm btn-primary"
                        >
                          Add Student
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <tr key={student._id}>
                      {/* Number */}
                      <td>{index + 1}</td>

                      {/* Student */}
                      <td>
                        <div className="font-semibold">
                          {student.first_name}{" "}
                          {student.last_name}
                        </div>

                        {student.email && (
                          <div className="text-xs text-base-content/50">
                            {student.email}
                          </div>
                        )}
                      </td>

                      {/* Student ID */}
                      <td>
                        <span className="font-mono text-sm">
                          {student.student_id}
                        </span>
                      </td>

                      {/* Class */}
                      <td>
                        {student.class_name || "-"}
                      </td>

                      {/* Section */}
                      <td>
                        {student.section_name || "-"}
                      </td>

                      {/* Roll */}
                      <td>
                        {student.roll_number || "-"}
                      </td>

                      {/* Phone */}
                      <td>
                        {student.phone || "-"}
                      </td>

                      {/* Status */}
                      <td>
                        {student.status === "active" ? (
                          <span className="badge badge-success badge-sm">
                            Active
                          </span>
                        ) : (
                          <span className="badge badge-error badge-sm">
                            {student.status || "Inactive"}
                          </span>
                        )}
                      </td>

                      {/* Registration Status */}
                      <td>
                        {student.registration_status ===
                        "registered" ? (
                          <span className="badge badge-success badge-sm">
                            Registered
                          </span>
                        ) : (
                          <span className="badge badge-warning badge-sm">
                            Not Registered
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex gap-2">
                          {/* Edit */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() =>
                              navigate(
                                `/students/${student._id}/edit`
                              )
                            }
                          >
                            Edit
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            className="btn btn-sm btn-error btn-outline"
                            disabled={
                              deleteLoading ===
                              student._id
                            }
                            onClick={() =>
                              handleDelete(student)
                            }
                          >
                            {deleteLoading ===
                            student._id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Delete"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;