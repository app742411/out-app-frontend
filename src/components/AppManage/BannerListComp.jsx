import React from "react";
import ComponentCard from "../common/ComponentCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { deleteBanner } from "../../api/authApi";
import toast from "react-hot-toast";


const BASE_URL = import.meta.env.VITE_API_URL;

export default function BannerListComp({ banners, loading, fetchBanners, setEditBanner, search, setSearch }) {

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;
        try {
            await deleteBanner(id);
            toast.success("Banner deleted successfully");
            if (fetchBanners) fetchBanners();
        } catch (error) {
            toast.error(error.message || "Failed to delete banner");
        }
    };

    return (
        <ComponentCard title="Banner List">
            {/* Search */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 bg-transparent">
                <input
                    type="text"
                    placeholder="Search banners..."
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
                                <TableCell isHeader className="px-5 py-3">Image</TableCell>
                                <TableCell isHeader className="px-5 py-3">Title</TableCell>
                                <TableCell isHeader className="px-5 py-3">Type</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-right">Action</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                                        Loading banners...
                                    </TableCell>
                                </TableRow>
                            ) : banners?.length > 0 ? (
                                banners.map((banner) => (
                                    <TableRow key={banner._id || banner.id}>
                                        <TableCell className="px-5 py-4">
                                            {banner.image ? (
                                                <div className="w-20 h-10 overflow-hidden rounded border border-gray-100 dark:border-gray-800">
                                                    <img
                                                        src={`${BASE_URL}/uploads/bannerImg/${banner.image}`}
                                                        alt={banner.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
                                                    No Image
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                                            {banner.title}
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400`}>
                                                {banner.bannerType || "N/A"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-left">
                                            <div className="flex items-center justify-start gap-3">
                                                <button
                                                    onClick={() => setEditBanner(banner)}
                                                    title="Edit Banner"
                                                    className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-500/10 transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(banner._id || banner.id)}
                                                    title="Delete Banner"
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
                                        No banners found.
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
