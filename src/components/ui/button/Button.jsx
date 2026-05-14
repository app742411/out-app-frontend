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
    sm: "px-4 py-2.5 text-sm",
    md: "px-5 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantClasses = {
    primary:
      "bg-brand-500 text-white hover:bg-brand-600 disabled:bg-brand-300",

    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/5",

    success:
      "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300",

    danger:
      "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",

    warning:
      "bg-yellow-500 text-black hover:bg-yellow-600 disabled:bg-yellow-300",

    info:
      "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300",

    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-300",

    dark: "bg-gray-900 text-white hover:bg-black disabled:bg-gray-700",

    light:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:bg-gray-300",
  };

  return (
    <button
    type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition font-medium ${className}
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
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
