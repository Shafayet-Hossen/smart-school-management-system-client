import { Link } from "react-router-dom";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    slug: "free",
    description: "Perfect for small schools getting started.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    popular: false,

    features: [
      "Student Management",
      "Teacher Management",
      "Class & Subject Management",
      "Basic Attendance",
      "Basic Notifications",
    ],

    unavailable: [
      "Parent Dashboard",
      "Assignments",
      "Face Recognition Attendance",
      "AI Chat Assistant",
      "Advanced Analytics",
      "Priority Support",
    ],
  },

  {
    name: "Standard",
    slug: "standard",
    description: "Everything a growing school needs.",
    monthlyPrice: 2999,
    yearlyPrice: 29990,
    popular: true,

    features: [
      "Student Management",
      "Teacher Management",
      "Class & Subject Management",
      "Attendance Management",
      "Parent Dashboard",
      "Assignments",
      "Advanced Notifications",
      "Attendance Analytics",
      "Limited AI Assistant",
    ],

    unavailable: [
      "Face Recognition Attendance",
      "Advanced Analytics",
      "Priority Support",
    ],
  },

  {
    name: "Premium",
    slug: "premium",
    description: "Complete tools for modern schools.",
    monthlyPrice: 5999,
    yearlyPrice: 59990,
    popular: false,

    features: [
      "Everything in Standard",
      "Face Recognition Attendance",
      "AI Chat Assistant",
      "Advanced Analytics",
      "Advanced Reports",
      "Priority Support",
      "Higher Usage Limits",
    ],

    unavailable: [],
  },
];

function SubscriptionPlans() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const getPrice = (plan) => {
    if (billingCycle === "yearly") {
      return plan.yearlyPrice;
    }

    return plan.monthlyPrice;
  };

  return (
    <div className="min-h-screen bg-base-100">

      {/* Hero */}
      <section className="relative overflow-hidden bg-base-200/40 py-20 sm:py-24">
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
            Simple & Transparent Pricing
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Choose the right plan for
            <span className="block text-primary">
              your school
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-base-content/60 sm:text-lg">
            Start with the tools you need today and upgrade whenever your
            school grows. No complicated pricing. No unnecessary features.
          </p>

          {/* Billing Toggle */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex rounded-xl border border-base-300 bg-base-100 p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  billingCycle === "monthly"
                    ? "bg-primary text-primary-content shadow"
                    : "text-base-content/60 hover:text-base-content"
                }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  billingCycle === "yearly"
                    ? "bg-primary text-primary-content shadow"
                    : "text-base-content/60 hover:text-base-content"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {billingCycle === "yearly" && (
            <p className="mt-3 text-sm font-medium text-success">
              Save more with yearly billing
            </p>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">

            {plans.map((plan) => {
              const price = getPrice(plan);

              return (
                <article
                  key={plan.slug}
                  className={`relative flex flex-col rounded-3xl border bg-base-100 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                    plan.popular
                      ? "border-primary shadow-xl shadow-primary/10"
                      : "border-base-300"
                  }`}
                >

                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-content shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div>
                    <h2 className="text-2xl font-bold">
                      {plan.name}
                    </h2>

                    <p className="mt-3 min-h-14 text-sm leading-6 text-base-content/60">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mt-8">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold">
                        ৳{price.toLocaleString()}
                      </span>

                      <span className="mb-1 text-sm text-base-content/50">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    </div>

                    {billingCycle === "yearly" && price > 0 && (
                      <p className="mt-2 text-xs text-base-content/50">
                        Equivalent to ৳
                        {Math.round(price / 12).toLocaleString()}/month
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/register?plan=${plan.slug}`}
                    className={`mt-8 btn rounded-xl ${
                      plan.popular
                        ? "btn-primary"
                        : "btn-outline"
                    }`}
                  >
                    {plan.slug === "free"
                      ? "Start Free"
                      : `Choose ${plan.name}`}
                  </Link>

                  {/* Features */}
                  <div className="mt-8 flex-1">
                    <p className="mb-4 text-sm font-bold">
                      What's included:
                    </p>

                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm"
                        >
                          <span className="mt-0.5 text-success">
                            ✓
                          </span>

                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.unavailable.length > 0 && (
                      <>
                        <div className="my-6 border-t border-base-300" />

                        <ul className="space-y-3">
                          {plan.unavailable.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-3 text-sm text-base-content/40"
                            >
                              <span className="mt-0.5">
                                —
                              </span>

                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-base-200/40 py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold">
            Built to grow with your school
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-base-content/60">
            You can start small and upgrade your subscription as your
            school's requirements grow.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <div className="text-3xl font-bold text-primary">
                01
              </div>

              <h3 className="mt-3 font-bold">
                Start
              </h3>

              <p className="mt-2 text-sm text-base-content/60">
                Choose the plan that fits your current needs.
              </p>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <div className="text-3xl font-bold text-primary">
                02
              </div>

              <h3 className="mt-3 font-bold">
                Grow
              </h3>

              <p className="mt-2 text-sm text-base-content/60">
                Add users and use more advanced features.
              </p>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <div className="text-3xl font-bold text-primary">
                03
              </div>

              <h3 className="mt-3 font-bold">
                Scale
              </h3>

              <p className="mt-2 text-sm text-base-content/60">
                Upgrade whenever your institution needs more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold">
            Not sure which plan to choose?
          </h2>

          <p className="mt-4 text-base leading-7 text-base-content/60">
            Start with the Free plan and upgrade when your school needs
            additional capabilities.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register?plan=free"
              className="btn btn-primary rounded-xl px-7"
            >
              Start Free
            </Link>

            <Link
              to="/contact"
              className="btn btn-outline rounded-xl px-7"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SubscriptionPlans;