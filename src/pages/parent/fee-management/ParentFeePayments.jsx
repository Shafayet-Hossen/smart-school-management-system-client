import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  getParentChildren,
  getParentFeePayments,
} from "../../../services/parentFeeService.js";

import ChildSelector from "../../../components/parent/ChildSelector.jsx";
import FeePagination from "../../../components/parent/FeePagination.jsx";
import PaymentMethodBadge from "../../../components/parent/PaymentMethodBadge.jsx";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ParentFeePayments = () => {
  const [selectedChild, setSelectedChild] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch parent's children
  const {
    data: childrenData,
    isLoading: childrenLoading,
    isError: childrenError,
  } = useQuery({
    queryKey: ["parent-fee-children"],
    queryFn: getParentChildren,
  });

  const children = childrenData?.children || [];

  // Fetch payment history
  const {
    data: paymentData,
    isLoading: paymentsLoading,
    isError: paymentsError,
    error,
  } = useQuery({
    queryKey: ["parent-fee-payments", selectedChild, page],
    queryFn: () =>
      getParentFeePayments({
        ...(selectedChild !== "all"
          ? { student_id: selectedChild }
          : {}),
        page,
        limit,
      }),
    enabled: !childrenLoading && !childrenError,
    placeholderData: (previousData) => previousData,
  });

  const payments = paymentData?.payments || [];

  const pagination = paymentData?.pagination || {};

  const totalPages = pagination.totalPages || 1;

  const totalRecords =
    pagination.totalRecords ??
    pagination.total ??
    payments.length;

  const totalPaid = payments.reduce(
    (total, payment) => total + (Number(payment.amount) || 0),
    0
  );

  const handleChildChange = (childId) => {
    setSelectedChild(childId);
    setPage(1);
  };

  if (childrenLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (childrenError) {
    return (
      <div className="alert alert-error">
        Failed to load your children's information.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-bold text-base-content">
          Payment History
        </h2>

        <p className="mt-1 text-sm text-base-content/60">
          View your children's completed and verified fee payments.
        </p>
      </div>

      {/* Child filter */}
      <div className="flex flex-col gap-3 rounded-xl bg-base-100 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">Filter by child</h3>
          <p className="text-sm text-base-content/60">
            Select a child to view their payment history.
          </p>
        </div>

        <div className="w-full sm:max-w-xs">
          <ChildSelector
            children={children}
            selectedChild={selectedChild}
            onChange={handleChildChange}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-base-100 p-5 shadow-sm">
          <p className="text-sm text-base-content/60">
            Payments on this page
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            {payments.length}
          </h3>
        </div>

        <div className="rounded-xl bg-base-100 p-5 shadow-sm">
          <p className="text-sm text-base-content/60">
            Amount on this page
          </p>

          <h3 className="mt-2 text-2xl font-bold text-success">
            {formatCurrency(totalPaid)}
          </h3>
        </div>
      </div>

      {/* Payment table */}
      <div className="overflow-hidden rounded-xl bg-base-100 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-base-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">Payment Records</h3>
            <p className="text-sm text-base-content/60">
              {totalRecords} payment record(s) found
            </p>
          </div>
        </div>

        {paymentsLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : paymentsError ? (
          <div className="p-6 text-center text-error">
            {error?.response?.data?.message ||
              "Failed to load payment history."}
          </div>
        ) : payments.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium">No payment records found.</p>
            <p className="mt-1 text-sm text-base-content/60">
              Completed payments will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Fee Category</th>
                  <th>Academic Year</th>
                  <th>Billing Period</th>
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
                        {payment.student_name || "—"}
                      </div>
                      <div className="text-xs text-base-content/60">
                        {payment.student_code || "—"}
                      </div>
                    </td>

                    <td>{payment.category_name || "—"}</td>

                    <td>{payment.academic_year || "—"}</td>

                    <td>{payment.billing_period || "—"}</td>

                    <td className="font-semibold">
                      {formatCurrency(payment.amount)}
                    </td>

                    <td>
                      <PaymentMethodBadge
                        method={payment.payment_method}
                      />
                    </td>

                    <td>
                      <span className="text-sm">
                        {payment.transaction_reference || "—"}
                      </span>
                    </td>

                    <td>
                      {formatDate(
                        payment.collected_at || payment.created_at
                      )}
                    </td>

                    <td>
                      <span className="badge badge-success badge-outline">
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!paymentsLoading &&
          !paymentsError &&
          totalPages > 1 && (
            <div className="border-t border-base-200 p-4">
              <FeePagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default ParentFeePayments;