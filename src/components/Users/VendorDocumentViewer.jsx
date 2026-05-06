import React from "react";
import ComponentCard from "../common/ComponentCard";
import apiClient from "../../api/apiClient";

export default function VendorDocumentViewer({ documentName, documentUrl }) {
    if (!documentName) return null;

    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            let path = documentUrl;
            const baseURL = import.meta.env.VITE_API_URL || "";
            if (documentUrl.startsWith(baseURL)) {
                path = documentUrl.substring(baseURL.length);
            }
            const res = await apiClient.get(path, { responseType: "blob" });
            const blob = res.data;
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = documentName || "document.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Failed to download file:", error);
            window.open(documentUrl, "_blank");
        }
    };

    return (
        <ComponentCard title="Verification Document">
            <div className="flex items-center justify-between gap-4 p-3 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-white/5">
                <a
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group/doc cursor-pointer min-w-0 flex-1"
                    title="View Document in New Tab"
                >
                    <div className="w-10 h-10 bg-brand-500/10 dark:bg-brand-500/20 rounded-xl flex items-center justify-center text-brand-500 shadow-sm transition-colors group-hover/doc:bg-brand-500 group-hover/doc:text-white">
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
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[150px] group-hover/doc:text-brand-500 transition-colors">
                            {documentName}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium group-hover/doc:text-brand-400 transition-colors">
                            KYC Record
                        </p>
                    </div>
                </a>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <a
                        href={documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-2 text-gray-500 hover:text-brand-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                        title="View Document in New Tab"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5.5 w-5.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                    </a>

                    <button
                        onClick={handleDownload}
                        className="flex items-center justify-center p-2 text-brand-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700 cursor-pointer bg-transparent"
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
                    </button>
                </div>
            </div>
        </ComponentCard>
    );
}