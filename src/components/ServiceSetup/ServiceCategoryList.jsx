import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import ComponentCard from "../common/ComponentCard";
import Pagination from "../common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Pencil, Search } from "lucide-react";
import {
  getAllServiceCategories,
  toggleServiceCategoryStatus,
} from "../../api/authApi";
import toast from "react-hot-toast";
import { Select } from "../ui/select/Select";

const ITEMS_PER_PAGE = 5;

const ServiceCategoryList = forwardRef(({ onEdit }, ref) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const baseURL = import.meta.env.VITE_API_URL;

  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getAllServiceCategories({
        page,
        limit: ITEMS_PER_PAGE,
        search,
        sortBy, // Pass sortBy to the API
      });

      let filtered = res.data || [];
      // If API doesn't filter/sort, we continue doing it locally just in case
      // The condition `!res.total` is a placeholder for checking if the API handled filtering.
      // A more robust check might be needed based on actual API response structure.
      if (search && filtered.length > 0 && !res.total) {
        filtered = filtered.filter(cat =>
          cat.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // If API doesn't sort, apply local sorting
      if (!res.sorted && sortBy === "asc") { // Assuming res.sorted indicates if API sorted
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "desc") {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
      }

      setCategories(filtered);
      setTotalPages(res.totalPages || Math.ceil(filtered.length / ITEMS_PER_PAGE));
      setCurrentPage(res.page || page);
    } catch (error) {
      toast.error("Failed to load service categories");
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshList: () => fetchCategories(currentPage),
  }));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  useEffect(() => {
    fetchCategories(currentPage);
  }, [search, sortBy, currentPage]);

  // Use server-side paging if 'total' is present, otherwise fallback to local paging
  const pagedCategories = (categories.length > ITEMS_PER_PAGE || totalPages > 1) && categories.length <= ITEMS_PER_PAGE
    ? categories
    : categories.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  return (
    <>
      <ComponentCard title="Service Categories">
        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search services..."
              className="w-full pl-11 pr-4 py-2.5 text-sm text-gray-800 dark:text-white/90 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl focus:border-brand-500 transition-all focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="asc">Name (A-Z)</option>
              <option value="desc">Name (Z-A)</option>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center p-12">
                <div className="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-500">Loading services...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">S.No.</TableCell>
                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Icon</TableCell>
                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</TableCell>
                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</TableCell>
                    <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {pagedCategories.length > 0 ? (
                    pagedCategories.map((category, index) => (
                      <TableRow key={category._id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                        <TableCell className="px-5 py-4">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </TableCell>

                        <TableCell className="px-5 py-2">
                          <div className="w-12 h-12 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 p-1 bg-gray-50 dark:bg-gray-800/50">
                            <img
                              src={`${baseURL}/uploads/serviceIcon/${category.icon}`}
                              alt={category.name}
                              className="object-cover w-full h-full rounded-lg"
                              onError={(e) => {
                                e.target.src = "/images/home/properties2.webp";
                              }}
                            />
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-2 font-medium text-gray-800 dark:text-white capitalize">
                          {category.name}
                        </TableCell>

                        <TableCell className="px-5 py-2 text-center">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${category.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              }`}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>


                        <TableCell className="px-5 py-2 text-right">
                          <div className="flex items-center justify-end gap-4">
                            {/* Toggle Switch */}
                            <button
                              onClick={async () => {
                                try {
                                  await toggleServiceCategoryStatus(category._id);
                                  toast.success("Status updated");
                                  fetchCategories();
                                } catch (error) {
                                  toast.error("Failed to update status");
                                }
                              }}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${category.isActive ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${category.isActive ? "translate-x-6" : "translate-x-1"
                                  }`}
                              />
                            </button>

                            <button
                              onClick={() => onEdit(category)}
                              className="p-2 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-500/10 transition-all"
                            >
                              <Pencil size={18} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-gray-500 bg-gray-50/30 dark:bg-white/5">
                        No service categories found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {!loading && totalPages > 1 && (
          <div className="mt-6 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(newPage) => setCurrentPage(newPage)}
            />
          </div>
        )}
      </ComponentCard>
    </>
  );
});

export default ServiceCategoryList;
