import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api.js";

const EditStudent = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    nid: "",
    address: "",
    class_code: "",
    section_id: "",
    roll_number: "",
    guardian_name: "",
    guardian_phone: "",
    status: "active",
  });


  // ---------------------------------------
  // Fetch Classes
  // ---------------------------------------
  const fetchClasses = async () => {
    try {
      const response = await api.get("/classes");

      setClasses(response.data.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch classes:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load classes."
      );
    }
  };


  // ---------------------------------------
  // Fetch Sections
  // ---------------------------------------
  const fetchSections = async (selectedClassId) => {
    if (!selectedClassId) {
      setSections([]);
      return;
    }

    try {
      const response = await api.get(
        `/sections/classes/${selectedClassId}`
      );

      setSections(response.data.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch sections:",
        error
      );

      setSections([]);

      setError(
        error.response?.data?.message ||
          "Failed to load sections."
      );
    }
  };


  // ---------------------------------------
  // Fetch Student
  // ---------------------------------------
  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/students/${studentId}`
      );

      const student = response.data.data;

      setFormData({
        student_id: student.student_id || "",
        first_name: student.first_name || "",
        last_name: student.last_name || "",
        email: student.email || "",
        phone: student.phone || "",
        gender: student.gender || "",

        date_of_birth: student.date_of_birth
          ? new Date(student.date_of_birth)
              .toISOString()
              .split("T")[0]
          : "",

        nid: student.nid || "",
        address: student.address || "",

        class_id: student.class_id
          ? String(student.class_id)
          : "",

        section_id: student.section_id
          ? String(student.section_id)
          : "",

        roll_number: student.roll_number || "",

        guardian_name:
          student.guardian_name || "",

        guardian_phone:
          student.guardian_phone || "",

        status: student.status || "active",
      });

      // Load sections for selected class
      if (student.class_code) {
        await fetchSections(
          String(student.class_code)
        );
      }
    } catch (error) {
      console.error(
        "Failed to fetch student:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load student."
      );
    } finally {
      setLoading(false);
    }
  };


  // ---------------------------------------
  // Initial Load
  // ---------------------------------------
  useEffect(() => {
    const loadData = async () => {
      await fetchClasses();
      await fetchStudent();
    };

    loadData();
  }, [studentId]);


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
  // Class Change
  // ---------------------------------------
  const handleClassChange = async (e) => {
    const selectedClassId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      class_code: selectedClassId,
      section_id: "",
    }));

    await fetchSections(selectedClassId);
  };


  // ---------------------------------------
  // Submit
  // ---------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...formData,

        student_id: formData.student_id.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender.trim(),
        nid: formData.nid.trim(),
        address: formData.address.trim(),
        roll_number: formData.roll_number.trim(),
        guardian_name:
          formData.guardian_name.trim(),
        guardian_phone:
          formData.guardian_phone.trim(),
      };

      await api.put(
        `/students/${studentId}`,
        payload
      );

      setSuccess(
        "Student updated successfully."
      );

      setTimeout(() => {
        navigate("/students");
      }, 1000);
    } catch (error) {
      console.error(
        "Update student error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update student."
      );
    } finally {
      setSaving(false);
    }
  };


  // ---------------------------------------
  // Loading
  // ---------------------------------------
  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }


  // ---------------------------------------
  // UI
  // ---------------------------------------
  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            Edit Student
          </h1>

          <p className="text-sm text-base-content/60 mt-1">
            Update student information.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate("/students")}
        >
          Back
        </button>

      </div>


      {/* Success */}
      {success && (
        <div className="alert alert-success mb-4">
          {success}
        </div>
      )}


      {/* Error */}
      {error && (
        <div className="alert alert-error mb-4">
          {error}
        </div>
      )}


      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* Basic Information */}
        <div className="card bg-base-100 shadow-sm border border-base-300">

          <div className="card-body">

            <h2 className="card-title mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Student ID */}
              <div>
                <label className="label">
                  <span className="label-text">
                    Student ID *
                  </span>
                </label>

                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>


              {/* Roll */}
              <div>
                <label className="label">
                  <span className="label-text">
                    Roll Number
                  </span>
                </label>

                <input
                  type="text"
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>


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
                  className="input input-bordered w-full"
                />
              </div>


              {/* Phone */}
              <div>
                <label className="label">
                  <span className="label-text">
                    Phone
                  </span>
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full"
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


              {/* Date of Birth */}
              <div>
                <label className="label">
                  <span className="label-text">
                    Date of Birth
                  </span>
                </label>

                <input
                  type="date"
                  name="date_of_birth"
                  value={
                    formData.date_of_birth
                  }
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

            </div>

          </div>
        </div>


        {/* Academic Information */}
        <div className="card bg-base-100 shadow-sm border border-base-300">

          <div className="card-body">

            <h2 className="card-title mb-4">
              Academic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Class */}
              <div>
                <label className="label">
                  <span className="label-text">
                    Class *
                  </span>
                </label>

                <select
                  name="class_id"
                  value={formData.class_code}
                  onChange={handleClassChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">
                    Select Class
                  </option>

                  {classes.map((item) => (
                    <option
                      key={item._id}
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
                    Section
                  </span>
                </label>

                <select
                  name="section_id"
                  value={formData.section_id}
                  onChange={handleChange}
                  disabled={!formData.class_code}
                  className="select select-bordered w-full"
                >
                  <option value="">
                    Select Section
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
        </div>


        {/* Guardian Information */}
        <div className="card bg-base-100 shadow-sm border border-base-300">

          <div className="card-body">

            <h2 className="card-title mb-4">
              Guardian Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Guardian Name */}
              <div>
                <label className="label">
                  <span className="label-text">
                    Guardian Name
                  </span>
                </label>

                <input
                  type="text"
                  name="guardian_name"
                  value={
                    formData.guardian_name
                  }
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>


              {/* Guardian Phone */}
              <div>
                <label className="label">
                  <span className="label-text">
                    Guardian Phone
                  </span>
                </label>

                <input
                  type="text"
                  name="guardian_phone"
                  value={
                    formData.guardian_phone
                  }
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

            </div>

          </div>
        </div>


        {/* Address */}
        <div className="card bg-base-100 shadow-sm border border-base-300">

          <div className="card-body">

            <h2 className="card-title mb-4">
              Additional Information
            </h2>

            <div className="space-y-4">

              {/* NID */}
              <div>
                <label className="label">
                  <span className="label-text">
                    NID
                  </span>
                </label>

                <input
                  type="text"
                  name="nid"
                  value={formData.nid}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>


              {/* Address */}
              <div>
                <label className="label">
                  <span className="label-text">
                    Address
                  </span>
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full"
                  rows="3"
                />
              </div>

            </div>

          </div>
        </div>


        {/* Buttons */}
        <div className="flex justify-end gap-3">

          <button
            type="button"
            className="btn btn-outline"
            onClick={() =>
              navigate("/students")
            }
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
                Saving...
              </>
            ) : (
              "Update Student"
            )}
          </button>

        </div>

      </form>
    </div>
  );
};

export default EditStudent;