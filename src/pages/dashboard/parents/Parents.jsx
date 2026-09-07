import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api.js";

const Parents = () => {
  const navigate = useNavigate();

  const [parents, setParents] = useState([]);

  const [search, setSearch] = useState("");
  const [relationship, setRelationship] =
    useState("");
  const [status, setStatus] = useState("");
  const [registrationStatus, setRegistrationStatus] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  /**
   * Fetch parents
   */
  const fetchParents = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (relationship) {
        params.relationship = relationship;
      }

      if (status) {
        params.status = status;
      }

      if (registrationStatus) {
        params.registration_status =
          registrationStatus;
      }

      const response = await api.get(
        "/parents",
        {
          params,
        }
      );

      setParents(
        response.data?.data || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch parents:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load parents."
      );
    } finally {
      setLoading(false);
    }
  };


  /**
   * Initial load
   */
  useEffect(() => {
    fetchParents();
  }, []);


  /**
   * Search / filter
   */
  const handleSearch = (e) => {
    e.preventDefault();

    fetchParents();
  };


  /**
   * Clear filters
   */
  const handleClearFilters = () => {
    setSearch("");
    setRelationship("");
    setStatus("");
    setRegistrationStatus("");

    setTimeout(() => {
      fetchParents();
    }, 0);
  };


  /**
   * Delete parent
   */
  const handleDelete = async (parent) => {
    if (
      parent.registration_status ===
      "registered"
    ) {
      setError(
        "Registered parents cannot be deleted."
      );

      return;
    }

    const fullName =
      `${parent.first_name || ""} ${
        parent.last_name || ""
      }`.trim();

    const confirmed = window.confirm(
      `Are you sure you want to delete ${fullName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(parent._id);
      setError("");
      setSuccess("");

      await api.delete(
        `/parents/${parent._id}`
      );

      setParents((prev) =>
        prev.filter(
          (item) =>
            item._id !== parent._id
        )
      );

      setSuccess(
        "Parent deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete parent error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete parent."
      );
    } finally {
      setDeletingId(null);
    }
  };


  /**
   * Parent full name
   */
  const getParentName = (parent) => {
    return (
      `${parent.first_name || ""} ${
        parent.last_name || ""
      }`.trim() || "Unnamed Parent"
    );
  };


  /**
   * Relationship label
   */
  const getRelationshipLabel = (
    relationship
  ) => {
    if (!relationship) {
      return "-";
    }

    return (
      relationship.charAt(0).toUpperCase() +
      relationship.slice(1)
    );
  };


  /**
   * Status badge
   */
  const getStatusBadge = (value) => {
    if (value === "active") {
      return (
        <span className="badge badge-success badge-sm">
          Active
        </span>
      );
    }

    if (value === "inactive") {
      return (
        <span className="badge badge-error badge-sm">
          Inactive
        </span>
      );
    }

    return (
      <span className="badge badge-ghost badge-sm">
        {value || "Unknown"}
      </span>
    );
  };


  /**
   * Registration badge
   */
  const getRegistrationBadge = (
    value
  ) => {
    if (value === "registered") {
      return (
        <span className="badge badge-success badge-sm">
          Registered
        </span>
      );
    }

    return (
      <span className="badge badge-warning badge-sm">
        Not Registered
      </span>
    );
  };


  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Parents
          </h1>

          <p className="text-base-content/60 mt-1">
            Manage parents and their associated
            students.
          </p>
        </div>

        <Link
          to="/parents/add"
          className="btn btn-primary"
        >
          + Add Parent
        </Link>
      </div>


      {/* Success */}
      {success && (
        <div className="alert alert-success mb-5">
          <span>{success}</span>

          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={() => setSuccess("")}
          >
            ✕
          </button>
        </div>
      )}


      {/* Error */}
      {error && (
        <div className="alert alert-error mb-5">
          <span>{error}</span>

          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={() => setError("")}
          >
            ✕
          </button>
        </div>
      )}


      {/* Filters */}
      <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
        <div className="card-body">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="label">
                <span className="label-text">
                  Search Parent
                </span>
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Name, phone or email"
                className="input input-bordered w-full"
              />
            </div>


            {/* Relationship */}
            <div>
              <label className="label">
                <span className="label-text">
                  Relationship
                </span>
              </label>

              <select
                value={relationship}
                onChange={(e) =>
                  setRelationship(
                    e.target.value
                  )
                }
                className="select select-bordered w-full"
              >
                <option value="">
                  All
                </option>

                <option value="father">
                  Father
                </option>

                <option value="mother">
                  Mother
                </option>

                <option value="guardian">
                  Guardian
                </option>

                <option value="brother">
                  Brother
                </option>

                <option value="sister">
                  Sister
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>


            {/* Status */}
            <div>
              <label className="label">
                <span className="label-text">
                  Status
                </span>
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                className="select select-bordered w-full"
              >
                <option value="">
                  All
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>


            {/* Registration status */}
            <div>
              <label className="label">
                <span className="label-text">
                  Registration
                </span>
              </label>

              <select
                value={registrationStatus}
                onChange={(e) =>
                  setRegistrationStatus(
                    e.target.value
                  )
                }
                className="select select-bordered w-full"
              >
                <option value="">
                  All
                </option>

                <option value="registered">
                  Registered
                </option>

                <option value="not_registered">
                  Not Registered
                </option>
              </select>
            </div>


            {/* Buttons */}
            <div className="md:col-span-2 lg:col-span-5 flex flex-wrap gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                Search
              </button>

              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-outline"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>


      {/* Parent count */}
      <div className="mb-3">
        <span className="text-sm text-base-content/60">
          Total Parents:{" "}
          <strong>
            {parents.length}
          </strong>
        </span>
      </div>


      {/* Table */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Parent</th>
                  <th>Contact</th>
                  <th>Relationship</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Registration</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-10"
                    >
                      <span className="loading loading-spinner loading-md"></span>

                      <div className="mt-2 text-sm text-base-content/60">
                        Loading parents...
                      </div>
                    </td>
                  </tr>
                ) : parents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-10"
                    >
                      <div className="text-lg font-medium">
                        No parents found
                      </div>

                      <div className="text-sm text-base-content/60 mt-1">
                        Try changing your
                        search or filters.
                      </div>
                    </td>
                  </tr>
                ) : (
                  parents.map(
                    (parent, index) => (
                      <tr
                        key={parent._id}
                      >
                        {/* Number */}
                        <td>
                          {index + 1}
                        </td>


                        {/* Parent */}
                        <td>
                          <div className="font-semibold">
                            {getParentName(
                              parent
                            )}
                          </div>

                          {parent.occupation && (
                            <div className="text-xs text-base-content/60">
                              {
                                parent.occupation
                              }
                            </div>
                          )}
                        </td>


                        {/* Contact */}
                        <td>
                          <div>
                            {parent.phone ||
                              "-"}
                          </div>

                          {parent.email && (
                            <div className="text-xs text-base-content/60">
                              {
                                parent.email
                              }
                            </div>
                          )}
                        </td>


                        {/* Relationship */}
                        <td>
                          <span className="badge badge-outline">
                            {getRelationshipLabel(
                              parent.relationship
                            )}
                          </span>
                        </td>


                        {/* Students */}
                        <td>
                          {parent.students?.length >
                          0 ? (
                            <div className="space-y-1">
                              {parent.students
                                .slice(0, 3)
                                .map(
                                  (
                                    student
                                  ) => (
                                    <div
                                      key={
                                        student._id
                                      }
                                      className="text-sm"
                                    >
                                      <div className="font-medium">
                                        {student.first_name ||
                                          ""}{" "}
                                        {student.last_name ||
                                          ""}
                                      </div>

                                      <div className="text-xs text-base-content/60">
                                        {
                                          student.student_id
                                        }

                                        {student.class_name &&
                                          ` • ${student.class_name}`}

                                        {student.section_name &&
                                          ` • ${student.section_name}`}
                                      </div>
                                    </div>
                                  )
                                )}

                              {parent.students
                                .length >
                                3 && (
                                <div className="text-xs text-primary">
                                  +
                                  {parent.students
                                    .length -
                                    3}{" "}
                                  more
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-base-content/50">
                              No students
                            </span>
                          )}
                        </td>


                        {/* Status */}
                        <td>
                          {getStatusBadge(
                            parent.status
                          )}
                        </td>


                        {/* Registration */}
                        <td>
                          {getRegistrationBadge(
                            parent.registration_status
                          )}
                        </td>


                        {/* Actions */}
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-info btn-outline"
                              onClick={() =>
                                navigate(
                                  `/parents/${parent._id}`
                                )
                              }
                            >
                              View
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-warning btn-outline"
                              onClick={() =>
                                navigate(
                                  `/parents/${parent._id}/edit`
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-error btn-outline"
                              disabled={
                                deletingId ===
                                parent._id ||
                                parent.registration_status ===
                                  "registered"
                              }
                              onClick={() =>
                                handleDelete(
                                  parent
                                )
                              }
                            >
                              {deletingId ===
                              parent._id ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                "Delete"
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parents;