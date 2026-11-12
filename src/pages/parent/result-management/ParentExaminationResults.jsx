
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Award,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ClipboardList,
    Download,
    GraduationCap,
    Printer,
    Search,
    TrendingUp,
    Trophy,
    XCircle,
} from "lucide-react";

import {
    getParentExaminationResults,
} from "../../../services/parentResultService.js";

const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? Number(number.toFixed(2)).toString()
        : "0";
};

const getGradeColor = (grade) => {
    if (grade === "A+") return "badge-success";
    if (grade === "A" || grade === "A-") return "badge-info";
    if (grade === "B" || grade === "C") return "badge-warning";
    if (grade === "D") return "badge-secondary";
    return "badge-error";
};

const getResultColor = (result) => {
    return String(result).toLowerCase() === "pass"
        ? "badge-success"
        : "badge-error";
};

const getPercentageColor = (percentage) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-info";
    if (percentage >= 40) return "text-warning";
    return "text-error";
};

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm text-base-content/60">
                        {title}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                        {value}
                    </h3>

                    {subtitle && (
                        <p className="mt-1 text-xs text-base-content/50">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className={`rounded-xl p-3 ${color}`}>
                    <Icon size={23} />
                </div>
            </div>
        </div>
    </div>
);

const ParentExaminationResults = () => {
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [selectedExamId, setSelectedExamId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: [
            "parent-examination-results",
            selectedStudentId,
            selectedExamId,
        ],
        queryFn: () =>
            getParentExaminationResults({
                studentId: selectedStudentId,
                examId: selectedExamId,
            }),
    });

    const children = data?.children || [];
    const examinations = data?.examinations || [];
    const results = data?.results || [];
    const summary = data?.summary || {};

    const selectedChild = useMemo(
        () =>
            children.find(
                (child) => child.student_id === selectedStudentId
            ) || null,
        [children, selectedStudentId]
    );

    const selectedExam = useMemo(
        () =>
            examinations.find(
                (exam) => exam.exam_id === selectedExamId
            ) || null,
        [examinations, selectedExamId]
    );

    const filteredResults = useMemo(() => {
        return results.filter((item) =>
            String(item.subject_name || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [results, searchTerm]);

    const highestSubject = useMemo(() => {
        if (!results.length) return null;

        return [...results].sort(
            (a, b) =>
                Number(b.obtained_marks || 0) -
                Number(a.obtained_marks || 0)
        )[0];
    }, [results]);

    const lowestSubject = useMemo(() => {
        if (!results.length) return null;

        return [...results].sort(
            (a, b) =>
                Number(a.obtained_marks || 0) -
                Number(b.obtained_marks || 0)
        )[0];
    }, [results]);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-error">
                <XCircle size={20} />
                <div>
                    <h3 className="font-bold">
                        Unable to load examination results
                    </h3>
                    <p className="text-sm">
                        {error?.response?.data?.message ||
                            error?.message ||
                            "Something went wrong."}
                    </p>
                </div>

                <button
                    className="btn btn-sm"
                    onClick={() => refetch()}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-base-content/50">
                        <GraduationCap size={17} />
                        <span>Parent Portal</span>
                        <span>/</span>
                        <span>Result Management</span>
                    </div>

                    <h1 className="text-2xl font-bold md:text-3xl">
                        Examination Results
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        View your children's published examination
                        results and academic performance.
                    </p>
                </div>

                <button
                    onClick={handlePrint}
                    disabled={!results.length}
                    className="btn btn-primary gap-2 print:hidden"
                >
                    <Printer size={18} />
                    Print Report Card
                </button>
            </div>

            {/* Filters */}
            <div className="card border border-base-300 bg-base-100 shadow-sm print:hidden">
                <div className="card-body grid grid-cols-1 gap-4 p-5 md:grid-cols-2">

                    {/* Child selector */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">
                                Select Child
                            </span>
                        </label>

                        <div className="relative">
                            <select
                                className="select select-bordered w-full"
                                value={selectedStudentId}
                                onChange={(e) => {
                                    setSelectedStudentId(e.target.value);
                                    setSelectedExamId("");
                                }}
                            >
                                <option value="">
                                    Select a child
                                </option>

                                {children.map((child) => (
                                    <option
                                        key={child.student_id}
                                        value={child.student_id}
                                    >
                                        {child.full_name} -{" "}
                                        {child.class_name}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown
                                size={16}
                                className="pointer-events-none absolute right-4 top-4 text-base-content/40"
                            />
                        </div>
                    </div>

                    {/* Examination selector */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">
                                Select Examination
                            </span>
                        </label>

                        <select
                            className="select select-bordered w-full"
                            value={selectedExamId}
                            onChange={(e) =>
                                setSelectedExamId(e.target.value)
                            }
                            disabled={!selectedStudentId}
                        >
                            <option value="">
                                Select an examination
                            </option>

                            {examinations.map((exam) => (
                                <option
                                    key={exam.exam_id}
                                    value={exam.exam_id}
                                >
                                    {exam.exam_name}
                                    {exam.academic_year
                                        ? ` (${exam.academic_year})`
                                        : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Child information */}
            {selectedChild && (
                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <GraduationCap size={28} />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-xl font-bold">
                                    {selectedChild.full_name}
                                </h2>

                                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-base-content/60">
                                    <span>
                                        Student ID:{" "}
                                        {selectedChild.student_code || "N/A"}
                                    </span>

                                    <span>
                                        Class:{" "}
                                        {selectedChild.class_name || "N/A"}
                                    </span>

                                    <span>
                                        Section:{" "}
                                        {selectedChild.section_name || "N/A"}
                                    </span>

                                    <span>
                                        Roll:{" "}
                                        {selectedChild.roll_number || "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="badge badge-primary badge-lg">
                                Student
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty selection */}
            {!selectedStudentId && (
                <div className="rounded-xl border border-dashed border-base-300 bg-base-100 py-16 text-center">
                    <GraduationCap
                        size={48}
                        className="mx-auto text-base-content/30"
                    />

                    <h3 className="mt-4 text-lg font-semibold">
                        Select a Child
                    </h3>

                    <p className="mt-2 text-sm text-base-content/50">
                        Choose a child to view their published
                        examination results.
                    </p>
                </div>
            )}

            {selectedStudentId && !selectedExamId && (
                <div className="rounded-xl border border-dashed border-base-300 bg-base-100 py-12 text-center">
                    <ClipboardList
                        size={42}
                        className="mx-auto text-base-content/30"
                    />

                    <h3 className="mt-3 text-lg font-semibold">
                        Select an Examination
                    </h3>

                    <p className="mt-2 text-sm text-base-content/50">
                        Choose an examination to see the detailed
                        report card.
                    </p>
                </div>
            )}

            {/* Examination report */}
            {selectedExamId && (
                <>
                    {/* Exam heading */}
                    <div className="card border border-base-300 bg-base-100 shadow-sm">
                        <div className="card-body p-5">
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-primary">
                                        <Award size={18} />
                                        <span className="font-semibold">
                                            Academic Report Card
                                        </span>
                                    </div>

                                    <h2 className="mt-2 text-2xl font-bold">
                                        {selectedExam?.exam_name ||
                                            "Examination"}
                                    </h2>

                                    <p className="mt-1 text-sm text-base-content/60">
                                        Academic Year:{" "}
                                        {selectedExam?.academic_year ||
                                            "N/A"}
                                    </p>
                                </div>

                                <div className="text-sm md:text-right">
                                    <div className="flex items-center gap-2 md:justify-end">
                                        <CalendarDays
                                            size={17}
                                            className="text-base-content/50"
                                        />
                                        <span>
                                            Published:{" "}
                                            {formatDate(
                                                summary.published_at
                                            )}
                                        </span>
                                    </div>

                                    <div className="mt-2">
                                        <span
                                            className={`badge badge-lg ${
                                                String(summary.result).toLowerCase() ===
                                                "pass"
                                                    ? "badge-success"
                                                    : "badge-error"
                                            }`}
                                        >
                                            {summary.result || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            title="Total Marks"
                            value={formatNumber(summary.total_marks)}
                            subtitle="Maximum obtainable marks"
                            icon={BookOpen}
                            color="bg-primary/10 text-primary"
                        />

                        <StatCard
                            title="Obtained Marks"
                            value={formatNumber(summary.obtained_marks)}
                            subtitle="Marks achieved"
                            icon={Trophy}
                            color="bg-success/10 text-success"
                        />

                        <StatCard
                            title="Average Percentage"
                            value={`${formatNumber(
                                summary.average_percentage
                            )}%`}
                            subtitle="Overall performance"
                            icon={TrendingUp}
                            color="bg-info/10 text-info"
                        />

                        <StatCard
                            title="GPA"
                            value={formatNumber(summary.gpa)}
                            subtitle="Grade point average"
                            icon={Award}
                            color="bg-warning/10 text-warning"
                        />
                    </div>

                    {/* Result details */}
                    <div className="card border border-base-300 bg-base-100 shadow-sm">
                        <div className="card-body p-0">
                            <div className="flex flex-col justify-between gap-3 p-5 md:flex-row md:items-center">
                                <div>
                                    <h3 className="text-lg font-bold">
                                        Subject-wise Results
                                    </h3>

                                    <p className="text-sm text-base-content/50">
                                        Detailed marks and grades for each subject
                                    </p>
                                </div>

                                <label className="input input-bordered flex items-center gap-2 print:hidden">
                                    <Search
                                        size={17}
                                        className="text-base-content/40"
                                    />

                                    <input
                                        type="text"
                                        className="grow"
                                        placeholder="Search subject..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </label>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Subject</th>
                                            <th className="text-center">
                                                Total
                                            </th>
                                            <th className="text-center">
                                                Pass
                                            </th>
                                            <th className="text-center">
                                                Obtained
                                            </th>
                                            <th className="text-center">
                                                Percentage
                                            </th>
                                            <th className="text-center">
                                                Grade
                                            </th>
                                            <th className="text-center">
                                                GPA
                                            </th>
                                            <th className="text-center">
                                                Result
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredResults.length > 0 ? (
                                            filteredResults.map(
                                                (item, index) => (
                                                    <tr key={`${item.subject_id}-${index}`}>
                                                        <td>{index + 1}</td>

                                                        <td className="font-semibold">
                                                            {item.subject_name}
                                                        </td>

                                                        <td className="text-center">
                                                            {formatNumber(
                                                                item.total_marks
                                                            )}
                                                        </td>

                                                        <td className="text-center">
                                                            {formatNumber(
                                                                item.pass_marks
                                                            )}
                                                        </td>

                                                        <td className="text-center font-bold">
                                                            {formatNumber(
                                                                item.obtained_marks
                                                            )}
                                                        </td>

                                                        <td
                                                            className={`text-center font-semibold ${getPercentageColor(
                                                                Number(
                                                                    item.percentage
                                                                )
                                                            )}`}
                                                        >
                                                            {formatNumber(
                                                                item.percentage
                                                            )}%
                                                        </td>

                                                        <td className="text-center">
                                                            <span
                                                                className={`badge ${getGradeColor(
                                                                    item.grade
                                                                )}`}
                                                            >
                                                                {item.grade || "N/A"}
                                                            </span>
                                                        </td>

                                                        <td className="text-center font-semibold">
                                                            {formatNumber(
                                                                item.grade_point
                                                            )}
                                                        </td>

                                                        <td className="text-center">
                                                            <span
                                                                className={`badge ${getResultColor(
                                                                    item.result
                                                                )}`}
                                                            >
                                                                {item.result || "N/A"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="9"
                                                    className="py-10 text-center text-base-content/50"
                                                >
                                                    No subject results found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-wrap justify-between gap-3 border-t border-base-300 p-5 text-sm">
                                <span className="text-base-content/60">
                                    Total subjects: {results.length}
                                </span>

                                <div className="flex flex-wrap gap-4">
                                    <span className="flex items-center gap-1 text-success">
                                        <CheckCircle2 size={16} />
                                        Passed: {summary.passed_subjects || 0}
                                    </span>

                                    <span className="flex items-center gap-1 text-error">
                                        <XCircle size={16} />
                                        Failed: {summary.failed_subjects || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance highlights */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="card border border-base-300 bg-base-100 shadow-sm">
                            <div className="card-body">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-success/10 p-3 text-success">
                                        <Trophy size={22} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-base-content/50">
                                            Highest Scoring Subject
                                        </p>

                                        <h3 className="font-bold">
                                            {highestSubject?.subject_name ||
                                                "N/A"}
                                        </h3>
                                    </div>
                                </div>

                                <p className="mt-3 text-2xl font-bold text-success">
                                    {highestSubject
                                        ? `${formatNumber(
                                              highestSubject.obtained_marks
                                          )} / ${formatNumber(
                                              highestSubject.total_marks
                                          )}`
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="card border border-base-300 bg-base-100 shadow-sm">
                            <div className="card-body">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-warning/10 p-3 text-warning">
                                        <TrendingUp size={22} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-base-content/50">
                                            Lowest Scoring Subject
                                        </p>

                                        <h3 className="font-bold">
                                            {lowestSubject?.subject_name ||
                                                "N/A"}
                                        </h3>
                                    </div>
                                </div>

                                <p className="mt-3 text-2xl font-bold text-warning">
                                    {lowestSubject
                                        ? `${formatNumber(
                                              lowestSubject.obtained_marks
                                          )} / ${formatNumber(
                                              lowestSubject.total_marks
                                          )}`
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="rounded-xl border border-base-300 bg-base-100 p-5 text-center text-sm text-base-content/50">
                        This report displays published examination results
                        only. For any discrepancy, please contact the school
                        administration.
                    </div>
                </>
            )}
        </div>
    );
};

export default ParentExaminationResults;
