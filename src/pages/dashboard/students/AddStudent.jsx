import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api.js";

function AddStudent() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    // student_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    address: "",
    class_code: "",
    section_id: "",
    roll_number: "",
    guardian_name: "",
    guardian_phone: "",
    status: "active",
  });

  // ---------------------------------------
  // Load Classes
  // ---------------------------------------
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        setError("");

        const response = await api.get("/classes");
        // console.log("Classes response:", response.data.data);
        setClasses(response.data?.data || []);
      } catch (err) {
        console.error("Failed to load classes:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load classes. Please try again."
        );
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  // ---------------------------------------
  // Load Sections when Class changes
  // ---------------------------------------
  useEffect(() => {
    if (!formData.class_code) {
      setSections([]);
      return;
    }

    const fetchSections = async () => {
      try {
        setLoadingSections(true);
        setError("");

        const response = await api.get(
          `/sections/classes/${formData.class_code}`
        );

        setSections(response.data?.data || []);
        // console.log("Sections response:", response.data.data);
      } catch (err) {
        console.error("Failed to load sections:", err);

        setSections([]);

        setError(
          err.response?.data?.message ||
            "Failed to load sections. Please try again."
        );
      } finally {
        setLoadingSections(false);
      }
    };

    fetchSections();
  }, [formData.class_code]);

  // ---------------------------------------
  // Handle Input
  // ---------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  // ---------------------------------------
  // Handle Class Change
  // ---------------------------------------
  const handleClassChange = (event) => {
    const classId = event.target.value;

    setFormData((previous) => ({
      ...previous,
      class_code: classId,
      section_id: "",
    }));

    setSections([]);
    setError("");
  };

  // ---------------------------------------
  // Validation
  // ---------------------------------------
  const validateForm = () => {
    // if (!formData.student_id.trim()) {
    //   return "Student ID is required.";
    // }

    if (!formData.first_name.trim()) {
      return "First name is required.";
    }

    if (!formData.last_name.trim()) {
      return "Last name is required.";
    }

    if (!formData.class_code) {
      return "Please select a class.";
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  // ---------------------------------------
  // Submit
  // ---------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        // student_id: formData.student_id.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        // nid: formData.nid.trim(),
        address: formData.address.trim(),
        class_code: formData.class_code,
        section_id: formData.section_id || null,
        roll_number: formData.roll_number.trim(),
        guardian_name: formData.guardian_name.trim(),
        guardian_phone: formData.guardian_phone.trim(),
        status: formData.status,
      };
      // console.log("Submitting student data:", payload);
      const response = await api.post("/students", payload);

      if (response.data?.success) {
        setSuccess("Student added successfully.");

        setTimeout(() => {
          navigate("/school-admin/students");
        }, 1000);
      }
    } catch (err) {
      console.error("Add student error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to add student. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------
  // Reset
  // ---------------------------------------
  const handleReset = () => {
    setFormData({
      // student_id: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: "",
      date_of_birth: "",
    //   nid: "",
      address: "",
      class_code: "",
      section_id: "",
      roll_number: "",
      guardian_name: "",
      guardian_phone: "",
      status: "active",
    });

    setSections([]);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {/* <div className="breadcrumbs text-sm">
              <ul>
                <li>
                  <button onClick={() => navigate("/students")}>
                    Students
                  </button>
                </li>
                <li>Add Student</li>
              </ul>
            </div> */}

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Add Student
            </h1>

            <p className="mt-1 text-sm text-base-content/60">
              Add a student to your school and assign their academic
              information.
            </p>
          </div>

          {/* <button
            type="button"
            onClick={() => navigate("/students")}
            className="btn btn-outline"
          >
            ← Back to Students
          </button> */}
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="alert alert-success mb-6">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">

            {/* -------------------------------- */}
            {/* Basic Information */}
            {/* -------------------------------- */}
            <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold">
                  Basic Information
                </h2>

                <p className="text-sm text-base-content/50">
                  Enter the student's personal information.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {/* Student ID */}
                {/* <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Student ID *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    placeholder="STU-2026-001"
                    className="input input-bordered w-full"
                  />

                  <label className="label">
                    <span className="label-text-alt text-base-content/50">
                      This ID will be used during student registration.
                    </span>
                  </label>
                </div> */}

                {/* First Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      First Name *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Rahim"
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Last Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Last Name *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Ahmed"
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Email
                    </span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Phone */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Phone
                    </span>
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01712345678"
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Gender */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Gender
                    </span>
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Date of Birth
                    </span>
                  </label>

                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>

                {/* NID
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      NID
                    </span>
                  </label>

                  <input
                    type="text"
                    name="nid"
                    value={formData.nid}
                    onChange={handleChange}
                    placeholder="NID number"
                    className="input input-bordered w-full"
                  />
                </div> */}

                {/* Status */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Status
                    </span>
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Address */}
                <div className="form-control md:col-span-2 lg:col-span-3">
                  <label className="label">
                    <span className="label-text font-medium">
                      Address
                    </span>
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Student address"
                    rows="3"
                    className="textarea textarea-bordered w-full"
                  />
                </div>
              </div>
            </div>

            {/* -------------------------------- */}
            {/* Academic Information */}
            {/* -------------------------------- */}
            <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold">
                  Academic Information
                </h2>

                <p className="text-sm text-base-content/50">
                  Assign the student to a class and section.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">

                {/* Class */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Class *
                    </span>
                  </label>

                  <select
                    name="class_code"
                    value={formData.class_code}
                    onChange={handleClassChange}
                    className="select select-bordered w-full"
                    disabled={loadingClasses}
                  >
                    <option value="">
                      {loadingClasses
                        ? "Loading classes..."
                        : "Select class"}
                    </option>

                    {classes.map((item) => (
                      <option key={item.class_code} value={item.class_code}>
                        {item.name || item.class_name}
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
                    name="section_id"
                    value={formData.section_id}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    disabled={!formData.class_code || loadingSections}
                  >
                    <option value="">
                      {!formData.class_code
                        ? "Select class first"
                        : loadingSections
                        ? "Loading sections..."
                        : sections.length === 0
                        ? "No sections available"
                        : "Select section"}
                    </option>

                    {sections.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name || item.section_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Roll Number */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Roll Number
                    </span>
                  </label>

                  <input
                    type="text"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleChange}
                    placeholder="15"
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            </div>

            {/* -------------------------------- */}
            {/* Guardian Information */}
            {/* -------------------------------- */}
            <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold">
                  Guardian Information
                </h2>

                <p className="text-sm text-base-content/50">
                  Enter the student's parent or guardian information.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* Guardian Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Guardian Name
                    </span>
                  </label>

                  <input
                    type="text"
                    name="guardian_name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    placeholder="Karim Ahmed"
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Guardian Phone */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Guardian Phone
                    </span>
                  </label>

                  <input
                    type="tel"
                    name="guardian_phone"
                    value={formData.guardian_phone}
                    onChange={handleChange}
                    placeholder="01812345678"
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            </div>

            {/* -------------------------------- */}
            {/* Actions */}
            {/* -------------------------------- */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={handleReset}
                disabled={submitting}
                className="btn btn-outline"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => navigate("/school-admin/students")}
                disabled={submitting}
                className="btn btn-ghost"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Adding Student...
                  </>
                ) : (
                  "Add Student"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;