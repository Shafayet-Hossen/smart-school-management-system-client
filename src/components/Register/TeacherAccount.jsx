import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    sendEmailVerification,
} from "firebase/auth";

import { useRegistration } from "../../context/RegistrationContext.jsx";

import { useAuth } from "../../context/AuthContext.jsx";

function TeacherAccount() {
    const { createFirebaseUser, loading, setLoading } = useAuth();

    const navigate = useNavigate();

    const {
        registrationData,
        updateField,
    } = useRegistration();

    const [email, setEmail] = useState(
        registrationData.email || ""
    );

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [errors, setErrors] = useState({});

    /*
    |--------------------------------------------------------------------------
    | Password validation
    |--------------------------------------------------------------------------
    */

    // const validatePassword = () => {
    //     if (password.length < 8) {
    //         return "Password must contain at least 8 characters.";
    //     }

    //     if (!/[A-Z]/.test(password)) {
    //         return "Password must contain at least one uppercase letter.";
    //     }

    //     if (!/[a-z]/.test(password)) {
    //         return "Password must contain at least one lowercase letter.";
    //     }

    //     if (!/[0-9]/.test(password)) {
    //         return "Password must contain at least one number.";
    //     }

    //     return null;
    // };
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

    /*
|--------------------------------------------------------------------------
| Form Validation
|--------------------------------------------------------------------------
*/

    const validateForm = () => {
        const newErrors = {};

        if (!registrationData.email?.trim()) {
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

        setLoading(true);

        if (!selectedSchoolExists()) {
            const schoolError = "Please select your school before creating your account."
            setErrors(schoolError);

            navigate("/register/teacher/school");
            return;
        }

        if (!validateForm()) {
            return;
        }

        // setLoading(true);
        setErrors({});

        try {

            /*
            |--------------------------------------------------------------------------
            | Create Firebase Authentication User
            |--------------------------------------------------------------------------
            */

            const {
                firebase_user,
                // user,
                // idToken,
            } =
                await createFirebaseUser(
                    registrationData.email.trim(),
                    password, { displayName: registrationData.first_name, }
                );
            console.log("firebaseUser", firebase_user)




            /*
            |--------------------------------------------------------------------------
            | Send Firebase Email Verification
            |--------------------------------------------------------------------------
            */

            await sendEmailVerification(
                firebase_user
            );


            /*
            |--------------------------------------------------------------------------
            | Store Firebase UID in Registration Context
            |--------------------------------------------------------------------------
            |
            | This is temporary wizard state.
            | The backend should ultimately trust the Firebase
            | ID token rather than a UID sent from the frontend.
            |
            */
            updateField(
                "email",
                firebase_user.email
            );

            updateField(
                "firebase_uid",
                firebase_user.uid
            );

            updateField(
                "status",
                "account_created"
            );


            /*
            |--------------------------------------------------------------------------
            | Navigate to Email Verification
            |--------------------------------------------------------------------------
            */
            console.log("Create Account Successfull");

            navigate(
                "/register/teacher/verify",
                {
                    replace: true,
                }
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



    // const handleSubmit = async (event) => {


    //     // if (!selectedSchoolExists()) {
    //     //     setError(
    //     //         "Please select your school before creating your account."
    //     //     );

    //     //     navigate("/register/teacher/school");
    //     //     return;
    //     // }

    //     // const passwordError = validatePassword();

    //     // if (passwordError) {
    //     //     setError(passwordError);
    //     //     return;
    //     // }

    //     // if (password !== confirmPassword) {
    //     //     setError("Passwords do not match.");
    //     //     return;
    //     // }

    //     try {
    //         // setLoading(true);

    //         /*
    //         |--------------------------------------------------------------------------
    //         | Save email into RegistrationContext
    //         |--------------------------------------------------------------------------
    //         */

    //         updateField(
    //             "email",
    //             normalizedEmail
    //         );

    //         /*
    //         |--------------------------------------------------------------------------
    //         | Create Firebase account
    //         |--------------------------------------------------------------------------
    //         */

    //         // const userCredential =
    //         //     await createUserWithEmailAndPassword(
    //         //         auth,
    //         //         normalizedEmail,
    //         //         password
    //         //     );

    //         // const user = userCredential.user;

    //         /*
    //         |--------------------------------------------------------------------------
    //         | Send verification email
    //         |--------------------------------------------------------------------------
    //         */

    //         // await sendEmailVerification(user);

    //         /*
    //         |--------------------------------------------------------------------------
    //         | Save Firebase UID
    //         |--------------------------------------------------------------------------
    //         */

    //         updateField(
    //             "firebaseUid",
    //             user.uid
    //         );

    //         /*
    //         |--------------------------------------------------------------------------
    //         | Navigate to verification page
    //         |--------------------------------------------------------------------------
    //         */

    //         navigate(
    //             "/register/teacher/verify",
    //             {
    //                 replace: true,
    //             }
    //         );

    //     } catch (error) {
    //         console.error(
    //             "Teacher Firebase registration error:",
    //             error
    //         );

    //         let message =
    //             "Unable to create your account.";

    //         switch (error.code) {

    //             case "auth/email-already-in-use":
    //                 message =
    //                     "An account already exists with this email address.";
    //                 break;

    //             case "auth/invalid-email":
    //                 message =
    //                     "Please enter a valid email address.";
    //                 break;

    //             case "auth/weak-password":
    //                 message =
    //                     "The password is too weak.";
    //                 break;

    //             case "auth/network-request-failed":
    //                 message =
    //                     "Network error. Please check your internet connection.";
    //                 break;

    //             case "auth/operation-not-allowed":
    //                 message =
    //                     "Email/password registration is currently disabled.";
    //                 break;

    //             default:
    //                 message =
    //                     error.message ||
    //                     message;
    //         }

    //         setError(message);

    //     } finally {
    //         setLoading(false);
    //     }
    // };

    /*
    |--------------------------------------------------------------------------
    | Check selected school
    |--------------------------------------------------------------------------
    */

    const selectedSchoolExists = () => {
        return Boolean(
            registrationData.school_id
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {
        navigate(
            "/register/teacher/school"
        );
    };

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10 sm:py-16">

            <div className="mx-auto max-w-3xl">

                {/* =========================================================
                    HEADER
                ========================================================= */}

                <div className="text-center">

                    <button
                        type="button"
                        onClick={handleBack}
                        className="mb-8 text-sm font-medium text-base-content/50 transition hover:text-primary"
                    >
                        ← Back
                    </button>

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl shadow-lg">
                        🔐
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Create Your Account
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
                        Create your Smart School account
                        using your email address and a
                        secure password.
                    </p>

                </div>


                {/* =========================================================
                    PROGRESS
                ========================================================= */}

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


                {/* =========================================================
                    SELECTED SCHOOL
                ========================================================= */}

                <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-5">

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl text-primary-content">
                            🏫
                        </div>

                        <div className="min-w-0 flex-1">

                            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                Selected School
                            </p>

                            <h2 className="mt-1 truncate font-bold">
                                {registrationData.school_name ||
                                    "School selected"}
                            </h2>

                            {registrationData.eiin && (
                                <p className="mt-1 text-xs text-base-content/50">
                                    EIIN:{" "}
                                    {
                                        registrationData.eiin
                                    }
                                </p>
                            )}

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/register/teacher/school"
                                )
                            }
                            className="btn btn-ghost btn-sm"
                        >
                            Change
                        </button>

                    </div>

                </div>


                {/* =========================================================
                    ACCOUNT FORM
                ========================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8"
                >

                    {/* =====================================================
                        ERRORs
                    ===================================================== */}

                    {errors.email && (
                        <div className="alert alert-error mb-6">

                            <span className="text-sm">
                                {errors.email}
                            </span>

                        </div>
                    )}

                    {errors.password && (
                        <div className="alert alert-error mb-6">

                            <span className="text-sm">
                                {errors.password}
                            </span>

                        </div>
                    )}

                    {errors.confirmPassword && (
                        <div className="alert alert-error mb-6">

                            <span className="text-sm">
                                {errors.confirmPassword}
                            </span>

                        </div>
                    )}


                    {/* =====================================================
                        EMAIL
                    ===================================================== */}

                    <div>

                        <label
                            htmlFor="teacher-email"
                            className="label"
                        >
                            <span className="label-text font-semibold">
                                Email Address
                            </span>
                        </label>

                        <input
                            id="teacher-email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={loading}
                            className="input input-bordered h-12 w-full rounded-xl"
                            required
                        />

                        <p className="mt-2 text-xs text-base-content/50">
                            This email will be used to
                            sign in to Smart School.
                        </p>

                    </div>


                    {/* =====================================================
                        PASSWORD
                    ===================================================== */}

                    <div className="mt-5">

                        <label
                            htmlFor="teacher-password"
                            className="label"
                        >
                            <span className="label-text font-semibold">
                                Password
                            </span>
                        </label>

                        <div className="relative">

                            <input
                                id="teacher-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Create a strong password"
                                autoComplete="new-password"
                                disabled={loading}
                                className="input input-bordered h-12 w-full rounded-xl pr-16"
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-base-content/50 hover:text-primary"
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>


                        {/* Password requirements */}

                        <div className="mt-3 space-y-1 text-xs">

                            <p
                                className={
                                    password.length >= 8
                                        ? "text-success"
                                        : "text-base-content/40"
                                }
                            >
                                ✓ At least 8 characters
                            </p>

                            <p
                                className={
                                    /[A-Z]/.test(password)
                                        ? "text-success"
                                        : "text-base-content/40"
                                }
                            >
                                ✓ One uppercase letter
                            </p>

                            <p
                                className={
                                    /[a-z]/.test(password)
                                        ? "text-success"
                                        : "text-base-content/40"
                                }
                            >
                                ✓ One lowercase letter
                            </p>

                            <p
                                className={
                                    /[0-9]/.test(password)
                                        ? "text-success"
                                        : "text-base-content/40"
                                }
                            >
                                ✓ One number
                            </p>

                        </div>

                    </div>


                    {/* =====================================================
                        CONFIRM PASSWORD
                    ===================================================== */}

                    <div className="mt-5">

                        <label
                            htmlFor="teacher-confirm-password"
                            className="label"
                        >
                            <span className="label-text font-semibold">
                                Confirm Password
                            </span>
                        </label>

                        <div className="relative">

                            <input
                                id="teacher-confirm-password"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={
                                    confirmPassword
                                }
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your password again"
                                autoComplete="new-password"
                                disabled={loading}
                                className="input input-bordered h-12 w-full rounded-xl pr-16"
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-base-content/50 hover:text-primary"
                            >
                                {showConfirmPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>


                        {confirmPassword && (
                            <p
                                className={`mt-2 text-xs ${password ===
                                    confirmPassword
                                    ? "text-success"
                                    : "text-error"
                                    }`}
                            >
                                {password ===
                                    confirmPassword
                                    ? "✓ Passwords match"
                                    : "Passwords do not match"}
                            </p>
                        )}

                    </div>
                    
                    {errors.firebase && (
                        <div className="alert alert-error mt-6">

                            <span>
                                {errors.firebase}
                            </span>

                        </div>
                    )}


                    {/* =====================================================
                        SECURITY NOTE
                    ===================================================== */}

                    <div className="mt-6 rounded-2xl border border-base-300 bg-base-200/50 p-4">

                        <div className="flex gap-3">

                            <span className="text-lg">
                                🔒
                            </span>

                            <div>

                                <p className="text-sm font-semibold">
                                    Your account is protected
                                </p>

                                <p className="mt-1 text-xs leading-5 text-base-content/50">
                                    Your password is securely
                                    handled by Firebase
                                    Authentication. Smart School
                                    does not store your password
                                    in MongoDB.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                        SUBMIT
                    ===================================================== */}

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            !email.trim() ||
                            !password ||
                            !confirmPassword
                        }
                        className="btn btn-primary mt-8 h-12 w-full rounded-xl"
                    >

                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm" />

                                Creating account...
                            </>
                        ) : (
                            <>
                                Create Account →
                            </>
                        )}

                    </button>

                </form>


                {/* =========================================================
                    FOOTER
                ========================================================= */}

                <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-5 text-base-content/40">
                    After creating your account, we will
                    send a verification email to your email
                    address. You must verify your account
                    before submitting your school request.
                </p>


                {/* =========================================================
                    DEBUG
                ========================================================= */}

                {/* {import.meta.env.DEV && (
                    <pre className="mt-8 overflow-auto rounded-xl bg-neutral p-4 text-xs text-neutral-content">
                        {JSON.stringify(
                            registrationData,
                            null,
                            2
                        )}
                    </pre>
                )} */}

            </div>

        </div>
    );
}

export default TeacherAccount;