import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useRegistration } from "../../contexts/RegistrationContext.jsx";
import { useRegistration } from "../../context/RegistrationContext";

const SCHOOL_TYPES = [
  {
    value: "school",
    label: "School",
  },
  {
    value: "school_and_college",
    label: "School & College",
  },
  {
    value: "college",
    label: "College",
  },
  {
    value: "madrasa",
    label: "Madrasa",
  },
  {
    value: "other",
    label: "Other",
  },
];

function SchoolAdminSchool() {
  const navigate = useNavigate();

  const {
    registrationData,
    updateRegistration,
  } = useRegistration();

  const [formData, setFormData] = useState({
    school_name: registrationData.school_name || "",
    school_type: registrationData.school_type || "",
    school_email: registrationData.school_email || "",
    school_phone: registrationData.school_phone || "",
    eiin: registrationData.eiin || "",
    division: registrationData.division || "",
    district: registrationData.district || "",
    upazila: registrationData.upazila || "",
    address: registrationData.address || "",
    website: registrationData.website || "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const validateForm = () => {
    if (!formData.school_name.trim()) {
      return "Please enter your school name.";
    }

    if (!formData.school_type) {
      return "Please select your school type.";
    }

    if (!formData.school_email.trim()) {
      return "Please enter your school email.";
    }

    if (!formData.school_phone.trim()) {
      return "Please enter your school phone number.";
    }

    if (!formData.division.trim()) {
      return "Please enter your division.";
    }

    if (!formData.district.trim()) {
      return "Please enter your district.";
    }

    if (!formData.upazila.trim()) {
      return "Please enter your Upazila/Thana.";
    }

    if (!formData.address.trim()) {
      return "Please enter your school address.";
    }

    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    updateRegistration({
      school_name: formData.school_name.trim(),
      school_type: formData.school_type,
      school_email: formData.school_email.trim().toLowerCase(),
      school_phone: formData.school_phone.trim(),
      eiin: formData.eiin.trim(),
      division: formData.division.trim(),
      district: formData.district.trim(),
      upazila: formData.upazila.trim(),
      address: formData.address.trim(),
      website: formData.website.trim(),

      status: "school_information_completed",
    });

    navigate("/register/school_admin/account");
  };

  const handleBack = () => {
    navigate("/register/school_admin");
  };

  if (registrationData.role !== "school_admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-lg">
          <h2 className="text-xl font-bold">
            Invalid registration flow
          </h2>

          <p className="mt-2 text-sm text-base-content/60">
            This page is only available for School Admin registration.
          </p>

          <button
            onClick={() => navigate("/register/role")}
            className="btn btn-primary mt-6 rounded-xl"
          >
            Select Role
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 px-4 py-10 sm:py-16">
      {/* <pre className="mt-8 rounded-xl bg-neutral p-4 text-xs text-neutral-content">
        {JSON.stringify(registrationData, null, 2)}
      </pre> */}
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="text-center">

          <button
            type="button"
            onClick={handleBack}
            className="mb-8 text-sm font-medium text-base-content/50 transition hover:text-primary"
          >
            ← Back
          </button>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-content shadow-lg">
            S
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tell us about your school
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-base-content/60 sm:text-base">
            You're creating a new school workspace as a{" "}
            <span className="font-semibold text-primary">
              School Admin
            </span>
            .
          </p>
        </div>

        {/* Progress */}
        <div className="mx-auto mt-10 max-w-lg">

          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-primary" />
            <div className="h-2 flex-1 rounded-full bg-primary" />
            <div className="h-2 flex-1 rounded-full bg-primary" />
            <div className="h-2 flex-1 rounded-full bg-base-300" />
            <div className="h-2 flex-1 rounded-full bg-base-300" />
          </div>

          <p className="mt-3 text-center text-xs text-base-content/50">
            Step 3 of 5
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-10 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xl sm:p-10">

          <div className="mb-8">
            <h2 className="text-xl font-bold">
              School Information
            </h2>

            <p className="mt-2 text-sm leading-6 text-base-content/60">
              Provide accurate information about your school. This
              information will be used to create your school's workspace.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-error/20 bg-error/10 p-4">
              <p className="text-sm text-error">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">

            {/* School Name */}
            <div>
              <label
                htmlFor="school_name"
                class_name="mb-2 block text-sm font-semibold"
              >
                School Name
                <span className="text-error"> *</span>
              </label>

              <input
                id="school_name"
                name="school_name"
                type="text"
                value={formData.school_name}
                onChange={handleChange}
                placeholder="Example: ABC High School"
                className="input input-bordered w-full rounded-xl"
              />
            </div>

            {/* School Type */}
            <div>
              <label
                htmlFor="school_type"
                className="mb-2 block text-sm font-semibold"
              >
                School Type
                <span className="text-error"> *</span>
              </label>

              <select
                id="school_type"
                name="school_type"
                value={formData.school_type}
                onChange={handleChange}
                className="select select-bordered w-full rounded-xl"
              >
                <option value="">
                  Select school type
                </option>

                {SCHOOL_TYPES.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Email + Phone */}
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label
                  htmlFor="school_email"
                  className="mb-2 block text-sm font-semibold"
                >
                  School Email
                  <span className="text-error"> *</span>
                </label>

                <input
                  id="school_email"
                  name="school_email"
                  type="email"
                  value={formData.school_email}
                  onChange={handleChange}
                  placeholder="school@example.com"
                  className="input input-bordered w-full rounded-xl"
                />
              </div>

              <div>
                <label
                  htmlFor="school_phone"
                  className="mb-2 block text-sm font-semibold"
                >
                  School Phone
                  <span className="text-error"> *</span>
                </label>

                <input
                  id="school_phone"
                  name="school_phone"
                  type="tel"
                  value={formData.school_phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  className="input input-bordered w-full rounded-xl"
                />
              </div>

            </div>

            {/* EIIN */}
            <div>
              <label
                htmlFor="eiin"
                className="mb-2 block text-sm font-semibold"
              >
                EIIN
                <span className="ml-2 text-xs font-normal text-base-content/40">
                  Optional
                </span>
              </label>

              <input
                id="eiin"
                name="eiin"
                type="text"
                value={formData.eiin}
                onChange={handleChange}
                placeholder="Enter EIIN if available"
                className="input input-bordered w-full rounded-xl"
              />

              <p className="mt-2 text-xs text-base-content/50">
                You can provide your school's EIIN now or add it later.
              </p>
            </div>

            {/* Location */}
            <div>
              <h3 className="mb-4 text-base font-bold">
                School Location
              </h3>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label
                    htmlFor="division"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Division
                    <span className="text-error"> *</span>
                  </label>

                  <input
                    id="division"
                    name="division"
                    type="text"
                    value={formData.division}
                    onChange={handleChange}
                    placeholder="Example: Dhaka"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>

                <div>
                  <label
                    htmlFor="district"
                    className="mb-2 block text-sm font-semibold"
                  >
                    District
                    <span className="text-error"> *</span>
                  </label>

                  <input
                    id="district"
                    name="district"
                    type="text"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Example: Dhaka"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>

                <div>
                  <label
                    htmlFor="upazila"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Upazila / Thana
                    <span className="text-error"> *</span>
                  </label>

                  <input
                    id="upazila"
                    name="upazila"
                    type="text"
                    value={formData.upazila}
                    onChange={handleChange}
                    placeholder="Example: Mirpur"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Full Address
                    <span className="text-error"> *</span>
                  </label>

                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="School address"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>

              </div>
            </div>

            {/* Website */}
            <div>
              <label
                htmlFor="website"
                className="mb-2 block text-sm font-semibold"
              >
                School Website
                <span className="ml-2 text-xs font-normal text-base-content/40">
                  Optional
                </span>
              </label>

              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="input input-bordered w-full rounded-xl"
              />
            </div>

            {/* Information Notice */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">

              <div className="flex gap-3">

                <div className="mt-0.5 text-xl">
                  🏫
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    You're creating a school workspace
                  </p>

                  <p className="mt-1 text-xs leading-5 text-base-content/60">
                    Your school will become a separate tenant in Smart
                    School. Students, teachers and parents will later
                    request access to this school.
                  </p>
                </div>

              </div>

            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">

              <button
                type="button"
                onClick={handleBack}
                className="btn btn-outline rounded-xl"
              >
                Back
              </button>

              <button
                type="submit"
                className="btn btn-primary rounded-xl px-8"
              >
                Continue
              </button>

            </div>

          </form>
        </div>

        <p className="mt-6 text-center text-xs text-base-content/40">
          Smart School SaaS Platform
        </p>

      </div>
    </div>
  );
}

export default SchoolAdminSchool;