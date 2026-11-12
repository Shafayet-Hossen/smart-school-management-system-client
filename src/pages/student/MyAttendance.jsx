
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStudentAttendance } from "../../services/studentAttendanceService.js";

const normalizeStatus = (status) =>
    String(status ?? "").trim().toLowerCase();

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const statusStyles = {
    present: "badge-success",
    absent: "badge-error",
    late: "badge-warning",
    excused: "badge-info",
};

const StatusBadge = ({ status }) => {
    const normalized = normalizeStatus(status);
    const style = statusStyles[normalized] ?? "badge-ghost";

    return (
        <span className={`badge ${style} badge-outline capitalize`}>
            {normalized || "Unknown"}
        </span>
    );
};

const SummaryCard = ({ title, value, description, color }) => (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-2 p-5">
            <p className="text-sm font-medium text-base-content/70">
                {title}
            </p>

            <p className={`text-3xl font-bold ${color ?? ""}`}>
                {value}
            </p>

            <p className="text-xs text-base-content/60">
                {description}
            </p>
        </div>
    </div>
);

export default function MyAttendance() {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const {
        data,
        isPending,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["student-attendance"],
        queryFn: getStudentAttendance,
        staleTime: 60 * 1000,
    });

    const EMPTY_ATTENDANCE = [];

    const attendance = Array.isArray(data?.attendance)
        ? data.attendance
        : EMPTY_ATTENDANCE;


    const summary = (() => {
        const counts = {
            total: attendance.length,
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
        };

        attendance.forEach((record) => {
            const status = normalizeStatus(record.status);

            if (Object.hasOwn(counts, status) && status !== "total") {
                counts[status] += 1;
            }
        });

        const total = counts.total;
        const attended = counts.present + counts.late;

        const percentage =
            total > 0
                ? Math.round((attended / total) * 100)
                : 0;

        return {
            ...counts,
            percentage: Number.isFinite(data?.summary?.percentage)
                ? data.summary.percentage
                : percentage,
        };
    })();


    const filteredAttendance = useMemo(() => {
        return attendance
            .filter((record) => {
                const recordDate = String(record.date ?? "").slice(0, 10);

                if (fromDate && recordDate < fromDate) return false;
                if (toDate && recordDate > toDate) return false;

                if (
                    statusFilter !== "all" &&
                    normalizeStatus(record.status) !== statusFilter
                ) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {
                return String(b.date ?? "").localeCompare(
                    String(a.date ?? "")
                );
            });
    }, [attendance, fromDate, toDate, statusFilter]);

    const resetFilters = () => {
        setFromDate("");
        setToDate("");
        setStatusFilter("all");
    };

    if (isPending) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
                <span className="ml-3 text-base-content/70">
                    Loading your attendance...
                </span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-3xl p-6">
                <div role="alert" className="alert alert-error">
                    <div>
                        <h2 className="font-bold">
                            Could not load attendance
                        </h2>
                        <p className="text-sm">
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Something went wrong. Please try again."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => refetch()}
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-base-200/50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Page heading */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            STUDENT PORTAL
                        </p>

                        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                            My Attendance
                        </h1>

                        <p className="mt-2 text-sm text-base-content/70">
                            Track your attendance record and review your
                            attendance history.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-outline btn-primary"
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        {isFetching ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : (
                            "Refresh"
                        )}
                    </button>
                </div>

                {/* Attendance summary */}
                <section>
                    <h2 className="mb-3 text-lg font-semibold">
                        Attendance Overview
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        <SummaryCard
                            title="Total Classes"
                            value={summary.total}
                            description="Recorded attendance entries"
                        />

                        <SummaryCard
                            title="Present"
                            value={summary.present}
                            description="Classes attended"
                            color="text-success"
                        />

                        <SummaryCard
                            title="Absent"
                            value={summary.absent}
                            description="Classes missed"
                            color="text-error"
                        />

                        <SummaryCard
                            title="Late"
                            value={summary.late}
                            description="Late arrivals"
                            color="text-warning"
                        />

                        <div className="card border border-base-300 bg-base-100 shadow-sm">
                            <div className="card-body gap-2 p-5">
                                <p className="text-sm font-medium text-base-content/70">
                                    Attendance Rate
                                </p>

                                <p className="text-3xl font-bold text-primary">
                                    {summary.percentage}%
                                </p>

                                <progress
                                    className="progress progress-primary mt-1 w-full"
                                    value={summary.percentage}
                                    max="100"
                                />

                                <p className="text-xs text-base-content/60">
                                    Present and late entries count as attended
                                    in the fallback calculation.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Attendance history */}
                <section className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-4 sm:p-6">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Attendance History
                                </h2>
                                <p className="mt-1 text-sm text-base-content/60">
                                    Review your recorded attendance by date
                                    and status.
                                </p>
                            </div>

                            <span className="badge badge-neutral badge-lg">
                                {filteredAttendance.length} records
                            </span>
                        </div>

                        {/* Filters */}
                        <div className="mt-3 grid grid-cols-1 gap-4 rounded-xl bg-base-200/60 p-4 sm:grid-cols-2 lg:grid-cols-4">
                            <label className="form-control">
                                <span className="label-text mb-2 font-medium">
                                    From date
                                </span>
                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    value={fromDate}
                                    max={toDate || undefined}
                                    onChange={(event) =>
                                        setFromDate(event.target.value)
                                    }
                                />
                            </label>

                            <label className="form-control">
                                <span className="label-text mb-2 font-medium">
                                    To date
                                </span>
                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    value={toDate}
                                    min={fromDate || undefined}
                                    onChange={(event) =>
                                        setToDate(event.target.value)
                                    }
                                />
                            </label>

                            <label className="form-control">
                                <span className="label-text mb-2 font-medium">
                                    Attendance status
                                </span>
                                <select
                                    className="select select-bordered w-full"
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(event.target.value)
                                    }
                                >
                                    <option value="all">All statuses</option>
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="late">Late</option>
                                    <option value="excused">Excused</option>
                                </select>
                            </label>

                            <div className="flex items-end">
                                <button
                                    type="button"
                                    className="btn btn-outline w-full"
                                    onClick={resetFilters}
                                >
                                    Clear filters
                                </button>
                            </div>
                        </div>

                        {/* Responsive table */}
                        <div className="mt-4 overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Class</th>
                                        <th>Section</th>
                                        <th>Subject</th>
                                        <th>Status</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredAttendance.map((record, index) => (
                                        <tr
                                            key={
                                                record._id ??
                                                `${record.date}-${record.subject}-${index}`
                                            }
                                        >
                                            <td className="whitespace-nowrap font-medium">
                                                {formatDate(record.date)}
                                            </td>

                                            <td>
                                                {record.class_name || "—"}
                                            </td>

                                            <td>
                                                {record.section_name || "—"}
                                            </td>

                                            <td>
                                                {record.subject ||
                                                    record.subject_name ||
                                                    "—"}
                                            </td>

                                            <td>
                                                <StatusBadge
                                                    status={record.status}
                                                />
                                            </td>

                                            <td className="max-w-48">
                                                {record.remarks ||
                                                    record.note ||
                                                    "—"}
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredAttendance.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="py-12 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-3xl">
                                                        📋
                                                    </span>

                                                    <p className="font-semibold">
                                                        No attendance records
                                                        found
                                                    </p>

                                                    <p className="text-sm text-base-content/60">
                                                        Try changing your
                                                        filters, or check again
                                                        when attendance has been
                                                        recorded.
                                                    </p>

                                                    {(fromDate ||
                                                        toDate ||
                                                        statusFilter !==
                                                        "all") && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-primary mt-2"
                                                                onClick={
                                                                    resetFilters
                                                                }
                                                            >
                                                                Clear filters
                                                            </button>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
