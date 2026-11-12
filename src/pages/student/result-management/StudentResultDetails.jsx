import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import {
    getStudentResultDetails,
} from "../../../services/studentResultService";

const StudentResultDetails = () => {

    const { resultId } = useParams();

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["student-result-details", resultId],
        queryFn: () => getStudentResultDetails(resultId),
        enabled: Boolean(resultId),
    });

    if (isLoading) return <p>Loading result details...</p>;

    if (isError) {
        return (
            <div className="alert alert-error">
                Unable to load result details.
            </div>
        );
    }

    const result = data?.result;

    if (!result) {
        return (
            <div className="alert alert-warning">
                Result not found.
            </div>
        );
    }

    const subjects = result.subjects || [];

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">

                <div>
                    <h2 className="text-2xl font-bold">
                        {result.exam_name}
                    </h2>

                    <p className="text-sm text-base-content/60">
                        Academic Year: {result.academic_year || "—"}
                    </p>
                </div>

                <Link
                    to="/student-results/all"
                    className="btn btn-outline btn-sm"
                >
                    Back to Results
                </Link>

            </div>

            {/* Result summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Total Marks
                        </p>
                        <h3 className="text-2xl font-bold">
                            {result.obtained_marks ?? "—"}
                            {" / "}
                            {result.total_marks ?? "—"}
                        </h3>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Percentage
                        </p>
                        <h3 className="text-2xl font-bold text-info">
                            {result.percentage ?? "—"}%
                        </h3>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            GPA
                        </p>
                        <h3 className="text-2xl font-bold text-primary">
                            {result.gpa != null
                                ? Number(result.gpa).toFixed(2)
                                : "—"}
                        </h3>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Result Status
                        </p>
                        <span
                            className={`badge badge-lg ${
                                result.result_status === "passed"
                                    ? "badge-success"
                                    : "badge-error"
                            }`}
                        >
                            {result.result_status || "—"}
                        </span>
                    </div>
                </div>

            </div>

            {/* Subject-wise marks */}
            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">

                    <h3 className="card-title">
                        Subject-wise Results
                    </h3>

                    {subjects.length === 0 ? (
                        <p className="text-base-content/60">
                            No subject results found.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="table table-zebra">

                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Full Marks</th>
                                        <th>Obtained Marks</th>
                                        <th>Percentage</th>
                                        <th>Grade</th>
                                        <th>Grade Point</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {subjects.map((subject, index) => {
                                        const percentage =
                                            Number(subject.total_marks) > 0
                                                ? (
                                                    Number(subject.obtained_marks) /
                                                    Number(subject.total_marks)
                                                ) * 100
                                                : null;

                                        return (
                                            <tr
                                                key={`${subject.subject_id}-${index}`}
                                            >

                                                <td className="font-semibold">
                                                    {subject.subject_name}
                                                </td>

                                                <td>
                                                    {subject.total_marks ?? "—"}
                                                </td>

                                                <td>
                                                    {subject.obtained_marks ?? "—"}
                                                </td>

                                                <td>
                                                    {percentage != null
                                                        ? `${percentage.toFixed(2)}%`
                                                        : "—"}
                                                </td>

                                                <td>
                                                    <span className="badge badge-outline">
                                                        {subject.grade || "—"}
                                                    </span>
                                                </td>

                                                <td>
                                                    {subject.grade_point != null
                                                        ? Number(subject.grade_point).toFixed(2)
                                                        : "—"}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            subject.status === "passed"
                                                                ? "badge-success"
                                                                : "badge-error"
                                                        }`}
                                                    >
                                                        {subject.status || "—"}
                                                    </span>
                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </table>

                        </div>
                    )}

                </div>
            </div>

            {/* Publication information */}
            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">

                    <h3 className="card-title">
                        Publication Information
                    </h3>

                    <p>
                        Publication Date:{" "}
                        {result.published_at
                            ? new Date(result.published_at).toLocaleDateString()
                            : "—"}
                    </p>

                    <p>
                        Result Status:{" "}
                        <span className="badge badge-success">
                            Published
                        </span>
                    </p>

                </div>
            </div>

        </div>
    );
};

export default StudentResultDetails;