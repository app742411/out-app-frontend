import React from "react";
import Button from "../ui/button/Button";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-5">
            <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
            </span>

            <div className="flex gap-3">
                <Button
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => {
                        if (currentPage > 1) {
                            onPageChange(currentPage - 1);
                        }
                    }}
                >
                    Previous
                </Button>

                <Button
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                        if (currentPage < totalPages) {
                            onPageChange(currentPage + 1);
                        }
                    }}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
