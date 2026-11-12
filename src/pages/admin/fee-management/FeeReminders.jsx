
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../services/api.js";

const formatCurrency = (amount) =>
    `৳${Number(amount || 0).toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const fetchReminders = async (params) => {
    const { data } = await api.get(
        "/school-admin/fees/reminders",
        { params }
    );

    return data;
};

const FeeReminders = () => {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [classId, setClassId] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedFee, setSelectedFee] = useState(null);
    const [message, setMessage] = useState("");
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState("due");

    const limit = 10;

    const params = useMemo(
        () => ({
            search: search.trim(),
            academic_year: academicYear,
            class_id: classId,
            page,
            limit,
        }),
        [search, academicYear, classId, page]
    );

    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
    } = useQuery({
        queryKey: ["school-admin-fee-reminders", params],
        queryFn: () => fetchReminders(params),
        keepPreviousData: true,
    });

    const records = Array.isArray(data?.records)
        ? data.records
        : [];

    const history = Array.isArray(data?.history)
        ? data.history
        : [];

    const classes = Array.isArray(data?.filters?.classes)
        ? data.filters.classes
        : [];

    const summary = data?.summary || {};
    const pagination = data?.pagination || {};

    const totalPages = Math.max(
        1,
        Number(pagination.totalPages || 1)
    );

    const sendReminderMutation = useMutation({
        mutationFn: async (payload) => {
            const { data } = await api.post(
                "/school-admin/fees/reminders/send",
                payload
            );

            return data;
        },
        onSuccess: () => {
            setSelectedFee(null);
            setMessage("");
            queryClient.invalidateQueries({
                queryKey: ["school-admin-fee-reminders"],
            });
        },
    });

    const bulkReminderMutation = useMutation({
        mutationFn: async (payload) => {
            const { data } = await api.post(
                "/school-admin/fees/reminders/send-bulk",
                payload
            );

            return data;
        },
        onSuccess: () => {
            setSelectedIds([]);
            queryClient.invalidateQueries({
                queryKey: ["school-admin-fee-reminders"],
            });
        },
    });

    const handleSelect = (feeId) => {
        setSelectedIds((current) =>
            current.includes(feeId)
                ? current.filter((id) => id !== feeId)
                : [...current, feeId]
        );
    };

    const handleSelectAll = () => {
        const currentPageIds = records.map((record) => record._id);

        const allSelected = currentPageIds.every((id) =>
            selectedIds.includes(id)
        );

        setSelectedIds((current) =>
            allSelected
                ? current.filter((id) => !currentPageIds.includes(id))
                : [
                    ...new Set([...current, ...currentPageIds]),
                ]
        );
    };

    const handleSendReminder = () => {
        if (!selectedFee) return;

        sendReminderMutation.mutate({
            student_fee_id: selectedFee._id,
            message: message.trim(),
        });
    };

    const handleBulkReminder = () => {
        if (!selectedIds.length) return;

        bulkReminderMutation.mutate({
            student_fee_ids: selectedIds,
        });
    };

    const resetFilters = () => {
        setSearch("");
        setAcademicYear("");
        setClassId("");
        setPage(1);
        setSelectedIds([]);
    };

    return (
        <div className="space-y-6 p-4 md:p-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">
                    Fee Reminders
                </h1>

                <p className="mt-1 text-sm text-base-content/60">
                    Send payment reminders to students and parents.
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Outstanding Records
                        </p>

                        <h2 className="text-2xl font-bold">
                            {summary.total_records || 0}
                        </h2>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Total Due
                        </p>

                        <h2 className="text-2xl font-bold text-error">
                            {formatCurrency(summary.total_due)}
                        </h2>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Reminders Sent
                        </p>

                        <h2 className="text-2xl font-bold text-success">
                            {summary.reminders_sent || 0}
                        </h2>
                    </div>
                </div>

            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed w-fit">
                <button
                    type="button"
                    className={`tab ${activeTab === "due" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("due")}
                >
                    Outstanding Fees
                </button>

                <button
                    type="button"
                    className={`tab ${activeTab === "history" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("history")}
                >
                    Reminder History
                </button>
            </div>

            {/* Outstanding Fees */}
            {activeTab === "due" && (
                <>
                    <div className="card border border-base-300 bg-base-100 shadow-sm">
                        <div className="card-body">

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                                <input
                                    type="text"
                                    className="input input-bordered"
                                    placeholder="Search student or ID..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                        setSelectedIds([]);
                                    }}
                                />

                                <input
                                    type="text"
                                    className="input input-bordered"
                                    placeholder="Academic year"
                                    value={academicYear}
                                    onChange={(e) => {
                                        setAcademicYear(e.target.value);
                                        setPage(1);
                                    }}
                                />

                                <select
                                    className="select select-bordered"
                                    value={classId}
                                    onChange={(e) => {
                                        setClassId(e.target.value);
                                        setPage(1);
                                        setSelectedIds([]);
                                    }}
                                >
                                    <option value="">All Classes</option>

                                    {classes.map((item) => (
                                        <option
                                            key={item._id}
                                            value={item._id}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </button>

                            </div>
                        </div>
                    </div>

                    {selectedIds.length > 0 && (
                        <div className="flex flex-col justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center">
                            <p className="font-medium">
                                {selectedIds.length} fee record(s) selected
                            </p>

                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                disabled={bulkReminderMutation.isPending}
                                onClick={handleBulkReminder}
                            >
                                {bulkReminderMutation.isPending
                                    ? "Sending..."
                                    : "Send Bulk Reminders"}
                            </button>
                        </div>
                    )}

                    <div className="card border border-base-300 bg-base-100 shadow-sm">

                        <div className="flex items-center justify-between p-5">
                            <h2 className="text-lg font-semibold">
                                Students with Outstanding Fees
                            </h2>

                            {isFetching && (
                                <span className="loading loading-spinner loading-sm" />
                            )}
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-16">
                                <span className="loading loading-spinner loading-lg" />
                            </div>
                        ) : isError ? (
                            <div className="alert alert-error m-5">
                                {error?.response?.data?.message ||
                                    "Failed to load reminders."}
                            </div>
                        ) : records.length === 0 ? (
                            <div className="py-16 text-center">
                                No outstanding fee records found.
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">

                                        <thead>
                                            <tr>
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox checkbox-sm"
                                                        checked={
                                                            records.length > 0 &&
                                                            records.every((record) =>
                                                                selectedIds.includes(record._id)
                                                            )
                                                        }
                                                        onChange={handleSelectAll}
                                                    />
                                                </th>
                                                <th>Student</th>
                                                <th>Class</th>
                                                <th>Fee Category</th>
                                                <th>Due Amount</th>
                                                <th>Due Date</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {records.map((record) => (
                                                <tr key={record._id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox checkbox-sm"
                                                            checked={selectedIds.includes(record._id)}
                                                            onChange={() =>
                                                                handleSelect(record._id)
                                                            }
                                                        />
                                                    </td>

                                                    <td>
                                                        <div className="font-medium">
                                                            {record.student_name}
                                                        </div>

                                                        <div className="text-xs text-base-content/60">
                                                            {record.student_code}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {record.class_name}
                                                        <div className="text-xs text-base-content/60">
                                                            {record.section_name}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {record.category_name}
                                                    </td>

                                                    <td className="font-bold text-error">
                                                        {formatCurrency(record.due_amount)}
                                                    </td>

                                                    <td>
                                                        {formatDate(record.due_date)}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`badge ${
                                                                record.payment_status === "overdue"
                                                                    ? "badge-error"
                                                                    : "badge-warning"
                                                            }`}
                                                        >
                                                            {record.payment_status}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-xs"
                                                            onClick={() => {
                                                                setSelectedFee(record);
                                                                setMessage("");
                                                            }}
                                                        >
                                                            Send Reminder
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>

                                <div className="flex flex-col justify-between gap-3 border-t border-base-300 p-5 sm:flex-row sm:items-center">

                                    <p className="text-sm text-base-content/60">
                                        Showing {records.length} of{" "}
                                        {pagination.totalRecords || 0} records
                                    </p>

                                    <div className="join">
                                        <button
                                            type="button"
                                            className="btn btn-sm join-item"
                                            disabled={page <= 1}
                                            onClick={() => setPage((p) => p - 1)}
                                        >
                                            Previous
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-sm join-item"
                                            disabled
                                        >
                                            {page} / {Math.max(1, pagination.totalPages || 1)}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-sm join-item"
                                            disabled={page >= totalPages}
                                            onClick={() => setPage((p) => p + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* Reminder History */}
            {activeTab === "history" && (
                <div className="card border border-base-300 bg-base-100 shadow-sm">

                    <div className="card-body">
                        <h2 className="text-lg font-semibold">
                            Reminder History
                        </h2>

                        {history.length === 0 ? (
                            <p className="py-10 text-center text-base-content/60">
                                No reminder history found.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Fee Category</th>
                                            <th>Amount Due</th>
                                            <th>Channel</th>
                                            <th>Sent Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {history.map((item) => (
                                            <tr key={item._id}>
                                                <td>
                                                    {item.student_name}
                                                    <div className="text-xs text-base-content/60">
                                                        {item.student_code}
                                                    </div>
                                                </td>

                                                <td>{item.category_name}</td>

                                                <td>
                                                    {formatCurrency(item.due_amount)}
                                                </td>

                                                <td>
                                                    {item.channel || "—"}
                                                </td>

                                                <td>
                                                    {formatDate(item.sent_at)}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            item.status === "sent"
                                                                ? "badge-success"
                                                                : item.status === "failed"
                                                                ? "badge-error"
                                                                : "badge-warning"
                                                        }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Individual Reminder Modal */}
            {selectedFee && (
                <dialog className="modal modal-open">
                    <div className="modal-box">

                        <h3 className="text-lg font-bold">
                            Send Fee Reminder
                        </h3>

                        <div className="mt-4 space-y-3">

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Student
                                </p>
                                <p className="font-semibold">
                                    {selectedFee.student_name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Outstanding Amount
                                </p>
                                <p className="text-xl font-bold text-error">
                                    {formatCurrency(selectedFee.due_amount)}
                                </p>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Optional custom message
                                    </span>
                                </label>

                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    rows={4}
                                    placeholder="Write a reminder message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    maxLength={1000}
                                />
                            </div>

                        </div>

                        {sendReminderMutation.isError && (
                            <div className="alert alert-error mt-4">
                                {sendReminderMutation.error?.response?.data?.message ||
                                    "Failed to send reminder."}
                            </div>
                        )}

                        <div className="modal-action">

                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => setSelectedFee(null)}
                                disabled={sendReminderMutation.isPending}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                disabled={sendReminderMutation.isPending}
                                onClick={handleSendReminder}
                            >
                                {sendReminderMutation.isPending
                                    ? "Sending..."
                                    : "Send Reminder"}
                            </button>

                        </div>
                    </div>

                    <form
                        method="dialog"
                        className="modal-backdrop"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setSelectedFee(null);
                        }}
                    >
                        <button type="submit">close</button>
                    </form>
                </dialog>
            )}

            {/* Bulk mutation error */}
            {bulkReminderMutation.isError && (
                <div className="alert alert-error">
                    {bulkReminderMutation.error?.response?.data?.message ||
                        "Failed to send bulk reminders."}
                </div>
            )}

            {bulkReminderMutation.isSuccess && (
                <div className="alert alert-success">
                    {bulkReminderMutation.data?.message ||
                        "Bulk reminder request completed."}
                </div>
            )}

        </div>
    );
};

export default FeeReminders;
