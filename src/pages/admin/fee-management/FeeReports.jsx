
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Download,
  FileText,
  Wallet,
  TrendingUp,
  AlertCircle,
  Users,
  RefreshCw,
  Search,
} from "lucide-react";
import api from "../../../services/api.js";

const currentYear = new Date().getFullYear();

const initialFilters = {
  academic_year: `${currentYear}-${currentYear + 1}`,
  from_date: "",
  to_date: "",
  class_id: "",
};

const fetchFeeReports = async (filters) => {
  const { data } = await api.get("/school-admin/fees/reports", {
    params: filters,
  });

  return data;
};

const formatCurrency = (amount, currency = "BDT") => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
};

const downloadCSV = (filename, rows) => {
  if (!rows?.length) return;

  const headers = Object.keys(rows[0]);

  const escapeCSV = (value) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCSV(row[header])).join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

function SummaryCard({ title, value, description, icon: Icon }) {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-base-content/60">{title}</p>
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon size={21} />
          </div>
        </div>

        <h2 className="text-2xl font-bold">{value}</h2>

        <p className="text-xs text-base-content/60">
          {description}
        </p>
      </div>
    </div>
  );
}

function ProgressBar({ value, total }) {
  const percentage =
    total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-base-300">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default function FeeReports() {
  const [filters, setFilters] = useState(initialFilters);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["fee-reports", filters],
    queryFn: () => fetchFeeReports(filters),
  });

  const report = data?.report ?? {};
  const summary = report.summary ?? {};
  const categoryReports = report.category_reports ?? [];
  const paymentMethodReports = report.payment_method_reports ?? [];
  const monthlyReports = report.monthly_reports ?? [];
  const classes = data?.filters?.classes ?? [];

  const currency = summary.currency ?? "BDT";

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const handleExport = () => {
    const rows = categoryReports.map((item) => ({
      category: item.category_name,
      total_assigned: item.total_assigned,
      total_collected: item.total_collected,
      total_due: item.total_due,
      collection_percentage: item.collection_percentage,
    }));

    downloadCSV("fee-category-report.csv", rows);
  };

  const monthlyMaximum = useMemo(
    () =>
      Math.max(
        1,
        ...monthlyReports.map((item) =>
          Number(item.total_collected) || 0
        )
      ),
    [monthlyReports]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <AlertCircle size={20} />

        <span>
          {error?.response?.data?.message ||
            "Unable to load fee reports."}
        </span>

        <button className="btn btn-sm" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Fee Reports
          </h1>

          <p className="mt-1 text-sm text-base-content/60">
            Monitor fee collection, outstanding dues, and payment
            performance.
          </p>
        </div>

        <button
          className="btn btn-outline btn-primary"
          onClick={handleExport}
          disabled={!categoryReports.length}
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex items-center gap-2">
            <Search size={19} />
            <h2 className="font-semibold">Report Filters</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Academic Year</span>
              </label>

              <input
                type="text"
                name="academic_year"
                value={filters.academic_year}
                onChange={handleFilterChange}
                placeholder="2026-2027"
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">From Date</span>
              </label>

              <input
                type="date"
                name="from_date"
                value={filters.from_date}
                onChange={handleFilterChange}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">To Date</span>
              </label>

              <input
                type="date"
                name="to_date"
                value={filters.to_date}
                onChange={handleFilterChange}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Class</span>
              </label>

              <select
                name="class_id"
                value={filters.class_id}
                onChange={handleFilterChange}
                className="select select-bordered"
              >
                <option value="">All Classes</option>

                {classes.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="btn btn-ghost btn-sm"
              onClick={resetFilters}
            >
              Reset Filters
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
              />
              Refresh Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Assigned Fees"
          value={formatCurrency(summary.total_assigned, currency)}
          description={`${summary.total_students ?? 0} students`}
          icon={FileText}
        />

        <SummaryCard
          title="Total Collected"
          value={formatCurrency(summary.total_collected, currency)}
          description="Successfully collected payments"
          icon={Wallet}
        />

        <SummaryCard
          title="Outstanding Dues"
          value={formatCurrency(summary.total_due, currency)}
          description="Remaining payable amount"
          icon={AlertCircle}
        />

        <SummaryCard
          title="Collection Rate"
          value={`${Number(summary.collection_percentage ?? 0).toFixed(1)}%`}
          description="Collected against assigned fees"
          icon={TrendingUp}
        />
      </div>

      {/* Collection by Category */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Collection by Fee Category
              </h2>

              <p className="text-sm text-base-content/60">
                Compare assigned, collected, and outstanding amounts.
              </p>
            </div>
          </div>

          {categoryReports.length === 0 ? (
            <div className="py-10 text-center text-base-content/60">
              No category report data found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Assigned</th>
                    <th>Collected</th>
                    <th>Due</th>
                    <th>Collection Rate</th>
                  </tr>
                </thead>

                <tbody>
                  {categoryReports.map((item) => (
                    <tr key={item.category_id}>
                      <td className="font-medium">
                        {item.category_name}
                      </td>

                      <td>
                        {formatCurrency(item.total_assigned, currency)}
                      </td>

                      <td className="text-success">
                        {formatCurrency(item.total_collected, currency)}
                      </td>

                      <td className="text-error">
                        {formatCurrency(item.total_due, currency)}
                      </td>

                      <td className="min-w-40">
                        <div className="space-y-1">
                          <span className="text-sm">
                            {Number(item.collection_percentage ?? 0).toFixed(1)}%
                          </span>

                          <ProgressBar
                            value={Number(item.total_collected) || 0}
                            total={Number(item.total_assigned) || 0}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Collection */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <div>
            <h2 className="text-lg font-semibold">
              Monthly Collection Trend
            </h2>

            <p className="text-sm text-base-content/60">
              Monthly successful fee collections.
            </p>
          </div>

          {monthlyReports.length === 0 ? (
            <div className="py-10 text-center text-base-content/60">
              No monthly collection data found.
            </div>
          ) : (
            <div className="space-y-4">
              {monthlyReports.map((item) => {
                const amount = Number(item.total_collected) || 0;
                const width = (amount / monthlyMaximum) * 100;

                return (
                  <div
                    key={`${item.year}-${item.month}`}
                    className="space-y-1"
                  >
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="font-medium">
                        {item.month_name} {item.year}
                      </span>

                      <span>
                        {formatCurrency(amount, currency)}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-base-300">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payment Method Report */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="text-lg font-semibold">
            Collection by Payment Method
          </h2>

          {paymentMethodReports.length === 0 ? (
            <div className="py-8 text-center text-base-content/60">
              No payment method data found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Payment Method</th>
                    <th>Number of Payments</th>
                    <th>Total Collected</th>
                  </tr>
                </thead>

                <tbody>
                  {paymentMethodReports.map((item) => (
                    <tr key={item.payment_method}>
                      <td className="font-medium capitalize">
                        {String(item.payment_method || "").replace(
                          /_/g,
                          " "
                        )}
                      </td>

                      <td>{item.total_payments}</td>

                      <td className="font-semibold">
                        {formatCurrency(item.total_collected, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 text-sm text-base-content/60">
        <Users size={17} />
        <span>
          Report data is limited to your school's records.
        </span>
      </div>
    </div>
  );
}
