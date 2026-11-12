
// src/pages/schoolAdmin/Result.jsx

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    createSchoolAdminResult,
    deleteSchoolAdminResult,
    getSchoolAdminResultOptions,
    getSchoolAdminResults,
    getSchoolAdminResultSummary,
    publishSchoolAdminResult,
    updateSchoolAdminResult,
} from "../../services/schoolAdminResultService.js";

// Bangladesh school grading scale.
// The grade is calculated from percentage marks.
const calculateGrade = (marks, totalMarks) => {
    const obtained = Number(marks);
    const total = Number(totalMarks);

    if (
        !Number.isFinite(obtained) ||
        !Number.isFinite(total) ||
        total <= 0 ||
        obtained < 0 ||
        obtained > total
    ) {
        return {
            percentage: null,
            grade: "—",
            gpa: null,
            pass: false,
        };
    }

    const percentage = (obtained / total) * 100;

    if (percentage >= 80) {
        return { percentage, grade: "A+", gpa: 5.0, pass: true };
    }

    if (percentage >= 70) {
        return { percentage, grade: "A", gpa: 4.0, pass: true };
    }

    if (percentage >= 60) {
        return { percentage, grade: "A-", gpa: 3.5, pass: true };
    }

    if (percentage >= 50) {
        return { percentage, grade: "B", gpa: 3.0, pass: true };
    }

    if (percentage >= 40) {
        return { percentage, grade: "C", gpa: 2.0, pass: true };
    }

    if (percentage >= 33) {
        return { percentage, grade: "D", gpa: 1.0, pass: true };
    }

    return { percentage, grade: "F", gpa: 0.0, pass: false };
};

const EMPTY_FORM = {
    examination_id: "",
    examination_name: "",
    academic_year: String(new Date().getFullYear()),
    class_id: "",
    class_code: "",
    section_id: "",
    subject_id: "",
    student_id: "",
    marks_obtained: "",
    total_marks: "100",
    remarks: "",
};

const unwrapList = (response, key) => {
    if (Array.isArray(response?.[key])) return response[key];
    if (Array.isArray(response?.data?.[key])) return response.data[key];
    if (Array.isArray(response?.data)) return response.data;
    return [];
};

const getId = (item) => String(item?._id ?? item?.id ?? "");

const getLabel = (item, fields) => {
    for (const field of fields) {
        if (item?.[field]) return String(item[field]);
    }

    return "";
};

const Result = () => {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [academicYear, setAcademicYear] = useState(
        String(new Date().getFullYear())
    );
    const [examinationId, setExaminationId] = useState("");
    const [classCode, setClassCode] = useState("");
    const [sectionId, setSectionId] = useState("");
    const [status, setStatus] = useState("all");

    const [showForm, setShowForm] = useState(false);
    const [editingResult, setEditingResult] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState("");

    const filters = useMemo(
        () => ({
            search: search.trim(),
            academic_year: academicYear,
            examination_id: examinationId,
            class_code: classCode,
            section_id: sectionId,
            status: status === "all" ? "" : status,
        }),
        [
            search,
            academicYear,
            examinationId,
            classCode,
            sectionId,
            status,
        ]
    );

    const resultsQuery = useQuery({
        queryKey: ["school-admin", "results", filters],
        queryFn: () => getSchoolAdminResults(filters),
    });

    const summaryQuery = useQuery({
        queryKey: ["school-admin", "results-summary", filters],
        queryFn: () => getSchoolAdminResultSummary(filters),
    });

    const optionsQuery = useQuery({
        queryKey: [
            "school-admin",
            "result-options",
            classCode,
            sectionId,
        ],
        queryFn: () =>
            getSchoolAdminResultOptions({
                class_code: classCode,
                section_id: sectionId,
            }),
    });

    const results = unwrapList(resultsQuery.data, "results");

    // console.log("results",results)

    const options = optionsQuery.data?.data ?? optionsQuery.data ?? {};

    // console.log("options",options)

    const examinations = unwrapList(options, "examinations");
    const classes = unwrapList(options, "classes");
    const sections = unwrapList(options, "sections");
    const subjects = unwrapList(options, "subjects");
    const students = unwrapList(options, "students");
    const academicYears = unwrapList(options, "academic_years");

    const summary =
        summaryQuery.data?.summary ??
        summaryQuery.data?.data?.summary ??
        summaryQuery.data?.data ??
        summaryQuery.data ??
        {};

    const invalidateResults = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: ["school-admin", "results"],
            }),
            queryClient.invalidateQueries({
                queryKey: ["school-admin", "results-summary"],
            }),
        ]);
    };

    const createMutation = useMutation({
        mutationFn: createSchoolAdminResult,
        onSuccess: async () => {
            await invalidateResults();
            setShowForm(false);
            setEditingResult(null);
            setForm(EMPTY_FORM);
            setFormError("");
        },
        onError: (error) => {
            setFormError(
                error?.response?.data?.message ||
                "Unable to save the result. Please try again."
            );
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateSchoolAdminResult,
        onSuccess: async () => {
            await invalidateResults();
            setShowForm(false);
            setEditingResult(null);
            setForm(EMPTY_FORM);
            setFormError("");
        },
        onError: (error) => {
            setFormError(
                error?.response?.data?.message ||
                "Unable to update the result. Please try again."
            );
        },
    });

    const publishMutation = useMutation({
        mutationFn: publishSchoolAdminResult,
        onSuccess: invalidateResults,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSchoolAdminResult,
        onSuccess: invalidateResults,
    });

    const isSaving = createMutation.isPending || updateMutation.isPending;

    const openCreateForm = () => {
        setEditingResult(null);
        setForm({
            ...EMPTY_FORM,
            academic_year: academicYear,
            examination_id: examinationId,
            class_code: classCode,
            section_id: sectionId,
        });
        setFormError("");
        setShowForm(true);
    };

    const openEditForm = (result) => {
        if (result.status === "published") {
            window.alert(
                "This result is published. Unpublish it through an authorized workflow before editing."
            );
            return;
        }

        setEditingResult(result);
        setForm({
            examination_id: String(result.examination_id ?? ""),
            examination_name: result.examination_name ?? "",
            academic_year: String(
                result.academic_year ?? academicYear
            ),
            class_code: String(result.class_code ?? ""),
            section_id: String(result.section_id ?? ""),
            subject_id: String(result.subject_id ?? ""),
            student_id: String(result.student_id ?? ""),
            marks_obtained: String(result.marks_obtained ?? ""),
            total_marks: String(result.total_marks ?? 100),
            remarks: result.remarks ?? "",
        });
        setFormError("");
        setShowForm(true);
    };

    const changeForm = (field, value) => {
        setForm((previous) => {
            const next = { ...previous, [field]: value };

            if (field === "examination_id") {
                const selected = examinations.find(
                    (item) => getId(item) === value
                );

                next.examination_name = getLabel(selected, [
                    "name",
                    "examination_name",
                    "title",
                ]);
            }

            return next;
        });
    };

    const calculated = calculateGrade(
        form.marks_obtained,
        form.total_marks
    );

    const submitForm = (event) => {
        event.preventDefault();
        setFormError("");

        const obtained = Number(form.marks_obtained);
        const total = Number(form.total_marks);

        if (
            !form.examination_id ||
            !form.academic_year ||
            !form.class_code ||
            !form.section_id ||
            !form.subject_id ||
            !form.student_id
        ) {
            setFormError(
                "Select the examination, academic year, class, section, subject, and student."
            );
            return;
        }

        if (
            form.marks_obtained === "" ||
            form.total_marks === "" ||
            !Number.isFinite(obtained) ||
            !Number.isFinite(total) ||
            total <= 0 ||
            obtained < 0 ||
            obtained > total
        ) {
            setFormError(
                "Enter valid marks. Obtained marks must be between zero and total marks."
            );
            return;
        }

        const payload = {
            examination_id: form.examination_id,
            examination_name: form.examination_name,
            academic_year: form.academic_year,
            class_code: form.class_code,
            section_id: form.section_id,
            subject_id: form.subject_id,
            student_id: form.student_id,
            marks_obtained: obtained,
            total_marks: total,
            percentage: Number(calculated.percentage.toFixed(2)),
            grade: calculated.grade,
            gpa: calculated.gpa,
            pass: calculated.pass,
            remarks: form.remarks.trim(),
        };

        if (editingResult) {
            updateMutation.mutate({
                resultId: getId(editingResult),
                ...payload,
            });
        } else {
            createMutation.mutate(payload);
        }
    };

    const handlePublish = (result) => {
        const resultId = getId(result);

        if (!resultId) return;

        if (
            window.confirm(
                `Publish the result for ${result.student_name ?? "this student"}? Published results may become visible to students and parents.`
            )
        ) {
            publishMutation.mutate(resultId);
        }
    };

    const handleDelete = (result) => {
        if (result.status === "published") {
            window.alert("Published results cannot be deleted from this page.");
            return;
        }

        if (
            window.confirm(
                "Delete this draft result? This action cannot be undone."
            )
        ) {
            deleteMutation.mutate(getId(result));
        }
    };

    const resultError =
        resultsQuery.error?.response?.data?.message ||
        resultsQuery.error?.message;

    const summaryError =
        summaryQuery.error?.response?.data?.message;

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold md:text-3xl">
                            Result Management
                        </h1>
                        <p className="mt-1 text-sm text-base-content/60">
                            Manage marks, calculate grades, and publish
                            examination results for your school.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={openCreateForm}
                    >
                        <span className="text-lg">+</span>
                        Enter Result
                    </button>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        {
                            label: "Total Results",
                            value: summary.total_results ?? "—",
                        },
                        {
                            label: "Published",
                            value: summary.published_results ?? "—",
                        },
                        {
                            label: "Average Percentage",
                            value:
                                summary.average_percentage != null
                                    ? `${Number(summary.average_percentage).toFixed(2)}%`
                                    : "—",
                        },
                        {
                            label: "Pass Rate",
                            value:
                                summary.pass_rate != null
                                    ? `${Number(summary.pass_rate).toFixed(2)}%`
                                    : "—",
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="stat rounded-2xl bg-base-100 shadow-sm"
                        >
                            <div className="stat-title">{item.label}</div>
                            <div className="stat-value text-2xl">
                                {summaryQuery.isLoading ? (
                                    <span className="loading loading-dots loading-md" />
                                ) : (
                                    item.value
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {summaryError && (
                    <div className="alert alert-warning">
                        <span>
                            Result statistics could not be loaded.
                        </span>
                    </div>
                )}

                {/* Filters */}
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title text-lg">
                            Filter Results
                        </h2>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                            <input
                                type="search"
                                className="input input-bordered w-full"
                                placeholder="Search student, roll, or subject..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />

                            <select
                                className="select select-bordered w-full"
                                value={academicYear}
                                onChange={(event) =>
                                    setAcademicYear(event.target.value)
                                }
                            >
                                <option value="">All academic years</option>
                                {academicYears.map((year) => {
                                    const value =
                                        typeof year === "object"
                                            ? String(
                                                  year.year ??
                                                      year.academic_year ??
                                                      ""
                                              )
                                            : String(year);

                                    return (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    );
                                })}
                                {!academicYears.some(
                                    (year) =>
                                        String(
                                            typeof year === "object"
                                                ? year.year ??
                                                      year.academic_year
                                                : year
                                        ) === academicYear
                                ) &&
                                    academicYear && (
                                        <option value={academicYear}>
                                            {academicYear}
                                        </option>
                                    )}
                            </select>

                            <select
                                className="select select-bordered w-full"
                                value={examinationId}
                                onChange={(event) =>
                                    setExaminationId(event.target.value)
                                }
                            >
                                <option value="">All examinations</option>
                                {examinations.map((exam) => (
                                    <option
                                        key={getId(exam)}
                                        value={getId(exam)}
                                    >
                                        {getLabel(exam, [
                                            "name",
                                            "examination_name",
                                            "title",
                                        ])}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="select select-bordered w-full"
                                value={classCode}
                                onChange={(event) => {
                                    setClassCode(event.target.value);
                                    setSectionId("");
                                }}
                            >
                                <option value="">All classes</option>
                                {classes.map((item) => (
                                    <option
                                        key={item.class_code}
                                        value={item.class_code}
                                    >
                                        {getLabel(item, [
                                            "class_name",
                                            "name",
                                            "title",
                                        ])}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="select select-bordered w-full"
                                value={sectionId}
                                onChange={(event) =>
                                    setSectionId(event.target.value)
                                }
                            >
                                <option value="">All sections</option>
                                {sections
                                    .filter(
                                        (item) =>
                                            !classCode ||
                                            !item.class_code ||
                                            String(item.class_code) === classCode
                                    )
                                    .map((item) => (
                                        <option
                                            key={getId(item)}
                                            value={getId(item)}
                                        >
                                            {getLabel(item, [
                                                "section_name",
                                                "name",
                                                "title",
                                            ])}
                                        </option>
                                    ))}
                            </select>

                            <select
                                className="select select-bordered w-full"
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value)
                                }
                            >
                                <option value="all">All statuses</option>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results table */}
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body p-0">
                        <div className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center">
                            <h2 className="card-title">
                                Examination Results
                            </h2>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline"
                                onClick={() => {
                                    resultsQuery.refetch();
                                    summaryQuery.refetch();
                                }}
                                disabled={resultsQuery.isFetching}
                            >
                                {resultsQuery.isFetching ? (
                                    <span className="loading loading-spinner loading-xs" />
                                ) : (
                                    "Refresh"
                                )}
                            </button>
                        </div>

                        {resultsQuery.isLoading ? (
                            <div className="flex justify-center p-12">
                                <span className="loading loading-spinner loading-lg text-primary" />
                            </div>
                        ) : resultsQuery.isError ? (
                            <div className="p-5">
                                <div className="alert alert-error">
                                    <span>
                                        {resultError ||
                                            "Failed to load examination results."}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm mt-3"
                                    onClick={() => resultsQuery.refetch()}
                                >
                                    Try again
                                </button>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="mb-3 text-4xl">📋</div>
                                <h3 className="font-semibold">
                                    No results found
                                </h3>
                                <p className="mt-1 text-sm text-base-content/60">
                                    Try changing your filters or enter a new
                                    result.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Exam</th>
                                            <th>Class / Section</th>
                                            <th>Subject</th>
                                            <th>Marks</th>
                                            <th>Grade</th>
                                            <th>GPA</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((result) => {
                                            const grade =
                                                calculateGrade(
                                                    result.marks_obtained,
                                                    result.total_marks
                                                );

                                            const displayGrade =
                                                result.grade ?? grade.grade;
                                            const displayGpa =
                                                result.gpa ?? grade.gpa;

                                            return (
                                                <tr key={getId(result)}>
                                                    <td>
                                                        <div className="font-semibold">
                                                            {result.student_name ||
                                                                "Unnamed student"}
                                                        </div>
                                                        <div className="text-xs text-base-content/60">
                                                            Roll:{" "}
                                                            {result.student_roll ??
                                                                result.roll_number ??
                                                                "—"}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {result.examination_name ||
                                                            "—"}
                                                        <div className="text-xs text-base-content/60">
                                                            {result.academic_year ||
                                                                "—"}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {result.class_name ||
                                                            "—"}
                                                        {" / "}
                                                        {result.section_name ||
                                                            "—"}
                                                    </td>
                                                    <td>
                                                        {result.subject_name ||
                                                            "—"}
                                                    </td>
                                                    <td>
                                                        {result.marks_obtained ??
                                                            "—"}
                                                        {" / "}
                                                        {result.total_marks ??
                                                            "—"}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`badge ${
                                                                displayGrade ===
                                                                "F"
                                                                    ? "badge-error"
                                                                    : "badge-success"
                                                            }`}
                                                        >
                                                            {displayGrade}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {displayGpa != null
                                                            ? Number(
                                                                  displayGpa
                                                              ).toFixed(2)
                                                            : "—"}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`badge ${
                                                                result.status ===
                                                                "published"
                                                                    ? "badge-success"
                                                                    : "badge-warning"
                                                            }`}
                                                        >
                                                            {result.status ||
                                                                "draft"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="flex flex-wrap gap-2">
                                                            {result.status !==
                                                                "published" && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-xs btn-outline"
                                                                        onClick={() =>
                                                                            openEditForm(
                                                                                result
                                                                            )
                                                                        }
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-xs btn-primary"
                                                                        disabled={
                                                                            publishMutation.isPending
                                                                        }
                                                                        onClick={() =>
                                                                            handlePublish(
                                                                                result
                                                                            )
                                                                        }
                                                                    >
                                                                        Publish
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-xs btn-error btn-outline"
                                                                        disabled={
                                                                            deleteMutation.isPending
                                                                        }
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                result
                                                                            )
                                                                        }
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {resultsQuery.isSuccess && (
                            <div className="border-t border-base-200 p-4 text-sm text-base-content/60">
                                Showing {results.length} result
                                {results.length === 1 ? "" : "s"}.
                            </div>
                        )}
                    </div>
                </div>

                {/* Create / Edit form */}
                {showForm && (
                    <div className="modal modal-open">
                        <div className="modal-box max-w-3xl">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-xl font-bold">
                                        {editingResult
                                            ? "Edit Result"
                                            : "Enter Student Result"}
                                    </h3>
                                    <p className="mt-1 text-sm text-base-content/60">
                                        Enter marks for one student and one
                                        subject. Grade and GPA are calculated
                                        automatically.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-circle btn-ghost"
                                    aria-label="Close form"
                                    onClick={() => setShowForm(false)}
                                >
                                    ✕
                                </button>
                            </div>

                            <form
                                className="mt-5 space-y-4"
                                onSubmit={submitForm}
                            >
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <label className="form-control">
                                        <span className="label-text mb-2">
                                            Examination *
                                        </span>
                                        <select
                                            className="select select-bordered"
                                            value={form.examination_id}
                                            onChange={(event) =>
                                                changeForm(
                                                    "examination_id",
                                                    event.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select examination
                                            </option>
                                            {examinations.map((exam) => (
                                                <option
                                                    key={getId(exam)}
                                                    value={getId(exam)}
                                                >
                                                    {getLabel(exam, [
                                                        "name",
                                                        "examination_name",
                                                        "title",
                                                    ])}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text mb-2">
                                            Academic year *
                                        </span>
                                        <input
                                            className="input input-bordered"
                                            value={form.academic_year}
                                            onChange={(event) =>
                                                changeForm(
                                                    "academic_year",
                                                    event.target.value
                                                )
                                            }
                                            required
                                        />
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text mb-2">
                                            Class *
                                        </span>
                                        <select
                                            className="select select-bordered"
                                            value={form.class_code}
                                            onChange={(event) => {
                                                changeForm(
                                                    "class_code",
                                                    event.target.value
                                                );
                                                changeForm("section_id", "");
                                                changeForm("student_id", "");
                                            }}
                                            required
                                        >
                                            <option value="">Select class</option>
                                            {classes.map((item) => (
                                                <option
                                                    key={item.class_code}
                                                    value={item.class_code}
                                                >
                                                    {getLabel(item, [
                                                        "class_name",
                                                        "name",
                                                        "title",
                                                    ])}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text mb-2">
                                            Section *
                                        </span>
                                        <select
                                            className="select select-bordered"
                                            value={form.section_id}
                                            onChange={(event) => {
                                                changeForm(
                                                    "section_id",
                                                    event.target.value
                                                );
                                                changeForm("student_id", "");
                                            }}
                                            required
                                        >
                                            <option value="">
                                                Select section
                                            </option>
                                            {sections
                                                .filter(
                                                    (item) =>
                                                        !form.class_code ||
                                                        !item.class_code ||
                                                        String(item.class_code) ===
                                                            form.class_code
                                                )
                                                .map((item) => (
                                                    <option
                                                        key={getId(item)}
                                                        value={getId(item)}
                                                    >
                                                        {getLabel(item, [
                                                            "section_name",
                                                            "name",
                                                            "title",
                                                        ])}
                                                    </option>
                                                ))}
                                        </select>
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text mb-2">
                                            Subject *
                                        </span>
                                        <select
                                            className="select select-bordered"
                                            value={form.subject_id}
                                            onChange={(event) =>
                                                changeForm(
                                                    "subject_id",
                                                    event.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select subject
                                            </option>
                                            {subjects.filter(
                                                    (item) =>
                                                        !form.class_code ||
                                                        !item.class_code ||
                                                        String(item.class_code) ===
                                                            form.class_code
                                                ).map((item) => (
                                                <option
                                                    key={getId(item)}
                                                    value={getId(item)}
                                                >
                                                    {getLabel(item, [
                                                        "subject_name",
                                                        "name",
                                                        "title",
                                                    ])}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text mb-2">
                                            Student *
                                        </span>
                                        <select
                                            className="select select-bordered"
                                            value={form.student_id}
                                            onChange={(event) =>
                                                changeForm(
                                                    "student_id",
                                                    event.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select student
                                            </option>
                                            {students
                                                .filter(
                                                    (student) =>
                                                        (!form.class_code ||
                                                            String(
                                                                student.class_code ??
                                                                    ""
                                                            ) === form.class_code) &&
                                                        (!form.section_id ||
                                                            String(
                                                                student.section_id ??
                                                                    ""
                                                            ) === form.section_id)
                                                )
                                                .map((student) => (
                                                    <option
                                                        key={getId(student)}
                                                        value={getId(student)}
                                                    >
                                                        {getLabel(student, [
                                                            "first_name",
                                                            "last_name",
                                                            "name",
                                                        ])}
                                                        {student.student_roll ??
                                                        student.roll_number
                                                            ? ` — Roll ${
                                                                  student.student_roll ??
                                                                  student.roll_number
                                                              }`
                                                            : ""}
                                                    </option>
                                                ))}
                                        </select>
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text mb-2">
                                            Marks obtained *
                                        </span>
                                        <input
                                            type="number"
                                            className="input input-bordered"
                                            min="0"
                                            max={form.total_marks || undefined}
                                            step="0.01"
                                            value={form.marks_obtained}
                                            onChange={(event) =>
                                                changeForm(
                                                    "marks_obtained",
                                                    event.target.value
                                                )
                                            }
                                            required
                                        />
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text mb-2">
                                            Total marks *
                                        </span>
                                        <input
                                            type="number"
                                            className="input input-bordered"
                                            min="0.01"
                                            step="0.01"
                                            value={form.total_marks}
                                            onChange={(event) =>
                                                changeForm(
                                                    "total_marks",
                                                    event.target.value
                                                )
                                            }
                                            required
                                        />
                                    </label>
                                </div>

                                {/* Grade preview */}
                                <div className="rounded-xl bg-base-200 p-4">
                                    <h4 className="font-semibold">
                                        Calculated Result Preview
                                    </h4>
                                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <div>
                                            <p className="text-xs text-base-content/60">
                                                Percentage
                                            </p>
                                            <p className="text-lg font-bold">
                                                {calculated.percentage == null
                                                    ? "—"
                                                    : `${calculated.percentage.toFixed(2)}%`}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-base-content/60">
                                                Grade
                                            </p>
                                            <p className="text-lg font-bold">
                                                {calculated.grade}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-base-content/60">
                                                GPA
                                            </p>
                                            <p className="text-lg font-bold">
                                                {calculated.gpa == null
                                                    ? "—"
                                                    : calculated.gpa.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-base-content/60">
                                                Outcome
                                            </p>
                                            <p
                                                className={`text-lg font-bold ${
                                                    calculated.pass
                                                        ? "text-success"
                                                        : calculated.grade ===
                                                            "F"
                                                          ? "text-error"
                                                          : ""
                                                }`}
                                            >
                                                {calculated.percentage == null
                                                    ? "—"
                                                    : calculated.pass
                                                      ? "Pass"
                                                      : "Fail"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <label className="form-control">
                                    <span className="label-text mb-2">
                                        Remarks (optional)
                                    </span>
                                    <textarea
                                        className="textarea textarea-bordered"
                                        rows={2}
                                        placeholder="Add remarks..."
                                        value={form.remarks}
                                        onChange={(event) =>
                                            changeForm(
                                                "remarks",
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>

                                {formError && (
                                    <div className="alert alert-error">
                                        <span>{formError}</span>
                                    </div>
                                )}

                                {optionsQuery.isError && (
                                    <div className="alert alert-warning">
                                        <span>
                                            Some form options could not be
                                            loaded. Refresh the page and try
                                            again.
                                        </span>
                                    </div>
                                )}

                                <div className="modal-action">
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        onClick={() => setShowForm(false)}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSaving}
                                    >
                                        {isSaving && (
                                            <span className="loading loading-spinner loading-sm" />
                                        )}
                                        {editingResult
                                            ? "Update Draft"
                                            : "Save Draft"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <button
                            type="button"
                            className="modal-backdrop"
                            aria-label="Close result form"
                            onClick={() => setShowForm(false)}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Result;
