import { Link } from "react-router-dom";
import { XCircle, Wallet } from "lucide-react";

export default function ParentPaymentCancel() {
    return (
        <div className="mx-auto max-w-xl px-4 py-12">
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body items-center text-center">
                    <XCircle
                        size={64}
                        className="text-warning"
                    />

                    <h2 className="text-2xl font-bold">
                        Payment Cancelled
                    </h2>

                    <p className="text-base-content/60">
                        You cancelled the Stripe Checkout process.
                        No payment has been confirmed by Smart School.
                    </p>

                    <div className="alert alert-info mt-4 text-left">
                        <Wallet size={20} />
                        <span>
                            Your outstanding fee remains unchanged.
                            You can try again whenever you are ready.
                        </span>
                    </div>

                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link
                            to="/parent/fees-due"
                            className="btn btn-primary"
                        >
                            Return to Due Fees
                        </Link>

                        <Link
                            to="/parent/fees-dashboard"
                            className="btn btn-outline"
                        >
                            Fee Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}