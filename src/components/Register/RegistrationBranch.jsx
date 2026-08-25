import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRegistration } from "../../context/RegistrationContext.jsx";

function RegistrationBranch() {
  const { role } = useParams();
  const navigate = useNavigate();

  console.log("Registration Branch",role)
  
  const { registrationData, updateField } = useRegistration();

  useEffect(() => {
    if (!role) {
      navigate("/register/role", { replace: true });
      return;
    }

    const validRoles = [
      "school_admin",
      "teacher",
      "student",
      "parent",
    ];

    if (!validRoles.includes(role)) {
      navigate("/register/role", { replace: true });
      return;
    }

    // Keep Context synchronized with the URL.
    if (registrationData.role !== role) {
      updateField("role", role);
    }
  }, [
    role,
    registrationData.role,
    updateField,
    navigate,
  ]);

  useEffect(() => {
    if (role === "school_admin") {
      navigate("/register/school_admin", {
        replace: true,
      });

      return;
    }

    if (role === "teacher") {
      navigate("/register/teacher", {
        replace: true,
      });

      return;
    }

    if (role === "student") {
      navigate("/register/student", {
        replace: true,
      });

      return;
    }

    if (role === "parent") {
      navigate("/register/parent", {
        replace: true,
      });
    }
  }, [role, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );
}

export default RegistrationBranch;