
const FeeStatusBadge = ({ status }) => {
  const normalizedStatus = String(status || "").toLowerCase();

  const statusStyles = {
    paid: "badge-success",
    unpaid: "badge-error",
    partial: "badge-warning",
    partially_paid: "badge-warning",
    overdue: "badge-error",
    completed: "badge-success",
    pending: "badge-warning",
    failed: "badge-error",
    refunded: "badge-info",
  };

  const labels = {
    partially_paid: "Partial",
  };

  return (
    <span
      className={`badge badge-sm capitalize ${
        statusStyles[normalizedStatus] || "badge-ghost"
      }`}
    >
      {labels[normalizedStatus] || normalizedStatus || "Unknown"}
    </span>
  );
};

export default FeeStatusBadge;
