import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    BookOpen,
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    RefreshCw,
    GraduationCap,
    BookMarked,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";

import {
    getSchoolAdminSubjects,
    getSchoolAdminSubjectOptions,
    createSchoolAdminSubject,
    updateSchoolAdminSubject,
    deleteSchoolAdminSubject,
} from "../../services/schoolAdminSubjectService";

const initialFormData = {
    subject_name: "",
    subject_code: "",
    class_id: "",
    subject_type: "compulsory",
    total_marks: 100,
    pass_marks: 33,
    description: "",
    status: "active",
};

const getSubjectName = (subject) =>
    subject?.subject_name || subject?.name || "Unnamed subject";

const getClassName = (subject, classes = []) => {
    const selectedClass = classes.find(
        (item) => String(item._id) === String(subject?.class_id)
    );

    return (
        selectedClass?.class_name ||
        selectedClass?.name ||
        subject?.class_name ||
        "Class not found"
    );
};

const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again.";

const normalizeSubject = (subject) => ({
    subject_name: subject?.subject_name || subject?.name || "",
    subject_code: subject?.subject_code || "",
    class_id: subject?.class_id ? String(subject.class_id) : "",
    subject_type: subject?.subject_type || "compulsory",
    total_marks: Number(subject?.total_marks ?? subject?.marks?.total ?? 100),
    pass_marks: Number(subject?.pass_marks ?? subject?.marks?.pass_marks ?? 33),
    description: subject?.description || "",
    status: subject?.status || "active",
});

function AcademicSubjects() {
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [classFilter, setClassFilter] = useState("all");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [formError, setFormError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Fetch academic subjects.
    const {
        data: subjectsResponse,
        isLoading: subjectsLoading,
        isError: subjectsError,
        error: subjectsErrorMessage,
        refetch: refetchSubjects,
        isFetching,
    } = useQuery({
        queryKey: [
            "school-admin-academic-subjects",
            searchTerm,
            statusFilter,
            classFilter,
        ],
        queryFn: () =>
            getSchoolAdminSubjects({
                search: searchTerm.trim(),
                status: statusFilter,
                class_id: classFilter === "all" ? undefined : classFilter,
            }),
    });

    // Fetch class options.
    const {
        data: optionsResponse,
        isLoading: optionsLoading,
    } = useQuery({
        queryKey: ["school-admin-academic-subject-options"],
        queryFn: getSchoolAdminSubjectOptions,
    });

    const subjects = Array.isArray(subjectsResponse?.subjects)
        ? subjectsResponse.subjects
        : [];

    const classes = Array.isArray(optionsResponse?.classes)
        ? optionsResponse.classes
        : [];

    const totalSubjects =
        Number(subjectsResponse?.total) || subjects.length;

    const activeSubjects = subjects.filter(
        (subject) => subject.status === "active"
    ).length;

    const inactiveSubjects = subjects.filter(
        (subject) => subject.status === "inactive"
    ).length;

    const classCount = useMemo(() => {
        const ids = new Set(
            subjects
                .map((subject) => subject.class_id)
                .filter(Boolean)
                .map(String)
        );

        return ids.size;
    }, [subjects]);

    // Create subject mutation.
    const createMutation = useMutation({
        mutationFn: createSchoolAdminSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["school-admin-academic-subjects"],
            });

            closeModal();
        },
        onError: (error) => {
            setFormError(getErrorMessage(error));
        },
    });

    // Update subject mutation.
    const updateMutation = useMutation({
        mutationFn: updateSchoolAdminSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["school-admin-academic-subjects"],
            });

            closeModal();
        },
        onError: (error) => {
            setFormError(getErrorMessage(error));
        },
    });

    // Delete subject mutation.
    const deleteMutation = useMutation({
        mutationFn: deleteSchoolAdminSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["school-admin-academic-subjects"],
            });

            setDeleteTarget(null);
        },
    });

    function openCreateModal() {
        setEditingSubject(null);
        setFormData(initialFormData);
        setFormError("");
        setIsModalOpen(true);
    }

    function openEditModal(subject) {
        setEditingSubject(subject);
        setFormData(normalizeSubject(subject));
        setFormError("");
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setEditingSubject(null);
        setFormData(initialFormData);
        setFormError("");
    }

    function handleInputChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function validateForm() {
        if (!formData.subject_name.trim()) {
            return "Please enter the subject name.";
        }

        if (!formData.class_id) {
            return "Please select a class.";
        }

        if (
            !Number.isFinite(Number(formData.total_marks)) ||
            Number(formData.total_marks) <= 0
        ) {
            return "Total marks must be greater than zero.";
        }

        if (
            !Number.isFinite(Number(formData.pass_marks)) ||
            Number(formData.pass_marks) < 0
        ) {
            return "Pass marks cannot be negative.";
        }

        if (Number(formData.pass_marks) > Number(formData.total_marks)) {
            return "Pass marks cannot exceed total marks.";
        }

        return "";
    }

    function handleSubmit(event) {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setFormError(validationError);
            return;
        }

        setFormError("");

        const payload = {
            subject_name: formData.subject_name.trim(),
            name: formData.subject_name.trim(),
            subject_code: formData.subject_code.trim(),
            class_id: formData.class_id,
            subject_type: formData.subject_type,
            total_marks: Number(formData.total_marks),
            pass_marks: Number(formData.pass_marks),
            description: formData.description.trim(),
            status: formData.status,
        };

        if (editingSubject) {
            updateMutation.mutate({
                subjectId: editingSubject._id,
                ...payload,
            });
        } else {
            createMutation.mutate(payload);
        }
    }

    function handleDelete() {
        if (!deleteTarget?._id) return;

        deleteMutation.mutate(deleteTarget._id);
    }

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Page heading */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                <BookOpen size={26} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-base-content md:text-3xl">
                                    Academic Subjects
                                </h1>

                                <p className="mt-1 text-sm text-base-content/60">
                                    Manage subjects and assign them to classes.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="btn btn-primary gap-2"
                    >
                        <Plus size={18} />
                        Add Subject
                    </button>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Total Subjects"
                        value={totalSubjects}
                        icon={<BookOpen size={22} />}
                        description="Subjects matching current filters"
                    />

                    <SummaryCard
                        title="Active Subjects"
                        value={activeSubjects}
                        icon={<CheckCircle size={22} />}
                        description="Currently active in this result"
                    />

                    <SummaryCard
                        title="Inactive Subjects"
                        value={inactiveSubjects}
                        icon={<XCircle size={22} />}
                        description="Currently inactive in this result"
                    />

                    <SummaryCard
                        title="Classes Covered"
                        value={classCount}
                        icon={<GraduationCap size={22} />}
                        description="Classes represented in this result"
                    />
                </div>

                {/* Filters */}
                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body gap-4 p-4 md:p-5">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                            <label className="input input-bordered flex items-center gap-2">
                                <Search size={18} className="text-base-content/50" />

                                <input
                                    type="text"
                                    className="grow"
                                    placeholder="Search subject name or code..."
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                />

                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchTerm("")}
                                        className="text-base-content/50 hover:text-base-content"
                                        aria-label="Clear search"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </label>

                            <select
                                className="select select-bordered w-full"
                                value={classFilter}
                                onChange={(event) =>
                                    setClassFilter(event.target.value)
                                }
                            >
                                <option value="all">All Classes</option>

                                {classes.map((classItem) => (
                                    <option
                                        key={classItem._id}
                                        value={classItem._id}
                                    >
                                        {classItem.class_name ||
                                            classItem.name ||
                                            "Unnamed class"}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="select select-bordered w-full"
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm text-base-content/60">
                                Showing{" "}
                                <span className="font-semibold text-base-content">
                                    {subjects.length}
                                </span>{" "}
                                subject(s)
                            </p>

                            <button
                                type="button"
                                onClick={() => refetchSubjects()}
                                disabled={isFetching}
                                className="btn btn-ghost btn-sm gap-2"
                            >
                                <RefreshCw
                                    size={15}
                                    className={isFetching ? "animate-spin" : ""}
                                />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Subject list */}
                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-0">
                        <div className="border-b border-base-300 px-5 py-4">
                            <h2 className="text-lg font-semibold">
                                Subject List
                            </h2>

                            <p className="mt-1 text-sm text-base-content/60">
                                View, update, or remove academic subjects.
                            </p>
                        </div>

                        {subjectsLoading || optionsLoading ? (
                            <div className="flex min-h-64 items-center justify-center">
                                <span className="loading loading-spinner loading-lg text-primary" />
                            </div>
                        ) : subjectsError ? (
                            <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
                                <AlertCircle
                                    size={36}
                                    className="text-error"
                                />

                                <p className="font-semibold">
                                    Failed to load academic subjects.
                                </p>

                                <p className="text-sm text-base-content/60">
                                    {getErrorMessage(subjectsErrorMessage)}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => refetchSubjects()}
                                    className="btn btn-outline btn-sm"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : subjects.length === 0 ? (
                            <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
                                <div className="rounded-full bg-base-200 p-4">
                                    <BookMarked
                                        size={32}
                                        className="text-base-content/50"
                                    />
                                </div>

                                <h3 className="font-semibold">
                                    No subjects found
                                </h3>

                                <p className="max-w-sm text-sm text-base-content/60">
                                    No academic subjects match your filters.
                                    Add a new subject to get started.
                                </p>

                                <button
                                    type="button"
                                    onClick={openCreateModal}
                                    className="btn btn-primary btn-sm"
                                >
                                    <Plus size={16} />
                                    Add Subject
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Subject Code</th>
                                            <th>Class</th>
                                            <th>Type</th>
                                            <th>Total Marks</th>
                                            <th>Pass Marks</th>
                                            <th>Status</th>
                                            <th className="text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {subjects.map((subject) => (
                                            <tr key={subject._id}>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                                            <BookOpen size={18} />
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold">
                                                                {getSubjectName(subject)}
                                                            </p>

                                                            {subject.description && (
                                                                <p className="max-w-48 truncate text-xs text-base-content/50">
                                                                    {subject.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    {subject.subject_code || (
                                                        <span className="text-base-content/40">
                                                            —
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    {getClassName(subject, classes)}
                                                </td>

                                                <td>
                                                    <span className="badge badge-outline capitalize">
                                                        {(subject.subject_type || "compulsory").replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    {subject.total_marks ??
                                                        subject.marks?.total ??
                                                        "—"}
                                                </td>

                                                <td>
                                                    {subject.pass_marks ??
                                                        subject.marks?.pass_marks ??
                                                        "—"}
                                                </td>

                                                <td>
                                                    <StatusBadge
                                                        status={subject.status}
                                                    />
                                                </td>

                                                <td>
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditModal(subject)
                                                            }
                                                            className="btn btn-square btn-ghost btn-sm text-info"
                                                            title="Edit subject"
                                                        >
                                                            <Pencil size={17} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setDeleteTarget(subject)
                                                            }
                                                            className="btn btn-square btn-ghost btn-sm text-error"
                                                            title="Delete subject"
                                                        >
                                                            <Trash2 size={17} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create / Edit modal */}
            {isModalOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-h-[90vh] max-w-2xl overflow-y-auto">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold">
                                    {editingSubject
                                        ? "Update Academic Subject"
                                        : "Add Academic Subject"}
                                </h3>

                                <p className="mt-1 text-sm text-base-content/60">
                                    Enter the subject information below.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="btn btn-circle btn-ghost btn-sm"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {formError && (
                            <div className="alert alert-error mb-4 text-sm">
                                <AlertCircle size={18} />
                                <span>{formError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Subject name */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Subject Name *
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        name="subject_name"
                                        value={formData.subject_name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Physics"
                                        className="input input-bordered w-full"
                                        maxLength={100}
                                        required
                                    />
                                </div>

                                {/* Subject code */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Subject Code
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        name="subject_code"
                                        value={formData.subject_code}
                                        onChange={handleInputChange}
                                        placeholder="e.g. PHY-101"
                                        className="input input-bordered w-full"
                                        maxLength={30}
                                    />
                                </div>

                                {/* Class selection */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Assign to Class *
                                        </span>
                                    </label>

                                    <select
                                        name="class_id"
                                        value={formData.class_id}
                                        onChange={handleInputChange}
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="">
                                            Select a class
                                        </option>

                                        {classes.map((classItem) => (
                                            <option
                                                key={classItem._id}
                                                value={classItem._id}
                                            >
                                                {classItem.class_name ||
                                                    classItem.name ||
                                                    "Unnamed class"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subject type */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Subject Type
                                        </span>
                                    </label>

                                    <select
                                        name="subject_type"
                                        value={formData.subject_type}
                                        onChange={handleInputChange}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="compulsory">
                                            Compulsory
                                        </option>
                                        <option value="optional">
                                            Optional
                                        </option>
                                        <option value="elective">
                                            Elective
                                        </option>
                                    </select>
                                </div>

                                {/* Total marks */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Total Marks *
                                        </span>
                                    </label>

                                    <input
                                        type="number"
                                        name="total_marks"
                                        value={formData.total_marks}
                                        onChange={handleInputChange}
                                        min="1"
                                        step="1"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Pass marks */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Pass Marks *
                                        </span>
                                    </label>

                                    <input
                                        type="number"
                                        name="pass_marks"
                                        value={formData.pass_marks}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="1"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Status */}
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Status
                                        </span>
                                    </label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>

                                {/* Description */}
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Description
                                        </span>
                                    </label>

                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Optional subject description..."
                                        className="textarea textarea-bordered min-h-24 w-full"
                                        maxLength={500}
                                    />
                                </div>
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn btn-ghost"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary min-w-32"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            {editingSubject
                                                ? "Update Subject"
                                                : "Create Subject"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <form
                        method="dialog"
                        className="modal-backdrop"
                        onSubmit={(event) => {
                            event.preventDefault();
                            closeModal();
                        }}
                    >
                        <button type="submit">close</button>
                    </form>
                </dialog>
            )}

            {/* Delete confirmation modal */}
            {deleteTarget && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-w-md">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-full bg-error/10 p-3 text-error">
                                <Trash2 size={24} />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold">
                                    Delete Subject
                                </h3>

                                <p className="text-sm text-base-content/60">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <p className="py-3 text-sm">
                            Are you sure you want to delete{" "}
                            <strong>{getSubjectName(deleteTarget)}</strong>?
                        </p>

                        {deleteMutation.isError && (
                            <div className="alert alert-error mt-3 text-sm">
                                <AlertCircle size={18} />
                                <span>
                                    {getErrorMessage(deleteMutation.error)}
                                </span>
                            </div>
                        )}

                        <div className="modal-action">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                className="btn btn-ghost"
                                disabled={deleteMutation.isPending}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                className="btn btn-error"
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete Subject"
                                )}
                            </button>
                        </div>
                    </div>

                    <form
                        method="dialog"
                        className="modal-backdrop"
                        onSubmit={(event) => {
                            event.preventDefault();
                            setDeleteTarget(null);
                        }}
                    >
                        <button type="submit">close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
}

function SummaryCard({ title, value, icon, description }) {
    return (
        <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-5">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-base-content/60">
                        {title}
                    </p>

                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        {icon}
                    </div>
                </div>

                <p className="text-3xl font-bold tabular-nums">
                    {value}
                </p>

                <p className="text-xs text-base-content/50">
                    {description}
                </p>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    if (status === "active") {
        return (
            <span className="badge badge-success badge-outline gap-1">
                <CheckCircle size={12} />
                Active
            </span>
        );
    }

    return (
        <span className="badge badge-ghost gap-1">
            <XCircle size={12} />
            Inactive
        </span>
    );
}

export default AcademicSubjects;