import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import ComponentCard from "../common/ComponentCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { getRestrooms, updateRestroom, deleteRestroom } from "../../api/authApi";
import toast from "react-hot-toast";
import { Pencil, Trash2, Search } from "lucide-react";

import Pagination from "../common/Pagination";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";

const ITEMS_PER_PAGE = 5;

const RestroomAmenitiesListComp = forwardRef(({ onEdit }, ref) => {
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal States
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [amenityToDelete, setAmenityToDelete] = useState(null);

    const fetchAmenitiesList = async (page = 1) => {
        try {
            setLoading(true);

            // Using the exact structure you requested (page, limit, search)
            const res = await getRestrooms(page, ITEMS_PER_PAGE, search);

            setAmenities(res.data || []);
            setCurrentPage(res.page || page);
            setTotalPages(res.totalPages || 0);

        } catch (error) {
            toast.error("Failed to load restroom amenities");
        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshList: () => fetchAmenitiesList(currentPage),
    }));

    useEffect(() => {
        fetchAmenitiesList(1);
    }, [search]);

    return (
        <>
            <ComponentCard title="All Restroom Amenities">
                {/* Search */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="relative w-full md:w-1/2">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search restroom amenities..."
                            className="w-full pl-11 pr-4 py-2.5 text-sm text-gray-800 dark:text-white bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl focus:border-brand-300 dark:focus:border-brand-500/30 focus:outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-visible rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        {loading ? (
                            <div className="text-center p-6 text-gray-500">Loading...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            S.No.
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Name
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Added On
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="divide-y divide-dashed divide-gray-200 dark:divide-white/5">
                                    {amenities.length > 0 ? (
                                        amenities.map((amenity, index) => (
                                            <TableRow key={amenity._id || index}>
                                                <TableCell className="px-5 py-2">
                                                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                                </TableCell>

                                                <TableCell className="px-5 py-2 capitalize font-medium text-gray-900 dark:text-white">
                                                    {amenity.name}
                                                </TableCell>

                                                <TableCell className="px-5 py-2">
                                                    {amenity.createdAt ? new Date(amenity.createdAt).toLocaleDateString() : "-"}
                                                </TableCell>

                                                <TableCell className="px-5 py-2 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button
                                                            onClick={() => onEdit(amenity)}
                                                            className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-500/10 transition-colors"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setAmenityToDelete(amenity);
                                                                setDeleteOpen(true);
                                                            }}
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
                                            <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                                                No restroom amenities found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {!loading && totalPages > 0 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(newPage) => {
                                setCurrentPage(newPage);
                                fetchAmenitiesList(newPage);
                            }}
                        />
                    </div>
                )}
            </ComponentCard>



            <DeleteConfirmationModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={async () => {
                    try {
                        await deleteRestroom(amenityToDelete._id);
                        toast.success("Restroom amenity deleted");
                        setDeleteOpen(false);
                        fetchAmenitiesList(currentPage);
                    } catch {
                        toast.error("Failed to delete restroom amenity");
                    }
                }}
                title="Delete Restroom Amenity"
                message="Are you sure you want to delete this restroom amenity?"
            />
        </>
    );
});

export default RestroomAmenitiesListComp;
