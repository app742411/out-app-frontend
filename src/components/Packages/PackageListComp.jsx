import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Eye, Package, User, Home, Wrench } from "lucide-react";
import ComponentCard from "../common/ComponentCard";
import { getAllPackagesAdmin } from "../../api/authApi";
import toast from "react-hot-toast";

export default function PackageListComp() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({});
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const res = await getAllPackagesAdmin({ page, limit: 10 });
            setPackages(res.data || []);
            setMeta({
                totalPages: res.totalPages,
                total: res.total,
                nextDisabled: res.nextDisabled,
                previousDisabled: res.previousDisabled,
            });
        } catch (error) {
            toast.error("Failed to load packages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, [page]);

    return (
        <ComponentCard title="All Packages">
            <div className="overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="inline-block w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-3 text-xs text-gray-400 font-medium">Loading packages...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50 dark:bg-white/[0.02]">
                                    <TableCell isHeader className="px-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Package</TableCell>
                                    <TableCell isHeader className="px-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provider</TableCell>
                                    <TableCell isHeader className="px-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Contents</TableCell>
                                    <TableCell isHeader className="px-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Price</TableCell>
                                    <TableCell isHeader className="px-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</TableCell>
                                    <TableCell isHeader className="px-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {packages.length > 0 ? (
                                    packages.map((pkg) => (
                                        <TableRow key={pkg._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                                            {/* Package Name */}
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 dark:bg-brand-500/15 flex items-center justify-center text-brand-500 border border-brand-500/10 shadow-sm">
                                                        <Package size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{pkg.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">ID: {pkg._id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Provider */}
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 text-xs font-bold">
                                                        {pkg.user?.firstName?.charAt(0)}{pkg.user?.lastName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 capitalize">{pkg.user?.firstName} {pkg.user?.lastName}</p>
                                                        <p className="text-[10px] text-gray-400">{pkg.user?.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Contents Badges */}
                                            <TableCell className="px-5 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 text-[10px] font-bold">
                                                        <Home size={10} /> 1 Stay
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 text-[10px] font-bold">
                                                        <Wrench size={10} /> {pkg.services?.length || 0} Svc
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Price */}
                                            <TableCell className="px-5 py-4 text-center">
                                                <span className="text-sm font-black text-gray-900 dark:text-white">₹{pkg.price?.toLocaleString()}</span>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell className="px-5 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${pkg.isActive
                                                    ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                                                    : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                                                    }`}>
                                                    {pkg.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </TableCell>

                                            {/* Action */}
                                            <TableCell className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/package-details/${pkg._id}`)}
                                                    className="p-2 rounded-xl text-gray-400 hover:text-brand-500 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-16 text-gray-400 text-xs">
                                            No packages found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && meta.totalPages > 1 && (
                    <div className="p-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Showing page {page} of {meta.totalPages} &middot; {meta.total} total
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={meta.previousDisabled}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-4 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                Previous
                            </button>
                            <button
                                disabled={meta.nextDisabled}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-4 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-bold disabled:opacity-30 shadow-md shadow-brand-500/20 hover:bg-brand-600 transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ComponentCard>
    );
}
