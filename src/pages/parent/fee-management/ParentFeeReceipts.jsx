import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  getParentChildren,
  getParentFeeReceipts,
} from "../../../services/parentFeeService.js";

import ChildSelector from "../../../components/parent/ChildSelector.jsx";
import FeePagination from "../../../components/parent/FeePagination.jsx";
import ReceiptCard from "../../../components/parent/ReceiptCard.jsx";

const ParentFeeReceipts = () => {
  const [selectedChild, setSelectedChild] = useState("all");
  const [page, setPage] = useState(1);

  const limit = 10;

  const {
    data: childrenData,
    isLoading: childrenLoading,
    isError: childrenError,
  } = useQuery({
    queryKey: ["parent-fee-children"],
    queryFn: getParentChildren,
  });

  const children = childrenData?.children || [];

  const {
    data: receiptData,
    isLoading: receiptsLoading,
    isError: receiptsError,
    error,
  } = useQuery({
    queryKey: ["parent-fee-receipts", selectedChild, page],
    queryFn: () =>
      getParentFeeReceipts({
        ...(selectedChild !== "all"
          ? { student_id: selectedChild }
          : {}),
        page,
        limit,
      }),
    enabled: !childrenLoading && !childrenError,
    placeholderData: (previousData) => previousData,
  });

  const receipts = receiptData?.receipts || [];
  const pagination = receiptData?.pagination || {};

  const totalPages = pagination.totalPages || 1;

  const totalRecords =
    pagination.totalRecords ?? receipts.length;

  const handleChildChange = (childId) => {
    setSelectedChild(childId);
    setPage(1);
  };

  if (childrenLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
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
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold">
          Fee Receipts
        </h2>

        <p className="mt-1 text-sm text-base-content/60">
          View and print receipts for your children's verified fee payments.
        </p>
      </div>

      {/* Child selector */}
      <div className="rounded-xl bg-base-100 p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">Select Child</h3>
            <p className="text-sm text-base-content/60">
              Filter receipts by child.
            </p>
          </div>

          <div className="w-full sm:max-w-xs">
            <ChildSelector
              children={children}
              selectedChild={selectedChild}
              onChange={handleChildChange}
            />
          </div>
        </div>
      </div>

      {/* Receipt count */}
      <div className="rounded-xl bg-base-100 p-5 shadow-sm">
        <p className="text-sm text-base-content/60">
          Total Receipts
        </p>

        <h3 className="mt-2 text-2xl font-bold">
          {totalRecords}
        </h3>
      </div>

      {/* Receipts */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            Receipt History
          </h3>
          <p className="text-sm text-base-content/60">
            Your verified payment receipts.
          </p>
        </div>

        {receiptsLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : receiptsError ? (
          <div className="alert alert-error">
            {error?.response?.data?.message ||
              "Failed to load receipts."}
          </div>
        ) : receipts.length === 0 ? (
          <div className="rounded-xl bg-base-100 p-10 text-center shadow-sm">
            <h3 className="font-semibold">
              No receipts found
            </h3>

            <p className="mt-1 text-sm text-base-content/60">
              Verified fee payment receipts will appear here.
            </p>
          </div>
        ) : (
          receipts.map((receipt) => (
            <ReceiptCard
              key={receipt._id}
              receipt={receipt}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {!receiptsLoading &&
        !receiptsError &&
        totalPages > 1 && (
          <div className="flex justify-center">
            <FeePagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
    </div>
  );
};

export default ParentFeeReceipts;