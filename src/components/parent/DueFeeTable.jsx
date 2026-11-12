import {
    Eye,
    CreditCard,
    CalendarDays,
    User,
    Receipt,
} from "lucide-react";

import FeeStatusBadge from "./FeeStatusBadge";

const DueFeeTable = ({
    fees = [],
    onViewDetails,
    onPayNow,
}) => {
    const formatCurrency = (amount) => {
        return `৳${Number(amount || 0).toLocaleString("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "N/A";
        }

        return parsedDate.toLocaleDateString("en-BD", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (!fees.length) {
        return (
            <div className="rounded-xl border border-base-300 bg-base-100 p-10 text-center">
                <Receipt
                    size={42}
                    className="mx-auto mb-3 text-base-content/30"
                />

                <h3 className="text-lg font-semibold">
                    No Due Fees Found
                </h3>

                <p className="mt-1 text-sm text-base-content/60">
                    There are currently no outstanding fees for this student.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">

            {/* Table Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 p-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        Outstanding Fees
                    </h2>

                    <p className="text-sm text-base-content/60">
                        View and pay your outstanding fees.
                    </p>
                </div>

                <div className="badge badge-warning badge-outline">
                    {fees.length} Due {fees.length === 1 ? "Fee" : "Fees"}
                </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
                <table className="table w-full">

                    <thead>
                        <tr className="bg-base-200 text-base-content">
                            <th>Student</th>
                            <th>Fee Category</th>
                            <th>Academic Year</th>
                            <th>Total Amount</th>
                            <th>Paid Amount</th>
                            <th>Due Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th className="text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {fees.map((record) => {
                            const dueAmount = Number(
                                record.due_amount || 0
                            );

                            const isPayable =
                                Number.isFinite(dueAmount) &&
                                dueAmount > 0;

                            return (
                                <tr
                                    key={record._id}
                                    className="hover:bg-base-200/50"
                                >
                                    {/* Student */}
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-full bg-primary/10 p-2">
                                                <User
                                                    size={16}
                                                    className="text-primary"
                                                />
                                            </div>

                                            <div>
                                                <p className="font-medium">
                                                    {record.student_name || "N/A"}
                                                </p>

                                                <p className="text-xs text-base-content/60">
                                                    Roll: {record.student_code || record.student_roll || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Fee Category */}
                                    <td>
                                        <span className="font-medium">
                                            {record.category_name || "N/A"}
                                        </span>
                                    </td>

                                    {/* Academic Year */}
                                    <td>
                                        {record.academic_year || "N/A"}
                                    </td>

                                    {/* Total Amount */}
                                    <td className="font-medium">
                                        {formatCurrency(record.amount)}
                                    </td>

                                    {/* Paid Amount */}
                                    <td className="font-medium text-success">
                                        {formatCurrency(record.paid_amount)}
                                    </td>

                                    {/* Due Amount */}
                                    <td>
                                        <span className="font-semibold text-error">
                                            {formatCurrency(dueAmount)}
                                        </span>
                                    </td>

                                    {/* Due Date */}
                                    <td>
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <CalendarDays
                                                size={15}
                                                className="text-base-content/50"
                                            />

                                            {formatDate(record.due_date)}
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td>
                                        <FeeStatusBadge
                                            status={record.payment_status}
                                        />
                                    </td>

                                    {/* Actions */}
                                    <td>
                                        <div className="flex items-center justify-center gap-2">

                                            {/* View Details */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onViewDetails?.(record)
                                                }
                                                className="btn btn-sm btn-square btn-ghost text-info"
                                                title="View fee details"
                                                aria-label="View fee details"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            {/* Pay Now */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onPayNow?.(record)
                                                }
                                                disabled={!isPayable}
                                                className="btn btn-sm btn-primary"
                                                title="Pay outstanding fee"
                                            >
                                                <CreditCard size={16} />

                                                <span>
                                                    Pay Now
                                                </span>
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>

            {/* Footer */}
            <div className="border-t border-base-300 bg-base-200/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-base-content/60">
                        Showing {fees.length} outstanding fee records.
                    </p>

                    <p className="text-sm font-semibold">
                        Total Due on This Page:{" "}
                        <span className="text-error">
                            {formatCurrency(
                                fees.reduce(
                                    (total, fee) =>
                                        total + Math.max(
                                            0,
                                            Number(fee.due_amount) || 0
                                        ),
                                    0
                                )
                            )}
                        </span>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default DueFeeTable;

// import { AlertCircle, Eye, FileText } from "lucide-react";
// import FeeStatusBadge from "./FeeStatusBadge";

// const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-BD", {
//         style: "currency",
//         currency: "BDT",
//         maximumFractionDigits: 2,
//     }).format(Number(amount) || 0);
// };

// const formatDate = (date) => {
//     if (!date) return "N/A";

//     return new Date(date).toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//     });
// };

// const DueFeeTable = ({ records = [], onViewDetails }) => {
//     if (!records.length) {
//         return (
//             <div className="flex flex-col items-center justify-center py-16 text-center">
//                 <FileText
//                     size={42}
//                     className="text-success/60 mb-3"
//                 />

//                 <h3 className="font-semibold text-lg">
//                     No Due Fees
//                 </h3>

//                 <p className="text-sm text-base-content/60 mt-1">
//                     All fee payments are up to date.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="overflow-x-auto">
//             <table className="table table-zebra">
//                 <thead>
//                     <tr>
//                         <th>#</th>
//                         <th>Student</th>
//                         <th>Fee Category</th>
//                         <th>Academic Year</th>
//                         <th>Total Amount</th>
//                         <th>Paid Amount</th>
//                         <th>Due Amount</th>
//                         <th>Due Date</th>
//                         <th>Status</th>
//                         <th>Action</th>
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {records.map((record, index) => {
//                         const isOverdue =
//                             record.due_date &&
//                             new Date(record.due_date).getTime() <
//                                 new Date().setHours(0, 0, 0, 0);

//                         return (
//                             <tr key={record._id}>
//                                 <td>{index + 1}</td>

//                                 <td>
//                                     <div className="font-medium">
//                                         {record.student_name || "N/A"}
//                                     </div>
//                                 </td>

//                                 <td>
//                                     {record.category_name || "N/A"}
//                                 </td>

//                                 <td>
//                                     {record.academic_year || "N/A"}
//                                 </td>

//                                 <td>
//                                     {formatCurrency(record.amount)}
//                                 </td>

//                                 <td className="text-success font-medium">
//                                     {formatCurrency(record.paid_amount)}
//                                 </td>

//                                 <td className="text-error font-semibold">
//                                     {formatCurrency(record.due_amount)}
//                                 </td>

//                                 <td>
//                                     <div className="flex flex-col gap-1">
//                                         <span>
//                                             {formatDate(record.due_date)}
//                                         </span>

//                                         {isOverdue && (
//                                             <span className="text-xs text-error flex items-center gap-1">
//                                                 <AlertCircle size={13} />
//                                                 Overdue
//                                             </span>
//                                         )}
//                                     </div>
//                                 </td>

//                                 <td>
//                                     {isOverdue ? (
//                                         <span className="badge badge-error badge-outline">
//                                             Overdue
//                                         </span>
//                                     ) : (
//                                         <FeeStatusBadge
//                                             status={record.payment_status}
//                                         />
//                                     )}
//                                 </td>

//                                 <td>
//                                     <button
//                                         type="button"
//                                         className="btn btn-sm btn-ghost"
//                                         onClick={() => onViewDetails(record)}
//                                         title="View fee details"
//                                     >
//                                         <Eye size={17} />
//                                     </button>
//                                 </td>
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default DueFeeTable;
