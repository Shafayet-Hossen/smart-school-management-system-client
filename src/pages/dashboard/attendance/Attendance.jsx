import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api.js";

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [attendance, setAttendance] =
    useState([]);

  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
  });

  const [date, setDate] = useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );

  const [classId, setClassId] =
    useState("");

  const [sectionId, setSectionId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [loadingSections, setLoadingSections] =
    useState(false);

  const [error, setError] =
    useState("");


  /**
   * Fetch classes
   */
  const fetchClasses = async () => {
    try {
      const response = await api.get(
        "/classes"
      );

      setClasses(
        response.data?.data || []
      );
    } catch (error) {
      console.error(
        "Failed to load classes:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load classes."
      );
    }
  };


  /**
   * Fetch sections
   */
  const fetchSections = async (
    selectedClassId
  ) => {
    if (!selectedClassId) {
      setSections([]);
      return;
    }

    try {
      setLoadingSections(true);

      const response = await api.get(
        `/sections/classes/${selectedClassId}`
      );

      setSections(
        response.data?.data || []
      );
    } catch (error) {
      console.error(
        "Failed to load sections:",
        error
      );

      setSections([]);

      setError(
        error.response?.data?.message ||
          "Failed to load sections."
      );
    } finally {
      setLoadingSections(false);
    }
  };


  /**
   * Fetch attendance
   */
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (date) {
        params.date = date;
      }

      if (classId) {
        params.class_id = classId;
      }

      if (sectionId) {
        params.section_id =
          sectionId;
      }

      const [
        attendanceResponse,
        summaryResponse,
      ] = await Promise.all([
        api.get("/attendance", {
          params,
        }),

        api.get(
          "/attendance/summary",
          {
            params,
          }
        ),
      ]);

      setAttendance(
        attendanceResponse.data?.data ||
          []
      );

      setSummary(
        summaryResponse.data?.data || {
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          leave: 0,
        }
      );
    } catch (error) {
      console.error(
        "Failed to fetch attendance:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load attendance."
      );
    } finally {
      setLoading(false);
    }
  };


  /**
   * Initial data
   */
  useEffect(() => {
    fetchClasses();
  }, []);


  /**
   * Fetch sections when class changes
   */
  useEffect(() => {
    if (!classId) {
      setSections([]);
      return;
    }

    fetchSections(classId);
  }, [classId]);


  /**
   * Initial attendance
   */
  useEffect(() => {
    fetchAttendance();
  }, []);


  /**
   * Class change
   */
  const handleClassChange = (e) => {
    const value = e.target.value;

    setClassId(value);
    setSectionId("");
  };


  /**
   * Search
   */
  const handleSearch = (e) => {
    e.preventDefault();

    fetchAttendance();
  };


  /**
   * Clear filters
   */
  const handleClear = () => {
    setDate(
      new Date()
        .toISOString()
        .split("T")[0]
    );

    setClassId("");
    setSectionId("");

    setTimeout(() => {
      fetchAttendance();
    }, 0);
  };


  /**
   * Status badge
   */
  const getStatusBadge = (
    status
  ) => {
    switch (status) {
      case "present":
        return (
          <span className="badge badge-success">
            Present
          </span>
        );

      case "absent":
        return (
          <span className="badge badge-error">
            Absent
          </span>
        );

      case "late":
        return (
          <span className="badge badge-warning">
            Late
          </span>
        );

      case "leave":
        return (
          <span className="badge badge-info">
            Leave
          </span>
        );

      default:
        return (
          <span className="badge badge-ghost">
            {status || "Unknown"}
          </span>
        );
    }
  };


  /**
   * Method badge
   */
  const getMethodBadge = (
    method
  ) => {
    if (
      method ===
      "face_recognition"
    ) {
      return (
        <span className="badge badge-primary badge-outline">
          Face Recognition
        </span>
      );
    }

    return (
      <span className="badge badge-outline">
        Manual
      </span>
    );
  };


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Attendance
          </h1>

          <p className="text-base-content/60 mt-1">
            Monitor and manage student
            attendance.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/attendance/mark"
            className="btn btn-primary"
          >
            + Mark Attendance
          </Link>

          <Link
            to="/attendance/face-recognition"
            className="btn btn-secondary"
          >
            Face Recognition
          </Link>
        </div>
      </div>


      {/* =====================================================
          ERROR
      ====================================================== */}
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>

          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={() =>
              setError("")
            }
          >
            ✕
          </button>
        </div>
      )}


      {/* =====================================================
          FILTERS
      ====================================================== */}
      <div className="card bg-base-100 border border-base-300 shadow-sm mb-6">
        <div className="card-body">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Date */}
            <div>
              <label className="label">
                <span className="label-text">
                  Date
                </span>
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(
                    e.target.value
                  )
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
                onChange={
                  handleClassChange
                }
                className="select select-bordered w-full"
              >
                <option value="">
                  All Classes
                </option>

                {classes.map(
                  (item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  )
                )}
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
                  setSectionId(
                    e.target.value
                  )
                }
                disabled={
                  !classId ||
                  loadingSections
                }
                className="select select-bordered w-full"
              >
                <option value="">
                  {loadingSections
                    ? "Loading..."
                    : "All Sections"}
                </option>

                {sections.map(
                  (section) => (
                    <option
                      key={
                        section._id
                      }
                      value={
                        section._id
                      }
                    >
                      {section.name}
                    </option>
                  )
                )}
              </select>
            </div>


            {/* Buttons */}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                Search
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>


      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

        {/* Total */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-5">
            <div className="text-sm text-base-content/60">
              Total
            </div>

            <div className="text-3xl font-bold">
              {summary.total || 0}
            </div>
          </div>
        </div>


        {/* Present */}
        <div className="card bg-base-100 border border-success/30 shadow-sm">
          <div className="card-body p-5">
            <div className="text-sm text-success">
              Present
            </div>

            <div className="text-3xl font-bold text-success">
              {summary.present || 0}
            </div>
          </div>
        </div>


        {/* Absent */}
        <div className="card bg-base-100 border border-error/30 shadow-sm">
          <div className="card-body p-5">
            <div className="text-sm text-error">
              Absent
            </div>

            <div className="text-3xl font-bold text-error">
              {summary.absent || 0}
            </div>
          </div>
        </div>


        {/* Late */}
        <div className="card bg-base-100 border border-warning/30 shadow-sm">
          <div className="card-body p-5">
            <div className="text-sm text-warning">
              Late
            </div>

            <div className="text-3xl font-bold text-warning">
              {summary.late || 0}
            </div>
          </div>
        </div>


        {/* Leave */}
        <div className="card bg-base-100 border border-info/30 shadow-sm">
          <div className="card-body p-5">
            <div className="text-sm text-info">
              Leave
            </div>

            <div className="text-3xl font-bold text-info">
              {summary.leave || 0}
            </div>
          </div>
        </div>

      </div>


      {/* =====================================================
          ATTENDANCE TABLE
      ====================================================== */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-0">

          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Attendance Records
                </h2>

                <p className="text-sm text-base-content/60 mt-1">
                  Attendance records for{" "}
                  {date}
                </p>
              </div>

              <div className="badge badge-primary">
                {attendance.length} Records
              </div>
            </div>
          </div>


          <div className="overflow-x-auto">
            <table className="table table-zebra">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Check In</th>
                </tr>
              </thead>


              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-12"
                    >
                      <span className="loading loading-spinner loading-lg"></span>

                      <p className="mt-3 text-base-content/60">
                        Loading attendance...
                      </p>
                    </td>
                  </tr>
                ) : attendance.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-12"
                    >
                      <div className="text-lg font-medium">
                        No attendance records
                      </div>

                      <p className="text-sm text-base-content/60 mt-1">
                        No attendance data was
                        found for the selected
                        filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  attendance.map(
                    (
                      record,
                      index
                    ) => (
                      <tr
                        key={
                          record._id
                        }
                      >
                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <div className="font-semibold">
                            {
                              record.student_name
                            }
                          </div>
                        </td>

                        <td>
                          <span className="font-mono text-sm">
                            {
                              record.student_code
                            }
                          </span>
                        </td>

                        <td>
                          {
                            record.class_name ||
                            "-"
                          }
                        </td>

                        <td>
                          {
                            record.section_name ||
                            "-"
                          }
                        </td>

                        <td>
                          {
                            record.date ||
                            "-"
                          }
                        </td>

                        <td>
                          {getStatusBadge(
                            record.status
                          )}
                        </td>

                        <td>
                          {getMethodBadge(
                            record.method
                          )}
                        </td>

                        <td>
                          {
                            record.check_in_time ||
                            "-"
                          }
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

export default Attendance;