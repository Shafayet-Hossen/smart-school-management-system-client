import { useEffect, useMemo, useState } from "react";
import {
    getSchoolAdminFees,
    getSchoolAdminFeeSummary,
    getSchoolAdminFeeOptions,
    recordStudentFeePayment,
} from "../../services/schoolAdminFeeService";

const initialFilters = {
    academic_year: "",
    class_id: "",
    section_id: "",
    status: "",
    search: "",
};

const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case "paid":
            return "badge-success";
        case "partial":
            return "badge-warning";
        case "due":
        case "unpaid":
            return "badge-error";
        default:
            return "badge-ghost";
    }
};

export default function StudentFeeManagement() {
    const [fees, setFees] = useState([]);
    const [summary, setSummary] = useState({
        total_fees: 0,
        total_collected: 0,
        total_due: 0,
        total_students: 0,
    });

    const [options, setOptions] = useState({
        academic_years: [],
        classes: [],
        sections: [],
    });

    const [filters, setFilters] = useState(initialFilters);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [selectedFee, setSelectedFee] = useState(null);
    const [paymentForm, setPaymentForm] = useState({
        amount: "",
        payment_method: "cash",
        payment_date: new Date().toISOString().slice(0, 10),
        transaction_id: "",
        remarks: "",
    });

    const [refreshKey, setRefreshKey] = useState(0);

    const selectedClass = useMemo(
        () => options.classes.find(
            (item) => item._id === filters.class_id
        ),
        [options.classes, filters.class_id]
    );

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const response = await getSchoolAdminFeeOptions();

                setOptions({
                    academic_years: response.academic_years || [],
                    classes: response.classes || [],
                    sections: response.sections || [],
                });
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load fee filter options."
                );
            }
        };

        loadOptions();
    }, []);

    useEffect(() => {
        let active = true;

        const loadFeeData = async () => {
            setLoading(true);
            setError("");

            try {
                const params = Object.fromEntries(
                    Object.entries(filters).filter(
                        ([, value]) => value !== ""
                    )
                );

                const [feeResponse, summaryResponse] = await Promise.all([
                    getSchoolAdminFees(params),
                    getSchoolAdminFeeSummary(params),
                ]);

                if (!active) return;

                setFees(feeResponse.fees || []);
                setSummary(
                    summaryResponse.summary || summaryResponse
                );
            } catch (err) {
                if (!active) return;

                setError(
                    err.response?.data?.message ||
                    "Failed to load student fee records."
                );
            } finally {
                if (active) setLoading(false);
            }
        };

        loadFeeData();

        return () => {
            active = false;
        };
    }, [filters, refreshKey]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((previous) => ({
            ...previous,
            [name]: value,
            ...(name === "class_id" ? { section_id: "" } : {}),
        }));
    };

    const availableSections = useMemo(() => {
        if (!filters.class_id) return options.sections;

        return options.sections.filter(
            (section) =>
                section.class_id === filters.class_id ||
                section.class_code === selectedClass?.class_code
        );
    }, [
        options.sections,
        filters.class_id,
        selectedClass,
    ]);

    const openPaymentModal = (fee) => {
        setSelectedFee(fee);

        setPaymentForm({
            amount: fee.due_amount ?? "",
            payment_method: "cash",
            payment_date: new Date().toISOString().slice(0, 10),
            transaction_id: "",
            remarks: "",
        });

        document.getElementById("fee-payment-modal")?.showModal();
    };

    const closePaymentModal = () => {
        document.getElementById("fee-payment-modal")?.close();
        setSelectedFee(null);
    };

    const handlePaymentChange = (event) => {
        const { name, value } = event.target;

        setPaymentForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handlePaymentSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFee) return;

        const amount = Number(paymentForm.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            setError("Enter a valid payment amount.");
            return;
        }

        if (amount > Number(selectedFee.due_amount)) {
            setError("Payment cannot exceed the outstanding due amount.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            await recordStudentFeePayment({
                fee_id: selectedFee._id,
                student_id: selectedFee.student_id,
                amount,
                payment_method: paymentForm.payment_method,
                payment_date: paymentForm.payment_date,
                transaction_id: paymentForm.transaction_id.trim(),
                remarks: paymentForm.remarks.trim(),
            });

            closePaymentModal();
            setRefreshKey((previous) => previous + 1);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to record payment."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-6">

            {/* Page heading */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Student Fee Management
                    </h1>
                    <p className="text-sm text-base-content/60">
                        Manage student fees, payments, and outstanding dues.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setRefreshKey((previous) => previous + 1)}
                >
                    ↻ Refresh
                </button>
            </div>

            {/* Error message */}
            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                    <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={() => setError("")}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <SummaryCard
                    title="Total Fees"
                    value={formatCurrency(summary.total_fees)}
                    icon="📋"
                />

                <SummaryCard
                    title="Collected"
                    value={formatCurrency(summary.total_collected)}
                    icon="💰"
                    color="text-success"
                />

                <SummaryCard
                    title="Outstanding Due"
                    value={formatCurrency(summary.total_due)}
                    icon="⚠️"
                    color="text-error"
                />

                <SummaryCard
                    title="Students"
                    value={summary.total_students || 0}
                    icon="👨‍🎓"
                />

            </div>

            {/* Filters */}
            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                    <h2 className="card-title text-lg">
                        Filter Fee Records
                    </h2>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">

                        <select
                            className="select select-bordered w-full"
                            name="academic_year"
                            value={filters.academic_year}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Academic Years</option>

                            {options.academic_years.map((year) => (
                                <option
                                    key={year}
                                    value={year}
                                >
                                    {year}
                                </option>
                            ))}
                        </select>

                        <select
                            className="select select-bordered w-full"
                            name="class_id"
                            value={filters.class_id}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Classes</option>

                            {options.classes.map((item) => (
                                <option
                                    key={item._id}
                                    value={item._id}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <select
                            className="select select-bordered w-full"
                            name="section_id"
                            value={filters.section_id}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Sections</option>

                            {availableSections.map((item) => (
                                <option
                                    key={item._id}
                                    value={item._id}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <select
                            className="select select-bordered w-full"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Payment Status</option>
                            <option value="paid">Paid</option>
                            <option value="partial">Partial</option>
                            <option value="due">Due</option>
                        </select>

                        <input
                            type="search"
                            className="input input-bordered w-full"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search student..."
                        />

                    </div>
                </div>
            </div>

            {/* Fee records table */}
            <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-0">

                    <div className="flex items-center justify-between p-5">
                        <h2 className="card-title text-lg">
                            Student Fee Records
                        </h2>

                        <span className="badge badge-neutral">
                            {fees.length} records
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table table-zebra">

                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Class</th>
                                    <th>Fee Type</th>
                                    <th>Total Fee</th>
                                    <th>Paid</th>
                                    <th>Due</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="py-10 text-center">
                                            <span className="loading loading-spinner loading-lg" />
                                        </td>
                                    </tr>
                                ) : fees.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="py-10 text-center text-base-content/60"
                                        >
                                            No fee records found.
                                        </td>
                                    </tr>
                                ) : (
                                    fees.map((fee) => (
                                        <tr key={fee._id}>

                                            <td>
                                                <div className="font-semibold">
                                                    {fee.student_name}
                                                </div>
                                                <div className="text-xs text-base-content/60">
                                                    {fee.student_id}
                                                </div>
                                            </td>

                                            <td>
                                                {fee.class_name || "-"}
                                                <div className="text-xs text-base-content/60">
                                                    Section: {fee.section_name || "-"}
                                                </div>
                                            </td>

                                            <td>{fee.fee_type || fee.fee_name || "-"}</td>

                                            <td>{formatCurrency(fee.total_amount)}</td>

                                            <td className="text-success">
                                                {formatCurrency(fee.paid_amount)}
                                            </td>

                                            <td className="font-semibold text-error">
                                                {formatCurrency(fee.due_amount)}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getStatusClass(fee.status)}`}
                                                >
                                                    {fee.status || "Unknown"}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary"
                                                    disabled={Number(fee.due_amount) <= 0}
                                                    onClick={() => openPaymentModal(fee)}
                                                >
                                                    Record Payment
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

            {/* Payment modal */}
            <dialog
                id="fee-payment-modal"
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box">

                    <h3 className="text-xl font-bold">
                        Record Student Payment
                    </h3>

                    {selectedFee && (
                        <div className="mt-3 rounded-lg bg-base-200 p-3 text-sm">
                            <p>
                                <strong>Student:</strong>{" "}
                                {selectedFee.student_name}
                            </p>
                            <p>
                                <strong>Outstanding Due:</strong>{" "}
                                {formatCurrency(selectedFee.due_amount)}
                            </p>
                        </div>
                    )}

                    <form
                        onSubmit={handlePaymentSubmit}
                        className="mt-5 space-y-4"
                    >

                        <div>
                            <label className="label">
                                <span className="label-text">Payment Amount (৳)</span>
                            </label>

                            <input
                                type="number"
                                name="amount"
                                min="0.01"
                                step="0.01"
                                max={selectedFee?.due_amount}
                                className="input input-bordered w-full"
                                value={paymentForm.amount}
                                onChange={handlePaymentChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Payment Method</span>
                            </label>

                            <select
                                name="payment_method"
                                className="select select-bordered w-full"
                                value={paymentForm.payment_method}
                                onChange={handlePaymentChange}
                            >
                                <option value="cash">Cash</option>
                                <option value="bkash">bKash</option>
                                <option value="nagad">Nagad</option>
                                <option value="bank">Bank Transfer</option>
                                <option value="online">Online Payment</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Payment Date</span>
                            </label>

                            <input
                                type="date"
                                name="payment_date"
                                className="input input-bordered w-full"
                                value={paymentForm.payment_date}
                                onChange={handlePaymentChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Transaction ID (Optional)
                                </span>
                            </label>

                            <input
                                type="text"
                                name="transaction_id"
                                className="input input-bordered w-full"
                                value={paymentForm.transaction_id}
                                onChange={handlePaymentChange}
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Remarks</span>
                            </label>

                            <textarea
                                name="remarks"
                                className="textarea textarea-bordered w-full"
                                value={paymentForm.remarks}
                                onChange={handlePaymentChange}
                                rows={2}
                            />
                        </div>

                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={closePaymentModal}
                                disabled={submitting}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <span className="loading loading-spinner loading-sm" />
                                ) : (
                                    "Save Payment"
                                )}
                            </button>
                        </div>

                    </form>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button aria-label="Close modal">close</button>
                </form>
            </dialog>

        </div>
    );
}

function SummaryCard({ title, value, icon, color = "" }) {
    return (
        <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-base-content/60">
                        {title}
                    </p>
                    <span className="text-2xl">{icon}</span>
                </div>

                <p className={`text-2xl font-bold ${color}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}