import { Eye, FileText } from "lucide-react";
import FeeStatusBadge from "./FeeStatusBadge";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
};

const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const FeeRecordTable = ({ records = [], onViewDetails }) => {
    if (!records.length) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText size={42} className="text-base-content/30 mb-3" />

                <h3 className="font-semibold text-lg">
                    No Fee Records Found
                </h3>

                <p className="text-sm text-base-content/60 mt-1">
                    There are no fee records available for this selection.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Fee Category</th>
                        <th>Academic Year</th>
                        <th>Amount</th>
                        <th>Paid</th>
                        <th>Due</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {records.map((record, index) => (
                        <tr key={record._id}>
                            <td>{index + 1}</td>

                            <td>
                                <div className="font-medium">
                                    {record.student_name || "N/A"}
                                </div>
                            </td>

                            <td>{record.category_name || "N/A"}</td>

                            <td>{record.academic_year || "N/A"}</td>

                            <td>{formatCurrency(record.amount)}</td>

                            <td className="text-success font-medium">
                                {formatCurrency(record.paid_amount)}
                            </td>

                            <td className="text-error font-medium">
                                {formatCurrency(record.due_amount)}
                            </td>

                            <td>{formatDate(record.due_date)}</td>

                            <td>
                                <FeeStatusBadge
                                    status={record.payment_status}
                                />
                            </td>

                            <td>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-ghost"
                                    onClick={() => onViewDetails(record)}
                                    title="View fee details"
                                >
                                    <Eye size={17} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FeeRecordTable;