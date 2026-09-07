import { useEffect, useState } from "react";

import DashboardHeader
    from "../../components/dashboard/DashboardHeader.jsx";

import DashboardSidebar
    from "../../components/dashboard/DashboardSidebar.jsx";

import api from "../../services/api.js";


function TeacherProfile({ user }) {

    const [profile, setProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Teacher Profile
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        let cancelled = false;


        const loadProfile = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await api.get(
                        "/teachers/profile"
                    );


                if (!cancelled) {

                    setProfile(
                        response.data.data
                    );

                }

            } catch (error) {

                console.error(
                    "Teacher profile error:",
                    error
                );


                if (!cancelled) {

                    setError(
                        error.response?.data?.message ||
                        "Unable to load teacher profile."
                    );

                }

            } finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        };


        loadProfile();


        return () => {

            cancelled = true;

        };

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <DashboardLayout user={user}>

                <div className="flex min-h-[400px] items-center justify-center">

                    <span className="loading loading-spinner loading-lg text-primary" />

                </div>

            </DashboardLayout>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <DashboardLayout user={user}>

                <div className="alert alert-error">

                    <span>
                        {error}
                    </span>

                </div>

            </DashboardLayout>

        );

    }


    return (

        <DashboardLayout user={user}>

            {/* =========================================================
                PAGE HEADER
            ========================================================= */}

            <div>

                <h1 className="text-2xl font-bold sm:text-3xl">
                    My Profile
                </h1>

                <p className="mt-2 text-sm text-base-content/60">
                    View your personal, professional and school
                    information.
                </p>

            </div>


            {/* =========================================================
                PROFILE HEADER
            ========================================================= */}

            <div className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                    {/* Avatar */}

                    <div className="avatar placeholder">

                        <div className="w-24 rounded-full bg-primary text-primary-content">

                            <span className="text-3xl font-bold">
                                {getInitials(profile)}
                            </span>

                        </div>

                    </div>


                    {/* Name */}

                    <div className="flex-1">

                        <h2 className="text-2xl font-bold">

                            {getFullName(profile)}

                        </h2>


                        <p className="mt-1 text-sm text-base-content/50">

                            {profile?.email}

                        </p>


                        <div className="mt-3">

                            <span className="badge badge-primary">

                                Teacher

                            </span>

                        </div>

                    </div>


                    {/* Edit */}

                    <button
                        type="button"
                        className="btn btn-primary rounded-xl"
                    >
                        Edit Profile
                    </button>

                </div>

            </div>


            {/* =========================================================
                PERSONAL INFORMATION
            ========================================================= */}

            <div className="mt-6 rounded-2xl border border-base-300 bg-base-100">

                <div className="border-b border-base-300 p-6">

                    <h2 className="text-lg font-bold">
                        Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-base-content/50">
                        Your basic personal information.
                    </p>

                </div>


                <div className="grid gap-6 p-6 sm:grid-cols-2">


                    <ProfileField
                        label="First Name"
                        value={
                            profile?.first_name
                        }
                    />


                    <ProfileField
                        label="Last Name"
                        value={
                            profile?.last_name
                        }
                    />


                    <ProfileField
                        label="Email"
                        value={
                            profile?.email
                        }
                    />


                    <ProfileField
                        label="Phone"
                        value={
                            profile?.phone
                        }
                    />


                    <ProfileField
                        label="Gender"
                        value={
                            profile?.gender
                        }
                    />


                    <ProfileField
                        label="Date of Birth"
                        value={
                            formatDate(
                                profile?.date_of_birth
                            )
                        }
                    />


                </div>

            </div>


            {/* =========================================================
                PROFESSIONAL INFORMATION
            ========================================================= */}

            <div className="mt-6 rounded-2xl border border-base-300 bg-base-100">

                <div className="border-b border-base-300 p-6">

                    <h2 className="text-lg font-bold">
                        Professional Information
                    </h2>

                    <p className="mt-1 text-sm text-base-content/50">
                        Your teaching and professional information.
                    </p>

                </div>


                <div className="grid gap-6 p-6 sm:grid-cols-2">


                    <ProfileField
                        label="Employee ID"
                        value={
                            profile?.employee_id
                        }
                    />


                    <ProfileField
                        label="Designation"
                        value={
                            profile?.designation
                        }
                    />


                    <ProfileField
                        label="Department"
                        value={
                            profile?.department
                        }
                    />


                    <ProfileField
                        label="Subject"
                        value={
                            profile?.subject
                        }
                    />


                    <ProfileField
                        label="Joining Date"
                        value={
                            formatDate(
                                profile?.joining_date
                            )
                        }
                    />


                    <ProfileField
                        label="Qualification"
                        value={
                            profile?.qualification
                        }
                    />


                </div>

            </div>


            {/* =========================================================
                SCHOOL INFORMATION
            ========================================================= */}

            <div className="mt-6 rounded-2xl border border-base-300 bg-base-100">

                <div className="border-b border-base-300 p-6">

                    <h2 className="text-lg font-bold">
                        School Information
                    </h2>

                    <p className="mt-1 text-sm text-base-content/50">
                        The school where you are registered.
                    </p>

                </div>


                <div className="grid gap-6 p-6 sm:grid-cols-2">


                    <ProfileField
                        label="School Name"
                        value={
                            profile?.school?.name
                        }
                    />


                    <ProfileField
                        label="EIIN"
                        value={
                            profile?.school?.eiin
                        }
                    />


                    <ProfileField
                        label="School Phone"
                        value={
                            profile?.school?.phone
                        }
                    />


                    <ProfileField
                        label="School Email"
                        value={
                            profile?.school?.email
                        }
                    />


                </div>

            </div>


            {/* =========================================================
                ACCOUNT INFORMATION
            ========================================================= */}

            <div className="mt-6 rounded-2xl border border-base-300 bg-base-100">

                <div className="border-b border-base-300 p-6">

                    <h2 className="text-lg font-bold">
                        Account Information
                    </h2>

                </div>


                <div className="grid gap-6 p-6 sm:grid-cols-2">


                    <ProfileField
                        label="Account Status"
                        value={
                            profile?.status
                        }
                    />


                    <ProfileField
                        label="Email Verification"
                        value={
                            profile?.email_verified
                                ? "Verified"
                                : "Not Verified"
                        }
                    />


                    <ProfileField
                        label="Role"
                        value="Teacher"
                    />


                    <ProfileField
                        label="Created At"
                        value={
                            formatDate(
                                profile?.created_at
                            )
                        }
                    />


                </div>

            </div>

        </DashboardLayout>

    );

}


/*
|--------------------------------------------------------------------------
| Dashboard Layout
|--------------------------------------------------------------------------
*/

function DashboardLayout({
    user,
    children,
}) {

    return (

        <div className="min-h-screen bg-base-200">

            <DashboardSidebar
                role="teacher"
            />


            <div className="lg:pl-72">

                <DashboardHeader
                    user={user}
                />


                <main className="p-4 sm:p-6 lg:p-8">

                    {children}

                </main>

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Profile Field
|--------------------------------------------------------------------------
*/

function ProfileField({
    label,
    value,
}) {

    return (

        <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/40">
                {label}
            </p>


            <p className="mt-2 text-sm font-medium">

                {value || "Not provided"}

            </p>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Full Name
|--------------------------------------------------------------------------
*/

function getFullName(profile) {

    if (!profile) {
        return "Teacher";
    }


    return [
        profile.first_name,
        profile.last_name,
    ]
        .filter(Boolean)
        .join(" ") || "Teacher";

}


/*
|--------------------------------------------------------------------------
| Initials
|--------------------------------------------------------------------------
*/

function getInitials(profile) {

    const name =
        getFullName(profile);


    const parts =
        name.split(" ");


    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();

}


/*
|--------------------------------------------------------------------------
| Date Formatter
|--------------------------------------------------------------------------
*/

function formatDate(value) {

    if (!value) {
        return "Not provided";
    }


    const date =
        new Date(value);


    if (Number.isNaN(date.getTime())) {
        return "Not provided";
    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );

}


export default TeacherProfile;
