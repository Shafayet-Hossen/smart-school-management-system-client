import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api.js";

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const MarkAttendance = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState(getToday());
  const [classCode, setClassCode] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);

  const [attendance, setAttendance] = useState({});

  const [search, setSearch] = useState("");

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================================================
  // Fetch classes
  // ==================================================

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        setError("");

        const response = await api.get("/classes");

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to load classes"
          );
        }

        setClasses(response.data.data || []);
      } catch (err) {
        console.error("Fetch classes error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load classes."
        );
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  // ==================================================
  // Fetch sections
  // ==================================================

  useEffect(() => {
    const fetchSections = async () => {
      if (!classCode) {
        setSections([]);
        setSectionId("");
        setStudents([]);
        setAttendance({});
        return;
      }

      try {
        setLoadingSections(true);
        setError("");
        setSections([]);
        setSectionId("");
        setStudents([]);
        setAttendance({});

        const response = await api.get(
          `/sections/classes/${classCode}`
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message ||
              "Failed to load sections"
          );
        }

        setSections(response.data.data || []);
      } catch (err) {
        console.error("Fetch sections error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load sections."
        );
      } finally {
        setLoadingSections(false);
      }
    };

    fetchSections();
  }, [classCode]);

  // ==================================================
  // Fetch students
  // ==================================================

  useEffect(() => {
    const fetchStudents = async () => {
      if (!classCode || !sectionId || !date) {
        setStudents([]);
        setAttendance({});
        return;
      }

      try {
        setLoadingStudents(true);
        setError("");
        setSuccess("");

        const response = await api.get("/students", {
          params: {
            class_code: classCode,
            section_id: sectionId,
          },
        });

        if (!response.data.success) {
          throw new Error(
            response.data.message ||
              "Failed to load students"
          );
        }

        const studentList = response.data.data || [];

        setStudents(studentList);

        // Default all students to present
        const initialAttendance = {};

        studentList.forEach((student) => {
          initialAttendance[student._id.toString()] =
            "present";
        });

        setAttendance(initialAttendance);
      } catch (err) {
        console.error("Fetch students error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load students."
        );
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [classCode, sectionId, date]);

  // ==================================================
  // Filter students
  // ==================================================

  const filteredStudents = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return students;
    }

    return students.filter((student) => {
      const fullName =
        `${student.first_name || ""} ${
          student.last_name || ""
        }`.toLowerCase();

      const studentId = (
        student.student_id || ""
      ).toLowerCase();

      const rollNumber = (
        student.roll_number || ""
      ).toLowerCase();

      return (
        fullName.includes(value) ||
        studentId.includes(value) ||
        rollNumber.includes(value)
      );
    });
  }, [students, search]);

  // ==================================================
  // Change attendance
  // ==================================================

  const handleAttendanceChange = (
    studentId,
    status
  ) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // ==================================================
  // Mark all
  // ==================================================

  const markAll = (status) => {
    const updated = {};

    students.forEach((student) => {
      updated[student._id.toString()] = status;
    });

    setAttendance(updated);
  };

  // ==================================================
  // Statistics
  // ==================================================

  const statistics = useMemo(() => {
    const values = Object.values(attendance);

    return {
      total: students.length,

      present: values.filter(
        (status) => status === "present"
      ).length,

      absent: values.filter(
        (status) => status === "absent"
      ).length,

      late: values.filter(
        (status) => status === "late"
      ).length,

      leave: values.filter(
        (status) => status === "leave"
      ).length,
    };
  }, [students, attendance]);

  // ==================================================
  // Submit
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!date) {
        setError("Please select a date.");
        return;
      }

      if (!classCode) {
        setError("Please select a class.");
        return;
      }

      if (!sectionId) {
        setError("Please select a section.");
        return;
      }

      if (students.length === 0) {
        setError("No students found.");
        return;
      }


      const records = students.map((student) => ({
        student_id: student._id,
        status:
          attendance[student._id.toString()] ||
          "present",
      }));

      // console.log("Attendance records to submit:", records);

      const response = await api.post(
        "/school-admin/attendance/mark",
        {
          date,
          class_code: classCode,
          section_id: sectionId,
          records,
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Failed to save attendance"
        );
      }

      setSuccess(
        response.data.message ||
          "Attendance marked successfully."
      );
    } catch (err) {
      console.error("Mark attendance error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save attendance."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // Loading
  // ==================================================

  if (loadingClasses) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">

        {/* ============================================
            HEADER
        ============================================ */}

        <div className="mb-6">
          

          <h1 className="mt-2 text-2xl font-bold">
            Mark Attendance
          </h1>

          <p className="mt-1 text-sm text-base-content/60">
            Record daily attendance for students.
          </p>
        </div>

        {/* ============================================
            ALERTS
        ============================================ */}

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

        {/* ============================================
            FILTERS
        ============================================ */}

        <div className="mb-6 rounded-xl bg-base-100 p-6 shadow">

          <h2 className="mb-4 text-lg font-semibold">
            Attendance Details
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* Date */}

            <div>
              <label className="label">
                <span className="label-text">
                  Date *
                </span>
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="input input-bordered w-full"
              />
            </div>

            {/* Class */}

            <div>
              <label className="label">
                <span className="label-text">
                  Class *
                </span>
              </label>

              <select
                value={classCode}
                onChange={(e) =>
                  setClassCode(e.target.value)
                }
                className="select select-bordered w-full"
              >
                <option value="">
                  Select class
                </option>

                {classes.map((item) => (
                  <option
                    key={item.class_code}
                    value={item.class_code}
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
                  Section *
                </span>
              </label>

              <select
                value={sectionId}
                onChange={(e) =>
                  setSectionId(e.target.value)
                }
                disabled={
                  !classCode || loadingSections
                }
                className="select select-bordered w-full"
              >
                <option value="">
                  {loadingSections
                    ? "Loading sections..."
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
        </div>

        {/* ============================================
            STUDENTS
        ============================================ */}

        {classCode && sectionId && (
          <div className="rounded-xl bg-base-100 shadow">

            {/* Header */}

            <div className="border-b border-base-300 p-6">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <h2 className="text-lg font-semibold">
                    Student Attendance
                  </h2>

                  <p className="mt-1 text-sm text-base-content/60">
                    {statistics.total} students
                  </p>
                </div>

                {/* Search */}

                <div className="w-full lg:w-80">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search student..."
                    className="input input-bordered w-full"
                  />
                </div>

              </div>

              {/* Statistics */}

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">

                <div className="rounded-lg bg-base-200 p-3">
                  <div className="text-xs text-base-content/60">
                    Total
                  </div>

                  <div className="text-xl font-bold">
                    {statistics.total}
                  </div>
                </div>

                <div className="rounded-lg bg-success/10 p-3">
                  <div className="text-xs text-base-content/60">
                    Present
                  </div>

                  <div className="text-xl font-bold text-success">
                    {statistics.present}
                  </div>
                </div>

                <div className="rounded-lg bg-error/10 p-3">
                  <div className="text-xs text-base-content/60">
                    Absent
                  </div>

                  <div className="text-xl font-bold text-error">
                    {statistics.absent}
                  </div>
                </div>

                <div className="rounded-lg bg-warning/10 p-3">
                  <div className="text-xs text-base-content/60">
                    Late
                  </div>

                  <div className="text-xl font-bold text-warning">
                    {statistics.late}
                  </div>
                </div>

                <div className="rounded-lg bg-info/10 p-3">
                  <div className="text-xs text-base-content/60">
                    Leave
                  </div>

                  <div className="text-xl font-bold text-info">
                    {statistics.leave}
                  </div>
                </div>

              </div>

              {/* Bulk buttons */}

              <div className="mt-5 flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={() =>
                    markAll("present")
                  }
                  className="btn btn-success btn-sm"
                  disabled={
                    students.length === 0
                  }
                >
                  Mark All Present
                </button>

                <button
                  type="button"
                  onClick={() =>
                    markAll("absent")
                  }
                  className="btn btn-error btn-sm"
                  disabled={
                    students.length === 0
                  }
                >
                  Mark All Absent
                </button>

                <button
                  type="button"
                  onClick={() =>
                    markAll("late")
                  }
                  className="btn btn-warning btn-sm"
                  disabled={
                    students.length === 0
                  }
                >
                  Mark All Late
                </button>

                <button
                  type="button"
                  onClick={() =>
                    markAll("leave")
                  }
                  className="btn btn-info btn-sm"
                  disabled={
                    students.length === 0
                  }
                >
                  Mark All Leave
                </button>

              </div>
            </div>

            {/* Loading */}

            {loadingStudents ? (
              <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-medium">
                  No students found
                </p>

                <p className="mt-1 text-sm text-base-content/60">
                  No students are available for the
                  selected class and section.
                </p>
              </div>
            ) : (
              <>
                {/* Table */}

                <div className="overflow-x-auto">

                  <table className="table">

                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Student ID</th>
                        <th>Roll</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredStudents.map(
                        (student, index) => {
                          const studentId =
                            student._id.toString();

                          const status =
                            attendance[
                              studentId
                            ] || "present";

                          return (
                            <tr
                              key={studentId}
                              className="hover"
                            >
                              <td>
                                {index + 1}
                              </td>

                              <td>
                                <div className="font-medium">
                                  {
                                    student.first_name
                                  }{" "}
                                  {
                                    student.last_name
                                  }
                                </div>

                                <div className="text-xs text-base-content/50">
                                  {
                                    student.email
                                  }
                                </div>
                              </td>

                              <td>
                                {student.student_id ||
                                  "N/A"}
                              </td>

                              <td>
                                {student.roll_number ||
                                  "N/A"}
                              </td>

                              <td>
                                <div className="flex flex-wrap gap-2">

                                  {[
                                    "present",
                                    "absent",
                                    "late",
                                    "leave",
                                  ].map(
                                    (option) => (
                                      <button
                                        key={option}
                                        type="button"
                                        onClick={() =>
                                          handleAttendanceChange(
                                            studentId,
                                            option
                                          )
                                        }
                                        className={`btn btn-xs ${
                                          status ===
                                          option
                                            ? option ===
                                              "present"
                                              ? "btn-success"
                                              : option ===
                                                "absent"
                                              ? "btn-error"
                                              : option ===
                                                "late"
                                              ? "btn-warning"
                                              : "btn-info"
                                            : "btn-outline"
                                        }`}
                                      >
                                        {option
                                          .charAt(
                                            0
                                          )
                                          .toUpperCase() +
                                          option.slice(
                                            1
                                          )}
                                      </button>
                                    )
                                  )}

                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>
                </div>

                {/* Footer */}

                <div className="flex flex-col-reverse justify-end gap-3 border-t border-base-300 p-6 sm:flex-row">

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/school-admin/attendance")
                    }
                    className="btn btn-outline"
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Saving...
                      </>
                    ) : (
                      "Save Attendance"
                    )}
                  </button>

                </div>
              </>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;