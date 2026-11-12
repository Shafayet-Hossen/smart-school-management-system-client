
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api.js";

const getToday = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const getMonthStart = () => {
    const date = new Date();
    date.setDate(1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}-01`;
};

const getChildName = (child) => {
    return (
        child.student_name ||
        child.name ||
        [
            child.first_name,
            child.last_name,
        ]
            .filter(Boolean)
            .join(" ") ||
        "Student"
    );
};

const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    // Parse YYYY-MM-DD as a local date to avoid timezone shifts.
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
        String(dateValue)
    );

    const date = match
        ? new Date(
              Number(match[1]),
              Number(match[2]) - 1,
              Number(match[3])
          )
        : new Date(dateValue);

    if (Number.isNaN(date.getTime())) return String(dateValue);

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const normalizeStatus = (status) => {
    const value = String(status || "")
        .trim()
        .toLowerCase();

    if (["present", "p"].includes(value)) return "present";

    if (["absent", "a"].includes(value)) return "absent";

    if (["late", "l"].includes(value)) return "late";

    if (
        ["excused", "leave", "on_leave", "holiday"].includes(value)
    ) {
        return "excused";
    }

    return "unknown";
};

const statusLabel = (status) => {
    const labels = {
        present: "Present",
        absent: "Absent",
        late: "Late",
        excused: "Excused",
        unknown: "Not recorded",
    };

    return labels[normalizeStatus(status)];
};

const statusBadge = (status) => {
    const styles = {
        present: "badge-success",
        absent: "badge-error",
        late: "badge-warning",
        excused: "badge-info",
        unknown: "badge-ghost",
    };

    return styles[normalizeStatus(status)];
};

const fetchChildren = async () => {
    const response = await api.get("/parent/children");

    if (response.data?.success === false) {
        throw new Error(
            response.data.message || "Failed to load children."
        );
    }

    const children =
        response.data?.children ??
        response.data?.data?.children ??
        response.data?.data ??
        [];

    if (!Array.isArray(children)) {
        throw new Error("Invalid children response.");
    }
    // console.log("children ",children)
    return children;
};

const fetchAttendance = async ({
    childId,
    startDate,
    endDate,
}) => {
    const response = await api.get("/parent/children-attendance", {
        params: {
            child_id: childId,
            start_date: startDate,
            end_date: endDate,
        },
    });

    if (response.data?.success === false) {
        throw new Error(
            response.data.message ||
                "Failed to load attendance records."
        );
    }

    const records =
        response.data?.attendance ??
        response.data?.records ??
        response.data?.data?.attendance ??
        response.data?.data?.records ??
        (Array.isArray(response.data?.data)
            ? response.data.data
            : []);

    if (!Array.isArray(records)) {
        throw new Error("Invalid attendance response.");
    }

    return {
        records,
        summary:
            response.data?.summary ??
            response.data?.data?.summary ??
            null,
    };
};

const SummaryCard = ({
    title,
    value,
    description,
    icon,
    color,
}) => (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-base-content/60">
                    {title}
                </p>

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
                >
                    <span className="text-xl">{icon}</span>
                </div>
            </div>

            <p className="mt-2 text-2xl font-bold sm:text-3xl">
                {value}
            </p>

            <p className="text-xs text-base-content/60">
                {description}
            </p>
        </div>
    </div>
);

const ChildrenAttendance = () => {
    const [selectedChildId, setSelectedChildId] = useState("");
    const [startDate, setStartDate] = useState(getMonthStart);
    const [endDate, setEndDate] = useState(getToday);

    /*
    |--------------------------------------------------------------------------
    | Fetch linked children
    |--------------------------------------------------------------------------
    */

    const {
        data: children = [],
        isPending: childrenPending,
        isError: childrenError,
        error: childrenErrorMessage,
        refetch: refetchChildren,
    } = useQuery({
        queryKey: ["parent", "children"],
        queryFn: fetchChildren,
        staleTime: 60 * 1000,
        retry: 1,
    });

    const selectedChild = useMemo(
        () =>
            children.find(
                (child) =>
                    String(
                        child.student_id ?? child._id ?? ""
                    ) === selectedChildId
            ),
        [children, selectedChildId]
    );

    /*
    |--------------------------------------------------------------------------
    | Fetch selected child's attendance
    |--------------------------------------------------------------------------
    */

    const validDateRange =
        Boolean(startDate) &&
        Boolean(endDate) &&
        startDate <= endDate;

    const {
        data: attendanceData,
        isPending: attendancePending,
        isFetching,
        isError: attendanceError,
        error: attendanceErrorMessage,
        refetch: refetchAttendance,
    } = useQuery({
        queryKey: [
            "parent",
            "children-attendance",
            selectedChildId,
            startDate,
            endDate,
        ],
        queryFn: () =>
            fetchAttendance({
                childId: selectedChildId,
                startDate,
                endDate,
            }),
        enabled: Boolean(selectedChildId) && validDateRange,
        staleTime: 30 * 1000,
        retry: 1,
    });

    const records = useMemo(() => {
        return [...(attendanceData?.records ?? [])].sort(
            (a, b) => {
                const dateA = String(
                    a.date ?? a.attendance_date ?? ""
                );
                const dateB = String(
                    b.date ?? b.attendance_date ?? ""
                );

                return dateB.localeCompare(dateA);
            }
        );
    }, [attendanceData]);

    /*
    |--------------------------------------------------------------------------
    | Calculate summary
    |--------------------------------------------------------------------------
    | Prefer the backend summary if it provides the expected fields.
    */

    const summary = useMemo(() => {
        const counts = {
            total: records.length,
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
            unknown: 0,
        };

        records.forEach((record) => {
            const status = normalizeStatus(
                record.status ?? record.attendance_status
            );

            counts[status] += 1;
        });

        const backendSummary = attendanceData?.summary;

        const total =
            Number(backendSummary?.total ?? counts.total);

        const present =
            Number(backendSummary?.present ?? counts.present);

        const absent =
            Number(backendSummary?.absent ?? counts.absent);

        const late =
            Number(backendSummary?.late ?? counts.late);

        const excused =
            Number(backendSummary?.excused ?? counts.excused);

        // Present and late are counted as attended.
        const attendancePercentage =
            backendSummary?.attendance_percentage != null
                ? Number(backendSummary.attendance_percentage)
                : total > 0
                  ? ((present + late) / total) * 100
                  : 0;

        return {
            total,
            present,
            absent,
            late,
            excused,
            attendancePercentage:
                Number.isFinite(attendancePercentage)
                    ? attendancePercentage
                    : 0,
        };
    }, [records, attendanceData]);

    const handleStartDateChange = (value) => {
        setStartDate(value);
    };

    const handleEndDateChange = (value) => {
        setEndDate(value);
    };

    const handleRefresh = async () => {
        await Promise.all([
            refetchChildren(),
            selectedChildId
                ? refetchAttendance()
                : Promise.resolve(),
        ]);
    };

    return (
        <main className="min-h-screen bg-base-200/50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Page heading */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">📅</span>

                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Children's Attendance
                            </h1>
                        </div>

                        <p className="mt-2 text-sm text-base-content/60 sm:text-base">
                            Monitor your children's school attendance
                            and daily records.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-outline btn-primary"
                        onClick={handleRefresh}
                        disabled={
                            childrenPending ||
                            isFetching
                        }
                    >
                        {childrenPending || isFetching ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : (
                            <span>↻</span>
                        )}

                        Refresh
                    </button>
                </header>

                {/* Children loading */}
                {childrenPending && (
                    <div className="card border border-base-300 bg-base-100">
                        <div className="card-body gap-4">
                            <div className="skeleton h-5 w-40" />
                            <div className="skeleton h-12 w-full" />
                        </div>
                    </div>
                )}

                {/* Children error */}
                {childrenError && (
                    <div className="alert alert-error">
                        <div className="flex-1">
                            <h2 className="font-bold">
                                Could not load your children
                            </h2>

                            <p className="text-sm">
                                {childrenErrorMessage?.response?.data
                                    ?.message ||
                                    childrenErrorMessage?.message ||
                                    "Please try again."}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => refetchChildren()}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* No linked children */}
                {!childrenPending &&
                    !childrenError &&
                    children.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-5 py-12 text-center">
                            <div className="mb-4 text-5xl">🎒</div>

                            <h2 className="text-xl font-bold">
                                No Children Found
                            </h2>

                            <p className="mx-auto mt-2 max-w-lg text-sm text-base-content/60">
                                No children are currently available
                                under your parent account. If you have
                                submitted a school connection request,
                                contact your school administrator.
                            </p>
                        </div>
                    )}

                {/* Child selector and date filters */}
                {!childrenPending &&
                    !childrenError &&
                    children.length > 0 && (
                        <section className="card border border-base-300 bg-base-100 shadow-sm">
                            <div className="card-body gap-5 p-4 sm:p-6">
                                <h2 className="text-lg font-bold">
                                    Select Child and Date Range
                                </h2>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="form-control">
                                        <label
                                            className="label"
                                            htmlFor="child-selector"
                                        >
                                            <span className="label-text font-medium">
                                                Child
                                            </span>
                                        </label>

                                        <select
                                            id="child-selector"
                                            className="select select-bordered w-full"
                                            value={selectedChildId}
                                            onChange={(event) =>
                                                setSelectedChildId(
                                                    event.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select a child
                                            </option>

                                            {children.map(
                                                (child, index) => {
                                                    const id = String(
                                                        child.student_id ??
                                                            child._id ??
                                                            ""
                                                    );

                                                    return (
                                                        <option
                                                            key={
                                                                id || index
                                                            }
                                                            value={id}
                                                            disabled={!id}
                                                        >
                                                            {getChildName(
                                                                child
                                                            )}{" "}
                                                            — Roll{" "}
                                                            {child.student_roll ??
                                                                child.roll_number ??
                                                                "N/A"}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <label
                                            className="label"
                                            htmlFor="start-date"
                                        >
                                            <span className="label-text font-medium">
                                                Start Date
                                            </span>
                                        </label>

                                        <input
                                            id="start-date"
                                            type="date"
                                            className="input input-bordered w-full"
                                            value={startDate}
                                            max={endDate || undefined}
                                            onChange={(event) =>
                                                handleStartDateChange(
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label
                                            className="label"
                                            htmlFor="end-date"
                                        >
                                            <span className="label-text font-medium">
                                                End Date
                                            </span>
                                        </label>

                                        <input
                                            id="end-date"
                                            type="date"
                                            className="input input-bordered w-full"
                                            value={endDate}
                                            min={startDate || undefined}
                                            max={getToday()}
                                            onChange={(event) =>
                                                handleEndDateChange(
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                {!validDateRange && (
                                    <p className="text-sm text-error">
                                        End date must be on or after
                                        the start date.
                                    </p>
                                )}

                                {selectedChild && (
                                    <div className="rounded-xl bg-base-200/70 p-4">
                                        <p className="font-semibold">
                                            {getChildName(selectedChild)}
                                        </p>

                                        <p className="mt-1 text-sm text-base-content/60">
                                            Class:{" "}
                                            {selectedChild.class_name ||
                                                "Not assigned"}{" "}
                                            <span className="mx-1">•</span>
                                            Section:{" "}
                                            {selectedChild.section_name ||
                                                "Not assigned"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                {/* Select a child */}
                {!childrenPending &&
                    !childrenError &&
                    children.length > 0 &&
                    !selectedChildId && (
                        <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-5 py-12 text-center">
                            <div className="mb-3 text-4xl">👆</div>

                            <h2 className="text-lg font-bold">
                                Select a Child
                            </h2>

                            <p className="mt-2 text-sm text-base-content/60">
                                Choose a child above to view their
                                attendance summary and history.
                            </p>
                        </div>
                    )}

                {/* Invalid date range */}
                {selectedChildId && !validDateRange && (
                    <div className="alert alert-warning">
                        Please choose a valid date range.
                    </div>
                )}

                {/* Attendance loading */}
                {selectedChildId &&
                    validDateRange &&
                    attendancePending && (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {Array.from({ length: 4 }).map(
                                    (_, index) => (
                                        <div
                                            key={index}
                                            className="card border border-base-300 bg-base-100"
                                        >
                                            <div className="card-body gap-3">
                                                <div className="skeleton h-4 w-28" />
                                                <div className="skeleton h-8 w-20" />
                                                <div className="skeleton h-3 w-32" />
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="card border border-base-300 bg-base-100">
                                <div className="card-body gap-4">
                                    <div className="skeleton h-5 w-48" />

                                    {Array.from({ length: 4 }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="skeleton h-10 w-full"
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                {/* Attendance error */}
                {selectedChildId &&
                    validDateRange &&
                    attendanceError && (
                        <div className="alert alert-error items-start">
                            <div className="flex-1">
                                <h2 className="font-bold">
                                    Unable to load attendance
                                </h2>

                                <p className="mt-1 text-sm">
                                    {attendanceErrorMessage?.response
                                        ?.data?.message ||
                                        attendanceErrorMessage?.message ||
                                        "Please try again."}
                                </p>

                                <button
                                    type="button"
                                    className="btn btn-sm mt-3"
                                    onClick={() =>
                                        refetchAttendance()
                                    }
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                {/* Attendance summary and history */}
                {selectedChildId &&
                    validDateRange &&
                    !attendancePending &&
                    !attendanceError &&
                    attendanceData && (
                        <>
                            {/* Summary cards */}
                            <section>
                                <div className="mb-4">
                                    <h2 className="text-lg font-bold">
                                        Attendance Summary
                                    </h2>

                                    <p className="text-sm text-base-content/60">
                                        {formatDate(startDate)} –{" "}
                                        {formatDate(endDate)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    <SummaryCard
                                        title="Attendance Rate"
                                        value={`${summary.attendancePercentage.toFixed(1)}%`}
                                        description="Present and late records"
                                        icon="📊"
                                        color="bg-primary/10"
                                    />

                                    <SummaryCard
                                        title="Present"
                                        value={summary.present}
                                        description="Days marked present"
                                        icon="✅"
                                        color="bg-success/10"
                                    />

                                    <SummaryCard
                                        title="Absent"
                                        value={summary.absent}
                                        description="Days marked absent"
                                        icon="❌"
                                        color="bg-error/10"
                                    />

                                    <SummaryCard
                                        title="Late / Excused"
                                        value={`${summary.late} / ${summary.excused}`}
                                        description="Late arrivals and excused records"
                                        icon="🕒"
                                        color="bg-warning/10"
                                    />
                                </div>
                            </section>

                            {/* Attendance history */}
                            <section className="card border border-base-300 bg-base-100 shadow-sm">
                                <div className="card-body p-0">
                                    <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                                        <div>
                                            <h2 className="text-lg font-bold">
                                                Attendance History
                                            </h2>

                                            <p className="text-sm text-base-content/60">
                                                {records.length} record
                                                {records.length === 1
                                                    ? ""
                                                    : "s"}{" "}
                                                found
                                            </p>
                                        </div>

                                        {isFetching && (
                                            <span className="loading loading-spinner loading-sm text-primary" />
                                        )}
                                    </div>

                                    {records.length === 0 ? (
                                        <div className="px-5 py-12 text-center">
                                            <div className="mb-3 text-4xl">
                                                🗓️
                                            </div>

                                            <h3 className="font-bold">
                                                No Attendance Records
                                            </h3>

                                            <p className="mt-2 text-sm text-base-content/60">
                                                No attendance records were
                                                returned for this child
                                                during the selected dates.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="table table-zebra">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Day</th>
                                                        <th>Status</th>
                                                        <th>Remarks</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {records.map(
                                                        (
                                                            record,
                                                            index
                                                        ) => {
                                                            const dateValue =
                                                                record.date ??
                                                                record.attendance_date;

                                                            const status =
                                                                record.status ??
                                                                record.attendance_status;

                                                            const date = dateValue
                                                                ? new Date(
                                                                      `${String(
                                                                          dateValue
                                                                      ).slice(
                                                                          0,
                                                                          10
                                                                      )}T12:00:00`
                                                                  )
                                                                : null;

                                                            const day =
                                                                date &&
                                                                !Number.isNaN(
                                                                    date.getTime()
                                                                )
                                                                    ? date.toLocaleDateString(
                                                                          "en-US",
                                                                          {
                                                                              weekday:
                                                                                  "long",
                                                                          }
                                                                      )
                                                                    : "—";

                                                            return (
                                                                <tr
                                                                    key={
                                                                        record._id ??
                                                                        record.attendance_id ??
                                                                        `${dateValue}-${index}`
                                                                    }
                                                                >
                                                                    <td className="whitespace-nowrap font-medium">
                                                                        {formatDate(
                                                                            dateValue
                                                                        )}
                                                                    </td>

                                                                    <td>
                                                                        {day}
                                                                    </td>

                                                                    <td>
                                                                        <span
                                                                            className={`badge ${statusBadge(status)} badge-outline`}
                                                                        >
                                                                            {statusLabel(
                                                                                status
                                                                            )}
                                                                        </span>
                                                                    </td>

                                                                    <td className="min-w-40 whitespace-normal">
                                                                        {record.remarks ??
                                                                            record.remark ??
                                                                            record.note ??
                                                                            "—"}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </>
                    )}
            </div>
        </main>
    );
};

export default ChildrenAttendance;
