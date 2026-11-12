
import { useEffect, useMemo, useState } from "react";
import  api  from "../../../services/api.js";

const initialForm = {
  academic_year: new Date().getFullYear().toString(),
  class_id: "",
  section_id: "",
  fee_structure_ids: [],
  due_date: "",
};

const AssignFees = () => {
  const [options, setOptions] = useState({
    classes: [],
    sections: [],
    structures: [],
  });

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState(null);

  const loadOptions = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        "/school-admin/fees/assign/options",
        {
          params: {
            academic_year: form.academic_year,
          },
        }
      );

      setOptions({
        classes: data.options?.classes || [],
        sections: data.options?.sections || [],
        structures: data.options?.structures || [],
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load fee assignment options."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, [form.academic_year]);

  const filteredSections = useMemo(
    () =>
      options.sections.filter(
        (section) =>
          section.class_id === form.class_id
      ),
    [options.sections, form.class_id]
  );

  const filteredStructures = useMemo(
    () =>
      options.structures.filter(
        (structure) =>
          structure.class_id === form.class_id &&
          (!structure.section_id ||
            structure.section_id === form.section_id)
      ),
    [
      options.structures,
      form.class_id,
      form.section_id,
    ]
  );

  const selectedStructures = useMemo(
    () =>
      filteredStructures.filter((structure) =>
        form.fee_structure_ids.includes(
          structure._id
        )
      ),
    [filteredStructures, form.fee_structure_ids]
  );

  const totalAmount = selectedStructures.reduce(
    (total, structure) =>
      total + Number(structure.amount || 0),
    0
  );

  const updateField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleClassChange = (classId) => {
    setForm((previous) => ({
      ...previous,
      class_id: classId,
      section_id: "",
      fee_structure_ids: [],
    }));

    setPreview(null);
  };

  const handleSectionChange = (sectionId) => {
    setForm((previous) => ({
      ...previous,
      section_id: sectionId,
      fee_structure_ids: [],
    }));

    setPreview(null);
  };

  const toggleStructure = (structureId) => {
    setForm((previous) => {
      const exists =
        previous.fee_structure_ids.includes(
          structureId
        );

      return {
        ...previous,
        fee_structure_ids: exists
          ? previous.fee_structure_ids.filter(
              (id) => id !== structureId
            )
          : [
              ...previous.fee_structure_ids,
              structureId,
            ],
      };
    });

    setPreview(null);
  };

  const handlePreview = async () => {
    try {
      setError("");
      setSuccess("");
      setPreview(null);

      if (!form.academic_year || !form.class_id) {
        setError("Please select an academic year and class.");
        return;
      }

      if (!form.fee_structure_ids.length) {
        setError("Please select at least one fee structure.");
        return;
      }

      const { data } = await api.post(
        "/school-admin/fees/assign/preview",
        {
          academic_year: form.academic_year,
          class_id: form.class_id,
          section_id: form.section_id || null,
          fee_structure_ids: form.fee_structure_ids,
        }
      );

      setPreview(data.preview);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not prepare assignment preview."
      );
    }
  };

  const handleAssign = async (event) => {
    event.preventDefault();

    try {
      setAssigning(true);
      setError("");
      setSuccess("");

      const { data } = await api.post(
        "/school-admin/fees/assign",
        {
          academic_year: form.academic_year,
          class_id: form.class_id,
          section_id: form.section_id || null,
          fee_structure_ids: form.fee_structure_ids,
          due_date: form.due_date || null,
        }
      );

      setSuccess(data.message || "Fees assigned successfully.");
      setPreview(data.summary || null);

      setForm((previous) => ({
        ...previous,
        fee_structure_ids: [],
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to assign fees."
      );
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Assign Student Fees
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Assign fee structures to students by class or section.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleAssign} className="space-y-6">
        <div className="bg-base-100 border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-lg">
            Assignment Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="form-control">
              <span className="label-text mb-2">
                Academic Year
              </span>
              <input
                type="text"
                className="input input-bordered"
                value={form.academic_year}
                onChange={(event) =>
                  updateField(
                    "academic_year",
                    event.target.value
                  )
                }
                required
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-2">
                Class
              </span>
              <select
                className="select select-bordered"
                value={form.class_id}
                onChange={(event) =>
                  handleClassChange(event.target.value)
                }
                required
              >
                <option value="">Select class</option>
                {options.classes.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control">
              <span className="label-text mb-2">
                Section
              </span>
              <select
                className="select select-bordered"
                value={form.section_id}
                onChange={(event) =>
                  handleSectionChange(event.target.value)
                }
                disabled={!form.class_id}
              >
                <option value="">
                  All sections
                </option>
                {filteredSections.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control">
              <span className="label-text mb-2">
                Due Date (optional)
              </span>
              <input
                type="date"
                className="input input-bordered"
                value={form.due_date}
                onChange={(event) =>
                  updateField(
                    "due_date",
                    event.target.value
                  )
                }
              />
            </label>
          </div>
        </div>

        <div className="bg-base-100 border rounded-xl p-5">
          <h2 className="font-semibold text-lg mb-4">
            Select Fee Structures
          </h2>

          {!form.class_id ? (
            <p className="text-sm text-gray-500">
              Select a class to view its fee structures.
            </p>
          ) : filteredStructures.length === 0 ? (
            <p className="text-sm text-warning">
              No active fee structures found for this selection.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Category</th>
                    <th>Frequency</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStructures.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={form.fee_structure_ids.includes(
                            item._id
                          )}
                          onChange={() =>
                            toggleStructure(item._id)
                          }
                        />
                      </td>
                      <td>{item.category_name}</td>
                      <td>
                        {item.frequency?.replaceAll("_", " ")}
                      </td>
                      <td>
                        ৳{Number(item.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-base-100 border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-lg">
            Assignment Summary
          </h2>

          <div className="flex justify-between">
            <span>Selected fee structures</span>
            <strong>{selectedStructures.length}</strong>
          </div>

          <div className="flex justify-between">
            <span>Total fee per student</span>
            <strong>
              ৳{totalAmount.toLocaleString()}
            </strong>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-primary"
            onClick={handlePreview}
            disabled={
              !form.class_id ||
              !form.fee_structure_ids.length
            }
          >
            Preview Assignment
          </button>

          {preview && (
            <div className="alert alert-info">
              <div>
                <p>
                  Students:{" "}
                  <strong>
                    {preview.student_count ?? 0}
                  </strong>
                </p>
                {preview.created_count !== undefined && (
                  <p>
                    Created records:{" "}
                    <strong>{preview.created_count}</strong>
                  </p>
                )}
                {preview.skipped_count !== undefined && (
                  <p>
                    Skipped duplicates:{" "}
                    <strong>{preview.skipped_count}</strong>
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={
              assigning ||
              !form.class_id ||
              !form.fee_structure_ids.length
            }
          >
            {assigning ? (
              <span className="loading loading-spinner" />
            ) : (
              "Assign Fees to Students"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignFees;
