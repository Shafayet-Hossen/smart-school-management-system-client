import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import {
    getStudentResults,
} from "../../../services/studentResultService";

const StudentResultList = () => {

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["student-results"],
        queryFn: () => getStudentResults(),
    });

    if (isLoading) return <p>Loading published results...</p>;

    if (isError) {
        return (
            <div className="alert alert-error">
                Failed to load published results.
            </div>
        );
    }

    const results = data?.results || [];

    return (
        <div className="card bg-base-100 shadow-sm">
            <div className="card-body">

                <h2 className="card-title">
                    All Published Results
                </h2>

                {results.length === 0 ? (
                    <p className="py-6 text-center text-base-content/60">
                        No published results found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="table table-zebra">

                            <thead>
                                <tr>
                                    <th>Examination</th>
                                    <th>Academic Year</th>
                                    <th>Obtained Marks</th>
                                    <th>Percentage</th>
                                    <th>GPA</th>
                                    <th>Grade</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {results.map((result) => (
                                    <tr key={result._id}>

                                        <td className="font-semibold">
                                            {result.exam_name}
                                        </td>

                                        <td>
                                            {result.academic_year || "—"}
                                        </td>

                                        <td>
                                            {result.obtained_marks ?? "—"}
                                            {" / "}
                                            {result.total_marks ?? "—"}
                                        </td>

                                        <td>
                                            {result.percentage ?? "—"}%
                                        </td>

                                        <td>
                                            {result.gpa != null
                                                ? Number(result.gpa).toFixed(2)
                                                : "—"}
                                        </td>

                                        <td>
                                            {result.grade || "—"}
                                        </td>

                                        <td>
                                            <span
                                                className={`badge ${
                                                    result.result_status === "passed"
                                                        ? "badge-success"
                                                        : "badge-error"
                                                }`}
                                            >
                                                {result.result_status || "—"}
                                            </span>
                                        </td>

                                        <td>
                                            <Link
                                                to={`/student-results/${result._id}`}
                                                className="btn btn-primary btn-xs"
                                            >
                                                Details
                                            </Link>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>
                )}

            </div>
        </div>
    );
};

export default StudentResultList;