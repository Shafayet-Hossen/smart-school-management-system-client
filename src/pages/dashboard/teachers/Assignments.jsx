import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api.js";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] =
    useState("");
  const [selectedSection, setSelectedSection] =
    useState("");
  const [selectedStatus, setSelectedStatus] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] =
    useState(false);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch Assignments
  |--------------------------------------------------------------------------
  */

  const fetchAssignments = async (
    customFilters = null
  ) => {
    try {
      setFilterLoading(true);
      setError("");

      const filters = customFilters || {
        search,
        class_id: selectedClass,
        section_id: selectedSection,
        status: selectedStatus,
      };

      const params = {};

      if (filters.search?.trim()) {
        params.search = filters.search.trim();
      }

      if (filters.class_id) {
        params.class_id = filters.class_id;
      }

      if (filters.section_id) {
        params.section_id =
          filters.section_id;
      }

      if (filters.status) {
        params.status = filters.status;
      }

      const response = await api.get(
        "/teachers/assignments",
        {
          params,
        }
      );

      if (response.data.success) {
        setAssignments(
          response.data.data || []
        );
      } else {
        setError(
          response.data.message ||
            "Failed to load assignments."
        );
      }
    } catch (err) {
      console.error(
        "Failed to load assignments:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load assignments."
      );
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchAssignments();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load Teacher Classes
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get(
          "/teachers/classes"
        );

        if (response.data.success) {
          setClasses(
            response.data.data || []
          );
        }
      } catch (err) {
        console.error(
          "Failed to load teacher classes:",
          err
        );
      }
    };

    fetchClasses();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Update Sections
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!selectedClass) {
      setSections([]);
      setSelectedSection("");
      return;
    }

    const selected = classes.find(
      (item) =>
        item._id === selectedClass
    );

    setSections(
      selected?.sections || []
    );

    setSelectedSection("");
  }, [
    selectedClass,
    classes,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchAssignments();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Clear Filters
  |--------------------------------------------------------------------------
  */

  const handleClear = () => {
    setSearch("");
    setSelectedClass("");
    setSelectedSection("");
    setSelectedStatus("");

    fetchAssignments({
      search: "",
      class_id: "",
      section_id: "",
      status: "",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="p-6">

      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Assignments
          </h1>

          <p className="mt-1 text-base-content/60">
            Create and manage assignments for your
            classes.
          </p>
        </div>

        <Link
          to="/assignments/create"
          className="btn btn-primary"
        >
          + Create Assignment
        </Link>

      </div>

      {/* Error */}

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {/* Statistics */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">
            Total
          </div>

          <div className="stat-value text-primary">
            {assignments.length}
          </div>

          <div className="stat-desc">
            Current assignments
          </div>
        </div>

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">
            Published
          </div>

          <div className="stat-value">
            {
              assignments.filter(
                (item) =>
                  item.status ===
                  "published"
              ).length
            }
          </div>
        </div>

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">
            Draft
          </div>

          <div className="stat-value">
            {
              assignments.filter(
                (item) =>
                  item.status ===
                  "draft"
              ).length
            }
          </div>
        </div>

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">
            Closed
          </div>

          <div className="stat-value">
            {
              assignments.filter(
                (item) =>
                  item.status ===
                  "closed"
              ).length
            }
          </div>
        </div>

      </div>

      {/* Filters */}

      <div className="mb-6 rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">

          {/* Search */}

          <div>
            <label className="label">
              <span className="label-text">
                Search
              </span>
            </label>

            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Title or subject"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              onKeyDown={
                handleSearchKeyDown
              }
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
              className="select select-bordered w-full"
              value={selectedClass}
              onChange={(event) =>
                setSelectedClass(
                  event.target.value
                )
              }
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
              className="select select-bordered w-full"
              value={selectedSection}
              onChange={(event) =>
                setSelectedSection(
                  event.target.value
                )
              }
              disabled={!selectedClass}
            >
              <option value="">
                All Sections
              </option>

              {sections.map((section) => (
                <option
                  key={section._id}
                  value={section._id}
                >
                  Section {section.name}
                </option>
              ))}
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
              className="select select-bordered w-full"
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value
                )
              }
            >
              <option value="">
                All Status
              </option>

              <option value="draft">
                Draft
              </option>

              <option value="published">
                Published
              </option>

              <option value="closed">
                Closed
              </option>
            </select>
          </div>

          {/* Buttons */}

          <div className="flex items-end gap-2">

            <button
              type="button"
              className="btn btn-primary flex-1"
              onClick={() =>
                fetchAssignments()
              }
              disabled={filterLoading}
            >
              {filterLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Search"
              )}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleClear}
            >
              Clear
            </button>

          </div>

        </div>

      </div>

      {/* Assignment Table */}

      <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100 shadow-sm">

        {assignments.length === 0 ? (
          <div className="py-16 text-center">

            <div className="mb-4 text-5xl">
              📝
            </div>

            <h2 className="text-xl font-semibold">
              No Assignments Found
            </h2>

            <p className="mt-2 text-base-content/60">
              You haven't created any assignments
              matching the selected filters.
            </p>

            <Link
              to="/assignments/create"
              className="btn btn-primary mt-5"
            >
              Create Assignment
            </Link>

          </div>
        ) : (
          <table className="table">

            <thead>
              <tr>
                <th>Assignment</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Due Date</th>
                <th>Marks</th>
                <th>Submissions</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {assignments.map(
                (assignment) => (
                  <tr
                    key={
                      assignment._id
                    }
                  >

                    {/* Assignment */}

                    <td>
                      <div>
                        <div className="font-semibold">
                          {
                            assignment.title
                          }
                        </div>

                        <div className="text-sm text-base-content/60">
                          {assignment.section_name
                            ? `Section ${assignment.section_name}`
                            : ""}
                        </div>
                      </div>
                    </td>

                    {/* Class */}

                    <td>
                      {
                        assignment.class_name ||
                        "-"
                      }
                    </td>

                    {/* Subject */}

                    <td>
                      {
                        assignment.subject ||
                        "-"
                      }
                    </td>

                    {/* Due Date */}

                    <td>
                      {assignment.due_date
                        ? new Date(
                            assignment.due_date
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* Marks */}

                    <td>
                      {
                        assignment.total_marks ??
                        "-"
                      }
                    </td>

                    {/* Submissions */}

                    <td>
                      <div className="flex flex-col">

                        <span className="font-medium">
                          {
                            assignment.submitted
                          }
                          /
                          {
                            assignment.total_submissions
                          }
                        </span>

                        <span className="text-xs text-base-content/60">
                          {
                            assignment.graded
                          }{" "}
                          graded
                        </span>

                      </div>
                    </td>

                    {/* Status */}

                    <td>
                      {assignment.status ===
                        "published" && (
                        <span className="badge badge-success">
                          Published
                        </span>
                      )}

                      {assignment.status ===
                        "draft" && (
                        <span className="badge badge-warning">
                          Draft
                        </span>
                      )}

                      {assignment.status ===
                        "closed" && (
                        <span className="badge badge-neutral">
                          Closed
                        </span>
                      )}
                    </td>

                    {/* Action */}

                    <td>
                      <Link
                        to={`/assignments/${assignment._id}`}
                        className="btn btn-sm btn-primary"
                      >
                        View
                      </Link>
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
};

export default Assignments;