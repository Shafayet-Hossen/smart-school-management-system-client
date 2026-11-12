
const PaymentMethodBadge = ({ method }) => {
  const normalizedMethod = String(method || "")
    .trim()
    .toLowerCase();

  const methodConfig = {
    cash: {
      label: "Cash",
      className: "badge-success",
    },
    bkash: {
      label: "bKash",
      className: "badge-secondary",
    },
    nagad: {
      label: "Nagad",
      className: "badge-warning",
    },
    rocket: {
      label: "Rocket",
      className: "badge-primary",
    },
    bank: {
      label: "Bank Transfer",
      className: "badge-info",
    },
    bank_transfer: {
      label: "Bank Transfer",
      className: "badge-info",
    },
    card: {
      label: "Card",
      className: "badge-accent",
    },
    online: {
      label: "Online",
      className: "badge-primary",
    },
  };

  const config = methodConfig[normalizedMethod] || {
    label: normalizedMethod
      ? normalizedMethod.replace(/_/g, " ").replace(/\b\w/g, (char) =>
          char.toUpperCase()
        )
      : "Unknown",
    className: "badge-ghost",
  };

  return (
    <span
      className={`badge badge-outline ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default PaymentMethodBadge;
