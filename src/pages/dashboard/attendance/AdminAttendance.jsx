import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
    CalendarDays,
    Users,
    UserCheck,
    UserX,
    Clock,
    Search,
    RefreshCw,
    Filter,
    ClipboardCheck,
} from "lucide-react";

import {
    getAttendanceClasses,
    getAttendanceSections,
    getAttendanceDetails,
    getAttendanceDetailsSummary,
} from "../../../services/adminAttendanceService.js";

// ========================================
// Helpers
// ========================================

const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const extractArray = (response, keys = []) => {
    if (Array.isArray(response)) return response;

    for (const key of keys) {
        if (Array.isArray(response?.[key])) {
            return response[key];
        }

        if (Array.isArray(response?.data?.[key])) {
            return response.data[key];
        }
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
};

const extractSummary = (response) => {
    return response?.summary ||
        response?.data?.summary ||
        response?.data ||
        response ||
        {};
};

// ========================================
// Summary Card
// ========================================

const SummaryCard = ({
    title,
    value,
    icon: Icon,
    color,
    percentage,
}) => {
    return (
        <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-5">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-base-content/60">
                            {title}
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {value ?? 0}
                        </h2>

                        {percentage !== undefined && (
                            <p className="text-xs text-base-content/50 mt-1">
                                {percentage}% of attendance records
                            </p>
                        )}
                    </div>

                    <div className={`p-3 rounded-xl ${color}`}>
                        <Icon size={24} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ========================================
// Attendance Status Badge
// ========================================

const StatusBadge = ({ status }) => {
    const styles = {
        present: "badge-success",
        absent: "badge-error",
        late: "badge-warning",
        excused: "badge-info",
    };

    return (
        <span
            className={`badge ${
                styles[status?.toLowerCase()] || "badge-ghost"
            } badge-outline capitalize`}
        >
            {status || "Unknown"}
        </span>
    );
};

// ========================================
// Main Component
// ========================================

const AdminAttendance = () => {
    // Filters
    const [selectedClassId, setSelectedClassId] = useState("");
    const [selectedSectionId, setSelectedSectionId] = useState("");
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [selectedStatus, setSelectedStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [page, setPage] = useState(1);

    const limit = 10;

    // ====================================
    // Classes
    // ====================================

    const {
        data: classesResponse,
        isLoading: classesLoading,
    } = useQuery({
        queryKey: ["attendance-details-classes"],
        queryFn: getAttendanceClasses,
    });

    // console.log("Classes Response:", classesResponse);
    
    const classes = useMemo(
        () =>
            extractArray(classesResponse, [
                "classes",
                "data",
            ]),
        [classesResponse]
    );

    // ====================================
    // Sections
    // ====================================

    const {
        data: sectionsResponse,
        isLoading: sectionsLoading,
    } = useQuery({
        queryKey: [
            "attendance-details-sections",
            selectedClassId,
        ],
        queryFn: () =>
            getAttendanceSections(selectedClassId),
        enabled: Boolean(selectedClassId),
    });

    // console.log("Sections Response:", sectionsResponse);

    const sections = useMemo(
        () =>
            extractArray(sectionsResponse, [
                "sections",
                "data",
            ]),
        [sectionsResponse]
    );

    // ====================================
    // Attendance Query Parameters
    // ====================================

    const queryParams = useMemo(() => {
        const params = {
            date: selectedDate,
            page,
            limit,
        };

        if (selectedClassId) {
            params.class_code = selectedClassId;
        }

        if (selectedSectionId) {
            params.section_id = selectedSectionId;
        }

        if (selectedStatus) {
            params.status = selectedStatus;
        }

        return params;
    }, [
        selectedDate,
        selectedClassId,
        selectedSectionId,
        selectedStatus,
        page,
    ]);

    // ====================================
    // Attendance Records
    // ====================================

    const {
        data: attendanceResponse,
        isLoading: attendanceLoading,
        isFetching: attendanceFetching,
        error: attendanceError,
        refetch,
    } = useQuery({
        queryKey: [
            "admin-attendance-details",
            queryParams,
        ],
        queryFn: () =>
            getAttendanceDetails(queryParams),
    });

    const records = useMemo(
        () =>
            extractArray(attendanceResponse, [
                "records",
            ]),
        [attendanceResponse]
    );

    const pagination = attendanceResponse?.data || attendanceResponse || {};

    // ====================================
    // Attendance Summary
    // ====================================

    const summaryParams = useMemo(() => {
        const params = {
            date: selectedDate,
        };

        if (selectedClassId) {
            params.class_code = selectedClassId;
        }

        if (selectedSectionId) {
            params.section_id = selectedSectionId;
        }

        return params;
    }, [
        selectedDate,
        selectedClassId,
        selectedSectionId,
    ]);

    const {
        data: summaryResponse,
        isLoading: summaryLoading,
    } = useQuery({
        queryKey: [
            "admin-attendance-summary",
            summaryParams,
        ],
        queryFn: () =>
            getAttendanceDetailsSummary(summaryParams),
    });

    const summary = useMemo(
        () => extractSummary(summaryResponse),
        [summaryResponse]
    );

    // ====================================
    // Search
    // ====================================

    const filteredRecords = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) return records;

        return records.filter((record) => {
            return [
                record.student_name,
                record.student_code,
                record.roll_number,
                record.class_name,
                record.section_name,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(search)
                );
        });
    }, [records, searchTerm]);

    // ====================================
    // Summary Percentages
    // ====================================

    const total = Number(summary.total_students || 0);

    const getPercentage = (value) => {
        if (!total) return 0;

        return Math.round((Number(value || 0) / total) * 100);
    };

    // ====================================
    // Filter Handlers
    // ====================================

    const handleClassChange = (event) => {
        setSelectedClassId(event.target.value);
        setSelectedSectionId("");
        setPage(1);
    };

    const handleSectionChange = (event) => {
        setSelectedSectionId(event.target.value);
        setPage(1);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        setPage(1);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
        setPage(1);
    };

    const handleReset = () => {
        setSelectedClassId("");
        setSelectedSectionId("");
        setSelectedDate(getTodayDate());
        setSelectedStatus("");
        setSearchTerm("");
        setPage(1);
    };

    // ====================================
    // Loading State
    // ====================================

    if (classesLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    // ====================================
    // UI
    // ====================================

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Attendance Details
                    </h1>

                    <p className="text-base-content/60 mt-1">
                        View and analyze class-wise student attendance.
                    </p>
                </div>

                <button
                    onClick={() => refetch()}
                    className="btn btn-outline btn-primary"
                    disabled={attendanceFetching}
                >
                    <RefreshCw
                        size={17}
                        className={
                            attendanceFetching ? "animate-spin" : ""
                        }
                    />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body p-5">

                    <div className="flex items-center gap-2 mb-3">
                        <Filter size={19} />
                        <h2 className="font-semibold text-lg">
                            Attendance Filters
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* Class */}
                        <div>
                            <label className="label">
                                <span className="label-text font-medium">
                                    Select Class
                                </span>
                            </label>

                            <select
                                className="select select-bordered w-full"
                                value={selectedClassId}
                                onChange={handleClassChange}
                            >
                                <option value="">
                                    All Classes
                                </option>

                                {classes.map((item) => (
                                    <option
                                        key={item.class_code}
                                        value={item.class_code}
                                    >
                                        {item.class_name ||
                                            item.name ||
                                            item.class_code}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Section */}
                        <div>
                            <label className="label">
                                <span className="label-text font-medium">
                                    Select Section
                                </span>
                            </label>

                            <select
                                className="select select-bordered w-full"
                                value={selectedSectionId}
                                onChange={handleSectionChange}
                                disabled={!selectedClassId || sectionsLoading}
                            >
                                <option value="">
                                    All Sections
                                </option>

                                {sections.map((item) => (
                                    <option
                                        key={item._id}
                                        value={item._id}
                                    >
                                        {item.section_name ||
                                            item.name ||
                                            item.section_code}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="label">
                                <span className="label-text font-medium">
                                    Attendance Date
                                </span>
                            </label>

                            <input
                                type="date"
                                className="input input-bordered w-full"
                                value={selectedDate}
                                onChange={handleDateChange}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="label">
                                <span className="label-text font-medium">
                                    Attendance Status
                                </span>
                            </label>

                            <select
                                className="select select-bordered w-full"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                            >
                                <option value="">
                                    All Status
                                </option>
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="late">Late</option>
                                <option value="excused">Excused</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end mt-3">
                        <button
                            onClick={handleReset}
                            className="btn btn-ghost btn-sm"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                <SummaryCard
                    title="Total Attendance Records"
                    value={summaryLoading ? "..." : total}
                    icon={Users}
                    color="bg-primary/10 text-primary"
                />

                <SummaryCard
                    title="Present"
                    value={summaryLoading ? "..." : summary.present || 0}
                    icon={UserCheck}
                    color="bg-success/10 text-success"
                    percentage={getPercentage(summary.present)}
                />

                <SummaryCard
                    title="Absent"
                    value={summaryLoading ? "..." : summary.absent || 0}
                    icon={UserX}
                    color="bg-error/10 text-error"
                    percentage={getPercentage(summary.absent)}
                />

                <SummaryCard
                    title="Late"
                    value={summaryLoading ? "..." : summary.late || 0}
                    icon={Clock}
                    color="bg-warning/10 text-warning"
                    percentage={getPercentage(summary.late)}
                />

            </div>

            {/* Attendance Table */}
            <div className="card bg-base-100 shadow-sm border border-base-200">

                <div className="card-body p-0">

                    {/* Table Header */}
                    <div className="p-5 border-b border-base-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>
                            <h2 className="text-lg font-semibold">
                                Student Attendance Records
                            </h2>

                            <p className="text-sm text-base-content/60">
                                Date: {selectedDate}
                            </p>
                        </div>

                        <div className="relative w-full md:w-72">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                            />

                            <input
                                type="text"
                                placeholder="Search student..."
                                className="input input-bordered w-full pl-10"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">

                        {attendanceLoading ? (
                            <div className="flex justify-center py-16">
                                <span className="loading loading-spinner loading-lg text-primary" />
                            </div>
                        ) : attendanceError ? (
                            <div className="text-center py-16 text-error">
                                Failed to load attendance records.
                            </div>
                        ) : filteredRecords.length === 0 ? (
                            <div className="text-center py-16">
                                <ClipboardCheck
                                    size={42}
                                    className="mx-auto text-base-content/30 mb-3"
                                />

                                <h3 className="font-semibold text-lg">
                                    No Attendance Records Found
                                </h3>

                                <p className="text-sm text-base-content/60 mt-1">
                                    Try changing your filters or selecting another date.
                                </p>
                            </div>
                        ) : (
                            <table className="table table-zebra">

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Student</th>
                                        <th>Student ID</th>
                                        <th>Class</th>
                                        <th>Section</th>
                                        <th>Roll</th>
                                        <th>Status</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredRecords.map((record, index) => (
                                        <tr key={record._id}>
                                            <td>
                                                {(page - 1) * limit + index + 1}
                                            </td>

                                            <td>
                                                <div className="font-medium">
                                                    {record.student_name}
                                                </div>
                                            </td>

                                            <td>
                                                {record.student_code || "—"}
                                            </td>

                                            <td>
                                                {record.class_name || "—"}
                                            </td>

                                            <td>
                                                {record.section_name || "—"}
                                            </td>

                                            <td>
                                                {record.roll_number || "—"}
                                            </td>

                                            <td>
                                                <StatusBadge
                                                    status={record.status}
                                                />
                                            </td>

                                            <td className="max-w-48 truncate">
                                                {record.remarks || "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-base-200 flex flex-col sm:flex-row justify-between items-center gap-3">

                        <p className="text-sm text-base-content/60">
                            Page {pagination.page || page} of{" "}
                            {pagination.totalPages || 1}
                            {" "}({pagination.total ?? 0} records)
                        </p>

                        <div className="join">
                            <button
                                className="join-item btn btn-sm"
                                disabled={page <= 1 || attendanceLoading}
                                onClick={() =>
                                    setPage((previous) => previous - 1)
                                }
                            >
                                Previous
                            </button>

                            <button
                                className="join-item btn btn-sm"
                                disabled={
                                    page >= (pagination.totalPages || 1) ||
                                    attendanceLoading
                                }
                                onClick={() =>
                                    setPage((previous) => previous + 1)
                                }
                            >
                                Next
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default AdminAttendance;