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
    month: "long",
    year: "numeric",
  });
};

const escapeHtml = (value) =>
  String(value ?? "—").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

const ReceiptCard = ({ receipt }) => {
  const receiptNumber =
    receipt.receipt_number ||
    receipt.transaction_reference ||
    receipt._id;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=800,height=700");

    if (!printWindow) {
      alert("Please allow pop-ups to print the receipt.");
      return;
    }

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fee Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 35px;
              color: #222;
            }
            .receipt {
              max-width: 650px;
              margin: auto;
              border: 1px solid #ddd;
              padding: 30px;
            }
            h1, h2 { text-align: center; }
            .row {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .amount {
              font-size: 22px;
              font-weight: bold;
              text-align: right;
              margin-top: 25px;
            }
            .status {
              text-align: center;
              color: #15803d;
              font-weight: bold;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <h1>Fee Payment Receipt</h1>
            <h2>${escapeHtml(receipt.school_name || "School Management System")}</h2>

            <div class="row">
              <strong>Receipt Number</strong>
              <span>${escapeHtml(receiptNumber)}</span>
            </div>
            <div class="row">
              <strong>Student</strong>
              <span>${escapeHtml(receipt.student_name)}</span>
            </div>
            <div class="row">
              <strong>Student ID</strong>
              <span>${escapeHtml(receipt.student_code)}</span>
            </div>
            <div class="row">
              <strong>Class</strong>
              <span>${escapeHtml(receipt.class_name)}</span>
            </div>
            <div class="row">
              <strong>Fee Category</strong>
              <span>${escapeHtml(receipt.category_name)}</span>
            </div>
            <div class="row">
              <strong>Academic Year</strong>
              <span>${escapeHtml(receipt.academic_year)}</span>
            </div>
            <div class="row">
              <strong>Billing Period</strong>
              <span>${escapeHtml(receipt.billing_period)}</span>
            </div>
            <div class="row">
              <strong>Payment Method</strong>
              <span>${escapeHtml(receipt.payment_method)}</span>
            </div>
            <div class="row">
              <strong>Transaction Reference</strong>
              <span>${escapeHtml(receipt.transaction_reference)}</span>
            </div>
            <div class="row">
              <strong>Payment Date</strong>
              <span>${escapeHtml(formatDate(receipt.collected_at || receipt.created_at))}</span>
            </div>

            <div class="amount">
              Paid: ${escapeHtml(formatCurrency(receipt.amount))}
            </div>

            <div class="status">PAYMENT VERIFIED</div>
            <p style="text-align:center;margin-top:35px;">
              Thank you.
            </p>
          </div>
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-base-content">
            {receipt.category_name || "Fee Payment"}
          </h3>

          <p className="mt-1 text-sm text-base-content/60">
            {receipt.student_name || "Student"} ·{" "}
            {receipt.student_code || "—"}
          </p>
        </div>

        <span className="badge badge-success badge-outline">
          Verified
        </span>
      </div>

      <div className="my-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-base-content/60">Receipt Number</p>
          <p className="font-medium break-all">{receiptNumber || "—"}</p>
        </div>

        <div>
          <p className="text-base-content/60">Payment Date</p>
          <p className="font-medium">
            {formatDate(receipt.collected_at || receipt.created_at)}
          </p>
        </div>

        <div>
          <p className="text-base-content/60">Academic Year</p>
          <p className="font-medium">{receipt.academic_year || "—"}</p>
        </div>

        <div>
          <p className="text-base-content/60">Payment Method</p>
          <p className="font-medium">
            {receipt.payment_method || "—"}
          </p>
        </div>

        <div>
          <p className="text-base-content/60">Transaction Reference</p>
          <p className="font-medium break-all">
            {receipt.transaction_reference || "—"}
          </p>
        </div>

        <div>
          <p className="text-base-content/60">Billing Period</p>
          <p className="font-medium">{receipt.billing_period || "—"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-base-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-base-content/60">Paid Amount</p>
          <p className="text-xl font-bold text-success">
            {formatCurrency(receipt.amount)}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="btn btn-primary btn-sm"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
};

export default ReceiptCard;