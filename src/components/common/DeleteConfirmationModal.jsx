import React from "react";
import Button from "../ui/button/Button";
import { X } from "lucide-react";
import deleteAnimation from "../../lottie/Delete.json";
import Lottie from "lottie-react";

const DeleteConfirmationModal = ({ open, onClose, onConfirm, title, message }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl p-8 relative shadow-2xl border border-gray-100 dark:border-gray-800 animate-fadeIn">
        
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Animation */}
        <div className="flex justify-center mb-4">
          <Lottie
            animationData={deleteAnimation}
            loop={false}
            className="w-24 h-24"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
          {title || "Confirm Delete"}
        </h2>

        {/* Message */}
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-8 px-4">
          {message || "Are you sure you want to delete this item? This action cannot be undone."}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto" 
            onClick={onClose}
          >
            No, Cancel
          </Button>

          <Button
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 border-red-500 text-white"
            onClick={onConfirm}
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
