import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import {
    getStudentResultHistory,
} from "../../../services/studentResultService";

const StudentResultHistory = () => {

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["student-result-history"],
        queryFn: () => getStudentResultHistory(),
    });

    if (isLoading) return <p>Loading result history...</p>;

    if (isError) {
        return (
            <div className="alert alert-error">
                Failed to load result history.
            </div>
        );
    }

    const results = data?.results || [];

    return (
        <div className="space-y-4">

            <h2 className="text-xl font-bold">
                Examination Result History
            </h2>

            {results.length === 0 ? (
                <div className="alert">
                    No previous published results found.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">

                    {results.map((result) => (
                        <div
                            key={result._id}
                            className="card bg-base-100 shadow-sm"
                        >
                            <div className="card-body">

                                <h3 className="card-title">
                                    {result.exam_name}
                                </h3>

                                <p className="text-sm text-base-content/60">
                                    Academic Year: {result.academic_year || "—"}
                                </p>

                                <div className="grid grid-cols-2 gap-3">

                                    <div>
                                        <p className="text-xs text-base-content/60">
                                            Percentage
                                        </p>
                                        <p className="font-bold">
                                            {result.percentage ?? "—"}%
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-base-content/60">
                                            GPA
                                        </p>
                                        <p className="font-bold">
                                            {result.gpa != null
                                                ? Number(result.gpa).toFixed(2)
                                                : "—"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-base-content/60">
                                            Grade
                                        </p>
                                        <p className="font-bold">
                                            {result.grade || "—"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-base-content/60">
                                            Status
                                        </p>
                                        <span
                                            className={`badge ${
                                                result.result_status === "passed"
                                                    ? "badge-success"
                                                    : "badge-error"
                                            }`}
                                        >
                                            {result.result_status || "—"}
                                        </span>
                                    </div>

                                </div>

                                <div className="card-actions justify-end">
                                    <Link
                                        to={`/student-results/${result._id}`}
                                        className="btn btn-outline btn-sm"
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

export default StudentResultHistory;