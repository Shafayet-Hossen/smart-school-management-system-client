
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    FaSearch,
    FaWallet,
    FaExclamationCircle,
    FaCalendarAlt,
    FaSyncAlt,
    FaClock,
} from "react-icons/fa";

import { getStudentDueFees } from "../../../services/studentFeeService.js";

const formatCurrency = (amount, currency = "BDT") => {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
};

const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
        case "partial":
        case "partially_paid":
            return "badge-warning";

        case "unpaid":
            return "badge-error";

        default:
            return "badge-ghost";
    }
};

const StudentDueFees = () => {
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const limit = 10;

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["student-due-fees", page, search],
        queryFn: () =>
            getStudentDueFees({
                page,
                limit,
                search,
            }),
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

    const totalRecords = Number(
        pagination.totalRecords ?? records.length
    );

    const handleSearch = (event) => {
        event.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    };

    const handleReset = () => {
        setSearchInput("");
        setSearch("");
        setPage(1);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-80 items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (isError && !data) {
        return (
            <div className="alert alert-error">
                <FaExclamationCircle />

                <div>
                    <h3 className="font-bold">
                        Unable to load due fees
                    </h3>

                    <p className="text-sm">
                        {error?.response?.data?.message ||
                            "Something went wrong. Please try again."}
                    </p>
                </div>

                <button
                    onClick={() => refetch()}
                    className="btn btn-sm"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold">
                        Due Fees
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        View your unpaid and partially paid school fees.
                    </p>
                </div>

                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="btn btn-outline btn-sm"
                >
                    <FaSyncAlt
                        className={isFetching ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-base-content/60">
                                    Total Outstanding
                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-warning">
                                    {formatCurrency(summary.total_due)}
                                </h2>
                            </div>

                            <div className="rounded-xl bg-warning/10 p-3 text-warning">
                                <FaWallet className="text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-base-content/60">
                                    Unpaid Fees
                                </p>

                                <h2 className="mt-2 text-2xl font-bold">
                                    {summary.unpaid_count || 0}
                                </h2>
                            </div>

                            <div className="rounded-xl bg-error/10 p-3 text-error">
                                <FaExclamationCircle className="text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-base-content/60">
                                    Partially Paid
                                </p>

                                <h2 className="mt-2 text-2xl font-bold">
                                    {summary.partial_count || 0}
                                </h2>
                            </div>

                            <div className="rounded-xl bg-info/10 p-3 text-info">
                                <FaClock className="text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Search */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body p-4">

                    <h2 className="mb-2 font-semibold">
                        Search Due Fees
                    </h2>

                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <input
                            type="text"
                            placeholder="Search fee category, class or academic year..."
                            className="input input-bordered w-full"
                            value={searchInput}
                            onChange={(event) =>
                                setSearchInput(event.target.value)
                            }
                        />

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            <FaSearch />
                            Search
                        </button>

                        {search && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="btn btn-ghost"
                            >
                                Clear
                            </button>
                        )}
                    </form>

                </div>
            </div>

            {/* Due Fees Table */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body p-0">

                    <div className="flex items-center justify-between border-b border-base-300 p-5">
                        <div>
                            <h2 className="card-title text-base">
                                <FaWallet className="text-primary" />
                                Outstanding Fee Records
                            </h2>

                            <p className="mt-1 text-xs text-base-content/60">
                                Fees that still have an outstanding balance
                            </p>
                        </div>

                        <span className="badge badge-warning">
                            {totalRecords} records
                        </span>
                    </div>

                    {isError && (
                        <div className="alert alert-warning m-4">
                            Unable to refresh records. Showing previously loaded data.
                        </div>
                    )}

                    {records.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-10 text-center">
                            <FaWallet className="mb-3 text-4xl text-success/60" />

                            <h3 className="font-semibold">
                                No Due Fees
                            </h3>

                            <p className="mt-1 text-sm text-base-content/60">
                                {search
                                    ? "No matching due fees found."
                                    : "You currently have no outstanding fee balance."}
                            </p>

                            {search && (
                                <button
                                    onClick={handleReset}
                                    className="btn btn-primary btn-sm mt-4"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Fee Category</th>
                                        <th>Academic Year</th>
                                        <th>Total Fee</th>
                                        <th>Paid Amount</th>
                                        <th>Due Amount</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {records.map((fee) => (
                                        <tr key={fee._id}>
                                            <td>
                                                <div className="font-semibold">
                                                    {fee.category_name ||
                                                        "School Fee"}
                                                </div>

                                                <div className="text-xs text-base-content/50">
                                                    {fee.class_name || ""}
                                                    {fee.section_name
                                                        ? ` - ${fee.section_name}`
                                                        : ""}
                                                </div>
                                            </td>

                                            <td>
                                                {fee.academic_year || "N/A"}
                                            </td>

                                            <td className="font-medium">
                                                {formatCurrency(fee.amount)}
                                            </td>

                                            <td className="text-success font-medium">
                                                {formatCurrency(fee.paid_amount)}
                                            </td>

                                            <td className="font-bold text-warning">
                                                {formatCurrency(fee.due_amount)}
                                            </td>

                                            <td>
                                                <div className="flex items-center gap-2 whitespace-nowrap text-sm">
                                                    <FaCalendarAlt className="text-base-content/40" />
                                                    {formatDate(fee.due_date)}
                                                </div>

                                                {fee.is_overdue && (
                                                    <span className="badge badge-error badge-xs mt-1">
                                                        Overdue
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getStatusClass(
                                                        fee.payment_status
                                                    )}`}
                                                >
                                                    {fee.payment_status === "partial" ||
                                                    fee.payment_status === "partially_paid"
                                                        ? "Partially Paid"
                                                        : fee.payment_status || "Unpaid"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-base-300 p-4 sm:flex-row">

                            <p className="text-sm text-base-content/60">
                                Page {page} of {totalPages}
                                {" · "}
                                {totalRecords} records
                            </p>

                            <div className="join">
                                <button
                                    className="btn btn-sm join-item"
                                    disabled={page <= 1 || isFetching}
                                    onClick={() =>
                                        setPage((current) => current - 1)
                                    }
                                >
                                    Previous
                                </button>

                                <button className="btn btn-sm join-item btn-active">
                                    {page}
                                </button>

                                <button
                                    className="btn btn-sm join-item"
                                    disabled={
                                        page >= totalPages || isFetching
                                    }
                                    onClick={() =>
                                        setPage((current) => current + 1)
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Parent Payment Notice */}
            <div className="alert alert-info">
                <FaExclamationCircle className="text-xl" />

                <div>
                    <h3 className="font-semibold">
                        Online Fee Payment
                    </h3>

                    <p className="text-sm">
                        Please contact your parent or guardian to pay
                        outstanding school fees online.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default StudentDueFees;
