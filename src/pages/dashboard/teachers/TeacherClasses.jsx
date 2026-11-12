import { useEffect, useMemo, useState } from "react";
import {
  assignTeacherToSection,
  getClassesForAssignment,
  getTeachersForAssignment,
  removeTeacherFromSection,
} from "../../../services/teacherClassAssignmentService.js";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api.js";

const TeacherClasses = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [removingSectionId, setRemovingSectionId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * Load teachers and classes.
   */
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [teachersData, classesData] = await Promise.all([
        getTeachersForAssignment(),
        getClassesForAssignment(),
      ]);
      // console.log("TeachersData", teachersData)
      // console.log("ClassData",classesData);
      setTeachers(teachersData || []);
      setClasses(classesData || []);
    } catch (err) {
      console.error("Failed to load teacher assignment data:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load teacher assignment data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /*
   * Find selected class.
   */
  const selectedClass = useMemo(() => {
    if (!selectedClassId) {
      return null;
    }

    return classes.find(
      (item) => String(item._id) === String(selectedClassId)
    );
  }, [classes, selectedClassId]);

  /*
   * Sections belonging to selected class.
   */
  const sections = useMemo(() => {
    return selectedClass?.sections || [];
  }, [selectedClass]);

  /*
   * Find selected section.
   */
  const selectedSection = useMemo(() => {
    if (!selectedSectionId) {
      return null;
    }

    return sections.find(
      (item) => String(item._id) === String(selectedSectionId)
    );
  }, [sections, selectedSectionId]);

  /*
   * Handle class change.
   */
  const handleClassChange = (event) => {
    const classId = event.target.value;

    setSelectedClassId(classId);

    // Reset section when class changes.
    setSelectedSectionId("");

    setError("");
    setSuccess("");
  };

  /*
   * Handle teacher change.
   */
  const handleTeacherChange = (event) => {
    setSelectedTeacherId(event.target.value);

    setError("");
    setSuccess("");
  };

  /*
   * Handle section change.
   */
  const handleSectionChange = (event) => {
    setSelectedSectionId(event.target.value);

    setError("");
    setSuccess("");
  };

  /*
   * Assign teacher to selected section.
   */
  const handleAssign = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedTeacherId) {
      setError("Please select a teacher.");
      return;
    }

    if (!selectedClassId) {
      setError("Please select a class.");
      return;
    }

    if (!selectedSectionId) {
      setError("Please select a section.");
      return;
    }

    try {
      setAssigning(true);
      // console.log("TeacherId",selectedTeacherId);
      // console.log("section_id",selectedSectionId)
      const result = await assignTeacherToSection({
        teacher_id: selectedTeacherId,
        section_id: selectedSectionId,
      });

      setSuccess(
        result?.message ||
        "Teacher assigned to section successfully."
      );

      // Reload assignments.
      await loadData();

      // Keep teacher/class selected.
      // Reset only section so admin can choose another section.
      setSelectedSectionId("");
    } catch (err) {
      console.error("Failed to assign teacher:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to assign teacher."
      );
    } finally {
      setAssigning(false);
    }
  };

  /*
   * Remove teacher from section.
   */
  const handleRemove = async (sectionId, teacherName) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${teacherName} from this section?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingSectionId(sectionId);

      setError("");
      setSuccess("");

      const result = await removeTeacherFromSection(sectionId);

      setSuccess(
        result?.message ||
        "Teacher removed from section successfully."
      );

      await loadData();
    } catch (err) {
      console.error("Failed to remove teacher:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to remove teacher."
      );
    } finally {
      setRemovingSectionId("");
    }
  };

  /*
   * Build flat assignment list.
   */
  const assignments = useMemo(() => {
    const result = [];

    // console.log("Classes", classes)

    classes.forEach((classItem) => {

      const classSections = classItem.sections || [];

      // console.log("ClassSections: ",classSections);

      classSections.forEach((section) => {
        if (section.teacher_id) {
          // console.log("section-teacher", section);
          
          // const response = await api.get(`/teachers/${section.teacher_id}`);

          result.push({
            ...section,
            // teacher_name: response.data.data.first_name,
            // teacher_id: response.data.data.teacher_id,
            class_id: classItem._id,
            class_name:
              section.class_name || classItem.name,
          });
        }
      });
    });

    return result;
  }, [classes]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const handleBack = () => {

    navigate("/dashboard");

  };
  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* <div>

          <button
            onClick={handleBack}
            className="text-sm font-medium text-base-content/50 hover:text-primary hover:cursor-pointer"
          >
            ← Dashboard
          </button>

        </div> */}
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-base-content md:text-3xl">
            Teacher Class Assignment
          </h1>

          <p className="mt-1 text-sm text-base-content/60">
            Assign teachers to classes and sections.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="alert alert-success">
            <span>{success}</span>
          </div>
        )}

        {/* Assignment Form */}
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title mb-4">
              Assign Teacher
            </h2>

            <form
              onSubmit={handleAssign}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Teacher */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Teacher
                    </span>
                  </label>

                  <select
                    className="select select-bordered w-full"
                    value={selectedTeacherId}
                    onChange={handleTeacherChange}
                  >
                    <option value="">
                      Select Teacher
                    </option>

                    {teachers.map((teacher) => (
                      <option
                        key={teacher._id}
                        value={teacher._id}
                      >
                        {teacher.first_name} {teacher.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Class
                    </span>
                  </label>

                  <select
                    className="select select-bordered w-full"
                    value={selectedClassId}
                    onChange={handleClassChange}
                  >
                    <option value="">
                      Select Class
                    </option>

                    {classes.map((classItem) => (
                      <option
                        key={classItem._id}
                        value={classItem._id}
                      >
                        {classItem.name}
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
                    className="select select-bordered w-full"
                    value={selectedSectionId}
                    onChange={handleSectionChange}
                    disabled={!selectedClassId}
                  >
                    <option value="">
                      {selectedClassId
                        ? "Select Section"
                        : "Select Class First"}
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
              </div>

              {/* Current Teacher Information */}
              {selectedSection && (
                <div className="rounded-lg border border-base-300 bg-base-200 p-4">
                  <div className="text-sm">
                    <span className="font-medium">
                      Current Teacher:
                    </span>{" "}
                    {selectedSection.teacher_name ||
                      selectedSection.teacher?.name ||
                      "Not Assigned"}
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={assigning}
                >
                  {assigning ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Assigning...
                    </>
                  ) : (
                    "Assign Teacher"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Current Assignments */}
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-0">
            <div className="border-b border-base-300 p-5">
              <h2 className="card-title">
                Current Assignments
              </h2>

              <p className="mt-1 text-sm text-base-content/60">
                Teachers currently assigned to sections.
              </p>
            </div>

            {assignments.length === 0 ? (
              <div className="p-8 text-center text-base-content/60">
                No teacher assignments found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Teacher</th>
                      <th>Class</th>
                      <th>Section</th>
                      <th className="text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {assignments.map((assignment) => (
                      <tr key={assignment._id}>
                        <td>
                          <div className="font-medium">
                            {assignment.teacher_name ||
                              assignment.teacher?.name ||
                              "Unknown Teacher"}
                          </div>
                        </td>

                        <td>
                          {assignment.class_name}
                        </td>

                        <td>
                          <span className="badge badge-outline">
                            Section {assignment.name}
                          </span>
                        </td>

                        <td className="text-right">
                          <button
                            type="button"
                            className="btn btn-sm btn-error btn-outline"
                            disabled={
                              removingSectionId ===
                              assignment._id
                            }
                            onClick={() =>
                              handleRemove(
                                assignment._id,
                                assignment.teacher_name ||
                                assignment.teacher?.name ||
                                "this teacher"
                              )
                            }
                          >
                            {removingSectionId ===
                              assignment._id ? (
                              <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Removing...
                              </>
                            ) : (
                              "Remove"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherClasses;