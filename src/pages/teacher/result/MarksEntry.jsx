
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Save,
    Send,
    Search,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    LoaderCircle,
    Users,
    BookOpen,
    CalendarDays,
    FileText,
    Award,
    TrendingUp,
} from "lucide-react";

import {
    getStudentsForMarksEntry,
    getExaminationMarks,
    saveExaminationMarks,
    submitExaminationResults,
} from "../../../services/teacherResultService.js";

// --------------------------------------------------
// Helper Functions
// --------------------------------------------------

const getResponseData = (response) => {
    return response?.data ?? response;
};

const getStudentId = (student) => {
    return String(student.student_id ?? student._id);
};

const getStudentName = (student) => {
    return (
        student.full_name ||
        [student.first_name, student.last_name]
            .filter(Boolean)
            .join(" ") ||
        student.name ||
        "Unknown Student"
    );
};

const calculateResult = (obtainedMarks, totalMarks, passMarks) => {
    if (
        obtainedMarks === "" ||
        obtainedMarks === null ||
        obtainedMarks === undefined
    ) {
        return {
            percentage: null,
            result: "Pending",
        };
    }

    const marks = Number(obtainedMarks);

    if (!Number.isFinite(marks)) {
        return {
            percentage: null,
            result: "Pending",
        };
    }

    const percentage = (marks / totalMarks) * 100;

    return {
        percentage,
        result:
            marks >= passMarks
                ? "Pass"
                : "Fail",
    };
};

// --------------------------------------------------
// Main Component
// --------------------------------------------------

const MarksEntry = () => {
    const { examId, sectionId, subjectId } = useParams();

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // --------------------------------------------------
    // State
    // --------------------------------------------------

    const [searchTerm, setSearchTerm] = useState("");
    const [marks, setMarks] = useState({});
    const [initialized, setInitialized] = useState(false);
    const [actionMessage, setActionMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const queryParams = {
        examId,
        sectionId,
        subjectId,
    };

    // --------------------------------------------------
    // Fetch Students
    // --------------------------------------------------

    const {
        data: studentResponse,
        isLoading: studentsLoading,
        isError: studentsError,
        error: studentsErrorObject,
        refetch: refetchStudents,
    } = useQuery({
        queryKey: [
            "teacher-marks-entry-students",
            examId,
            sectionId,
            subjectId,
        ],
        queryFn: () => getStudentsForMarksEntry(queryParams),
        enabled: Boolean(examId && sectionId && subjectId),
    });

    // --------------------------------------------------
    // Fetch Existing Marks
    // --------------------------------------------------

    const {
        data: marksResponse,
        isLoading: marksLoading,
        isError: marksError,
        error: marksErrorObject,
        refetch: refetchMarks,
    } = useQuery({
        queryKey: [
            "teacher-examination-marks",
            examId,
            sectionId,
            subjectId,
        ],
        queryFn: () => getExaminationMarks(queryParams),
        enabled: Boolean(examId && sectionId && subjectId),
    });

    const studentData = getResponseData(studentResponse);
    const existingMarksData = getResponseData(marksResponse);

    const students = Array.isArray(studentData)
        ? studentData
        : studentData?.students || [];

    const existingMarks = Array.isArray(existingMarksData)
        ? existingMarksData
        : existingMarksData?.marks || [];

    // --------------------------------------------------
    // Examination Information
    // --------------------------------------------------

    const examination = studentData?.examination || {};
    const section = studentData?.section || {};
    const subject = studentData?.subject || {};

    const totalMarks = Number(
        examination.total_marks ??
        studentData?.total_marks ??
        100
    );

    const passMarks = Number(
        examination.pass_marks ??
        studentData?.pass_marks ??
        33
    );

    // --------------------------------------------------
    // Initialize Marks
    // --------------------------------------------------

    useEffect(() => {
        if (initialized || studentsLoading || marksLoading) {
            return;
        }

        const savedMarksMap = {};

        existingMarks.forEach((item) => {
            savedMarksMap[String(item.student_id)] =
                item.obtained_marks ?? "";
        });

        const initialMarks = {};

        students.forEach((student) => {
            const studentId = getStudentId(student);

            initialMarks[studentId] =
                savedMarksMap[studentId] !== undefined
                    ? String(savedMarksMap[studentId])
                    : "";
        });

        setMarks(initialMarks);
        setInitialized(true);
    }, [
        initialized,
        studentsLoading,
        marksLoading,
        students,
        existingMarks,
    ]);

    // --------------------------------------------------
    // Search Students
    // --------------------------------------------------

    const filteredStudents = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();

        if (!search) return students;

        return students.filter((student) => {
            return (
                getStudentName(student)
                    .toLowerCase()
                    .includes(search) ||

                String(student.student_id || "")
                    .toLowerCase()
                    .includes(search) ||

                String(student.roll_number || "")
                    .toLowerCase()
                    .includes(search)
            );
        });
    }, [students, searchTerm]);

    // --------------------------------------------------
    // Summary
    // --------------------------------------------------

    const summary = useMemo(() => {
        let entered = 0;
        let passed = 0;
        let failed = 0;

        students.forEach((student) => {
            const value = marks[getStudentId(student)];

            if (value === "" || value === undefined) {
                return;
            }

            entered++;

            if (Number(value) >= passMarks) {
                passed++;
            } else {
                failed++;
            }
        });

        return {
            total: students.length,
            entered,
            pending: students.length - entered,
            passed,
            failed,
        };
    }, [students, marks, passMarks]);

    // --------------------------------------------------
    // Handle Marks Change
    // --------------------------------------------------

    const handleMarkChange = (studentId, value) => {
        setMarks((previous) => ({
            ...previous,
            [studentId]: value,
        }));

        setActionMessage("");
    };

    // --------------------------------------------------
    // Validate Marks
    // --------------------------------------------------

    const validateMarks = () => {
        if (!students.length) {
            return "No students found in this section.";
        }

        if (
            !Number.isFinite(totalMarks) ||
            totalMarks <= 0 ||
            !Number.isFinite(passMarks) ||
            passMarks < 0 ||
            passMarks > totalMarks
        ) {
            return "Invalid examination marks configuration.";
        }

        for (const student of students) {
            const studentId = getStudentId(student);
            const value = marks[studentId];

            if (value === "" || value === undefined) {
                return `Please enter marks for ${getStudentName(student)}.`;
            }

            const numericValue = Number(value);

            if (
                !Number.isFinite(numericValue) ||
                numericValue < 0 ||
                numericValue > totalMarks
            ) {
                return `Marks for ${getStudentName(student)} must be between 0 and ${totalMarks}.`;
            }
        }

        return null;
    };

    // --------------------------------------------------
    // Build Payload
    // --------------------------------------------------

    const buildPayload = () => {
        return {
            exam_id: examId,
            section_id: sectionId,
            subject_id: subjectId,
            total_marks: totalMarks,
            pass_marks: passMarks,

            marks: students.map((student) => ({
                student_id: getStudentId(student),
                obtained_marks: Number(
                    marks[getStudentId(student)]
                ),
            })),
        };
    };

    // --------------------------------------------------
    // Save Draft Mutation
    // --------------------------------------------------

    const saveMutation = useMutation({
        mutationFn: saveExaminationMarks,

        onSuccess: async () => {
            setMessageType("success");
            setActionMessage("Marks saved successfully.");

            await queryClient.invalidateQueries({
                queryKey: [
                    "teacher-examination-marks",
                    examId,
                    sectionId,
                    subjectId,
                ],
            });
        },

        onError: (error) => {
            setMessageType("error");

            setActionMessage(
                error.response?.data?.message ||
                error.message ||
                "Failed to save marks."
            );
        },
    });

    // --------------------------------------------------
    // Submit Results Mutation
    // --------------------------------------------------

    const submitMutation = useMutation({
        mutationFn: submitExaminationResults,

        onSuccess: async () => {
            setMessageType("success");
            setActionMessage(
                "Examination results submitted successfully."
            );

            await queryClient.invalidateQueries({
                queryKey: [
                    "teacher-examination-marks",
                    examId,
                    sectionId,
                    subjectId,
                ],
            });
        },

        onError: (error) => {
            setMessageType("error");

            setActionMessage(
                error.response?.data?.message ||
                error.message ||
                "Failed to submit results."
            );
        },
    });

    // --------------------------------------------------
    // Save Draft
    // --------------------------------------------------

    const handleSaveDraft = () => {
        if (saveMutation.isPending || submitMutation.isPending) {
            return;
        }

        if (
            !Number.isFinite(totalMarks) ||
            totalMarks <= 0
        ) {
            setMessageType("error");
            setActionMessage("Invalid maximum marks.");
            return;
        }

        const enteredMarks = students
            .filter((student) => {
                const value = marks[getStudentId(student)];

                return value !== "" && value !== undefined;
            })
            .map((student) => ({
                student_id: getStudentId(student),
                obtained_marks: Number(
                    marks[getStudentId(student)]
                ),
            }));

        const invalidMarks = enteredMarks.some((item) => {
            return (
                !Number.isFinite(item.obtained_marks) ||
                item.obtained_marks < 0 ||
                item.obtained_marks > totalMarks
            );
        });

        if (invalidMarks) {
            setMessageType("error");
            setActionMessage(
                `Marks must be between 0 and ${totalMarks}.`
            );
            return;
        }

        if (!students.length) {
            setMessageType("error");
            setActionMessage("No students available.");
            return;
        }

        saveMutation.mutate({
            exam_id: examId,
            section_id: sectionId,
            subject_id: subjectId,
            total_marks: totalMarks,
            pass_marks: passMarks,
            marks: enteredMarks,
        });
    };

    // --------------------------------------------------
    // Submit Results
    // --------------------------------------------------

    const handleSubmitResults = () => {
        if (saveMutation.isPending || submitMutation.isPending) {
            return;
        }

        const validationError = validateMarks();

        if (validationError) {
            setMessageType("error");
            setActionMessage(validationError);
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to submit these results? Please verify all student marks before continuing."
        );

        if (!confirmed) return;

        submitMutation.mutate(buildPayload());
    };

    // --------------------------------------------------
    // Loading State
    // --------------------------------------------------

    if (studentsLoading || marksLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-primary" />

                    <p className="mt-3 text-sm text-base-content/60">
                        Loading examination and student information...
                    </p>
                </div>
            </div>
        );
    }

    // --------------------------------------------------
    // Error State
    // --------------------------------------------------

    if (studentsError || marksError) {
        const errorMessage =
            studentsErrorObject?.response?.data?.message ||
            marksErrorObject?.response?.data?.message ||
            "Unable to load marks entry information.";

        return (
            <div className="flex min-h-[60vh] items-center justify-center p-4">
                <div className="w-full max-w-md rounded-2xl border border-error/20 bg-base-100 p-8 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-error" />

                    <h2 className="mt-4 text-xl font-bold">
                        Something went wrong
                    </h2>

                    <p className="mt-2 text-sm text-base-content/60">
                        {errorMessage}
                    </p>

                    <button
                        onClick={() => {
                            refetchStudents();
                            refetchMarks();
                        }}
                        className="btn btn-primary btn-sm mt-5"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // --------------------------------------------------
    // Main UI
    // --------------------------------------------------

    return (
        <div className="space-y-6 p-4 md:p-6">

            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">

                <div>
                    <button
                        onClick={() =>
                            navigate("/results/examinations")
                        }
                        className="btn btn-ghost btn-sm mb-3"
                    >
                        <ArrowLeft size={16} />
                        Back to Examinations
                    </button>

                    <h1 className="text-2xl font-bold md:text-3xl">
                        Marks Entry
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        Enter, review and submit student examination marks.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-primary">
                    <FileText size={22} />

                    <div>
                        <p className="text-xs opacity-70">
                            Examination
                        </p>

                        <p className="font-semibold">
                            {examination.name ||
                                studentData?.exam_name ||
                                "Examination"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Examination Information */}
            <div className="grid gap-4 rounded-2xl border border-base-300 bg-base-100 p-5 sm:grid-cols-2 lg:grid-cols-4">

                <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                        <FileText size={20} />
                    </div>

                    <div>
                        <p className="text-xs text-base-content/50">
                            Examination
                        </p>

                        <h3 className="mt-1 font-semibold">
                            {examination.name ||
                                studentData?.exam_name ||
                                "—"}
                        </h3>

                        <p className="text-xs text-base-content/50">
                            {examination.exam_type ||
                                studentData?.exam_type ||
                                ""}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-secondary/10 p-3 text-secondary">
                        <Users size={20} />
                    </div>

                    <div>
                        <p className="text-xs text-base-content/50">
                            Class / Section
                        </p>

                        <h3 className="mt-1 font-semibold">
                            {section.class_name ||
                                studentData?.class_name ||
                                "—"}{" "}
                            -{" "}
                            {section.name ||
                                studentData?.section_name ||
                                "—"}
                        </h3>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-info/10 p-3 text-info">
                        <BookOpen size={20} />
                    </div>

                    <div>
                        <p className="text-xs text-base-content/50">
                            Subject
                        </p>

                        <h3 className="mt-1 font-semibold">
                            {subject.subject_name ||
                                subject.name ||
                                studentData?.subject_name ||
                                "—"}
                        </h3>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-success/10 p-3 text-success">
                        <CalendarDays size={20} />
                    </div>

                    <div>
                        <p className="text-xs text-base-content/50">
                            Academic Year
                        </p>

                        <h3 className="mt-1 font-semibold">
                            {examination.academic_year ||
                                studentData?.academic_year ||
                                "—"}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">

                <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-base-content/50">
                            Total Students
                        </p>

                        <Users size={18} className="text-primary" />
                    </div>

                    <h2 className="mt-2 text-2xl font-bold">
                        {summary.total}
                    </h2>
                </div>

                <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-base-content/50">
                            Marks Entered
                        </p>

                        <CheckCircle2 size={18} className="text-success" />
                    </div>

                    <h2 className="mt-2 text-2xl font-bold text-success">
                        {summary.entered}
                    </h2>
                </div>

                <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-base-content/50">
                            Passed
                        </p>

                        <Award size={18} className="text-success" />
                    </div>

                    <h2 className="mt-2 text-2xl font-bold text-success">
                        {summary.passed}
                    </h2>
                </div>

                <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-base-content/50">
                            Failed
                        </p>

                        <AlertCircle size={18} className="text-error" />
                    </div>

                    <h2 className="mt-2 text-2xl font-bold text-error">
                        {summary.failed}
                    </h2>
                </div>

                <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-base-content/50">
                            Pending
                        </p>

                        <TrendingUp size={18} className="text-warning" />
                    </div>

                    <h2 className="mt-2 text-2xl font-bold text-warning">
                        {summary.pending}
                    </h2>
                </div>
            </div>

            {/* Marks Configuration */}
            <div className="flex flex-wrap items-center gap-6 rounded-xl border border-base-300 bg-base-100 p-5">

                <div>
                    <p className="text-xs text-base-content/50">
                        Maximum Marks
                    </p>

                    <p className="mt-1 text-xl font-bold">
                        {totalMarks}
                    </p>
                </div>

                <div className="hidden h-10 w-px bg-base-300 sm:block" />

                <div>
                    <p className="text-xs text-base-content/50">
                        Pass Marks
                    </p>

                    <p className="mt-1 text-xl font-bold text-success">
                        {passMarks}
                    </p>
                </div>

                <div className="hidden h-10 w-px bg-base-300 sm:block" />

                <div className="min-w-40 flex-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-base-content/50">
                            Marks Entry Progress
                        </span>

                        <span className="font-semibold">
                            {summary.total
                                ? Math.round(
                                    (summary.entered / summary.total) * 100
                                )
                                : 0}%
                        </span>
                    </div>

                    <progress
                        className="progress progress-primary mt-2 w-full"
                        value={summary.entered}
                        max={summary.total || 1}
                    />
                </div>
            </div>

            {/* Student Marks Table */}
            <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100">

                {/* Table Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-300 p-5">

                    <div>
                        <h2 className="text-lg font-bold">
                            Student Marks
                        </h2>

                        <p className="mt-1 text-xs text-base-content/50">
                            Enter obtained marks for every student.
                        </p>
                    </div>

                    <label className="input input-bordered flex w-full items-center gap-2 sm:w-72">
                        <Search size={17} className="opacity-50" />

                        <input
                            type="text"
                            placeholder="Search name, ID or roll..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                        />
                    </label>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">

                    <table className="table table-zebra">

                        <thead>
                            <tr>
                                <th>SL</th>
                                <th>Student Information</th>
                                <th>Student ID</th>
                                <th>Roll</th>
                                <th>Obtained Marks</th>
                                <th>Percentage</th>
                                <th>Result</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredStudents.map((student, index) => {
                                const studentId = getStudentId(student);

                                const value =
                                    marks[studentId] ?? "";

                                const result = calculateResult(
                                    value,
                                    totalMarks,
                                    passMarks
                                );

                                const invalidValue =
                                    value !== "" &&
                                    (
                                        !Number.isFinite(Number(value)) ||
                                        Number(value) < 0 ||
                                        Number(value) > totalMarks
                                    );

                                return (
                                    <tr key={studentId}>

                                        <td>
                                            {index + 1}
                                        </td>

                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                                    {getStudentName(student)
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div>
                                                    <p className="font-semibold">
                                                        {getStudentName(student)}
                                                    </p>

                                                    <p className="text-xs text-base-content/50">
                                                        {student.gender || ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            {student.student_id || "—"}
                                        </td>

                                        <td>
                                            {student.roll_number ?? "—"}
                                        </td>

                                        <td>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={totalMarks}
                                                    step="any"
                                                    value={value}
                                                    placeholder="0"
                                                    onChange={(event) =>
                                                        handleMarkChange(
                                                            studentId,
                                                            event.target.value
                                                        )
                                                    }
                                                    className={`input input-bordered input-sm w-24 ${
                                                        invalidValue
                                                            ? "input-error"
                                                            : ""
                                                    }`}
                                                />

                                                <span className="text-xs text-base-content/50">
                                                    / {totalMarks}
                                                </span>
                                            </div>

                                            {invalidValue && (
                                                <p className="mt-1 text-xs text-error">
                                                    Invalid marks
                                                </p>
                                            )}
                                        </td>

                                        <td>
                                            {result.percentage === null
                                                ? "—"
                                                : `${result.percentage.toFixed(2)}%`}
                                        </td>

                                        <td>
                                            {result.result === "Pending" ? (
                                                <span className="badge badge-ghost">
                                                    Pending
                                                </span>
                                            ) : result.result === "Pass" ? (
                                                <span className="badge badge-success badge-outline">
                                                    Pass
                                                </span>
                                            ) : (
                                                <span className="badge badge-error badge-outline">
                                                    Fail
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-12 text-center text-base-content/50"
                                    >
                                        {students.length
                                            ? "No matching students found."
                                            : "No students found in this section."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="flex flex-col justify-between gap-4 border-t border-base-300 p-5 sm:flex-row sm:items-center">

                    <div>
                        <p className="text-sm font-medium">
                            {filteredStudents.length} students displayed
                        </p>

                        <p className="text-xs text-base-content/50">
                            {summary.entered} marks entered out of {summary.total}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">

                        <button
                            onClick={handleSaveDraft}
                            disabled={
                                saveMutation.isPending ||
                                submitMutation.isPending ||
                                !students.length
                            }
                            className="btn btn-outline btn-primary"
                        >
                            {saveMutation.isPending ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                <Save size={17} />
                            )}

                            Save Draft
                        </button>

                        <button
                            onClick={handleSubmitResults}
                            disabled={
                                saveMutation.isPending ||
                                submitMutation.isPending ||
                                !students.length
                            }
                            className="btn btn-primary"
                        >
                            {submitMutation.isPending ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                <Send size={17} />
                            )}

                            Submit Results
                        </button>
                    </div>
                </div>
            </div>

            {/* Feedback Message */}
            {actionMessage && (
                <div
                    className={`alert ${
                        messageType === "success"
                            ? "alert-success"
                            : "alert-error"
                    }`}
                >
                    {messageType === "success" ? (
                        <CheckCircle2 size={20} />
                    ) : (
                        <AlertCircle size={20} />
                    )}

                    <span>{actionMessage}</span>
                </div>
            )}
        </div>
    );
};

export default MarksEntry;
