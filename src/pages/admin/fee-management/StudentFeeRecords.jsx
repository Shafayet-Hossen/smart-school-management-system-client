
import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Wallet,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import api from "../../../services/api.js";

const initialSummary = {
  total_records: 0,
  total_amount: 0,
  total_paid: 0,
  total_due: 0,
};

const currency = (amount) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const statusStyles = {
  paid: "badge-success",
  partial: "badge-warning",
  unpaid: "badge-error",
  overdue: "badge-error",
};

const StudentFeeRecords = () => {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(initialSummary);

  const [search, setSearch] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/school-admin/fees/records", {
        params: {
          search,
          academic_year: academicYear,
          payment_status: paymentStatus,
          page,
          limit,
        },
      });

      const data = response.data;

      setRecords(data.records || []);
      setSummary(data.summary || initialSummary);
      setTotalPages(data.pagination?.total_pages || 1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load student fee records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, academicYear, paymentStatus]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    fetchRecords();
  };

  const handleReset = () => {
    setSearch("");
    setAcademicYear("");
    setPaymentStatus("");
    setPage(1);
  };

  const getStudentName = (record) =>
    record.student_name || "Unknown Student";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Student Fee Records
          </h1>
          <p className="text-sm text-base-content/60">
            View and manage assigned student fee records.
          </p>
        </div>

        <button
          onClick={fetchRecords}
          className="btn btn-outline btn-sm gap-2"
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Records"
          value={summary.total_records}
          icon={<Wallet />}
        />

        <SummaryCard
          title="Total Fees"
          value={currency(summary.total_amount)}
          icon={<Wallet />}
        />

        <SummaryCard
          title="Total Collected"
          value={currency(summary.total_paid)}
          icon={<CheckCircle />}
        />

        <SummaryCard
          title="Total Due"
          value={currency(summary.total_due)}
          icon={<AlertCircle />}
        />
      </div>

      {/* Filters */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
          >
            <div className="form-control xl:col-span-2">
              <label className="label">
                <span className="label-text">Search student</span>
              </label>

              <div className="join w-full">
                <input
                  type="text"
                  className="input input-bordered join-item w-full"
                  placeholder="Student name or student code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <button
                  type="submit"
                  className="btn btn-primary join-item"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Academic Year</span>
              </label>

              <select
                className="select select-bordered"
                value={academicYear}
                onChange={(e) => {
                  setAcademicYear(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Years</option>
                {Array.from({ length: 6 }, (_, index) => {
                  const year = new Date().getFullYear() - index;
                  return (
                    <option key={year} value={String(year)}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Payment Status</span>
              </label>

              <select
                className="select select-bordered"
                value={paymentStatus}
                onChange={(e) => {
                  setPaymentStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="flex gap-2 md:col-span-2 xl:col-span-4">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-ghost btn-sm"
              >
                Reset Filters
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Records Table */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-0">
          <div className="flex items-center justify-between p-5">
            <h2 className="text-lg font-semibold">
              Fee Records
            </h2>

            <span className="text-sm text-base-content/60">
              {summary.total_records} records
            </span>
          </div>

          {error && (
            <div className="alert alert-error mx-5 mb-4">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Fee Category</th>
                  <th>Academic Year</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="py-10 text-center">
                      <span className="loading loading-spinner loading-md" />
                      <p className="mt-2">Loading records...</p>
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="py-10 text-center text-base-content/60"
                    >
                      No student fee records found.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record._id}>
                      <td>
                        <div className="font-semibold">
                          {getStudentName(record)}
                        </div>
                        <div className="text-xs text-base-content/60">
                          {record.student_code || "-"}
                        </div>
                      </td>

                      <td>{record.category_name || "-"}</td>
                      <td>{record.academic_year || "-"}</td>
                      <td>{currency(record.amount)}</td>
                      <td className="text-success">
                        {currency(record.paid_amount)}
                      </td>
                      <td className="font-semibold text-error">
                        {currency(record.due_amount)}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            statusStyles[record.payment_status] ||
                            "badge-ghost"
                          }`}
                        >
                          {record.payment_status || "Unknown"}
                        </span>
                      </td>

                      <td>
                        {record.due_date
                          ? new Date(record.due_date).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          title="View details"
                          onClick={() => setSelectedRecord(record)}
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-base-300 p-4">
            <span className="text-sm text-base-content/60">
              Page {page} of {totalPages}
            </span>

            <div className="join">
              <button
                className="btn btn-sm join-item"
                disabled={page <= 1 || loading}
                onClick={() => setPage((prev) => prev - 1)}
              >
                <ChevronLeft size={16} />
              </button>

              <button className="btn btn-sm join-item btn-active">
                {page}
              </button>

              <button
                className="btn btn-sm join-item"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((prev) => prev + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">
                Fee Record Details
              </h3>

              <button
                className="btn btn-circle btn-ghost btn-sm"
                onClick={() => setSelectedRecord(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="divider" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Detail label="Student Name" value={selectedRecord.student_name} />
              <Detail label="Student Code" value={selectedRecord.student_code} />
              <Detail label="Class" value={selectedRecord.class_name} />
              <Detail label="Section" value={selectedRecord.section_name} />
              <Detail label="Fee Category" value={selectedRecord.category_name} />
              <Detail label="Academic Year" value={selectedRecord.academic_year} />
              <Detail label="Fee Amount" value={currency(selectedRecord.amount)} />
              <Detail label="Paid Amount" value={currency(selectedRecord.paid_amount)} />
              <Detail label="Due Amount" value={currency(selectedRecord.due_amount)} />
              <Detail
                label="Payment Status"
                value={selectedRecord.payment_status}
              />
              <Detail
                label="Due Date"
                value={
                  selectedRecord.due_date
                    ? new Date(selectedRecord.due_date).toLocaleDateString()
                    : "-"
                }
              />
              <Detail label="Frequency" value={selectedRecord.frequency} />
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => setSelectedRecord(null)}
              >
                Close
              </button>
            </div>
          </div>

          <button
            className="modal-backdrop"
            onClick={() => setSelectedRecord(null)}
            aria-label="Close modal"
          />
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ title, value, icon }) => (
  <div className="card border border-base-300 bg-base-100 shadow-sm">
    <div className="card-body flex-row items-center justify-between p-5">
      <div>
        <p className="text-sm text-base-content/60">{title}</p>
        <h3 className="mt-1 text-xl font-bold">{value}</h3>
      </div>
      <div className="rounded-xl bg-primary/10 p-3 text-primary">
        {icon}
      </div>
    </div>
  </div>
);

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs text-base-content/60">{label}</p>
    <p className="mt-1 font-medium">{value || "-"}</p>
  </div>
);

export default StudentFeeRecords;
