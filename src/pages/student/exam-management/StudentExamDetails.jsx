import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getStudentExamDetails } from "../../../services/studentExamService";

const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
        ? "—"
        : parsedDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
          });
};

const StudentExamDetails = () => {
    const { examId } = useParams();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["student-exam-details", examId],
        queryFn: () => getStudentExamDetails(examId),
        enabled: Boolean(examId),
    });

    const exam =
        data?.exam ??
        data?.data?.exam ??
        null;

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-error">
                {error?.response?.data?.message ||
                    "Unable to load examination details."}
            </div>
        );
    }

    if (!exam) {
        return (
            <div className="alert alert-warning">
                Examination details not found.
            </div>
        );
    }

    const schedules = Array.isArray(exam.schedules)
        ? exam.schedules
        : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold">
                        {exam.exam_name || "Examination Details"}
                    </h2>

                    <p className="mt-1 text-sm text-base-content/60">
                        Examination information and subject-wise schedules.
                    </p>
                </div>

                <Link
                    to="/student-exams/schedule"
                    className="btn btn-outline btn-sm"
                >
                    Back to Schedule
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <p className="text-sm text-base-content/50">
                        Academic Year
                    </p>

                    <p className="mt-1 font-semibold">
                        {exam.academic_year || "—"}
                    </p>
                </div>

                <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <p className="text-sm text-base-content/50">
                        Term
                    </p>

                    <p className="mt-1 font-semibold">
                        {exam.term || "—"}
                    </p>
                </div>

                <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <p className="text-sm text-base-content/50">
                        Examination Date
                    </p>

                    <p className="mt-1 font-semibold">
                        {formatDate(exam.exam_date)}
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-base-300 bg-base-100 p-5">
                <h3 className="mb-4 text-lg font-semibold">
                    Subject-wise Examination Schedule
                </h3>

                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Subject</th>
                                <th>Exam Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Room</th>
                                <th>Total Marks</th>
                                <th>Pass Marks</th>
                            </tr>
                        </thead>

                        <tbody>
                            {schedules.length > 0 ? (
                                schedules.map((schedule, index) => (
                                    <tr
                                        key={`${schedule.subject_id}-${index}`}
                                    >
                                        <td>{index + 1}</td>

                                        <td className="font-medium">
                                            {schedule.subject_name || "—"}
                                        </td>

                                        <td>
                                            {formatDate(schedule.exam_date)}
                                        </td>

                                        <td>
                                            {schedule.start_time || "—"}
                                        </td>

                                        <td>
                                            {schedule.end_time || "—"}
                                        </td>

                                        <td>
                                            {schedule.room || "—"}
                                        </td>

                                        <td>
                                            {schedule.total_marks ?? "—"}
                                        </td>

                                        <td>
                                            {schedule.pass_marks ?? "—"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-8 text-center text-base-content/50"
                                    >
                                        No examination schedules found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 print:hidden">
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-primary btn-sm"
                >
                    Print Examination Details
                </button>
            </div>
        </div>
    );
};

export default StudentExamDetails;