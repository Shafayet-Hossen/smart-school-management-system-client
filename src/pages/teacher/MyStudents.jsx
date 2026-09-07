import { useEffect, useState } from "react";
import api from "../../services/api.js";

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * Fetch teacher's students
   */
  const fetchStudents = async () => {
    try {
      setFilterLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (selectedClass) {
        params.class_id = selectedClass;
      }

      if (selectedSection) {
        params.section_id = selectedSection;
      }

      const response = await api.get("/teachers/students", {
        params,
      });
      console.log("Teacher students response:", response.data.data);
      if (response.data.success) {
        setStudents(response.data.data || []);
        setTotal(response.data.total || 0);
      } else {
        setError(
          response.data.message ||
            "Failed to load students."
        );
      }
    } catch (err) {
      console.error(
        "Failed to load teacher students:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load students."
      );
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  /*
   * Initial student loading
   */
  useEffect(() => {
    fetchStudents();
  }, []);

  /*
   * Fetch teacher classes for filtering.
   *
   * We use the same endpoint that powers /my-classes.
   */
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get(
          "/teachers/classes"
        );

        if (response.data.success) {
          setClasses(response.data.data || []);
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
   * Update sections when class changes.
   */
  useEffect(() => {
    if (!selectedClass) {
      setSections([]);
      setSelectedSection("");
      return;
    }

    const selected = classes.find(
      (item) => item._id === selectedClass
    );

    setSections(selected?.sections || []);
    setSelectedSection("");
  }, [selectedClass, classes]);

  /*
   * Search with Enter.
   */
  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchStudents();
    }
  };

  /*
   * Clear all filters.
   */
  const clearFilters = () => {
    setSearch("");
    setSelectedClass("");
    setSelectedSection("");

    setTimeout(() => {
      fetchStudents();
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          My Students
        </h1>

        <p className="mt-1 text-base-content/60">
          View and manage students from your assigned
          classes.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">
            Total Students
          </div>

          <div className="stat-value text-primary">
            {total}
          </div>

          <div className="stat-desc">
            Students in your assigned sections
          </div>
        </div>

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">
            Classes
          </div>

          <div className="stat-value">
            {classes.length}
          </div>

          <div className="stat-desc">
            Assigned classes
          </div>
        </div>

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">
            Sections
          </div>

          <div className="stat-value">
            {classes.reduce(
              (count, item) =>
                count + (item.sections?.length || 0),
              0
            )}
          </div>

          <div className="stat-desc">
            Assigned sections
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div>
            <label className="label">
              <span className="label-text">
                Search Student
              </span>
            </label>

            <input
              type="text"
              placeholder="Name, ID or email"
              className="input input-bordered w-full"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              onKeyDown={handleSearchKeyDown}
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
                setSelectedClass(event.target.value)
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
                setSelectedSection(event.target.value)
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

          {/* Buttons */}
          <div className="flex items-end gap-2">
            <button
              type="button"
              className="btn btn-primary flex-1"
              onClick={fetchStudents}
              disabled={filterLoading}
            >
              {filterLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Search"
              )}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100 shadow-sm">
        {students.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-5xl">
              👨‍🎓
            </div>

            <h2 className="text-xl font-semibold">
              No Students Found
            </h2>

            <p className="mt-2 text-base-content/60">
              There are no students matching your current
              filters.
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Class</th>
                <th>Section</th>
                <th>Roll</th>
                <th>Guardian</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.student_id}>
                  {/* Student */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="w-10 rounded-full bg-primary text-primary-content">
                          <span>
                            {student.first_name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold">
                          {student.first_name}{" "}
                          {student.last_name}
                        </div>

                        <div className="text-sm text-base-content/60">
                          {student.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Student ID */}
                  <td>
                    <span className="font-medium">
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

                  {/* Guardian */}
                  <td>
                    <div>
                      <div className="font-medium">
                        {student.guardian_name || "-"}
                      </div>

                      {student.guardian_phone && (
                        <div className="text-sm text-base-content/60">
                          {student.guardian_phone}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className="badge badge-success">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Result count */}
      {students.length > 0 && (
        <div className="mt-4 text-sm text-base-content/60">
          Showing {students.length} of {total} students
        </div>
      )}
    </div>
  );
};

export default MyStudents;