import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Pagination from "../common/Pagination";
import {
  Search,
  MapPin,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Tag
} from "lucide-react";
import { getAllServicesAdmin, getPendingServices, updateServiceApproval } from "../../api/authApi";
import toast from "react-hot-toast";

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

  const fetchServices = async (page = 1, isBackgroundPoll = false) => {
    try {
      if (!isBackgroundPoll) setLoading(true);
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
      if (!isBackgroundPoll) toast.error("Failed to load services");
    } finally {
      if (!isBackgroundPoll) setLoading(false);
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

  // Real-time data refresh on focus or tab visibility to avoid continuous background polling
  useEffect(() => {
    const handleRefresh = () => {
      if (document.visibilityState === "visible") {
        fetchServices(currentPage, true);
      }
    };

    window.addEventListener("focus", handleRefresh);
    document.addEventListener("visibilitychange", handleRefresh);

    return () => {
      window.removeEventListener("focus", handleRefresh);
      document.removeEventListener("visibilitychange", handleRefresh);
    };
  }, [currentPage, search, activeTab]);

  const getImageUrl = (service) => {
    if (service.media && service.media.images && service.media.images.length > 0) {
      const cleanBaseURL = baseURL ? baseURL.replace(/\/$/, "") : "";
      return `${cleanBaseURL}/uploads/serviceIcon/${service.media.images[0]}`;
    }
    return "/images/home/properties2.webp";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Service Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and oversee all listed services efficiently.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search services, vendors..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="h-[420px] rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.length > 0 ? (
            services.map((service, index) => (
              <div
                key={service._id || index}
                className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 hover:translate-y-[-6px]"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(service)}
                    alt={service.name}
                    onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                    onError={(e) => { e.target.src = "/images/home/properties2.webp"; }}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-0 bg-gray-100 dark:bg-gray-800"
                  />
                  <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg ${service.isActive
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                      }`}>
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <p className="bg-white/95 dark:bg-black/90 px-3 py-1 rounded-lg font-bold text-brand-600 dark:text-brand-400 shadow-sm">
                      {service.priceType && <span className="text-[9px] uppercase tracking-wider text-gray-500 mr-1">{service.priceType}</span>}
                      SAR {service.price}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg group-hover:text-brand-500 transition-colors">
                      {service.name || "Unnamed Service"}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {service.location?.city || "Unknown City"}, {service.location?.state || ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 py-3 border-y border-gray-50 dark:border-gray-800/50">
                    <div className="w-8 h-8 rounded-full bg-brand-50/50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xs uppercase">
                      {service.user?.firstName?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase text-gray-400 font-bold tracking-tighter">Vendor</p>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate capitalize">
                        {service.user?.firstName} {service.user?.lastName}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="truncate">{service.category?.name || "No Category"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="truncate">{service.duration || "0"} min</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {activeTab === "active" ? (
                    <div className="grid grid-cols-1 pt-2">
                      <button
                        onClick={() => navigate(`/service-details/${service._id}`)}
                        className="flex items-center justify-center gap-2 p-2 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:border-brand-500/30 transition-all group/btn w-full"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-400 group-hover/btn:text-brand-500 transition-colors" />
                        <span className="text-[10px] font-bold uppercase text-gray-500 group-hover/btn:text-brand-500 outline-none">View Details</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <button
                        onClick={() => navigate(`/service-details/${service._id}`)}
                        className="flex flex-col items-center justify-center p-2 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:border-brand-500/30 transition-all group/btn outline-none"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-400 group-hover/btn:text-brand-500 transition-colors" />
                        <span className="text-[9px] mt-1 font-bold uppercase text-gray-400 group-hover/btn:text-brand-500">View</span>
                      </button>
                      <button
                        disabled={approvalLoading === service._id}
                        onClick={() => handleApproval(service._id, "approve")}
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-all shadow-md shadow-green-500/20 disabled:opacity-50 outline-none"
                      >
                        {approvalLoading === service._id ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle className="w-4 h-4" />}
                        <span className="text-[9px] mt-1 font-bold uppercase text-white">Approve</span>
                      </button>
                      <button
                        disabled={approvalLoading === service._id}
                        onClick={() => setRejectionModal({ show: true, serviceId: service._id, reason: "" })}
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-md shadow-red-500/20 disabled:opacity-50 outline-none"
                      >
                        <XCircle className="w-4 h-4" />
                        <span className="text-[9px] mt-1 font-bold uppercase text-white">Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800/20 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400">No services found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-6 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              setCurrentPage(newPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
    </div>
  );
};

export default ServiceList;
