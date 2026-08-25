import { Link } from "react-router-dom";

const advantages = [
  {
    number: "01",
    title: "Everything in One Platform",
    description:
      "Manage students, teachers, classes, subjects, attendance, assignments, parents, notifications and academic information from one centralized platform.",
  },
  {
    number: "02",
    title: "Built for Multiple Schools",
    description:
      "Our SaaS architecture allows multiple schools to use the same platform while keeping each school's data securely isolated.",
  },
  {
    number: "03",
    title: "Secure by Design",
    description:
      "Authentication, JWT-based authorization, role-based access control and tenant isolation help protect sensitive school information.",
  },
  {
    number: "04",
    title: "Smarter Attendance",
    description:
      "Modern attendance management with face recognition capabilities helps schools reduce manual work and improve attendance accuracy.",
  },
  {
    number: "05",
    title: "Connect Schools & Parents",
    description:
      "Parents can stay informed about their children's attendance, academic activities, assignments, notifications and upcoming deadlines.",
  },
  {
    number: "06",
    title: "Data-Driven Decisions",
    description:
      "Turn school data into meaningful insights through attendance analytics, academic information and performance reporting.",
  },
];

const stats = [
  {
    value: "01",
    label: "Centralized Platform",
  },
  {
    value: "24/7",
    label: "Cloud Accessibility",
  },
  {
    value: "100%",
    label: "Tenant Isolation",
  },
  {
    value: "∞",
    label: "Scalable Architecture",
  },
];

function WhyChooseUs() {
  return (
    <section
      id="why-us"
      className="relative overflow-hidden bg-base-200/40 py-24 sm:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
              Why Smart School?
            </span>

            <h2 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              More than a school management system.
              <span className="block text-primary">
                It's your school's digital foundation.
              </span>
            </h2>
          </div>

          <p className="max-w-xl text-base leading-8 text-base-content/60 lg:ml-auto lg:text-lg">
            Smart School brings the essential parts of school management
            together in one modern SaaS platform, helping administrators,
            teachers, students and parents stay connected and productive.
          </p>
        </div>

        {/* Main Advantage Grid */}
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item) => (
            <article
              key={item.number}
              className="group relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              {/* Number */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold tracking-widest text-primary">
                  {item.number}
                </span>

                <span className="h-px w-12 bg-base-300 transition-all duration-300 group-hover:w-20 group-hover:bg-primary/40" />
              </div>

              {/* Title */}
              <h3 className="mt-8 text-xl font-bold">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm leading-7 text-base-content/60">
                {item.description}
              </p>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </article>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          <div className="grid divide-y divide-base-300 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="px-6 py-8 text-center transition hover:bg-base-200/50"
              >
                <div className="text-3xl font-extrabold text-primary sm:text-4xl">
                  {stat.value}
                </div>

                <p className="mt-2 text-sm font-medium text-base-content/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-neutral px-6 py-12 text-neutral-content sm:px-10 lg:px-14">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-content/70">
                Built for growth
              </p>

              <h3 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
                Give your school the technology it deserves.
              </h3>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-content/70 sm:text-base">
                Start with what your school needs today and scale as your
                institution grows.
              </p>
            </div>

            <Link
              to="/register"
              className="btn btn-primary rounded-xl px-8"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;