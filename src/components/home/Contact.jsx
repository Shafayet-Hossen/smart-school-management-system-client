import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Temporary frontend submission.
    // This will later connect to your backend API.
    console.log("Contact form:", formData);

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      school: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-base-200/40 py-24 sm:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
            Contact Us
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Let's talk about
            <span className="block text-primary">
              your school
            </span>
          </h2>

          <p className="mt-5 text-base leading-8 text-base-content/60 sm:text-lg">
            Have questions about Smart School, subscriptions, features or
            implementation? Our team would be happy to hear from you.
          </p>
        </div>

        {/* Main Contact Area */}
        <div className="mt-16 grid gap-8 lg:grid-cols-5">

          {/* Contact Information */}
          <div className="lg:col-span-2">

            <div className="h-full rounded-3xl bg-neutral p-8 text-neutral-content shadow-xl sm:p-10">

              <span className="text-sm font-semibold uppercase tracking-widest text-primary-content/70">
                Get in touch
              </span>

              <h3 className="mt-4 text-3xl font-bold">
                We're here to help.
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-content/70">
                Whether you're a school administrator looking for a complete
                management solution or you simply want to learn more about
                Smart School, send us a message.
              </p>

              {/* Contact Items */}
              <div className="mt-10 space-y-7">

                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0-9.75 6.75L2.25 6.75"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-neutral-content/60">
                      support@smartschool.com
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.09l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.164a1.125 1.125 0 0 1-1.216.36 12.045 12.045 0 0 1-7.21-7.21 1.125 1.125 0 0 1 .36-1.216l1.164-.97c.333-.278.482-.719.417-1.173L6.75 3.852A1.125 1.125 0 0 0 5.66 3H4.5A2.25 2.25 0 0 0 2.25 5.25v1.5Z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Phone
                    </p>

                    <p className="mt-1 text-sm text-neutral-content/60">
                      +880 1XXX-XXXXXX
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 10.5-7.5 10.5S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Location
                    </p>

                    <p className="mt-1 text-sm text-neutral-content/60">
                      Dhaka, Bangladesh
                    </p>
                  </div>
                </div>

                {/* Support */}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.879 7.519c.9-.985 2.257-1.519 3.621-1.519 2.76 0 5 2.015 5 4.5s-2.24 4.5-5 4.5a5.3 5.3 0 0 1-2.266-.504L8 16.5l.504-2.234A4.337 4.337 0 0 1 7.5 10.5c0-1.09.438-2.105 1.19-2.981"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3.75A3.75 3.75 0 0 0 3 7.5c0 1.146.513 2.172 1.325 2.873L4.5 12l1.627-.175A3.74 3.74 0 0 0 9 8.25"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Support
                    </p>

                    <p className="mt-1 text-sm text-neutral-content/60">
                      Available for our customers
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-12 border-t border-neutral-content/10 pt-7">
                <p className="text-sm font-semibold">
                  Follow Smart School
                </p>

                <div className="mt-4 flex gap-3">
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-content/5 text-sm transition hover:bg-primary hover:text-primary-content"
                    aria-label="Facebook"
                  >
                    f
                  </a>

                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-content/5 text-sm transition hover:bg-primary hover:text-primary-content"
                    aria-label="LinkedIn"
                  >
                    in
                  </a>

                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-content/5 text-sm transition hover:bg-primary hover:text-primary-content"
                    aria-label="X"
                  >
                    X
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-10">

              <div className="mb-8">
                <h3 className="text-2xl font-bold">
                  Send us a message
                </h3>

                <p className="mt-2 text-sm text-base-content/60">
                  Fill out the form and we'll get back to you as soon as
                  possible.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 rounded-xl border border-success/20 bg-success/10 p-4 text-sm text-success">
                  Your message has been received. We'll get back to you soon.
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Name + Email */}
                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Your Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="input input-bordered w-full rounded-xl"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="input input-bordered w-full rounded-xl"
                    />
                  </div>
                </div>

                {/* School + Subject */}
                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label
                      htmlFor="school"
                      className="mb-2 block text-sm font-semibold"
                    >
                      School / Institution
                    </label>

                    <input
                      id="school"
                      name="school"
                      type="text"
                      value={formData.school}
                      onChange={handleChange}
                      placeholder="Your school name"
                      className="input input-bordered w-full rounded-xl"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Subject
                    </label>

                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="select select-bordered w-full rounded-xl"
                    >
                      <option value="">
                        Select a subject
                      </option>

                      <option value="demo">
                        Request a Demo
                      </option>

                      <option value="pricing">
                        Pricing & Subscription
                      </option>

                      <option value="sales">
                        Sales Inquiry
                      </option>

                      <option value="technical">
                        Technical Support
                      </option>

                      <option value="general">
                        General Inquiry
                      </option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    required
                    rows={6}
                    className="textarea textarea-bordered w-full rounded-xl"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-full rounded-xl sm:w-auto sm:px-10"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-3xl border border-primary/10 bg-primary/5 px-6 py-10 text-center sm:px-10">
          <h3 className="text-2xl font-bold">
            Ready to modernize your school?
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-base-content/60">
            Explore our plans and find the right solution for your school's
            needs.
          </p>

          <a
            href="/pricing"
            className="btn btn-primary mt-6 rounded-xl px-8"
          >
            Explore Pricing
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;