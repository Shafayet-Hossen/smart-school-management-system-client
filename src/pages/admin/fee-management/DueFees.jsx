
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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

const fetchDueFees = async (params) => {
    const { data } = await api.get("/school-admin/fees/due", {
        params,
    });

    return data;
};

const DueFees = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [classId, setClassId] = useState("");
    const [page, setPage] = useState(1);

    const limit = 10;

    const queryParams = useMemo(
        () => ({
            search: search.trim(),
            academic_year: academicYear,
            payment_status: paymentStatus,
            class_id: classId,
            page,
            limit,
        }),
        [search, academicYear, paymentStatus, classId, page]
    );

    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
    } = useQuery({
        queryKey: ["school-admin-due-fees", queryParams],
        queryFn: () => fetchDueFees(queryParams),
        keepPreviousData: true,
    });

    const records = Array.isArray(data?.records)
        ? data.records
        : [];

    const summary = data?.summary || {};
    const pagination = data?.pagination || {};
    const classes = Array.isArray(data?.filters?.classes)
        ? data.filters.classes
        : [];

    const totalPages = Math.max(
        1,
        Number(pagination.totalPages || 1)
    );

    const resetFilters = () => {
        setSearch("");
        setAcademicYear("");
        setPaymentStatus("");
        setClassId("");
        setPage(1);
    };

    const handleCollection = (feeId) => {
        navigate(
            `/school-admin/fees-collect?student_fee_id=${feeId}`
        );
    };

    return (
        <div className="space-y-6 p-4 md:p-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">
                    Due Fees
                </h1>

                <p className="mt-1 text-sm text-base-content/60">
                    Monitor students' outstanding fee payments.
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Total Due Amount
                        </p>

                        <h2 className="text-2xl font-bold text-error">
                            {formatCurrency(summary.total_due)}
                        </h2>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Students with Due
                        </p>

                        <h2 className="text-2xl font-bold">
                            {Number(summary.total_students || 0).toLocaleString()}
                        </h2>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Outstanding Fee Records
                        </p>

                        <h2 className="text-2xl font-bold">
                            {Number(summary.total_records || 0).toLocaleString()}
                        </h2>
                    </div>
                </div>

            </div>

            {/* Filters */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">

                        <input
                            type="text"
                            placeholder="Search student or ID..."
                            className="input input-bordered w-full"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />

                        <input
                            type="text"
                            placeholder="Academic year"
                            className="input input-bordered w-full"
                            value={academicYear}
                            onChange={(e) => {
                                setAcademicYear(e.target.value);
                                setPage(1);
                            }}
                        />

                        <select
                            className="select select-bordered w-full"
                            value={paymentStatus}
                            onChange={(e) => {
                                setPaymentStatus(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Due Statuses</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="partial">Partially Paid</option>
                            <option value="overdue">Overdue</option>
                        </select>

                        <select
                            className="select select-bordered w-full"
                            value={classId}
                            onChange={(e) => {
                                setClassId(e.target.value);
                                setPage(1);
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

            {/* Due Fee Records */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">

                <div className="flex items-center justify-between p-5">
                    <h2 className="text-lg font-semibold">
                        Outstanding Fee Records
                    </h2>

                    {isFetching && (
                        <span className="loading loading-spinner loading-sm" />
                    )}
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <span className="loading loading-spinner loading-lg text-primary" />
                    </div>
                ) : isError ? (
                    <div className="alert alert-error m-5">
                        {error?.response?.data?.message ||
                            "Failed to load due fee records."}
                    </div>
                ) : records.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="font-medium">
                            No outstanding fees found.
                        </p>

                        <p className="mt-1 text-sm text-base-content/60">
                            All matching fee records are paid.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Student</th>
                                        <th>Class</th>
                                        <th>Fee Category</th>
                                        <th>Academic Year</th>
                                        <th>Total Amount</th>
                                        <th>Paid</th>
                                        <th>Due Amount</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {records.map((record, index) => (
                                        <tr key={record._id}>

                                            <td>
                                                {(page - 1) * limit +
                                                    index + 1}
                                            </td>

                                            <td>
                                                <div className="font-medium">
                                                    {record.student_name || "—"}
                                                </div>

                                                <div className="text-xs text-base-content/60">
                                                    {record.student_code || "—"}
                                                </div>
                                            </td>

                                            <td>
                                                <div>
                                                    {record.class_name || "—"}
                                                </div>

                                                <div className="text-xs text-base-content/60">
                                                    {record.section_name || "—"}
                                                </div>
                                            </td>

                                            <td>
                                                {record.category_name || "—"}
                                            </td>

                                            <td>
                                                {record.academic_year || "—"}
                                            </td>

                                            <td>
                                                {formatCurrency(record.amount)}
                                            </td>

                                            <td className="text-success">
                                                {formatCurrency(record.paid_amount)}
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
                                                            : record.payment_status === "partial"
                                                            ? "badge-warning"
                                                            : "badge-ghost"
                                                    }`}
                                                >
                                                    {record.payment_status}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-xs btn-primary"
                                                    onClick={() =>
                                                        handleCollection(record._id)
                                                    }
                                                >
                                                    Collect
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                        {/* Pagination */}
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
                                    onClick={() =>
                                        setPage((current) => current - 1)
                                    }
                                >
                                    Previous
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-sm join-item"
                                    disabled
                                >
                                    {page} / {totalPages}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-sm join-item"
                                    disabled={page >= totalPages}
                                    onClick={() =>
                                        setPage((current) => current + 1)
                                    }
                                >
                                    Next
                                </button>

                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default DueFees;
