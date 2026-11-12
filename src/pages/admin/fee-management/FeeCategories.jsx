
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../../services/api.js";

const initialForm = {
    category_name: "",
    description: "",
};

const FeeCategories = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(initialForm);

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch fee categories
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/school-admin/fees/categories"
            );

            setCategories(
                Array.isArray(response.data?.categories)
                    ? response.data.categories
                    : []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load fee categories."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Filter categories
    const filteredCategories = useMemo(() => {
        return categories.filter((category) => {
            const name = category.category_name || "";
            const description = category.description || "";

            const matchesSearch =
                name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ||
                String(category.status).toLowerCase() === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [categories, searchTerm, statusFilter]);

    // Open create form
    const handleAddNew = () => {
        setForm(initialForm);
        setEditingId(null);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    // Open edit form
    const handleEdit = (category) => {
        setForm({
            category_name: category.category_name || "",
            description: category.description || "",
        });

        setEditingId(category._id);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Create or update category
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.category_name.trim()) {
            setError("Please enter a fee category name.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = {
                category_name: form.category_name.trim(),
                description: form.description.trim(),
            };

            if (editingId) {
                await api.patch(
                    `/school-admin/fees/categories/${editingId}`,
                    payload
                );

                setSuccess("Fee category updated successfully.");
            } else {
                await api.post(
                    "/school-admin/fees/categories",
                    payload
                );

                setSuccess("Fee category created successfully.");
            }

            setShowForm(false);
            setForm(initialForm);
            setEditingId(null);

            await fetchCategories();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to save fee category."
            );
        } finally {
            setSaving(false);
        }
    };

    // Activate or deactivate category
    const handleToggleStatus = async (category) => {
        const newStatus =
            String(category.status).toLowerCase() === "active"
                ? "inactive"
                : "active";

        try {
            setError("");
            setSuccess("");

            await api.patch(
                `/school-admin/fees/categories/${category._id}`,
                { status: newStatus }
            );

            setSuccess(`Category ${newStatus} successfully.`);
            await fetchCategories();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update category status."
            );
        }
    };

    // Delete category
    const handleDelete = async (category) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${category.category_name}"?`
        );

        if (!confirmed) return;

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/school-admin/fees/categories/${category._id}`
            );

            setSuccess("Fee category deleted successfully.");
            await fetchCategories();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete fee category."
            );
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setForm(initialForm);
        setEditingId(null);
        setError("");
    };

    const getStatusBadge = (status) => {
        return String(status).toLowerCase() === "active"
            ? "badge-success"
            : "badge-error";
    };

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        Fee Categories
                    </h1>

                    <p className="text-sm text-base-content/60 mt-1">
                        Create and manage different types of school fees.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddNew}
                    className="btn btn-primary"
                >
                    + Add Fee Category
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
                            Total Categories
                        </p>
                        <h2 className="text-2xl font-bold">
                            {categories.length}
                        </h2>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Active Categories
                        </p>
                        <h2 className="text-2xl font-bold text-success">
                            {
                                categories.filter(
                                    (item) =>
                                        String(item.status).toLowerCase() === "active"
                                ).length
                            }
                        </h2>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Inactive Categories
                        </p>
                        <h2 className="text-2xl font-bold text-error">
                            {
                                categories.filter(
                                    (item) =>
                                        String(item.status).toLowerCase() !== "active"
                                ).length
                            }
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
                                    ? "Edit Fee Category"
                                    : "Create Fee Category"}
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

                            <div>
                                <label className="label">
                                    <span className="label-text font-medium">
                                        Category Name *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="category_name"
                                    value={form.category_name}
                                    onChange={handleChange}
                                    placeholder="Example: Tuition Fee"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

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
                                    placeholder="Write a short description..."
                                    className="textarea textarea-bordered w-full"
                                    rows={3}
                                />
                            </div>

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
                                        "Update Category"
                                    ) : (
                                        "Create Category"
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
                            placeholder="Search fee categories..."
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
                            onClick={fetchCategories}
                            className="btn btn-outline"
                        >
                            Refresh
                        </button>

                    </div>
                </div>
            </div>

            {/* Categories Table */}
            <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">

                    <div className="flex justify-between items-center">
                        <h2 className="card-title">
                            Category List
                        </h2>

                        <span className="text-sm text-base-content/60">
                            {filteredCategories.length} categories
                        </span>
                    </div>

                    <div className="overflow-x-auto">

                        <table className="table table-zebra">

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Category Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10">
                                            <span className="loading loading-spinner loading-lg text-primary" />
                                        </td>
                                    </tr>
                                ) : filteredCategories.length > 0 ? (
                                    filteredCategories.map((category, index) => (
                                        <tr key={category._id}>
                                            <td>{index + 1}</td>

                                            <td className="font-medium">
                                                {category.category_name}
                                            </td>

                                            <td className="max-w-xs">
                                                {category.description || "—"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getStatusBadge(category.status)}`}
                                                >
                                                    {category.status || "Unknown"}
                                                </span>
                                            </td>

                                            <td>
                                                {category.created_at
                                                    ? new Date(category.created_at).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            <td>
                                                <div className="flex justify-center gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(category)}
                                                        className="btn btn-outline btn-xs"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(category)}
                                                        className="btn btn-outline btn-xs"
                                                    >
                                                        {String(category.status).toLowerCase() === "active"
                                                            ? "Deactivate"
                                                            : "Activate"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(category)}
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
                                            colSpan="6"
                                            className="text-center py-10 text-base-content/60"
                                        >
                                            No fee categories found.
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

export default FeeCategories;
