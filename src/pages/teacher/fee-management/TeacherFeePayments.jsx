import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";

import { getTeacherFeePayments } from "../../../services/teacherFeeService.js";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
    }).format(Number(amount) || 0);

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const TeacherFeePayments = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const limit = 10;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-fee-payments", search, page],
        queryFn: () => getTeacherFeePayments({ search, page, limit }),
        placeholderData: (previousData) => previousData,
    });

    const payments = Array.isArray(data?.payments)
        ? data.payments
        : [];

    const pagination = data?.pagination || {};
    const totalPages = Math.max(
        1,
        Number(pagination.totalPages) || 1
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Payment History</h1>
                <p className="mt-1 text-sm text-base-content/60">
                    View payment transactions for your assigned students.
                </p>
            </div>

            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <label className="input input-bordered flex items-center gap-2">
                        <FaSearch className="text-base-content/50" />
                        <input
                            type="search"
                            placeholder="Search student or transaction reference..."
                            className="grow"
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setPage(1);
                            }}
                        />
                    </label>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : isError ? (
                        <div className="alert alert-error mt-4">
                            {error?.response?.data?.message ||
                                "Unable to load payment history."}
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="py-12 text-center text-base-content/60">
                            No payment records found.
                        </div>
                    ) : (
                        <>
                            <div className="mt-4 overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Fee Category</th>
                                            <th>Amount</th>
                                            <th>Method</th>
                                            <th>Transaction Reference</th>
                                            <th>Payment Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {payments.map((payment) => (
                                            <tr key={payment._id}>
                                                <td>
                                                    <div className="font-semibold">
                                                        {payment.student_name || "—"}
                                                    </div>
                                                    <div className="text-xs text-base-content/50">
                                                        {payment.student_code || "—"}
                                                    </div>
                                                </td>

                                                <td>
                                                    {payment.category_name || "—"}
                                                </td>

                                                <td className="font-semibold">
                                                    {formatCurrency(payment.amount)}
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
                                                    <span className={`badge ${
                                                        payment.payment_status === "completed"
                                                            ? "badge-success"
                                                            : payment.payment_status === "pending"
                                                                ? "badge-warning"
                                                                : "badge-error"
                                                    }`}>
                                                        {payment.payment_status || "Unknown"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-5 flex items-center justify-between">
                                <span className="text-sm text-base-content/60">
                                    Page {page} of {totalPages}
                                </span>

                                <div className="join">
                                    <button
                                        className="btn btn-sm join-item"
                                        disabled={page <= 1}
                                        onClick={() =>
                                            setPage((current) => current - 1)
                                        }
                                    >
                                        Previous
                                    </button>

                                    <button
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
        </div>
    );
};

export default TeacherFeePayments;