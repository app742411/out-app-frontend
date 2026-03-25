import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Eye, Package, Home, Wrench } from "lucide-react";
import { getPackagesByUserAdmin } from "../../api/authApi";
import toast from "react-hot-toast";

export default function VendorPackagesList({ userId }) {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackages = async () => {
            if (!userId) return;
            try {
                setLoading(true);
                const res = await getPackagesByUserAdmin(userId);
                setPackages(res.data || []);
            } catch (error) {
                toast.error("Failed to load vendor packages");
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, [userId]);

    return (
        <ComponentCard title="Commercial Bundles">
            <div className="overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-xs text-gray-500">Loading packages...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50 dark:bg-white/[0.02]">
                                    <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Package</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Property</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Services</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Price</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {packages.length > 0 ? (
                                    packages.map((pkg) => (
                                        <TableRow key={pkg._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0">
                                            {/* Package Name */}
                                            <TableCell className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 dark:bg-brand-500/15 flex items-center justify-center text-brand-500 border border-brand-500/10">
                                                        <Package size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white capitalize truncate max-w-[180px]">{pkg.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                                                            {new Date(pkg.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Property */}
                                            <TableCell className="px-5 py-3 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 text-[10px] font-bold capitalize">
                                                    <Home size={10} /> {pkg.property?.name || "—"}
                                                </span>
                                            </TableCell>

                                            {/* Services Count */}
                                            <TableCell className="px-5 py-3 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 text-[10px] font-bold">
                                                    <Wrench size={10} /> {pkg.services?.length || 0} Services
                                                </span>
                                            </TableCell>

                                            {/* Price */}
                                            <TableCell className="px-5 py-3 text-center">
                                                <span className="text-sm font-black text-gray-900 dark:text-white">₹{pkg.price?.toLocaleString()}</span>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell className="px-5 py-3 text-center">
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${pkg.isActive
                                                    ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                                                    : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                                                    }`}>
                                                    {pkg.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </TableCell>

                                            {/* Action */}
                                            <TableCell className="px-5 py-3 text-right">
                                                <button
                                                    onClick={() => navigate(`/package-details/${pkg._id}`)}
                                                    className="p-2 rounded-xl text-gray-400 hover:text-brand-500 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-gray-400 text-xs italic">
                                            No packages created by this vendor yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </ComponentCard>
    );
}
