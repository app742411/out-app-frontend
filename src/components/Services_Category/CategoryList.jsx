import React, {
  useState,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

import ComponentCard from "../common/ComponentCard";
import Pagination from "../common/Pagination";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { Pencil, Trash2, X, Check, Search, Filter } from "lucide-react";
import { Select } from "../ui/select/Select";
import {
  getCategories,
  deleteCategory,
  updateCategory,
} from "../../api/authApi";

import toast from "react-hot-toast";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

const ITEMS_PER_PAGE = 5;

const CategoryList = forwardRef(({ onEdit }, ref) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const baseURL = import.meta.env.VITE_API_URL;

  // FETCH CATEGORIES
  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);

      const res = await getCategories({
        page,
        limit: 5,
        search,
        sortBy,
      });

      setCategories(res.data || []);
      setCurrentPage(res.page || page);
      setTotalPages(res.totalPages || 0);

    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };


  useImperativeHandle(ref, () => ({
    refreshList: () => fetchCategories(currentPage),
  }));

  useEffect(() => {
    fetchCategories(1);
  }, [search, sortBy]);

  return (
    <>
      <ComponentCard title="All Categories" className="">
        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-11 pr-4 py-2.5 text-sm text-gray-800 dark:text-white bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl focus:border-brand-300 dark:focus:border-brand-500/30 focus:outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 hidden md:block">Sort by:</span>
            <div className="relative">
              <Select
                // className="appearance-none pl-4 pr-10 py-2.5 text-sm text-gray-800 dark:text-white/90 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl focus:border-brand-300 dark:focus:border-brand-500/30 focus:outline-none transition-all cursor-pointer min-w-[160px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="asc">Ascending (A-Z)</option>
                <option value="desc">Descending (Z-A)</option>
                <option value="latest">Latest Added</option>
              </Select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                <Filter size={14} />
              </span>
            </div>
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
                      Image
                    </TableCell>
                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Category
                    </TableCell>
                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Total Services
                    </TableCell>
                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-dashed divide-gray-200 dark:divide-white/5">
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <TableRow key={category._id}>
                        <TableCell className="px-5 py-2">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </TableCell>

                        <TableCell className="px-5 py-2">
                          <div className="w-12 h-12 overflow-hidden rounded border border-gray-100 dark:border-gray-800 p-1">
                            <img
                              src={`${baseURL}/uploads/categories/${category.image}`}
                              alt={category.category}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-2 capitalize font-medium text-gray-800 dark:text-white">
                          {category.category}
                        </TableCell>

                        <TableCell className="px-5 py-2">
                          {category.totalProducts || 0}
                        </TableCell>

                        <TableCell className="px-5 py-2 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => onEdit(category)}
                              className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-500/10 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                setCategoryToDelete(category);
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
                      <TableCell colSpan={12} className="text-center py-6">
                        No categories found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              setCurrentPage(newPage);
              fetchCategories(newPage);
            }}
          />
        )}
      </ComponentCard>

      {/* DELETE POPUP */}
      <DeleteConfirmationModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          try {
            await deleteCategory(categoryToDelete._id);
            toast.success("Category deleted");
            setDeleteOpen(false);
            fetchCategories(currentPage);
          } catch {
            toast.error("Failed to delete category");
          }
        }}
        title="Delete Category"
        message="Are you sure you want to delete this category? This will also remove all services linked to it."
      />
    </>
  );
});

export default CategoryList;
