import { Link, useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
    getParentUpcomingExams,
} from "../../../services/parentExamService";

const ParentUpcomingExams = () => {
    const { selectedChildId } = useOutletContext();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["parent-upcoming-exams", selectedChildId],
        queryFn: () => getParentUpcomingExams(selectedChildId),
        enabled: Boolean(selectedChildId),
    });

    if (isLoading) return <p>Loading upcoming examinations...</p>;

    if (isError) {
        return (
            <div className="alert alert-error">
                Failed to load upcoming examinations.
            </div>
        );
    }

    const exams = data?.exams || [];

    return (
        <div className="space-y-4">

            <h2 className="text-xl font-bold">
                Upcoming Examinations
            </h2>

            {exams.length === 0 ? (
                <div className="alert">
                    No upcoming examinations found.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {exams.map((exam) => (
                        <div
                            key={exam._id}
                            className="card bg-base-100 shadow-sm"
                        >
                            <div className="card-body">

                                <h3 className="card-title">
                                    {exam.exam_name}
                                </h3>

                                <p>
                                    Academic Year: {exam.academic_year || "—"}
                                </p>

                                <p>
                                    Exam Date:{" "}
                                    {exam.exam_date
                                        ? new Date(exam.exam_date).toLocaleDateString()
                                        : "—"}
                                </p>

                                <div className="card-actions justify-end">
                                    <Link
                                        to={`/parent/exams/${exam._id}`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        View Details
                                    </Link>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParentUpcomingExams;