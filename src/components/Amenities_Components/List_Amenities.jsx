import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import Button from "../../components/ui/button/Button";
import * as Icons from "lucide-react";
import { Pencil, Trash2, X, Check, Search } from "lucide-react";
import Pagination from "../common/Pagination";
import ComponentCard from "../common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";

import {
  listAmenities,
  deleteAmenity,
  updateAmenities,
} from "../../api/authApi";

const List_Amenities = forwardRef(({ onEdit }, ref) => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Delete confirmation state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const pickerRef = useRef(null);

  // Pagination
  const [nextDisabled, setNextDisabled] = useState(false);
  const [previousDisabled, setPreviousDisabled] = useState(false);
  const [nextPageNum, setNextPageNum] = useState(null);
  const [previousPageNum, setPreviousPageNum] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Close icon picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpenPickerIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load amenities
  const loadAmenities = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await listAmenities(pageNumber, 5, search);

      setAmenities(res.data || []);
      setTotalPages(res.totalPages || 1);
      setPage(res.page || pageNumber);

      setNextDisabled(res.nextDisabled);
      setPreviousDisabled(res.previousDisabled);
      setNextPageNum(res.nextPage);
      setPreviousPageNum(res.previousPage);
    } catch (error) {
      console.log("AMENITY ERROR:", error);
      toast.error("Failed to load amenities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAmenities(1);
  }, [search]);

  // Allow parent to refresh
  useImperativeHandle(ref, () => ({
    refreshList() {
      loadAmenities(page);
    },
  }));

  // ---------------------------
  // DELETE AMENITY
  // ---------------------------
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteAmenity(itemToDelete._id);
      toast.success("Amenity deleted");
      setDeleteOpen(false);
      loadAmenities(page);
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <ComponentCard title="Amenities List">
      <div className="w-full relative">
        {/* Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search amenities..."
              className="w-full pl-11 pr-4 py-2.5 text-sm text-gray-800 dark:text-white bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl focus:border-brand-300 dark:focus:border-brand-500/30 focus:outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
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
                      Icon
                    </TableCell>
                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Amenity Name
                    </TableCell>
                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-dashed divide-gray-200 dark:divide-white/5">
                  {amenities.length > 0 ? (
                    amenities.map((item, index) => {
                      const IconComponent =
                        item.icon && Icons[item.icon]
                          ? Icons[item.icon]
                          : Icons.Circle;

                      return (
                        <TableRow key={item._id}>
                          <TableCell className="px-5 py-3 text-sm text-gray-500">
                            {(page - 1) * 5 + index + 1}
                          </TableCell>

                          {/* ICON */}
                          <TableCell className="px-5 py-3">
                            <div className="flex justify-start">
                              <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                                <IconComponent size={18} className="text-gray-700 dark:text-gray-300" />
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="px-5 py-3 capitalize font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </TableCell>

                          {/* ACTION BUTTONS */}
                          <TableCell className="px-5 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => onEdit(item)}
                                className="p-2 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-500/10 transition-all"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  setItemToDelete(item);
                                  setDeleteOpen(true);
                                }}
                                className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-all"
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
                      <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                        No amenities found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* PAGINATION */}
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={loadAmenities}
          />
        </div>
        <DeleteConfirmationModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Amenity"
          message="Are you sure you want to delete this amenity?"
        />
      </div>
    </ComponentCard>
  );
});

export default List_Amenities;
