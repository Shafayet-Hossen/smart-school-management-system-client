import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api.js";

function Classes() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedClass, setSelectedClass] = useState(null);

  const [showSectionModal, setShowSectionModal] = useState(false);

  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(false);

  const [sectionName, setSectionName] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");

  const [addingSection, setAddingSection] = useState(false);

  const [deletingClassId, setDeletingClassId] = useState(null);
  const [deletingSectionId, setDeletingSectionId] = useState(null);

  // --------------------------------------------------
  // Fetch Classes
  // --------------------------------------------------
  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/classes");

      if (response.data?.success) {
        console.log("Fetched classes:", response.data.data);
        setClasses(response.data.data || []);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.error("Failed to fetch classes:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load classes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Initial Load
  // --------------------------------------------------
  useEffect(() => {
    fetchClasses();
  }, []);

  // --------------------------------------------------
  // Open Section Modal
  // --------------------------------------------------
  const openSectionModal = async (classItem) => {
    setSelectedClass(classItem);
    setShowSectionModal(true);

    setSectionName("");
    setSectionDescription("");

    await fetchSections(classItem._id);
  };

  // --------------------------------------------------
  // Close Section Modal
  // --------------------------------------------------
  const closeSectionModal = () => {
    setShowSectionModal(false);
    setSelectedClass(null);
    setSections([]);

    setSectionName("");
    setSectionDescription("");
  };

  // --------------------------------------------------
  // Fetch Sections
  // --------------------------------------------------
  const fetchSections = async (classId) => {
    try {
      setLoadingSections(true);

      const response = await api.get(
        `/sections/classes/${classId}`
      );

      if (response.data?.success) {
        setSections(response.data.data || []);
      } else {
        setSections([]);
      }
    } catch (err) {
      console.error("Failed to fetch sections:", err);

      setSections([]);

      setError(
        err.response?.data?.message ||
          "Failed to load sections."
      );
    } finally {
      setLoadingSections(false);
    }
  };

  // --------------------------------------------------
  // Add Section
  // --------------------------------------------------
  const handleAddSection = async (event) => {
    event.preventDefault();

    if (!sectionName.trim()) {
      return;
    }

    if (!selectedClass) {
      return;
    }

    try {
      setAddingSection(true);
      setError("");

      const payload = {
        name: sectionName.trim(),
        description: sectionDescription.trim(),
        status: "active",
      };

      const response = await api.post(
        `/sections/classes/${selectedClass._id}`,
        payload
      );

      if (response.data?.success) {
        setSectionName("");
        setSectionDescription("");

        await fetchSections(selectedClass._id);

        // Refresh class list because section count may change
        await fetchClasses();
      }
    } catch (err) {
      console.error("Add section error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to add section."
      );
    } finally {
      setAddingSection(false);
    }
  };

  // --------------------------------------------------
  // Delete Section
  // --------------------------------------------------
  const handleDeleteSection = async (sectionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this section?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingSectionId(sectionId);
      setError("");

      const response = await api.delete(
        `/sections/${sectionId}`
      );

      if (response.data?.success) {
        await fetchSections(selectedClass._id);
        await fetchClasses();
      }
    } catch (err) {
      console.error("Delete section error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete section."
      );
    } finally {
      setDeletingSectionId(null);
    }
  };

  // --------------------------------------------------
  // Delete Class
  // --------------------------------------------------
  const handleDeleteClass = async (classId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this class?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingClassId(classId);
      setError("");

      const response = await api.delete(
        `/classes/${classId}`
      );

      if (response.data?.success) {
        setClasses((previous) =>
          previous.filter((item) => item._id !== classId)
        );
      }
    } catch (err) {
      console.error("Delete class error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete class."
      );
    } finally {
      setDeletingClassId(null);
    }
  };

  // --------------------------------------------------
  // Render Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="breadcrumbs text-sm">
              <ul>
                <li>Academic</li>
                <li>Classes</li>
              </ul>
            </div>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Classes
            </h1>

            <p className="mt-1 text-sm text-base-content/60">
              Manage your school's classes and sections.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/classes/add")}
            className="btn btn-primary"
          >
            <span className="text-lg">+</span>
            Add Class
          </button>
        </div>

        {/* ========================================= */}
        {/* ERROR */}
        {/* ========================================= */}

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="btn btn-sm btn-ghost"
            >
              ✕
            </button>
          </div>
        )}

        {/* ========================================= */}
        {/* SUMMARY */}
        {/* ========================================= */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-sm text-base-content/50">
              Total Classes
            </p>

            <p className="mt-2 text-3xl font-bold">
              {classes.length}
            </p>
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-sm text-base-content/50">
              Active Classes
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                classes.filter(
                  (item) => item.status === "active"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-sm text-base-content/50">
              Inactive Classes
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                classes.filter(
                  (item) => item.status === "inactive"
                ).length
              }
            </p>
          </div>
        </div>

        {/* ========================================= */}
        {/* EMPTY STATE */}
        {/* ========================================= */}

        {classes.length === 0 ? (
          <div className="rounded-2xl border border-base-300 bg-base-100 px-6 py-16 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
              🏫
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No Classes Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
              You haven't created any classes yet. Create your
              first class to start managing students and sections.
            </p>

            <button
              type="button"
              onClick={() => navigate("/classes/add")}
              className="btn btn-primary mt-6"
            >
              + Add Your First Class
            </button>
          </div>
        ) : (
          /* ========================================= */
          /* CLASS TABLE */
          /* ========================================= */

          <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">

            <div className="overflow-x-auto">
              <table className="table">

                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Sections</th>
                    <th className="text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {classes.map((classItem) => (
                    <tr key={classItem._id}>

                      {/* Class Name */}
                      <td>
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
                            🏫
                          </div>

                          <div>
                            <p className="font-semibold">
                              {classItem.name}
                            </p>

                            <p className="text-xs text-base-content/50">
                              Class
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td>
                        <span className="text-sm text-base-content/70">
                          {classItem.description || "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        {classItem.status === "active" ? (
                          <span className="badge badge-success badge-outline">
                            Active
                          </span>
                        ) : (
                          <span className="badge badge-error badge-outline">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Sections */}
                      <td>
                        <span className="badge badge-neutral">
                          {classItem.section_count || 0}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openSectionModal(classItem)
                            }
                            className="btn btn-sm btn-outline"
                          >
                            Sections
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/classes/${classItem._id}/edit`
                              )
                            }
                            className="btn btn-sm btn-ghost"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteClass(
                                classItem._id
                              )
                            }
                            disabled={
                              deletingClassId ===
                              classItem._id
                            }
                            className="btn btn-sm btn-error btn-outline"
                          >
                            {deletingClassId ===
                            classItem._id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Delete"
                            )}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================= */}
      {/* SECTION MODAL */}
      {/* ========================================= */}

      {showSectionModal && selectedClass && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">

              <div>
                <h3 className="text-xl font-bold">
                  Manage Sections
                </h3>

                <p className="mt-1 text-sm text-base-content/60">
                  {selectedClass.name}
                </p>
              </div>

              <button
                type="button"
                onClick={closeSectionModal}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            {/* ================================= */}
            {/* Add Section */}
            {/* ================================= */}

            <div className="mt-6 rounded-xl border border-base-300 bg-base-200 p-4">

              <h4 className="font-semibold">
                Add Section
              </h4>

              <form
                onSubmit={handleAddSection}
                className="mt-4 space-y-4"
              >

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* Section Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Section Name *
                      </span>
                    </label>

                    <input
                      type="text"
                      value={sectionName}
                      onChange={(event) =>
                        setSectionName(event.target.value)
                      }
                      placeholder="e.g. A"
                      className="input input-bordered w-full bg-base-100"
                      disabled={addingSection}
                    />
                  </div>

                  {/* Description */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Description
                      </span>
                    </label>

                    <input
                      type="text"
                      value={sectionDescription}
                      onChange={(event) =>
                        setSectionDescription(
                          event.target.value
                        )
                      }
                      placeholder="Morning section"
                      className="input input-bordered w-full bg-base-100"
                      disabled={addingSection}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={
                      addingSection ||
                      !sectionName.trim()
                    }
                    className="btn btn-primary btn-sm"
                  >
                    {addingSection ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        + Add Section
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* ================================= */}
            {/* Section List */}
            {/* ================================= */}

            <div className="mt-6">

              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold">
                  Sections
                </h4>

                <span className="badge badge-neutral">
                  {sections.length}
                </span>
              </div>

              {loadingSections ? (
                <div className="flex justify-center py-10">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : sections.length === 0 ? (
                <div className="rounded-xl border border-dashed border-base-300 p-8 text-center">

                  <div className="text-3xl">
                    📚
                  </div>

                  <p className="mt-3 font-medium">
                    No sections yet
                  </p>

                  <p className="mt-1 text-sm text-base-content/50">
                    Add a section using the form above.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">

                  {sections.map((section) => (
                    <div
                      key={section._id}
                      className="flex items-center justify-between rounded-xl border border-base-300 p-4"
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 font-bold">
                          {section.name}
                        </div>

                        <div>
                          <p className="font-semibold">
                            Section {section.name}
                          </p>

                          {section.description && (
                            <p className="text-sm text-base-content/50">
                              {section.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteSection(
                            section._id
                          )
                        }
                        disabled={
                          deletingSectionId ===
                          section._id
                        }
                        className="btn btn-sm btn-error btn-outline"
                      >
                        {deletingSectionId ===
                        section._id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ================================= */}
            {/* Modal Actions */}
            {/* ================================= */}

            <div className="modal-action">
              <button
                type="button"
                onClick={closeSectionModal}
                className="btn"
              >
                Close
              </button>
            </div>

          </div>

          {/* Modal Backdrop */}
          <div
            className="modal-backdrop"
            onClick={closeSectionModal}
          ></div>
        </div>
      )}
    </div>
  );
}

export default Classes;