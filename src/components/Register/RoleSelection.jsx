import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../context/RegistrationContext.jsx";
import { ROLE_ROUTES } from "../../utils/registrationRoles.jsx";

const roles = [
    {
        id: "school_admin",
        title: "School Admin",
        description:
            "Create and manage your school, staff, students, parents and academic activities.",
        icon: "🏫",
    },
    {
        id: "teacher",
        title: "Teacher",
        description:
            "Connect with your school and manage classes, students, attendance and academic activities.",
        icon: "👨‍🏫",
    },
    {
        id: "student",
        title: "Student",
        description:
            "Access your classes, attendance, assignments and academic information.",
        icon: "🎓",
    },
    {
        id: "parent",
        title: "Parent",
        description:
            "Connect with your child's school and monitor academic progress, attendance and activities.",
        icon: "👨‍👩‍👧",
    },
];

function RoleSelection() {
    const navigate = useNavigate();
    const {
        registrationData,
        updateField,
    } = useRegistration();
    //   const [selectedRole, setSelectedRole] = useState("");
    console.log("registrationData", registrationData);
    // console.log("UpdateField",updateField);

    const selectedRole = registrationData.role;
    console.log("SelectedRole", selectedRole)

    const handleContinue = () => {
        if (!selectedRole) return;

        const route = ROLE_ROUTES[selectedRole];

        if (!route) {
            console.error("Invalid registration role:", selectedRole);
            return;
        }

        navigate(route);
    };

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10 sm:py-16">
            <pre className="mt-8 rounded-xl bg-neutral p-4 text-xs text-neutral-content">
                {JSON.stringify(registrationData, null, 2)}
            </pre>

            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="text-center">

                    <button
                        onClick={() => navigate("/register")}
                        className="mb-8 text-sm font-medium text-base-content/50 transition hover:text-primary"
                    >
                        ← Back
                    </button>

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-content shadow-lg">
                        S
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Who are you?
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-base-content/60 sm:text-base">
                        Tell us how you are connected to your school so we can provide
                        the right registration experience for you.
                    </p>
                </div>

                {/* Progress */}
                <div className="mx-auto mt-10 max-w-md">
                    <div className="flex items-center gap-3">

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        <div className="h-2 flex-1 rounded-full bg-base-300" />

                        <div className="h-2 flex-1 rounded-full bg-base-300" />

                        <div className="h-2 flex-1 rounded-full bg-base-300" />

                        <div className="h-2 flex-1 rounded-full bg-base-300" />

                    </div>

                    <p className="mt-3 text-center text-xs text-base-content/50">
                        Step 1 of 5
                    </p>
                </div>

                {/* Role Cards */}
                <div className="mt-10 grid gap-5 sm:grid-cols-2">

                    {roles.map((role) => {
                        const isSelected = selectedRole === role.id;

                        return (
                            <button
                                key={role.id}
                                type="button"
                                onClick={() => updateField("role", role.id)}
                                className={`group relative rounded-3xl border p-6 text-left transition-all duration-200 sm:p-7 ${isSelected
                                    ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
                                    : "border-base-300 bg-base-100 shadow-sm hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                                    }`}
                            >
                                {/* Selected indicator */}
                                <div
                                    className={`absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${isSelected
                                        ? "border-primary bg-primary text-primary-content"
                                        : "border-base-300"
                                        }`}
                                >
                                    {isSelected && (
                                        <span className="text-xs font-bold">
                                            ✓
                                        </span>
                                    )}
                                </div>

                                {/* Icon */}
                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition ${isSelected
                                        ? "bg-primary text-primary-content"
                                        : "bg-primary/10"
                                        }`}
                                >
                                    {role.icon}
                                </div>

                                {/* Content */}
                                <h2 className="mt-5 text-xl font-bold">
                                    {role.title}
                                </h2>

                                <p className="mt-2 max-w-md text-sm leading-6 text-base-content/60">
                                    {role.description}
                                </p>

                                {/* Selection text */}
                                <div
                                    className={`mt-5 text-sm font-semibold ${isSelected
                                        ? "text-primary"
                                        : "text-base-content/40 group-hover:text-primary"
                                        }`}
                                >
                                    {isSelected ? "Selected" : "Select this role"}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Continue */}
                <div className="mx-auto mt-10 max-w-md">

                    <button
                        type="button"
                        disabled={!selectedRole}
                        onClick={handleContinue}
                        className="btn btn-primary w-full rounded-xl disabled:cursor-not-allowed"
                    >
                        Continue
                    </button>

                    {!selectedRole && (
                        <p className="mt-3 text-center text-xs text-base-content/40">
                            Please select an option to continue.
                        </p>
                    )}
                </div>

                {/* Security note */}
                <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-base-300 bg-base-100 p-5 text-center">
                    <p className="text-xs leading-5 text-base-content/50">
                        Your selection helps us determine the appropriate verification
                        and school-access process. You can only access school information
                        after your account has been properly verified.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RoleSelection;