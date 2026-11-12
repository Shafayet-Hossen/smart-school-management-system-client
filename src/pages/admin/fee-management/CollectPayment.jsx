
import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Wallet,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

import api from "../../../services/api";

const currency = (amount) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const initialPayment = {
  amount: "",
  payment_method: "cash",
  transaction_reference: "",
  notes: "",
};

const CollectPayment = () => {
  const [search, setSearch] = useState("");
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);

  const [payment, setPayment] = useState(initialPayment);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOutstandingFees = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/school-admin/fees/collect/options",
        {
          params: {
            search: searchValue,
            limit: 50,
          },
        }
      );

      setFees(response.data.outstandingFees || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load outstanding fee records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutstandingFees();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    setSelectedFee(null);
    setPayment(initialPayment);
    fetchOutstandingFees(search);
  };

  const handleSelectFee = (fee) => {
    setSelectedFee(fee);
    setPayment({
      ...initialPayment,
      amount: String(fee.due_amount || ""),
    });
    setError("");
    setSuccess("");
  };

  const handlePaymentChange = (event) => {
    const { name, value } = event.target;

    setPayment((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCollectPayment = async (event) => {
    event.preventDefault();

    if (!selectedFee) {
      setError("Please select a student fee record.");
      return;
    }

    const amount = Number(payment.amount);
    const dueAmount = Number(selectedFee.due_amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid payment amount.");
      return;
    }

    if (amount > dueAmount) {
      setError("Payment amount cannot exceed the outstanding balance.");
      return;
    }

    if (
      payment.payment_method !== "cash" &&
      !payment.transaction_reference.trim()
    ) {
      setError("Enter the transaction reference.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        "/school-admin/fees/collect",
        {
          student_fee_id: selectedFee._id,
          amount,
          payment_method: payment.payment_method,
          transaction_reference:
            payment.transaction_reference.trim(),
          notes: payment.notes.trim(),
        }
      );

      setSuccess(
        response.data.message ||
          "Payment collected successfully."
      );

      setSelectedFee(null);
      setPayment(initialPayment);
      await fetchOutstandingFees(search);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to collect payment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const remainingAmount = selectedFee
    ? Math.max(
        0,
        Number(selectedFee.due_amount || 0) -
          Number(payment.amount || 0)
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Collect Student Fee
          </h1>
          <p className="text-sm text-base-content/60">
            Find an outstanding fee record and record a payment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchOutstandingFees(search)}
          disabled={loading}
          className="btn btn-outline btn-sm gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={() => setError("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle size={20} />
          <span>{success}</span>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={() => setSuccess("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-lg">
            Find Student Fee
          </h2>

          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              className="input input-bordered flex-1"
              placeholder="Search by student name or student code..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Search size={18} />
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Outstanding Fee Records */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-0">
          <div className="flex items-center justify-between p-5">
            <div>
              <h2 className="text-lg font-semibold">
                Outstanding Fee Records
              </h2>
              <p className="text-sm text-base-content/60">
                Select a record to collect payment.
              </p>
            </div>

            <span className="badge badge-warning">
              {fees.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Fee Category</th>
                  <th>Class</th>
                  <th>Total Fee</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center">
                      <span className="loading loading-spinner loading-md" />
                      <p className="mt-2">Loading fee records...</p>
                    </td>
                  </tr>
                ) : fees.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-10 text-center text-base-content/60"
                    >
                      No outstanding fee records found.
                    </td>
                  </tr>
                ) : (
                  fees.map((fee) => (
                    <tr key={fee._id}>
                      <td>
                        <div className="font-semibold">
                          {fee.student_name || "Unknown"}
                        </div>
                        <div className="text-xs text-base-content/60">
                          {fee.student_code || "-"}
                        </div>
                      </td>

                      <td>{fee.category_name || "-"}</td>

                      <td>
                        {fee.class_name || "-"}
                        {fee.section_name
                          ? ` - ${fee.section_name}`
                          : ""}
                      </td>

                      <td>{currency(fee.amount)}</td>
                      <td className="text-success">
                        {currency(fee.paid_amount)}
                      </td>
                      <td className="font-semibold text-error">
                        {currency(fee.due_amount)}
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            selectedFee?._id === fee._id
                              ? "btn-primary"
                              : "btn-outline"
                          }`}
                          onClick={() => handleSelectFee(fee)}
                        >
                          Select
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

      {/* Selected Fee and Payment Form */}
      {selectedFee && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Student Fee Details */}
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-2">
                <User className="text-primary" />
                <h2 className="card-title text-lg">
                  Selected Fee Details
                </h2>
              </div>

              <div className="divider my-1" />

              <Detail
                label="Student Name"
                value={selectedFee.student_name}
              />

              <Detail
                label="Student Code"
                value={selectedFee.student_code}
              />

              <Detail
                label="Class"
                value={selectedFee.class_name}
              />

              <Detail
                label="Section"
                value={selectedFee.section_name}
              />

              <Detail
                label="Fee Category"
                value={selectedFee.category_name}
              />

              <Detail
                label="Academic Year"
                value={selectedFee.academic_year}
              />

              <div className="divider my-1" />

              <div className="grid grid-cols-3 gap-3">
                <AmountCard
                  label="Total"
                  amount={selectedFee.amount}
                />

                <AmountCard
                  label="Paid"
                  amount={selectedFee.paid_amount}
                  color="text-success"
                />

                <AmountCard
                  label="Due"
                  amount={selectedFee.due_amount}
                  color="text-error"
                />
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-2">
                <CreditCard className="text-primary" />
                <h2 className="card-title text-lg">
                  Payment Information
                </h2>
              </div>

              <div className="divider my-1" />

              <form
                onSubmit={handleCollectPayment}
                className="space-y-4"
              >
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Payment Amount (BDT)
                    </span>
                  </label>

                  <input
                    type="number"
                    name="amount"
                    min="0.01"
                    max={Number(selectedFee.due_amount)}
                    step="0.01"
                    className="input input-bordered"
                    value={payment.amount}
                    onChange={handlePaymentChange}
                    required
                  />

                  <label className="label">
                    <span className="label-text-alt">
                      Maximum payable: {currency(selectedFee.due_amount)}
                    </span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Payment Method
                    </span>
                  </label>

                  <select
                    name="payment_method"
                    className="select select-bordered"
                    value={payment.payment_method}
                    onChange={handlePaymentChange}
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">
                      Bank Transfer
                    </option>
                    <option value="mobile_banking">
                      Mobile Banking
                    </option>
                  </select>
                </div>

                {payment.payment_method !== "cash" && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Transaction Reference
                      </span>
                    </label>

                    <input
                      type="text"
                      name="transaction_reference"
                      className="input input-bordered"
                      placeholder="Enter transaction ID or reference"
                      value={payment.transaction_reference}
                      onChange={handlePaymentChange}
                      required
                    />
                  </div>
                )}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Notes (Optional)
                    </span>
                  </label>

                  <textarea
                    name="notes"
                    className="textarea textarea-bordered"
                    placeholder="Enter payment notes..."
                    rows={3}
                    value={payment.notes}
                    onChange={handlePaymentChange}
                  />
                </div>

                <div className="rounded-xl bg-base-200 p-4">
                  <div className="flex justify-between text-sm">
                    <span>Remaining after this payment</span>
                    <strong>{currency(remainingAmount)}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setSelectedFee(null);
                      setPayment(initialPayment);
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      submitting ||
                      !payment.amount ||
                      Number(payment.amount) <= 0
                    }
                  >
                    {submitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wallet size={18} />
                        Collect Payment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-2">
    <span className="text-sm text-base-content/60">{label}</span>
    <span className="text-right text-sm font-medium">
      {value || "-"}
    </span>
  </div>
);

const AmountCard = ({ label, amount, color = "" }) => (
  <div className="rounded-lg bg-base-200 p-3">
    <p className="text-xs text-base-content/60">{label}</p>
    <p className={`mt-1 text-sm font-bold ${color}`}>
      {currency(amount)}
    </p>
  </div>
);

export default CollectPayment;
