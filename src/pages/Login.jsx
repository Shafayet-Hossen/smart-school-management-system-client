import { useState } from "react";
// import api from "../services/api.js";
// import { loginUser,} from "../services/auth.service.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const { login, loading, setLoading } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setLoading(true);
  
    setError("");

    try {
      const {user, accessToken} =
        await login(
          email,
          password
        );

      console.log(
        "Firebase ID Token:",
        accessToken
      );
      console.log(
        "Login successful:",
        user
      );

      // await testBackendAuth();

      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      setError(
        error.message
      );
    } finally {
      setLoading(false);
    }
  };
  // const testBackendAuth = async () => {
  //   try {
  //     const response = await api.get(
  //       "/auth-test/me"
  //     );

  //     console.log(
  //       "Backend response:",
  //       response.data
  //     );
  //   } catch (error) {
  //     console.error(
  //       "Backend authentication failed:",
  //       error.response?.data ||
  //       error.message
  //     );
  //   }
  // };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center">
            Smart School
          </h1>

          <p className="text-center text-base-content/70">
            Sign in to your account
          </p>

          {error && (
            <div className="alert alert-error mt-4">
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4 mt-4"
          >
            <div>
              <label className="label">
                <span className="label-text">
                  Email
                </span>
              </label>

              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">
                  Password
                </span>
              </label>

              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>
          <div className="text-center mt-6">

            <p className="text-base-content/70">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="btn btn-outline btn-primary w-full mt-3"
            >
              Register an Account
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;