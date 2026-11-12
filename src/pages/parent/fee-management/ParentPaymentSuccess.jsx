import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import {
    CheckCircle2,
    Clock,
    RefreshCw,
    XCircle,
} from "lucide-react";

import {
    verifyParentCheckoutSession,
} from "../../../services/parentFeeService.js";

export default function ParentPaymentSuccess() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [checkAgain, setCheckAgain] = useState(0);

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["parent-payment-verification", sessionId, checkAgain],
        queryFn: () => verifyParentCheckoutSession(sessionId),
        enabled: Boolean(sessionId),
        retry: false,
        refetchOnWindowFocus: false,
    });

    const status = data?.payment_status;

    const isPaid = status === "completed" || status === "paid";
    const isPending = status === "pending" || status === "processing";

    const handleCheckAgain = async () => {
        setCheckAgain((previous) => previous + 1);
    };

    if (!sessionId) {
        return (
            <div className="mx-auto max-w-lg p-6">
                <div className="alert alert-error">
                    <XCircle />
                    <span>Payment session ID is missing.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-xl px-4 py-12">
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body items-center text-center">

                    {isLoading && (
                        <>
                            <span className="loading loading-spinner loading-lg text-primary" />
                            <h2 className="text-xl font-bold">
                                Verifying your payment
                            </h2>
                            <p className="text-sm text-base-content/60">
                                Please wait while we confirm your payment with Stripe.
                            </p>
                        </>
                    )}

                    {!isLoading && isPaid && (
                        <>
                            <CheckCircle2
                                size={64}
                                className="text-success"
                            />

                            <h2 className="text-2xl font-bold">
                                Payment Successful!
                            </h2>

                            <p className="text-base-content/60">
                                Your payment has been verified successfully.
                            </p>

                            {data?.payment && (
                                <div className="mt-4 w-full rounded-lg bg-base-200 p-4 text-left">
                                    <p className="text-sm text-base-content/60">
                                        Payment amount
                                    </p>

                                    <p className="text-xl font-bold">
                                        ৳{Number(
                                            data.payment.amount || 0
                                        ).toLocaleString("en-BD")}
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {!isLoading && isPending && (
                        <>
                            <Clock
                                size={64}
                                className="text-warning"
                            />

                            <h2 className="text-xl font-bold">
                                Payment is being processed
                            </h2>

                            <p className="text-sm text-base-content/60">
                                Your fee balance has not been updated yet.
                            </p>
                        </>
                    )}

                    {!isLoading && isError && (
                        <>
                            <XCircle
                                size={64}
                                className="text-error"
                            />

                            <h2 className="text-xl font-bold">
                                Unable to verify payment
                            </h2>

                            <p className="text-sm text-base-content/60">
                                {error?.response?.data?.message ||
                                    error?.message ||
                                    "Please try checking your payment status again."}
                            </p>
                        </>
                    )}

                    {!isLoading && !isPaid && !isPending && !isError && (
                        <>
                            <Clock
                                size={64}
                                className="text-warning"
                            />

                            <h2 className="text-xl font-bold">
                                Payment not confirmed
                            </h2>

                            <p className="text-sm text-base-content/60">
                                We could not confirm a successful payment.
                            </p>
                        </>
                    )}

                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        {!isPaid && (
                            <button
                                type="button"
                                onClick={handleCheckAgain}
                                disabled={isFetching}
                                className="btn btn-primary"
                            >
                                {isFetching ? (
                                    <span className="loading loading-spinner loading-sm" />
                                ) : (
                                    <RefreshCw size={17} />
                                )}
                                Check Payment Status
                            </button>
                        )}

                        <Link
                            to="/parent/fees-due"
                            className="btn btn-outline"
                        >
                            Back to Due Fees
                        </Link>

                        {isPaid && (
                            <Link
                                to="/parent/fees-payments"
                                className="btn btn-primary"
                            >
                                Payment History
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}