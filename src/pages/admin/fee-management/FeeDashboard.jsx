import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const StatCard = ({ title, value, description, icon, color }) => (
  <div className="card bg-base-100 shadow-sm border border-base-300">
    <div className="card-body">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-base-content/60">{title}</p>
          <h2 className="text-2xl font-bold mt-2">{value}</h2>
          <p className="text-xs text-base-content/60 mt-1">
            {description}
          </p>
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const quickActions = [
  {
    title: "Fee Categories",
    description: "Manage tuition and other fee categories",
    path: "/school-admin/fees-categories",
    icon: "📁",
  },
  {
    title: "Fee Structures",
    description: "Configure fees for classes and sections",
    path: "/school-admin/fees-structures",
    icon: "🏗️",
  },
  {
    title: "Assign Fees",
    description: "Assign fees to students",
    path: "/school-admin/fees-assign",
    icon: "📝",
  },
  {
    title: "Collect Payment",
    description: "Record a student's fee payment",
    path: "/school-admin/fees-collect",
    icon: "💰",
  },
  {
    title: "Outstanding Dues",
    description: "View unpaid and partially paid fees",
    path: "/school-admin/fees-due",
    icon: "⏳",
  },
  {
    title: "Fee Reports",
    description: "Review fee collection reports",
    path: "/school-admin/fees-reports",
    icon: "📊",
  },
];

const FeeDashboard = () => {
  const [summary, setSummary] = useState({
    total_fees: 0,
    total_collected: 0,
    total_due: 0,
    total_students: 0,
  });

  const [recentFees, setRecentFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [summaryResponse, feesResponse] = await Promise.all([
          api.get("/school-admin/fees/summary"),
          api.get("/school-admin/fees", {
            params: { limit: 10 },
          }),
        ]);

        if (!isMounted) return;

        setSummary({
          total_fees:
            summaryResponse.data?.summary?.total_fees ?? 0,
          total_collected:
            summaryResponse.data?.summary?.total_collected ?? 0,
          total_due:
            summaryResponse.data?.summary?.total_due ?? 0,
          total_students:
            summaryResponse.data?.summary?.total_students ?? 0,
        });

        setRecentFees(
          Array.isArray(feesResponse.data?.fees)
            ? feesResponse.data.fees.slice(0, 10)
            : []
        );
      } catch (err) {
        if (!isMounted) return;

        setError(
          err.response?.data?.message ||
            "Unable to load fee dashboard data."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const collectionPercentage =
    Number(summary.total_fees) > 0
      ? Math.min(
          100,
          (Number(summary.total_collected) /
            Number(summary.total_fees)) *
            100
        )
      : 0;

  const getStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "paid":
        return "badge-success";
      case "partial":
      case "partially_paid":
        return "badge-warning";
      case "unpaid":
      case "pending":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            Fee Management Dashboard
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Monitor fee collection, student payments, and outstanding dues.
          </p>
        </div>

        <Link
          to="/school-admin/fees-due"
          className="btn btn-primary"
        >
          + Collect Payment
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Fees"
          value={formatCurrency(summary.total_fees)}
          description="Total assigned fee amount"
          icon="📋"
          color="bg-blue-100 text-blue-700"
        />

        <StatCard
          title="Total Collected"
          value={formatCurrency(summary.total_collected)}
          description="Successfully collected payments"
          icon="💰"
          color="bg-green-100 text-green-700"
        />

        <StatCard
          title="Outstanding Dues"
          value={formatCurrency(summary.total_due)}
          description="Remaining unpaid amount"
          icon="⏳"
          color="bg-orange-100 text-orange-700"
        />

        <StatCard
          title="Students"
          value={Number(summary.total_students).toLocaleString()}
          description="Students with assigned fees"
          icon="👨‍🎓"
          color="bg-purple-100 text-purple-700"
        />
      </div>

      {/* Collection Progress */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center gap-3">
            <div>
              <h2 className="card-title">Fee Collection Progress</h2>
              <p className="text-sm text-base-content/60">
                Collected amount compared with total assigned fees
              </p>
            </div>

            <span className="text-xl font-bold text-primary">
              {collectionPercentage.toFixed(1)}%
            </span>
          </div>

          <progress
            className="progress progress-primary w-full mt-3"
            value={collectionPercentage}
            max="100"
          />

          <div className="flex justify-between text-sm mt-2">
            <span>
              Collected: {formatCurrency(summary.total_collected)}
            </span>
            <span>
              Total: {formatCurrency(summary.total_fees)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="card-body flex-row items-center gap-4">
                <div className="text-3xl">{action.icon}</div>

                <div>
                  <h3 className="font-semibold">
                    {action.title}
                  </h3>
                  <p className="text-xs text-base-content/60 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Fee Records */}
      <section className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="card-title">Recent Student Fee Records</h2>
              <p className="text-sm text-base-content/60">
                Latest fee records from your school
              </p>
            </div>

            <Link
              to="/student-fees/records"
              className="btn btn-outline btn-sm"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Fee</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentFees.length > 0 ? (
                  recentFees.map((fee) => (
                    <tr key={fee._id}>
                      <td>
                        <div className="font-medium">
                          {fee.student_name || "N/A"}
                        </div>
                        <div className="text-xs text-base-content/60">
                          {fee.student_id || ""}
                        </div>
                      </td>

                      <td>
                        {fee.class_name || "N/A"}
                        {fee.section_name
                          ? ` - ${fee.section_name}`
                          : ""}
                      </td>

                      <td>
                        {fee.fee_name || fee.fee_type || "N/A"}
                      </td>

                      <td>{formatCurrency(fee.total_amount)}</td>
                      <td className="text-success">
                        {formatCurrency(fee.paid_amount)}
                      </td>
                      <td className="text-error">
                        {formatCurrency(fee.due_amount)}
                      </td>

                      <td>
                        <span
                          className={`badge ${getStatusClass(
                            fee.status
                          )}`}
                        >
                          {fee.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-8 text-base-content/60"
                    >
                      No fee records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeeDashboard;