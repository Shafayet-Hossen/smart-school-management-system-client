import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import {
    getTeacherStudentFeeDetails,
} from "../../../services/teacherFeeService.js";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
    }).format(Number(amount) || 0);

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-BD", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const TeacherStudentFeeDetails = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-student-fee-details", studentId],
        queryFn: () => getTeacherStudentFeeDetails(studentId),
        enabled: Boolean(studentId),
    });

    const student = data?.student || {};
    const fees = Array.isArray(data?.fees) ? data.fees : [];

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-4">
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate("/teacher-fees/students")}
                >
                    <FaArrowLeft />
                    Back to Students
                </button>

                <div className="alert alert-error">
                    {error?.response?.data?.message ||
                        "Unable to load student fee details."}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate("/teacher-fees/students")}
            >
                <FaArrowLeft />
                Back to Students
            </button>

            <div>
                <h1 className="text-2xl font-bold">
                    Student Fee Details
                </h1>
                <p className="mt-1 text-sm text-base-content/60">
                    Fee records for the selected student.
                </p>
            </div>

            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <h2 className="text-lg font-bold">
                        {student.student_name || "Student"}
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <p className="text-sm text-base-content/60">
                                Student ID
                            </p>
                            <p className="font-semibold">
                                {student.student_code || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-base-content/60">
                                Class
                            </p>
                            <p className="font-semibold">
                                {student.class_name || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-base-content/60">
                                Section
                            </p>
                            <p className="font-semibold">
                                {student.section_name || "—"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <h2 className="mb-4 text-lg font-semibold">
                        Fee Records
                    </h2>

                    {fees.length === 0 ? (
                        <p className="py-8 text-center text-base-content/60">
                            No fee records found.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Fee Category</th>
                                        <th>Academic Year</th>
                                        <th>Total Amount</th>
                                        <th>Paid Amount</th>
                                        <th>Due Amount</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {fees.map((fee) => (
                                        <tr key={fee._id}>
                                            <td className="font-medium">
                                                {fee.category_name || "—"}
                                            </td>

                                            <td>{fee.academic_year || "—"}</td>

                                            <td>{formatCurrency(fee.amount)}</td>

                                            <td className="text-success">
                                                {formatCurrency(fee.paid_amount)}
                                            </td>

                                            <td className="font-semibold text-warning">
                                                {formatCurrency(fee.due_amount)}
                                            </td>

                                            <td>{formatDate(fee.due_date)}</td>

                                            <td>
                                                <span className={`badge ${
                                                    fee.payment_status === "paid"
                                                        ? "badge-success"
                                                        : fee.payment_status === "partial" ||
                                                          fee.payment_status === "partially_paid"
                                                            ? "badge-warning"
                                                            : "badge-error"
                                                }`}>
                                                    {fee.payment_status || "unpaid"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="alert alert-info">
                Fee records are read-only. Contact the School Admin for
                payment-related corrections or assistance.
            </div>
        </div>
    );
};

export default TeacherStudentFeeDetails;