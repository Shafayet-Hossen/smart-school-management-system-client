import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEye } from "react-icons/fa";

import { getTeacherFeeStudents } from "../../../services/teacherFeeService.js";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
    }).format(Number(amount) || 0);

const TeacherFeeStudents = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [page, setPage] = useState(1);

    const limit = 10;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-fee-students", search, paymentStatus, page],
        queryFn: () =>
            getTeacherFeeStudents({
                search,
                payment_status: paymentStatus,
                page,
                limit,
            }),
        placeholderData: (previousData) => previousData,
    });

    const students = Array.isArray(data?.students)
        ? data.students
        : [];

    const pagination = data?.pagination || {};
    const totalPages = Math.max(
        1,
        Number(pagination.totalPages) || 1
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Student Fee Records</h1>
                <p className="mt-1 text-sm text-base-content/60">
                    View fee information for your assigned students.
                </p>
            </div>

            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <div className="flex flex-col gap-3 md:flex-row">
                        <label className="input input-bordered flex flex-1 items-center gap-2">
                            <FaSearch className="text-base-content/50" />
                            <input
                                type="search"
                                placeholder="Search student name or ID..."
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                                className="grow"
                            />
                        </label>

                        <select
                            className="select select-bordered"
                            value={paymentStatus}
                            onChange={(event) => {
                                setPaymentStatus(event.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Payment Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="partial">Partially Paid</option>
                            <option value="unpaid">Unpaid</option>
                        </select>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : isError ? (
                        <div className="alert alert-error mt-4">
                            {error?.response?.data?.message ||
                                "Unable to load student fee records."}
                        </div>
                    ) : students.length === 0 ? (
                        <div className="py-12 text-center text-base-content/60">
                            No student fee records found.
                        </div>
                    ) : (
                        <>
                            <div className="mt-4 overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Class</th>
                                            <th>Section</th>
                                            <th>Total Fees</th>
                                            <th>Paid</th>
                                            <th>Due</th>
                                            <th>Payment Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {students.map((student) => (
                                            <tr key={student._id}>
                                                <td>
                                                    <div className="font-semibold">
                                                        {student.student_name ||
                                                            student.full_name ||
                                                            "Unnamed Student"}
                                                    </div>
                                                    <div className="text-xs text-base-content/50">
                                                        {student.student_code || "—"}
                                                    </div>
                                                </td>

                                                <td>{student.class_name || "—"}</td>
                                                <td>{student.section_name || "—"}</td>

                                                <td>
                                                    {formatCurrency(student.total_fees)}
                                                </td>

                                                <td className="text-success">
                                                    {formatCurrency(student.paid_amount)}
                                                </td>

                                                <td className="font-semibold text-warning">
                                                    {formatCurrency(student.due_amount)}
                                                </td>

                                                <td>
                                                    <span className={`badge ${
                                                        student.payment_status === "paid"
                                                            ? "badge-success"
                                                            : student.payment_status === "partial" ||
                                                              student.payment_status === "partially_paid"
                                                                ? "badge-warning"
                                                                : "badge-error"
                                                    }`}>
                                                        {student.payment_status || "unpaid"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline btn-primary"
                                                        onClick={() =>
                                                            navigate(
                                                                `/teacher-fees/students/${student._id}`
                                                            )
                                                        }
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

export default TeacherFeeStudents;