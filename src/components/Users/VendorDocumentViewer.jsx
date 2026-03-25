import React from "react";
import ComponentCard from "../common/ComponentCard";

export default function VendorDocumentViewer({ documentName, documentUrl }) {
    if (!documentName) return null;

    return (
        <ComponentCard title="Verification Document">
            <div className="flex items-center justify-between gap-4 p-3 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-500/10 dark:bg-brand-500/20 rounded-xl flex items-center justify-center text-brand-500 shadow-sm">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                            {documentName}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">
                            KYC Record
                        </p>
                    </div>
                </div>

                <a
                    href={documentUrl}
                    download
                    className="flex items-center justify-center p-2 text-brand-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                    title="Download Document"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                </a>
            </div>
        </ComponentCard>
    );
}