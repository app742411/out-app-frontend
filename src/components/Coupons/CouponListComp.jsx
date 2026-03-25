import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
// import { PencilIcon, TrashIcon } from "../../icons";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCoupon } from "../../api/authApi";
import toast from "react-hot-toast";

export default function CouponListComp({ coupons, loading, fetchCoupons, setEditCoupon, search, setSearch }) {

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await deleteCoupon(id);
            toast.success("Coupon deleted successfully");
            if (fetchCoupons) fetchCoupons();
        } catch (error) {
            toast.error(error.message || "Failed to delete coupon");
        }
    };

    return (
        <ComponentCard title="Coupon List">
            {/* Search */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 bg-transparent">
                <input
                    type="text"
                    placeholder="Search coupons..."
                    className="border rounded-lg p-2 w-full md:w-1/2 dark:bg-gray-800 dark:text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="overflow-visible rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3">Code</TableCell>
                            <TableCell isHeader className="px-5 py-3">Discount</TableCell>
                            <TableCell isHeader className="px-5 py-3">Validity</TableCell>
                            <TableCell isHeader className="px-5 py-3">Usage Limit</TableCell>
                            <TableCell isHeader className="px-5 py-3">Status</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-right">Action</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                                    Loading coupons...
                                </TableCell>
                            </TableRow>
                        ) : coupons.length > 0 ? (
                            coupons.map((coupon) => (
                                <TableRow key={coupon._id}>
                                    <TableCell className="px-5 py-4 font-bold uppercase text-brand-600 dark:text-brand-400">
                                        {coupon.code}
                                    </TableCell>
                                    <TableCell className="px-5 py-4">
                                        {coupon.discountType === 'PERCENTAGE'
                                            ? `${coupon.discountValue}%`
                                            : `$${coupon.discountValue}`}
                                        <div className="text-[10px] text-gray-500 mt-1">
                                            Max: ${coupon.maxDiscount}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-sm">
                                        <div className="flex flex-col whitespace-nowrap text-gray-600 dark:text-gray-400">
                                            <span>{coupon.startDate ? new Date(coupon.startDate).toLocaleDateString() : 'N/A'}</span>
                                            <span className="text-gray-400 dark:text-gray-600 text-[10px]">to</span>
                                            <span>{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4">
                                        {coupon.usageLimit || "Unlimited"}
                                    </TableCell>
                                    <TableCell className="px-5 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${coupon.isActive
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {coupon.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => setEditCoupon(coupon)}
                                                title="Edit Coupon"
                                                className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-500/10 transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(coupon._id)}
                                                title="Delete Coupon"
                                                className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                                    No coupons found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                </div>
            </div>
        </ComponentCard>
    );
}
