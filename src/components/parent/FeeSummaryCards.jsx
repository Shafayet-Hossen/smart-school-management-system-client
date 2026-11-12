
import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
};

const FeeSummaryCards = ({ summary = {} }) => {
  const totalFees = Number(summary.total_fees) || 0;
  const totalPaid = Number(summary.total_paid) || 0;
  const totalDue = Number(summary.total_due) || 0;

  const collectionPercentage =
    totalFees > 0
      ? Math.min(100, Math.max(0, (totalPaid / totalFees) * 100))
      : 0;

  const cards = [
    {
      title: "Total Fees",
      amount: totalFees,
      icon: Wallet,
      iconClass: "bg-primary/10 text-primary",
      description: "Total assigned fees",
    },
    {
      title: "Total Paid",
      amount: totalPaid,
      icon: CheckCircle2,
      iconClass: "bg-success/10 text-success",
      description: "Successfully paid amount",
    },
    {
      title: "Outstanding",
      amount: totalDue,
      icon: AlertCircle,
      iconClass: "bg-error/10 text-error",
      description: "Remaining fee amount",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="card border border-base-300 bg-base-100 shadow-sm"
            >
              <div className="card-body gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-base-content/60">
                      {card.title}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      {formatCurrency(card.amount)}
                    </h2>
                  </div>

                  <div
                    className={`rounded-xl p-3 ${card.iconClass}`}
                  >
                    <Icon size={24} />
                  </div>
                </div>

                <p className="text-xs text-base-content/60">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collection Progress */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={19} className="text-primary" />

              <h3 className="font-semibold">
                Fee Collection Progress
              </h3>
            </div>

            <span className="font-bold text-primary">
              {collectionPercentage.toFixed(1)}%
            </span>
          </div>

          <progress
            className="progress progress-primary w-full"
            value={collectionPercentage}
            max="100"
          />

          <div className="flex justify-between gap-3 text-xs text-base-content/60">
            <span>Paid: {formatCurrency(totalPaid)}</span>
            <span>Remaining: {formatCurrency(totalDue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeSummaryCards;
