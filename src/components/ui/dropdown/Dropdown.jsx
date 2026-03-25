import React, { useEffect, useRef } from "react";

export const Dropdown = ({
  isOpen,
  onClose,
  children,
  className = "",
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !(event.target).closest(".dropdown-toggle")
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-[9999] right-0 mt-2 min-w-[160px] rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark transition-all duration-200 ease-in-out transform origin-top-right ${className}`}
    >
      {children}
    </div>
  );
};
