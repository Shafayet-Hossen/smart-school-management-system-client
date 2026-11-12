import { ChevronLeft, ChevronRight } from "lucide-react";

const FeePagination = ({
    page,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between gap-3 mt-5">
            <button
                className="btn btn-sm btn-outline"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
            >
                <ChevronLeft size={16} />
                Previous
            </button>

            <span className="text-sm text-base-content/70">
                Page {page} of {totalPages}
            </span>

            <button
                className="btn btn-sm btn-outline"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Next
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default FeePagination;