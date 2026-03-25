import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Pagination from "../common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Eye, Search, Filter } from "lucide-react";
import { getAllServicesAdmin, getPendingServices, updateServiceApproval } from "../../api/authApi";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("active"); // "active" or "pending"
  const [rejectionModal, setRejectionModal] = useState({ show: false, serviceId: null, reason: "" });
  const [approvalLoading, setApprovalLoading] = useState(null);
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API_URL;

  const fetchServices = async (page = 1) => {
    try {
      setLoading(true);
      if (activeTab === "pending") {
        const res = await getPendingServices();
        setServices(res.data || []);
        setTotalPages(1); // Pending list might not be paginated same way
        setCurrentPage(1);
      } else {
        const res = await getAllServicesAdmin({
          page,
          limit: ITEMS_PER_PAGE,
          search,
        });
        setServices(res.data || []);
        setTotalPages(res.totalPages || 1);
        setCurrentPage(res.page || page);
      }
    } catch (error) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, action, reason = "") => {
    try {
      setApprovalLoading(id);
      const res = await updateServiceApproval(id, action, reason);
      if (res.success) {
        toast.success(`Service ${action === "approve" ? "approved" : "rejected"} successfully`);
        setRejectionModal({ show: false, serviceId: null, reason: "" });
        fetchServices(currentPage);
      } else {
        toast.error(res.message || "Action failed");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to perform action");
    } finally {
      setApprovalLoading(null);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchServices(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage, activeTab]);

  return (
    <ComponentCard title="Service Management">
      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search services, vendors or categories..."
            className="w-full pl-11 pr-4 py-2.5 text-sm text-gray-800 dark:text-white/90 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl focus:border-brand-500 transition-all focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === "active"
              ? "border-brand-500 text-brand-500"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
          >
            Active Services
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === "pending"
              ? "border-brand-500 text-brand-500"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
          >
            Pending Approval
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center p-12">
              <div className="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-500">Fetching services...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">S.No.</TableCell>
                  <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Service</TableCell>
                  <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</TableCell>
                  <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vendor</TableCell>
                  <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</TableCell>
                  <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</TableCell>
                  <TableCell isHeader className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">{activeTab === "active" ? "Actions" : "Approval"}</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {services.length > 0 ? (
                  services.map((service, index) => (
                    <TableRow key={service._id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                      <TableCell className="px-5 py-4">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </TableCell>

                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                            <img
                              src={`${baseURL}/uploads/serviceIcon/${service.media?.images?.[0]}`}
                              alt={service.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/images/home/properties2.webp";
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-white capitalize line-clamp-1">{service.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{service.location?.city}, {service.location?.state}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4">
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 rounded-md">
                          {service.category?.name}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{service.user?.firstName} {service.user?.lastName}</span>
                          <span className="text-xs text-gray-500">{service.user?.email}</span>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                        ₹{service.price}
                      </TableCell>

                      <TableCell className="px-5 py-4 text-center">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${service.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-right">
                        {activeTab === "active" ? (
                          <button
                            onClick={() => navigate(`/service-details/${service._id}`)}
                            className="p-2 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-500/10 transition-all"
                            title="View Details"
                          >
                            <Eye size={20} />
                          </button>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => navigate(`/service-details/${service._id}`)}
                              className="p-2 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-500/10 transition-all"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              disabled={approvalLoading === service._id}
                              onClick={() => handleApproval(service._id, "approve")}
                              className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md shadow-green-500/20 disabled:opacity-50"
                              title="Approve"
                            >
                              {approvalLoading === service._id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle size={18} />}
                            </button>
                            <button
                              disabled={approvalLoading === service._id}
                              onClick={() => setRejectionModal({ show: true, serviceId: service._id, reason: "" })}
                              className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md shadow-red-500/20 disabled:opacity-50"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500 bg-gray-50/30 dark:bg-white/5">
                      No services found matching your criteria.
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

      {/* Rejection Reason Modal */}
      {rejectionModal.show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800 scale-in-center overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold dark:text-white">Reject Service</h4>
                <p className="text-xs text-gray-500">Please provide a reason for rejecting this service.</p>
              </div>
            </div>

            <textarea
              className="w-full h-32 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.03] p-4 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-gray-100 font-medium"
              placeholder="e.g., Description is too short or missing images..."
              value={rejectionModal.reason}
              onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRejectionModal({ show: false, serviceId: null, reason: "" })}
                className="flex-1 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!rejectionModal.reason.trim() || approvalLoading}
                onClick={() => handleApproval(rejectionModal.serviceId, "reject", rejectionModal.reason)}
                className="flex-1 py-3 rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {approvalLoading ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ComponentCard>
  );
};

export default ServiceList;
