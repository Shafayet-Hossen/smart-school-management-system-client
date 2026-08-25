import { Link } from "react-router-dom";
import Navbar from "../components/home/Navbar.jsx";
import Features from "../components/home/Features.jsx";
import WhyChooseUs from "../components/home/WhyChooseUs.jsx";
import About from "../components/home/About.jsx";
import Contact from "../components/home/Contact.jsx";

function Home() {
    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <Navbar />

            {/* Hero Section */}
            <main>
                <section className="relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

                    <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:px-8">

                        {/* Hero Content */}
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                                Smart technology for modern schools
                            </div>

                            <h2 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                Manage Your School
                                <span className="block text-primary">
                                    Smarter & Better.
                                </span>
                            </h2>

                            <p className="mt-6 max-w-2xl text-base leading-8 text-base-content/65 sm:text-lg">
                                A modern school management platform designed to simplify
                                academic management, student administration, attendance,
                                communication, analytics and much more — all from one
                                powerful platform.
                            </p>

                            {/* CTA Buttons */}
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/register"
                                    className="btn btn-primary btn-lg rounded-xl px-8 shadow-lg"
                                >
                                    Get Started
                                </Link>

                                <Link
                                    to="/features"
                                    className="btn btn-outline btn-lg rounded-xl px-8"
                                >
                                    Explore Features
                                </Link>
                            </div>

                            {/* Trust indicators */}
                            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-base-content/60">
                                <div className="flex items-center gap-2">
                                    <span className="text-success">✓</span>
                                    Easy to use
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-success">✓</span>
                                    Secure platform
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-success">✓</span>
                                    Built for school or college
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Preview */}
                        <div className="relative">
                            <div className="rounded-2xl border border-base-300 bg-base-100 p-3 shadow-2xl">
                                {/* Browser top bar */}
                                <div className="mb-3 flex items-center gap-2 px-2">
                                    <span className="h-3 w-3 rounded-full bg-error/70" />
                                    <span className="h-3 w-3 rounded-full bg-warning/70" />
                                    <span className="h-3 w-3 rounded-full bg-success/70" />

                                    <div className="ml-3 h-7 flex-1 rounded-lg bg-base-200" />
                                </div>

                                {/* Fake Dashboard */}
                                <div className="rounded-xl bg-base-200 p-4 sm:p-6">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div>
                                            <div className="h-4 w-32 rounded bg-base-content/20" />
                                            <div className="mt-2 h-3 w-20 rounded bg-base-content/10" />
                                        </div>

                                        <div className="h-9 w-9 rounded-lg bg-primary/20" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        {[
                                            "Students",
                                            "Teachers",
                                            "Attendance",
                                            "Classes",
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                className="rounded-xl bg-base-100 p-4 shadow-sm"
                                            >
                                                <div className="h-3 w-14 rounded bg-base-content/10" />

                                                <div className="mt-3 h-6 w-12 rounded bg-primary/30" />

                                                <p className="mt-2 text-xs text-base-content/50">
                                                    {item}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                        <div className="h-40 rounded-xl bg-base-100 p-4 sm:col-span-2">
                                            <div className="h-3 w-28 rounded bg-base-content/10" />

                                            <div className="mt-6 flex h-24 items-end gap-2">
                                                {[40, 65, 50, 80, 60, 90, 72].map(
                                                    (height, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex-1 rounded-t-md bg-primary/60"
                                                            style={{ height: `${height}%` }}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="h-40 rounded-xl bg-base-100 p-4">
                                            <div className="h-3 w-20 rounded bg-base-content/10" />

                                            <div className="mx-auto mt-5 h-20 w-20 rounded-full border-[10px] border-primary/30 border-t-primary" />

                                            <div className="mx-auto mt-2 h-3 w-16 rounded bg-base-content/10" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating card */}
                            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-base-300 bg-base-100 p-4 shadow-xl sm:block">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                                        ✓
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">
                                            Attendance Updated
                                        </p>
                                        <p className="text-xs text-base-content/50">
                                            Today, 09:42 AM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Preview */}
                <section className="border-y border-base-200 bg-base-200/40">
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                                Everything in one place
                            </p>

                            <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                                Everything Your School Needs
                            </h3>

                            <p className="mt-4 text-base leading-7 text-base-content/60">
                                Bring your school's daily operations together with a
                                centralized, easy-to-use management platform.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    title: "Student Management",
                                    description:
                                        "Manage student information, academic records and school activities.",
                                },
                                {
                                    title: "Teacher Management",
                                    description:
                                        "Organize teachers, responsibilities, classes and academic activities.",
                                },
                                {
                                    title: "Smart Attendance",
                                    description:
                                        "Track attendance efficiently and provide useful attendance insights.",
                                },
                                {
                                    title: "Parent Engagement",
                                    description:
                                        "Keep parents connected with their children's academic progress.",
                                },
                            ].map((feature) => (
                                <div
                                    key={feature.title}
                                    className="rounded-2xl border border-base-300 bg-base-100 p-6 transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <span className="text-xl font-bold">+</span>
                                    </div>

                                    <h4 className="text-lg font-bold">
                                        {feature.title}
                                    </h4>

                                    <p className="mt-3 text-sm leading-6 text-base-content/60">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Features Section */}
                <Features></Features>
                
                {/* Why Choose Us */}
                <WhyChooseUs></WhyChooseUs>

                {/* About Section */}
                <About></About>

                {/* Pricing CTA */}
                <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-content shadow-xl sm:px-12 lg:px-16">
                        <div className="flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
                            <div>
                                <h3 className="text-3xl font-bold sm:text-4xl">
                                    Ready to transform your school?
                                </h3>

                                <p className="mt-3 max-w-2xl text-primary-content/80">
                                    Choose the plan that fits your institution and start
                                    managing your school smarter.
                                </p>
                            </div>

                            <Link
                                to="/pricing"
                                className="btn btn-lg rounded-xl border-0 bg-base-100 px-8 text-primary hover:bg-base-200"
                            >
                                View Subscription Plans
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <Contact></Contact>
            </main>

            {/* Footer */}
            <footer className="border-t border-base-200">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 text-sm text-base-content/60 sm:flex-row">
                        <p>
                            © {new Date().getFullYear()} Smart School. All rights reserved.
                        </p>

                        <div className="flex gap-5">
                            <Link
                                to="/privacy"
                                className="hover:text-primary"
                            >
                                Privacy
                            </Link>

                            <Link
                                to="/terms"
                                className="hover:text-primary"
                            >
                                Terms
                            </Link>

                            <Link
                                to="/contact"
                                className="hover:text-primary"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;