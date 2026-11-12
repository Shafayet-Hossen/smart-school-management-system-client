import { useQuery } from "@tanstack/react-query";
import {
    FaUsers,
    FaMoneyBillWave,
    FaWallet,
    FaExclamationTriangle,
} from "react-icons/fa";

import { getTeacherFeeSummary } from "../../../services/teacherFeeService.js";

const formatCurrency = (amount, currency = "BDT") =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(Number(amount) || 0);

const TeacherFeeDashboard = () => {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["teacher-fee-summary"],
        queryFn: getTeacherFeeSummary,
    });

    const summary = data?.summary || {};
    const currency = summary.currency || "BDT";

    const cards = [
        {
            title: "Assigned Students",
            value: summary.total_students ?? 0,
            icon: FaUsers,
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            title: "Total Assigned Fees",
            value: formatCurrency(summary.total_fees, currency),
            icon: FaMoneyBillWave,
            color: "text-info",
            bg: "bg-info/10",
        },
        {
            title: "Total Paid",
            value: formatCurrency(summary.paid_amount, currency),
            icon: FaWallet,
            color: "text-success",
            bg: "bg-success/10",
        },
        {
            title: "Outstanding Fees",
            value: formatCurrency(summary.due_amount, currency),
            icon: FaExclamationTriangle,
            color: "text-warning",
            bg: "bg-warning/10",
        },
    ];

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-error">
                <span>
                    {error?.response?.data?.message ||
                        "Unable to load fee summary."}
                </span>
                <button className="btn btn-sm" onClick={() => refetch()}>
                    Retry
                </button>
            </div>
        );
    }

    const totalStudents = Number(summary.total_students) || 0;
    const paidStudents = Number(summary.paid_students) || 0;
    const paidPercentage = totalStudents
        ? Math.round((paidStudents / totalStudents) * 100)
        : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">
                    Fee Management Dashboard
                </h1>
                <p className="mt-1 text-sm text-base-content/60">
                    Overview of fee payments for your assigned students.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className="card border border-base-300 bg-base-100 shadow-sm"
                        >
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-base-content/60">
                                            {card.title}
                                        </p>
                                        <h2 className="mt-2 text-xl font-bold">
                                            {card.value}
                                        </h2>
                                    </div>

                                    <div className={`rounded-xl p-4 ${card.bg} ${card.color}`}>
                                        <Icon size={22} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <h2 className="font-semibold">
                        Student Payment Overview
                    </h2>

                    <div className="mt-3 flex justify-between text-sm">
                        <span>Students with fully paid fees</span>
                        <span className="font-semibold">
                            {paidPercentage}%
                        </span>
                    </div>

                    <progress
                        className="progress progress-success mt-2 w-full"
                        value={paidPercentage}
                        max="100"
                    />

                    <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-base-content/60">
                                Fully paid students
                            </p>
                            <p className="text-xl font-bold text-success">
                                {summary.paid_students ?? 0}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-base-content/60">
                                Students with unpaid fees
                            </p>
                            <p className="text-xl font-bold text-warning">
                                {summary.unpaid_students ?? 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="alert alert-info">
                <FaExclamationTriangle />
                <span className="text-sm">
                    Fee information is read-only. Contact your School Admin
                    for fee corrections, payment collection, or verification.
                </span>
            </div>
        </div>
    );
};

export default TeacherFeeDashboard;