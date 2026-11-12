import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
    Search,
    CalendarDays,
    Clock,
    BookOpen,
    Users,
    FileText,
    ArrowRight,
    RefreshCw,
    GraduationCap,
    ClipboardCheck,
    Filter,
} from "lucide-react";

import {
    getTeacherAssignedExaminations,
} from "../../../services/teacherResultService.js";

const formatDate = (date) => {
    if (!date) return "Not scheduled";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getExamStatus = (status) => {
    const styles = {
        upcoming: "badge-info",
        ongoing: "badge-warning",
        completed: "badge-success",
        scheduled: "badge-info",
    };

    return styles[status?.toLowerCase()] || "badge-ghost";
};

const normalizeStatus = (status) => {
    return status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : "Unknown";
};

const AssignedExaminations = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    // Fetch assigned examinations
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["teacher-assigned-examinations"],
        queryFn: getTeacherAssignedExaminations,
    });

    // Support either {data: []} or a direct array response.
    const examinations = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
            ? data.data
            : [];

    // console.log("examinations :",examinations)

    // Search and filter
    const filteredExaminations = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();

        return examinations.filter((exam) => {
            const matchesSearch =
                !search ||
                [
                    exam.exam_name,
                    exam.exam_type,
                    exam.academic_year,
                    exam.class_name,
                    exam.class_code,
                    exam.section_name,
                    exam.subject_name,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value).toLowerCase().includes(search)
                    );

            const matchesStatus =
                selectedStatus === "all" ||
                exam.status?.toLowerCase() === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [examinations, searchTerm, selectedStatus]);

    // Navigate to marks-entry page
    const handleEnterMarks = (exam) => {
        navigate(
            `/teacher/results/enter-marks/${exam.exam_id}/${exam.section_id}/${exam.subject_id}`,
            {
                state: {
                    examination: exam,
                },
            }
        );
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-sm text-base-content/60">
                        Loading assigned examinations...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
                <div className="rounded-full bg-error/10 p-4">
                    <FileText className="text-error" size={32} />
                </div>

                <h2 className="text-lg font-semibold">
                    Failed to load examinations
                </h2>

                <p className="max-w-md text-center text-sm text-base-content/60">
                    {error?.response?.data?.message ||
                        error?.message ||
                        "Something went wrong. Please try again."}
                </p>

                <button
                    onClick={() => refetch()}
                    className="btn btn-primary btn-sm"
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>
            </div>
        );
    }

    // Summary
    const totalExaminations = examinations.length;

    const upcomingExaminations = examinations.filter(
        (exam) => exam.status === "upcoming"
    ).length;

    const completedExaminations = examinations.filter(
        (exam) => exam.status === "completed"
    ).length;

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-primary">
                        <GraduationCap size={18} />
                        <span>Teacher Portal</span>
                    </div>

                    <h1 className="text-2xl font-bold md:text-3xl">
                        Assigned Examinations
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        Manage examinations and enter student results.
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body flex-row items-center justify-between p-5">
                        <div>
                            <p className="text-sm text-base-content/60">
                                Total Assigned
                            </p>
                            <h2 className="mt-2 text-3xl font-bold">
                                {totalExaminations}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-primary/10 p-3 text-primary">
                            <ClipboardCheck size={26} />
                        </div>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body flex-row items-center justify-between p-5">
                        <div>
                            <p className="text-sm text-base-content/60">
                                Upcoming
                            </p>
                            <h2 className="mt-2 text-3xl font-bold text-info">
                                {upcomingExaminations}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-info/10 p-3 text-info">
                            <CalendarDays size={26} />
                        </div>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body flex-row items-center justify-between p-5">
                        <div>
                            <p className="text-sm text-base-content/60">
                                Completed
                            </p>
                            <h2 className="mt-2 text-3xl font-bold text-success">
                                {completedExaminations}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-success/10 p-3 text-success">
                            <FileText size={26} />
                        </div>
                    </div>
                </div>

            </div>

            {/* Search and Filters */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body gap-4 p-4 md:flex-row md:items-center">

                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                        />

                        <input
                            type="text"
                            placeholder="Search exam, class, section or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered w-full pl-10"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-base-content/50" />

                        <select
                            value={selectedStatus}
                            onChange={(e) =>
                                setSelectedStatus(e.target.value)
                            }
                            className="select select-bordered w-full md:w-44"
                        >
                            <option value="all">All Status</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                </div>
            </div>

            {/* Examination Cards */}
            {filteredExaminations.length === 0 ? (
                <div className="card border border-base-300 bg-base-100">
                    <div className="card-body items-center py-16 text-center">
                        <div className="rounded-full bg-base-200 p-5">
                            <BookOpen
                                size={36}
                                className="text-base-content/40"
                            />
                        </div>

                        <h3 className="mt-3 text-lg font-semibold">
                            No examinations found
                        </h3>

                        <p className="max-w-md text-sm text-base-content/60">
                            {examinations.length === 0
                                ? "You currently have no examinations assigned to your sections."
                                : "Try changing your search or status filter."}
                        </p>

                        {(searchTerm || selectedStatus !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedStatus("all");
                                }}
                                className="btn btn-primary btn-sm mt-2"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

                    {filteredExaminations.map((exam, index) => (
                        <div
                            key={`${exam.exam_id}-${exam.section_id}-${exam.subject_id}-${index}`}
                            className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm transition-all hover:shadow-md"
                        >

                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-3 border-b border-base-300 bg-base-200/40 p-5">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                        <BookOpen size={24} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold">
                                            {exam.exam_name}
                                        </h2>

                                        <p className="mt-1 text-xs capitalize text-base-content/60">
                                            {exam.exam_type?.replaceAll("_", " ") || "Examination"}
                                            {" · "}
                                            {exam.academic_year || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`badge ${getExamStatus(exam.status)} badge-outline`}
                                >
                                    {normalizeStatus(exam.status)}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="card-body p-5">

                                <div className="grid grid-cols-2 gap-4">

                                    <div className="flex items-start gap-2">
                                        <GraduationCap
                                            size={18}
                                            className="mt-0.5 text-primary"
                                        />

                                        <div>
                                            <p className="text-xs text-base-content/50">
                                                Class
                                            </p>
                                            <p className="text-sm font-semibold">
                                                {exam.class_name || exam.class_code || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <Users
                                            size={18}
                                            className="mt-0.5 text-primary"
                                        />

                                        <div>
                                            <p className="text-xs text-base-content/50">
                                                Section
                                            </p>
                                            <p className="text-sm font-semibold">
                                                {exam.section_name || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <BookOpen
                                            size={18}
                                            className="mt-0.5 text-primary"
                                        />

                                        <div>
                                            <p className="text-xs text-base-content/50">
                                                Subject
                                            </p>
                                            <p className="text-sm font-semibold">
                                                {exam.subject_name || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <CalendarDays
                                            size={18}
                                            className="mt-0.5 text-primary"
                                        />

                                        <div>
                                            <p className="text-xs text-base-content/50">
                                                Exam Date
                                            </p>
                                            <p className="text-sm font-semibold">
                                                {formatDate(exam.exam_date)}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                <div className="divider my-1" />

                                {/* Marks and Time */}
                                <div className="flex flex-wrap items-center justify-between gap-3">

                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock size={16} className="text-base-content/50" />

                                        <span>
                                            {exam.start_time || "--:--"}
                                            {" - "}
                                            {exam.end_time || "--:--"}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="badge badge-outline py-3">
                                            Total: {exam.total_marks ?? "N/A"}
                                        </div>

                                        <div className="badge badge-outline badge-success py-3">
                                            Pass: {exam.pass_marks ?? "N/A"}
                                        </div>
                                    </div>

                                </div>

                                {/* Action */}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => handleEnterMarks(exam)}
                                        disabled={!exam.exam_id || !exam.section_id || !exam.subject_id}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Enter Marks
                                        <ArrowRight size={16} />
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            )}

            {/* Result Count */}
            {filteredExaminations.length > 0 && (
                <div className="text-right text-sm text-base-content/50">
                    Showing {filteredExaminations.length} of{" "}
                    {examinations.length} assigned schedules
                </div>
            )}

        </div>
    );
};

export default AssignedExaminations;