
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Search,
    Filter,
    ClipboardList,
    CheckCircle2,
    Clock,
    RotateCcw,
    BookOpen,
    CalendarDays,
    Eye,
    ChevronLeft,
    ChevronRight,
    X,
    GraduationCap,
    TrendingUp,
    AlertCircle,
    FileText,
    UserRound,
} from "lucide-react";

import {
    getResultsHistory,
    getResultHistoryDetails,
} from "../../../services/teacherResultService";

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
    submitted: {
        label: "Pending Review",
        className: "badge-warning",
        icon: Clock,
    },
    pending: {
        label: "Pending Review",
        className: "badge-warning",
        icon: Clock,
    },
    approved: {
        label: "Approved",
        className: "badge-success",
        icon: CheckCircle2,
    },
    published: {
        label: "Published",
        className: "badge-info",
        icon: CheckCircle2,
    },
    returned: {
        label: "Returned",
        className: "badge-error",
        icon: RotateCcw,
    },
    rejected: {
        label: "Rejected",
        className: "badge-error",
        icon: AlertCircle,
    },
};

const getStatusConfig = (status) => {
    return (
        STATUS_CONFIG[String(status || "").toLowerCase()] || {
            label: status || "Unknown",
            className: "badge-ghost",
            icon: FileText,
        }
    );
};

const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatDateTime = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getSubmissionId = (item) => {
    return String(
        item?._id ||
        item?.submission_id ||
        item?.id ||
        ""
    );
};

const getExamName = (item) => {
    return (
        item?.exam_name ||
        item?.examination_name ||
        item?.examination?.name ||
        "Unknown Examination"
    );
};

const getSubjectName = (item) => {
    return (
        item?.subject_name ||
        item?.subject?.subject_name ||
        item?.subject?.name ||
        "Unknown Subject"
    );
};

const getSectionName = (item) => {
    const section = item?.section;

    if (typeof section === "string") return section;

    if (section?.class_name && section?.name) {
        return `${section.class_name} - ${section.name}`;
    }

    return (
        item?.section_name ||
        item?.class_section ||
        item?.class_name ||
        "—"
    );
};

const getSubmittedDate = (item) => {
    return (
        item?.submitted_at ||
        item?.created_at ||
        item?.updated_at
    );
};

const getHistoryItems = (data) => {
    if (Array.isArray(data)) return data;

    return (
        data?.items ||
        data?.history ||
        data?.submissions ||
        []
    );
};

const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    iconClass,
    iconBg,
}) => (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body p-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm text-base-content/60">
                        {title}
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                        {value}
                    </h3>

                    <p className="text-xs text-base-content/50 mt-1">
                        {description}
                    </p>
                </div>

                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
                >
                    <Icon size={23} className={iconClass} />
                </div>
            </div>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
        <span
            className={`badge ${config.className} gap-1.5 py-3 px-3 font-medium whitespace-nowrap`}
        >
            <Icon size={13} />
            {config.label}
        </span>
    );
};

const EmptyState = ({ search, onClear }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4">
            <ClipboardList
                size={30}
                className="text-base-content/40"
            />
        </div>

        <h3 className="font-semibold text-lg">
            No result history found
        </h3>

        <p className="text-sm text-base-content/50 text-center mt-2 max-w-md">
            {search
                ? "No submissions match your search or selected filters."
                : "Your submitted examination results will appear here."}
        </p>

        {search && (
            <button
                onClick={onClear}
                className="btn btn-sm btn-outline mt-4"
            >
                Clear filters
            </button>
        )}
    </div>
);

const ResultDetailsModal = ({
    submissionId,
    onClose,
}) => {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["teacher-result-history-details", submissionId],
        queryFn: () => getResultHistoryDetails(submissionId),
        enabled: Boolean(submissionId),
        staleTime: 60 * 1000,
    });

    const item = data?.submission || data?.item || data;

    const timeline = [
        {
            title: "Result created",
            date: item?.created_at,
            description: "Examination result record created.",
        },
        {
            title: "Results submitted",
            date: item?.submitted_at,
            description: "Teacher submitted the examination results.",
        },
        {
            title: "Reviewed by School Admin",
            date: item?.reviewed_at,
            description:
                item?.admin_feedback ||
                item?.review_note ||
                "No review feedback available.",
        },
        {
            title: "Results published",
            date: item?.published_at,
            description: "Examination results published.",
        },
    ].filter((event) => event.date);

    return (
        <dialog open className="modal modal-bottom sm:modal-middle">
            <div className="modal-box max-w-3xl p-0">
                <div className="flex items-center justify-between p-5 border-b border-base-200">
                    <div>
                        <h3 className="font-bold text-lg">
                            Result Submission Details
                        </h3>
                        <p className="text-xs text-base-content/50 mt-1">
                            Review your previous submission
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost"
                        aria-label="Close details"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="p-5">
                    {isLoading && (
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg text-primary" />
                        </div>
                    )}

                    {isError && (
                        <div className="alert alert-error">
                            <AlertCircle size={20} />
                            <span>
                                {error?.response?.data?.message ||
                                    error?.message ||
                                    "Unable to load submission details."}
                            </span>
                        </div>
                    )}

                    {!isLoading && !isError && item && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-base-200/60 rounded-xl p-4">
                                    <p className="text-xs text-base-content/50">
                                        Examination
                                    </p>
                                    <p className="font-semibold mt-1">
                                        {getExamName(item)}
                                    </p>
                                </div>

                                <div className="bg-base-200/60 rounded-xl p-4">
                                    <p className="text-xs text-base-content/50">
                                        Subject
                                    </p>
                                    <p className="font-semibold mt-1">
                                        {getSubjectName(item)}
                                    </p>
                                </div>

                                <div className="bg-base-200/60 rounded-xl p-4">
                                    <p className="text-xs text-base-content/50">
                                        Class / Section
                                    </p>
                                    <p className="font-semibold mt-1">
                                        {getSectionName(item)}
                                    </p>
                                </div>

                                <div className="bg-base-200/60 rounded-xl p-4">
                                    <p className="text-xs text-base-content/50">
                                        Academic Year
                                    </p>
                                    <p className="font-semibold mt-1">
                                        {item?.academic_year || "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs text-base-content/50 mb-2">
                                        Submission Status
                                    </p>
                                    <StatusBadge status={item?.status} />
                                </div>

                                <div>
                                    <p className="text-xs text-base-content/50 mb-1">
                                        Submitted At
                                    </p>
                                    <p className="text-sm font-medium">
                                        {formatDateTime(
                                            item?.submitted_at
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="border border-base-200 rounded-xl p-3">
                                    <p className="text-xs text-base-content/50">
                                        Total Students
                                    </p>
                                    <p className="text-xl font-bold mt-1">
                                        {item?.total_students ?? "—"}
                                    </p>
                                </div>

                                <div className="border border-base-200 rounded-xl p-3">
                                    <p className="text-xs text-base-content/50">
                                        Average Marks
                                    </p>
                                    <p className="text-xl font-bold mt-1">
                                        {item?.average_marks ?? "—"}
                                    </p>
                                </div>

                                <div className="border border-base-200 rounded-xl p-3 col-span-2 sm:col-span-1">
                                    <p className="text-xs text-base-content/50">
                                        Pass Rate
                                    </p>
                                    <p className="text-xl font-bold mt-1">
                                        {item?.pass_rate != null
                                            ? `${item.pass_rate}%`
                                            : "—"}
                                    </p>
                                </div>
                            </div>

                            {item?.admin_feedback && (
                                <div className="alert alert-warning items-start">
                                    <AlertCircle
                                        size={20}
                                        className="mt-0.5"
                                    />
                                    <div>
                                        <p className="font-semibold text-sm">
                                            School Admin Feedback
                                        </p>
                                        <p className="text-sm mt-1">
                                            {item.admin_feedback}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {item?.review_note && !item?.admin_feedback && (
                                <div className="alert alert-info items-start">
                                    <FileText
                                        size={20}
                                        className="mt-0.5"
                                    />
                                    <div>
                                        <p className="font-semibold text-sm">
                                            Review Note
                                        </p>
                                        <p className="text-sm mt-1">
                                            {item.review_note}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="font-semibold mb-4">
                                    Submission Timeline
                                </h4>

                                {timeline.length ? (
                                    <ul className="timeline timeline-vertical timeline-compact">
                                        {timeline.map((event, index) => (
                                            <li key={`${event.title}-${index}`}>
                                                {index !== 0 && (
                                                    <hr className="bg-primary" />
                                                )}

                                                <div className="timeline-start text-xs text-base-content/50">
                                                    {formatDateTime(event.date)}
                                                </div>

                                                <div className="timeline-middle">
                                                    <CheckCircle2
                                                        size={18}
                                                        className="text-primary"
                                                    />
                                                </div>

                                                <div className="timeline-end timeline-box shadow-none border-base-200 w-full">
                                                    <p className="font-semibold text-sm">
                                                        {event.title}
                                                    </p>
                                                    <p className="text-xs text-base-content/60 mt-1">
                                                        {event.description}
                                                    </p>
                                                </div>

                                                {index !== timeline.length - 1 && (
                                                    <hr className="bg-primary" />
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-base-content/50">
                                        No timeline information available.
                                    </p>
                                )}
                            </div>

                            {Array.isArray(item?.marks) &&
                                item.marks.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-3">
                                            Student Marks
                                        </h4>

                                        <div className="overflow-x-auto border border-base-200 rounded-xl">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Student</th>
                                                        <th>Obtained</th>
                                                        <th>Total</th>
                                                        <th>Grade</th>
                                                        <th>Result</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {item.marks.map((mark, index) => (
                                                        <tr key={mark.student_id || index}>
                                                            <td>
                                                                {mark.student_name ||
                                                                    mark.student_id ||
                                                                    "—"}
                                                            </td>
                                                            <td>
                                                                {mark.obtained_marks ?? "—"}
                                                            </td>
                                                            <td>
                                                                {mark.total_marks ?? "—"}
                                                            </td>
                                                            <td>
                                                                {mark.grade || "—"}
                                                            </td>
                                                            <td>
                                                                <StatusBadge
                                                                    status={
                                                                        mark.result === "pass"
                                                                            ? "approved"
                                                                            : "returned"
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end p-5 border-t border-base-200">
                    <button
                        onClick={onClose}
                        className="btn btn-outline btn-sm"
                    >
                        Close
                    </button>
                </div>
            </div>

            <form
                method="dialog"
                className="modal-backdrop"
                onSubmit={(event) => {
                    event.preventDefault();
                    onClose();
                }}
            >
                <button type="submit">close</button>
            </form>
        </dialog>
    );
};

const ResultsHistory = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [yearFilter, setYearFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [selectedSubmissionId, setSelectedSubmissionId] =
        useState(null);

    const {
        data: historyData,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["teacher-results-history"],
        queryFn: () => getResultsHistory(),
        staleTime: 60 * 1000,
    });

    const items = useMemo(
        () => getHistoryItems(historyData),
        [historyData]
    );

    const summary = useMemo(() => {
        const count = (status) =>
            items.filter(
                (item) =>
                    String(item.status || "").toLowerCase() === status
            ).length;

        return {
            total: items.length,
            approved: count("approved"),
            published: count("published"),
            pending: items.filter((item) =>
                ["submitted", "pending"].includes(
                    String(item.status || "").toLowerCase()
                )
            ).length,
            returned: items.filter((item) =>
                ["returned", "rejected"].includes(
                    String(item.status || "").toLowerCase()
                )
            ).length,
        };
    }, [items]);

    const years = useMemo(() => {
        return [
            ...new Set(
                items
                    .map((item) => String(item.academic_year || ""))
                    .filter(Boolean)
            ),
        ].sort((a, b) => b.localeCompare(a));
    }, [items]);

    const filteredItems = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return items.filter((item) => {
            const status = String(
                item.status || ""
            ).toLowerCase();

            const matchesStatus =
                statusFilter === "all" ||
                status === statusFilter;

            const matchesYear =
                yearFilter === "all" ||
                String(item.academic_year || "") === yearFilter;

            const searchableText = [
                getExamName(item),
                getSubjectName(item),
                getSectionName(item),
                item.academic_year,
                item.exam_type,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !normalizedSearch ||
                searchableText.includes(normalizedSearch);

            return (
                matchesStatus &&
                matchesYear &&
                matchesSearch
            );
        });
    }, [items, search, statusFilter, yearFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredItems.length / PAGE_SIZE)
    );

    const currentPage = Math.min(page, totalPages);

    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setYearFilter("all");
        setPage(1);
    };

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setPage(1);
    };

    const handleYearFilter = (value) => {
        setYearFilter(value);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-base-200/40 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-base-content/50 mb-2">
                            <GraduationCap size={17} />
                            <span>Teacher Dashboard</span>
                            <span>/</span>
                            <span>Result Management</span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold">
                            Results History
                        </h1>

                        <p className="text-sm text-base-content/60 mt-2">
                            Track and review your previously submitted examination results.
                        </p>
                    </div>

                    <button
                        onClick={() => refetch()}
                        className="btn btn-outline btn-sm gap-2 self-start md:self-auto"
                        disabled={isLoading}
                    >
                        <RotateCcw
                            size={15}
                            className={isLoading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                    <StatCard
                        title="Total Submissions"
                        value={summary.total}
                        description="All result submissions"
                        icon={ClipboardList}
                        iconBg="bg-primary/10"
                        iconClass="text-primary"
                    />

                    <StatCard
                        title="Approved"
                        value={summary.approved}
                        description="Approved by admin"
                        icon={CheckCircle2}
                        iconBg="bg-success/10"
                        iconClass="text-success"
                    />

                    <StatCard
                        title="Published"
                        value={summary.published}
                        description="Officially published"
                        icon={TrendingUp}
                        iconBg="bg-info/10"
                        iconClass="text-info"
                    />

                    <StatCard
                        title="Pending Review"
                        value={summary.pending}
                        description="Awaiting admin review"
                        icon={Clock}
                        iconBg="bg-warning/10"
                        iconClass="text-warning"
                    />

                    <StatCard
                        title="Returned"
                        value={summary.returned}
                        description="Requires correction"
                        icon={RotateCcw}
                        iconBg="bg-error/10"
                        iconClass="text-error"
                    />
                </div>

                {/* History Table */}
                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-4 md:p-6">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Submission Records
                                </h2>
                                <p className="text-xs text-base-content/50 mt-1">
                                    View your examination result submission history.
                                </p>
                            </div>

                            <div className="text-sm text-base-content/60">
                                {filteredItems.length} record(s) found
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
                            <label className="input input-bordered flex items-center gap-2 w-full">
                                <Search
                                    size={17}
                                    className="text-base-content/40"
                                />

                                <input
                                    type="text"
                                    className="grow"
                                    placeholder="Search examination, subject..."
                                    value={search}
                                    onChange={(event) =>
                                        handleSearch(event.target.value)
                                    }
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => handleSearch("")}
                                        className="btn btn-ghost btn-xs btn-circle"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </label>

                            <label className="select select-bordered w-full">
                                <Filter size={16} />

                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        handleStatusFilter(event.target.value)
                                    }
                                >
                                    <option value="all">
                                        All Statuses
                                    </option>
                                    <option value="submitted">
                                        Pending Review
                                    </option>
                                    <option value="approved">
                                        Approved
                                    </option>
                                    <option value="published">
                                        Published
                                    </option>
                                    <option value="returned">
                                        Returned
                                    </option>
                                    <option value="rejected">
                                        Rejected
                                    </option>
                                </select>
                            </label>

                            <label className="select select-bordered w-full">
                                <CalendarDays size={16} />

                                <select
                                    value={yearFilter}
                                    onChange={(event) =>
                                        handleYearFilter(event.target.value)
                                    }
                                >
                                    <option value="all">
                                        All Academic Years
                                    </option>

                                    {years.map((year) => (
                                        <option
                                            key={year}
                                            value={year}
                                        >
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <button
                                onClick={clearFilters}
                                className="btn btn-outline gap-2"
                            >
                                <RotateCcw size={15} />
                                Reset Filters
                            </button>
                        </div>

                        {/* Loading */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <span className="loading loading-spinner loading-lg text-primary" />
                                <p className="text-sm text-base-content/50 mt-3">
                                    Loading result history...
                                </p>
                            </div>
                        )}

                        {/* Error */}
                        {isError && !isLoading && (
                            <div className="alert alert-error">
                                <AlertCircle size={20} />

                                <div className="flex-1">
                                    <p className="font-semibold">
                                        Failed to load results history
                                    </p>
                                    <p className="text-sm">
                                        {error?.response?.data?.message ||
                                            error?.message ||
                                            "Please try again."}
                                    </p>
                                </div>

                                <button
                                    onClick={() => refetch()}
                                    className="btn btn-sm"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading &&
                            !isError &&
                            filteredItems.length === 0 && (
                                <EmptyState
                                    search={
                                        search ||
                                        statusFilter !== "all" ||
                                        yearFilter !== "all"
                                    }
                                    onClear={clearFilters}
                                />
                            )}

                        {/* Table */}
                        {!isLoading &&
                            !isError &&
                            paginatedItems.length > 0 && (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="table table-zebra">
                                            <thead>
                                                <tr className="text-xs uppercase text-base-content/60">
                                                    <th>Examination</th>
                                                    <th>Subject</th>
                                                    <th>Class / Section</th>
                                                    <th>Academic Year</th>
                                                    <th>Submitted Date</th>
                                                    <th>Status</th>
                                                    <th className="text-center">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {paginatedItems.map(
                                                    (item, index) => (
                                                        <tr
                                                            key={
                                                                getSubmissionId(item) ||
                                                                index
                                                            }
                                                            className="hover"
                                                        >
                                                            <td>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                                        <BookOpen
                                                                            size={17}
                                                                            className="text-primary"
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <p className="font-semibold text-sm">
                                                                            {getExamName(item)}
                                                                        </p>

                                                                        <p className="text-xs text-base-content/50 capitalize">
                                                                            {item.exam_type || "Examination"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="text-sm">
                                                                {getSubjectName(item)}
                                                            </td>

                                                            <td className="text-sm">
                                                                {getSectionName(item)}
                                                            </td>

                                                            <td className="text-sm">
                                                                {item.academic_year || "—"}
                                                            </td>

                                                            <td className="text-sm whitespace-nowrap">
                                                                {formatDate(
                                                                    getSubmittedDate(item)
                                                                )}
                                                            </td>

                                                            <td>
                                                                <StatusBadge
                                                                    status={item.status}
                                                                />
                                                            </td>

                                                            <td>
                                                                <div className="flex justify-center">
                                                                    <button
                                                                        onClick={() =>
                                                                            setSelectedSubmissionId(
                                                                                getSubmissionId(item)
                                                                            )
                                                                        }
                                                                        className="btn btn-sm btn-outline btn-primary gap-1.5"
                                                                        disabled={
                                                                            !getSubmissionId(item)
                                                                        }
                                                                    >
                                                                        <Eye size={15} />
                                                                        Details
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-5 border-t border-base-200 mt-4">
                                        <p className="text-sm text-base-content/60">
                                            Showing{" "}
                                            {(currentPage - 1) * PAGE_SIZE + 1}
                                            {" - "}
                                            {Math.min(
                                                currentPage * PAGE_SIZE,
                                                filteredItems.length
                                            )}
                                            {" of "}
                                            {filteredItems.length} records
                                        </p>

                                        <div className="join">
                                            <button
                                                className="join-item btn btn-sm"
                                                disabled={currentPage === 1}
                                                onClick={() =>
                                                    setPage((previous) =>
                                                        Math.max(1, previous - 1)
                                                    )
                                                }
                                            >
                                                <ChevronLeft size={17} />
                                            </button>

                                            {Array.from(
                                                { length: totalPages },
                                                (_, index) => index + 1
                                            )
                                                .filter((number) => {
                                                    return (
                                                        number === 1 ||
                                                        number === totalPages ||
                                                        Math.abs(
                                                            number - currentPage
                                                        ) <= 1
                                                    );
                                                })
                                                .map((number, index, array) => (
                                                    <span
                                                        key={number}
                                                        className="contents"
                                                    >
                                                        {index > 0 &&
                                                            number -
                                                                array[index - 1] >
                                                                1 && (
                                                                <button
                                                                    className="join-item btn btn-sm btn-disabled"
                                                                    disabled
                                                                >
                                                                    ...
                                                                </button>
                                                            )}

                                                        <button
                                                            onClick={() =>
                                                                setPage(number)
                                                            }
                                                            className={`join-item btn btn-sm ${
                                                                currentPage === number
                                                                    ? "btn-active"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {number}
                                                        </button>
                                                    </span>
                                                ))}

                                            <button
                                                className="join-item btn btn-sm"
                                                disabled={
                                                    currentPage === totalPages
                                                }
                                                onClick={() =>
                                                    setPage((previous) =>
                                                        Math.min(
                                                            totalPages,
                                                            previous + 1
                                                        )
                                                    )
                                                }
                                            >
                                                <ChevronRight size={17} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                    </div>
                </div>

                {/* Information */}
                <div className="alert bg-primary/5 border border-primary/10 items-start">
                    <UserRound
                        size={20}
                        className="text-primary mt-0.5"
                    />

                    <div>
                        <h3 className="font-semibold text-sm">
                            Submission History Information
                        </h3>

                        <p className="text-xs text-base-content/60 mt-1">
                            This page displays your previous examination result
                            submissions. If a result is returned, review the
                            School Admin feedback before making corrections.
                        </p>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {selectedSubmissionId && (
                <ResultDetailsModal
                    submissionId={selectedSubmissionId}
                    onClose={() => setSelectedSubmissionId(null)}
                />
            )}
        </div>
    );
};

export default ResultsHistory;
