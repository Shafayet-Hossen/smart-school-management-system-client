
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    FaMoneyBillWave,
    FaChevronLeft,
    FaChevronRight,
    FaReceipt,
} from "react-icons/fa";

import { getStudentFeePayments } from "../../../services/studentFeeService.js";

const formatCurrency = (amount, currency = "BDT") =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(Number(amount) || 0);

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
        case "completed":
            return "badge-success";
        case "pending":
            return "badge-warning";
        case "failed":
            return "badge-error";
        case "refunded":
            return "badge-info";
        default:
            return "badge-ghost";
    }
};

const StudentFeePayments = () => {
    const [page, setPage] = useState(1);
    const limit = 10;

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["student-fee-payments", page],
        queryFn: () => getStudentFeePayments({ page, limit }),
        keepPreviousData: true,
    });

    const payments = Array.isArray(data?.payments)
        ? data.payments
        : [];

    const pagination = data?.pagination || {};
    const totalPages = Math.max(
        1,
        Number(pagination.totalPages) || 1
    );

    const completedAmount = payments
        .filter(
            (payment) =>
                payment.payment_status === "completed" &&
                payment.verification_status === "verified"
        )
        .reduce(
            (total, payment) =>
                total + Number(payment.amount || 0),
            0
        );

    const currency = payments[0]?.currency || "BDT";

    const handlePageChange = (nextPage) => {
        if (nextPage >= 1 && nextPage <= totalPages) {
            setPage(nextPage);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-error">
                <span>
                    {error?.response?.data?.message ||
                        "Failed to load payment history."}
                </span>
                <button
                    onClick={() => refetch()}
                    className="btn btn-sm"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">
                    Payment History
                </h1>
                <p className="mt-1 text-sm text-base-content/60">
                    View your previous school fee payment records.
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-base-content/60">
                                    Payments on this page
                                </p>
                                <h2 className="mt-2 text-2xl font-bold">
                                    {payments.length}
                                </h2>
                            </div>
                            <div className="rounded-xl bg-primary/10 p-4 text-primary">
                                <FaMoneyBillWave size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-base-content/60">
                                    Verified payments on this page
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-success">
                                    {formatCurrency(
                                        completedAmount,
                                        currency
                                    )}
                                </h2>
                            </div>
                            <div className="rounded-xl bg-success/10 p-4 text-success">
                                <FaReceipt size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment table */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body p-4 sm:p-6">
                    <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <h2 className="text-lg font-semibold">
                            Payment Records
                        </h2>
                        <span className="text-sm text-base-content/60">
                            {pagination.totalRecords || payments.length} records
                        </span>
                    </div>

                    {payments.length === 0 ? (
                        <div className="py-12 text-center">
                            <FaMoneyBillWave className="mx-auto text-4xl text-base-content/30" />
                            <h3 className="mt-3 font-semibold">
                                No payment records found
                            </h3>
                            <p className="mt-1 text-sm text-base-content/60">
                                Your payment history will appear here.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Fee Category</th>
                                            <th>Academic Year</th>
                                            <th>Amount</th>
                                            <th>Payment Method</th>
                                            <th>Transaction Reference</th>
                                            <th>Payment Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {payments.map((payment) => (
                                            <tr key={payment._id}>
                                                <td>
                                                    <div className="font-medium">
                                                        {payment.category_name ||
                                                            "School Fee"}
                                                    </div>
                                                    {payment.billing_period && (
                                                        <div className="text-xs text-base-content/50">
                                                            {payment.billing_period}
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    {payment.academic_year || "—"}
                                                </td>

                                                <td className="font-semibold">
                                                    {formatCurrency(
                                                        payment.amount,
                                                        payment.currency || "BDT"
                                                    )}
                                                </td>

                                                <td className="capitalize">
                                                    {payment.payment_method || "—"}
                                                </td>

                                                <td className="text-sm">
                                                    {payment.transaction_reference || "—"}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        payment.collected_at ||
                                                        payment.created_at
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="flex flex-col items-start gap-1">
                                                        <span
                                                            className={`badge ${getStatusClass(
                                                                payment.payment_status
                                                            )}`}
                                                        >
                                                            {payment.payment_status || "Unknown"}
                                                        </span>

                                                        {payment.verification_status && (
                                                            <span className="text-xs text-base-content/50">
                                                                {payment.verification_status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-5 flex items-center justify-between">
                                <p className="text-sm text-base-content/60">
                                    Page {page} of {totalPages}
                                </p>

                                <div className="join">
                                    <button
                                        className="btn btn-sm join-item"
                                        disabled={page <= 1}
                                        onClick={() =>
                                            handlePageChange(page - 1)
                                        }
                                    >
                                        <FaChevronLeft />
                                    </button>

                                    <button className="btn btn-sm join-item">
                                        {page}
                                    </button>

                                    <button
                                        className="btn btn-sm join-item"
                                        disabled={page >= totalPages}
                                        onClick={() =>
                                            handlePageChange(page + 1)
                                        }
                                    >
                                        <FaChevronRight />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Notice */}
            <div className="alert alert-info">
                <FaMoneyBillWave />
                <span className="text-sm">
                    This page is for viewing payment history only.
                    Please contact your parent or guardian for online
                    fee payments.
                </span>
            </div>
        </div>
    );
};

export default StudentFeePayments;
