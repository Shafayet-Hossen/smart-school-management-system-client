import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getTeacherCompletedExams } from "../../../services/teacherExamService";

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

const TeacherCompletedExams = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-completed-exams"],
        queryFn: () => getTeacherCompletedExams(),
    });

    const exams =
        data?.exams ??
        data?.data?.exams ??
        data?.data ??
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
                    "Unable to load completed examinations."}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold">Completed Examinations</h2>
                <p className="text-sm text-base-content/60">
                    Examinations whose scheduled dates have passed.
                </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Examination</th>
                            <th>Academic Year</th>
                            <th>Term</th>
                            <th>Exam Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Array.isArray(exams) && exams.length > 0 ? (
                            exams.map((exam, index) => (
                                <tr key={exam._id}>
                                    <td>{index + 1}</td>
                                    <td className="font-medium">
                                        {exam.exam_name || "—"}
                                    </td>
                                    <td>{exam.academic_year || "—"}</td>
                                    <td>{exam.term || "—"}</td>
                                    <td>{formatDate(exam.exam_date)}</td>
                                    <td>
                                        <Link
                                            to={`/teacher-exams/${exam._id}`}
                                            className="btn btn-ghost btn-xs text-primary"
                                        >
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-10 text-center text-base-content/50"
                                >
                                    No completed examinations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherCompletedExams;