import { useQuery } from "@tanstack/react-query";
import {
    FaFileInvoiceDollar,
    FaMoneyBillWave,
    FaWallet,
    FaExclamationCircle,
    FaHistory,
    FaCalendarAlt,
} from "react-icons/fa";

import {
    getStudentFeeSummary,
    getStudentFeePayments,
} from "../../../services/studentFeeService.js";

const formatCurrency = (amount, currency = "BDT") => {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
};

const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const normalizeSummary = (data) => {
    const summary = data?.summary || data || {};

    return {
        totalFees: Number(summary.total_fees ?? summary.total_amount ?? 0),
        paidAmount: Number(summary.paid_amount ?? 0),
        dueAmount: Number(summary.due_amount ?? summary.total_due ?? 0),
        unpaidCount: Number(summary.unpaid_count ?? 0),
        partialCount: Number(summary.partial_count ?? 0),
        currency: summary.currency || "BDT",
    };
};

const SummaryCard = ({
    title,
    amount,
    description,
    icon: Icon,
    color,
}) => {
    return (
        <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-5">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm text-base-content/60">
                            {title}
                        </p>

                        <h2 className="mt-2 text-2xl font-bold">
                            {amount}
                        </h2>

                        <p className="mt-1 text-xs text-base-content/50">
                            {description}
                        </p>
                    </div>

                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
                    >
                        <Icon className="text-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const getPaymentStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
        case "completed":
        case "paid":
        case "verified":
            return "badge-success";

        case "pending":
            return "badge-warning";

        case "failed":
        case "rejected":
            return "badge-error";

        default:
            return "badge-ghost";
    }
};

const StudentFeeDashboard = () => {
    const {
        data: summaryData,
        isLoading: summaryLoading,
        isError: summaryError,
        refetch: refetchSummary,
    } = useQuery({
        queryKey: ["student-fee-summary"],
        queryFn: getStudentFeeSummary,
    });

    const {
        data: paymentsData,
        isLoading: paymentsLoading,
        isError: paymentsError,
        refetch: refetchPayments,
    } = useQuery({
        queryKey: ["student-fee-recent-payments"],
        queryFn: () => getStudentFeePayments({
            page: 1,
            limit: 5,
        }),
    });

    const summary = normalizeSummary(summaryData);

    const payments = Array.isArray(paymentsData?.payments)
        ? paymentsData.payments
        : Array.isArray(paymentsData?.records)
            ? paymentsData.records
            : [];

    const isLoading = summaryLoading || paymentsLoading;

    const handleRefresh = () => {
        refetchSummary();
        refetchPayments();
    };

    if (isLoading) {
        return (
            <div className="flex min-h-80 items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (summaryError && paymentsError) {
        return (
            <div className="alert alert-error">
                <FaExclamationCircle />

                <div>
                    <h3 className="font-bold">
                        Unable to load fee information
                    </h3>

                    <p className="text-sm">
                        Please try again later.
                    </p>
                </div>

                <button
                    onClick={handleRefresh}
                    className="btn btn-sm"
                >
                    Retry
                </button>
            </div>
        );
    }

    const paidPercentage = summary.totalFees > 0
        ? Math.min(
            100,
            Math.round(
                (summary.paidAmount / summary.totalFees) * 100
            )
        )
        : 0;

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold">
                        Fee Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        Overview of your fees and payment information.
                    </p>
                </div>

                <button
                    onClick={handleRefresh}
                    className="btn btn-outline btn-sm"
                >
                    Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <SummaryCard
                    title="Total Assigned Fees"
                    amount={formatCurrency(
                        summary.totalFees,
                        summary.currency
                    )}
                    description="Total fees assigned to you"
                    icon={FaFileInvoiceDollar}
                    color="bg-primary/10 text-primary"
                />

                <SummaryCard
                    title="Total Paid"
                    amount={formatCurrency(
                        summary.paidAmount,
                        summary.currency
                    )}
                    description="Amount already paid"
                    icon={FaMoneyBillWave}
                    color="bg-success/10 text-success"
                />

                <SummaryCard
                    title="Outstanding Balance"
                    amount={formatCurrency(
                        summary.dueAmount,
                        summary.currency
                    )}
                    description="Amount remaining to pay"
                    icon={FaWallet}
                    color="bg-warning/10 text-warning"
                />

                <SummaryCard
                    title="Unpaid Fees"
                    amount={summary.unpaidCount}
                    description={`${summary.partialCount} partially paid fees`}
                    icon={FaExclamationCircle}
                    color="bg-error/10 text-error"
                />

            </div>

            {/* Payment Progress */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="card-title text-base">
                            Fee Payment Progress
                        </h2>

                        <span className="text-lg font-bold text-primary">
                            {paidPercentage}%
                        </span>
                    </div>

                    <progress
                        className="progress progress-primary mt-3 w-full"
                        value={paidPercentage}
                        max="100"
                    />

                    <div className="mt-2 flex justify-between text-xs text-base-content/60">
                        <span>
                            Paid: {formatCurrency(
                                summary.paidAmount,
                                summary.currency
                            )}
                        </span>

                        <span>
                            Total: {formatCurrency(
                                summary.totalFees,
                                summary.currency
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {/* Recent Payments */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body p-0">

                    <div className="flex items-center justify-between border-b border-base-300 p-5">
                        <div>
                            <h2 className="card-title text-base">
                                <FaHistory className="text-primary" />
                                Recent Payments
                            </h2>

                            <p className="mt-1 text-xs text-base-content/60">
                                Your latest fee payment records
                            </p>
                        </div>

                        <span className="badge badge-outline">
                            {payments.length} records
                        </span>
                    </div>

                    {paymentsError ? (
                        <div className="p-5 text-center">
                            <p className="text-sm text-error">
                                Unable to load recent payments.
                            </p>

                            <button
                                onClick={refetchPayments}
                                className="btn btn-ghost btn-sm mt-2"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-10 text-center">
                            <FaFileInvoiceDollar className="mb-3 text-4xl text-base-content/30" />

                            <h3 className="font-semibold">
                                No Payment Records
                            </h3>

                            <p className="mt-1 text-sm text-base-content/60">
                                Your payment history will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Fee</th>
                                        <th>Amount</th>
                                        <th>Payment Date</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {payments.map((payment) => (
                                        <tr key={payment._id}>
                                            <td>
                                                <div className="font-medium">
                                                    {payment.category_name ||
                                                        payment.fee_name ||
                                                        "School Fee"}
                                                </div>

                                                <div className="text-xs text-base-content/50">
                                                    {payment.billing_period ||
                                                        payment.academic_year ||
                                                        ""}
                                                </div>
                                            </td>

                                            <td className="font-semibold">
                                                {formatCurrency(
                                                    payment.amount,
                                                    payment.currency ||
                                                        summary.currency
                                                )}
                                            </td>

                                            <td>
                                                <span className="flex items-center gap-2 text-sm">
                                                    <FaCalendarAlt className="text-base-content/40" />

                                                    {formatDate(
                                                        payment.collected_at ||
                                                        payment.created_at
                                                    )}
                                                </span>
                                            </td>

                                            <td className="capitalize">
                                                {String(
                                                    payment.payment_method ||
                                                    "N/A"
                                                ).replaceAll("_", " ")}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getPaymentStatusClass(
                                                        payment.payment_status
                                                    )}`}
                                                >
                                                    {payment.payment_status ||
                                                        "Unknown"}
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

            {/* Parent Payment Notice */}
            <div className="alert alert-info">
                <FaExclamationCircle className="text-xl" />

                <div>
                    <h3 className="font-semibold">
                        Online Fee Payment
                    </h3>

                    <p className="text-sm">
                        To pay your outstanding fees online, please contact
                        your parent or guardian. Students can view their
                        fee and payment information here.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default StudentFeeDashboard;