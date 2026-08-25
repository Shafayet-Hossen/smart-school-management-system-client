// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";

// const Register = () => {
//   const navigate = useNavigate();
//   const { createFirebaseUser, loading, setLoading } = useAuth();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     const {
//       name,
//       email,
//       password,
//       confirmPassword,
//     } = formData;

//     if (!name || !email || !password || !confirmPassword) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }
//     console.log("email:",formData.email);
//     console.log("name:",formData.name);
//     console.log("password:",formData.password);
//     try {
//       setLoading(true);

//       const { firebaseUser, user, accessToken } =
//         await createFirebaseUser(
//           formData.email,
//           formData.password,{
//             displayName: formData.name,
//           }
//         );

//       console.log(
//         "Firebase ID Token create User:",
//         accessToken
//       );
//       console.log(
//         "User Create successful:",
//         user
//       );

//       navigate("/dashboard");

//     } catch (error) {
//       console.error("Registration error:", error);

//       switch (error.code) {
//         case "auth/email-already-in-use":
//           setError(
//             "An account already exists with this email."
//           );
//           break;

//         case "auth/invalid-email":
//           setError("Invalid email address.");
//           break;

//         case "auth/weak-password":
//           setError("Password is too weak.");
//           break;

//         default:
//           setError(
//             "Failed to create account. Please try again."
//           );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">

//       <div className="card w-full max-w-md bg-base-100 shadow-xl">

//         <div className="card-body">

//           <h1 className="text-3xl font-bold text-center">
//             Create Account
//           </h1>

//           <p className="text-center text-base-content/70 mb-4">
//             Create your Smart School account
//           </p>

//           {error && (
//             <div className="alert alert-error mb-4">
//               <span>{error}</span>
//             </div>
//           )}

//           {success && (
//             <div className="alert alert-success mb-4">
//               <span>{success}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>

//             {/* Name */}
//             <div className="form-control mb-4">
//               <label className="label">
//                 <span className="label-text">
//                   Full Name
//                 </span>
//               </label>

//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Enter your full name"
//                 className="input input-bordered w-full"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Email */}
//             <div className="form-control mb-4">
//               <label className="label">
//                 <span className="label-text">
//                   Email
//                 </span>
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 className="input input-bordered w-full"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Password */}
//             <div className="form-control mb-4">
//               <label className="label">
//                 <span className="label-text">
//                   Password
//                 </span>
//               </label>

//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Enter password"
//                 className="input input-bordered w-full"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Confirm Password */}
//             <div className="form-control mb-6">
//               <label className="label">
//                 <span className="label-text">
//                   Confirm Password
//                 </span>
//               </label>

//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm password"
//                 className="input input-bordered w-full"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Register Button */}
//             <button
//               type="submit"
//               className="btn btn-primary w-full"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="loading loading-spinner"></span>
//                   Creating Account...
//                 </>
//               ) : (
//                 "Create Account"
//               )}
//             </button>

//           </form>

//           {/* Login Link */}
//           <div className="text-center mt-6">

//             <span className="text-base-content/70">
//               Already have an account?
//             </span>

//             <Link
//               to="/login"
//               className="link link-primary ml-2"
//             >
//               Login
//             </Link>

//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

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