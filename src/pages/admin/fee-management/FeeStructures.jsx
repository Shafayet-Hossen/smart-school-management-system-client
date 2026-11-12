
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

const initialForm = {
    category_id: "",
    class_id: "",
    section_id: "",
    academic_year: String(new Date().getFullYear()),
    amount: "",
    frequency: "monthly",
    due_day: "10",
    description: "",
};

const frequencies = [
    { value: "one_time", label: "One Time" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "half_yearly", label: "Half Yearly" },
    { value: "yearly", label: "Yearly" },
];

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

const FeeStructures = () => {
    const [structures, setStructures] = useState([]);
    const [categories, setCategories] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);

    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch structures and form options
    const fetchPageData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const [structureResponse, optionsResponse] =
                await Promise.all([
                    api.get("/school-admin/fees/structures"),
                    api.get("/school-admin/fees/structures/options"),
                ]);

            setStructures(
                Array.isArray(structureResponse.data?.structures)
                    ? structureResponse.data.structures
                    : []
            );

            const options = optionsResponse.data?.options || {};

            setCategories(
                Array.isArray(options.categories)
                    ? options.categories
                    : []
            );

            setClasses(
                Array.isArray(options.classes)
                    ? options.classes
                    : []
            );

            setSections(
                Array.isArray(options.sections)
                    ? options.sections
                    : []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load fee structures."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    // Filter structures
    const filteredStructures = useMemo(() => {
        return structures.filter((item) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch = [
                item.category_name,
                item.class_name,
                item.section_name,
                item.academic_year,
            ].some((value) =>
                String(value || "").toLowerCase().includes(search)
            );

            const matchesStatus =
                statusFilter === "all" ||
                String(item.status || "").toLowerCase() === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [structures, searchTerm, statusFilter]);

    // Sections belonging to selected class
    const availableSections = useMemo(() => {
        if (!form.class_id) return [];

        return sections.filter(
            (section) =>
                section.class_code === form.class_id ||
                section.class_id === form.class_id
        );
    }, [sections, form.class_id]);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
            ...(name === "class_id" ? { section_id: "" } : {}),
        }));
    };

    // Open create form
    const handleAddNew = () => {
        setForm(initialForm);
        setEditingId(null);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    // Open edit form
    const handleEdit = (item) => {
        setForm({
            category_id: item.category_id || "",
            class_id: item.class_id || "",
            section_id: item.section_id || "",
            academic_year: String(item.academic_year || ""),
            amount: String(item.amount ?? ""),
            frequency: item.frequency || "monthly",
            due_day: String(item.due_day ?? "10"),
            description: item.description || "",
        });

        setEditingId(item._id);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.category_id ||
            !form.class_id ||
            !form.academic_year.trim() ||
            !form.amount
        ) {
            setError("Please complete all required fields.");
            return;
        }

        const amount = Number(form.amount);
        const dueDay = Number(form.due_day);

        if (!Number.isFinite(amount) || amount <= 0) {
            setError("Enter a valid fee amount greater than zero.");
            return;
        }

        if (
            !Number.isInteger(dueDay) ||
            dueDay < 1 ||
            dueDay > 31
        ) {
            setError("Due day must be between 1 and 31.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = {
                category_id: form.category_id,
                class_id: form.class_id,
                section_id: form.section_id || null,
                academic_year: form.academic_year.trim(),
                amount,
                frequency: form.frequency,
                due_day: dueDay,
                description: form.description.trim(),
            };

            if (editingId) {
                await api.patch(
                    `/school-admin/fees/structures/${editingId}`,
                    payload
                );

                setSuccess("Fee structure updated successfully.");
            } else {
                await api.post(
                    "/school-admin/fees/structures",
                    payload
                );

                setSuccess("Fee structure created successfully.");
            }

            setShowForm(false);
            setEditingId(null);
            setForm(initialForm);

            await fetchPageData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to save fee structure."
            );
        } finally {
            setSaving(false);
        }
    };

    // Toggle status
    const handleToggleStatus = async (item) => {
        const newStatus =
            String(item.status).toLowerCase() === "active"
                ? "inactive"
                : "active";

        try {
            setError("");
            setSuccess("");

            await api.patch(
                `/school-admin/fees/structures/${item._id}`,
                { status: newStatus }
            );

            setSuccess(`Fee structure ${newStatus} successfully.`);
            await fetchPageData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update fee structure status."
            );
        }
    };

    // Delete structure
    const handleDelete = async (item) => {
        const confirmed = window.confirm(
            `Delete the fee structure for ${item.category_name} - ${item.class_name}?`
        );

        if (!confirmed) return;

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/school-admin/fees/structures/${item._id}`
            );

            setSuccess("Fee structure deleted successfully.");
            await fetchPageData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete fee structure."
            );
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(initialForm);
        setError("");
    };

    const getStatusBadge = (status) =>
        String(status).toLowerCase() === "active"
            ? "badge-success"
            : "badge-error";

    const activeCount = structures.filter(
        (item) => String(item.status).toLowerCase() === "active"
    ).length;

    const inactiveCount = structures.length - activeCount;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        Fee Structures
                    </h1>

                    <p className="text-sm text-base-content/60 mt-1">
                        Configure fee amounts for classes and sections.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddNew}
                    className="btn btn-primary"
                >
                    + Create Fee Structure
                </button>
            </div>

            {/* Alerts */}
            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>

                    <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => setError("")}
                    >
                        ✕
                    </button>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <span>{success}</span>

                    <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => setSuccess("")}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Total Structures
                        </p>
                        <h2 className="text-2xl font-bold">
                            {structures.length}
                        </h2>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Active Structures
                        </p>
                        <h2 className="text-2xl font-bold text-success">
                            {activeCount}
                        </h2>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Inactive Structures
                        </p>
                        <h2 className="text-2xl font-bold text-error">
                            {inactiveCount}
                        </h2>
                    </div>
                </div>

            </div>

            {/* Create / Edit Form */}
            {showForm && (
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body">

                        <div className="flex justify-between items-center">
                            <h2 className="card-title">
                                {editingId
                                    ? "Edit Fee Structure"
                                    : "Create Fee Structure"}
                            </h2>

                            <button
                                type="button"
                                onClick={closeForm}
                                className="btn btn-ghost btn-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Category */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Fee Category *
                                        </span>
                                    </label>

                                    <select
                                        name="category_id"
                                        value={form.category_id}
                                        onChange={handleChange}
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="">
                                            Select fee category
                                        </option>

                                        {categories
                                            .filter(
                                                (item) =>
                                                    String(item.status).toLowerCase() === "active"
                                            )
                                            .map((category) => (
                                                <option
                                                    key={category._id}
                                                    value={category._id}
                                                >
                                                    {category.category_name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {/* Class */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Class *
                                        </span>
                                    </label>

                                    <select
                                        name="class_id"
                                        value={form.class_id}
                                        onChange={handleChange}
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="">
                                            Select class
                                        </option>

                                        {classes.map((item) => (
                                            <option
                                                key={item._id}
                                                value={item._id}
                                            >
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Section */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Section
                                        </span>
                                    </label>

                                    <select
                                        name="section_id"
                                        value={form.section_id}
                                        onChange={handleChange}
                                        className="select select-bordered w-full"
                                        disabled={!form.class_id}
                                    >
                                        <option value="">
                                            All Sections (Entire Class)
                                        </option>

                                        {availableSections.map((section) => (
                                            <option
                                                key={section._id}
                                                value={section._id}
                                            >
                                                {section.name}
                                            </option>
                                        ))}
                                    </select>

                                    <p className="text-xs text-base-content/60 mt-1">
                                        Leave empty to apply to the entire class.
                                    </p>
                                </div>

                                {/* Academic Year */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Academic Year *
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        name="academic_year"
                                        value={form.academic_year}
                                        onChange={handleChange}
                                        placeholder="2026"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Fee Amount (BDT) *
                                        </span>
                                    </label>

                                    <input
                                        type="number"
                                        name="amount"
                                        value={form.amount}
                                        onChange={handleChange}
                                        placeholder="1000"
                                        min="0.01"
                                        step="0.01"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Frequency */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Payment Frequency *
                                        </span>
                                    </label>

                                    <select
                                        name="frequency"
                                        value={form.frequency}
                                        onChange={handleChange}
                                        className="select select-bordered w-full"
                                    >
                                        {frequencies.map((item) => (
                                            <option
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Due Day */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Due Day of Month
                                        </span>
                                    </label>

                                    <input
                                        type="number"
                                        name="due_day"
                                        value={form.due_day}
                                        onChange={handleChange}
                                        min="1"
                                        max="31"
                                        className="input input-bordered w-full"
                                        disabled={form.frequency === "one_time"}
                                    />
                                </div>

                            </div>

                            {/* Description */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-medium">
                                        Description
                                    </span>
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Enter fee structure details..."
                                    className="textarea textarea-bordered w-full"
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="btn btn-ghost"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <span className="loading loading-spinner loading-sm" />
                                    ) : editingId ? (
                                        "Update Structure"
                                    ) : (
                                        "Create Structure"
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* Search and Filter */}
            <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">

                    <div className="flex flex-col md:flex-row gap-3">

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search category, class or academic year..."
                            className="input input-bordered w-full md:flex-1"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="select select-bordered w-full md:w-48"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <button
                            type="button"
                            onClick={fetchPageData}
                            className="btn btn-outline"
                        >
                            Refresh
                        </button>

                    </div>
                </div>
            </div>

            {/* Structures Table */}
            <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">

                    <div className="flex justify-between items-center">
                        <h2 className="card-title">
                            Fee Structure List
                        </h2>

                        <span className="text-sm text-base-content/60">
                            {filteredStructures.length} structures
                        </span>
                    </div>

                    <div className="overflow-x-auto">

                        <table className="table table-zebra">

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Category</th>
                                    <th>Class</th>
                                    <th>Section</th>
                                    <th>Academic Year</th>
                                    <th>Amount</th>
                                    <th>Frequency</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-10">
                                            <span className="loading loading-spinner loading-lg text-primary" />
                                        </td>
                                    </tr>
                                ) : filteredStructures.length > 0 ? (
                                    filteredStructures.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>

                                            <td className="font-medium">
                                                {item.category_name || "N/A"}
                                            </td>

                                            <td>{item.class_name || "N/A"}</td>

                                            <td>
                                                {item.section_name || "All Sections"}
                                            </td>

                                            <td>{item.academic_year}</td>

                                            <td className="font-semibold">
                                                {formatCurrency(item.amount)}
                                            </td>

                                            <td>
                                                {frequencies.find(
                                                    (frequency) =>
                                                        frequency.value === item.frequency
                                                )?.label || item.frequency}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getStatusBadge(item.status)}`}
                                                >
                                                    {item.status || "Unknown"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(item)}
                                                        className="btn btn-outline btn-xs"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(item)}
                                                        className="btn btn-outline btn-xs"
                                                    >
                                                        {String(item.status).toLowerCase() === "active"
                                                            ? "Deactivate"
                                                            : "Activate"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item)}
                                                        className="btn btn-error btn-outline btn-xs"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="text-center py-10 text-base-content/60"
                                        >
                                            No fee structures found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FeeStructures;
