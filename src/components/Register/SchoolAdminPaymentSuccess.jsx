import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api.js";
import { useEffect } from "react";
import { useRegistration } from "../../context/RegistrationContext.jsx";

const verifyPayment = async (sessionId) => {
  const response = await api.get(
    "/payments/verify-session",
    {
      params: { session_id: sessionId },
    }
  );

  return response.data;
};

export default function SchoolAdminPaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { registrationData, updateRegistration } = useRegistration();
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["stripe-payment-verification", sessionId],
    queryFn: () => verifyPayment(sessionId),
    enabled: Boolean(sessionId),
    retry: 1,
  });


useEffect(() => {
  if (!data?.paid || !data?.registration_id) {
    return;
  }

  const alreadyUpdated =
    registrationData?.registration_id === data.registration_id &&
    registrationData?.payment_status === "paid";

  if (alreadyUpdated) {
    return;
  }

  updateRegistration({
    registration_id: data.registration_id,
    payment_status: "paid",
  });
}, [
  data?.paid,
  data?.registration_id,
  registrationData?.registration_id,
  registrationData?.payment_status,
  updateRegistration,
]);

  if (!sessionId) {
    return (
      <main className="mx-auto max-w-xl p-6 text-center">
        <h1 className="text-2xl font-bold">
          Missing payment session
        </h1>
        <p className="mt-3">
          We couldn't find the Stripe Checkout Session ID.
        </p>
      </main>
    );
  }

  if (isPending) {
    return (
      <main className="mx-auto max-w-xl p-6 text-center">
        <span className="loading loading-spinner loading-lg" />
        <h1 className="mt-4 text-2xl font-bold">
          Verifying your payment
        </h1>
        <p className="mt-2">
          Please wait while we confirm your subscription with Stripe.
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-xl p-6 text-center">
        <h1 className="text-2xl font-bold text-error">
          Payment verification failed
        </h1>
        <p className="mt-3">
          {error?.response?.data?.message ||
            "We couldn't verify your payment. Please try again."}
        </p>

        <button
          type="button"
          className="btn btn-primary mt-5"
          onClick={() => refetch()}
        >
          Try again
        </button>
      </main>
    );
  }

  if (!data?.paid) {
    return (
      <main className="mx-auto max-w-xl p-6 text-center">
        <h1 className="text-2xl font-bold">
          Payment is not confirmed yet
        </h1>
        <p className="mt-3">
          {data?.message ||
            "Please wait a moment and check again."}
        </p>

        <button
          type="button"
          className="btn btn-primary mt-5"
          onClick={() => refetch()}
        >
          Check payment again
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-6 text-center">
      <div className="text-5xl text-success">✓</div>

      <h1 className="mt-4 text-3xl font-bold">
        Payment successful!
      </h1>

      <p className="mt-3">
        Your subscription payment has been verified by Stripe.
      </p>

      <p className="mt-2 text-sm opacity-70">
        Registration reference: {data.registration_id}
      </p>

      <Link
        to="/register/school_admin/account"
        className="btn btn-primary mt-6"
      >
        Continue registration
      </Link>
    </main>
  );
}


// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";

// import { useRegistration } from "../../context/RegistrationContext.jsx";
// import api from "../../services/api.js";

// const SchoolAdminPaymentSuccess = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const { registrationData } = useRegistration();
//   console.log("registrationData in SchoolAdminPaymentSuccess", registrationData);

//   const sessionId = searchParams.get("session_id");
//   console.log("Stripe Checkout Session ID:", sessionId);

//   const [status, setStatus] = useState("verifying");
//   const [message, setMessage] = useState(
//     "Please wait while we verify your payment with Stripe."
//   );

//   useEffect(() => {
//     let cancelled = false;

//     const verifyPayment = async () => {
//       if (!sessionId) {
//         setStatus("invalid");
//         setMessage(
//           "The Stripe Checkout Session ID is missing. We cannot verify this payment."
//         );
//         return;
//       }

//       try {
//         setStatus("verifying");
//         setMessage("Verifying your payment securely...");

//         const response = await api.get("/payments/status", {
//           params: {
//             session_id: sessionId,
//           },
//         });
//         console.log("Payment verification response:", response.data);

//         if (cancelled) return;

//         const data = response.data;
        

//         if (
//           data?.success === true &&
//           data?.payment_status === "paid"
//         ) {
//           setStatus("paid");
//           setMessage(
//             "Your payment has been verified successfully."
//           );

//           if (data.registration_id) {
//             sessionStorage.setItem(
//               "school_registration_id",
//               data.registration_id
//             );
//           }

//           return;
//         }

//         if (
//           data?.payment_status === "pending" ||
//           data?.payment_status === "processing"
//         ) {
//           setStatus("pending");
//           setMessage(
//             "Your payment is still being processed. Please wait before continuing registration."
//           );
//           return;
//         }

//         setStatus("unconfirmed");
//         setMessage(
//           "We could not confirm your payment. Please check your payment status or contact support."
//         );
//       } catch (error) {
//         if (cancelled) return;

//         console.error("Payment verification failed:", error);

//         setStatus("error");
//         setMessage(
//           error.response?.data?.message ||
//             "We could not verify your payment right now. Please try again shortly."
//         );
//       }
//     };

//     verifyPayment();

//     return () => {
//       cancelled = true;
//     };
//   },
//   [
//     sessionId
//   ]
// );

//   const retryVerification = () => {
//     // Changing the query string reloads the component's verification
//     // effect. Preserve the existing session ID.
//     navigate(
//       `/register/school_admin/payment/success?session_id=${encodeURIComponent(sessionId)}`,
//       { replace: true }
//     );

//     window.location.reload();
//   };

//   const isPaid = status === "paid";

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-10">
//       <section className="w-full max-w-xl rounded-3xl border border-base-300 bg-base-100 p-8 text-center shadow-sm sm:p-10">
//         <div
//           className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl ${
//             isPaid
//               ? "bg-success/15 text-success"
//               : status === "verifying" || status === "pending"
//                 ? "bg-info/15 text-info"
//                 : "bg-error/10 text-error"
//           }`}
//           aria-hidden="true"
//         >
//           {isPaid ? (
//             "✓"
//           ) : status === "verifying" ? (
//             <span className="loading loading-spinner loading-lg" />
//           ) : status === "pending" ? (
//             "◷"
//           ) : (
//             "!"
//           )}
//         </div>

//         <h1 className="mt-6 text-3xl font-extrabold">
//           {isPaid
//             ? "Payment Successful"
//             : status === "verifying"
//               ? "Verifying Payment"
//               : status === "pending"
//                 ? "Payment Processing"
//                 : "Payment Not Confirmed"}
//         </h1>

//         <p
//           className="mt-4 text-sm leading-6 text-base-content/70"
//           role="status"
//           aria-live="polite"
//         >
//           {message}
//         </p>

//         {isPaid && (
//           <div className="mt-6 rounded-2xl bg-base-200 p-5 text-left">
//             <p className="text-sm text-base-content/60">
//               School
//             </p>

//             <p className="mt-1 font-semibold">
//               {registrationData?.school_name || "School registration"}
//             </p>

//             <p className="mt-4 text-sm text-base-content/60">
//               Payment reference
//             </p>

//             <p className="mt-1 break-all text-sm font-medium">
//               {sessionId}
//             </p>
//           </div>
//         )}

//         {isPaid ? (
//           <div className="mt-8">
//             <p className="text-sm text-base-content/70">
//               Your payment is verified. Continue to the next registration
//               step to finish setting up your School Admin account.
//             </p>

//             <button
//               type="button"
//               className="btn btn-primary mt-5 w-full"
//               onClick={() =>
//                 navigate("/register/school_admin/account")
//               }
//             >
//               Continue Registration
//             </button>
//           </div>
//         ) : status === "verifying" ? (
//           <p className="mt-6 text-xs text-base-content/50">
//             Please do not close this page while verification is in progress.
//           </p>
//         ) : (
//           <div className="mt-8 flex flex-col gap-3">
//             <button
//               type="button"
//               className="btn btn-primary"
//               onClick={retryVerification}
//               disabled={!sessionId}
//             >
//               Check Payment Again
//             </button>

//             <button
//               type="button"
//               className="btn btn-outline"
//               onClick={() =>
//                 navigate("/register/school_admin/school/subscription")
//               }
//             >
//               Back to Subscription
//             </button>
//           </div>
//         )}

//         <p className="mt-6 text-xs text-base-content/50">
//           Your school and subscription must be finalized by the backend.
//           A browser redirect alone does not confirm payment.
//         </p>
//       </section>
//     </main>
//   );
// };

// export default SchoolAdminPaymentSuccess;
