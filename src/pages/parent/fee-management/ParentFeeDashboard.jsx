
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import {
  RefreshCw,
  Receipt,
  AlertCircle,
  History,
  ArrowRight,
  CalendarDays,
  CreditCard,
} from "lucide-react";

import {
  getParentFeeSummary,
  getParentChildren,
  getParentFees,
  getParentFeePayments,
} from "../../../services/parentFeeService.js";

import FeeSummaryCards from "../../../components/parent/FeeSummaryCards.jsx";

import ChildSelector from "../../../components/parent/ChildSelector.jsx";

import FeeStatusBadge from "../../../components/parent/FeeStatusBadge.jsx";

// Format currency
const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
};

// Format date
const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

// Extract arrays from API responses
const extractArray = (data, keys) => {
  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  return [];
};

const ParentFeeDashboard = () => {
  const [selectedChild, setSelectedChild] = useState("all");

  // Query 1: Children
  const {
    data: childrenData,
    isLoading: childrenLoading,
    isError: childrenError,
    refetch: refetchChildren,
  } = useQuery({
    queryKey: ["parent-fee-children"],
    queryFn: getParentChildren,
  });

  // Query 2: Fee summary
  const {
    data: summaryData,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ["parent-fee-summary", selectedChild],
    queryFn: () =>
      getParentFeeSummary(
        selectedChild === "all"
          ? {}
          : { student_id: selectedChild }
      ),
  });

  // Query 3: Recent fee records
  const {
    data: feesData,
    isLoading: feesLoading,
    isError: feesError,
    refetch: refetchFees,
  } = useQuery({
    queryKey: ["parent-fees-recent", selectedChild],
    queryFn: () =>
      getParentFees({
        ...(selectedChild !== "all" && {
          student_id: selectedChild,
        }),
        page: 1,
        limit: 5,
      }),
  });

  // Query 4: Recent payments
  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    isError: paymentsError,
    refetch: refetchPayments,
  } = useQuery({
    queryKey: ["parent-fee-payments-recent", selectedChild],
    queryFn: () =>
      getParentFeePayments({
        ...(selectedChild !== "all" && {
          student_id: selectedChild,
        }),
        page: 1,
        limit: 5,
      }),
  });

  const children = extractArray(childrenData, ["children"]);

  const feeRecords = extractArray(feesData, [
    "records",
    "fees",
  ]);

  const payments = extractArray(paymentsData, [
    "payments",
    "records",
  ]);

  const summary = summaryData?.summary || {};

  const isRefreshing =
    summaryLoading ||
    childrenLoading ||
    feesLoading ||
    paymentsLoading;

  // Refresh all dashboard data
  const handleRefresh = () => {
    refetchChildren();
    refetchSummary();
    refetchFees();
    refetchPayments();
  };

  // Initial loading
  if (childrenLoading && !childrenData) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Children loading error
  if (childrenError) {
    return (
      <div className="alert alert-error">
        <AlertCircle size={20} />

        <span>
          Unable to load your children's information.
        </span>

        <button
          type="button"
          className="btn btn-sm"
          onClick={handleRefresh}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Dashboard Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">
            Fee Overview
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            Monitor your children's fees and payment activities.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="btn btn-outline btn-sm"
        >
          <RefreshCw
            size={16}
            className={isRefreshing ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* Child Selector */}
      <div className="rounded-xl border border-base-300 bg-base-100 p-4">
        <ChildSelector
          children={children}
          selectedChild={selectedChild}
          onChange={setSelectedChild}
          disabled={childrenLoading}
        />

        {children.length === 0 && (
          <p className="mt-2 text-xs text-base-content/60">
            No linked children were found.
          </p>
        )}
      </div>

      {/* Fee Summary */}
      {summaryError ? (
        <div className="alert alert-warning">
          <AlertCircle size={18} />

          <span>Unable to load fee summary.</span>

          <button
            type="button"
            className="btn btn-sm"
            onClick={refetchSummary}
          >
            Retry
          </button>
        </div>
      ) : summaryLoading && !summaryData ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : (
        <FeeSummaryCards summary={summary} />
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <Link
          to="/parent/fees/records"
          className="card border border-base-300 bg-base-100 shadow-sm transition hover:shadow-md"
        >
          <div className="card-body flex-row items-center justify-between">
            <div>
              <h3 className="font-semibold">
                Fee Records
              </h3>

              <p className="mt-1 text-xs text-base-content/60">
                View all assigned fees
              </p>
            </div>

            <Receipt size={25} className="text-primary" />
          </div>
        </Link>

        <Link
          to="/parent/fees/due"
          className="card border border-base-300 bg-base-100 shadow-sm transition hover:shadow-md"
        >
          <div className="card-body flex-row items-center justify-between">
            <div>
              <h3 className="font-semibold">
                Due Fees
              </h3>

              <p className="mt-1 text-xs text-base-content/60">
                View outstanding fees
              </p>
            </div>

            <AlertCircle size={25} className="text-error" />
          </div>
        </Link>

        <Link
          to="/parent/fees/payments"
          className="card border border-base-300 bg-base-100 shadow-sm transition hover:shadow-md"
        >
          <div className="card-body flex-row items-center justify-between">
            <div>
              <h3 className="font-semibold">
                Payment History
              </h3>

              <p className="mt-1 text-xs text-base-content/60">
                View previous payments
              </p>
            </div>

            <History size={25} className="text-success" />
          </div>
        </Link>

      </div>

      {/* Recent Fee Records */}
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4">

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="card-title text-base">
                Recent Fee Records
              </h3>

              <p className="text-xs text-base-content/60">
                Latest assigned fee records
              </p>
            </div>

            <Link
              to="/parent/fees/records"
              className="btn btn-ghost btn-sm text-primary"
            >
              View All
              <ArrowRight size={15} />
            </Link>
          </div>

          {feesLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : feesError ? (
            <div className="alert alert-warning">
              Unable to load fee records.

              <button
                type="button"
                className="btn btn-sm"
                onClick={refetchFees}
              >
                Retry
              </button>
            </div>
          ) : feeRecords.length === 0 ? (
            <div className="py-8 text-center">
              <Receipt
                size={35}
                className="mx-auto text-base-content/30"
              />

              <p className="mt-3 font-medium">
                No fee records found
              </p>

              <p className="mt-1 text-sm text-base-content/60">
                Fee records will appear here when available.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Fee Category</th>
                    <th>Student</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Due Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {feeRecords.map((fee) => (
                    <tr key={fee._id}>
                      <td className="font-medium">
                        {fee.category_name || "N/A"}
                      </td>

                      <td>
                        {fee.student_name || "N/A"}
                      </td>

                      <td>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <CalendarDays size={14} />

                          {formatDate(fee.due_date)}
                        </span>
                      </td>

                      <td>
                        {formatCurrency(fee.amount)}
                      </td>

                      <td className="font-medium">
                        {formatCurrency(fee.due_amount)}
                      </td>

                      <td>
                        <FeeStatusBadge
                          status={fee.payment_status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </section>

      {/* Recent Payments */}
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4">

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="card-title text-base">
                Recent Payments
              </h3>

              <p className="text-xs text-base-content/60">
                Latest payment transactions
              </p>
            </div>

            <Link
              to="/parent/fees/payments"
              className="btn btn-ghost btn-sm text-primary"
            >
              View All
              <ArrowRight size={15} />
            </Link>
          </div>

          {paymentsLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : paymentsError ? (
            <div className="alert alert-warning">
              Unable to load payment history.

              <button
                type="button"
                className="btn btn-sm"
                onClick={refetchPayments}
              >
                Retry
              </button>
            </div>
          ) : payments.length === 0 ? (
            <div className="py-8 text-center">
              <CreditCard
                size={35}
                className="mx-auto text-base-content/30"
              />

              <p className="mt-3 font-medium">
                No payment history found
              </p>

              <p className="mt-1 text-sm text-base-content/60">
                Completed payment transactions will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Transaction Reference</th>
                    <th>Payment Date</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>
                        {payment.student_name || "N/A"}
                      </td>

                      <td>
                        {payment.transaction_reference || "N/A"}
                      </td>

                      <td className="whitespace-nowrap">
                        {formatDate(payment.collected_at)}
                      </td>

                      <td className="capitalize">
                        {payment.payment_method?.replaceAll(
                          "_",
                          " "
                        ) || "N/A"}
                      </td>

                      <td className="font-medium">
                        {formatCurrency(payment.amount)}
                      </td>

                      <td>
                        <FeeStatusBadge
                          status={payment.payment_status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default ParentFeeDashboard;
