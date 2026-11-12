
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Search,
    Filter,
    RefreshCw,
    FileText,
    GraduationCap,
    BookOpen,
    Award,
    Eye,
    X,
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ClipboardList,
} from "lucide-react";

import { getStudentResultList } from "../../../services/studentResultService";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const formatNumber = (value, digits = 2) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? number.toFixed(digits)
        : "0.00";
};

const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getGradeBadge = (grade) => {
    const normalizedGrade = String(grade || "").toUpperCase();

    if (["A+", "A"].includes(normalizedGrade)) {
        return "badge-success";
    }

    if (["A-", "B"].includes(normalizedGrade)) {
        return "badge-info";
    }

    if (["C", "D"].includes(normalizedGrade)) {
        return "badge-warning";
    }

    return "badge-error";
};

const getResultBadge = (result) => {
    return String(result || "").toLowerCase() === "pass"
        ? "badge-success"
        : "badge-error";
};

// --------------------------------------------------
// Result Details Modal
// --------------------------------------------------

const ResultDetailsModal = ({ result, onClose }) => {
    if (!result) return null;

    const passed =
        String(result.result).toLowerCase() === "pass";

    return (
        <dialog className="modal modal-open">
            <div className="modal-box max-w-2xl">
                <div className="flex justify-between items-start gap-3">
                    <div>
                        <h3 className="text-xl font-bold">
                            Result Details
                        </h3>

                        <p className="text-sm text-base-content/50 mt-1">
                            Detailed examination result information
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost"
                        aria-label="Close result details"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="divider my-3" />

                <div className="bg-base-200/60 rounded-xl p-4 space-y-3">
                    <div>
                        <p className="text-xs text-base-content/50">
                            Examination
                        </p>
                        <p className="font-semibold">
                            {result.exam_name || "N/A"}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-base-content/50">
                                Subject
                            </p>
                            <p className="font-medium">
                                {result.subject_name || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-base-content/50">
                                Academic Year
                            </p>
                            <p className="font-medium">
                                {result.academic_year || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-base-content/50">
                                Examination Date
                            </p>
                            <p className="font-medium">
                                {formatDate(result.exam_date)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-base-content/50">
                                Published Date
                            </p>
                            <p className="font-medium">
                                {formatDate(result.published_at)}
                            </p>
                        </div>
                    </div>
                </div>

                <h4 className="font-semibold mt-5 mb-3">
                    Marks and Performance
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-base-200/60 rounded-xl p-3">
                        <p className="text-xs text-base-content/50">
                            Obtained Marks
                        </p>
                        <p className="text-xl font-bold text-primary mt-1">
                            {result.obtained_marks ?? 0}
                        </p>
                    </div>

                    <div className="bg-base-200/60 rounded-xl p-3">
                        <p className="text-xs text-base-content/50">
                            Total Marks
                        </p>
                        <p className="text-xl font-bold mt-1">
                            {result.total_marks ?? 0}
                        </p>
                    </div>

                    <div className="bg-base-200/60 rounded-xl p-3">
                        <p className="text-xs text-base-content/50">
                            Pass Marks
                        </p>
                        <p className="text-xl font-bold mt-1">
                            {result.pass_marks ?? 0}
                        </p>
                    </div>

                    <div className="bg-base-200/60 rounded-xl p-3">
                        <p className="text-xs text-base-content/50">
                            Percentage
                        </p>
                        <p className="text-xl font-bold mt-1">
                            {formatNumber(result.percentage, 1)}%
                        </p>
                    </div>

                    <div className="bg-base-200/60 rounded-xl p-3">
                        <p className="text-xs text-base-content/50">
                            Grade
                        </p>
                        <p className="text-xl font-bold mt-1">
                            {result.grade || "N/A"}
                        </p>
                    </div>

                    <div className="bg-base-200/60 rounded-xl p-3">
                        <p className="text-xs text-base-content/50">
                            Grade Point
                        </p>
                        <p className="text-xl font-bold mt-1">
                            {formatNumber(result.grade_point)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-5 p-4 rounded-xl border border-base-300">
                    <div className="flex items-center gap-3">
                        {passed ? (
                            <CheckCircle2
                                size={28}
                                className="text-success"
                            />
                        ) : (
                            <XCircle
                                size={28}
                                className="text-error"
                            />
                        )}

                        <div>
                            <p className="font-semibold">
                                Examination Result
                            </p>
                            <p className="text-xs text-base-content/50">
                                Officially published result
                            </p>
                        </div>
                    </div>

                    <span
                        className={`badge badge-lg ${
                            passed
                                ? "badge-success"
                                : "badge-error"
                        }`}
                    >
                        {passed ? "PASS" : "FAIL"}
                    </span>
                </div>

                <div className="modal-action">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-primary btn-sm"
                    >
                        Close
                    </button>
                </div>
            </div>

            <button
                type="button"
                className="modal-backdrop"
                onClick={onClose}
                aria-label="Close modal"
            >
                Close
            </button>
        </dialog>
    );
};

// --------------------------------------------------
// Main Component
// --------------------------------------------------

const ResultList = () => {
    const [academicYear, setAcademicYear] = useState("");
    const [examId, setExamId] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [resultStatus, setResultStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedResult, setSelectedResult] = useState(null);

    const pageSize = 10;

    // ----------------------------------------------
    // API Query
    // ----------------------------------------------

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: [
            "student-result-list",
            academicYear,
            examId,
            subjectId,
            resultStatus,
        ],
        queryFn: () =>
            getStudentResultList({
                academicYear,
                examId,
                subjectId,
                status: resultStatus,
            }),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    const student = data?.student || {};
    const results = data?.results || [];
    const summary = data?.summary || {};

    const academicYears = data?.academic_years || [];
    const examinations = data?.examinations || [];
    const subjects = data?.subjects || [];

    // ----------------------------------------------
    // Client-side Search
    // ----------------------------------------------

    const filteredResults = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) return results;

        return results.filter((item) =>
            [
                item.exam_name,
                item.subject_name,
                item.grade,
                item.result,
                item.academic_year,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(search)
                )
        );
    }, [results, searchTerm]);

    // ----------------------------------------------
    // Pagination
    // ----------------------------------------------

    const totalPages = Math.max(
        1,
        Math.ceil(filteredResults.length / pageSize)
    );

    const safePage = Math.min(currentPage, totalPages);

    const paginatedResults = useMemo(() => {
        const startIndex = (safePage - 1) * pageSize;

        return filteredResults.slice(
            startIndex,
            startIndex + pageSize
        );
    }, [filteredResults, safePage]);

    const startRecord =
        filteredResults.length === 0
            ? 0
            : (safePage - 1) * pageSize + 1;

    const endRecord = Math.min(
        safePage * pageSize,
        filteredResults.length
    );

    // ----------------------------------------------
    // Reset Filters
    // ----------------------------------------------

    const resetFilters = () => {
        setAcademicYear("");
        setExamId("");
        setSubjectId("");
        setResultStatus("");
        setSearchTerm("");
        setCurrentPage(1);
    };

    const updateFilter = (setter) => (event) => {
        setter(event.target.value);
        setCurrentPage(1);
    };

    // ----------------------------------------------
    // Loading
    // ----------------------------------------------

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
                <span className="loading loading-spinner loading-lg text-primary" />

                <p className="text-sm text-base-content/60">
                    Loading your result list...
                </p>
            </div>
        );
    }

    // ----------------------------------------------
    // Error
    // ----------------------------------------------

    if (isError) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center p-5">
                <div className="card bg-base-100 border border-error/20 shadow-sm max-w-md w-full">
                    <div className="card-body items-center text-center">
                        <AlertCircle
                            size={42}
                            className="text-error"
                        />

                        <h2 className="card-title">
                            Unable to Load Results
                        </h2>

                        <p className="text-sm text-base-content/60">
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Something went wrong while loading results."}
                        </p>

                        <button
                            onClick={() => refetch()}
                            className="btn btn-primary btn-sm mt-3"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ----------------------------------------------
    // Main UI
    // ----------------------------------------------

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-base-content/50 mb-2">
                        <GraduationCap size={17} />
                        <span>Student Portal</span>
                        <span>/</span>
                        <span>Result Management</span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold">
                        Result List
                    </h1>

                    <p className="text-sm text-base-content/60 mt-1">
                        View and track all your published examination results.
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

            <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-md">
                <div className="card-body p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <GraduationCap size={27} />
                            </div>

                            <div>
                                <h2 className="font-bold text-lg">
                                    {student.full_name || "Student"}
                                </h2>

                                <p className="text-sm opacity-80">
                                    ID: {student.student_code || "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                            <div>
                                <p className="opacity-70">Class</p>
                                <p className="font-semibold">
                                    {student.class_name || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="opacity-70">Section</p>
                                <p className="font-semibold">
                                    {student.section_name || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="opacity-70">Roll</p>
                                <p className="font-semibold">
                                    {student.roll_number || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-base-content/60">
                                    Total Results
                                </p>

                                <h3 className="text-2xl font-bold mt-2">
                                    {summary.total_results ?? results.length}
                                </h3>
                            </div>

                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <ClipboardList size={23} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-base-content/60">
                                    Passed
                                </p>

                                <h3 className="text-2xl font-bold text-success mt-2">
                                    {summary.passed ?? 0}
                                </h3>
                            </div>

                            <div className="p-3 rounded-xl bg-success/10 text-success">
                                <CheckCircle2 size={23} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-base-content/60">
                                    Failed
                                </p>

                                <h3 className="text-2xl font-bold text-error mt-2">
                                    {summary.failed ?? 0}
                                </h3>
                            </div>

                            <div className="p-3 rounded-xl bg-error/10 text-error">
                                <XCircle size={23} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-base-content/60">
                                    Average Percentage
                                </p>

                                <h3 className="text-2xl font-bold mt-2">
                                    {formatNumber(
                                        summary.average_percentage,
                                        1
                                    )}
                                    %
                                </h3>
                            </div>

                            <div className="p-3 rounded-xl bg-info/10 text-info">
                                <Award size={23} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}

            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <h2 className="font-semibold flex items-center gap-2">
                            <Filter size={18} />
                            Filter Results
                        </h2>

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="btn btn-ghost btn-xs text-primary"
                        >
                            Reset Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
                        <label className="form-control">
                            <span className="label-text text-xs mb-1">
                                Academic Year
                            </span>

                            <select
                                className="select select-bordered select-sm"
                                value={academicYear}
                                onChange={updateFilter(setAcademicYear)}
                            >
                                <option value="">All Years</option>

                                {academicYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="form-control">
                            <span className="label-text text-xs mb-1">
                                Examination
                            </span>

                            <select
                                className="select select-bordered select-sm"
                                value={examId}
                                onChange={updateFilter(setExamId)}
                            >
                                <option value="">All Examinations</option>

                                {examinations.map((exam) => (
                                    <option
                                        key={exam.exam_id}
                                        value={exam.exam_id}
                                    >
                                        {exam.exam_name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="form-control">
                            <span className="label-text text-xs mb-1">
                                Subject
                            </span>

                            <select
                                className="select select-bordered select-sm"
                                value={subjectId}
                                onChange={updateFilter(setSubjectId)}
                            >
                                <option value="">All Subjects</option>

                                {subjects.map((subject) => (
                                    <option
                                        key={subject.subject_id}
                                        value={subject.subject_id}
                                    >
                                        {subject.subject_name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="form-control">
                            <span className="label-text text-xs mb-1">
                                Result Status
                            </span>

                            <select
                                className="select select-bordered select-sm"
                                value={resultStatus}
                                onChange={updateFilter(setResultStatus)}
                            >
                                <option value="">All Results</option>
                                <option value="pass">Passed</option>
                                <option value="fail">Failed</option>
                            </select>
                        </label>

                        <label className="form-control">
                            <span className="label-text text-xs mb-1">
                                Search
                            </span>

                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                                />

                                <input
                                    type="text"
                                    className="input input-bordered input-sm w-full pl-9"
                                    placeholder="Exam or subject..."
                                    value={searchTerm}
                                    onChange={(event) => {
                                        setSearchTerm(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Result Table */}

            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="font-bold text-lg">
                                Published Examination Results
                            </h2>

                            <p className="text-xs text-base-content/50 mt-1">
                                Complete list of your subject-wise results
                            </p>
                        </div>

                        <div className="badge badge-outline gap-2 p-3">
                            <FileText size={14} />
                            {filteredResults.length} Results
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Examination</th>
                                    <th>Subject</th>
                                    <th>Marks</th>
                                    <th>Percentage</th>
                                    <th>Grade</th>
                                    <th>GPA</th>
                                    <th>Status</th>
                                    <th>Published</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedResults.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="10"
                                            className="text-center py-12"
                                        >
                                            <div className="flex flex-col items-center text-base-content/50">
                                                <BookOpen
                                                    size={38}
                                                    className="mb-3 opacity-40"
                                                />

                                                <p className="font-medium">
                                                    No results found
                                                </p>

                                                <p className="text-xs mt-1">
                                                    Try changing your filters.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedResults.map((result, index) => (
                                        <tr
                                            key={`${result.exam_id}-${result.subject_id}-${index}`}
                                        >
                                            <td>
                                                {startRecord + index}
                                            </td>

                                            <td>
                                                <div className="font-medium">
                                                    {result.exam_name || "N/A"}
                                                </div>

                                                <div className="text-xs text-base-content/50">
                                                    {result.academic_year || ""}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="font-medium">
                                                    {result.subject_name || "N/A"}
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap">
                                                <span className="font-semibold">
                                                    {result.obtained_marks ?? 0}
                                                </span>

                                                <span className="text-base-content/50">
                                                    {" "}
                                                    / {result.total_marks ?? 0}
                                                </span>
                                            </td>

                                            <td className="font-medium">
                                                {formatNumber(
                                                    result.percentage,
                                                    1
                                                )}
                                                %
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getGradeBadge(
                                                        result.grade
                                                    )}`}
                                                >
                                                    {result.grade || "N/A"}
                                                </span>
                                            </td>

                                            <td className="font-semibold">
                                                {formatNumber(
                                                    result.grade_point
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getResultBadge(
                                                        result.result
                                                    )}`}
                                                >
                                                    {result.result || "N/A"}
                                                </span>
                                            </td>

                                            <td className="text-xs whitespace-nowrap">
                                                {formatDate(result.published_at)}
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedResult(result)
                                                    }
                                                    className="btn btn-ghost btn-sm text-primary"
                                                    title="View result details"
                                                >
                                                    <Eye size={17} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}

                    {filteredResults.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
                            <p className="text-xs text-base-content/60">
                                Showing {startRecord} to {endRecord} of{" "}
                                {filteredResults.length} results
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline"
                                    disabled={safePage <= 1}
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.max(1, page - 1)
                                        )
                                    }
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </button>

                                <span className="text-sm font-medium px-2">
                                    {safePage} / {totalPages}
                                </span>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline"
                                    disabled={safePage >= totalPages}
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.min(totalPages, page + 1)
                                        )
                                    }
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Information */}

            <div className="alert bg-info/10 border border-info/20 text-base-content">
                <AlertCircle
                    size={20}
                    className="text-info shrink-0"
                />

                <div>
                    <h3 className="font-semibold text-sm">
                        Important Information
                    </h3>

                    <p className="text-xs text-base-content/60 mt-1">
                        This list contains only officially published
                        examination results. Unpublished or draft marks
                        are not visible to students.
                    </p>
                </div>
            </div>

            {/* Result Details Modal */}

            <ResultDetailsModal
                result={selectedResult}
                onClose={() => setSelectedResult(null)}
            />
        </div>
    );
};

export default ResultList;
