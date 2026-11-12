import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getTeacherExamDashboard } from "../../../services/teacherExamService";

const StatCard = ({ title, value, description }) => (
    <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <p className="text-sm text-base-content/60">{title}</p>
        <h2 className="mt-2 text-3xl font-bold">{value ?? 0}</h2>
        <p className="mt-1 text-xs text-base-content/50">{description}</p>
    </div>
);

const TeacherExamDashboard = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-exam-dashboard"],
        queryFn: getTeacherExamDashboard,
    });

    // console.log("Teacher Exam Dashboard Data:", data);
    
    const summary = data?.summary ?? data?.data?.summary ?? {};

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
                    "Unable to load examination dashboard."}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Exam Overview</h2>
                <p className="text-sm text-base-content/60">
                    Overview of examinations assigned to you.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Assigned Exams"
                    value={summary.total_exams}
                    description="Examinations assigned to you"
                />

                <StatCard
                    title="Upcoming Exams"
                    value={summary.upcoming_exams}
                    description="Examinations scheduled ahead"
                />

                <StatCard
                    title="Ongoing Exams"
                    value={summary.ongoing_exams}
                    description="Examinations currently in progress"
                />

                <StatCard
                    title="Completed Exams"
                    value={summary.completed_exams}
                    description="Examinations already completed"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Link
                    to="/teacher-exams/schedule"
                    className="rounded-xl border border-base-300 bg-base-100 p-5 transition hover:border-primary"
                >
                    <h3 className="font-semibold">View Exam Schedule</h3>
                    <p className="mt-2 text-sm text-base-content/60">
                        View examination dates, subjects, sections and marks.
                    </p>
                </Link>

                <Link
                    to="/teacher-exams/upcoming"
                    className="rounded-xl border border-base-300 bg-base-100 p-5 transition hover:border-primary"
                >
                    <h3 className="font-semibold">Upcoming Examinations</h3>
                    <p className="mt-2 text-sm text-base-content/60">
                        Check your upcoming examination responsibilities.
                    </p>
                </Link>
            </div>
        </div>
    );
};

export default TeacherExamDashboard;