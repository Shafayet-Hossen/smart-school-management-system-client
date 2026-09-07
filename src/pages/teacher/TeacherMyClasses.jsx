import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";

const TeacherMyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/teachers/classes");

        console.log("Teacher classes response:", response.data.data);

        if (response.data.success) {
          setClasses(response.data.data || []);
        } else {
          setError(
            response.data.message || "Failed to load your classes."
          );
        }
      } catch (err) {
        console.error("Failed to load teacher classes:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load your classes."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyClasses();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            My Classes
          </h1>

          <p className="mt-1 text-base-content/60">
            View the classes and sections assigned to you.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!error && classes.length === 0 && (
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body items-center py-16 text-center">
            <div className="mb-4 text-5xl">
              📚
            </div>

            <h2 className="card-title text-xl">
              No Classes Assigned
            </h2>

            <p className="max-w-md text-base-content/60">
              You currently don't have any classes or sections
              assigned to you.
            </p>
          </div>
        </div>
      )}

      {/* Classes */}
      {classes.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((classItem) => (
            <div
              key={classItem._id}
              className="card border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="card-body">
                {/* Class Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="card-title text-xl">
                      {classItem.name}
                    </h2>

                    {classItem.description && (
                      <p className="mt-1 text-sm text-base-content/60">
                        {classItem.description}
                      </p>
                    )}
                  </div>

                  <div className="badge badge-primary">
                    {classItem.sections?.length || 0} Section
                    {(classItem.sections?.length || 0) !== 1
                      ? "s"
                      : ""}
                  </div>
                </div>

                {/* Sections */}
                <div className="mt-5 space-y-3">
                  {classItem.sections?.map((section) => (
                    <div
                      key={section._id}
                      className="rounded-lg border border-base-300 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            Section {section.name}
                          </h3>

                          <p className="mt-1 text-sm text-base-content/60">
                            {section.student_count} student
                            {section.student_count !== 1
                              ? "s"
                              : ""}
                          </p>
                        </div>

                        <Link
                          to={`/my-classes/${classItem._id}/${section._id}`}
                          className="btn btn-sm btn-primary"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherMyClasses;