import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

const Button = ({
  children,
  size = "md",
  variant = "primary",
  type = "button",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  const sizeClasses = {
    sm: "px-5 py-3 text-sm",
    md: "px-6 py-3.5 text-sm",
    lg: "px-10 py-4.5 text-base",
  };

  const variantClasses = {
    primary:
      "bg-brand-500 text-white hover:bg-brand-600 disabled:bg-brand-300 focus:ring-brand-500/20",

    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/5 focus:ring-gray-500/20",

    success:
      "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300 focus:ring-green-600/20",

    danger:
      "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 focus:ring-red-600/20",

    warning:
      "bg-yellow-500 text-black hover:bg-yellow-600 disabled:bg-yellow-300 focus:ring-yellow-500/20",

    info:
      "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 focus:ring-blue-500/20",

    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-300 focus:ring-gray-300/20",

    dark: "bg-gray-900 text-white hover:bg-black disabled:bg-gray-700 focus:ring-gray-900/20",

    light:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:bg-gray-300 focus:ring-gray-100/20",
  };

  return (
    <button
      type={type}
      className={clsx(
        twMerge(
          "inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.015] active:scale-[0.985] shadow-sm hover:shadow-md focus:outline-hidden focus:ring-4 font-medium",
          variantClasses[variant],
          sizeClasses[size],
          disabled && "cursor-not-allowed opacity-50 hover:scale-100 active:scale-100 shadow-none hover:shadow-none",
          className
        )
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
