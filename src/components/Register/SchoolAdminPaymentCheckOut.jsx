import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api.js"; // Adjust this path to your Axios instance
import { useRegistration } from "../../context/RegistrationContext.jsx";

const SchoolAdminPaymentCheckOut = () => {
  const navigate = useNavigate();

  const { registrationData } = useRegistration();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setError("");

    if (loading) return;

    // The subscription page must save the selected plan slug
    // into registrationData before navigating here.
    const planSlug = registrationData?.subscription_plan_slug;

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

    // Check the fields required by your existing backend service.
    if (
      !school.school_name ||
      !school.school_email ||
      !school.school_phone
    ) {
      setError(
        "Some required school information is missing. Please return to the school information step."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/v1/payments/initiate", {
        subscription_plan_slug: planSlug,
        school,
      });

      const data = response.data;

      if (!data?.success || !data?.payment_url) {
        throw new Error(
          data?.message || "Stripe did not return a Checkout URL."
        );
      }

      // Preserve the pending registration reference across the
      // redirect away from your React application.
      sessionStorage.setItem(
        "school_registration_id",
        data.registration_id
      );

      // Redirect to Stripe-hosted Checkout.
      window.location.assign(data.payment_url);
    } catch (err) {
      console.error(
        "Stripe Checkout initialization failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="rounded-xl border bg-base-100 p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          Complete Your Subscription Payment
        </h1>

        <p className="mt-2 text-sm text-base-content/70">
          Continue to Stripe's secure checkout page to pay for
          your selected Smart School subscription.
        </p>

        <div className="mt-6 rounded-lg bg-base-200 p-4">
          <p className="text-sm text-base-content/70">
            Selected plan
          </p>

          <p className="mt-1 font-semibold">
            {registrationData?.subscription_plan_name ||
              registrationData?.subscription_plan_slug ||
              "No plan selected"}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="alert alert-error mt-4"
          >
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
            "Pay securely with Stripe"
          )}
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/register/school_admin/subscription")
          }
          disabled={loading}
          className="btn btn-ghost mt-2 w-full"
        >
          Back to subscription plans
        </button>

        <p className="mt-4 text-center text-xs text-base-content/60">
          Your school should only be activated after the backend
          verifies successful payment.
        </p>
      </div>
    </main>
  );
};

export default SchoolAdminPaymentCheckOut;