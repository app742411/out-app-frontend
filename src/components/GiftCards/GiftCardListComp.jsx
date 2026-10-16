import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import {
  Gift,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Check,
  Wallet,
  Users,
  User,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/currency";
import Pagination from "../common/Pagination";
import { updateGiftCard } from "../../api/giftCardApi";

export default function GiftCardListComp({
  giftCards = [],
  loading = false,
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  search = "",
  setSearch,
  targetType = "",
  setTargetType,
  status = "",
  setStatus,
  onOpenCreate,
  onOpenEdit,
  onOpenDetails,
  onOpenWallet,
  onConfirmDelete,
  onRefresh,
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const handleCopyCode = (id, code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`Copied code: ${code}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleActive = async (card) => {
    try {
      setTogglingId(card._id);
      const newStatus = !card.isActive;
      await updateGiftCard(card._id, { isActive: newStatus });
      toast.success(`Gift card is now ${newStatus ? "Active" : "Inactive"}`);
      onRefresh?.();
    } catch (error) {
      toast.error(error?.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <ComponentCard
      title="Gift Cards Management"
      desc="Create, distribute, and track digital gift cards for customer wallet credits."
      action={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenWallet()}
            startIcon={<Wallet className="w-4 h-4 text-emerald-600" />}
          >
            Check User Wallet
          </Button>
          <Button
            size="sm"
            onClick={onOpenCreate}
            startIcon={<Plus className="w-4 h-4" />}
          >
            Create Gift Card
          </Button>
        </div>
      }
    >
      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search code, title, or description..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-brand-500 shadow-2xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Selects */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Target Type Filter */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="font-medium text-gray-700 dark:text-gray-300">Audience:</span>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-hidden focus:border-brand-500 cursor-pointer"
            >
              <option value="">All Audiences</option>
              <option value="ALL">Public (All Users)</option>
              <option value="SPECIFIC_USER">Specific User</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-hidden focus:border-brand-500 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          {(search || targetType || status) && (
            <button
              onClick={() => {
                setSearch("");
                setTargetType("");
                setStatus("");
              }}
              className="text-xs text-brand-500 hover:text-brand-600 font-medium px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-visible rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02] shadow-2xs">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader className="px-5 py-3.5">
                  Voucher Code
                </TableCell>
                <TableCell isHeader className="px-5 py-3.5">
                  Title & Details
                </TableCell>
                <TableCell isHeader className="px-5 py-3.5">
                  Face Value
                </TableCell>
                <TableCell isHeader className="px-5 py-3.5">
                  Target
                </TableCell>
                <TableCell isHeader className="px-5 py-3.5">
                  Usage
                </TableCell>
                <TableCell isHeader className="px-5 py-3.5">
                  Validity
                </TableCell>
                <TableCell isHeader className="px-5 py-3.5">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3.5 text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Loading gift cards...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : giftCards.length > 0 ? (
                giftCards.map((card) => {
                  const isExpired = card.expiryDate && new Date(card.expiryDate) < new Date();
                  const timesUsed =
                    card.timesUsed !== undefined
                      ? card.timesUsed
                      : Array.isArray(card.usedBy)
                      ? card.usedBy.length
                      : 0;
                  const isUnlimited = card.usageLimit === null || card.usageLimit === undefined;

                  const isSpecific = card.targetType === "SPECIFIC_USER";
                  const assignedUser = card.applicableUser;
                  const isUserObj = Boolean(assignedUser && typeof assignedUser === "object");
                  const assignedUserId = isUserObj ? assignedUser._id : assignedUser;
                  const assignedUserName = isUserObj
                    ? [assignedUser.firstName, assignedUser.lastName].filter(Boolean).join(" ") ||
                      assignedUser.name ||
                      assignedUser.email ||
                      assignedUser.phone ||
                      "Specific User"
                    : assignedUser
                    ? "User Assigned"
                    : "Specific User";

                  return (
                    <TableRow key={card._id}>
                      {/* Code with Copy */}
                      <TableCell className="px-5 py-4 font-mono font-bold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-lg text-xs tracking-wider border border-brand-200/50 dark:border-brand-800/50">
                            {card.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(card._id, card.code)}
                            className="p-1 rounded text-gray-400 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Copy code"
                          >
                            {copiedId === card._id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      {/* Title & Description */}
                      <TableCell className="px-5 py-4">
                        <div className="max-w-xs">
                          <p className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-1">
                            {card.title || "Gift Voucher"}
                          </p>
                          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                            {card.description || "No description provided"}
                          </p>
                        </div>
                      </TableCell>

                      {/* Face Value */}
                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <span className="font-extrabold text-gray-900 dark:text-white text-sm">
                          {formatCurrency(card.amount)}
                        </span>
                      </TableCell>

                      {/* Target */}
                      <TableCell className="px-5 py-4">
                        {isSpecific ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40">
                              <User className="w-3 h-3" />
                              {assignedUserName}
                            </span>
                            {assignedUserId && onOpenWallet && (
                              <button
                                onClick={() => onOpenWallet(assignedUserId)}
                                title="View User Wallet"
                                className="p-1 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded"
                              >
                                <Wallet className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
                            <Users className="w-3 h-3" />
                            All Users
                          </span>
                        )}
                      </TableCell>

                      {/* Usage */}
                      <TableCell className="px-5 py-4">
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {timesUsed} / {isUnlimited ? "Unlimited" : card.usageLimit}
                        </div>
                        {!isUnlimited && (
                          <div className="w-16 bg-gray-100 dark:bg-gray-800 rounded-full h-1 mt-1 overflow-hidden">
                            <div
                              className="bg-brand-500 h-1 rounded-full"
                              style={{
                                width: `${Math.min(100, (timesUsed / (card.usageLimit || 1)) * 100)}%`,
                              }}
                            ></div>
                          </div>
                        )}
                      </TableCell>

                      {/* Validity */}
                      <TableCell className="px-5 py-4 text-xs whitespace-nowrap">
                        <div className="text-gray-600 dark:text-gray-400 flex flex-col">
                          <span>
                            {card.startDate ? new Date(card.startDate).toLocaleDateString() : "Immediate"}
                          </span>
                          <span className="text-gray-400 dark:text-gray-600 text-[10px]">to</span>
                          <span className={isExpired ? "text-red-500 font-semibold" : ""}>
                            {card.expiryDate ? new Date(card.expiryDate).toLocaleDateString() : "No Expiry"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status & Quick Toggle */}
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              isExpired
                                ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                : card.isActive
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {isExpired ? "Expired" : card.isActive ? "Active" : "Inactive"}
                          </span>

                          {/* Toggle active switch */}
                          <button
                            type="button"
                            disabled={togglingId === card._id}
                            onClick={() => handleToggleActive(card)}
                            className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                              card.isActive ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-700"
                            }`}
                            title={card.isActive ? "Click to deactivate" : "Click to activate"}
                          >
                            <span
                              className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                                card.isActive ? "left-3.5" : "left-0.5"
                              }`}
                            />
                          </button>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Details */}
                          <button
                            onClick={() => onOpenDetails(card._id)}
                            title="View Details"
                            className="p-2 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => onOpenEdit(card)}
                            title="Edit Card"
                            className="p-2 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onConfirmDelete(card)}
                            title="Delete Card"
                            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-gray-400">
                      <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 mb-4">
                        <Gift className="w-8 h-8" />
                      </div>
                      <h4 className="text-base font-bold text-gray-800 dark:text-white">
                        No Gift Cards Found
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">
                        {search || targetType || status
                          ? "Try adjusting your search filters to find what you're looking for."
                          : "Start creating promotional gift vouchers for your customers."}
                      </p>
                      <Button size="sm" onClick={onOpenCreate} startIcon={<Plus className="w-4 h-4" />}>
                        Create First Gift Card
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </ComponentCard>
  );
}
