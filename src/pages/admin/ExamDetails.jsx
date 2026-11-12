
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getExamDetails } from "../../services/schoolAdminExamService";

const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};

const formatTime = (time) => {
    if (!time) return "N/A";

    const [hours, minutes] = time.split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getStatusClass = (status) => {
    const classes = {
        scheduled: "badge-info",
        ongoing: "badge-warning",
        completed: "badge-success",
        cancelled: "badge-error",
    };

    return classes[status] || "badge-ghost";
};

const getExamTypeLabel = (type) => {
    const labels = {
        class_test: "Class Test",
        monthly: "Monthly Examination",
        terminal: "Terminal Examination",
        half_yearly: "Half Yearly",
        annual: "Annual Examination",
        model_test: "Model Test",
        other: "Other",
    };

    return labels[type] || type || "N/A";
};

const ExamDetails = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["school-admin-exam-details", examId],
        queryFn: () => getExamDetails(examId),
        enabled: Boolean(examId),
    });

    const exam = data?.exam;

    const schedules = useMemo(
        () => exam?.schedules || [],
        [exam?.schedules]
    );

    const totalSubjects = schedules.length;

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (isError || !exam) {
        return (
            <div className="p-6">
                <div className="mx-auto max-w-2xl rounded-2xl border border-error/20 bg-base-100 p-8 text-center shadow-sm">
                    <div className="text-5xl">⚠️</div>

                    <h2 className="mt-4 text-xl font-bold">
                        Unable to Load Examination
                    </h2>

                    <p className="mt-2 text-sm text-base-content/60">
                        {error?.response?.data?.message ||
                            error?.message ||
                            "Examination details could not be found."}
                    </p>

                    <div className="mt-6 flex justify-center gap-3">
                        <button
                            onClick={() => refetch()}
                            className="btn btn-primary btn-sm"
                        >
                            Try Again
                        </button>

                        <button
                            onClick={() => navigate("/exams")}
                            className="btn btn-outline btn-sm"
                        >
                            Back to Exams
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                    <div className="flex items-center gap-2 text-sm text-base-content/50">
                        <button
                            onClick={() => navigate("/exams")}
                            className="hover:text-primary"
                        >
                            Examinations
                        </button>

                        <span>/</span>

                        <span>Details</span>
                    </div>

                    <h1 className="mt-2 text-2xl font-bold md:text-3xl">
                        Examination Details
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        View examination information and timetable.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => navigate("/exams")}
                        className="btn btn-outline btn-sm"
                    >
                        ← Back
                    </button>
                </div>

            </div>

            {/* =====================================================
                EXAMINATION OVERVIEW
            ===================================================== */}

            <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm md:p-7">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                            Examination Name
                        </p>

                        <h2 className="mt-2 text-2xl font-bold">
                            {exam.name || exam.examination_name || "Untitled Examination"}
                        </h2>

                        <p className="mt-2 text-sm text-base-content/60">
                            Academic Year: {exam.academic_year || "N/A"}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className={`badge ${getStatusClass(exam.status)} badge-lg`}>
                            {exam.status || "Unknown"}
                        </span>

                        <span className="badge badge-outline badge-lg">
                            {getExamTypeLabel(exam.exam_type)}
                        </span>
                    </div>

                </div>

                <div className="my-6 border-t border-base-300" />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div>
                        <p className="text-xs text-base-content/50">
                            Start Date
                        </p>

                        <p className="mt-1 font-semibold">
                            {formatDate(exam.start_date)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-base-content/50">
                            End Date
                        </p>

                        <p className="mt-1 font-semibold">
                            {formatDate(exam.end_date)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-base-content/50">
                            Total Subjects
                        </p>

                        <p className="mt-1 font-semibold">
                            {totalSubjects}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-base-content/50">
                            Created Date
                        </p>

                        <p className="mt-1 font-semibold">
                            {exam.created_at
                                ? new Date(exam.created_at).toLocaleDateString("en-GB")
                                : "N/A"}
                        </p>
                    </div>

                </div>

                {exam.description && (
                    <>
                        <div className="my-6 border-t border-base-300" />

                        <div>
                            <p className="text-xs text-base-content/50">
                                Description
                            </p>

                            <p className="mt-2 text-sm leading-6">
                                {exam.description}
                            </p>
                        </div>
                    </>
                )}

            </div>

            {/* =====================================================
                TIMETABLE
            ===================================================== */}

            <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">

                <div className="flex flex-col justify-between gap-2 border-b border-base-300 p-5 sm:flex-row sm:items-center">

                    <div>
                        <h2 className="text-lg font-bold">
                            Examination Timetable
                        </h2>

                        <p className="mt-1 text-xs text-base-content/50">
                            Complete subject-wise examination schedule.
                        </p>
                    </div>

                    <span className="badge badge-primary badge-outline">
                        {totalSubjects} Entries
                    </span>

                </div>

                {schedules.length === 0 ? (
                    <div className="p-10 text-center">
                        <p className="text-base-content/50">
                            No timetable entries available.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="table table-zebra w-full">

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Class</th>
                                    <th>Section</th>
                                    <th>Subject</th>
                                    <th>Exam Date</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Total Marks</th>
                                    <th>Pass Marks</th>
                                </tr>
                            </thead>

                            <tbody>
                                {schedules.map((schedule, index) => (
                                    <tr key={`${schedule.subject_id}-${index}`}>

                                        <td>{index + 1}</td>

                                        <td>
                                            <div className="font-semibold">
                                                {schedule.class_name || schedule.class_code || "N/A"}
                                            </div>

                                            {schedule.class_code && (
                                                <div className="text-xs text-base-content/50">
                                                    {schedule.class_code}
                                                </div>
                                            )}
                                        </td>

                                        <td>
                                            {schedule.section_name || "N/A"}
                                        </td>

                                        <td>
                                            <div className="font-semibold">
                                                {schedule.subject_name || "N/A"}
                                            </div>
                                        </td>

                                        <td>
                                            {formatDate(schedule.exam_date)}
                                        </td>

                                        <td>
                                            {formatTime(schedule.start_time)}
                                        </td>

                                        <td>
                                            {formatTime(schedule.end_time)}
                                        </td>

                                        <td>
                                            {schedule.total_marks}
                                        </td>

                                        <td>
                                            {schedule.pass_marks}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* =====================================================
                FOOTER
            ===================================================== */}

            <div className="flex justify-end">
                <button
                    onClick={() => navigate("/exams")}
                    className="btn btn-outline"
                >
                    Back to Examinations
                </button>
            </div>

        </div>
    );
};

export default ExamDetails;
