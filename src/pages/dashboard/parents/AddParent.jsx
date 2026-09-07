import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api.js";

const AddParent = () => {
  const navigate = useNavigate();

  // ---------------------------------------
  // Students
  // ---------------------------------------
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [loadingStudents, setLoadingStudents] = useState(true);

  // ---------------------------------------
  // Form
  // ---------------------------------------
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    occupation: "",
    relationship: "",
    address: "",
    student_ids: [],
    status: "active",
  });

  // ---------------------------------------
  // UI
  // ---------------------------------------
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------------------------------------
  // Fetch Students
  // ---------------------------------------
  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      setError("");

      const response = await api.get("/students");

      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch students:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load students."
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  // ---------------------------------------
  // Initial Load
  // ---------------------------------------
  useEffect(() => {
    fetchStudents();
  }, []);

  // ---------------------------------------
  // Handle Input
  // ---------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------------------------------
  // Filter Students
  // ---------------------------------------
  const filteredStudents = students.filter((student) => {
    const search = studentSearch.trim().toLowerCase();

    if (!search) {
      return true;
    }

    const fullName =
      `${student.first_name || ""} ${
        student.last_name || ""
      }`.toLowerCase();

    const studentId =
      student.student_id?.toLowerCase() || "";

    const className =
      student.class_name?.toLowerCase() || "";

    const sectionName =
      student.section_name?.toLowerCase() || "";

    const email =
      student.email?.toLowerCase() || "";

    return (
      fullName.includes(search) ||
      studentId.includes(search) ||
      className.includes(search) ||
      sectionName.includes(search) ||
      email.includes(search)
    );
  });

  // ---------------------------------------
  // Select Student
  // ---------------------------------------
  const handleSelectStudent = (student) => {
    const alreadySelected =
      formData.student_ids.includes(student._id);

    if (alreadySelected) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      student_ids: [
        ...prev.student_ids,
        student._id,
      ],
    }));

    setSelectedStudents((prev) => [
      ...prev,
      student,
    ]);
  };

  // ---------------------------------------
  // Remove Student
  // ---------------------------------------
  const handleRemoveStudent = (studentId) => {
    setFormData((prev) => ({
      ...prev,
      student_ids: prev.student_ids.filter(
        (id) => id !== studentId
      ),
    }));

    setSelectedStudents((prev) =>
      prev.filter(
        (student) => student._id !== studentId
      )
    );
  };

  // ---------------------------------------
  // Submit
  // ---------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.first_name.trim()) {
      setError("First name is required.");
      return;
    }

    if (!formData.last_name.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!formData.relationship) {
      setError("Relationship is required.");
      return;
    }

    if (formData.student_ids.length === 0) {
      setError(
        "Please select at least one student."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        first_name: formData.first_name.trim(),

        last_name: formData.last_name.trim(),

        email:
          formData.email.trim().toLowerCase(),

        phone: formData.phone.trim(),

        gender: formData.gender,

        occupation:
          formData.occupation.trim(),

        relationship:
          formData.relationship,

        address:
          formData.address.trim(),

        student_ids:
          formData.student_ids,

        status:
          formData.status,
      };
      console.log("Payload:", payload);
      const response = await api.post(
        "/parents",
        payload
      );

      if (response.data.success) {
        setSuccess(
          "Parent added successfully."
        );

        setTimeout(() => {
          navigate("/parents");
        }, 800);
      }
    } catch (error) {
      console.error(
        "Create parent error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to add parent."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------
  // Reset
  // ---------------------------------------
  const handleReset = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: "",
      occupation: "",
      relationship: "",
      address: "",
      student_ids: [],
      status: "active",
    });

    setStudentSearch("");
    setSelectedStudents([]);
    setError("");
    setSuccess("");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* ====================================
          Header
      ==================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            Add Parent
          </h1>

          <p className="text-sm text-base-content/60 mt-1">
            Add a parent or guardian and associate
            them with their student or students.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate("/parents")}
          disabled={saving}
        >
          Back
        </button>

      </div>


      {/* ====================================
          Messages
      ==================================== */}

      {error && (
        <div className="alert alert-error mb-6">

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

      {success && (
        <div className="alert alert-success mb-6">
          <span>{success}</span>
        </div>
      )}


      {/* ====================================
          Form
      ==================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* ==================================
            Personal Information
        ================================== */}

        <div className="card bg-base-100 shadow-sm border border-base-300">

          <div className="card-body">

            <h2 className="card-title mb-4">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* First Name */}
              <div>
                <label className="label">
                  <span className="label-text">
                    First Name *
                  </span>
                </label>

                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="input input-bordered w-full"
                  required
                />
              </div>


              {/* Last Name */}
              <div>
                <label className="label">
                  <span className="label-text">
                    Last Name *
                  </span>
                </label>

                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="input input-bordered w-full"
                  required
                />
              </div>


              {/* Email */}
              <div>
                <label className="label">
                  <span className="label-text">
                    Email
                  </span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="parent@example.com"
                  className="input input-bordered w-full"
                />
              </div>


              {/* Phone */}
              <div>
                <label className="label">
                  <span className="label-text">
                    Phone *
                  </span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  className="input input-bordered w-full"
                  required
                />
              </div>


              {/* Gender */}
              <div>
                <label className="label">
                  <span className="label-text">
                    Gender
                  </span>
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="male">
                    Male
                  </option>

                  <option value="female">
                    Female
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>


              {/* Occupation */}
              <div>
                <label className="label">
                  <span className="label-text">
                    Occupation
                  </span>
                </label>

                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Business, Teacher, Service..."
                  className="input input-bordered w-full"
                />
              </div>

            </div>

          </div>
        </div>


        {/* ==================================
            Relationship
        ================================== */}

        <div className="card bg-base-100 shadow-sm border border-base-300">

          <div className="card-body">

            <h2 className="card-title mb-4">
              Guardian Relationship
            </h2>

            <div className="max-w-md">

              <label className="label">
                <span className="label-text">
                  Relationship *
                </span>
              </label>

              <select
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">
                  Select Relationship
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

                <option value="grandfather">
                  Grandfather
                </option>

                <option value="grandmother">
                  Grandmother
                </option>

                <option value="other">
                  Other
                </option>
              </select>

            </div>

          </div>
        </div>


        {/* ==================================
            Associated Students
        ================================== */}

        <div className="card bg-base-100 shadow-sm border border-base-300">

          <div className="card-body">

            <h2 className="card-title">
              Associated Students
            </h2>

            <p className="text-sm text-base-content/60 mb-4">
              Search and select the student or
              students belonging to this parent.
            </p>


            {/* Search */}
            <div className="relative">

              <input
                type="text"
                value={studentSearch}
                onChange={(e) =>
                  setStudentSearch(
                    e.target.value
                  )
                }
                placeholder="Search by student name, ID, class, section or email..."
                className="input input-bordered w-full"
              />

            </div>


            {/* Search Results */}
            <div className="border border-base-300 rounded-lg mt-3 max-h-72 overflow-y-auto">

              {loadingStudents ? (

                <div className="p-8 text-center">

                  <span className="loading loading-spinner loading-md"></span>

                  <p className="text-sm text-base-content/60 mt-2">
                    Loading students...
                  </p>

                </div>

              ) : students.length === 0 ? (

                <div className="p-8 text-center">

                  <p className="text-sm text-base-content/60">
                    No students available.
                  </p>

                  <button
                    type="button"
                    className="btn btn-sm btn-primary mt-3"
                    onClick={() =>
                      navigate("/students/add")
                    }
                  >
                    Add Student
                  </button>

                </div>

              ) : filteredStudents.length === 0 ? (

                <div className="p-8 text-center">

                  <p className="text-sm text-base-content/60">
                    No students found for "
                    {studentSearch}".
                  </p>

                </div>

              ) : (

                filteredStudents.map((student) => {

                  const isSelected =
                    formData.student_ids.includes(
                      student._id
                    );

                  return (
                    <button
                      key={student._id}
                      type="button"
                      disabled={isSelected}
                      onClick={() =>
                        handleSelectStudent(
                          student
                        )
                      }
                      className={`w-full text-left p-4 border-b border-base-300 last:border-b-0 transition ${
                        isSelected
                          ? "bg-base-200 opacity-60 cursor-not-allowed"
                          : "hover:bg-base-200"
                      }`}
                    >

                      <div className="flex items-center justify-between gap-4">

                        <div className="min-w-0">

                          <div className="font-semibold">
                            {student.first_name}{" "}
                            {student.last_name}
                          </div>

                          <div className="text-xs text-base-content/60 mt-1">
                            Student ID:{" "}
                            {student.student_id}
                          </div>

                          <div className="text-xs text-base-content/60 mt-1">
                            {student.class_name ||
                              "-"}
                            {student.section_name
                              ? ` • Section ${student.section_name}`
                              : ""}
                          </div>

                        </div>

                        <div className="shrink-0">

                          {isSelected ? (
                            <span className="badge badge-success">
                              Selected
                            </span>
                          ) : (
                            <span className="badge badge-outline">
                              Select
                            </span>
                          )}

                        </div>

                      </div>

                    </button>
                  );
                })
              )}

            </div>


            {/* Selected Students */}
            {selectedStudents.length > 0 && (
              <div className="mt-6">

                <div className="flex items-center justify-between mb-3">

                  <h3 className="font-semibold">
                    Selected Students
                  </h3>

                  <span className="badge badge-primary">
                    {selectedStudents.length}
                  </span>

                </div>


                <div className="space-y-2">

                  {selectedStudents.map(
                    (student) => (
                      <div
                        key={student._id}
                        className="flex items-center justify-between gap-4 p-4 rounded-lg border border-base-300 bg-base-200"
                      >

                        <div className="min-w-0">

                          <div className="font-medium">
                            {student.first_name}{" "}
                            {student.last_name}
                          </div>

                          <div className="text-xs text-base-content/60 mt-1">
                            ID:{" "}
                            {student.student_id}
                            {" • "}
                            {student.class_name ||
                              "-"}

                            {student.section_name
                              ? ` • ${student.section_name}`
                              : ""}
                          </div>

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveStudent(
                              student._id
                            )
                          }
                          className="btn btn-sm btn-error btn-outline shrink-0"
                        >
                          Remove
                        </button>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}


            {selectedStudents.length === 0 && (
              <p className="text-xs text-base-content/50 mt-3">
                No students selected yet.
              </p>
            )}

          </div>
        </div>


        {/* ==================================
            Address
        ================================== */}

        <div className="card bg-base-100 shadow-sm border border-base-300">

          <div className="card-body">

            <h2 className="card-title mb-4">
              Address
            </h2>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter parent's address"
              className="textarea textarea-bordered w-full"
              rows="4"
            />

          </div>
        </div>


        {/* ==================================
            Status
        ================================== */}

        <div className="card bg-base-100 shadow-sm border border-base-300">

          <div className="card-body">

            <h2 className="card-title mb-4">
              Account Status
            </h2>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select select-bordered w-full max-w-md"
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


        {/* ==================================
            Buttons
        ================================== */}

        <div className="flex justify-end gap-3">

          <button
            type="button"
            className="btn btn-outline"
            onClick={handleReset}
            disabled={saving}
          >
            Reset
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/parents")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              saving ||
              loadingStudents ||
              selectedStudents.length === 0
            }
          >
            {saving ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              "Add Parent"
            )}
          </button>

        </div>

      </form>
    </div>
  );
};

export default AddParent;