
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

const paymentMethods = [
    { value: "", label: "All Methods" },
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "mobile_banking", label: "Mobile Banking" },
];

const fetchPayments = async (params) => {
    const { data } = await api.get("/school-admin/fees/payments", {
        params,
    });

    return data;
};

const FeePayments = () => {
    const [search, setSearch] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [page, setPage] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const limit = 10;

    const queryParams = useMemo(
        () => ({
            search: search.trim(),
            payment_method: paymentMethod,
            from_date: fromDate,
            to_date: toDate,
            page,
            limit,
        }),
        [search, paymentMethod, fromDate, toDate, page]
    );

    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
    } = useQuery({
        queryKey: ["school-admin-fee-payments", queryParams],
        queryFn: () => fetchPayments(queryParams),
        keepPreviousData: true,
    });

    const payments = Array.isArray(data?.payments)
        ? data.payments
        : [];

    const summary = data?.summary || {};
    const pagination = data?.pagination || {};

    const totalPages = Math.max(
        1,
        Number(pagination.totalPages || 1)
    );

    const handleReset = () => {
        setSearch("");
        setPaymentMethod("");
        setFromDate("");
        setToDate("");
        setPage(1);
    };

    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleMethodChange = (value) => {
        setPaymentMethod(value);
        setPage(1);
    };

    const handleDateChange = (setter, value) => {
        setter(value);
        setPage(1);
    };

    return (
        <div className="space-y-6 p-4 md:p-6">

            {/* Page Header */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-base-content">
                        Fee Payments
                    </h1>
                    <p className="mt-1 text-sm text-base-content/60">
                        View and manage student fee payment transactions.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-outline btn-sm"
                >
                    Print
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Total Payments
                        </p>
                        <h2 className="text-2xl font-bold">
                            {Number(summary.total_payments || 0).toLocaleString()}
                        </h2>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Total Collected
                        </p>
                        <h2 className="text-2xl font-bold text-success">
                            {formatCurrency(summary.total_collected)}
                        </h2>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Cash Payments
                        </p>
                        <h2 className="text-2xl font-bold">
                            {Number(summary.cash_payments || 0).toLocaleString()}
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
                            placeholder="Search student, ID, reference..."
                            className="input input-bordered w-full"
                            value={search}
                            onChange={(e) =>
                                handleSearchChange(e.target.value)
                            }
                        />

                        <select
                            className="select select-bordered w-full"
                            value={paymentMethod}
                            onChange={(e) =>
                                handleMethodChange(e.target.value)
                            }
                        >
                            {paymentMethods.map((method) => (
                                <option
                                    key={method.value}
                                    value={method.value}
                                >
                                    {method.label}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            className="input input-bordered w-full"
                            value={fromDate}
                            onChange={(e) =>
                                handleDateChange(setFromDate, e.target.value)
                            }
                        />

                        <input
                            type="date"
                            className="input input-bordered w-full"
                            value={toDate}
                            min={fromDate || undefined}
                            onChange={(e) =>
                                handleDateChange(setToDate, e.target.value)
                            }
                        />

                        <button
                            type="button"
                            onClick={handleReset}
                            className="btn btn-outline"
                        >
                            Reset Filters
                        </button>

                    </div>

                    <p className="mt-2 text-xs text-base-content/50">
                        Date filters use the payment collection date.
                    </p>
                </div>
            </div>

            {/* Payment Table */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body p-0">

                    <div className="flex items-center justify-between p-5">
                        <h2 className="text-lg font-semibold">
                            Payment Transactions
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
                            <span>
                                {error?.response?.data?.message ||
                                    "Failed to load payment records."}
                            </span>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="font-medium">
                                No payment records found.
                            </p>
                            <p className="mt-1 text-sm text-base-content/60">
                                Try changing your search or filters.
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
                                            <th>Fee Category</th>
                                            <th>Amount</th>
                                            <th>Payment Method</th>
                                            <th>Reference</th>
                                            <th>Collected Date</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {payments.map((payment, index) => (
                                            <tr key={payment._id}>
                                                <td>
                                                    {(page - 1) * limit +
                                                        index + 1}
                                                </td>

                                                <td>
                                                    <div className="font-medium">
                                                        {payment.student_name || "—"}
                                                    </div>
                                                    <div className="text-xs text-base-content/60">
                                                        {payment.student_code || "—"}
                                                    </div>
                                                </td>

                                                <td>
                                                    {payment.category_name || "—"}
                                                </td>

                                                <td className="font-semibold">
                                                    {formatCurrency(payment.amount)}
                                                </td>

                                                <td>
                                                    <span className="badge badge-outline">
                                                        {payment.payment_method?.replace(
                                                            "_",
                                                            " "
                                                        ) || "—"}
                                                    </span>
                                                </td>

                                                <td>
                                                    {payment.transaction_reference || "—"}
                                                </td>

                                                <td>
                                                    {formatDate(payment.collected_at)}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            payment.payment_status === "completed"
                                                                ? "badge-success"
                                                                : payment.payment_status === "pending"
                                                                ? "badge-warning"
                                                                : "badge-error"
                                                        }`}
                                                    >
                                                        {payment.payment_status || "unknown"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-xs btn-outline btn-primary"
                                                        onClick={() =>
                                                            setSelectedPayment(payment)
                                                        }
                                                    >
                                                        Details
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
                                    Showing {payments.length} of{" "}
                                    {pagination.totalRecords || 0} payments
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
                                        disabled={page >= totalPages}
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

            {/* Payment Details Modal */}
            {selectedPayment && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="text-xl font-bold">
                            Payment Details
                        </h3>

                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Student Name
                                </p>
                                <p className="font-semibold">
                                    {selectedPayment.student_name || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Student ID
                                </p>
                                <p className="font-semibold">
                                    {selectedPayment.student_code || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Class
                                </p>
                                <p className="font-semibold">
                                    {selectedPayment.class_name || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Section
                                </p>
                                <p className="font-semibold">
                                    {selectedPayment.section_name || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Fee Category
                                </p>
                                <p className="font-semibold">
                                    {selectedPayment.category_name || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Academic Year
                                </p>
                                <p className="font-semibold">
                                    {selectedPayment.academic_year || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Payment Amount
                                </p>
                                <p className="font-bold text-success">
                                    {formatCurrency(selectedPayment.amount)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Payment Method
                                </p>
                                <p className="font-semibold">
                                    {selectedPayment.payment_method || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Transaction Reference
                                </p>
                                <p className="font-semibold">
                                    {selectedPayment.transaction_reference || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Collected Date
                                </p>
                                <p className="font-semibold">
                                    {formatDate(selectedPayment.collected_at)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Collected By
                                </p>
                                <p className="font-semibold">
                                    {selectedPayment.collected_by || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-base-content/60">
                                    Verification Status
                                </p>
                                <p className="font-semibold">
                                    {selectedPayment.verification_status || "—"}
                                </p>
                            </div>

                            <div className="sm:col-span-2">
                                <p className="text-sm text-base-content/60">
                                    Notes
                                </p>
                                <p className="font-semibold">
                                    {selectedPayment.notes || "No notes"}
                                </p>
                            </div>

                        </div>

                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => setSelectedPayment(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    <form
                        method="dialog"
                        className="modal-backdrop"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setSelectedPayment(null);
                        }}
                    >
                        <button type="submit">close</button>
                    </form>
                </dialog>
            )}

        </div>
    );
};

export default FeePayments;
