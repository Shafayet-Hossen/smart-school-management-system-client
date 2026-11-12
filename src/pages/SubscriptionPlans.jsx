
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Monthly",
    slug: "monthly",
    price: 500,
    period: "month",
    description: "Flexible monthly billing for your school.",
    popular: false,
  },
  {
    name: "Yearly",
    slug: "yearly",
    price: 5000,
    period: "year",
    description: "Full-year access with one annual payment.",
    popular: true,
  },
];

const features = [
  "Student Management",
  "Teacher Management",
  "Class & Subject Management",
  "Attendance Management",
  "Parent Dashboard",
  "Assignment Management",
  "Exam & Results Management",
  "Notifications & Attendance Alerts",
  "Attendance Analytics",
  "AI Chat Assistant",
  "Face Recognition Attendance",
  "Reports and Academic Insights",
];

function SubscriptionPlans() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-base-200/40 py-20 sm:py-24">
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
            Simple & Transparent Pricing
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            One platform.
            <span className="block text-primary">
              Two payment options.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-base-content/60 sm:text-lg">
            Manage your entire school with Smart School.
            Choose monthly or yearly billing for just
            ৳5000 BDT.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {plans.map((plan) => (
              <article
                key={plan.slug}
                className={`relative flex flex-col rounded-3xl border bg-base-100 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-10 ${
                  plan.popular
                    ? "border-primary shadow-xl shadow-primary/10"
                    : "border-base-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="whitespace-nowrap rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-content shadow-lg">
                      Annual Billing
                    </span>
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-bold">
                    {plan.name} Plan
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-base-content/60">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold tracking-tight">
                      ৳{plan.price}
                    </span>

                    <span className="text-sm text-base-content/60">
                      BDT / {plan.period}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-base-content/60">
                    {plan.slug === "monthly"
                      ? "Pay ৳500 every month."
                      : "Pay ৳500 for the entire year."}
                  </p>
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
                  Choose {plan.name}
                </Link>

                {/* Features */}
                <div className="mt-8 flex-1">
                  <p className="mb-5 text-sm font-bold">
                    Everything included:
                  </p>

                  <ul className="space-y-4">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="mt-0.5 font-bold text-success">
                          ✓
                        </span>

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-base-content/60">
            All prices are in Bangladeshi Taka (BDT).
            Select your billing period to continue registration.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-base-200/40 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold">
            Everything your school needs
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-base-content/60">
            Simplify school administration, manage academic
            activities, track attendance, and keep parents
            informed through one platform.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <div className="text-3xl">🎓</div>
              <h3 className="mt-3 font-bold">
                Academic Management
              </h3>
              <p className="mt-2 text-sm text-base-content/60">
                Manage students, teachers, classes, exams,
                and assignments.
              </p>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <div className="text-3xl">📊</div>
              <h3 className="mt-3 font-bold">
                Smart Analytics
              </h3>
              <p className="mt-2 text-sm text-base-content/60">
                Review attendance, academic results, and
                school performance.
              </p>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <div className="text-3xl">🔔</div>
              <h3 className="mt-3 font-bold">
                Parent Communication
              </h3>
              <p className="mt-2 text-sm text-base-content/60">
                Keep parents informed about attendance,
                results, and assignments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold">
            Ready to manage your school smarter?
          </h2>

          <p className="mt-4 leading-7 text-base-content/60">
            Choose your preferred billing period and get
            started with Smart School.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register?plan=monthly"
              className="btn btn-primary rounded-xl px-7"
            >
              Start Monthly Plan
            </Link>

            <Link
              to="/register?plan=yearly"
              className="btn btn-outline rounded-xl px-7"
            >
              Start Yearly Plan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SubscriptionPlans;
