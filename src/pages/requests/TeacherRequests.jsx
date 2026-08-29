import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";


function TeacherRequests() {

    const navigate = useNavigate();

    const { user } = useAuth();

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Load Teacher Requests
    |--------------------------------------------------------------------------
    */

    const loadRequests = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await api.get(
                    "/school-admin/requests/teachers"
                );
            
            console.log("TeacherRequests:",response.data.data)

            if (response.data.success) {

                setRequests(
                    response.data.data || []
                );

            }


        } catch (error) {

            console.error(
                "Teacher request loading error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to load teacher requests."
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Load on Mount
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!user) {
            return;
        }

        loadRequests();

    }, [user]);


    /*
    |--------------------------------------------------------------------------
    | Approve Teacher
    |--------------------------------------------------------------------------
    */

    const handleApprove = async (
        requestId
    ) => {

        try {
            console.log("requestId:",requestId)
            setActionLoading(requestId);

            setError("");


            const response =
                await api.patch(
                    `/school-admin/requests/teachers/${requestId}/approve`
                );


            if (response.data.success) {

                setRequests(
                    previous =>
                        previous.filter(
                            request =>
                                request._id !==
                                requestId
                        )
                );

            }


        } catch (error) {

            console.error(
                "Teacher approval error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to approve teacher request."
            );

        } finally {

            setActionLoading(null);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Reject Teacher
    |--------------------------------------------------------------------------
    */

    const handleReject = async (
        requestId
    ) => {

        const reason =
            window.prompt(
                "Why are you rejecting this request?"
            );


        if (reason === null) {
            return;
        }


        try {

            setActionLoading(requestId);

            setError("");


            const response =
                await api.patch(
                    `/school-admin/requests/teachers/${requestId}/reject`,
                    {
                        reason:
                            reason.trim() ||
                            "Request rejected by school administrator.",
                    }
                );


            if (response.data.success) {

                setRequests(
                    previous =>
                        previous.filter(
                            request =>
                                request._id !==
                                requestId
                        )
                );

            }


        } catch (error) {

            console.error(
                "Teacher rejection error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to reject teacher request."
            );

        } finally {

            setActionLoading(null);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {

        navigate("/dashboard");

    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-base-200">

                <span className="loading loading-spinner loading-lg text-primary" />

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <div className="min-h-screen bg-base-200">


            {/* =========================================================
                HEADER
            ========================================================= */}

            <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100">

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

                    <div>

                        <button
                            onClick={handleBack}
                            className="text-sm font-medium text-base-content/50 hover:text-primary"
                        >
                            ← Dashboard
                        </button>

                    </div>


                    <div>

                        <h1 className="font-bold">
                            Teacher Requests
                        </h1>

                    </div>


                    <div className="w-20" />

                </div>

            </header>


            {/* =========================================================
                CONTENT
            ========================================================= */}

            <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">


                {/* Page Header */}

                <div className="mb-8">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div>

                            <h1 className="text-2xl font-extrabold sm:text-3xl">
                                Teacher Requests
                            </h1>

                            <p className="mt-2 text-sm text-base-content/60">
                                Review teachers who want to
                                join your school.
                            </p>

                        </div>


                        <div className="badge badge-primary badge-lg">

                            {requests.length} Pending

                        </div>

                    </div>

                </div>


                {/* Error */}

                {error && (

                    <div className="alert alert-error mb-6">

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* =====================================================
                    EMPTY STATE
                ===================================================== */}

                {requests.length === 0 && (

                    <div className="rounded-3xl border border-base-300 bg-base-100 p-12 text-center shadow-sm">

                        <div className="text-5xl">
                            👨‍🏫
                        </div>

                        <h2 className="mt-5 text-xl font-bold">
                            No Pending Teacher Requests
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-base-content/50">
                            New teacher registration requests
                            will appear here when teachers
                            select your school.
                        </p>

                    </div>

                )}


                {/* =====================================================
                    REQUEST LIST
                ===================================================== */}

                {requests.length > 0 && (

                    <div className="space-y-4">

                        {requests.map(
                            (request) => (

                                <TeacherRequestCard
                                    key={
                                        request._id
                                    }
                                    request={
                                        request
                                    }
                                    actionLoading={
                                        actionLoading
                                    }
                                    onApprove={
                                        handleApprove
                                    }
                                    onReject={
                                        handleReject
                                    }
                                />

                            )
                        )}

                    </div>

                )}

            </main>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Teacher Request Card
|--------------------------------------------------------------------------
*/

function TeacherRequestCard({
    request,
    actionLoading,
    onApprove,
    onReject,
}) {

    const isLoading =
        actionLoading === request._id;


    const fullName =
        [
            request.first_name,
            request.last_name,
        ]
            .filter(Boolean)
            .join(" ");


    return (

        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">


            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">


                {/* =================================================
                    TEACHER INFO
                ================================================= */}

                <div className="flex items-start gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">

                        👨‍🏫

                    </div>


                    <div className="min-w-0">

                        <h2 className="text-lg font-bold">

                            {fullName ||
                                "Unknown Teacher"}

                        </h2>


                        <p className="mt-1 text-sm text-base-content/60">

                            {request.email ||
                                "No email available"}

                        </p>


                        {request.phone && (

                            <p className="mt-1 text-xs text-base-content/50">

                                📞 {request.phone}

                            </p>

                        )}

                    </div>

                </div>


                {/* =================================================
                    DETAILS
                ================================================= */}

                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[450px]">

                    <InfoItem
                        label="Subject"
                        value={
                            request.subject ||
                            "Not specified"
                        }
                    />

                    <InfoItem
                        label="Requested"
                        value={
                            formatDate(
                                request.created_at
                            )
                        }
                    />

                    <InfoItem
                        label="Status"
                        value="Pending"
                    />

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="flex gap-3 lg:min-w-[210px] lg:justify-end">

                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                            onReject(
                                request._id
                            )
                        }
                        className="btn btn-outline btn-error flex-1 sm:flex-none"
                    >

                        {isLoading ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : (
                            "Reject"
                        )}

                    </button>


                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                            onApprove(
                                request._id
                            )
                        }
                        className="btn btn-primary flex-1 sm:flex-none"
                    >

                        {isLoading ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : (
                            "Approve"
                        )}

                    </button>

                </div>

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Info Item
|--------------------------------------------------------------------------
*/

function InfoItem({
    label,
    value,
}) {

    return (

        <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/40">
                {label}
            </p>

            <p className="mt-1 truncate text-sm font-medium">
                {value}
            </p>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Date Formatter
|--------------------------------------------------------------------------
*/

function formatDate(
    value
) {

    if (!value) {
        return "—";
    }


    try {

        return new Date(value)
            .toLocaleDateString(
                "en-BD",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }
            );

    } catch {

        return "—";

    }

}


export default TeacherRequests;