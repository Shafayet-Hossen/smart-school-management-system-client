import { Link } from "react-router-dom";

const features = [
  {
    title: "Student Management",
    description:
      "Manage student profiles, academic information, enrollment data and school records from one centralized system.",
    icon: "student",
  },
  {
    title: "Teacher Management",
    description:
      "Organize teacher information, assigned classes, subjects and academic responsibilities efficiently.",
    icon: "teacher",
  },
  {
    title: "Class & Subject Management",
    description:
      "Create and manage classes, subjects and academic structures while keeping every school's data isolated.",
    icon: "class",
  },
  {
    title: "Smart Attendance",
    description:
      "Track daily attendance efficiently with intelligent attendance management and face recognition capabilities.",
    icon: "attendance",
  },
  {
    title: "Parent Management",
    description:
      "Keep parents connected with their children's attendance, academic progress, assignments and important updates.",
    icon: "parent",
  },
  {
    title: "Assignments",
    description:
      "Create assignments, track submissions and help students and parents stay informed about academic deadlines.",
    icon: "assignment",
  },
  {
    title: "Academic Management",
    description:
      "Manage academic activities and organize essential school information through a centralized platform.",
    icon: "academic",
  },
  {
    title: "Notifications",
    description:
      "Deliver important school updates and academic notifications to the right users at the right time.",
    icon: "notification",
  },
  {
    title: "Analytics & Reports",
    description:
      "Turn school data into useful insights with attendance analytics, academic information and performance reports.",
    icon: "analytics",
  },
  {
    title: "AI Chat Assistant",
    description:
      "Provide users with an intelligent conversational assistant to help access information and interact with the platform.",
    icon: "ai",
  },
  {
    title: "Multi-Tenant SaaS",
    description:
      "Each school operates in its own secure tenant environment with strict school-level data isolation.",
    icon: "tenant",
  },
  {
    title: "Secure Access Control",
    description:
      "Firebase Authentication, JWT and role-based access control help protect your school's data and resources.",
    icon: "security",
  },
];

function FeatureIcon({ type }) {
  const commonProps = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.8,
    stroke: "currentColor",
    className: "h-7 w-7",
  };

  switch (type) {
    case "student":
      return (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.125-.954M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.003c0 .021 0 .042-.002.063M15 19.128a8.96 8.96 0 0 1-3.75.812 8.96 8.96 0 0 1-3.75-.812M9 19.128v-.003c0-1.113.285-2.16.786-3.07M9 19.128a9.38 9.38 0 0 1-2.625.372 9.337 9.337 0 0 1-4.125-.954M9 19.128v.003c0 .021 0 .042.002.063M12 12a3.75 3.75 0 1 0 0-7.5A3.75 3.75 0 0 0 12 12Zm6.75 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM5.25 12a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
          />
        </svg>
      );

    case "teacher":
      return (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4.5 20.25a7.5 7.5 0 0 1 15 0M18.75 8.25h3v6h-3M18.75 11.25H12"
          />
        </svg>
      );

    case "class":
      return (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 5.25A2.25 2.25 0 0 1 6.75 3h10.5a2.25 2.25 0 0 1 2.25 2.25v15.5a.25.25 0 0 1-.4.2l-5.1-3.825a3.37 3.37 0 0 0-4.05 0L4.9 20.95a.25.25 0 0 1-.4-.2V5.25Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7h8M8 11h5"
          />
        </svg>
      );

    case "attendance":
      return (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      );

    case "parent":
      return (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372A9.337 9.337 0 0 0 21.75 18.5M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128a8.96 8.96 0 0 1-3 .684 8.96 8.96 0 0 1-3-.684M9 19.128v-.003c0-1.113.285-2.16.786-3.07M9 19.128a9.38 9.38 0 0 1-2.625.372A9.337 9.337 0 0 1 2.25 18.5M12 12a3.75 3.75 0 1 0 0-7.5A3.75 3.75 0 0 0 12 12Z"
          />
        </svg>
      );

    case "assignment":
      return (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5.25h6M9 9h6M9 12.75h3M7.5 3.75h9A1.5 1.5 0 0 1 18 5.25v13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18.75V5.25a1.5 1.5 0 0 1 1.5-1.5Z"
          />
        </svg>
      );

    case "academic":
      return (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m3 10.5 9-4.5 9 4.5-9 4.5-9-4.5Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12.25v4.5c0 1.243 2.686 2.25 6 2.25s6-1.007 6-2.25v-4.5"
          />
        </svg>
      );

    case "notification":
      return (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 1 0-12 0v.75a8.967 8.967 0 0 1-2.31 6.022 23.848 23.848 0 0 0 5.454 1.31m5.713 0a24.255 24.255 0 0 1-5.713 0m5.713 0a3 3 0 1 1-5.713 0"
          />
        </svg>
      );

    case "analytics":
      return (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3v18h18"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m7 16 3-4 3 2 5-7"
          />
        </svg>
      );

    case "ai":
      return (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.847-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a2.25 2.25 0 0 0-1.622-1.622L15.084 6.75l1.035-.259a2.25 2.25 0 0 0 1.622-1.622L18 3.834l.259 1.035a2.25 2.25 0 0 0 1.622 1.622l1.035.259-1.035.259a2.25 2.25 0 0 0-1.622 1.622Z"
          />
        </svg>
      );

    case "tenant":
      return (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 21h18M5.25 21V7.5L12 3l6.75 4.5V21M8.25 21v-6h7.5v6M8.25 10.5h.008v.008H8.25V10.5ZM12 10.5h.008v.008H12V10.5ZM15.75 10.5h.008v.008h-.008V10.5Z"
          />
        </svg>
      );

    case "security":
      return (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3 4.5 6v5.25c0 4.8 3.15 8.625 7.5 9.75 4.35-1.125 7.5-4.95 7.5-9.75V6L12 3Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9.5 12 1.75 1.75L14.75 10"
          />
        </svg>
      );

    default:
      return null;
  }
}

function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-base-100 py-24 sm:py-28"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
            Powerful Features
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Everything you need to
            <span className="block text-primary">
              run a smarter school
            </span>
          </h2>

          <p className="mt-5 text-base leading-8 text-base-content/60 sm:text-lg">
            From student and teacher management to attendance, analytics,
            parent engagement and AI-powered assistance, our platform brings
            your school's essential operations together in one place.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              {/* Hover decoration */}
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

              <div className="relative">
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-content">
                  <FeatureIcon type={feature.icon} />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-base-content/60">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Learn more
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-base-300 bg-base-200/50 p-8 text-center sm:p-10 lg:flex-row lg:text-left">
          <div>
            <h3 className="text-2xl font-bold">
              Built for the entire school community
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base">
              Give administrators, teachers, students and parents the tools
              they need to stay connected and productive.
            </p>
          </div>

          <Link
            to="/features"
            className="btn btn-primary rounded-xl px-7"
          >
            Explore All Features
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Features;