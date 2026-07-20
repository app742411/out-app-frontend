import React from "react";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    const modalContent = (
        <div 
            className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-all duration-200 animate-in fade-in"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-sm rounded-3xl border border-gray-250 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:border-gray-800 dark:bg-gray-900 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center">
                    {/* Logout Icon Container */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 border border-red-500/20 mb-4 animate-bounce">
                        <LogOut size={26} />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Confirm Log Out
                    </h3>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px]">
                        Are you sure you want to sign out of your account? Your active dashboard session will be ended.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white bg-white/50 dark:bg-white/[0.02] rounded-xl transition-all duration-150 active:scale-95 cursor-pointer uppercase tracking-wider"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="w-full px-4 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer uppercase tracking-wider shadow-xs shadow-red-500/20"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
