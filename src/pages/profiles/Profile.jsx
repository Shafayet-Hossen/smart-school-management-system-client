import { useEffect, useState } from "react";

import DashboardHeader
    from "../../components/dashboard/DashboardHeader.jsx";

import DashboardSidebar
    from "../../components/dashboard/DashboardSidebar.jsx";

import api from "../../services/api.js";


function Profile({ user }) {

    const [profile, setProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Profile
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
                        "/profile"
                    );

                // console.log("Profile",response.data)
                if (!cancelled) {

                    setProfile(
                        response.data.data
                    );

                }

            } catch (error) {

                console.error(
                    "Profile loading error:",
                    error
                );


                if (!cancelled) {

                    setError(
                        error.response?.data?.message ||
                        "Unable to load your profile."
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

            <ProfileLayout
                user={user}
            >

                <div className="flex min-h-[400px] items-center justify-center">

                    <span className="loading loading-spinner loading-lg text-primary" />

                </div>

            </ProfileLayout>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <ProfileLayout
                user={user}
            >

                <div className="alert alert-error">

                    <span>
                        {error}
                    </span>

                </div>

            </ProfileLayout>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Determine Role
    |--------------------------------------------------------------------------
    */

    const role =
        profile?.role ||
        user?.role;


    /*
    |--------------------------------------------------------------------------
    | Render Role-Based Profile
    |--------------------------------------------------------------------------
    */

    return (

        <ProfileLayout
            user={user}
            role={role}
        >

            {role === "teacher" && (

                <TeacherProfile
                    profile={profile}
                />

            )}


            {role === "student" && (

                <StudentProfile
                    profile={profile}
                />

            )}


            {role === "parent" && (

                <ParentProfile
                    profile={profile}
                />

            )}


            {role === "school_admin" && (

                <SchoolAdminProfile
                    profile={profile}
                />

            )}


            {![
                "teacher",
                "student",
                "parent",
                "school_admin",
            ].includes(role) && (

                <div className="alert alert-warning">

                    <span>
                        Unknown user role.
                    </span>

                </div>

            )}

        </ProfileLayout>

    );

}


/*
|--------------------------------------------------------------------------
| Common Profile Layout
|--------------------------------------------------------------------------
*/

function ProfileLayout({
    // user,
    // role,
    children,
}) {

    return (

        <div className="min-h-screen bg-base-200">

            {/* <DashboardSidebar
                role={role}
            /> */}


            <div className="">

                {/* <DashboardHeader
                    user={user}
                /> */}


                <main className="p-4 sm:p-6 lg:p-8">

                    {children}

                </main>

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Teacher Profile
|--------------------------------------------------------------------------
*/

function TeacherProfile({
    profile,
}) {

    return (

        <>

            <ProfilePageHeader
                title="My Profile"
                description="View your personal and professional information."
                profile={profile}
            />


            <div className="mt-8 grid gap-6 lg:grid-cols-2">

                <ProfileSection
                    title="Personal Information"
                >

                    <ProfileField
                        label="First Name"
                        value={profile?.first_name}
                    />

                    <ProfileField
                        label="Last Name"
                        value={profile?.last_name}
                    />

                    <ProfileField
                        label="Email"
                        value={profile?.email}
                    />

                    <ProfileField
                        label="Phone"
                        value={profile?.phone}
                    />

                    <ProfileField
                        label="Gender"
                        value={profile?.gender}
                    />

                    <ProfileField
                        label="Date of Birth"
                        value={profile?.date_of_birth}
                    />

                </ProfileSection>


                <ProfileSection
                    title="Professional Information"
                >

                    <ProfileField
                        label="Employee ID"
                        value={profile?.employee_id}
                    />

                    <ProfileField
                        label="Designation"
                        value={profile?.designation}
                    />

                    <ProfileField
                        label="Department"
                        value={profile?.department}
                    />

                    <ProfileField
                        label="Subject"
                        value={profile?.subject}
                    />

                    <ProfileField
                        label="Qualification"
                        value={profile?.qualification}
                    />

                    <ProfileField
                        label="Joining Date"
                        value={profile?.joining_date}
                    />

                </ProfileSection>


                <ProfileSection
                    title="School Information"
                >

                    <ProfileField
                        label="School"
                        value={profile?.school?.name}
                    />

                    <ProfileField
                        label="EIIN"
                        value={profile?.school?.eiin}
                    />

                    <ProfileField
                        label="School Phone"
                        value={profile?.school?.phone}
                    />

                    <ProfileField
                        label="School Email"
                        value={profile?.school?.email}
                    />

                </ProfileSection>


                <ProfileSection
                    title="Account Information"
                >

                    <ProfileField
                        label="Role"
                        value="Teacher"
                    />

                    <ProfileField
                        label="Status"
                        value={profile?.status}
                    />

                    <ProfileField
                        label="Email Verification"
                        value={
                            profile?.email_verified
                                ? "Verified"
                                : "Not Verified"
                        }
                    />

                </ProfileSection>

            </div>

        </>

    );

}


/*
|--------------------------------------------------------------------------
| Student Profile
|--------------------------------------------------------------------------
*/

function StudentProfile({
    profile,
}) {

    return (

        <>

            <ProfilePageHeader
                title="My Profile"
                description="View your personal and academic information."
                profile={profile}
            />


            <div className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-6">

                <div className="grid gap-6 sm:grid-cols-2">

                    <ProfileField
                        label="First Name"
                        value={profile?.first_name}
                    />

                    <ProfileField
                        label="Last Name"
                        value={profile?.last_name}
                    />

                    <ProfileField
                        label="Email"
                        value={profile?.email}
                    />

                    <ProfileField
                        label="Phone"
                        value={profile?.phone}
                    />

                    <ProfileField
                        label="Class"
                        value={profile?.class?.name}
                    />

                    <ProfileField
                        label="Section"
                        value={profile?.section?.name}
                    />

                    <ProfileField
                        label="Roll Number"
                        value={profile?.roll_number}
                    />

                    <ProfileField
                        label="Student ID"
                        value={profile?.student_id}
                    />

                </div>

            </div>

        </>

    );

}


/*
|--------------------------------------------------------------------------
| Parent Profile
|--------------------------------------------------------------------------
*/

function ParentProfile({
    profile,
}) {

    return (

        <>

            <ProfilePageHeader
                title="My Profile"
                description="View your personal and contact information."
                profile={profile}
            />


            <div className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-6">

                <div className="grid gap-6 sm:grid-cols-2">

                    <ProfileField
                        label="First Name"
                        value={profile?.first_name}
                    />

                    <ProfileField
                        label="Last Name"
                        value={profile?.last_name}
                    />

                    <ProfileField
                        label="Email"
                        value={profile?.email}
                    />

                    <ProfileField
                        label="Phone"
                        value={profile?.phone}
                    />

                    <ProfileField
                        label="Occupation"
                        value={profile?.occupation}
                    />

                </div>

            </div>

        </>

    );

}


/*
|--------------------------------------------------------------------------
| School Admin Profile
|--------------------------------------------------------------------------
*/

function SchoolAdminProfile({
    profile,
}) {

    return (

        <>

            <ProfilePageHeader
                title="My Profile"
                description="View your administrator and school information."
                profile={profile}
            />


            <div className="mt-8 grid gap-6 lg:grid-cols-2">

                <ProfileSection
                    title="Personal Information"
                >

                    <ProfileField
                        label="First Name"
                        value={profile?.first_name}
                    />

                    <ProfileField
                        label="Last Name"
                        value={profile?.last_name}
                    />

                    <ProfileField
                        label="Email"
                        value={profile?.email}
                    />

                    <ProfileField
                        label="Phone"
                        value={profile?.phone}
                    />

                </ProfileSection>


                <ProfileSection
                    title="School Information"
                >

                    <ProfileField
                        label="School"
                        value={profile?.school?.name}
                    />

                    <ProfileField
                        label="EIIN"
                        value={profile?.school?.eiin}
                    />

                    <ProfileField
                        label="School Email"
                        value={profile?.school?.email}
                    />

                </ProfileSection>

            </div>

        </>

    );

}


/*
|--------------------------------------------------------------------------
| Profile Header
|--------------------------------------------------------------------------
*/

function ProfilePageHeader({
    title,
    description,
    profile,
}) {

    return (

        <div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-content">

                    {getInitials(profile)}

                </div>


                <div>

                    <h1 className="text-2xl font-bold sm:text-3xl">
                        {title}
                    </h1>


                    <p className="mt-2 text-sm text-base-content/60">
                        {description}
                    </p>

                </div>

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Profile Section
|--------------------------------------------------------------------------
*/

function ProfileSection({
    title,
    children,
}) {

    return (

        <section className="rounded-2xl border border-base-300 bg-base-100">

            <div className="border-b border-base-300 p-6">

                <h2 className="text-lg font-bold">
                    {title}
                </h2>

            </div>


            <div className="grid gap-6 p-6 sm:grid-cols-2">

                {children}

            </div>

        </section>

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
| Initials
|--------------------------------------------------------------------------
*/

function getInitials(profile) {

    if (!profile) {
        return "U";
    }


    const first =
        profile.first_name?.[0] || "";

    const last =
        profile.last_name?.[0] || "";


    return (
        first +
        last
    )
        .toUpperCase() || "U";

}


export default Profile;

