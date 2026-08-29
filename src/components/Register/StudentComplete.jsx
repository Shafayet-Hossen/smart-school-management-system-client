import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reload } from "firebase/auth";

import api from "../../services/api.js";
import { auth } from "../../config/firebase.js";

import { useRegistration } from "../../context/RegistrationContext.jsx";
// import { useAuth } from "../../context/AuthContext.jsx";


function StudentComplete() {

    const navigate = useNavigate();

    // const [loading, setLoading] = useState(false);

    const {
        registrationData,
        updateField,
    } = useRegistration();

    const [status, setStatus] = useState("processing");

    const [error, setError] = useState("");

    const registrationStartedRef = useRef(false);

    /*
    |--------------------------------------------------------------------------
    | Complete Teacher Registration
    |--------------------------------------------------------------------------
    */
    console.log("registrationData: ", registrationData);

    const completeRegistration = async () => {

        // setLoading(true);

        setError("");

        // registrationStartedRef.current = false;

        try {
            setStatus("processing");

            const currentUser = auth.currentUser;

            if (!currentUser) {
                throw new Error(
                    "Your authentication session has expired. Please sign in again."
                );
            }


            await reload(currentUser);


            if (!auth.currentUser?.emailVerified) {
                setStatus("not_verified");
                navigate(
                    "/register/student/verify",
                    {
                        replace: true,
                    }
                );
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Validate Registration Context
            |--------------------------------------------------------------------------
            */

            if (
                registrationData.role !==
                "student"
            ) {
                throw new Error(
                    "Invalid registration role."
                );
            }

            if (
                !registrationData.school_id
            ) {
                throw new Error(
                    "School information is missing."
                );
            }

            if (
                !registrationData.first_name ||
                !registrationData.last_name
            ) {
                throw new Error(
                    "Personal information is incomplete."
                );
            }


            const payload = {
                role: "student",

                roll_number: registrationData.roll_number||null,
                
                first_name:
                    registrationData.first_name,

                last_name:
                    registrationData.last_name,

                phone:
                    registrationData.phone || null,

                gender:
                    registrationData.gender || null,

                date_of_birth:
                    registrationData.date_of_birth ||
                    null,

                school_id:
                    registrationData.school_id,

                school_name:
                    registrationData.school_name || "",  

                class_code:
                    registrationData.class_code,

                class_name:
                    registrationData.class_name || "",

                section_id:
                    registrationData.section_id,

                section_name:
                    registrationData.section_name || "",
                
                student_id:
                    registrationData.student_id || "",

                address:
                    registrationData.address || null,

                city:
                    registrationData.city || null,

                country:
                    registrationData.country ||
                    "Bangladesh",
            };

            console.log(
                "Teacher registration payload:",
                payload
            );

            /*
            |--------------------------------------------------------------------------
            | Send Registration Request
            |--------------------------------------------------------------------------
            */

            const idToken = await currentUser.getIdToken(true);

            const response = await api.post(
                "/auth/register/student",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );


            console.log(
                "Student registration response:",
                response.data
            );

            /*
            |--------------------------------------------------------------------------
            | Success
            |--------------------------------------------------------------------------
            */

            if (!response.data?.success) {

                throw new Error(
                    response.data?.message ||
                    "Unable to complete registration."
                );

            }

            

            // ----------------------------------
            updateField(
                "status",
                "pending"
            );


            /*
            | Store IDs returned by backend
            */

            if (response.data?.school_id) {

                updateField(
                    "school_id",
                    response.data.school_id
                );

            }


            if (response.data?.user_id) {

                updateField(
                    "user_id",
                    response.data.user_id
                );

            }

            // registrationStartedRef.current = true;

            setStatus("success")

        } catch (error) {

            console.error(
                "Teacher registration completion error:",
                error
            );

            const backendMessage =
                error?.response?.data?.message;

            setError(
                backendMessage ||
                error.message ||
                "Unable to complete your registration."
            );

            setStatus("error");
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Complete Registration
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (registrationStartedRef.current) {
            return;
        }

        registrationStartedRef.current = true;

        completeRegistration();

        // console.log("CompleteRegistration_user:", user);

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Go to Verification
    |--------------------------------------------------------------------------
    */

    const handleGoToVerification = () => {
        navigate(
            "/register/student/verify",
            {
                replace: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Go to Login
    |--------------------------------------------------------------------------
    */

    const handleLogin = () => {
        navigate("/login", {
            replace: true,
        });
    };

    /*
    |--------------------------------------------------------------------------
    | PROCESSING
    |--------------------------------------------------------------------------
    */

    if (status === "processing") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">

                <div className="w-full max-w-lg rounded-3xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">

                        <span className="loading loading-spinner loading-lg text-primary" />

                    </div>

                    <h1 className="mt-6 text-2xl font-extrabold">
                        Completing Your Registration
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-base-content/60">
                        Please wait while we securely
                        create your teacher profile and
                        submit your request to the selected
                        school.
                    </p>

                    <div className="mt-6 rounded-2xl bg-base-200 p-4 text-left">

                        <div className="flex items-center gap-3">

                            <span className="text-lg">
                                🔐
                            </span>

                            <span className="text-sm">
                                Verifying your account
                            </span>

                        </div>

                        <div className="mt-3 flex items-center gap-3">

                            <span className="text-lg">
                                🏫
                            </span>

                            <span className="text-sm">
                                Connecting you with your school
                            </span>

                        </div>

                        <div className="mt-3 flex items-center gap-3">

                            <span className="text-lg">
                                📋
                            </span>

                            <span className="text-sm">
                                Creating your registration request
                            </span>

                        </div>

                    </div>

                </div>

            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | EMAIL NOT VERIFIED
    |--------------------------------------------------------------------------
    */

    if (status === "not_verified") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">

                <div className="w-full max-w-lg rounded-3xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-warning/10 text-4xl">
                        ✉️
                    </div>

                    <h1 className="mt-6 text-2xl font-extrabold">
                        Email Verification Required
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-base-content/60">
                        Please verify your email address
                        before completing your teacher
                        registration.
                    </p>

                    <button
                        type="button"
                        onClick={
                            handleGoToVerification
                        }
                        className="btn btn-primary mt-8 w-full rounded-xl"
                    >
                        Verify My Email
                    </button>

                </div>

            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    if (status === "success") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">

                <div className="w-full max-w-lg rounded-3xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success text-4xl text-success-content">
                        ✓
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold">
                        Registration Successful!
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-base-content/60">
                        Your teacher account has been
                        successfully created.
                    </p>

                    <div className="mt-6 rounded-2xl border border-warning/30 bg-warning/10 p-5 text-left">

                        <div className="flex gap-4">

                            <div className="text-2xl">
                                🏫
                            </div>

                            <div>

                                <h3 className="font-bold">
                                    School Approval Required
                                </h3>

                                <p className="mt-2 text-xs leading-5 text-base-content/60">
                                    Your request has been
                                    sent to the selected school
                                    administrator. You will
                                    receive access after the
                                    school administrator approves
                                    your request.
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="mt-6 rounded-2xl bg-base-200 p-5 text-left">

                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/40">
                            Selected School
                        </p>

                        <p className="mt-2 font-bold">
                            {registrationData.school_name ||
                                "Your selected school"}
                        </p>

                        {registrationData.eiin && (
                            <p className="mt-1 text-xs text-base-content/50">
                                EIIN:{" "}
                                {registrationData.eiin}
                            </p>
                        )}

                    </div>

                    <button
                        type="button"
                        onClick={handleLogin}
                        className="btn btn-primary mt-8 w-full rounded-xl"
                    >
                        Go to Login
                    </button>

                </div>

            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    return (
        <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">

            <div className="w-full max-w-lg rounded-3xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-error/10 text-4xl">
                    !
                </div>

                <h1 className="mt-6 text-2xl font-extrabold">
                    Registration Could Not Be Completed
                </h1>

                <p className="mt-4 text-sm leading-6 text-base-content/60">
                    {error}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/register/teacher/account"
                            )
                        }
                        className="btn btn-primary flex-1 rounded-xl"
                    >
                        Back to Account
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/register/teacher/school"
                            )
                        }
                        className="btn btn-outline flex-1 rounded-xl"
                    >
                        Change School
                    </button>

                </div>

            </div>

        </div>
    );
}

export default StudentComplete;