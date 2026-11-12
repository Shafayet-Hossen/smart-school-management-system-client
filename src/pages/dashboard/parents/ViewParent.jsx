import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api.js";

const ViewParent = () => {
  const { parentId } = useParams();
  const navigate = useNavigate();

  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Fetch parent
   */
  const fetchParent = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/parents/${parentId}`
      );

      if (response.data?.success) {
        setParent(response.data.data);
      } else {
        setError(
          response.data?.message ||
            "Failed to load parent."
        );
      }
    } catch (error) {
      console.error(
        "Failed to fetch parent:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load parent."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (parentId) {
      fetchParent();
    }
  }, [parentId]);

  /**
   * Full name
   */
  const getParentName = () => {
    if (!parent) {
      return "";
    }

    return (
      `${parent.first_name || ""} ${
        parent.last_name || ""
      }`.trim() || "Unnamed Parent"
    );
  };

  /**
   * Relationship label
   */
  const getRelationshipLabel = (
    relationship
  ) => {
    if (!relationship) {
      return "-";
    }

    return (
      relationship.charAt(0).toUpperCase() +
      relationship.slice(1)
    );
  };

  /**
   * Status badge
   */
  const getStatusBadge = (status) => {
    if (status === "active") {
      return (
        <span className="badge badge-success">
          Active
        </span>
      );
    }

    if (status === "inactive") {
      return (
        <span className="badge badge-error">
          Inactive
        </span>
      );
    }

    return (
      <span className="badge badge-ghost">
        {status || "Unknown"}
      </span>
    );
  };

  /**
   * Registration badge
   */
  const getRegistrationBadge = (
    registrationStatus
  ) => {
    if (
      registrationStatus === "registered"
    ) {
      return (
        <span className="badge badge-success">
          Registered
        </span>
      );
    }

    return (
      <span className="badge badge-warning">
        Not Registered
      </span>
    );
  };

  /**
   * Format date
   */
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    } catch {
      return "-";
    }
  };

  /**
   * Loading
   */
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>

            <p className="mt-3 text-base-content/60">
              Loading parent information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Error
   */
  if (error || !parent) {
    return (
      <div className="p-6">
        <div className="alert alert-error mb-6">
          <span>
            {error || "Parent not found."}
          </span>
        </div>

        <button
          type="button"
          className="btn btn-outline"
          onClick={() =>
            navigate("/school-admin/parents")
          }
        >
          ← Back to Parents
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          {/* <div className="breadcrumbs text-sm mb-2">
            <ul>
              <li>
                <Link
                  to="/parents"
                  className="text-primary"
                >
                  Parents
                </Link>
              </li>

              <li>
                {getParentName()}
              </li>
            </ul>
          </div> */}

          <h1 className="text-3xl font-bold">
            {getParentName()}
          </h1>

          <p className="text-base-content/60 mt-1">
            Parent profile and associated
            student information.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/school-admin/parents"
            className="btn btn-outline"
          >
            ← Back
          </Link>

          <Link
            to={`/school-admin/parents/${parentId}/edit`}
            className="btn btn-warning"
          >
            Edit Parent
          </Link>
        </div>
      </div>


      {/* =====================================================
          PROFILE SUMMARY
      ====================================================== */}
      <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-24">
                <span className="text-3xl font-bold">
                  {parent.first_name
                    ?.charAt(0)
                    ?.toUpperCase() || "P"}
                </span>
              </div>
            </div>

            {/* Basic information */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {getParentName()}
              </h2>

              <div className="flex flex-wrap gap-2 mt-3">
                {getStatusBadge(
                  parent.status
                )}

                {getRegistrationBadge(
                  parent.registration_status
                )}

                <span className="badge badge-outline">
                  {getRelationshipLabel(
                    parent.relationship
                  )}
                </span>
              </div>

              <div className="mt-4 text-sm text-base-content/60">
                Parent record created on{" "}
                {formatDate(
                  parent.created_at
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* =====================================================
          PERSONAL INFORMATION
      ====================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Personal Information */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title mb-4">
              Personal Information
            </h2>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-base-content/60">
                  First Name
                </div>

                <div className="font-medium">
                  {parent.first_name ||
                    "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-base-content/60">
                  Last Name
                </div>

                <div className="font-medium">
                  {parent.last_name ||
                    "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-base-content/60">
                  Gender
                </div>

                <div className="font-medium capitalize">
                  {parent.gender ||
                    "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-base-content/60">
                  Occupation
                </div>

                <div className="font-medium">
                  {parent.occupation ||
                    "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-base-content/60">
                  Relationship
                </div>

                <div className="font-medium">
                  {getRelationshipLabel(
                    parent.relationship
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Contact Information */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title mb-4">
              Contact Information
            </h2>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-base-content/60">
                  Phone
                </div>

                <div className="font-medium">
                  {parent.phone ||
                    "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-base-content/60">
                  Email
                </div>

                <div className="font-medium break-all">
                  {parent.email ||
                    "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-base-content/60">
                  Address
                </div>

                <div className="font-medium whitespace-pre-line">
                  {parent.address ||
                    "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* =====================================================
          ACCOUNT INFORMATION
      ====================================================== */}
      <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
        <div className="card-body">
          <h2 className="card-title mb-4">
            Account Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-base-content/60">
                Account Status
              </div>

              <div className="mt-2">
                {getStatusBadge(
                  parent.status
                )}
              </div>
            </div>

            <div>
              <div className="text-sm text-base-content/60">
                Registration Status
              </div>

              <div className="mt-2">
                {getRegistrationBadge(
                  parent.registration_status
                )}
              </div>
            </div>

            <div>
              <div className="text-sm text-base-content/60">
                Firebase Account
              </div>

              <div className="mt-2">
                {parent.firebase_uid ? (
                  <span className="badge badge-success">
                    Connected
                  </span>
                ) : (
                  <span className="badge badge-ghost">
                    Not Connected
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* =====================================================
          ASSOCIATED STUDENTS
      ====================================================== */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body p-0">
          {/* Section header */}
          <div className="p-6 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">
                  Associated Students
                </h2>

                <p className="text-sm text-base-content/60 mt-1">
                  Students associated with this
                  parent.
                </p>
              </div>

              <div className="badge badge-primary">
                {parent.students?.length ||
                  0}{" "}
                Student
                {(parent.students?.length ||
                  0) !== 1
                  ? "s"
                  : ""}
              </div>
            </div>
          </div>


          {/* Students */}
          {parent.students?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Student ID</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Roll</th>
                  </tr>
                </thead>

                <tbody>
                  {parent.students.map(
                    (
                      student,
                      index
                    ) => (
                      <tr
                        key={student._id}
                        className="hover"
                      >
                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <div className="font-semibold">
                            {
                              student.first_name
                            }{" "}
                            {
                              student.last_name
                            }
                          </div>
                        </td>

                        <td>
                          <span className="font-mono text-sm">
                            {
                              student.student_id
                            }
                          </span>
                        </td>

                        <td>
                          {
                            student.class_code ||
                            "-"
                          }
                        </td>

                        <td>
                          {
                            student.section_name ||
                            "-"
                          }
                        </td>

                        <td>
                          {
                            student.roll_number ||
                            "-"
                          }
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 pt-2">
              <div className="alert">
                <span>
                  No students are currently
                  associated with this parent.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* =====================================================
          FOOTER ACTIONS
      ====================================================== */}
      <div className="flex flex-wrap justify-end gap-3 mt-6">
        <Link
          to="/school-admin/parents"
          className="btn btn-outline"
        >
          Back to Parents
        </Link>

        <Link
          to={`/school-admin/parents/${parentId}/edit`}
          className="btn btn-warning"
        >
          Edit Parent
        </Link>
      </div>
    </div>
  );
};

export default ViewParent;