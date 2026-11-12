import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTeacherStudents } from "../../services/teacherStudentService.js";
import { useNavigate } from "react-router-dom";

const MyStudents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const navigate = useNavigate();
  // -----------------------------------------
  // Fetch teacher students
  // -----------------------------------------
  const {
    data: students = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["teacher-students"],
    queryFn: getTeacherStudents,
  });

  // console.log("Students: ", students)

  // -----------------------------------------
  // Get unique classes
  // -----------------------------------------
  const classes = useMemo(() => {
    const classMap = new Map();

    students.forEach((student) => {
      if (student.class_code) {
        classMap.set(
          student.class_code,
          student.class_name
        );
      }
    });

    return Array.from(classMap.entries()).map(
      ([id, name]) => ({
        id,
        name,
      })
    );
  }, [students]);

  // -----------------------------------------
  // Get sections based on selected class
  // -----------------------------------------
  const sections = useMemo(() => {
    const sectionMap = new Map();

    students
      .filter((student) => {
        if (!selectedClass) {
          return true;
        }

        return (
          String(student.class_code) ===
          String(selectedClass)
        );
      })
      .forEach((student) => {
        if (student.section_id) {
          sectionMap.set(
            student.section_id,
            student.section_name
          );
        }
      });

    return Array.from(sectionMap.entries()).map(
      ([id, name]) => ({
        id,
        name,
      })
    );
  }, [students, selectedClass]);

  // -----------------------------------------
  // Filter students
  // -----------------------------------------
  const filteredStudents = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    return students.filter((student) => {
      // Class filter
      if (
        selectedClass &&
        String(student.class_code) !==
        String(selectedClass)
      ) {
        return false;
      }

      // Section filter
      if (
        selectedSection &&
        String(student.section_id) !==
        String(selectedSection)
      ) {
        return false;
      }

      // Search
      if (search) {
        const fullName =
          `${student.first_name || ""} ${student.last_name || ""
            }`.toLowerCase();

        const studentId =
          String(student.student_id || "").toLowerCase();

        const rollNumber =
          String(student.roll_number || "").toLowerCase();

        const email =
          String(student.email || "").toLowerCase();

        const phone =
          String(student.phone || "").toLowerCase();

        const matchesSearch =
          fullName.includes(search) ||
          studentId.includes(search) ||
          rollNumber.includes(search) ||
          email.includes(search) ||
          phone.includes(search);

        if (!matchesSearch) {
          return false;
        }
      }

      return true;
    });
  }, [
    students,
    searchTerm,
    selectedClass,
    selectedSection,
  ]);

  // -----------------------------------------
  // Clear filters
  // -----------------------------------------
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedClass("");
    setSelectedSection("");
  };

  // -----------------------------------------
  // Class changed
  // -----------------------------------------
  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);

    // Reset section when class changes
    setSelectedSection("");
  };

  // -----------------------------------------
  // Loading
  // -----------------------------------------
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center min-h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // Error
  // -----------------------------------------
  if (isError) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>
            {error?.response?.data?.message ||
              "Failed to load students."}
          </span>
        </div>
      </div>
    );
  }

  const handleBack = () => {

    navigate("/dashboard");

  };

  return (
    <div className="p-6">
      <div>
        <button
          onClick={handleBack}
          className="text-sm font-medium text-base-content/50 hover:text-primary hover:cursor-pointer"
        >
          ← Dashboard
        </button>

      </div>
      {/* ===================================== */}
      {/* PAGE HEADER */}
      {/* ===================================== */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          My Students
        </h1>

        <p className="text-base-content/70 mt-1">
          View and manage students from your assigned
          classes and sections.
        </p>
      </div>

      {/* ===================================== */}
      {/* SUMMARY CARDS */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        {/* Total Students */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-base-content/60">
                  Total Students
                </p>

                <p className="text-3xl font-bold mt-1">
                  {students.length}
                </p>
              </div>

              <div className="text-4xl">
                🎓
              </div>

            </div>
          </div>
        </div>

        {/* Classes */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-base-content/60">
                  Classes
                </p>

                <p className="text-3xl font-bold mt-1">
                  {classes.length}
                </p>
              </div>

              <div className="text-4xl">
                🏫
              </div>

            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-base-content/60">
                  Sections
                </p>

                <p className="text-3xl font-bold mt-1">
                  {new Set(
                    students
                      .map(
                        (student) =>
                          student.section_id
                      )
                      .filter(Boolean)
                  ).size}
                </p>
              </div>

              <div className="text-4xl">
                📚
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* ===================================== */}
      {/* FILTERS */}
      {/* ===================================== */}

      <div className="card bg-base-100 shadow mb-6">

        <div className="card-body">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Search */}
            <div className="form-control md:col-span-2">

              <label className="label">
                <span className="label-text">
                  Search Students
                </span>
              </label>

              <input
                type="text"
                placeholder="Name, student ID, roll, email..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                className="input input-bordered w-full"
              />

            </div>

            {/* Class */}
            <div className="form-control">

              <label className="label">
                <span className="label-text">
                  Class
                </span>
              </label>

              <select
                value={selectedClass}
                onChange={handleClassChange}
                className="select select-bordered w-full"
              >
                <option value="">
                  All Classes
                </option>

                {classes.map((classItem) => (
                  <option
                    key={classItem.class_code}
                    value={classItem.class_code}
                  >
                    {classItem.name}
                  </option>
                ))}
              </select>

            </div>

            {/* Section */}
            <div className="form-control">

              <label className="label">
                <span className="label-text">
                  Section
                </span>
              </label>

              <select
                value={selectedSection}
                onChange={(event) =>
                  setSelectedSection(
                    event.target.value
                  )
                }
                className="select select-bordered w-full"
              >
                <option value="">
                  All Sections
                </option>

                {sections.map((section) => (
                  <option
                    key={section.id}
                    value={section.id}
                  >
                    {section.name}
                  </option>
                ))}
              </select>

            </div>

          </div>

          {/* Clear Filters */}
          {(searchTerm ||
            selectedClass ||
            selectedSection) && (
              <div className="flex justify-end mt-4">

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn btn-sm btn-ghost"
                >
                  Clear Filters
                </button>

              </div>
            )}

        </div>
      </div>

      {/* ===================================== */}
      {/* RESULT COUNT */}
      {/* ===================================== */}

      <div className="flex justify-between items-center mb-3">

        <h2 className="text-lg font-semibold">
          Students
        </h2>

        <span className="badge badge-primary">
          {filteredStudents.length} Students
        </span>

      </div>

      {/* ===================================== */}
      {/* EMPTY RESULT */}
      {/* ===================================== */}

      {filteredStudents.length === 0 ? (
        <div className="card bg-base-100 shadow">

          <div className="card-body items-center text-center">

            <div className="text-5xl mb-3">
              🎓
            </div>

            <h2 className="card-title">
              No Students Found
            </h2>

            <p className="text-base-content/70">
              No students match your current search or
              filter.
            </p>

            {(searchTerm ||
              selectedClass ||
              selectedSection) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn btn-primary btn-sm mt-3"
                >
                  Clear Filters
                </button>
              )}

          </div>
        </div>
      ) : (
        /* =================================== */
        /* STUDENT TABLE */
        /* =================================== */

        <div className="card bg-base-100 shadow">

          <div className="card-body p-0">

            <div className="overflow-x-auto">

              <table className="table table-zebra">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Student ID</th>
                    <th>Roll</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Gender</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredStudents.map(
                    (student, index) => (
                      <tr key={student._id}>

                        {/* Serial */}
                        <td>
                          {index + 1}
                        </td>

                        {/* Student */}
                        <td>
                          <div className="flex items-center gap-3">

                            <div className="avatar placeholder">
                              <div className="bg-neutral text-neutral-content rounded-full w-10">
                                <span>
                                  {student.first_name
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                    "S"}
                                </span>
                              </div>
                            </div>

                            <div>
                              <div className="font-semibold">
                                {
                                  student.first_name
                                }{" "}
                                {
                                  student.last_name
                                }
                              </div>

                              {student.email && (
                                <div className="text-xs text-base-content/60">
                                  {
                                    student.email
                                  }
                                </div>
                              )}
                            </div>

                          </div>
                        </td>

                        {/* Student ID */}
                        <td>
                          {student.student_id || "—"}
                        </td>

                        {/* Roll */}
                        <td>
                          {student.roll_number || "—"}
                        </td>

                        {/* Class */}
                        <td>
                          {student.class_name || "—"}
                        </td>

                        {/* Section */}
                        <td>
                          {student.section_name || "—"}
                        </td>

                        {/* Gender */}
                        <td>
                          {student.gender || "—"}
                        </td>

                        {/* Status */}
                        <td>
                          <span className="badge badge-success">
                            {student.status || "active"}
                          </span>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyStudents;