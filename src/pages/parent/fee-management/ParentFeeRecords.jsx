
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, RefreshCw } from "lucide-react";

import {
    getParentChildren,
    getParentFees,
} from "../../../services/parentFeeService.js";

import ChildSelector from "../../../components/parent/ChildSelector.jsx";
import FeeRecordTable from "../../../components/parent/FeeRecordTable.jsx";
import FeePagination from "../../../components/parent/FeePagination.jsx";
import FeeDetailsModal from "../../../components/parent/FeeDetailsModal.jsx";

const ParentFeeRecords = () => {
    const [selectedChild, setSelectedChild] = useState("all");
    const [page, setPage] = useState(1);

    const [selectedFee, setSelectedFee] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const limit = 10;

    // Fetch parent's children
    const {
        data: childrenData,
        isLoading: childrenLoading,
        isError: childrenError,
    } = useQuery({
        queryKey: ["parent-fee-children"],
        queryFn: getParentChildren,
    });

    const children = childrenData?.children || [];

    // Fetch fee records
    const {
        data: feeData,
        isLoading: feesLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["parent-fee-records", selectedChild, page],
        queryFn: () =>
            getParentFees({
                ...(selectedChild !== "all" && {
                    student_id: selectedChild,
                }),
                page,
                limit,
            }),
        enabled: !childrenLoading && !childrenError,
        placeholderData: (previousData) => previousData,
    });

    const records = feeData?.records || [];

    const pagination = feeData?.pagination || {
        page: 1,
        totalPages: 0,
    };

    const handleChildChange = (studentId) => {
        setSelectedChild(studentId);
        setPage(1);
    };

    // Open fee details modal
    const handleViewDetails = (record) => {
        setSelectedFee(record);
        setShowDetailsModal(true);
    };

    // Close fee details modal
    const handleCloseDetails = () => {
        setShowDetailsModal(false);
        setSelectedFee(null);
    };

    if (childrenLoading) {
        return (
            <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (childrenError) {
        return (
            <div className="alert alert-error">
                Failed to load your children's information.
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <FileText size={24} className="text-primary" />

                        <h1 className="text-2xl font-bold">
                            Fee Records
                        </h1>
                    </div>

                    <p className="text-sm text-base-content/60 mt-1">
                        View all fee records assigned to your children.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => refetch()}
                    disabled={feesLoading}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Child filter */}
            <div className="bg-base-100 rounded-xl border border-base-300 p-4">
                <ChildSelector
                    children={children}
                    selectedChild={selectedChild}
                    onChange={handleChildChange}
                />
            </div>

            {/* Fee records */}
            <div className="bg-base-100 rounded-xl border border-base-300 p-4">

                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg">
                        All Fee Records
                    </h2>

                    <span className="text-sm text-base-content/60">
                        {feeData?.pagination?.totalRecords || 0} Records
                    </span>
                </div>

                {feesLoading ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : isError ? (
                    <div className="alert alert-error">
                        <span>
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Failed to load fee records."}
                        </span>
                    </div>
                ) : (
                    <>
                        <FeeRecordTable
                            records={records}
                            onViewDetails={handleViewDetails}
                        />

                        <FeePagination
                            page={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>

            {/* Fee Details Modal */}
            <FeeDetailsModal
                fee={selectedFee}
                isOpen={showDetailsModal}
                onClose={handleCloseDetails}
            />

        </div>
    );
};

export default ParentFeeRecords;