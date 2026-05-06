import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Link, useNavigate } from "react-router";
import Button from "../ui/button/Button";
import { getUserProperties } from "../../api/authApi";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/currency";

export default function UserPropertiesList({ userId }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_URL || "";
    const baseImgUrl = baseURL.replace(/\/$/, "");

    const fetchProperties = async () => {
        if (!userId) return;
        try {
            setLoading(true);
            const res = await getUserProperties(userId);
            if (res && res.data) {
                const userData = Array.isArray(res.data)
                    ? res.data.find(u => u._id === userId) || res.data[0]
                    : res.data;
                setProperties(userData?.properties || []);
            }
        } catch (error) {
            toast.error("Failed to load properties");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [userId]);

    return (
        <ComponentCard title="Service provider properties">
            <div className="overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-xs text-gray-500">Syncing properties..</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50 dark:bg-white/2">
                                    <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Property</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rate</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</TableCell>
                                    <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {properties.length > 0 ? (
                                    properties.map((prop) => (
                                        <TableRow key={prop._id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0">
                                            <TableCell className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 shadow-sm">
                                                        {prop.media?.mainImage?.[0] ? (
                                                            <img
                                                                src={`${baseImgUrl}/uploads/mainImage/${prop.media.mainImage[0]}`}
                                                                alt={prop.name}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <Home size={16} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{prop.name || "Untitled"}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium">Added {prop.createdAt ? new Date(prop.createdAt).toLocaleDateString() : "-"}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-3">
                                                <div className="text-sm font-black text-gray-900 dark:text-white">
                                                    {formatCurrency(prop.price || 0)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-3">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${prop.status === 'publish' || prop.status === 'completed'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}>
                                                    {prop.status || "Draft"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-3 text-right text-[10px]">
                                                <button
                                                    onClick={() => navigate(`/property-details/${prop._id}`)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 text-brand-500 font-bold shadow-sm border border-gray-100 dark:border-gray-700 hover:border-brand-500 transition-all"
                                                >
                                                    View Details
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10 text-gray-400 text-xs italic">
                                            No active property listings found.
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
