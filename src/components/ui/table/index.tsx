import { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <div className="relative w-full overflow-visible">
      <table className={`min-w-full divide-y divide-gray-200 dark:divide-white/[0.05] ${className}`}>
        {children}
      </table>
    </div>
  );
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={`bg-gray-50 dark:bg-white/[0.02] ${className}`}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={`divide-y divide-gray-200 dark:divide-white/[0.05] ${className}`}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={`hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${className}`}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className = "",
}) => {
  const CellTag = isHeader ? "th" : "td";
  const baseClasses = isHeader
    ? "px-5 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400"
    : "px-5 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300";
    
  return <CellTag className={`${baseClasses} ${className}`}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
