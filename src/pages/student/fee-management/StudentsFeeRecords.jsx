
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    FaSearch,
    FaFilter,
    FaFileInvoiceDollar,
    FaCalendarAlt,
    FaExclamationCircle,
    FaSyncAlt,
} from "react-icons/fa";

import { getStudentFeeRecords } from "../../../services/studentFeeService.js";

const formatCurrency = (amount, currency = "BDT") => {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
};

const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
        case "paid":
            return "badge-success";

        case "unpaid":
            return "badge-error";

        case "partial":
        case "partially_paid":
            return "badge-warning";

        default:
            return "badge-ghost";
    }
};

const getStatusLabel = (status) => {
    switch (String(status || "").toLowerCase()) {
        case "partial":
            return "Partially Paid";

        case "partially_paid":
            return "Partially Paid";

        case "paid":
            return "Paid";

        case "unpaid":
            return "Unpaid";

        default:
            return status || "Unknown";
    }
};

const StudentsFeeRecords = () => {
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [academicYear, setAcademicYear] = useState("");
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
        queryKey: [
            "student-fee-records",
            page,
            search,
            paymentStatus,
            academicYear,
        ],
        queryFn: () =>
            getStudentFeeRecords({
                page,
                limit,
                search,
                payment_status: paymentStatus,
                academic_year: academicYear,
            }),
        placeholderData: (previousData) => previousData,
    });
    
    // console.log("Records: ",data)

    const records = Array.isArray(data?.records)
        ? data.records
        : [];
    

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

    const handleStatusChange = (event) => {
        setPaymentStatus(event.target.value);
        setPage(1);
    };

    const handleAcademicYearChange = (event) => {
        setAcademicYear(event.target.value);
        setPage(1);
    };

    const handleReset = () => {
        setSearch("");
        setSearchInput("");
        setPaymentStatus("");
        setAcademicYear("");
        setPage(1);
    };

    const hasFilters = Boolean(
        search || paymentStatus || academicYear
    );

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
                        Unable to load fee records
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
                        Fee Records
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        View all fees assigned to your student account.
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

            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-4">
                        <p className="text-sm text-base-content/60">
                            Total Records
                        </p>

                        <h2 className="text-2xl font-bold">
                            {totalRecords}
                        </h2>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-4">
                        <p className="text-sm text-base-content/60">
                            Records on This Page
                        </p>

                        <h2 className="text-2xl font-bold">
                            {records.length}
                        </h2>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-4">
                        <p className="text-sm text-base-content/60">
                            Current Page
                        </p>

                        <h2 className="text-2xl font-bold">
                            {page} / {totalPages}
                        </h2>
                    </div>
                </div>

            </div>

            {/* Filters */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body p-4">

                    <div className="mb-2 flex items-center gap-2">
                        <FaFilter className="text-primary" />
                        <h2 className="font-semibold">
                            Search and Filter
                        </h2>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
                    >
                        {/* Search */}
                        <div className="form-control xl:col-span-2">
                            <label className="label">
                                <span className="label-text">
                                    Search fee
                                </span>
                            </label>

                            <div className="join w-full">
                                <input
                                    type="text"
                                    placeholder="Category, class or academic year..."
                                    className="input input-bordered join-item w-full"
                                    value={searchInput}
                                    onChange={(event) =>
                                        setSearchInput(event.target.value)
                                    }
                                />

                                <button
                                    type="submit"
                                    className="btn btn-primary join-item"
                                >
                                    <FaSearch />
                                </button>
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Payment Status
                                </span>
                            </label>

                            <select
                                className="select select-bordered"
                                value={paymentStatus}
                                onChange={handleStatusChange}
                            >
                                <option value="">
                                    All Statuses
                                </option>

                                <option value="paid">
                                    Paid
                                </option>

                                <option value="unpaid">
                                    Unpaid
                                </option>

                                <option value="partial">
                                    Partially Paid
                                </option>
                            </select>
                        </div>

                        {/* Academic Year */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Academic Year
                                </span>
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. 2026"
                                className="input input-bordered"
                                value={academicYear}
                                onChange={handleAcademicYearChange}
                            />
                        </div>
                    </form>

                    {hasFilters && (
                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={handleReset}
                                className="btn btn-ghost btn-sm"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Fee Records Table */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body p-0">

                    <div className="flex items-center justify-between border-b border-base-300 p-5">
                        <div>
                            <h2 className="card-title text-base">
                                <FaFileInvoiceDollar className="text-primary" />
                                Assigned Fee Records
                            </h2>

                            <p className="mt-1 text-xs text-base-content/60">
                                Your assigned school fee details
                            </p>
                        </div>

                        <span className="badge badge-outline">
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
                            <FaFileInvoiceDollar className="mb-3 text-4xl text-base-content/30" />

                            <h3 className="font-semibold">
                                No Fee Records Found
                            </h3>

                            <p className="mt-1 text-sm text-base-content/60">
                                {hasFilters
                                    ? "Try changing your search or filters."
                                    : "No fees have been assigned to your account yet."}
                            </p>

                            {hasFilters && (
                                <button
                                    onClick={handleReset}
                                    className="btn btn-primary btn-sm mt-4"
                                >
                                    Clear Filters
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
                                        <th>Frequency</th>
                                        <th>Total Amount</th>
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

                                            <td className="capitalize">
                                                {fee.frequency || "N/A"}
                                            </td>

                                            <td className="font-medium">
                                                {formatCurrency(fee.amount)}
                                            </td>

                                            <td className="text-success font-medium">
                                                {formatCurrency(fee.paid_amount)}
                                            </td>

                                            <td className="font-semibold text-warning">
                                                {formatCurrency(fee.due_amount)}
                                            </td>

                                            <td>
                                                <span className="flex items-center gap-2 whitespace-nowrap text-sm">
                                                    <FaCalendarAlt className="text-base-content/40" />

                                                    {formatDate(fee.due_date)}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getStatusClass(
                                                        fee.payment_status
                                                    )}`}
                                                >
                                                    {getStatusLabel(
                                                        fee.payment_status
                                                    )}
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

            {/* Read-only Notice */}
            <div className="alert alert-info">
                <FaExclamationCircle className="text-xl" />

                <div>
                    <h3 className="font-semibold">
                        Fee Management Information
                    </h3>

                    <p className="text-sm">
                        This page provides read-only access to your fee
                        records. Please contact your parent or guardian
                        for online fee payments.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default StudentsFeeRecords;
