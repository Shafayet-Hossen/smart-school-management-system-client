import { useQuery } from "@tanstack/react-query";
import {
    Link,
    useOutletContext,
    useParams,
} from "react-router-dom";

import {
    getParentExamDetails,
} from "../../../services/parentExamService";

const ParentExamDetails = () => {
    const { examId } = useParams();
    const { selectedChildId } = useOutletContext();

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: [
            "parent-exam-details",
            examId,
            selectedChildId,
        ],
        queryFn: () =>
            getParentExamDetails(examId, selectedChildId),
        enabled: Boolean(examId && selectedChildId),
    });

    if (isLoading) {
        return <p>Loading examination details...</p>;
    }

    if (isError) {
        return (
            <div className="alert alert-error">
                Unable to load examination details.
            </div>
        );
    }

    const exam = data?.exam;

    if (!exam) {
        return (
            <div className="alert alert-warning">
                Examination not found.
            </div>
        );
    }

    const schedules = exam.schedules || [];

    return (
        <div className="space-y-6">

            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold">
                    {exam.exam_name || exam.name}
                </h2>

                <Link
                    to="/parent/exams"
                    className="btn btn-ghost btn-sm"
                >
                    Back to Dashboard
                </Link>
            </div>

            {/* Exam Information */}
            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">

                    <h3 className="card-title">
                        Examination Information
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-base-content/60">
                                Examination Name
                            </p>
                            <p className="font-semibold">
                                {exam.exam_name || exam.name || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-base-content/60">
                                Academic Year
                            </p>
                            <p className="font-semibold">
                                {exam.academic_year || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-base-content/60">
                                Examination Type
                            </p>
                            <p className="font-semibold">
                                {exam.exam_type || exam.term || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-base-content/60">
                                Description
                            </p>
                            <p className="font-semibold">
                                {exam.description || "—"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subject Schedule */}
            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">

                    <h3 className="card-title">
                        Subject-wise Schedule
                    </h3>

                    {schedules.length === 0 ? (
                        <p className="text-base-content/60">
                            No subject schedule available.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Date</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Total Marks</th>
                                        <th>Pass Marks</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {schedules.map((item, index) => (
                                        <tr
                                            key={`${item.subject_id}-${index}`}
                                        >
                                            <td>
                                                {item.subject_name || "—"}
                                            </td>

                                            <td>
                                                {item.exam_date
                                                    ? new Date(item.exam_date).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            <td>
                                                {item.start_time || "—"}
                                            </td>

                                            <td>
                                                {item.end_time || "—"}
                                            </td>

                                            <td>
                                                {item.total_marks ?? "—"}
                                            </td>

                                            <td>
                                                {item.pass_marks ?? "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ParentExamDetails;