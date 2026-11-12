import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../context/RegistrationContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { sendEmailVerification } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api.js";


function AccountCredentials() {
    const navigate = useNavigate();
    const { createFirebaseUser,
        loading,
        setLoading
    } = useAuth();

    const {
        registrationData,
        // updateRegistration,
        updateField,
    } = useRegistration();
    // console.log(
    //     "registrationData in AccountCredentials",
    //     registrationData
    // );
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [errors, setErrors] = useState({});

    const registrationId = registrationData?.registration_id;

    const {
        data,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ["registration-account-details", registrationId],

        queryFn: async () => {
            const response = await api.get(
                `/registrations/${registrationId}/account-details`
            );

            return response.data.registration;
        },

        enabled: Boolean(registrationId),
        retry: 1,
    });

    const accountDetails = data;

    // useEffect(() => {
    //     if (!accountDetails) return;

    //     updateRegistration({
    //         ...accountDetails,
    //     });
    // }, [accountDetails, updateRegistration]);

    // console.log(
    //     "Registration details in AccountCredentials",
    //     registrationData
    // );

    if (!registrationId) {
        return (
            <div className="alert alert-warning">
                Registration information is missing.
                Please return to the payment-success page.
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
                <span className="ml-3">Loading registration details...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-error m-6">
                {error?.response?.data?.message ||
                    "Unable to load registration details."}
            </div>
        );
    }


    const validatePassword = (password) => {
        const errors = {};

        if (!password) {
            errors.password = "Password is required.";
        } else if (password.length < 8) {
            errors.password =
                "Password must contain at least 8 characters.";
        } else if (!/[A-Z]/.test(password)) {
            errors.password =
                "Password must contain at least one uppercase letter.";
        } else if (!/[a-z]/.test(password)) {
            errors.password =
                "Password must contain at least one lowercase letter.";
        } else if (!/[0-9]/.test(password)) {
            errors.password =
                "Password must contain at least one number.";
        }

        if (!confirmPassword) {
            errors.confirmPassword =
                "Please confirm your password.";
        } else if (password !== confirmPassword) {
            errors.confirmPassword =
                "Passwords do not match.";
        }

        return errors;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!accountDetails.email?.trim()) {
            newErrors.email =
                "Email address is required.";
        }

        const passwordErrors =
            validatePassword(password);

        Object.assign(
            newErrors,
            passwordErrors
        );

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {


            const {
                firebase_user,

            } =
                await createFirebaseUser(
                    accountDetails.email.trim(),
                    password, { displayName: accountDetails.first_name, }
                );



            await sendEmailVerification(
                firebase_user
            );

            updateField(
                "role",
                accountDetails.role
            );

            updateField(
                "email",
                accountDetails.email.trim()
            );
            updateField(
                "first_name",
                accountDetails.first_name
            );
            updateField(
                "last_name",
                accountDetails.last_name
            );
            updateField(
                "payment_status",
                accountDetails.payment_status
            );
            updateField(
                "registration_id",
                accountDetails.registration_id
            );
            updateField(
                "school_name",
                accountDetails.school_name
            );
            updateField(
                "school_type",
                accountDetails.school_type
            );
            updateField(
                "subscription_activated",
                true
            );
            updateField(
                "firebase_uid",
                firebase_user.uid
            );

            updateField(
                "status",
                "account_created"
            );


            // console.log(
            //     "registrationData after update",
            //     registrationData
            // );

            navigate(
                "/register/school_admin/verify"
            );

        } catch (error) {

            console.error(
                "Firebase registration error:",
                error
            );


            let message =
                "Unable to create your account. Please try again.";


            /*
            |--------------------------------------------------------------------------
            | Firebase Error Handling
            |--------------------------------------------------------------------------
            */

            switch (error.code) {

                case "auth/email-already-in-use":
                    message =
                        "An account already exists with this email address.";
                    break;

                case "auth/invalid-email":
                    message =
                        "Please enter a valid email address.";
                    break;

                case "auth/weak-password":
                    message =
                        "The password is too weak.";
                    break;

                case "auth/network-request-failed":
                    message =
                        "Network error. Please check your internet connection.";
                    break;

                case "auth/operation-not-allowed":
                    message =
                        "Email/password registration is currently disabled.";
                    break;

                default:
                    break;
            }


            setErrors({
                firebase: message,
            });

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="min-h-screen bg-base-200 px-4 py-10 sm:py-16">

            <div className="mx-auto max-w-3xl">

                {/* ---------------------------------------------------------
                    Header
                --------------------------------------------------------- */}

                <div className="text-center">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/register/school_admin/school/subscription"
                            )
                        }
                        className="mb-8 text-sm font-medium text-base-content/50 transition hover:text-primary"
                    >
                        ← Back
                    </button>


                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl text-primary-content shadow-lg">
                        🔐
                    </div>


                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Create your account
                    </h1>


                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-base-content/60 sm:text-base">
                        Set a secure password for your
                        Smart School School Admin account.
                    </p>

                </div>


                {/* ---------------------------------------------------------
                    Progress
                --------------------------------------------------------- */}

                <div className="mx-auto mt-10 max-w-md">

                    <div className="flex items-center gap-3">

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        <div className="h-2 flex-1 rounded-full bg-base-300" />

                    </div>


                    <p className="mt-3 text-center text-xs text-base-content/50">
                        Step 4 of 5
                    </p>

                </div>


                {/* ---------------------------------------------------------
                    Form
                --------------------------------------------------------- */}

                <form
                    onSubmit={handleSubmit}
                    className="mt-10 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8"
                >

                    {/* -----------------------------------------------------
                        Email
                    ----------------------------------------------------- */}

                    <div>

                        <label className="label">
                            <span className="label-text font-semibold">
                                Email Address
                            </span>
                        </label>


                        <input
                            type="email"
                            value={accountDetails?.email ?? ""}
                            readOnly
                            className="input input-bordered w-full bg-base-200"
                        />


                        {errors.email && (
                            <p className="mt-2 text-xs text-error">
                                {errors.email}
                            </p>
                        )}

                    </div>


                    {/* -----------------------------------------------------
                        Password
                    ----------------------------------------------------- */}

                    <div className="mt-6">

                        <label className="label">
                            <span className="label-text font-semibold">
                                Password
                            </span>
                        </label>


                        <div className="relative">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                className={`input input-bordered w-full pr-20 ${errors.password
                                    ? "input-error"
                                    : ""
                                    }`}
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-base-content/50 hover:text-primary"
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>


                        {errors.password && (
                            <p className="mt-2 text-xs text-error">
                                {errors.password}
                            </p>
                        )}

                    </div>


                    {/* -----------------------------------------------------
                        Confirm Password
                    ----------------------------------------------------- */}

                    <div className="mt-6">

                        <label className="label">
                            <span className="label-text font-semibold">
                                Confirm Password
                            </span>
                        </label>


                        <div className="relative">

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password again"
                                value={
                                    confirmPassword
                                }
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                className={`input input-bordered w-full pr-20 ${errors.confirmPassword
                                    ? "input-error"
                                    : ""
                                    }`}
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-base-content/50 hover:text-primary"
                            >
                                {showConfirmPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>


                        {errors.confirmPassword && (
                            <p className="mt-2 text-xs text-error">
                                {errors.confirmPassword}
                            </p>
                        )}

                    </div>


                    {/* -----------------------------------------------------
                        Password Requirements
                    ----------------------------------------------------- */}

                    <div className="mt-6 rounded-2xl bg-base-200 p-4">

                        <p className="text-sm font-semibold">
                            Password requirements
                        </p>


                        <ul className="mt-3 space-y-2 text-xs text-base-content/60">

                            <li>
                                • At least 8 characters
                            </li>

                            <li>
                                • At least one uppercase letter
                            </li>

                            <li>
                                • At least one lowercase letter
                            </li>

                            <li>
                                • At least one number
                            </li>

                        </ul>

                    </div>


                    {/* -----------------------------------------------------
                        Firebase Error
                    ----------------------------------------------------- */}

                    {errors.firebase && (
                        <div className="alert alert-error mt-6">

                            <span>
                                {errors.firebase}
                            </span>

                        </div>
                    )}


                    {/* -----------------------------------------------------
                        Actions
                    ----------------------------------------------------- */}

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

                        <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                navigate(
                                    "/register/school_admin/school/subscription"
                                )
                            }
                            className="btn btn-ghost"
                        >
                            Back
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >

                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </div>

                </form>


                {/* ---------------------------------------------------------
                    Security Note
                --------------------------------------------------------- */}

                <div className="mx-auto mt-6 max-w-2xl text-center">

                    <p className="text-xs leading-5 text-base-content/50">
                        Your password is securely handled by
                        Firebase Authentication. Smart School
                        does not store your password in MongoDB.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default AccountCredentials;