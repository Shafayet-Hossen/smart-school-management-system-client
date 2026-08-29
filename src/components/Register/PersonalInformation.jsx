import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../context/RegistrationContext";


function PersonalInformation() {
    const navigate = useNavigate();

    const { registrationData, updateRegistration } = useRegistration();

    const [formData, setFormData] = useState({
        first_name: registrationData.first_name || "",
        last_name: registrationData.last_name || "",
        email: registrationData.email || "",
        phone: registrationData.phone || "",
        date_of_birth: registrationData.date_of_birth || "",
        gender: registrationData.gender || "",
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

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.first_name.trim()) {
            setError("Please enter your first name.");
            return;
        }

        if (!formData.last_name.trim()) {
            setError("Please enter your last name.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!formData.phone.trim()) {
            setError("Please enter your phone number.");
            return;
        }

        if (!formData.gender) {
            setError("Please select your gender.");
            return;
        }

        updateRegistration({
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
            date_of_birth: formData.date_of_birth,
            gender: formData.gender,
            status: "information_completed",
        });

        // navigate(`/register/${registrationData.role}/school`);
        const roleRoutes = {
            school_admin: "/register/school_admin/school",
            teacher: "/register/teacher/school",
            student: "/register/student/school",
            parent: "/register/parent/school",
        };

        const nextRoute = roleRoutes[registrationData.role];

        if (!nextRoute) {
            setError("Invalid registration role. Please select your role again.");
            return;
        }

        navigate(nextRoute);
    };

    const handleBack = () => {
        navigate("/register/role");
    };

    const getRoleName = () => {
        switch (registrationData.role) {
            case "school_admin":
                return "School Admin";

            case "teacher":
                return "Teacher";

            case "student":
                return "Student";

            case "parent":
                return "Parent";

            default:
                return "User";
        }
    };

    if (!registrationData.role) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">

                <div className="rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-lg">
                    <h2 className="text-xl font-bold">
                        Registration session not found
                    </h2>

                    <p className="mt-2 text-sm text-base-content/60">
                        Please select your role before continuing.
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
            <div className="mx-auto max-w-4xl">

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
                        Tell us about yourself
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-base-content/60 sm:text-base">
                        You're registering as a{" "}
                        <span className="font-semibold text-primary">
                            {getRoleName()}
                        </span>
                        . Please provide your basic personal information.
                    </p>
                </div>

                {/* Progress */}
                <div className="mx-auto mt-10 max-w-lg">
                    <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 rounded-full bg-primary" />
                        <div className="h-2 flex-1 rounded-full bg-primary" />
                        <div className="h-2 flex-1 rounded-full bg-base-300" />
                        <div className="h-2 flex-1 rounded-full bg-base-300" />
                        <div className="h-2 flex-1 rounded-full bg-base-300" />
                    </div>

                    <p className="mt-3 text-center text-xs text-base-content/50">
                        Step 2 of 5
                    </p>
                </div>

                {/* Form */}
                <div className="mt-10 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xl sm:p-10">

                    <div className="mb-8">
                        <h2 className="text-xl font-bold">
                            Personal Information
                        </h2>

                        <p className="mt-2 text-sm text-base-content/60">
                            This information will be used to create and verify your account.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-xl border border-error/20 bg-error/10 p-4">
                            <p className="text-sm text-error">
                                {error}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* First + Last Name */}
                        <div className="grid gap-5 sm:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="first_name"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    First Name
                                    <span className="text-error"> *</span>
                                </label>

                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="Enter your first name"
                                    autoComplete="given-name"
                                    className="input input-bordered w-full rounded-xl"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Last Name
                                    <span className="text-error"> *</span>
                                </label>

                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    placeholder="Enter your last name"
                                    autoComplete="family-name"
                                    className="input input-bordered w-full rounded-xl"
                                />
                            </div>

                        </div>

                        {/* Email + Phone */}
                        <div className="grid gap-5 sm:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Email Address
                                    <span className="text-error"> *</span>
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="input input-bordered w-full rounded-xl"
                                />

                                <p className="mt-2 text-xs text-base-content/50">
                                    We'll use this email to verify your account.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Phone Number
                                    <span className="text-error"> *</span>
                                </label>

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="01XXXXXXXXX"
                                    autoComplete="tel"
                                    className="input input-bordered w-full rounded-xl"
                                />

                                <p className="mt-2 text-xs text-base-content/50">
                                    Enter a valid phone number.
                                </p>
                            </div>

                        </div>

                        {/* Date of Birth + Gender */}
                        <div className="grid gap-5 sm:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="date_of_birth"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Date of Birth
                                </label>

                                <input
                                    id="date_of_birth"
                                    name="date_of_birth"
                                    type="date"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    className="input input-bordered w-full rounded-xl"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="gender"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Gender
                                    <span className="text-error"> *</span>
                                </label>

                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="select select-bordered w-full rounded-xl"
                                >
                                    <option value="">
                                        Select gender
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

                        </div>

                        {/* Privacy Notice */}
                        <div className="rounded-2xl border border-base-300 bg-base-200/50 p-4">
                            <div className="flex gap-3">

                                <div className="mt-0.5 text-primary">
                                    🔒
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">
                                        Your information is protected
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-base-content/60">
                                        Your personal information will be securely stored and used
                                        only for account creation, verification and school
                                        management purposes.
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

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-base-content/40">
                    Smart School SaaS Platform
                </p>
            </div>
        </div>
    );
}

export default PersonalInformation;