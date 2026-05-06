export const CURRENCY_SYMBOL = "SAR"; // Change this to "₹", "SAR", or any other currency symbol as needed!

export const formatCurrency = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return `${CURRENCY_SYMBOL} 0`;
    return `${CURRENCY_SYMBOL} ${num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;
};

export const formatDuration = (totalMinutes) => {
    const num = Number(totalMinutes);
    if (isNaN(num) || num <= 0) return "0 Minutes";
    const hours = Math.floor(num / 60);
    const minutes = Math.floor(num % 60);
    const seconds = Math.round((num % 1) * 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours} Hour${hours > 1 ? "s" : ""}`);
    if (minutes > 0 || hours === 0) parts.push(`${minutes} Minute${minutes > 1 ? "s" : ""}`);
    if (seconds > 0) parts.push(`${seconds} Second${seconds > 1 ? "s" : ""}`);

    return parts.join(" ");
};
