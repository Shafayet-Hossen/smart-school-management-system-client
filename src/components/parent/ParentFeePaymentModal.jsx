import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    X,
    CreditCard,
    ShieldCheck,
    Wallet,
} from "lucide-react";

import {
    createParentCheckoutSession,
} from "../../services/parentFeeService.js";

const ParentFeePaymentModal = ({
    fee,
    isOpen,
    onClose,
}) => {
    const [paymentAmount, setPaymentAmount] = useState("");

    const dueAmount = Number(fee?.due_amount || 0);

    useEffect(() => {
        if (isOpen && fee) {
            setPaymentAmount(String(dueAmount));
        }
    }, [isOpen, fee, dueAmount]);

    const paymentMutation = useMutation({
        mutationFn: createParentCheckoutSession,

        onSuccess: (data) => {
            if (!data?.success || !data?.checkoutUrl) {
                throw new Error(
                    data?.message || "Unable to create Stripe Checkout session."
                );
            }

            window.location.assign(data.checkoutUrl);
        },
    });

    if (!isOpen || !fee) {
        return null;
    }

    const amount = Number(paymentAmount);
    const isValidAmount =
        Number.isFinite(amount) &&
        amount > 0 &&
        amount <= dueAmount &&
        Number.isInteger(amount * 100);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!isValidAmount || paymentMutation.isPending) {
            return;
        }

        paymentMutation.mutate({
            feeId: fee._id,
            amount,
        });
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold">
                            Pay Fee
                        </h3>

                        <p className="mt-1 text-sm text-base-content/60">
                            Complete your fee payment securely.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={paymentMutation.isPending}
                        className="btn btn-sm btn-circle btn-ghost"
                        aria-label="Close payment modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mt-5 rounded-xl bg-base-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-3">
                            <Wallet className="text-primary" size={22} />
                        </div>

                        <div>
                            <p className="font-semibold">
                                {fee.category_name || "Fee"}
                            </p>

                            <p className="text-sm text-base-content/60">
                                {fee.academic_year || "Academic year"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-xs text-base-content/60">
                                Total amount
                            </p>

                            <p className="font-semibold">
                                ৳{Number(fee.amount || 0).toLocaleString("en-BD")}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-base-content/60">
                                Already paid
                            </p>

                            <p className="font-semibold text-success">
                                ৳{Number(fee.paid_amount || 0).toLocaleString("en-BD")}
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 border-t border-base-300 pt-3">
                        <p className="text-sm text-base-content/60">
                            Outstanding balance
                        </p>

                        <p className="text-2xl font-bold text-error">
                            ৳{dueAmount.toLocaleString("en-BD")}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">
                                Payment amount (BDT)
                            </span>
                        </label>

                        <input
                            type="number"
                            min="0.01"
                            max={dueAmount}
                            step="0.01"
                            value={paymentAmount}
                            onChange={(event) =>
                                setPaymentAmount(event.target.value)
                            }
                            className="input input-bordered w-full"
                            placeholder="Enter payment amount"
                            required
                        />

                        <label className="label">
                            <span className="label-text-alt text-base-content/60">
                                Maximum payable: ৳
                                {dueAmount.toLocaleString("en-BD")}
                            </span>
                        </label>
                    </div>

                    <button
                        type="button"
                        onClick={() => setPaymentAmount(String(dueAmount))}
                        className="btn btn-sm btn-outline"
                    >
                        Pay full outstanding amount
                    </button>

                    <div className="alert alert-info text-sm">
                        <ShieldCheck size={20} />

                        <span>
                            You will be redirected to the school's
                            secure Stripe Checkout page.
                        </span>
                    </div>

                    {paymentMutation.isError && (
                        <div className="alert alert-error text-sm">
                            {paymentMutation.error?.response?.data?.message ||
                                paymentMutation.error?.message ||
                                "Unable to start payment. Please try again."}
                        </div>
                    )}

                    <div className="modal-action">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={paymentMutation.isPending}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                !isValidAmount ||
                                paymentMutation.isPending
                            }
                            className="btn btn-primary"
                        >
                            {paymentMutation.isPending ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />
                                    Connecting to Stripe...
                                </>
                            ) : (
                                <>
                                    <CreditCard size={18} />
                                    Pay ৳{isValidAmount
                                        ? amount.toLocaleString("en-BD")
                                        : "0"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <button
                type="button"
                className="modal-backdrop"
                onClick={paymentMutation.isPending ? undefined : onClose}
                aria-label="Close payment modal"
            />
        </div>
    );
};

export default ParentFeePaymentModal;