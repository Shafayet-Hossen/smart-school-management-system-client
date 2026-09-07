import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../../services/api.js";

function Teachers() {

    const navigate = useNavigate();


    const [teachers, setTeachers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");


    /*
    |--------------------------------------------------------------------------
    | Load Teachers
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        let cancelled = false;


        const loadTeachers = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await api.get(
                        "/teachers"
                    );

                console.log("Teachers response:", response.data);

                if (cancelled) {
                    return;
                }


                if (
                    !response.data.success
                ) {

                    setError(
                        response.data.message ||
                        "Unable to load teachers."
                    );

                    return;

                }


                setTeachers(
                    response.data.data || []
                );

            } catch (error) {

                if (cancelled) {
                    return;
                }


                console.error(
                    "Load teachers error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to load teachers."
                );

            } finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        };


        loadTeachers();


        return () => {

            cancelled = true;

        };

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Filter Teachers
    |--------------------------------------------------------------------------
    */

    const filteredTeachers =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            return teachers.filter(
                (teacher) => {

                    /*
                    |------------------------------------------------------------------
                    | Status filter
                    |------------------------------------------------------------------
                    */

                    if (
                        statusFilter !==
                        "all" &&
                        teacher.status !==
                        statusFilter
                    ) {

                        return false;

                    }


                    /*
                    |------------------------------------------------------------------
                    | Search
                    |------------------------------------------------------------------
                    */

                    if (!searchValue) {

                        return true;

                    }


                    const searchableText = [

                        teacher.first_name,

                        teacher.last_name,

                        teacher.email,

                        teacher.phone,

                        teacher.teacher_id,

                        teacher.subject,

                        teacher.department,

                        teacher.designation,

                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                    return searchableText.includes(
                        searchValue
                    );

                }
            );

        }, [
            teachers,
            search,
            statusFilter,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Status Badge
    |--------------------------------------------------------------------------
    */

    const getStatusBadge = (
        status
    ) => {

        switch (status) {

            case "active":

                return (
                    <span className="badge badge-success badge-sm">
                        Active
                    </span>
                );


            case "invited":

                return (
                    <span className="badge badge-warning badge-sm">
                        Invited
                    </span>
                );


            case "inactive":

                return (
                    <span className="badge badge-ghost badge-sm">
                        Inactive
                    </span>
                );


            case "suspended":

                return (
                    <span className="badge badge-error badge-sm">
                        Suspended
                    </span>
                );


            default:

                return (
                    <span className="badge badge-ghost badge-sm">
                        {status || "Unknown"}
                    </span>
                );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | View Teacher
    |--------------------------------------------------------------------------
    */

    const handleView = (
        teacher
    ) => {

        navigate(
            `/teachers/${teacher._id}`
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Edit Teacher
    |--------------------------------------------------------------------------
    */

    const handleEdit = (
        teacher
    ) => {

        navigate(
            `/teachers/${teacher._id}/edit`
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Add Teacher
    |--------------------------------------------------------------------------
    */

    const handleAddTeacher = () => {

        navigate(
            "/teachers/add"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Retry
    |--------------------------------------------------------------------------
    */

    const handleRetry = () => {

        window.location.reload();

    };

    const handleBack = () => {

        navigate("/dashboard");

    };



    return (

        <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
            <button
                type="button"
                onClick={handleBack}
                className="btn btn-ghost rounded-xl"
            >
                ← Back to dashboard
            </button>
            <div className="mx-auto max-w-7xl">


                {/* =========================================================
                    HEADER
                ========================================================= */}

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-2xl text-primary-content">
                                👨‍🏫
                            </div>


                            <div>

                                <h1 className="text-2xl font-bold sm:text-3xl">
                                    Teachers
                                </h1>


                                <p className="mt-1 text-sm text-base-content/60">
                                    Manage teachers in your school.
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={handleAddTeacher}
                        className="btn btn-primary rounded-xl"
                    >

                        <span className="text-lg">
                            +
                        </span>

                        Add Teacher

                    </button>

                </div>


                {/* =========================================================
                    SUMMARY CARDS
                ========================================================= */}

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <SummaryCard
                        title="Total Teachers"
                        value={teachers.length}
                        icon="👨‍🏫"
                    />


                    <SummaryCard
                        title="Active"
                        value={
                            teachers.filter(
                                (teacher) =>
                                    teacher.status ===
                                    "active"
                            ).length
                        }
                        icon="✅"
                    />


                    <SummaryCard
                        title="Invited"
                        value={
                            teachers.filter(
                                (teacher) =>
                                    teacher.status ===
                                    "invited"
                            ).length
                        }
                        icon="📨"
                    />


                    <SummaryCard
                        title="Inactive"
                        value={
                            teachers.filter(
                                (teacher) =>
                                    teacher.status ===
                                    "inactive"
                            ).length
                        }
                        icon="⏸️"
                    />

                </div>


                {/* =========================================================
                    MAIN CARD
                ========================================================= */}

                <div className="mt-8 rounded-3xl border border-base-300 bg-base-100 shadow-sm">


                    {/* =====================================================
                        FILTER BAR
                    ===================================================== */}

                    <div className="border-b border-base-300 p-4 sm:p-5">

                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">


                            {/* Search */}

                            <div className="relative w-full lg:max-w-md">

                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                                    🔍
                                </span>


                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search teachers..."
                                    className="input input-bordered h-11 w-full rounded-xl pl-11"
                                />

                            </div>


                            {/* Status */}

                            <div className="flex items-center gap-2">

                                <span className="text-sm text-base-content/50">
                                    Status:
                                </span>


                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(
                                            event.target.value
                                        )
                                    }
                                    className="select select-bordered h-11 rounded-xl"
                                >

                                    <option value="all">
                                        All
                                    </option>

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="invited">
                                        Invited
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>

                                    <option value="suspended">
                                        Suspended
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                        ERROR
                    ===================================================== */}

                    {error && (

                        <div className="m-5 alert alert-error">

                            <div>

                                <p className="font-semibold">
                                    Unable to load teachers
                                </p>

                                <p className="text-sm">
                                    {error}
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={handleRetry}
                                className="btn btn-sm"
                            >
                                Retry
                            </button>

                        </div>

                    )}


                    {/* =====================================================
                        LOADING
                    ===================================================== */}

                    {loading && (

                        <div className="flex min-h-64 items-center justify-center">

                            <div className="flex flex-col items-center gap-3">

                                <span className="loading loading-spinner loading-lg text-primary" />

                                <p className="text-sm text-base-content/50">
                                    Loading teachers...
                                </p>

                            </div>

                        </div>

                    )}


                    {/* =====================================================
                        EMPTY
                    ===================================================== */}

                    {!loading &&
                        !error &&
                        filteredTeachers.length === 0 && (

                            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">

                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-3xl">
                                    👨‍🏫
                                </div>


                                <h2 className="mt-5 text-lg font-bold">
                                    {teachers.length === 0
                                        ? "No teachers yet"
                                        : "No teachers found"}
                                </h2>


                                <p className="mt-2 max-w-md text-sm leading-6 text-base-content/50">

                                    {teachers.length === 0
                                        ? "Start by adding a teacher to your school."
                                        : "Try changing your search or status filter."}

                                </p>


                                {teachers.length === 0 && (

                                    <button
                                        type="button"
                                        onClick={handleAddTeacher}
                                        className="btn btn-primary mt-5 rounded-xl"
                                    >
                                        + Add Teacher
                                    </button>

                                )}

                            </div>

                        )}


                    {/* =====================================================
                        DESKTOP TABLE
                    ===================================================== */}

                    {!loading &&
                        !error &&
                        filteredTeachers.length > 0 && (

                            <div className="hidden overflow-x-auto lg:block">

                                <table className="table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Teacher
                                            </th>

                                            <th>
                                                Employee ID
                                            </th>

                                            <th>
                                                Contact
                                            </th>

                                            <th>
                                                Subject
                                            </th>

                                            <th>
                                                Department
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {filteredTeachers.map(
                                            (teacher) => (

                                                <tr
                                                    key={
                                                        teacher._id
                                                    }
                                                    className="hover"
                                                >

                                                    {/* Teacher */}

                                                    <td>

                                                        <div className="flex items-center gap-3">

                                                            <TeacherAvatar
                                                                teacher={
                                                                    teacher
                                                                }
                                                            />


                                                            <div>

                                                                <p className="font-semibold">

                                                                    {
                                                                        teacher.first_name
                                                                    }{" "}

                                                                    {
                                                                        teacher.last_name
                                                                    }

                                                                </p>


                                                                {teacher.designation && (

                                                                    <p className="text-xs text-base-content/50">

                                                                        {
                                                                            teacher.designation
                                                                        }

                                                                    </p>

                                                                )}

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* Employee ID */}

                                                    <td>

                                                        <span className="font-mono text-sm">

                                                            {
                                                                teacher.teacher_id ||
                                                                "—"
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* Contact */}

                                                    <td>

                                                        <p className="text-sm">

                                                            {
                                                                teacher.email ||
                                                                "—"
                                                            }

                                                        </p>


                                                        <p className="mt-1 text-xs text-base-content/50">

                                                            {
                                                                teacher.phone ||
                                                                "—"
                                                            }

                                                        </p>

                                                    </td>


                                                    {/* Subject */}

                                                    <td>

                                                        {
                                                            teacher.subject ||
                                                            "—"
                                                        }

                                                    </td>


                                                    {/* Department */}

                                                    <td>

                                                        {
                                                            teacher.department ||
                                                            "—"
                                                        }

                                                    </td>


                                                    {/* Status */}

                                                    <td>

                                                        {getStatusBadge(
                                                            teacher.status
                                                        )}

                                                    </td>


                                                    {/* Actions */}

                                                    <td>

                                                        <div className="flex items-center gap-1">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleView(
                                                                        teacher
                                                                    )
                                                                }
                                                                className="btn btn-ghost btn-sm"
                                                            >
                                                                View
                                                            </button>


                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        teacher
                                                                    )
                                                                }
                                                                className="btn btn-ghost btn-sm text-primary"
                                                            >
                                                                Edit
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}


                    {/* =====================================================
                        MOBILE / TABLET CARDS
                    ===================================================== */}

                    {!loading &&
                        !error &&
                        filteredTeachers.length > 0 && (

                            <div className="space-y-4 p-4 lg:hidden">

                                {filteredTeachers.map(
                                    (teacher) => (

                                        <div
                                            key={
                                                teacher._id
                                            }
                                            className="rounded-2xl border border-base-300 p-4"
                                        >

                                            <div className="flex items-start justify-between gap-3">

                                                <div className="flex min-w-0 items-center gap-3">

                                                    <TeacherAvatar
                                                        teacher={
                                                            teacher
                                                        }
                                                    />


                                                    <div className="min-w-0">

                                                        <h3 className="truncate font-bold">

                                                            {
                                                                teacher.first_name
                                                            }{" "}

                                                            {
                                                                teacher.last_name
                                                            }

                                                        </h3>


                                                        <p className="mt-1 truncate text-xs text-base-content/50">

                                                            {
                                                                teacher.designation ||
                                                                "Teacher"
                                                            }

                                                        </p>

                                                    </div>

                                                </div>


                                                {getStatusBadge(
                                                    teacher.status
                                                )}

                                            </div>


                                            <div className="mt-4 grid gap-3 text-sm">

                                                <InfoRow
                                                    label="Teacher ID"
                                                    value={
                                                        teacher.teacher_id
                                                    }
                                                />


                                                <InfoRow
                                                    label="Email"
                                                    value={
                                                        teacher.email
                                                    }
                                                />


                                                <InfoRow
                                                    label="Phone"
                                                    value={
                                                        teacher.phone
                                                    }
                                                />


                                                <InfoRow
                                                    label="Subject"
                                                    value={
                                                        teacher.subject
                                                    }
                                                />


                                                <InfoRow
                                                    label="Department"
                                                    value={
                                                        teacher.department
                                                    }
                                                />

                                            </div>


                                            <div className="mt-4 flex gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleView(
                                                            teacher
                                                        )
                                                    }
                                                    className="btn btn-outline btn-sm flex-1 rounded-xl"
                                                >
                                                    View
                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            teacher
                                                        )
                                                    }
                                                    className="btn btn-primary btn-sm flex-1 rounded-xl"
                                                >
                                                    Edit
                                                </button>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </div>


                {/* =========================================================
                    RESULT COUNT
                ========================================================= */}

                {!loading &&
                    !error &&
                    teachers.length > 0 && (

                        <p className="mt-4 text-center text-xs text-base-content/40">

                            Showing{" "}
                            <span className="font-semibold">
                                {filteredTeachers.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold">
                                {teachers.length}
                            </span>{" "}
                            teachers

                        </p>

                    )}

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Summary Card
|--------------------------------------------------------------------------
*/

function SummaryCard({
    title,
    value,
    icon,
}) {

    return (

        <div className="rounded-2xl border border-base-300 bg-base-100 p-5">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-base-content/50">
                        {title}
                    </p>


                    <p className="mt-2 text-3xl font-bold">
                        {value}
                    </p>

                </div>


                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl">
                    {icon}
                </div>

            </div>

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

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-content">

            {first}
            {last}

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Info Row
|--------------------------------------------------------------------------
*/

function InfoRow({
    label,
    value,
}) {

    return (

        <div className="flex items-start justify-between gap-4">

            <span className="text-base-content/50">
                {label}
            </span>


            <span className="text-right font-medium">

                {value || "—"}

            </span>

        </div>

    );

}


export default Teachers;

