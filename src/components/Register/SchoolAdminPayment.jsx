
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRegistration } from "../../context/RegistrationContext.jsx";
import api from "../../services/api.js";

const SchoolAdminPayment = () => {
  const navigate = useNavigate();
  const { registrationData } = useRegistration();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const planSlug = registrationData?.subscription_plan_slug;

  const planName =
    registrationData?.subscription_plan_name ||
    (planSlug === "monthly"
      ? "Monthly Plan"
      : planSlug === "yearly"
        ? "Yearly Plan"
        : planSlug || "No plan selected");

  const schoolName = registrationData?.school_name || "Your School";

  const handlePayment = async () => {
    setError("");

    if (loading) return;

    if (registrationData?.role !== "school_admin") {
      setError("This payment page is only for School Admin registration.");
      return;
    }

    if (!planSlug) {
      setError("Please select a subscription plan first.");
      return;
    }

    const school = {
      school_name: registrationData?.school_name?.trim(),
      school_type: registrationData?.school_type,
      school_email: registrationData?.school_email?.trim(),
      school_phone: registrationData?.school_phone?.trim(),
      eiin: registrationData?.eiin?.trim(),
      division: registrationData?.division,
      district: registrationData?.district,
      upazila: registrationData?.upazila,
      address: registrationData?.address?.trim(),
      website: registrationData?.website?.trim(),
    };

    if (
      !school.school_name ||
      !school.school_email ||
      !school.school_phone
    ) {
      setError(
        "Required school information is missing. Please return to the school information step."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/payments/initiate", {
        subscription_plan_slug: planSlug,
        school,
      });

      const data = response.data;
      
      // console.log("Stripe Checkout initiation response:", data);

      if (!data?.success || !data?.payment_url) {
        throw new Error(
          data?.message || "Stripe did not return a Checkout URL."
        );
      }

      if (data.registration_id) {
        sessionStorage.setItem(
          "school_registration_id",
          data.registration_id
        );
      }

      window.location.assign(data.payment_url);
    } catch (err) {
      console.error("Stripe Checkout initialization failed:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (registrationData?.role !== "school_admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
        <div className="rounded-2xl bg-base-100 p-8 text-center shadow-lg">
          <h1 className="text-xl font-bold">Access restricted</h1>

          <p className="mt-3 text-sm text-base-content/60">
            This payment page is only for School Admin registration.
          </p>

          <button
            type="button"
            className="btn btn-primary mt-5"
            onClick={() => navigate("/register/role")}
          >
            Select Role
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-base-200 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
          <button
            type="button"
            onClick={() =>
              navigate("/register/school_admin/school/subscription")
            }
            className="text-sm text-base-content/60 hover:text-primary"
            disabled={loading}
          >
            ← Back to subscription plans
          </button>

          <div className="mt-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl text-primary-content">
              💳
            </div>

            <h1 className="mt-6 text-3xl font-extrabold">
              Complete Your Payment
            </h1>

            <p className="mt-3 text-sm leading-6 text-base-content/60">
              Continue to Stripe Checkout to pay for your Smart School
              subscription using a supported debit or credit card.
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-base-200 p-5">
            <h2 className="text-lg font-bold">Order Summary</h2>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{planName}</p>
                <p className="mt-1 text-sm text-base-content/60">
                  {schoolName}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-base-300 p-5">
            <div className="flex items-center gap-4">
              <span className="text-3xl" aria-hidden="true">
                💳
              </span>

              <div>
                <h2 className="font-semibold">
                  Stripe — Debit / Credit Card
                </h2>
                <p className="mt-1 text-sm text-base-content/60">
                  Your payment will be processed on Stripe's secure checkout
                  page.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div role="alert" className="alert alert-error mt-6">
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handlePayment}
            disabled={loading}
            className="btn btn-primary mt-6 w-full"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Connecting to Stripe...
              </>
            ) : (
              "Continue to Secure Payment"
            )}
          </button>

          <p className="mt-5 text-center text-xs leading-5 text-base-content/50">
            Your subscription will only be activated after the backend
            verifies successful payment.
          </p>
        </div>
      </div>
    </main>
  );
};

export default SchoolAdminPayment;