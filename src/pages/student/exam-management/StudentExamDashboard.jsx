
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Award,
    BookOpen,
    Calendar,
    CalendarCheck,
    CalendarClock,
    CheckCircle2,
    ChevronRight,
    ClipboardList,
    Clock,
    FileText,
    GraduationCap,
    TrendingUp,
    AlertCircle,
    RefreshCw,
    BarChart3,
    XCircle,
} from "lucide-react";
import { getStudentExamDashboard } from "../../../services/studentExamService.js";

const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (time) => {
    if (!time) return "N/A";

    const [hours, minutes] = time.split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
};

const getStatusBadge = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "upcoming" || normalized === "scheduled") {
        return "badge-info";
    }

    if (normalized === "completed") {
        return "badge-success";
    }

    if (normalized === "cancelled") {
        return "badge-error";
    }

    return "badge-ghost";
};

const StatCard = ({ title, value, description, icon: Icon, color }) => (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-base-content/60">{title}</p>
                    <h2 className="text-3xl font-bold mt-2">
                        {value ?? 0}
                    </h2>
                </div>

                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon size={25} />
                </div>
            </div>

            <p className="text-xs text-base-content/50 mt-3">
                {description}
            </p>
        </div>
    </div>
);

const PerformanceBar = ({ subject, percentage }) => {
    const value = Math.max(0, Math.min(100, Number(percentage) || 0));

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium truncate">
                    {subject}
                </span>

                <span className="text-sm font-semibold">
                    {value.toFixed(1)}%
                </span>
            </div>

            <progress
                className="progress progress-primary w-full"
                value={value}
                max="100"
            />
        </div>
    );
};

const StudentExamDashboard = () => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["student-exam-dashboard"],
        queryFn: () => getStudentExamDashboard(),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    const summary = data?.summary || {};

    const upcomingExams = data?.upcoming_exams || [];
    const recentResults = data?.recent_results || [];
    const subjectPerformance = data?.subject_performance || [];

    const performance = useMemo(() => {
        const value = Number(summary.average_percentage);

        if (!Number.isFinite(value)) return 0;

        return Math.max(0, Math.min(100, value));
    }, [summary.average_percentage]);

    const student = data?.student || {};

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary" />
                <p className="text-base-content/60">
                    Loading examination dashboard...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="card bg-base-100 shadow-lg border border-error/20 max-w-md w-full">
                    <div className="card-body items-center text-center">
                        <AlertCircle className="text-error" size={45} />

                        <h2 className="card-title">
                            Unable to Load Dashboard
                        </h2>

                        <p className="text-sm text-base-content/60">
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Something went wrong while loading your examination information."}
                        </p>

                        <button
                            onClick={() => refetch()}
                            className="btn btn-primary mt-3"
                        >
                            <RefreshCw size={17} />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-base-content/50 mb-2">
                        <GraduationCap size={17} />
                        Student Portal
                        <ChevronRight size={14} />
                        Examinations
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold">
                        Examination Dashboard
                    </h1>

                    <p className="text-base-content/60 mt-2">
                        Track your examination schedule and academic performance.
                    </p>
                </div>

                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="btn btn-outline btn-sm"
                >
                    <RefreshCw
                        size={16}
                        className={isFetching ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Student Information */}
            <div className="card bg-gradient-to-r from-primary to-blue-600 text-primary-content shadow-md">
                <div className="card-body p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        <div className="flex items-center gap-4">
                            <div className="avatar placeholder">
                                <div className="bg-white/20 text-white rounded-full w-16">
                                    <span className="text-2xl font-bold">
                                        {(student.full_name || "S")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold">
                                    {student.full_name || "Student"}
                                </h2>

                                <p className="text-sm opacity-80 mt-1">
                                    Student ID: {student.student_code || "N/A"}
                                </p>

                                <p className="text-sm opacity-80">
                                    Class: {student.class_name || "N/A"}
                                    {" • "}
                                    Section: {student.section_name || "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="md:text-right">
                            <p className="text-sm opacity-80">
                                Academic Year
                            </p>
                            <h3 className="text-2xl font-bold">
                                {data?.academic_year || "N/A"}
                            </h3>
                        </div>

                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Total Examinations"
                    value={summary.total_exams}
                    description="Examinations for your class"
                    icon={ClipboardList}
                    color="bg-blue-100 text-blue-600"
                />

                <StatCard
                    title="Upcoming Exams"
                    value={summary.upcoming_exams}
                    description="Examinations yet to start"
                    icon={CalendarClock}
                    color="bg-amber-100 text-amber-600"
                />

                <StatCard
                    title="Completed Exams"
                    value={summary.completed_exams}
                    description="Examinations completed"
                    icon={CheckCircle2}
                    color="bg-green-100 text-green-600"
                />

                <StatCard
                    title="Average Percentage"
                    value={`${performance.toFixed(1)}%`}
                    description="Based on published results"
                    icon={TrendingUp}
                    color="bg-purple-100 text-purple-600"
                />
            </div>

            {/* Upcoming Exams and Performance */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Upcoming Examination Schedule */}
                <div className="xl:col-span-2 card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-5">

                        <div className="flex items-center justify-between gap-3 mb-2">
                            <div>
                                <h2 className="card-title text-lg">
                                    <CalendarCheck className="text-primary" size={21} />
                                    Upcoming Examinations
                                </h2>

                                <p className="text-sm text-base-content/50 mt-1">
                                    Your next scheduled examinations
                                </p>
                            </div>

                            <span className="badge badge-primary badge-outline">
                                {upcomingExams.length} Exams
                            </span>
                        </div>

                        {upcomingExams.length === 0 ? (
                            <div className="py-12 text-center">
                                <Calendar size={40} className="mx-auto text-base-content/30" />
                                <p className="font-medium mt-3">
                                    No Upcoming Examinations
                                </p>
                                <p className="text-sm text-base-content/50 mt-1">
                                    Your upcoming examination schedule will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Examination</th>
                                            <th>Subject</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Marks</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {upcomingExams.map((exam, index) => (
                                            <tr key={`${exam.exam_id}-${exam.subject_id}-${index}`}>
                                                <td>
                                                    <div className="font-semibold">
                                                        {exam.exam_name}
                                                    </div>

                                                    <div className="text-xs text-base-content/50">
                                                        {exam.exam_type || "Examination"}
                                                    </div>
                                                </td>

                                                <td>{exam.subject_name || "N/A"}</td>

                                                <td className="whitespace-nowrap">
                                                    {formatDate(exam.exam_date)}
                                                </td>

                                                <td className="whitespace-nowrap">
                                                    {formatTime(exam.start_time)}
                                                </td>

                                                <td>
                                                    <span className="font-semibold">
                                                        {exam.total_marks ?? "N/A"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Overall Performance */}
                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-5">
                        <h2 className="card-title text-lg">
                            <Award className="text-primary" size={21} />
                            Overall Performance
                        </h2>

                        <div className="flex flex-col items-center py-5">
                            <div
                                className="radial-progress text-primary"
                                style={{
                                    "--value": performance,
                                    "--size": "9rem",
                                    "--thickness": "10px",
                                }}
                                role="progressbar"
                                aria-valuenow={performance}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                <div className="text-center">
                                    <div className="text-3xl font-bold">
                                        {performance.toFixed(1)}%
                                    </div>
                                    <div className="text-xs text-base-content/50">
                                        Average
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-base-content/60 mt-4">
                                Your published examination performance
                            </p>
                        </div>

                        <div className="divider my-1" />

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-base-content/60">
                                    Average GPA
                                </span>
                                <span className="font-bold">
                                    {Number(summary.average_gpa || 0).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-base-content/60">
                                    Passed Subjects
                                </span>
                                <span className="font-bold text-success">
                                    {summary.passed_subjects ?? 0}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-base-content/60">
                                    Failed Subjects
                                </span>
                                <span className="font-bold text-error">
                                    {summary.failed_subjects ?? 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subject Performance */}
            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="card-title text-lg">
                                <BarChart3 className="text-primary" size={21} />
                                Subject-wise Performance
                            </h2>

                            <p className="text-sm text-base-content/50 mt-1">
                                Your average marks in each subject
                            </p>
                        </div>
                    </div>

                    {subjectPerformance.length === 0 ? (
                        <div className="py-8 text-center">
                            <BookOpen size={36} className="mx-auto text-base-content/30" />
                            <p className="text-sm text-base-content/50 mt-3">
                                No published subject results available.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                            {subjectPerformance.map((subject) => (
                                <PerformanceBar
                                    key={subject.subject_id}
                                    subject={subject.subject_name}
                                    percentage={subject.average_percentage}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Results */}
            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-5">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <div>
                            <h2 className="card-title text-lg">
                                <FileText className="text-primary" size={21} />
                                Recent Published Results
                            </h2>

                            <p className="text-sm text-base-content/50 mt-1">
                                Your latest examination results
                            </p>
                        </div>
                    </div>

                    {recentResults.length === 0 ? (
                        <div className="py-12 text-center">
                            <FileText size={40} className="mx-auto text-base-content/30" />
                            <p className="font-medium mt-3">
                                No Published Results
                            </p>
                            <p className="text-sm text-base-content/50 mt-1">
                                Your results will appear here after publication.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Examination</th>
                                        <th>Subject</th>
                                        <th>Obtained Marks</th>
                                        <th>Percentage</th>
                                        <th>Grade</th>
                                        <th>Result</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentResults.map((result, index) => (
                                        <tr key={`${result.exam_id}-${result.subject_id}-${index}`}>
                                            <td>
                                                <div className="font-semibold">
                                                    {result.exam_name}
                                                </div>
                                                <div className="text-xs text-base-content/50">
                                                    {formatDate(result.exam_date)}
                                                </div>
                                            </td>

                                            <td>{result.subject_name || "N/A"}</td>

                                            <td className="font-semibold">
                                                {result.obtained_marks ?? 0}
                                                {" / "}
                                                {result.total_marks ?? 0}
                                            </td>

                                            <td>
                                                {Number(result.percentage || 0).toFixed(1)}%
                                            </td>

                                            <td>
                                                <span className="font-bold">
                                                    {result.grade || "N/A"}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${
                                                        String(result.result).toLowerCase() === "pass"
                                                            ? "badge-success"
                                                            : "badge-error"
                                                    }`}
                                                >
                                                    {result.result || "N/A"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Additional Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-success/10 text-success">
                                <CheckCircle2 size={23} />
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Examination Progress
                                </h3>
                                <p className="text-xs text-base-content/50">
                                    Completed examination count
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            {(() => {
                                const total = Number(summary.total_exams || 0);
                                const completed = Number(summary.completed_exams || 0);
                                const percentage = total > 0
                                    ? Math.min(100, (completed / total) * 100)
                                    : 0;

                                return (
                                    <>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Progress</span>
                                            <span className="font-semibold">
                                                {completed}/{total}
                                            </span>
                                        </div>

                                        <progress
                                            className="progress progress-success w-full"
                                            value={percentage}
                                            max="100"
                                        />
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-warning/10 text-warning">
                                <Clock size={23} />
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Examination Reminder
                                </h3>
                                <p className="text-xs text-base-content/50">
                                    Stay prepared for your exams
                                </p>
                            </div>
                        </div>

                        {upcomingExams.length > 0 ? (
                            <div className="mt-4">
                                <p className="text-sm text-base-content/60">
                                    Your next examination is
                                </p>

                                <p className="font-bold text-lg mt-1">
                                    {upcomingExams[0].subject_name}
                                </p>

                                <p className="text-sm text-base-content/60 mt-1">
                                    {formatDate(upcomingExams[0].exam_date)}
                                    {" • "}
                                    {formatTime(upcomingExams[0].start_time)}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-base-content/60 mt-4">
                                No upcoming examination reminders.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-base-content/40 pt-2">
                <p>
                    Smart School Management System • Student Examination Portal
                </p>
            </div>
        </div>
    );
};

export default StudentExamDashboard;
