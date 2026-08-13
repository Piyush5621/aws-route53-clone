"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-300 py-3 px-1 select-none">
      {/* Page Size Selector */}
      <div className="flex items-center space-x-2">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-[#0f1b2a] border border-[#384c63] rounded px-2 py-1 text-white focus:outline-none focus:border-[#ec7211]"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Item Counter & Navigation Buttons */}
      <div className="flex items-center space-x-4">
        <span>
          Showing {startItem}-{endItem} of {totalItems} items
        </span>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || totalPages === 0}
            className={`p-1.5 rounded border transition-colors ${
              currentPage === 1 || totalPages === 0
                ? "bg-[#161e2e] border-[#384c63] text-gray-600 cursor-not-allowed"
                : "bg-[#161e2e] border-[#384c63] text-gray-300 hover:text-white hover:border-gray-400"
            }`}
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 font-medium">
            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-1.5 rounded border transition-colors ${
              currentPage === totalPages || totalPages === 0
                ? "bg-[#161e2e] border-[#384c63] text-gray-600 cursor-not-allowed"
                : "bg-[#161e2e] border-[#384c63] text-gray-300 hover:text-white hover:border-gray-400"
            }`}
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
