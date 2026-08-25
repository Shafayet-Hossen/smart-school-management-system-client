import { useEffect, useState } from "react";
import api from "../../services/api.js";

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log("dashboard")
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        console.log("dashboard")
        const response =
          await api.get("/student/dashboard");
        console.log("dashboard response",response);
        setDashboard(response.data.data);

      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
          "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-error">
        {error}
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Welcome, {dashboard.student.name}
        </h1>

        <p className="text-base-content/60">
          Student Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">
              Total Assignments
            </h2>

            <p className="text-3xl font-bold">
              {dashboard.assignments.total}
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">
              Submitted
            </h2>

            <p className="text-3xl font-bold">
              {dashboard.assignments.submitted}
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">
              Graded
            </h2>

            <p className="text-3xl font-bold">
              {dashboard.assignments.graded}
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">
              Pending
            </h2>

            <p className="text-3xl font-bold">
              {dashboard.assignments.pending}
            </p>
          </div>
        </div>

      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">

          <h2 className="card-title">
            Upcoming Assignments
          </h2>

          <div className="overflow-x-auto">

            <table className="table">

              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {dashboard.upcoming_assignments.map(
                  (assignment) => (
                    <tr
                      key={
                        assignment.assignment_id
                      }
                    >
                      <td>
                        {assignment.title}
                      </td>

                      <td>
                        {new Date(
                          assignment.due_date
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        <span className="badge badge-warning">
                          Pending
                        </span>
                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>
      </div>

    </div>
  );
};

export default StudentDashboard;