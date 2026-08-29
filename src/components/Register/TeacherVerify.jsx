import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    reload,
    sendEmailVerification,
    signOut,
} from "firebase/auth";

import { auth } from "../../config/firebase.js";
import { useRegistration } from "../../context/RegistrationContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function TeacherVerify() {
    const navigate = useNavigate();
    const { loading, setLoading, user } = useAuth();
    const {
        registrationData,
        updateField,
    } = useRegistration();
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [verified, setVerified] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Check whether email has been verified
    |--------------------------------------------------------------------------
    */

    const handleCheckVerification = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const user = auth.currentUser;

            if (!user) {
                setError(
                    "Your registration session has expired. Please create your account again."
                );
                return;
            }

            // Refresh Firebase user information
            await reload(user);

            if (user.emailVerified) {
                setVerified(user);
                updateField(
                    "status",
                    "email_verified"
                );

                navigate(
                    "/register/teacher/complete"
                );

                return;
            }

            setMessage(
                "Your email has not been verified yet. Please check your inbox and click the verification link."
            );

        } catch (err) {
            console.error(
                "Verification check failed:",
                err
            );

            setError(
                "Unable to check your email verification status."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Resend verification email
    |--------------------------------------------------------------------------
    */

    const handleResendEmail = async () => {
        setResending(true);
        setError("");
        setMessage("");

        try {
            const user = auth.currentUser;

            if (!user) {
                setError(
                    "Your registration session has expired."
                );
                return;
            }

            await reload(user);

            if (user.emailVerified) {
                setVerified(user);
                navigate(
                    "/register/teacher/complete"
                );
                return;
            }

            await sendEmailVerification(user);

            setMessage(
                "A new verification email has been sent. Please check your inbox."
            );

        } catch (err) {
            console.error(
                "Resend verification error:",
                err
            );

            if (
                err.code ===
                "auth/too-many-requests"
            ) {
                setError(
                    "Too many requests. Please wait a few minutes before trying again."
                );
            } else {
                setError(
                    "Unable to resend the verification email."
                );
            }
        } finally {
            setResending(false);
        }
    };

      /*
    |--------------------------------------------------------------------------
    | Protect this page
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!auth.currentUser) {
            navigate(
                "/register/teacher/account",
                {
                    replace: true,
                }
            );
        }
    }, [navigate]);

    /*
    |--------------------------------------------------------------------------
    | Listen for Firebase authentication state
    |--------------------------------------------------------------------------
    */

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(
    //         auth,
    //         (currentUser) => {
    //             setUser(currentUser);
    //             setChecking(false);

    //             if (!currentUser) {
    //                 setError(
    //                     "Your registration session has expired. Please create your account again."
    //                 );
    //             }
    //         }
    //     );

    //     return () => unsubscribe();
    // }, []);

    /*
    |--------------------------------------------------------------------------
    | Check verification status
    |--------------------------------------------------------------------------
    */

    // const checkVerification = async () => {
    //     if (!auth.currentUser) {
    //         setError(
    //             "No Firebase account is currently signed in."
    //         );

    //         return false;
    //     }

    //     try {
    //         setChecking(true);
    //         setError("");
    //         setMessage("");

    //         /*
    //          * Firebase may have an old cached
    //          * emailVerified value.
    //          *
    //          * reload() gets the latest status.
    //          */

    //         await reload(auth.currentUser);

    //         const currentUser =
    //             auth.currentUser;

    //         if (currentUser?.emailVerified) {
    //             setUser(currentUser);
    //             setVerified(true);

    //             return true;
    //         }

    //         setVerified(false);

    //         setError(
    //             "Your email has not been verified yet. Please check your inbox and click the verification link."
    //         );

    //         return false;

    //     } catch (error) {
    //         console.error(
    //             "Email verification check error:",
    //             error
    //         );

    //         setError(
    //             "Unable to check your verification status. Please try again."
    //         );

    //         return false;

    //     } finally {
    //         setChecking(false);
    //     }
    // };

    /*
    |--------------------------------------------------------------------------
    | Automatically check when page opens
    |--------------------------------------------------------------------------
    */

    // useEffect(() => {
    //     if (!checking && user) {
    //         checkVerification();
    //     }
    // }, [user]);

    /*
    |--------------------------------------------------------------------------
    | Continue after verification
    |--------------------------------------------------------------------------
    */

    // const handleContinue = async () => {
    //     const isVerified =
    //         await checkVerification();

    //     if (!isVerified) {
    //         return;
    //     }

    //     navigate(
    //         "/register/teacher/complete"
    //     );
    // };

    /*
    |--------------------------------------------------------------------------
    | Resend verification email
    |--------------------------------------------------------------------------
    */

    // const handleResendEmail = async () => {
    //     if (!auth.currentUser) {
    //         setError(
    //             "No Firebase account is currently signed in."
    //         );

    //         return;
    //     }

    //     try {
    //         setResending(true);
    //         setError("");
    //         setMessage("");

    //         await sendEmailVerification(
    //             auth.currentUser
    //         );

    //         setMessage(
    //             "A new verification email has been sent. Please check your inbox."
    //         );

    //     } catch (error) {
    //         console.error(
    //             "Resend verification email error:",
    //             error
    //         );

    //         switch (error.code) {
    //             case "auth/too-many-requests":
    //                 setError(
    //                     "Too many verification emails have been requested. Please wait a while before trying again."
    //                 );
    //                 break;

    //             case "auth/network-request-failed":
    //                 setError(
    //                     "Network error. Please check your internet connection."
    //                 );
    //                 break;

    //             default:
    //                 setError(
    //                     error.message ||
    //                     "Unable to resend verification email."
    //                 );
    //         }

    //     } finally {
    //         setResending(false);
    //     }
    // };

    /*
    |--------------------------------------------------------------------------
    | Change account
    |--------------------------------------------------------------------------
    */

    const handleChangeAccount = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(
                "Firebase sign out error:",
                error
            );
        }

        navigate(
            "/register/teacher/account",
            {
                replace: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    // if (checking && !user) {
    //     return (
    //         <div className="flex min-h-screen items-center justify-center bg-base-200">

    //             <div className="text-center">

    //                 <span className="loading loading-spinner loading-lg text-primary" />

    //                 <p className="mt-4 text-sm text-base-content/50">
    //                     Loading verification...
    //                 </p>

    //             </div>

    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10 sm:py-16">

            <div className="mx-auto max-w-3xl">

                {/* =========================================================
                    HEADER
                ========================================================= */}

                <div className="text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl shadow-lg">
                        ✉️
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Verify Your Email
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
                        We have sent a verification link
                        to your email address. Please verify
                        your email before continuing.
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

                        <div
                            className={`h-2 flex-1 rounded-full ${verified
                                ? "bg-primary"
                                : "bg-base-300"
                                }`}
                        />

                    </div>

                    <p className="mt-3 text-center text-xs text-base-content/50">
                        Step 4 of 4
                    </p>

                </div>


                {/* =========================================================
                    EMAIL CARD
                ========================================================= */}

                <div className="mt-10 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">

                    <div className="text-center">

                        {/* Email Icon */}

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">
                            📧
                        </div>


                        <h2 className="mt-6 text-xl font-bold">
                            Check your inbox
                        </h2>


                        {user?.email && (
                            <div className="mx-auto mt-4 max-w-md rounded-xl bg-base-200 px-4 py-3">

                                <p className="break-all text-sm font-semibold">
                                    {user.email}
                                </p>

                            </div>
                        )}


                        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-base-content/60">
                            Open the verification email
                            from Smart School and click the
                            verification link.
                        </p>

                    </div>


                    {/* =====================================================
                        MESSAGE
                    ===================================================== */}

                    {message && (
                        <div className="alert alert-success mt-6">

                            <span className="text-sm">
                                {message}
                            </span>

                        </div>
                    )}


                    {/* =====================================================
                        ERROR
                    ===================================================== */}

                    {error && (
                        <div className="alert alert-error mt-6">

                            <span className="text-sm">
                                {error}
                            </span>

                        </div>
                    )}


                    {/* =====================================================
                        CHECK VERIFICATION
                    ===================================================== */}

                    <button
                        type="button"
                        onClick={handleCheckVerification}
                        disabled={loading}
                        className="btn btn-primary mt-8 h-12 w-full rounded-xl"
                    >

                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm" />

                                Checking...
                            </>
                        ) : (
                            <>
                                I've Verified My Email →
                            </>
                        )}

                    </button>


                    {/* =====================================================
                        RESEND
                    ===================================================== */}

                    <button
                        type="button"
                        onClick={
                            handleResendEmail
                        }
                        disabled={resending}
                        className="btn btn-ghost mt-3 w-full rounded-xl"
                    >

                        {resending ? (
                            <>
                                <span className="loading loading-spinner loading-sm" />

                                Sending...
                            </>
                        ) : (
                            "Resend Verification Email"
                        )}

                    </button>


                    {/* =====================================================
                        CHANGE EMAIL
                    ===================================================== */}

                    <div className="mt-6 border-t border-base-300 pt-6 text-center">

                        <p className="text-xs text-base-content/50">
                            Using the wrong email address?
                        </p>

                        <button
                            type="button"
                            onClick={
                                handleChangeAccount
                            }
                            className="mt-2 text-sm font-semibold text-primary hover:underline"
                        >
                            Create account with another email
                        </button>

                    </div>

                </div>


                {/* =========================================================
                    VERIFIED STATUS
                ========================================================= */}

                {verified && (
                    <div className="mt-6 rounded-2xl border border-success/30 bg-success/10 p-5">

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-xl text-success-content">
                                ✓
                            </div>

                            <div>

                                <h3 className="font-bold text-success">
                                    Email verified successfully
                                </h3>

                                <p className="mt-1 text-xs text-base-content/60">
                                    Your email has been verified.
                                    Continue to complete your
                                    teacher registration.
                                </p>

                            </div>

                        </div>

                    </div>
                )}


                {/* =========================================================
                    SCHOOL INFORMATION
                ========================================================= */}

                <div className="mt-6 rounded-2xl border border-base-300 bg-base-100 p-5">

                    <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl">
                            🏫
                        </div>

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/40">
                                Registration School
                            </p>

                            <p className="mt-1 text-sm font-bold">
                                {registrationData.school_name ||
                                    "Selected school"}
                            </p>

                        </div>

                    </div>

                </div>


                {/* =========================================================
                    SECURITY NOTE
                ========================================================= */}

                <div className="mx-auto mt-8 max-w-2xl text-center">

                    <p className="text-xs leading-5 text-base-content/40">
                        Email verification helps us protect
                        your account and prevents unauthorized
                        registration requests.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default TeacherVerify;