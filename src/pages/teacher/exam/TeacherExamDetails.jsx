import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getTeacherExamDetails } from "../../../services/teacherExamService";

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

const TeacherExamDetails = () => {
    const { examId } = useParams();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-exam-details", examId],
        queryFn: () => getTeacherExamDetails(examId),
        enabled: Boolean(examId),
    });

    const exam = data?.exam ?? data?.data?.exam ?? data?.data;

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
                        Examination information and assigned subject schedules.
                    </p>
                </div>

                <Link
                    to="/teacher-exams/schedule"
                    className="btn btn-outline btn-sm"
                >
                    Back to Schedule
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-base-300 p-4">
                    <p className="text-sm text-base-content/50">
                        Academic Year
                    </p>
                    <p className="mt-1 font-semibold">
                        {exam.academic_year || "—"}
                    </p>
                </div>

                <div className="rounded-xl border border-base-300 p-4">
                    <p className="text-sm text-base-content/50">Term</p>
                    <p className="mt-1 font-semibold">
                        {exam.term || "—"}
                    </p>
                </div>

                <div className="rounded-xl border border-base-300 p-4">
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
                    Assigned Examination Schedules
                </h3>

                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Class</th>
                                <th>Section</th>
                                <th>Subject</th>
                                <th>Total Marks</th>
                                <th>Pass Marks</th>
                            </tr>
                        </thead>

                        <tbody>
                            {schedules.length > 0 ? (
                                schedules.map((schedule, index) => (
                                    <tr
                                        key={`${schedule.section_id}-${schedule.subject_id}-${index}`}
                                    >
                                        <td>{index + 1}</td>
                                        <td>
                                            {schedule.class_name ||
                                                schedule.class_code ||
                                                "—"}
                                        </td>
                                        <td>
                                            {schedule.section_name || "—"}
                                        </td>
                                        <td>
                                            {schedule.subject_name || "—"}
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
                                        colSpan={6}
                                        className="py-8 text-center text-base-content/50"
                                    >
                                        No assigned schedules found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <Link
                    to="/teacher-results/exams"
                    className="btn btn-primary btn-sm"
                >
                    Go to Result Management
                </Link>

                <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-outline btn-sm print:hidden"
                >
                    Print Details
                </button>
            </div>
        </div>
    );
};

export default TeacherExamDetails;