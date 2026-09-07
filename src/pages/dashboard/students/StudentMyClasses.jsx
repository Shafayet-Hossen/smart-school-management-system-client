import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api.js";

const StudentMyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    // console.log("Fetching student classes...");
    const loadClasses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/student/classes");

        if (mounted) {
          setClasses(response.data?.data || []);
        }
      } catch (err) {
        console.error("Failed to load student classes:", err);

        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Failed to load your class information."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadClasses();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 p-6">
        <div className="flex min-h-60 items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            My Classes
          </h1>

          <p className="mt-1 text-sm text-base-content/60">
            View your enrolled class, section, and class teacher.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* No class */}
        {!error && classes.length === 0 && (
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center py-16 text-center">
              <div className="mb-4 text-5xl">
                📚
              </div>

              <h2 className="text-xl font-semibold">
                No Class Assigned
              </h2>

              <p className="mt-2 max-w-md text-sm text-base-content/60">
                You have not been assigned to a class or section yet.
                Please contact your school administrator.
              </p>
            </div>
          </div>
        )}

        {/* Classes */}
        {classes.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((classItem) => (
              <div
                key={classItem._id}
                className="card bg-base-100 shadow-md"
              >
                <div className="card-body">

                  {/* Class */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-base-content/60">
                        Class
                      </p>

                      <h2 className="text-2xl font-bold">
                        {classItem.name}
                      </h2>
                    </div>

                    <div className="badge badge-success">
                      Active
                    </div>
                  </div>

                  {/* Description */}
                  {classItem.description && (
                    <p className="mt-2 text-sm text-base-content/60">
                      {classItem.description}
                    </p>
                  )}

                  <div className="divider my-2" />

                  {/* Section */}
                  {classItem.section ? (
                    <>
                      <div>
                        <p className="text-sm text-base-content/60">
                          Section
                        </p>

                        <p className="text-lg font-semibold">
                          {classItem.section.name}
                        </p>
                      </div>

                      {/* Teacher */}
                      <div className="mt-4">
                        <p className="text-sm text-base-content/60">
                          Class Teacher
                        </p>

                        {classItem.section.teacher ? (
                          <>
                            <p className="font-medium">
                              {classItem.section.teacher.name}
                            </p>

                            {classItem.section.teacher.email && (
                              <p className="text-sm text-base-content/60">
                                {classItem.section.teacher.email}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-warning">
                            No teacher assigned
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="alert alert-warning mt-2">
                      <span>
                        No section assigned.
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="card-actions mt-5">
                    <Link
                      to="/assignments"
                      className="btn btn-primary btn-sm w-full"
                    >
                      View Assignments
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentMyClasses;