import { Link } from "react-router-dom";

const highlights = [
  {
    number: "01",
    title: "One Connected Platform",
    description:
      "Bring students, teachers, parents and administrators together through one centralized school management platform.",
  },
  {
    number: "02",
    title: "Built for Modern Schools",
    description:
      "Replace disconnected tools and manual processes with a modern digital platform designed around everyday school operations.",
  },
  {
    number: "03",
    title: "Designed to Scale",
    description:
      "Our multi-tenant SaaS architecture allows schools to start with what they need and grow as their requirements increase.",
  },
];

function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-base-100 py-24 sm:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
            About Smart School
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Transforming the way
            <span className="block text-primary">
              schools manage their future
            </span>
          </h2>

          <p className="mt-5 text-base leading-8 text-base-content/60 sm:text-lg">
            Smart School is a modern cloud-based school management platform
            designed to simplify school operations, connect the entire school
            community and help institutions make better decisions through
            technology.
          </p>
        </div>

        {/* Main Content */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">

          {/* Left — Visual */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-200 p-6 shadow-xl sm:p-8">

              {/* Dashboard Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-3 w-28 rounded-full bg-base-300" />
                  <div className="mt-2 h-2 w-20 rounded-full bg-base-300/70" />
                </div>

                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10" />
                  <div className="h-8 w-8 rounded-lg bg-base-300" />
                </div>
              </div>

              {/* Dashboard Cards */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-base-content/50">
                      Students
                    </span>

                    <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs text-primary">
                      +12%
                    </span>
                  </div>

                  <p className="mt-4 text-2xl font-bold">
                    1,248
                  </p>

                  <div className="mt-4 h-2 rounded-full bg-base-200">
                    <div className="h-2 w-3/4 rounded-full bg-primary" />
                  </div>
                </div>

                <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
                  <span className="text-xs text-base-content/50">
                    Attendance
                  </span>

                  <p className="mt-4 text-2xl font-bold">
                    94.8%
                  </p>

                  <div className="mt-4 flex items-end gap-1">
                    <div className="h-5 w-2 rounded-sm bg-primary/30" />
                    <div className="h-8 w-2 rounded-sm bg-primary/40" />
                    <div className="h-6 w-2 rounded-sm bg-primary/50" />
                    <div className="h-10 w-2 rounded-sm bg-primary/60" />
                    <div className="h-8 w-2 rounded-sm bg-primary/70" />
                    <div className="h-12 w-2 rounded-sm bg-primary" />
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Recent Activity
                  </h3>

                  <span className="text-xs text-primary">
                    View all
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <div className="h-9 w-9 rounded-xl bg-primary/10" />

                      <div className="flex-1">
                        <div className="h-2.5 w-32 rounded-full bg-base-300" />
                        <div className="mt-2 h-2 w-20 rounded-full bg-base-300/60" />
                      </div>

                      <div className="h-2 w-10 rounded-full bg-base-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-3 rounded-2xl border border-base-300 bg-base-100 px-5 py-4 shadow-xl sm:-right-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Smarter Management
                  </p>

                  <p className="text-xs text-base-content/50">
                    Everything in one place
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Our Vision
            </span>

            <h3 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              Technology that makes
              <span className="text-primary">
                {" "}education management simpler.
              </span>
            </h3>

            <p className="mt-6 text-base leading-8 text-base-content/60">
              Schools handle thousands of pieces of information every day.
              Students, teachers, parents, classes, attendance, assignments
              and academic activities all need to work together.
            </p>

            <p className="mt-4 text-base leading-8 text-base-content/60">
              Smart School brings these activities into one connected
              ecosystem, giving administrators better control while making
              information easier to access for teachers, students and parents.
            </p>

            {/* Highlights */}
            <div className="mt-8 space-y-5">
              {highlights.map((item) => (
                <div
                  key={item.number}
                  className="flex gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                    {item.number}
                  </div>

                  <div>
                    <h4 className="font-bold">
                      {item.title}
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-base-content/60">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="btn btn-primary rounded-xl px-7"
              >
                Get Started
              </Link>

              <Link
                to="/pricing"
                className="btn btn-outline rounded-xl px-7"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="mt-24 rounded-3xl border border-primary/10 bg-primary/5 px-6 py-12 text-center sm:px-10">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            Our Mission
          </span>

          <blockquote className="mx-auto mt-5 max-w-4xl text-2xl font-bold leading-relaxed sm:text-3xl">
            "To make school management simpler, smarter and more connected
            through accessible technology."
          </blockquote>
        </div>
      </div>
    </section>
  );
}

export default About;