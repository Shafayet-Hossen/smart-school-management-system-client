import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleStartRegistration = () => {
    navigate("/register/role");
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-base-100 shadow-2xl lg:grid-cols-2">

          {/* Left Side */}
          <div className="hidden bg-primary p-12 text-primary-content lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-content/10 text-xl font-bold">
                  S
                </div>

                <span className="text-xl font-bold">
                  Smart School
                </span>
              </div>

              <div className="mt-20">
                <h1 className="text-4xl font-extrabold leading-tight">
                  Build a smarter,
                  <br />
                  connected school.
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-primary-content/70">
                  Create your Smart School account and connect with your
                  school community through one powerful platform.
                </p>
              </div>
            </div>

            <p className="text-sm text-primary-content/50">
              Smart School SaaS Platform
            </p>
          </div>

          {/* Right Side */}
          <div className="p-8 sm:p-12">
            <div className="mx-auto max-w-md">

              {/* Mobile Logo */}
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content font-bold">
                  S
                </div>

                <span className="text-xl font-bold">
                  Smart School
                </span>
              </div>

              {/* Header */}
              <div>
                <span className="text-sm font-semibold text-primary">
                  CREATE ACCOUNT
                </span>

                <h2 className="mt-3 text-3xl font-extrabold">
                  Welcome to Smart School
                </h2>

                <p className="mt-3 text-sm leading-6 text-base-content/60">
                  Let's get started by understanding how you are connected
                  to your school.
                </p>
              </div>

              {/* Start */}
              <button
                onClick={handleStartRegistration}
                className="btn btn-primary mt-10 w-full rounded-xl"
              >
                Get Started
              </button>

              {/* Login */}
              <p className="mt-6 text-center text-sm text-base-content/60">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-semibold text-primary hover:underline"
                >
                  Login
                </button>
              </p>

              {/* Security note */}
              <div className="mt-10 rounded-xl border border-base-300 bg-base-200/50 p-4">
                <p className="text-xs leading-5 text-base-content/60">
                  Your account information will be securely verified before
                  you receive access to a school.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;