import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    AlertCircle,
    RefreshCw,
    Wallet,
} from "lucide-react";

import {
    getParentChildren,
    getParentDueFees,
} from "../../../services/parentFeeService.js";

import ChildSelector from "../../../components/parent/ChildSelector.jsx";
import DueFeeTable from "../../../components/parent/DueFeeTable.jsx";
import FeePagination from "../../../components/parent/FeePagination.jsx";
import FeeDetailsModal from "../../../components/parent/FeeDetailsModal.jsx";
import ParentFeePaymentModal from "../../../components/parent/ParentFeePaymentModal.jsx";


const ParentDueFees = () => {
    // --------------------------------
    // State
    // --------------------------------

    const [selectedChild, setSelectedChild] = useState("all");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [selectedFee, setSelectedFee] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [selectedPaymentFee, setSelectedPaymentFee] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);


    // --------------------------------
    // Fetch Children
    // --------------------------------

    const {
        data: childrenData,
        isLoading: childrenLoading,
        isError: childrenError,
        error: childrenErrorMessage,
        refetch: refetchChildren,
    } = useQuery({
        queryKey: ["parent-children"],
        queryFn: getParentChildren,
    });

    const children = Array.isArray(childrenData?.children)
        ? childrenData.children
        : [];


    // --------------------------------
    // Fetch Due Fees
    // --------------------------------

    const {
        data: dueFeesData,
        isLoading: dueFeesLoading,
        isError: dueFeesError,
        error: dueFeesErrorMessage,
        refetch: refetchDueFees,
    } = useQuery({
        queryKey: [
            "parent-due-fees",
            selectedChild,
            page,
            limit,
        ],
        queryFn: () =>
            getParentDueFees({
                student_id:
                    selectedChild === "all"
                        ? undefined
                        : selectedChild,
                page,
                limit,
            }),
    });


    // --------------------------------
    // Extract Due Fee Data
    // --------------------------------

    // Backend returns records, not fees.
    const fees = Array.isArray(dueFeesData?.records)
        ? dueFeesData.records
        : [];

    const pagination = dueFeesData?.pagination || {};

    const totalPages = pagination.totalPages || 1;

    // This is the current page's total.
    // For an overall total, return summary.total_due from the backend.
    const totalDue = fees.reduce(
        (total, fee) => total + Number(fee.due_amount || 0),
        0
    );


    // --------------------------------
    // Child Selection
    // --------------------------------

    // childId must be the MongoDB student ObjectId (_id).
    const handleChildChange = (childId) => {
        setSelectedChild(childId);
        setPage(1);
    };


    // --------------------------------
    // Fee Details Modal
    // --------------------------------

    const handleViewDetails = (fee) => {
        setSelectedFee(fee);
        setShowDetailsModal(true);
    };

    const handleCloseDetails = () => {
        setShowDetailsModal(false);
        setSelectedFee(null);
    };


    // --------------------------------
    // Payment Modal
    // --------------------------------

    const handlePayNow = (fee) => {
        setSelectedPaymentFee(fee);
        setShowPaymentModal(true);
    };

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
        setSelectedPaymentFee(null);
    };

    const handlePaymentSuccess = async () => {
        handleClosePaymentModal();

        await refetchDueFees();
    };


    // --------------------------------
    // Refresh
    // --------------------------------

    const handleRefresh = async () => {
        await Promise.all([
            refetchChildren(),
            refetchDueFees(),
        ]);
    };


    // --------------------------------
    // Loading State
    // --------------------------------

    if (childrenLoading || dueFeesLoading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }


    // --------------------------------
    // Error State
    // --------------------------------

    if (childrenError || dueFeesError) {
        return (
            <div className="rounded-xl border border-error/30 bg-base-100 p-6">

                <div className="flex items-center gap-3 text-error">

                    <AlertCircle size={24} />

                    <div>
                        <h2 className="font-semibold">
                            Failed to Load Due Fees
                        </h2>

                        <p className="mt-1 text-sm">
                            {childrenErrorMessage?.message ||
                                dueFeesErrorMessage?.message ||
                                "Something went wrong while loading your due fees."}
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    className="btn btn-primary btn-sm mt-4"
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>

            </div>
        );
    }


    // --------------------------------
    // Main UI
    // --------------------------------

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                    <h1 className="text-2xl font-bold text-base-content">
                        Due Fees
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        View outstanding fees and make payments for your children.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    className="btn btn-outline btn-sm"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>

            </div>


            {/* Total Due Card */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">

                <div className="card-body">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-base-content/60">
                                Total Outstanding Amount
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-error">
                                ৳{totalDue.toLocaleString("en-BD", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </h2>
                        </div>

                        <div className="rounded-full bg-error/10 p-4 text-error">
                            <Wallet size={28} />
                        </div>

                    </div>

                </div>

            </div>


            {/* Child Selector */}
            <div className="rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm">

                <h2 className="mb-3 font-semibold">
                    Filter by Child
                </h2>

                <ChildSelector
                    children={children}
                    selectedChild={selectedChild}
                    onChange={handleChildChange}
                />

            </div>


            {/* Due Fees Table */}
            <div className="overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">

                <div className="border-b border-base-300 p-4">

                    <h2 className="font-semibold">
                        Outstanding Fee Records
                    </h2>

                    <p className="mt-1 text-sm text-base-content/60">
                        {pagination.totalRecords ?? fees.length} record(s) found.
                    </p>

                </div>

                <DueFeeTable
                    fees={fees}
                    onViewDetails={handleViewDetails}
                    onPayNow={handlePayNow}
                />

                {fees.length > 0 && (
                    <div className="border-t border-base-300 p-4">

                        <FeePagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />

                    </div>
                )}

            </div>


            {/* Fee Details Modal */}
            <FeeDetailsModal
                fee={selectedFee}
                isOpen={showDetailsModal}
                onClose={handleCloseDetails}
            />


            {/* Payment Modal */}
            <ParentFeePaymentModal
                fee={selectedPaymentFee}
                isOpen={showPaymentModal}
                onClose={handleClosePaymentModal}
                onPaymentSuccess={handlePaymentSuccess}
            />

        </div>
    );
};

export default ParentDueFees;

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//     AlertCircle,
//     RefreshCw,
//     Wallet,
// } from "lucide-react";

// import {
//     getParentChildren,
//     getParentDueFees,
// } from "../../../services/parentFeeService.js";

// import ChildSelector from "../../../components/parent/ChildSelector.jsx";
// import DueFeeTable from "../../../components/parent/DueFeeTable.jsx";
// import FeePagination from "../../../components/parent/FeePagination.jsx";
// import FeeDetailsModal from "../../../components/parent/FeeDetailsModal.jsx";
// import ParentFeePaymentModal from "../../../components/parent/ParentFeePaymentModal.jsx";


// const ParentDueFees = () => {
//     // --------------------------------
//     // State
//     // --------------------------------

//     const [selectedChild, setSelectedChild] = useState("all");
//     const [page, setPage] = useState(1);
//     const [limit] = useState(10);

//     const [selectedFee, setSelectedFee] = useState(null);
//     const [showDetailsModal, setShowDetailsModal] = useState(false);

//     const [selectedPaymentFee, setSelectedPaymentFee] = useState(null);
//     const [showPaymentModal, setShowPaymentModal] = useState(false);


//     // --------------------------------
//     // Fetch Children
//     // --------------------------------

//     const {
//         data: childrenData,
//         isLoading: childrenLoading,
//         isError: childrenError,
//         error: childrenErrorMessage,
//         refetch: refetchChildren,
//     } = useQuery({
//         queryKey: ["parent-children"],
//         queryFn: getParentChildren,
//     });

//     console.log("childrenData",childrenData);

//     const children = Array.isArray(childrenData?.children)
//         ? childrenData.children
//         : [];


//     // --------------------------------
//     // Fetch Due Fees
//     // --------------------------------

//     const {
//         data: dueFeesData,
//         isLoading: dueFeesLoading,
//         isError: dueFeesError,
//         error: dueFeesErrorMessage,
//         refetch: refetchDueFees,
//     } = useQuery({
//         queryKey: [
//             "parent-due-fees",
//             selectedChild,
//             page,
//             limit,
//         ],
//         queryFn: () =>
//             getParentDueFees({
//                 student_id:
//                     selectedChild === "all"
//                         ? undefined
//                         : selectedChild,
//                 page,
//                 limit,
//             }),
//     });
//     console.log("dueFeesData",dueFeesData)

//     const fees = Array.isArray(dueFeesData?.fees)
//         ? dueFeesData.fees
//         : [];

//     const pagination = dueFeesData?.pagination || {};

//     const totalPages = pagination.totalPages || 1;
//     const totalDue = dueFeesData?.summary?.total_due || 0;


//     // --------------------------------
//     // Child Selection
//     // --------------------------------

//     const handleChildChange = (childId) => {
//         setSelectedChild(childId);
//         setPage(1);
//     };


//     // --------------------------------
//     // Fee Details Modal
//     // --------------------------------

//     const handleViewDetails = (fee) => {
//         setSelectedFee(fee);
//         setShowDetailsModal(true);
//     };

//     const handleCloseDetails = () => {
//         setShowDetailsModal(false);
//         setSelectedFee(null);
//     };


//     // --------------------------------
//     // Payment Modal
//     // --------------------------------

//     const handlePayNow = (fee) => {
//         setSelectedPaymentFee(fee);
//         setShowPaymentModal(true);
//     };

//     const handleClosePaymentModal = () => {
//         setShowPaymentModal(false);
//         setSelectedPaymentFee(null);
//     };

//     const handlePaymentSuccess = async () => {
//         handleClosePaymentModal();

//         await Promise.all([
//             refetchDueFees(),
//         ]);
//     };


//     // --------------------------------
//     // Refresh
//     // --------------------------------

//     const handleRefresh = () => {
//         refetchChildren();
//         refetchDueFees();
//     };


//     // --------------------------------
//     // Loading State
//     // --------------------------------

//     if (childrenLoading || dueFeesLoading) {
//         return (
//             <div className="flex min-h-[300px] items-center justify-center">
//                 <span className="loading loading-spinner loading-lg text-primary"></span>
//             </div>
//         );
//     }


//     // --------------------------------
//     // Error State
//     // --------------------------------

//     if (childrenError || dueFeesError) {
//         return (
//             <div className="rounded-xl border border-error/30 bg-base-100 p-6">
//                 <div className="flex items-center gap-3 text-error">
//                     <AlertCircle size={24} />

//                     <div>
//                         <h2 className="font-semibold">
//                             Failed to Load Due Fees
//                         </h2>

//                         <p className="mt-1 text-sm">
//                             {childrenErrorMessage?.message ||
//                                 dueFeesErrorMessage?.message ||
//                                 "Something went wrong while loading your due fees."}
//                         </p>
//                     </div>
//                 </div>

//                 <button
//                     type="button"
//                     onClick={handleRefresh}
//                     className="btn btn-primary btn-sm mt-4"
//                 >
//                     <RefreshCw size={16} />
//                     Try Again
//                 </button>
//             </div>
//         );
//     }


//     // --------------------------------
//     // Main UI
//     // --------------------------------

//     return (
//         <div className="space-y-6">

//             {/* Page Header */}
//             <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

//                 <div>
//                     <h1 className="text-2xl font-bold text-base-content">
//                         Due Fees
//                     </h1>

//                     <p className="mt-1 text-sm text-base-content/60">
//                         View outstanding fees and make payments for your children.
//                     </p>
//                 </div>

//                 <button
//                     type="button"
//                     onClick={handleRefresh}
//                     className="btn btn-outline btn-sm"
//                 >
//                     <RefreshCw size={16} />
//                     Refresh
//                 </button>

//             </div>


//             {/* Total Due Card */}
//             <div className="card border border-base-300 bg-base-100 shadow-sm">
//                 <div className="card-body">

//                     <div className="flex items-center justify-between">

//                         <div>
//                             <p className="text-sm text-base-content/60">
//                                 Total Outstanding Amount
//                             </p>

//                             <h2 className="mt-2 text-3xl font-bold text-error">
//                                 ৳{Number(totalDue).toLocaleString("en-BD", {
//                                     minimumFractionDigits: 2,
//                                     maximumFractionDigits: 2,
//                                 })}
//                             </h2>
//                         </div>

//                         <div className="rounded-full bg-error/10 p-4 text-error">
//                             <Wallet size={28} />
//                         </div>

//                     </div>

//                 </div>
//             </div>


//             {/* Child Selector */}
//             <div className="rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm">

//                 <h2 className="mb-3 font-semibold">
//                     Filter by Child
//                 </h2>

//                 <ChildSelector
//                     children={children}
//                     selectedChild={selectedChild}
//                     onChange={handleChildChange}
//                 />

//             </div>


//             {/* Due Fees Table */}
//             <div className="overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">

//                 <div className="border-b border-base-300 p-4">
//                     <h2 className="font-semibold">
//                         Outstanding Fee Records
//                     </h2>

//                     <p className="mt-1 text-sm text-base-content/60">
//                         {fees.length} record(s) displayed on this page.
//                     </p>
//                 </div>

//                 <DueFeeTable
//                     fees={fees}
//                     onViewDetails={handleViewDetails}
//                     onPayNow={handlePayNow}
//                 />

//                 {fees.length > 0 && (
//                     <div className="border-t border-base-300 p-4">
//                         <FeePagination
//                             page={page}
//                             totalPages={totalPages}
//                             onPageChange={setPage}
//                         />
//                     </div>
//                 )}

//             </div>


//             {/* Fee Details Modal */}
//             <FeeDetailsModal
//                 fee={selectedFee}
//                 isOpen={showDetailsModal}
//                 onClose={handleCloseDetails}
//             />


//             {/* Payment Modal */}
//             <ParentFeePaymentModal
//                 fee={selectedPaymentFee}
//                 isOpen={showPaymentModal}
//                 onClose={handleClosePaymentModal}
//                 onPaymentSuccess={handlePaymentSuccess}
//             />

//         </div>
//     );
// };

// export default ParentDueFees;

// // import { useState } from "react";
// // import { useQuery } from "@tanstack/react-query";
// // import {
// //     AlertCircle,
// //     RefreshCw,
// //     Wallet,
// // } from "lucide-react";

// // import {
// //     getParentChildren,
// //     getParentDueFees,
// // } from "../../../services/parentFeeService.js";

// // import ChildSelector from "../../../components/parent/ChildSelector.jsx";
// // import DueFeeTable from "../../../components/parent/DueFeeTable.jsx";
// // import FeePagination from "../../../components/parent/FeePagination.jsx";
// // import FeeDetailsModal from "../../../components/parent/FeeDetailsModal.jsx";

// // const formatCurrency = (amount) => {
// //     return new Intl.NumberFormat("en-BD", {
// //         style: "currency",
// //         currency: "BDT",
// //         maximumFractionDigits: 2,
// //     }).format(Number(amount) || 0);
// // };

// // const ParentDueFees = () => {
// //     const [selectedChild, setSelectedChild] = useState("all");
// //     const [page, setPage] = useState(1);

// //     // Fee details modal state
// //     const [selectedFee, setSelectedFee] = useState(null);
// //     const [showDetailsModal, setShowDetailsModal] = useState(false);

// //     const limit = 10;

// //     // -----------------------------------------
// //     // Get parent's children
// //     // -----------------------------------------
// //     const {
// //         data: childrenData,
// //         isLoading: childrenLoading,
// //         isError: childrenError,
// //     } = useQuery({
// //         queryKey: ["parent-fee-children"],
// //         queryFn: getParentChildren,
// //     });

// //     const children = childrenData?.children || [];

// //     // -----------------------------------------
// //     // Get due fee records
// //     // -----------------------------------------
// //     const {
// //         data: dueFeeData,
// //         isLoading: dueFeesLoading,
// //         isError,
// //         error,
// //         refetch,
// //     } = useQuery({
// //         queryKey: [
// //             "parent-due-fees",
// //             selectedChild,
// //             page,
// //         ],
// //         queryFn: () =>
// //             getParentDueFees({
// //                 ...(selectedChild !== "all" && {
// //                     student_id: selectedChild,
// //                 }),
// //                 page,
// //                 limit,
// //             }),
// //         enabled: !childrenLoading && !childrenError,
// //         placeholderData: (previousData) => previousData,
// //     });

// //     const records = dueFeeData?.records || [];

// //     const pagination = dueFeeData?.pagination || {
// //         page: 1,
// //         totalPages: 0,
// //         totalRecords: 0,
// //     };

// //     // -----------------------------------------
// //     // Calculate outstanding amount
// //     // -----------------------------------------
// //     const totalDue = records.reduce(
// //         (total, record) =>
// //             total + (Number(record.due_amount) || 0),
// //         0
// //     );

// //     // -----------------------------------------
// //     // Handlers
// //     // -----------------------------------------
// //     const handleChildChange = (studentId) => {
// //         setSelectedChild(studentId);
// //         setPage(1);
// //     };

// //     // Open fee details modal
// //     const handleViewDetails = (record) => {
// //         setSelectedFee(record);
// //         setShowDetailsModal(true);
// //     };

// //     // Close fee details modal
// //     const handleCloseDetails = () => {
// //         setShowDetailsModal(false);
// //         setSelectedFee(null);
// //     };

// //     if (childrenLoading) {
// //         return (
// //             <div className="flex justify-center py-16">
// //                 <span className="loading loading-spinner loading-lg" />
// //             </div>
// //         );
// //     }

// //     if (childrenError) {
// //         return (
// //             <div className="alert alert-error">
// //                 Failed to load your children. Please try again.
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="space-y-6">

// //             {/* Header */}
// //             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //                 <div>
// //                     <div className="flex items-center gap-2">
// //                         <AlertCircle
// //                             size={24}
// //                             className="text-error"
// //                         />

// //                         <h1 className="text-2xl font-bold">
// //                             Due Fees
// //                         </h1>
// //                     </div>

// //                     <p className="text-sm text-base-content/60 mt-1">
// //                         View outstanding and overdue fees for your children.
// //                     </p>
// //                 </div>

// //                 <button
// //                     type="button"
// //                     className="btn btn-outline btn-sm"
// //                     onClick={() => refetch()}
// //                     disabled={dueFeesLoading}
// //                 >
// //                     <RefreshCw size={16} />
// //                     Refresh
// //                 </button>
// //             </div>

// //             {/* Child selector */}
// //             <div className="bg-base-100 rounded-xl border border-base-300 p-4">
// //                 <ChildSelector
// //                     children={children}
// //                     selectedChild={selectedChild}
// //                     onChange={handleChildChange}
// //                 />
// //             </div>

// //             {/* Outstanding summary */}
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

// //                 <div className="card bg-base-100 border border-base-300 shadow-sm">
// //                     <div className="card-body">
// //                         <div className="flex items-center justify-between">
// //                             <div>
// //                                 <p className="text-sm text-base-content/60">
// //                                     Outstanding on this page
// //                                 </p>

// //                                 <h2 className="text-2xl font-bold text-error mt-2">
// //                                     {formatCurrency(totalDue)}
// //                                 </h2>
// //                             </div>

// //                             <div className="bg-error/10 p-3 rounded-xl">
// //                                 <Wallet
// //                                     size={25}
// //                                     className="text-error"
// //                                 />
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 <div className="card bg-base-100 border border-base-300 shadow-sm">
// //                     <div className="card-body">
// //                         <div className="flex items-center justify-between">
// //                             <div>
// //                                 <p className="text-sm text-base-content/60">
// //                                     Total Due Records
// //                                 </p>

// //                                 <h2 className="text-2xl font-bold mt-2">
// //                                     {pagination.totalRecords}
// //                                 </h2>
// //                             </div>

// //                             <div className="bg-warning/10 p-3 rounded-xl">
// //                                 <AlertCircle
// //                                     size={25}
// //                                     className="text-warning"
// //                                 />
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>

// //             </div>

// //             {/* Due fee table */}
// //             <div className="bg-base-100 rounded-xl border border-base-300 p-4">

// //                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
// //                     <h2 className="font-semibold text-lg">
// //                         Outstanding Fee Records
// //                     </h2>

// //                     <span className="text-sm text-base-content/60">
// //                         {pagination.totalRecords} records found
// //                     </span>
// //                 </div>

// //                 {dueFeesLoading ? (
// //                     <div className="flex justify-center py-12">
// //                         <span className="loading loading-spinner loading-lg" />
// //                     </div>
// //                 ) : isError ? (
// //                     <div className="alert alert-error">
// //                         <span>
// //                             {error?.response?.data?.message ||
// //                                 error?.message ||
// //                                 "Failed to load due fees."}
// //                         </span>
// //                     </div>
// //                 ) : (
// //                     <>
// //                         <DueFeeTable
// //                             records={records}
// //                             onViewDetails={handleViewDetails}
// //                         />

// //                         <FeePagination
// //                             page={pagination.page}
// //                             totalPages={pagination.totalPages}
// //                             onPageChange={setPage}
// //                         />
// //                     </>
// //                 )}
// //             </div>

// //             {/* Fee Details Modal */}
// //             <FeeDetailsModal
// //                 fee={selectedFee}
// //                 isOpen={showDetailsModal}
// //                 onClose={handleCloseDetails}
// //             />

// //         </div>
// //     );
// // };

// // export default ParentDueFees;
