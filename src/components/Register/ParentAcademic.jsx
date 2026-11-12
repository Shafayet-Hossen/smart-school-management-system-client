import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api.js";
import { useRegistration } from "../../context/RegistrationContext.jsx";

const createEmptyChild = () => ({
  childId: crypto.randomUUID(),
  student_roll: "",
  class_id: "",
  class_name: "",
  section_id: "",
  section_name: "",
  student: null,
  lookupStatus: "idle",
  lookupMessage: "",
});

const getId = (item) => String(item?._id ?? item?.id ?? "");

const getClassName = (item) =>
  item?.class_name ?? item?.name ?? item?.class_code ?? "Class";

const getSectionName = (item) =>
  item?.section_name ?? item?.name ?? item?.section_code ?? "Section";

export default function ParentAcademic() {
  const navigate = useNavigate();
  const { registrationData, updateField } = useRegistration();

  const schoolId = registrationData?.school_id;

  const [classes, setClasses] = useState([]);
  const [children, setChildren] = useState(() => {
    if (
      Array.isArray(registrationData?.children) &&
      registrationData.children.length
    ) {
      return registrationData.children.map((child) => ({
        ...createEmptyChild(),
        ...child,
        childId: child.childId || crypto.randomUUID(),
        student: child.student || null,
        lookupStatus: "idle",
        lookupMessage: "",
      }));
    }

    return [createEmptyChild()];
  });

  const [sectionsByChild, setSectionsByChild] = useState({});
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingSections, setLoadingSections] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load the classes belonging to the selected school.
  useEffect(() => {
    let cancelled = false;

    async function fetchClasses() {
      if (!schoolId) {
        setClasses([]);
        setLoadingClasses(false);
        return;
      }

      setLoadingClasses(true);
      setError("");

      try {
        const response = await api.get(
          `/auth/schools/${schoolId}/classes`
        );

        if (!cancelled) {
          setClasses(response.data?.classes ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load classes."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingClasses(false);
        }
      }
    }

    fetchClasses();

    return () => {
      cancelled = true;
    };
  }, [schoolId]);

  // Fetch sections for a particular class.
  const fetchSections = async (childId, classId) => {
    if (!classId) return;

    setLoadingSections((previous) => ({
      ...previous,
      [childId]: true,
    }));

    try {
      const response = await api.get(
        `/auth/classes/${classId}/sections`
      );

      setSectionsByChild((previous) => ({
        ...previous,
        [childId]: response.data?.sections ?? [],
      }));
    } catch (err) {
      setSectionsByChild((previous) => ({
        ...previous,
        [childId]: [],
      }));

      setError(
        err.response?.data?.message ||
          "Unable to load sections."
      );
    } finally {
      setLoadingSections((previous) => ({
        ...previous,
        [childId]: false,
      }));
    }
  };

  // Restore section options when a saved registration is reopened.
  useEffect(() => {
    if (!classes.length) return;

    children.forEach((child) => {
      if (
        child.class_id &&
        !sectionsByChild[child.childId]
      ) {
        fetchSections(child.childId, child.class_id);
      }
    });

    // Initial restoration after classes load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes]);

  const updateChild = (childId, changes) => {
    setChildren((previous) =>
      previous.map((child) =>
        child.childId === childId
          ? { ...child, ...changes }
          : child
      )
    );
  };

  const handleClassChange = async (childId, classId) => {
    const selectedClass = classes.find(
      (item) => getId(item) === classId
    );

    updateChild(childId, {
      class_id: classId,
      class_name: selectedClass
        ? getClassName(selectedClass)
        : "",
      section_id: "",
      section_name: "",
      student_roll: "",
      student: null,
      lookupStatus: "idle",
      lookupMessage: "",
    });

    setSectionsByChild((previous) => ({
      ...previous,
      [childId]: [],
    }));

    setError("");

    if (classId) {
      await fetchSections(childId, classId);
    }
  };

  const handleSectionChange = (childId, sectionId) => {
    const sections = sectionsByChild[childId] ?? [];

    const selectedSection = sections.find(
      (item) => getId(item) === sectionId
    );

    updateChild(childId, {
      section_id: sectionId,
      section_name: selectedSection
        ? getSectionName(selectedSection)
        : "",
      student_roll: "",
      student: null,
      lookupStatus: "idle",
      lookupMessage: "",
    });

    setError("");
  };

  const handleRollChange = (childId, roll) => {
    updateChild(childId, {
      student_roll: roll,
      student: null,
      lookupStatus: "idle",
      lookupMessage: "",
    });
  };

  // Look up the student using school + class + section + roll.
  const findStudent = async (childId) => {
    const child = children.find(
      (item) => item.childId === childId
    );

    if (!child) return;

    if (!schoolId || !child.class_id || !child.section_id) {
      updateChild(childId, {
        lookupStatus: "error",
        lookupMessage:
          "Please select the class and section first.",
      });
      return;
    }

    if (!child.student_roll.trim()) {
      updateChild(childId, {
        lookupStatus: "error",
        lookupMessage: "Please enter the student's roll number.",
      });
      return;
    }

    updateChild(childId, {
      student: null,
      lookupStatus: "loading",
      lookupMessage: "",
    });

    try {
      const response = await api.get(
        `/auth/schools/${schoolId}/students/lookup`,
        {
          params: {
            class_id: child.class_id,
            section_id: child.section_id,
            student_roll: child.student_roll.trim(),
          },
        }
      );

      const student = response.data?.student;

      if (!student) {
        updateChild(childId, {
          student: null,
          lookupStatus: "error",
          lookupMessage:
            "No student was found with this class, section, and roll number.",
        });
        return;
      }

      updateChild(childId, {
        student,
        student_roll: String(
          student.roll_number ?? child.student_roll
        ),
        lookupStatus: "success",
        lookupMessage: "Student found successfully.",
      });
    } catch (err) {
      updateChild(childId, {
        student: null,
        lookupStatus: "error",
        lookupMessage:
          err.response?.data?.message ||
          "Student lookup failed. Please try again.",
      });
    }
  };

  const addChild = () => {
    setChildren((previous) => [
      ...previous,
      createEmptyChild(),
    ]);
  };

  const removeChild = (childId) => {
    if (children.length === 1) {
      setError("At least one child is required.");
      return;
    }

    setChildren((previous) =>
      previous.filter((child) => child.childId !== childId)
    );

    setSectionsByChild((previous) => {
      const next = { ...previous };
      delete next[childId];
      return next;
    });

    setLoadingSections((previous) => {
      const next = { ...previous };
      delete next[childId];
      return next;
    });

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!schoolId) {
      setError("Please select a school first.");
      return;
    }

    for (let index = 0; index < children.length; index += 1) {
      const child = children[index];

      if (
        !child.class_id ||
        !child.section_id ||
        !child.student_roll.trim()
      ) {
        setError(
          `Please complete the class, section, and roll number for Child ${index + 1}.`
        );
        return;
      }

      if (
        child.lookupStatus !== "success" ||
        !child.student
      ) {
        setError(
          `Please find and confirm the student for Child ${index + 1}.`
        );
        return;
      }
    }

    const uniqueStudents = new Set(
      children.map((child) =>
        String(child.student._id ?? child.student.student_id)
      )
    );

    if (uniqueStudents.size !== children.length) {
      setError("The same student cannot be added more than once.");
      return;
    }

    setSubmitting(true);

    const normalizedChildren = children.map((child) => ({
      student_roll: String(child.student.roll_number),
      class_id: child.class_id,
      class_name: child.class_name,
      section_id: child.section_id,
      section_name: child.section_name,

      // Use the verified student record returned by the server.
      student_id: child.student._id ?? child.student.student_id,
    }));

    updateField("children", normalizedChildren);
    updateField("status", "academic_information_completed");

    navigate("/register/parent/account");
  };

  if (!schoolId) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="alert alert-warning">
          Please select a school first.
        </div>

        <button
          type="button"
          className="btn btn-primary mt-4"
          onClick={() => navigate("/register/parent/school")}
        >
          Select School
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-5 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Parent Registration
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Find Your Children
            </h1>

            <p className="text-sm text-base-content/70">
              Select each child's class and section, enter the roll
              number, and find the matching student.
            </p>

            <div className="alert alert-info mt-3">
              <div>
                <p className="font-semibold">Selected School</p>
                <p>
                  {registrationData?.school_name || "Selected school"}
                </p>
                {registrationData?.eiin && (
                  <p className="text-sm">
                    EIIN: {registrationData.eiin}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="alert alert-error mt-4">
                <span>{error}</span>
              </div>
            )}

            {loadingClasses ? (
              <div className="flex justify-center py-10">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-5 space-y-6"
              >
                {children.map((child, index) => (
                  <div
                    key={child.childId}
                    className="space-y-4 rounded-xl border border-base-300 p-4 sm:p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-bold">
                        Child {index + 1}
                      </h2>

                      {children.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline btn-error"
                          onClick={() => removeChild(child.childId)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="form-control">
                        <label
                          className="label"
                          htmlFor={`class-${child.childId}`}
                        >
                          <span className="label-text font-medium">
                            Class
                          </span>
                        </label>

                        <select
                          id={`class-${child.childId}`}
                          className="select select-bordered w-full"
                          value={child.class_id}
                          onChange={(event) =>
                            handleClassChange(
                              child.childId,
                              event.target.value
                            )
                          }
                          required
                        >
                          <option value="">Select class</option>

                          {classes.map((item) => (
                            <option
                              key={getId(item)}
                              value={getId(item)}
                            >
                              {getClassName(item)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-control">
                        <label
                          className="label"
                          htmlFor={`section-${child.childId}`}
                        >
                          <span className="label-text font-medium">
                            Section
                          </span>
                        </label>

                        <select
                          id={`section-${child.childId}`}
                          className="select select-bordered w-full"
                          value={child.section_id}
                          onChange={(event) =>
                            handleSectionChange(
                              child.childId,
                              event.target.value
                            )
                          }
                          disabled={
                            !child.class_id ||
                            Boolean(loadingSections[child.childId])
                          }
                          required
                        >
                          <option value="">
                            {loadingSections[child.childId]
                              ? "Loading sections..."
                              : "Select section"}
                          </option>

                          {(sectionsByChild[child.childId] ?? []).map(
                            (section) => (
                              <option
                                key={getId(section)}
                                value={getId(section)}
                              >
                                {getSectionName(section)}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div className="form-control sm:col-span-2">
                        <label
                          className="label"
                          htmlFor={`roll-${child.childId}`}
                        >
                          <span className="label-text font-medium">
                            Student Roll Number
                          </span>
                        </label>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <input
                            id={`roll-${child.childId}`}
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="Enter roll number"
                            value={child.student_roll}
                            onChange={(event) =>
                              handleRollChange(
                                child.childId,
                                event.target.value
                              )
                            }
                            autoComplete="off"
                            required
                          />

                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => findStudent(child.childId)}
                            disabled={
                              child.lookupStatus === "loading" ||
                              !child.class_id ||
                              !child.section_id ||
                              !child.student_roll.trim()
                            }
                          >
                            {child.lookupStatus === "loading" ? (
                              <span className="loading loading-spinner loading-sm" />
                            ) : (
                              "Find Student"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {child.lookupStatus === "error" && (
                      <div className="alert alert-error">
                        <span>{child.lookupMessage}</span>
                      </div>
                    )}

                    {child.lookupStatus === "success" &&
                      child.student && (
                        <div className="rounded-xl border border-success/40 bg-success/5 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <span className="text-success">
                              ✓
                            </span>
                            <h3 className="font-bold">
                              Student Found
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                              <p className="text-sm text-base-content/60">
                                Student Name
                              </p>
                              <p className="font-semibold">
                                {child.student.full_name ||
                                  [
                                    child.student.first_name,
                                    child.student.last_name,
                                  ]
                                    .filter(Boolean)
                                    .join(" ") ||
                                  child.student.name ||
                                  "Not available"}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-base-content/60">
                                Student ID
                              </p>
                              <p className="font-semibold">
                                {child.student.student_id ||
                                  child.student._id ||
                                  "Not available"}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-base-content/60">
                                Roll Number
                              </p>
                              <p className="font-semibold">
                                {child.student.roll_number}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-base-content/60">
                                Class
                              </p>
                              <p className="font-semibold">
                                {child.student.class_name ||
                                  child.class_name}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-base-content/60">
                                Section
                              </p>
                              <p className="font-semibold">
                                {child.student.section_name ||
                                  child.section_name}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-base-content/60">
                                Status
                              </p>
                              <p className="font-semibold">
                                {child.student.status || "Registered"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-outline btn-primary w-full"
                  onClick={addChild}
                >
                  + Add Another Child
                </button>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() =>
                      navigate("/register/parent/school")
                    }
                    disabled={submitting}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    Continue to Account
                  </button>
                </div>
              </form>
            )}

            <p className="mt-3 text-center text-xs text-base-content/60">
              Step 2 of 4 — Academic Information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}