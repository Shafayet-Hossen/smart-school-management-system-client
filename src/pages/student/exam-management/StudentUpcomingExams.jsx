import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getStudentUpcomingExams } from "../../../services/studentExamService";

const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
        ? "—"
        : parsedDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          });
};

const StudentUpcomingExams = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["student-upcoming-exams"],
        queryFn: () => getStudentUpcomingExams(),
    });

    const exams =
        data?.exams ??
        data?.data?.exams ??
        [];

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
                    "Unable to load upcoming examinations."}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold">
                    Upcoming Examinations
                </h2>

                <p className="text-sm text-base-content/60">
                    Your upcoming examination schedule.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.isArray(exams) && exams.length > 0 ? (
                    exams.map((exam) => (
                        <div
                            key={exam._id}
                            className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="font-semibold">
                                    {exam.exam_name || "Examination"}
                                </h3>

                                <span className="badge badge-info">
                                    Upcoming
                                </span>
                            </div>

                            <div className="mt-4 space-y-2 text-sm">
                                <p>
                                    <span className="text-base-content/50">
                                        Academic Year:
                                    </span>{" "}
                                    {exam.academic_year || "—"}
                                </p>

                                <p>
                                    <span className="text-base-content/50">
                                        Term:
                                    </span>{" "}
                                    {exam.term || "—"}
                                </p>

                                <p>
                                    <span className="text-base-content/50">
                                        Exam Date:
                                    </span>{" "}
                                    {formatDate(exam.exam_date)}
                                </p>
                            </div>

                            <Link
                                to={`/student-exams/${exam._id}`}
                                className="btn btn-outline btn-primary btn-sm mt-5 w-full"
                            >
                                View Details
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full rounded-xl border border-base-300 p-8 text-center text-base-content/50">
                        No upcoming examinations found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentUpcomingExams;