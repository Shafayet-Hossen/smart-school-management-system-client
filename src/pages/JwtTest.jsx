import { useState } from "react";
import { apiRequest } from "../services/api.service.js";

const JwtTest = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const testJwt = async () => {
    try {
      setError("");

      const data = await apiRequest(
        "/auth/jwt-test"
      );

      setResult(data);
    } catch (error) {
      console.error(error);

      setError(error.message);
      setResult(null);
    }
  };

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold">
        JWT API Test
      </h1>

      <button
        onClick={testJwt}
        className="btn btn-primary mt-4"
      >
        Test JWT
      </button>

      {error && (
        <div className="alert alert-error mt-4">
          {error}
        </div>
      )}

      {result && (
        <pre className="bg-base-200 p-4 mt-4 rounded-lg">
          {JSON.stringify(
            result,
            null,
            2
          )}
        </pre>
      )}

    </div>
  );
};

export default JwtTest;