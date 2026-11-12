
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import { useRegistration } from "../../context/RegistrationContext.jsx";

const BILLING_OPTIONS = {
  monthly: {
    label: "Monthly",
    price: 5,
    interval: "month",
    description: "Billed monthly",
  },
  yearly: {
    label: "Yearly",
    price: 50,
    interval: "year",
    description: "Billed annually",
  },
};

// IMPORTANT:
// Replace "standard" with the actual active plan slug in your
// MongoDB subscription_plan collection.
const SUBSCRIPTION_PLAN_SLUG = "standard";

const formatUSD = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);

export default function SchoolAdminSubscription() {
  const navigate = useNavigate();

  const { registrationData, updateRegistration } = useRegistration();

  // console.log("registrationData in SchoolAdminSubscription", registrationData);

  const [billingInterval, setBillingInterval] = useState("monthly");

  const [pageError, setPageError] = useState("");

  const selectedOption = BILLING_OPTIONS[billingInterval];

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/payments/initiate", {
        subscription_plan_slug: SUBSCRIPTION_PLAN_SLUG,
        billing_interval: billingInterval,
        registration_data: {
          ...registrationData,
          role: "school_admin",
          subscription_plan_slug: SUBSCRIPTION_PLAN_SLUG,
          billing_interval: billingInterval,
        },
      });

      return response.data;
    },

    onSuccess: (result) => {
      const checkoutUrl =
        result.payment_url ||
        result.checkout_url ||
        result.checkoutUrl;

      if (!checkoutUrl) {
        setPageError(
          result.message || "The checkout URL was not returned by the server."
        );
        return;
      }

      window.location.assign(checkoutUrl);
    },

    onError: (error) => {
      setPageError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start checkout. Please try again."
      );
    },
  });

  const handleContinue = () => {
    setPageError("");

    if (!registrationData?.school_name) {
      setPageError(
        "School information is missing. Please return to the school details step."
      );
      return;
    }

    // Save the selection in your existing registration context.
    updateRegistration({
      subscription_plan_slug: SUBSCRIPTION_PLAN_SLUG,
      billing_interval: billingInterval,
      subscription_price_usd: selectedOption.price,
    });

    checkoutMutation.mutate();
  };

  return (
    <main className="min-h-screen bg-base-200 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-10 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">
            Smart School Management System
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Choose your billing option
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base-content/70">
            Select monthly or yearly billing for your school management
            subscription.
          </p>

          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="badge badge-outline badge-success">
              1. School details
            </span>
            <span className="text-base-content/40">→</span>
            <span className="badge badge-primary">
              2. Subscription
            </span>
            <span className="text-base-content/40">→</span>
            <span className="badge badge-outline">
              3. Payment
            </span>
          </div>
        </header>

        {pageError && (
          <div role="alert" className="alert alert-error mb-6">
            <span>{pageError}</span>
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              aria-label="Dismiss error"
              onClick={() => setPageError("")}
            >
              ✕
            </button>
          </div>
        )}

        {/* Billing options */}
        <section
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          aria-label="Subscription billing options"
        >
          {/* Monthly */}
          <button
            type="button"
            aria-pressed={billingInterval === "monthly"}
            onClick={() => {
              setBillingInterval("monthly");
              setPageError("");
            }}
            className={`card border bg-base-100 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
              billingInterval === "monthly"
                ? "border-primary ring-2 ring-primary"
                : "border-base-300"
            }`}
          >
            <div className="card-body">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="16"
                        rx="2"
                      />
                      <path
                        d="M16 3v4M8 3v4M3 10h18"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">Monthly</h2>
                    <p className="text-sm text-base-content/60">
                      Flexible monthly billing
                    </p>
                  </div>
                </div>

                {billingInterval === "monthly" && (
                  <span className="badge badge-primary">Selected</span>
                )}
              </div>

              <div className="mt-6">
                <span className="text-5xl font-extrabold">
                  $5
                </span>
                <span className="ml-2 text-base-content/60">
                  / month
                </span>
              </div>

              <p className="mt-2 text-sm text-base-content/70">
                Billed every month.
              </p>

              <div className="divider" />

              <p className="text-sm">
                Annual equivalent: <strong>$60/year</strong>
              </p>
            </div>
          </button>

          {/* Yearly */}
          <button
            type="button"
            aria-pressed={billingInterval === "yearly"}
            onClick={() => {
              setBillingInterval("yearly");
              setPageError("");
            }}
            className={`card relative border bg-base-100 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
              billingInterval === "yearly"
                ? "border-primary ring-2 ring-primary"
                : "border-base-300"
            }`}
          >
            <div className="card-body">
              <div className="mb-2 flex justify-end">
                <span className="badge badge-success">
                  Save $10/year
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-success/10 p-3 text-success">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="16"
                        rx="2"
                      />
                      <path
                        d="M16 3v4M8 3v4M3 10h18M9 15l2 2 4-4"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">Yearly</h2>
                    <p className="text-sm text-base-content/60">
                      Best annual value
                    </p>
                  </div>
                </div>

                {billingInterval === "yearly" && (
                  <span className="badge badge-primary">Selected</span>
                )}
              </div>

              <div className="mt-6">
                <span className="text-5xl font-extrabold">
                  $50
                </span>
                <span className="ml-2 text-base-content/60">
                  / year
                </span>
              </div>

              <p className="mt-2 text-sm text-base-content/70">
                Billed once per year.
              </p>

              <div className="divider" />

              <p className="text-sm">
                Equivalent to <strong>$4.17/month</strong> when paid annually.
              </p>
            </div>
          </button>
        </section>

        {/* Checkout summary */}
        <section className="mx-auto mt-8 max-w-3xl">
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Subscription summary</h2>

              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {selectedOption.label} subscription
                  </p>
                  <p className="text-sm text-base-content/60">
                    {selectedOption.description}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {formatUSD(selectedOption.price)}
                  </p>
                  <p className="text-xs text-base-content/60">
                    USD
                  </p>
                </div>
              </div>

              <div className="divider" />

              <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={checkoutMutation.isPending}
                  onClick={() =>
                    navigate("/register/school_admin/school")
                  }
                >
                  ← Back to school details
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={checkoutMutation.isPending}
                  onClick={handleContinue}
                >
                  {checkoutMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Creating checkout...
                    </>
                  ) : (
                    <>Continue to secure payment →</>
                  )}
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-base-content/60">
                Secure checkout powered by Stripe. Your subscription is
                activated only after your backend confirms successful payment.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}




// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useRegistration } from "../../context/RegistrationContext";

// const SUBSCRIPTION_PLANS = [
//   {
//     slug: "monthly",
//     name: "Monthly Plan",
//     price: 500,
//     duration: "month",
//     description: "Flexible monthly subscription for your school.",
//     icon: "📅",
//   },
//   {
//     slug: "yearly",
//     name: "Yearly Plan",
//     price: 5000,
//     duration: "year",
//     description: "Annual subscription for your school.",
//     icon: "🏆",
//   },
// ];

// function SchoolAdminSubscription() {
//   const navigate = useNavigate();

//   const { registrationData, updateRegistration } = useRegistration();

//   console.log("registrationData in SchoolAdminSubscription", registrationData);
  
//   const [selectedPlan, setSelectedPlan] = useState(
//     registrationData.subscription_plan_slug || ""
//   );

//   const [error, setError] = useState("");

//   // This page is only for School Admin registration.
//   if (registrationData.role !== "school_admin") {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
//         <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-lg">
//           <h2 className="text-xl font-bold">
//             Invalid registration flow
//           </h2>

//           <p className="mt-3 text-sm text-base-content/60">
//             Only School Admins can select a subscription plan here.
//           </p>

//           <button
//             type="button"
//             onClick={() => navigate("/register/role")}
//             className="btn btn-primary mt-6 rounded-xl"
//           >
//             Select Role
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const handleContinue = (event) => {
//     event.preventDefault();

//     if (!selectedPlan) {
//       setError("Please select a subscription plan to continue.");
//       return;
//     }

//     const plan = SUBSCRIPTION_PLANS.find(
//       (item) => item.slug === selectedPlan
//     );

//     if (!plan) {
//       setError("The selected subscription plan is invalid.");
//       return;
//     }

//     updateRegistration({
//       subscription_plan_slug: plan.slug,
//       subscription_price: plan.price,
//       subscription_duration: plan.duration,
//       status: "subscription_selected",
//     });
//     console.log("registrationData after update", registrationData);

//     navigate("/register/school_admin/school/payment");
//   };

//   return (
//     <div className="min-h-screen bg-base-200 px-4 py-10 sm:py-16">
//       <div className="mx-auto max-w-5xl">
//         {/* Header */}
//         <div className="text-center">
//           <button
//             type="button"
//             onClick={() => navigate("/register/school_admin/school")}
//             className="mb-8 text-sm font-medium text-base-content/50 transition hover:text-primary"
//           >
//             ← Back to School Information
//           </button>

//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl text-primary-content shadow-lg">
//             <span aria-hidden="true">💳</span>
//           </div>

//           <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
//             Choose Your Subscription
//           </h1>

//           <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-base-content/60 sm:text-base">
//             Select a subscription for your school's Smart School workspace.
//             This step is available only to School Admins.
//           </p>
//         </div>

//         {/* Progress */}
//         <div className="mx-auto mt-10 max-w-lg">
//           <div className="flex items-center gap-3">
//             <div className="h-2 flex-1 rounded-full bg-primary" />
//             <div className="h-2 flex-1 rounded-full bg-primary" />
//             <div className="h-2 flex-1 rounded-full bg-primary" />
//             <div className="h-2 flex-1 rounded-full bg-base-300" />
//             <div className="h-2 flex-1 rounded-full bg-base-300" />
//           </div>

//           <p className="mt-3 text-center text-xs text-base-content/50">
//             Subscription selection
//           </p>
//         </div>

//         {/* School Details */}
//         <div className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-5">
//           <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
//             Registering school
//           </p>

//           <h2 className="mt-2 text-lg font-bold">
//             {registrationData.school_name || "Your School"}
//           </h2>

//           <p className="mt-1 text-sm text-base-content/60">
//             Choose one of the following subscription options.
//           </p>
//         </div>

//         {/* Subscription Plans */}
//         <form onSubmit={handleContinue}>
//           <div className="mt-8 grid gap-6 md:grid-cols-2">
//             {SUBSCRIPTION_PLANS.map((plan) => {
//               const isSelected = selectedPlan === plan.slug;

//               return (
//                 <button
//                   key={plan.slug}
//                   type="button"
//                   onClick={() => {
//                     setSelectedPlan(plan.slug);
//                     setError("");
//                   }}
//                   aria-pressed={isSelected}
//                   className={`relative rounded-3xl border-2 p-6 text-left transition duration-200 sm:p-8 ${
//                     isSelected
//                       ? "border-primary bg-primary/5 shadow-xl"
//                       : "border-base-300 bg-base-100 hover:border-primary/50"
//                   }`}
//                 >
//                   {plan.slug === "yearly" && (
//                     <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-content">
//                       YEARLY
//                     </span>
//                   )}

//                   <div className="flex items-center justify-between">
//                     <span className="text-3xl" aria-hidden="true">
//                       {plan.icon}
//                     </span>

//                     <span
//                       className={`flex h-6 w-6 items-center justify-center rounded-full border ${
//                         isSelected
//                           ? "border-primary bg-primary text-primary-content"
//                           : "border-base-300"
//                       }`}
//                       aria-hidden="true"
//                     >
//                       {isSelected ? "✓" : ""}
//                     </span>
//                   </div>

//                   <h2 className="mt-6 text-2xl font-extrabold">
//                     {plan.name}
//                   </h2>

//                   <p className="mt-2 min-h-12 text-sm leading-6 text-base-content/60">
//                     {plan.description}
//                   </p>

//                   <div className="mt-6 flex items-baseline gap-2">
//                     <span className="text-4xl font-extrabold">
//                       ৳{plan.price}
//                     </span>
//                     <span className="text-sm text-base-content/60">
//                       / {plan.duration}
//                     </span>
//                   </div>

//                   <div className="mt-6 border-t border-base-300 pt-5">
//                     <p className="text-sm font-semibold">
//                       Included features
//                     </p>

//                     <ul className="mt-4 space-y-3 text-sm text-base-content/80">
//                       {[
//                         "Student and teacher management",
//                         "Class and subject management",
//                         "Student attendance",
//                         "Assignments and examinations",
//                         "Results and reports",
//                         "Parent dashboard",
//                         "School administration tools",
//                       ].map((feature) => (
//                         <li key={feature} className="flex gap-2">
//                           <span className="font-bold text-success">✓</span>
//                           <span>{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* Important pricing note */}
//           <div className="mt-6 rounded-2xl border border-warning/30 bg-warning/10 p-4">
//             <p className="text-sm leading-6">
//               <strong>Pricing note:</strong> The Monthly Plan costs ৳500 per
//               month. The Yearly Plan costs ৳5000 for the whole year, according
//               to your current pricing requirement.
//             </p>
//           </div>

//           {/* Error */}
//           {error && (
//             <div role="alert" className="mt-6 rounded-xl bg-error/10 p-4">
//               <p className="text-sm text-error">{error}</p>
//             </div>
//           )}

//           {/* Actions */}
//           <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row">
//             <button
//               type="button"
//               onClick={() => navigate("/register/school_admin/school")}
//               className="btn btn-outline rounded-xl"
//             >
//               Back
//             </button>

//             <button
//               type="submit"
//               className="btn btn-primary rounded-xl px-8"
//             >
//               Continue to Admin Account →
//             </button>
//           </div>
//         </form>

//         <p className="mt-6 text-center text-xs text-base-content/40">
//           Smart School SaaS Platform
//         </p>
//       </div>
//     </div>
//   );
// }

// export default SchoolAdminSubscription;
