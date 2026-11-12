import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../../services/api.js";


function ViewTeacher() {

    const { teacherId } = useParams();

    const navigate = useNavigate();


    const [teacher, setTeacher] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Teacher
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        let cancelled = false;


        const loadTeacher = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await api.get(
                        `/teachers/${teacherId}`
                    );


                if (cancelled) {
                    return;
                }


                if (!response.data.success) {

                    setError(
                        response.data.message ||
                        "Unable to load teacher."
                    );

                    return;

                }


                setTeacher(
                    response.data.data
                );

            } catch (error) {

                if (cancelled) {
                    return;
                }


                console.error(
                    "Load teacher error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to load teacher."
                );

            } finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        };


        if (teacherId) {

            loadTeacher();

        }


        return () => {

            cancelled = true;

        };

    }, [teacherId]);


    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {

        navigate("/school-admin/teachers");

    };


    /*
    |--------------------------------------------------------------------------
    | Edit
    |--------------------------------------------------------------------------
    */

    const handleEdit = () => {

        navigate(
            `/school-admin/teachers/${teacherId}/edit`
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="min-h-screen bg-base-200">

                <div className="flex min-h-screen items-center justify-center">

                    <div className="flex flex-col items-center gap-4">

                        <span className="loading loading-spinner loading-lg text-primary" />

                        <p className="text-sm text-base-content/50">
                            Loading teacher profile...
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">

                <div className="mx-auto max-w-3xl">

                    <button
                        type="button"
                        onClick={handleBack}
                        className="btn btn-ghost mb-6 rounded-xl"
                    >
                        ← Back to Teachers
                    </button>


                    <div className="rounded-3xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 text-3xl">
                            ⚠️
                        </div>


                        <h1 className="mt-5 text-xl font-bold">
                            Unable to load teacher
                        </h1>


                        <p className="mt-2 text-sm text-base-content/60">
                            {error}
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                window.location.reload()
                            }
                            className="btn btn-primary mt-6 rounded-xl"
                        >
                            Try Again
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Teacher Not Found
    |--------------------------------------------------------------------------
    */

    if (!teacher) {

        return (

            <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">

                <div className="mx-auto max-w-3xl">

                    <button
                        type="button"
                        onClick={handleBack}
                        className="btn btn-ghost mb-6 rounded-xl"
                    >
                        ← Back to Teachers
                    </button>


                    <div className="rounded-3xl border border-base-300 bg-base-100 p-8 text-center">

                        <h1 className="text-xl font-bold">
                            Teacher not found
                        </h1>


                        <p className="mt-2 text-sm text-base-content/50">
                            The requested teacher could not be found.
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">

            <div className="mx-auto max-w-5xl">


                {/* =========================================================
                    TOP NAVIGATION
                ========================================================= */}

                <div className="mb-6 flex items-center justify-between gap-4">

                    <button
                        type="button"
                        onClick={handleBack}
                        className="btn btn-ghost rounded-xl"
                    >
                        ← Back to Teachers
                    </button>


                    <button
                        type="button"
                        onClick={handleEdit}
                        className="btn btn-primary rounded-xl"
                    >
                        ✏️ Edit Teacher
                    </button>

                </div>


                {/* =========================================================
                    PROFILE HEADER
                ========================================================= */}

                <div className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">

                    <div className="bg-primary/10 p-6 sm:p-8">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                            {/* Avatar */}

                            <TeacherAvatar
                                teacher={teacher}
                                large
                            />


                            {/* Name */}

                            <div className="flex-1">

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                                    <h1 className="text-2xl font-extrabold sm:text-3xl">

                                        {
                                            teacher.first_name
                                        }{" "}

                                        {
                                            teacher.last_name
                                        }

                                    </h1>


                                    <StatusBadge
                                        status={
                                            teacher.status
                                        }
                                    />

                                </div>


                                <p className="mt-2 text-sm text-base-content/60">

                                    {
                                        teacher.designation ||
                                        "Teacher"
                                    }

                                </p>


                                {teacher.teacher_id && (

                                    <p className="mt-2 font-mono text-xs text-base-content/50">

                                        Teacher ID:{" "}

                                        {
                                            teacher.teacher_id ||" Not provided"
                                        }

                                    </p>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                        BASIC INFORMATION
                    ===================================================== */}

                    <section className="p-6 sm:p-8">

                        <SectionTitle
                            icon="👤"
                            title="Personal Information"
                        />


                        <div className="mt-6 grid gap-5 sm:grid-cols-2">

                            <DetailItem
                                label="First Name"
                                value={
                                    teacher.first_name
                                }
                            />


                            <DetailItem
                                label="Last Name"
                                value={
                                    teacher.last_name
                                }
                            />


                            <DetailItem
                                label="Email Address"
                                value={
                                    teacher.email
                                }
                            />


                            <DetailItem
                                label="Phone Number"
                                value={
                                    teacher.phone
                                }
                            />


                            <DetailItem
                                label="Gender"
                                value={
                                    teacher.gender
                                }
                            />


                            <DetailItem
                                label="Date of Birth"
                                value={
                                    formatDate(
                                        teacher.date_of_birth
                                    )
                                }
                            />


                            <DetailItem
                                label="National ID"
                                value={
                                    teacher.nid
                                }
                            />


                            <DetailItem
                                label="Address"
                                value={
                                    teacher.address
                                }
                            />

                        </div>

                    </section>


                    <div className="divider mx-6 sm:mx-8" />


                    {/* =====================================================
                        PROFESSIONAL INFORMATION
                    ===================================================== */}

                    <section className="p-6 sm:p-8">

                        <SectionTitle
                            icon="🏫"
                            title="Professional Information"
                        />


                        <div className="mt-6 grid gap-5 sm:grid-cols-2">

                            <DetailItem
                                label="Employee ID"
                                value={
                                    teacher.employee_id || "Not provided"
                                }
                            />


                            <DetailItem
                                label="Designation"
                                value={
                                    teacher.designation
                                }
                            />


                            <DetailItem
                                label="Department"
                                value={
                                    teacher.department
                                }
                            />


                            <DetailItem
                                label="Subject"
                                value={
                                    teacher.subject
                                }
                            />


                            <DetailItem
                                label="Joining Date"
                                value={
                                    formatDate(
                                        teacher.joining_date
                                    )
                                }
                            />


                            <DetailItem
                                label="Employment Type"
                                value={
                                    teacher.employment_type
                                }
                            />


                            <DetailItem
                                label="Status"
                                value={
                                    teacher.status
                                }
                            />


                            <DetailItem
                                label="Teacher ID"
                                value={
                                    teacher.teacher_id || "Not provided"
                                }
                            />

                        </div>

                    </section>


                    <div className="divider mx-6 sm:mx-8" />


                    {/* =====================================================
                        ACADEMIC / ASSIGNMENT INFORMATION
                    ===================================================== */}

                    <section className="p-6 sm:p-8">

                        <SectionTitle
                            icon="📚"
                            title="Academic Assignment"
                        />


                        <div className="mt-6 grid gap-5 sm:grid-cols-2">

                            <DetailItem
                                label="Assigned Class"
                                value={
                                    teacher.class_name
                                }
                            />


                            <DetailItem
                                label="Class ID"
                                value={
                                    teacher.class_id
                                }
                            />


                            <DetailItem
                                label="Section"
                                value={
                                    teacher.section_name
                                }
                            />


                            <DetailItem
                                label="Section ID"
                                value={
                                    teacher.section_id
                                }
                            />

                        </div>

                    </section>


                    <div className="divider mx-6 sm:mx-8" />


                    {/* =====================================================
                        ACCOUNT INFORMATION
                    ===================================================== */}

                    <section className="p-6 sm:p-8">

                        <SectionTitle
                            icon="🔐"
                            title="Account Information"
                        />


                        <div className="mt-6 grid gap-5 sm:grid-cols-2">

                            <DetailItem
                                label="Firebase UID"
                                value={
                                    teacher.firebase_uid
                                }
                                mono
                            />


                            <DetailItem
                                label="Email Verified"
                                value={
                                    teacher.email_verified
                                        ? "Verified"
                                        : "Not verified"
                                }
                            />


                            <DetailItem
                                label="Created At"
                                value={
                                    formatDateTime(
                                        teacher.created_at
                                    )
                                }
                            />


                            <DetailItem
                                label="Updated At"
                                value={
                                    formatDateTime(
                                        teacher.updated_at
                                    )
                                }
                            />

                        </div>

                    </section>


                    {/* =====================================================
                        FOOTER ACTIONS
                    ===================================================== */}

                    <div className="border-t border-base-300 bg-base-200/50 p-6">

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={handleBack}
                                className="btn btn-ghost rounded-xl"
                            >
                                Back to Teachers
                            </button>


                            <button
                                type="button"
                                onClick={handleEdit}
                                className="btn btn-primary rounded-xl"
                            >
                                ✏️ Edit Teacher
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Section Title
|--------------------------------------------------------------------------
*/

function SectionTitle({
    icon,
    title,
}) {

    return (

        <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                {icon}
            </div>


            <h2 className="text-lg font-bold">
                {title}
            </h2>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Detail Item
|--------------------------------------------------------------------------
*/

function DetailItem({
    label,
    value,
    mono = false,
}) {

    return (

        <div className="rounded-xl border border-base-300 bg-base-200/30 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-base-content/40">
                {label}
            </p>


            <p
                className={`mt-2 break-words text-sm font-semibold ${
                    mono
                        ? "font-mono text-xs"
                        : ""
                }`}
            >

                {value || "Not provided"}

            </p>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Teacher Avatar
|--------------------------------------------------------------------------
*/

function TeacherAvatar({
    teacher,
    large = false,
}) {

    const first =
        teacher.first_name
            ?.charAt(0)
            ?.toUpperCase() || "T";


    const last =
        teacher.last_name
            ?.charAt(0)
            ?.toUpperCase() || "";


    return (

        <div
            className={`flex shrink-0 items-center justify-center rounded-2xl bg-primary font-bold text-primary-content ${
                large
                    ? "h-20 w-20 text-2xl"
                    : "h-11 w-11 text-sm"
            }`}
        >

            {first}
            {last}

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Status Badge
|--------------------------------------------------------------------------
*/

function StatusBadge({
    status,
}) {

    const statusClass = {

        active:
            "badge-success",

        invited:
            "badge-warning",

        inactive:
            "badge-ghost",

        suspended:
            "badge-error",

    }[status] || "badge-ghost";


    return (

        <span
            className={`badge ${statusClass} badge-sm`}
        >
            {status || "Unknown"}
        </span>

    );

}


/*
|--------------------------------------------------------------------------
| Date
|--------------------------------------------------------------------------
*/

function formatDate(
    value
) {

    if (!value) {
        return "Not provided";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

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


/*
|--------------------------------------------------------------------------
| Date + Time
|--------------------------------------------------------------------------
*/

function formatDateTime(
    value
) {

    if (!value) {
        return "Not provided";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

    }


    return date.toLocaleString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );

}


export default ViewTeacher;