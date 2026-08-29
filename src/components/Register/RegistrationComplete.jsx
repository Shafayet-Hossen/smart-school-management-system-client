import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reload } from "firebase/auth";
import { auth } from "../../config/firebase.js";
import { useRegistration } from "../../context/RegistrationContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { exchangeFirebaseToken } from "../../services/auth-api.service.js";


function RegistrationComplete() {
    const navigate = useNavigate();

    const { setLoading, setUser, user, setAccessToken } = useAuth();

    const registrationStarted = useRef(false);

    const {
        registrationData,
        updateField,
    } = useRegistration();

    const [error, setError] = useState("");

    // const [completed, setCompleted] = useState(false);


    const completeRegistration = async () => {

        setLoading(true);
        setError("");

        try {

            const user = auth.currentUser;

            if (!user) {
                throw new Error(
                    "Your authentication session has expired."
                );
            }

            // Refresh Firebase User

            await reload(user);


            if (!user.emailVerified) {

                navigate(
                    "/register/school_admin/verify",
                    {
                        replace: true,
                    }
                );

                return;
            }


            const idToken =
                await user.getIdToken(true);


            const payload = {
                role:
                    registrationData.role,

                first_name:
                    registrationData.first_name,

                last_name:
                    registrationData.last_name,

                phone:
                    registrationData.phone,

                gender:
                    registrationData.gender,

                date_of_birth:
                    registrationData.date_of_birth,

                school_name:
                    registrationData.school_name,

                school_type:
                    registrationData.school_type,

                school_email:
                    registrationData.school_email,

                school_phone:
                    registrationData.school_phone,

                eiin:
                    registrationData.eiin,

                division:
                    registrationData.division,

                district:
                    registrationData.district,

                upazila:
                    registrationData.upazila,

                address:
                    registrationData.address,

                website:
                    registrationData.website,
            };

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/auth/school_admin/complete`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${idToken}`,
                    },

                    body: JSON.stringify(payload),
                }
            );


            const result =
                await response.json();

            console.log("CompleteRegistration:", result);


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Unable to complete registration."
                );

            }

            //  Registration Successful

            const backendResponse = await exchangeFirebaseToken(idToken);

            console.log("response complete registration:", backendResponse);

            console.log("complete registration id token:", idToken);

            setUser(backendResponse.user);
            setAccessToken(backendResponse.access_token);
            sessionStorage.setItem("access_token", backendResponse.access_token);

            // ----------------------------------
            updateField(
                "status",
                "registration_completed"
            );


            /*
            | Store IDs returned by backend
            */

            if (result.data?.school_id) {

                updateField(
                    "school_id",
                    result.data.school_id
                );

            }


            if (result.data?.user_id) {

                updateField(
                    "user_id",
                    result.data.user_id
                );

            }


            if (result.data?.plan_name) {

                updateField(
                    "subscription_name",
                    result.data.plan_name
                );

            }


            // setCompleted(true);

        } catch (err) {
            registrationStarted.current = false;

            console.error(
                "Registration completion error:",
                err
            );

            setError(
                err.message ||
                "Unable to complete your registration."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        if (registrationStarted.current) {
            return;
        }

        registrationStarted.current = true;

        completeRegistration();

        console.log("CompleteRegistration_user:", user);
        
    }, []);


    // Loading State

    // if (loading) {

    //     return (
    //         <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">

    //             <div className="text-center">

    //                 <span className="loading loading-spinner loading-lg text-primary" />

    //                 <h2 className="mt-6 text-xl font-bold">
    //                     Setting up your school...
    //                 </h2>

    //                 <p className="mt-2 text-sm text-base-content/60">
    //                     Please wait while we complete your
    //                     Smart School registration.
    //                 </p>

    //             </div>

    //         </div>
    //     );

    // }

    // Error State
    if (error) {

        return (
            <div className="min-h-screen bg-base-200 px-4 py-16">

                <div className="mx-auto max-w-xl">

                    <div className="rounded-3xl border border-error/20 bg-base-100 p-8 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-3xl">
                            ⚠️
                        </div>

                        <h1 className="mt-6 text-2xl font-bold">
                            Registration could not be completed
                        </h1>

                        <p className="mt-4 text-sm leading-6 text-base-content/60">
                            {error}
                        </p>


                        <div className="mt-8 flex flex-col gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    window.location.reload()
                                }
                                className="btn btn-primary"
                            >
                                Try Again
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/register/school_admin/verify"
                                    )
                                }
                                className="btn btn-ghost"
                            >
                                Back to Verification
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        );

    }



    //  Success State

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10 sm:py-16">

            <div className="mx-auto max-w-3xl">

                <div className="text-center">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-5xl">
                        🎉
                    </div>


                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Welcome to Smart School!
                    </h1>


                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
                        Your School Admin account has been
                        successfully created.
                    </p>

                </div>

                <div className="mx-auto mt-10 max-w-md">

                    <div className="flex items-center gap-3">

                        <div className="h-2 flex-1 rounded-full bg-success" />

                        <div className="h-2 flex-1 rounded-full bg-success" />

                        <div className="h-2 flex-1 rounded-full bg-success" />

                        <div className="h-2 flex-1 rounded-full bg-success" />
                        <div className="h-2 flex-1 rounded-full bg-success" />

                    </div>


                    <p className="mt-3 text-center text-xs text-success">
                        Registration completed
                    </p>

                </div>

                <div className="mt-10 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">

                    <h2 className="text-xl font-bold">
                        Your School
                    </h2>


                    <div className="mt-6 space-y-4">

                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">

                            <span className="text-sm text-base-content/50">
                                School
                            </span>

                            <span className="font-semibold">
                                {registrationData.school_name}
                            </span>

                        </div>


                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">

                            <span className="text-sm text-base-content/50">
                                Administrator
                            </span>

                            <span className="font-semibold">
                                {registrationData.first_name}{" "}
                                {registrationData.last_name}
                            </span>

                        </div>


                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">

                            <span className="text-sm text-base-content/50">
                                Email
                            </span>

                            <span className="break-all font-semibold">
                                {registrationData.email}
                            </span>

                        </div>


                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">

                            <span className="text-sm text-base-content/50">
                                Subscription
                            </span>

                            <span className="badge badge-success">
                                Free
                            </span>

                        </div>

                    </div>


                    {/* -----------------------------------------------------
                        Next Step
                    ----------------------------------------------------- */}

                    <div className="mt-8 rounded-2xl bg-base-200 p-5">

                        <h3 className="font-semibold">
                            What's next?
                        </h3>

                        <ul className="mt-4 space-y-3 text-sm text-base-content/70">

                            <li>
                                ✓ Set up your school profile
                            </li>

                            <li>
                                ✓ Add teachers and staff
                            </li>

                            <li>
                                ✓ Add students and parents
                            </li>

                            <li>
                                ✓ Configure academic settings
                            </li>

                        </ul>

                    </div>


                    {/* -----------------------------------------------------
                        Dashboard Button
                    ----------------------------------------------------- */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                        className="btn btn-primary mt-8 w-full"
                    >
                        Go to School Dashboard
                        <span>→</span>
                    </button>

                </div>


                {/* Security Note */}

                <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-5 text-base-content/50">
                    Your account has been verified and your
                    school has been successfully registered.
                </p>

            </div>

        </div>
    );
}

export default RegistrationComplete;