import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    reload,
    sendEmailVerification,
} from "firebase/auth";

import { auth } from "../../config/firebase.js";
import { useRegistration } from "../../context/RegistrationContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";


function EmailVerification() {
    const navigate = useNavigate();
    const { loading, setLoading } = useAuth();
    const {
        registrationData,
        updateField,
    } = useRegistration();

    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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
                updateField(
                    "status",
                    "email_verified"
                );

                navigate(
                    "/register/school_admin/complete"
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
                navigate(
                    "/register/school_admin/complete"
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
                "/register/school_admin/account",
                {
                    replace: true,
                }
            );
        }
    }, [navigate]);


    return (
        <div className="min-h-screen bg-base-200 px-4 py-10 sm:py-16">

            <div className="mx-auto max-w-3xl">

                {/* Header */}

                <div className="text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl text-primary-content shadow-lg">
                        ✉️
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Verify your email
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
                        We have sent a verification link to
                        your email address.
                    </p>

                </div>


                {/* Progress */}

                <div className="mx-auto mt-10 max-w-md">

                    <div className="flex items-center gap-3">

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        <div className="h-2 flex-1 rounded-full bg-primary" />

                        <div className="h-2 flex-1 rounded-full bg-primary" />
                        
                        <div className="h-2 flex-1 rounded-full bg-primary" />

                    </div>

                    <p className="mt-3 text-center text-xs text-base-content/50">
                        Step 5 of 5
                    </p>

                </div>


                {/* Verification Card */}

                <div className="mt-10 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">

                    <div className="text-center">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">
                            📧
                        </div>

                        <h2 className="mt-6 text-2xl font-bold">
                            Check your inbox
                        </h2>

                        <p className="mt-3 text-sm text-base-content/60">
                            Verification email sent to
                        </p>

                        <p className="mt-2 break-all font-semibold text-primary">
                            {registrationData.email}
                        </p>

                    </div>


                    {/* Instructions */}

                    <div className="mt-8 rounded-2xl bg-base-200 p-5">

                        <h3 className="font-semibold">
                            What should you do?
                        </h3>

                        <ol className="mt-4 space-y-3 text-sm text-base-content/70">

                            <li className="flex gap-3">
                                <span className="font-bold text-primary">
                                    1
                                </span>

                                <span>
                                    Open your email inbox.
                                </span>
                            </li>

                            <li className="flex gap-3">
                                <span className="font-bold text-primary">
                                    2
                                </span>

                                <span>
                                    Find the email from Smart School.
                                </span>
                            </li>

                            <li className="flex gap-3">
                                <span className="font-bold text-primary">
                                    3
                                </span>

                                <span>
                                    Click the verification link.
                                </span>
                            </li>

                            <li className="flex gap-3">
                                <span className="font-bold text-primary">
                                    4
                                </span>

                                <span>
                                    Come back here and click
                                    "I've Verified My Email".
                                </span>
                            </li>

                        </ol>

                    </div>


                    {/* Message */}

                    {message && (
                        <div className="alert alert-success mt-6">
                            <span>{message}</span>
                        </div>
                    )}


                    {/* Error */}

                    {error && (
                        <div className="alert alert-error mt-6">
                            <span>{error}</span>
                        </div>
                    )}


                    {/* Check Button */}

                    <button
                        type="button"
                        onClick={handleCheckVerification}
                        disabled={loading}
                        className="btn btn-primary mt-8 w-full"
                    >

                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm" />
                                Checking...
                            </>
                        ) : (
                            <>
                                ✓ I've Verified My Email
                            </>
                        )}

                    </button>


                    {/* Resend */}

                    <button
                        type="button"
                        onClick={handleResendEmail}
                        disabled={resending}
                        className="btn btn-outline mt-3 w-full"
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


                    {/* Back */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/register/school_admin/account"
                            )
                        }
                        className="btn btn-ghost mt-3 w-full"
                    >
                        ← Back to Account
                    </button>

                </div>


                {/* Security */}

                <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-5 text-base-content/50">
                    Email verification protects your account
                    and helps us make sure that you own the
                    email address used during registration.
                </p>

            </div>

        </div>
    );
}

export default EmailVerification;