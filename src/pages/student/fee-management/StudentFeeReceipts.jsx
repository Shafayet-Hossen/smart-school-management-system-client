
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    FaReceipt,
    FaPrint,
    FaEye,
    FaTimes,
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
        month: "long",
        year: "numeric",
    });
};

const StudentFeeReceipts = () => {
    const [page, setPage] = useState(1);
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    const limit = 10;

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["student-fee-receipts", page],
        queryFn: () => getStudentFeePayments({ page, limit }),
        placeholderData: (previousData) => previousData,
    });

    const allPayments = Array.isArray(data?.payments)
        ? data.payments
        : [];

    // Only completed and verified payments have receipts.
    const receipts = allPayments.filter((payment) => {
        return (
            payment.payment_status === "completed" &&
            payment.verification_status === "verified"
        );
    });

    const pagination = data?.pagination || {};
    const totalPages = Math.max(
        1,
        Number(pagination.totalPages) || 1
    );

    const handlePrint = () => {
        window.print();
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
                        "Failed to load fee receipts."}
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
            {/* Print styles */}
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden !important;
                        }

                        .receipt-print-area,
                        .receipt-print-area * {
                            visibility: visible !important;
                        }

                        .receipt-print-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            padding: 20px;
                            background: white !important;
                            color: black !important;
                        }

                        .no-print {
                            display: none !important;
                        }

                        @page {
                            size: A4;
                            margin: 15mm;
                        }
                    }
                `}
            </style>

            {/* Header */}
            <div className="no-print">
                <h1 className="text-2xl font-bold">
                    Fee Receipts
                </h1>

                <p className="mt-1 text-sm text-base-content/60">
                    View and print receipts for your verified fee payments.
                </p>
            </div>

            {/* Receipt list */}
            <div className="card border border-base-300 bg-base-100 shadow-sm no-print">
                <div className="card-body p-4 sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Available Receipts
                        </h2>

                        <span className="text-sm text-base-content/60">
                            Page {page} of {totalPages}
                        </span>
                    </div>

                    {receipts.length === 0 ? (
                        <div className="py-12 text-center">
                            <FaReceipt className="mx-auto text-4xl text-base-content/30" />

                            <h3 className="mt-3 font-semibold">
                                No receipts available
                            </h3>

                            <p className="mt-1 text-sm text-base-content/60">
                                Receipts will appear here after your payments
                                are completed and verified.
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
                                            <th>Payment Date</th>
                                            <th>Receipt</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {receipts.map((payment) => (
                                            <tr key={payment._id}>
                                                <td className="font-medium">
                                                    {payment.category_name ||
                                                        "School Fee"}
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

                                                <td>
                                                    {formatDate(
                                                        payment.collected_at ||
                                                        payment.created_at
                                                    )}
                                                </td>

                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline btn-primary"
                                                        onClick={() =>
                                                            setSelectedReceipt(payment)
                                                        }
                                                    >
                                                        <FaEye />
                                                        View Receipt
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-5 flex items-center justify-between">
                                <button
                                    className="btn btn-sm"
                                    disabled={page <= 1}
                                    onClick={() =>
                                        setPage((current) =>
                                            Math.max(1, current - 1)
                                        )
                                    }
                                >
                                    Previous
                                </button>

                                <span className="text-sm text-base-content/60">
                                    Page {page} of {totalPages}
                                </span>

                                <button
                                    className="btn btn-sm"
                                    disabled={page >= totalPages}
                                    onClick={() =>
                                        setPage((current) =>
                                            Math.min(totalPages, current + 1)
                                        )
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Receipt preview */}
            {selectedReceipt && (
                <div className="space-y-4">
                    <div className="no-print flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Receipt Preview
                        </h2>

                        <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => setSelectedReceipt(null)}
                        >
                            <FaTimes />
                            Close
                        </button>
                    </div>

                    <div className="receipt-print-area rounded-xl border border-base-300 bg-white p-6 text-black shadow-sm sm:p-10">
                        {/* Receipt heading */}
                        <div className="border-b-2 border-dashed border-gray-300 pb-6 text-center">
                            <h1 className="text-2xl font-bold">
                                SCHOOL FEE PAYMENT RECEIPT
                            </h1>

                            <p className="mt-2 text-sm text-gray-600">
                                Official payment record
                            </p>
                        </div>

                        {/* Receipt information */}
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Receipt Reference
                                </p>

                                <p className="mt-1 break-all font-semibold">
                                    {selectedReceipt._id}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Payment Date
                                </p>

                                <p className="mt-1 font-semibold">
                                    {formatDate(
                                        selectedReceipt.collected_at ||
                                        selectedReceipt.created_at
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Academic Year
                                </p>

                                <p className="mt-1 font-semibold">
                                    {selectedReceipt.academic_year || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Billing Period
                                </p>

                                <p className="mt-1 font-semibold">
                                    {selectedReceipt.billing_period || "—"}
                                </p>
                            </div>
                        </div>

                        {/* Payment details */}
                        <div className="mt-8">
                            <h3 className="mb-3 font-bold">
                                Payment Details
                            </h3>

                            <table className="w-full border-collapse">
                                <tbody>
                                    <tr className="border-y border-gray-300">
                                        <td className="py-3 text-gray-600">
                                            Fee Category
                                        </td>

                                        <td className="py-3 text-right font-semibold">
                                            {selectedReceipt.category_name ||
                                                "School Fee"}
                                        </td>
                                    </tr>

                                    <tr className="border-b border-gray-300">
                                        <td className="py-3 text-gray-600">
                                            Payment Method
                                        </td>

                                        <td className="py-3 text-right font-semibold capitalize">
                                            {selectedReceipt.payment_method || "—"}
                                        </td>
                                    </tr>

                                    <tr className="border-b border-gray-300">
                                        <td className="py-3 text-gray-600">
                                            Transaction Reference
                                        </td>

                                        <td className="py-3 text-right font-semibold break-all">
                                            {selectedReceipt.transaction_reference || "—"}
                                        </td>
                                    </tr>

                                    <tr className="border-b border-gray-300">
                                        <td className="py-3 text-gray-600">
                                            Payment Status
                                        </td>

                                        <td className="py-3 text-right font-semibold text-green-700">
                                            Completed and Verified
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Total */}
                        <div className="mt-8 rounded-lg bg-gray-100 p-5">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">
                                    Total Amount Paid
                                </span>

                                <span className="text-2xl font-bold">
                                    {formatCurrency(
                                        selectedReceipt.amount,
                                        selectedReceipt.currency || "BDT"
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="mt-10 border-t border-gray-300 pt-5 text-center">
                            <p className="font-semibold">
                                Thank you for your payment.
                            </p>

                            <p className="mt-2 text-xs text-gray-500">
                                This receipt is generated from the school's
                                payment records.
                            </p>
                        </div>
                    </div>

                    {/* Print button */}
                    <div className="no-print flex justify-end">
                        <button
                            className="btn btn-primary"
                            onClick={handlePrint}
                        >
                            <FaPrint />
                            Print Receipt
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentFeeReceipts;
