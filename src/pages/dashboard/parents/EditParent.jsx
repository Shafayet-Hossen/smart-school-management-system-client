import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api.js";

const EditParent = () => {
  const { parentId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    occupation: "",
    relationship: "",
    address: "",
    status: "active",
    student_ids: [],
  });

  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [studentError, setStudentError] = useState("");

  // --------------------------------------------------
  // Fetch parent
  // --------------------------------------------------
  useEffect(() => {
    const fetchParent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/parents/${parentId}`);

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to load parent"
          );
        }

        const parent = response.data.data;

        setFormData({
          first_name: parent.first_name || "",
          last_name: parent.last_name || "",
          email: parent.email || "",
          phone: parent.phone || "",
          gender: parent.gender || "",
          occupation: parent.occupation || "",
          relationship: parent.relationship || "",
          address: parent.address || "",
          status: parent.status || "active",
          student_ids: (parent.student_ids || []).map((id) =>
            id.toString()
          ),
        });
      } catch (err) {
        console.error("Failed to fetch parent:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load parent information."
        );
      } finally {
        setLoading(false);
      }
    };

    if (parentId) {
      fetchParent();
    }
  }, [parentId]);

  // --------------------------------------------------
  // Fetch students
  // --------------------------------------------------
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setStudentsLoading(true);
        setStudentError("");

        const response = await api.get("/students");

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to load students"
          );
        }

        setStudents(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch students:", err);

        setStudentError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load students."
        );
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // --------------------------------------------------
  // Parent input change
  // --------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Add / Remove student
  // --------------------------------------------------
  const handleStudentToggle = (studentId) => {
    setFormData((prev) => {
      const exists = prev.student_ids.includes(studentId);

      if (exists) {
        return {
          ...prev,
          student_ids: prev.student_ids.filter(
            (id) => id !== studentId
          ),
        };
      }

      return {
        ...prev,
        student_ids: [...prev.student_ids, studentId],
      };
    });
  };

  // --------------------------------------------------
  // Filter students
  // --------------------------------------------------
  const filteredStudents = useMemo(() => {
    const search = studentSearch.trim().toLowerCase();

    if (!search) {
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

      const email = (
        student.email || ""
      ).toLowerCase();

      const phone = (
        student.phone || ""
      ).toLowerCase();

      const className = (
        student.class_name || ""
      ).toLowerCase();

      const sectionName = (
        student.section_name || ""
      ).toLowerCase();

      return (
        fullName.includes(search) ||
        studentId.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        className.includes(search) ||
        sectionName.includes(search)
      );
    });
  }, [students, studentSearch]);

  // --------------------------------------------------
  // Selected students
  // --------------------------------------------------
  const selectedStudents = useMemo(() => {
    return students.filter((student) =>
      formData.student_ids.includes(
        student._id.toString()
      )
    );
  }, [students, formData.student_ids]);

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

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

      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        occupation: formData.occupation.trim(),
        relationship: formData.relationship,
        address: formData.address.trim(),
        status: formData.status,

        // Only student IDs.
        // school_id is NOT sent from frontend.
        student_ids: formData.student_ids,
      };

      const response = await api.put(
        `/parents/${parentId}`,
        payload
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Failed to update parent"
        );
      }

      navigate("/school-admin/parents");
    } catch (err) {
      console.error("Failed to update parent:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update parent."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl">

        {/* ==========================================
            HEADER
        ========================================== */}
        <div className="mb-6">
          {/* <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/parents")}
                  className="hover:text-primary"
                >
                  Parents
                </button>
              </li>

              <li>Edit Parent</li>
            </ul>
          </div> */}

          <h1 className="mt-2 text-2xl font-bold">
            Edit Parent
          </h1>

          <p className="mt-1 text-sm text-base-content/60">
            Update parent information and manage linked
            students.
          </p>
        </div>

        {/* ==========================================
            ERROR
        ========================================== */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* ==========================================
            FORM
        ========================================== */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ========================================
              PERSONAL INFORMATION
          ======================================== */}
          <div className="rounded-xl bg-base-100 p-6 shadow">

            <h2 className="mb-1 text-lg font-semibold">
              Personal Information
            </h2>

            <p className="mb-5 text-sm text-base-content/60">
              Basic information about the parent or guardian.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

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
                  required
                  className="input input-bordered w-full"
                  placeholder="Enter first name"
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
                  required
                  className="input input-bordered w-full"
                  placeholder="Enter last name"
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
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Relationship */}
              <div>
                <label className="label">
                  <span className="label-text">
                    Relationship
                  </span>
                </label>

                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="">
                    Select relationship
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
                  className="input input-bordered w-full"
                  placeholder="Business, Teacher, Service..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="label">
                  <span className="label-text">
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
            </div>
          </div>

          {/* ========================================
              CONTACT INFORMATION
          ======================================== */}
          <div className="rounded-xl bg-base-100 p-6 shadow">

            <h2 className="mb-1 text-lg font-semibold">
              Contact Information
            </h2>

            <p className="mb-5 text-sm text-base-content/60">
              Contact details for communication with the
              parent.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

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
                  className="input input-bordered w-full"
                  placeholder="parent@example.com"
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
                  required
                  className="input input-bordered w-full"
                  placeholder="017XXXXXXXX"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text">
                    Address
                  </span>
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="4"
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter address"
                />
              </div>
            </div>
          </div>

          {/* ========================================
              LINKED STUDENTS
          ======================================== */}
          <div className="rounded-xl bg-base-100 p-6 shadow">

            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">

              <div>
                <h2 className="text-lg font-semibold">
                  Linked Students
                </h2>

                <p className="mt-1 text-sm text-base-content/60">
                  Add or remove students associated with
                  this parent.
                </p>
              </div>

              <div className="badge badge-primary badge-lg">
                {formData.student_ids.length}{" "}
                {formData.student_ids.length === 1
                  ? "Student"
                  : "Students"}
              </div>
            </div>

            {/* Search */}
            <div className="mb-5">
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 opacity-60"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>

                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) =>
                    setStudentSearch(e.target.value)
                  }
                  placeholder="Search student by name, ID, class, section..."
                  className="grow"
                />
              </label>
            </div>

            {/* Student error */}
            {studentError && (
              <div className="alert alert-error mb-4">
                <span>{studentError}</span>
              </div>
            )}

            {/* Loading */}
            {studentsLoading ? (
              <div className="flex justify-center py-10">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="rounded-lg border border-dashed border-base-300 p-8 text-center">
                <p className="font-medium">
                  No students found
                </p>

                <p className="mt-1 text-sm text-base-content/60">
                  Try a different search term.
                </p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto rounded-lg border border-base-300">

                {filteredStudents.map((student) => {
                  const studentId =
                    student._id.toString();

                  const isSelected =
                    formData.student_ids.includes(
                      studentId
                    );

                  return (
                    <label
                      key={studentId}
                      className={`flex cursor-pointer items-start gap-4 border-b border-base-300 p-4 last:border-b-0 transition ${
                        isSelected
                          ? "bg-primary/10"
                          : "hover:bg-base-200"
                      }`}
                    >

                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary mt-1"
                        checked={isSelected}
                        onChange={() =>
                          handleStudentToggle(
                            studentId
                          )
                        }
                      />

                      {/* Student Information */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="font-semibold">
                            {student.first_name}{" "}
                            {student.last_name}
                          </span>

                          {isSelected && (
                            <span className="badge badge-primary badge-sm">
                              Linked
                            </span>
                          )}
                        </div>

                        <div className="mt-1 grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-base-content/60 md:grid-cols-2">

                          <span>
                            Student ID:{" "}
                            {student.student_id ||
                              "N/A"}
                          </span>

                          <span>
                            Roll:{" "}
                            {student.roll_number ||
                              "N/A"}
                          </span>

                          <span>
                            Class:{" "}
                            {student.class_name ||
                              "N/A"}
                          </span>

                          <span>
                            Section:{" "}
                            {student.section_name ||
                              "N/A"}
                          </span>

                        </div>
                      </div>

                      {/* Add / Remove text */}
                      <span
                        className={`text-sm font-medium ${
                          isSelected
                            ? "text-error"
                            : "text-primary"
                        }`}
                      >
                        {isSelected
                          ? "Remove"
                          : "Add"}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Selected student summary */}
            {selectedStudents.length > 0 && (
              <div className="mt-5">

                <h3 className="mb-3 text-sm font-semibold">
                  Currently Linked
                </h3>

                <div className="flex flex-wrap gap-2">

                  {selectedStudents.map((student) => (
                    <div
                      key={student._id.toString()}
                      className="badge badge-outline gap-2 py-4"
                    >
                      <span>
                        {student.first_name}{" "}
                        {student.last_name}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleStudentToggle(
                            student._id.toString()
                          )
                        }
                        className="text-error hover:font-bold"
                        title="Remove student"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                </div>
              </div>
            )}

          </div>

          {/* ========================================
              ACTIONS
          ======================================== */}
          <div className="rounded-xl bg-base-100 p-6 shadow">

            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">

              <button
                type="button"
                onClick={() => navigate("/school-admin/parents")}
                className="btn btn-outline"
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Updating...
                  </>
                ) : (
                  "Update Parent"
                )}
              </button>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditParent;