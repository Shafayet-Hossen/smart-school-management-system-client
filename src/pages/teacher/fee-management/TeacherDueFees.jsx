import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEye } from "react-icons/fa";

import { getTeacherDueFees } from "../../../services/teacherFeeService.js";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
    }).format(Number(amount) || 0);

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const TeacherDueFees = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const limit = 10;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-due-fees", search, page],
        queryFn: () => getTeacherDueFees({ search, page, limit }),
        placeholderData: (previousData) => previousData,
    });

    const records = Array.isArray(data?.records)
        ? data.records
        : [];

    const summary = data?.summary || {};
    const pagination = data?.pagination || {};

    const totalPages = Math.max(
        1,
        Number(pagination.totalPages) || 1
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Outstanding Fees</h1>
                <p className="mt-1 text-sm text-base-content/60">
                    Monitor unpaid and partially paid fees for your students.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Total Outstanding
                        </p>
                        <h2 className="text-2xl font-bold text-warning">
                            {formatCurrency(summary.total_due)}
                        </h2>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Unpaid Fee Records
                        </p>
                        <h2 className="text-2xl font-bold">
                            {summary.unpaid_count ?? 0}
                        </h2>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">
                            Partially Paid Records
                        </p>
                        <h2 className="text-2xl font-bold">
                            {summary.partial_count ?? 0}
                        </h2>
                    </div>
                </div>
            </div>

            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <label className="input input-bordered flex items-center gap-2">
                        <FaSearch className="text-base-content/50" />
                        <input
                            type="search"
                            placeholder="Search student or fee category..."
                            className="grow"
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setPage(1);
                            }}
                        />
                    </label>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : isError ? (
                        <div className="alert alert-error mt-4">
                            {error?.response?.data?.message ||
                                "Unable to load outstanding fees."}
                        </div>
                    ) : records.length === 0 ? (
                        <div className="py-12 text-center text-base-content/60">
                            No outstanding fee records found.
                        </div>
                    ) : (
                        <>
                            <div className="mt-4 overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Fee Category</th>
                                            <th>Class / Section</th>
                                            <th>Total</th>
                                            <th>Paid</th>
                                            <th>Due</th>
                                            <th>Due Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {records.map((record) => (
                                            <tr key={record._id}>
                                                <td>
                                                    <div className="font-semibold">
                                                        {record.student_name || "—"}
                                                    </div>
                                                    <div className="text-xs text-base-content/50">
                                                        {record.student_code || "—"}
                                                    </div>
                                                </td>

                                                <td>{record.category_name || "—"}</td>

                                                <td>
                                                    {record.class_name || "—"}
                                                    <div className="text-xs text-base-content/50">
                                                        {record.section_name || ""}
                                                    </div>
                                                </td>

                                                <td>{formatCurrency(record.amount)}</td>
                                                <td className="text-success">
                                                    {formatCurrency(record.paid_amount)}
                                                </td>
                                                <td className="font-bold text-warning">
                                                    {formatCurrency(record.due_amount)}
                                                </td>
                                                <td>
                                                    <span className={
                                                        record.is_overdue
                                                            ? "text-error"
                                                            : ""
                                                    }>
                                                        {formatDate(record.due_date)}
                                                    </span>

                                                    {record.is_overdue && (
                                                        <div className="text-xs text-error">
                                                            Overdue
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline btn-primary"
                                                        onClick={() =>
                                                            navigate(
                                                                `/teacher-fees/students/${record.student_id}`
                                                            )
                                                        }
                                                        disabled={!record.student_id}
                                                    >
                                                        <FaEye />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-5 flex items-center justify-between">
                                <span className="text-sm text-base-content/60">
                                    Page {page} of {totalPages}
                                </span>

                                <div className="join">
                                    <button
                                        className="btn btn-sm join-item"
                                        disabled={page <= 1}
                                        onClick={() =>
                                            setPage((current) => current - 1)
                                        }
                                    >
                                        Previous
                                    </button>

                                    <button
                                        className="btn btn-sm join-item"
                                        disabled={page >= totalPages}
                                        onClick={() =>
                                            setPage((current) => current + 1)
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDueFees;