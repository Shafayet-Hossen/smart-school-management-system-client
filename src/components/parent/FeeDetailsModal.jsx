
import { X, Receipt, CalendarDays, User, Wallet } from "lucide-react";
import FeeStatusBadge from "./FeeStatusBadge";
import PaymentMethodBadge from "./PaymentMethodBadge";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
};

const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const FeeDetailsModal = ({ fee, isOpen, onClose }) => {
    if (!isOpen || !fee) return null;

    const totalAmount = Number(fee.amount) || 0;
    const paidAmount = Number(fee.paid_amount) || 0;
    const dueAmount = Number(fee.due_amount) || 0;

    const paidPercentage =
        totalAmount > 0
            ? Math.min(100, (paidAmount / totalAmount) * 100)
            : 0;

    // Payment history can be supplied by a future API endpoint.
    const payments = Array.isArray(fee.payments)
        ? fee.payments
        : [];

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-3xl max-h-[90vh] p-0">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-base-300 p-5">
                    <div>
                        <h2 className="text-xl font-bold">
                            Fee Details
                        </h2>

                        <p className="text-sm text-base-content/60 mt-1">
                            Complete information about this fee record.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6 overflow-y-auto p-5">

                    {/* Student Information */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <User size={19} className="text-primary" />

                            <h3 className="font-semibold">
                                Student Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg bg-base-200/50 p-4">
                            <div>
                                <p className="text-xs text-base-content/60">
                                    Student Name
                                </p>

                                <p className="font-medium">
                                    {fee.student_name || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-base-content/60">
                                    Student ID
                                </p>

                                <p className="font-medium">
                                    {fee.student_code || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-base-content/60">
                                    Class
                                </p>

                                <p className="font-medium">
                                    {fee.class_name || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-base-content/60">
                                    Section
                                </p>

                                <p className="font-medium">
                                    {fee.section_name || "N/A"}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Fee Information */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <Receipt size={19} className="text-primary" />

                            <h3 className="font-semibold">
                                Fee Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg bg-base-200/50 p-4">
                            <div>
                                <p className="text-xs text-base-content/60">
                                    Fee Category
                                </p>

                                <p className="font-medium">
                                    {fee.category_name || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-base-content/60">
                                    Academic Year
                                </p>

                                <p className="font-medium">
                                    {fee.academic_year || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-base-content/60">
                                    Frequency
                                </p>

                                <p className="font-medium capitalize">
                                    {fee.frequency || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-base-content/60">
                                    Due Date
                                </p>

                                <p className="font-medium">
                                    {formatDate(fee.due_date)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-base-content/60">
                                    Fee Status
                                </p>

                                <FeeStatusBadge
                                    status={fee.payment_status}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Payment Summary */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <Wallet size={19} className="text-primary" />

                            <h3 className="font-semibold">
                                Payment Summary
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-lg bg-base-200/50 p-4">
                                <p className="text-xs text-base-content/60">
                                    Total Fee
                                </p>

                                <p className="text-lg font-bold mt-1">
                                    {formatCurrency(totalAmount)}
                                </p>
                            </div>

                            <div className="rounded-lg bg-success/10 p-4">
                                <p className="text-xs text-success">
                                    Paid Amount
                                </p>

                                <p className="text-lg font-bold text-success mt-1">
                                    {formatCurrency(paidAmount)}
                                </p>
                            </div>

                            <div className="rounded-lg bg-error/10 p-4">
                                <p className="text-xs text-error">
                                    Due Amount
                                </p>

                                <p className="text-lg font-bold text-error mt-1">
                                    {formatCurrency(dueAmount)}
                                </p>
                            </div>
                        </div>

                        {/* Payment progress */}
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-base-content/60">
                                    Payment Progress
                                </span>

                                <span className="font-semibold">
                                    {paidPercentage.toFixed(0)}%
                                </span>
                            </div>

                            <progress
                                className="progress progress-success w-full"
                                value={paidPercentage}
                                max="100"
                            />
                        </div>
                    </section>

                    {/* Payment History */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <CalendarDays
                                size={19}
                                className="text-primary"
                            />

                            <h3 className="font-semibold">
                                Payment History
                            </h3>
                        </div>

                        {payments.length === 0 ? (
                            <div className="rounded-lg bg-base-200/50 p-6 text-center">
                                <p className="text-sm text-base-content/60">
                                    No payment history is available in this fee record.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Amount</th>
                                            <th>Method</th>
                                            <th>Reference</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {payments.map((payment, index) => (
                                            <tr key={payment._id || index}>
                                                <td>
                                                    {formatDate(
                                                        payment.collected_at ||
                                                        payment.created_at
                                                    )}
                                                </td>

                                                <td className="font-medium">
                                                    {formatCurrency(payment.amount)}
                                                </td>

                                                <td>
                                                    <PaymentMethodBadge
                                                        method={payment.payment_method}
                                                    />
                                                </td>

                                                <td>
                                                    {payment.transaction_reference || "N/A"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-base-300 p-4">
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>

            <div
                className="modal-backdrop"
                onClick={onClose}
            >
                <button type="button">Close</button>
            </div>
        </div>
    );
};

export default FeeDetailsModal;
