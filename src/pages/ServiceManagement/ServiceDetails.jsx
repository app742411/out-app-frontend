import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { ArrowLeft, MapPin, Calendar, Clock, Tag, User, Mail, Smartphone } from "lucide-react";
import { getSingleServiceAdmin, updateServiceApproval } from "../../api/authApi";
import toast from "react-hot-toast";
import ReviewListComp from "../../components/Reviews/ReviewListComp";
import ServiceBookingListComp from "../../components/Bookings/ServiceBookingListComp";
import apiClient from "../../api/apiClient";
import { formatCurrency, formatDuration } from "../../utils/currency";
import { useQuery } from "@tanstack/react-query";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;

  const [approvalLoading, setApprovalLoading] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: serviceResponse, isLoading: loading, error, refetch } = useQuery({
    queryKey: ["serviceDetails", id],
    queryFn: () => getSingleServiceAdmin(id),
    enabled: !!id,
    retry: false
  });

  const service = serviceResponse?.data;

  useEffect(() => {
    if (error) {
      toast.error("Failed to load service details");
      navigate("/service-management");
    }
  }, [error, navigate]);

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const fileUrl = `/propertyDocument/${service.document}`;
      const res = await apiClient.get(fileUrl, { responseType: "blob" });
      const blob = res.data;
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = service.document || "service_document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download file:", error);
      window.open(`${baseURL}/uploads/propertyDocument/${service.document}`, "_blank");
    }
  };

  const handleApproval = async (action, reason = "") => {
    try {
      setApprovalLoading(true);
      const res = await updateServiceApproval(id, action, reason);
      if (res.success) {
        toast.success(`Service ${action === "approve" ? "approved" : "rejected"} successfully`);
        setRejectionModalOpen(false);
        setRejectionReason("");
        refetch();
      } else {
        toast.error(res.message || "Action failed");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to update service status");
    } finally {
      setApprovalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) return null;

  return (
    <>
      <PageMeta title={`Service: ${service.name} | Out Admin`} />
      <PageBreadcrumb pageTitle="Service Details" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          <ComponentCard title="Service Details">
            <div className="space-y-6">
              {/* Media Gallery */}
              {service.media?.images?.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {service.media.images.map((img, idx) => (
                    <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm transition-transform hover:scale-[1.02] duration-300">
                      <img
                        src={`${baseURL}/uploads/serviceMedia/${img}`}
                        alt={`Gallery ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Status & Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Platform Status</p>
                  <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] inline-block shadow-sm ${service.isActive
                    ? 'bg-green-500 text-white shadow-green-500/20'
                    : 'bg-orange-500 text-white shadow-orange-500/20'
                    }`}>
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Approval Status</p>
                  <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] inline-block shadow-sm ${service.approvalStatus === 'approved'
                    ? 'bg-blue-500 text-white shadow-blue-500/20'
                    : service.approvalStatus === 'rejected'
                      ? 'bg-red-500 text-white shadow-red-500/20'
                      : 'bg-yellow-500 text-yellow-950 dark:text-yellow-400 shadow-yellow-500/10'
                    }`}>
                    {service.approvalStatus || "Pending"}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Category</p>
                  <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800 inline-block shadow-sm">
                    {service.category?.name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Pricing ({service.priceType})</p>
                  <p className="text-xs font-black text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-500/10 px-3 py-1.5 rounded-xl inline-block shadow-sm">
                    {formatCurrency(service.price || 0)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">{service.name}</h2>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <MapPin size={16} className="text-brand-500" />
                    <span className="text-xs font-medium">{service.location?.city}, {service.location?.state}, {service.location?.country}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Description</h4>
                  <div className="bg-white dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-50 dark:border-gray-800 leading-relaxed text-gray-700 dark:text-gray-300 shadow-inner italic">
                    "{service.description || "No description provided."}"
                  </div>
                </div>

                {service.document && (
                  <div className="mt-8 p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2rem] border-2 border-indigo-100/50 dark:border-indigo-900/20 flex flex-col sm:flex-row items-center justify-between group transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20 shadow-sm gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Service Documentation</p>
                        <p className="text-[9px] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-[0.2em] mt-0.5">Verification PDF Attached</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <a
                        href={`${baseURL}/uploads/propertyDocument/${service.document}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl rounded-2xl text-[10px] font-black text-brand-600 hover:bg-brand-500 hover:text-white transition-all border border-brand-100 dark:border-brand-900/40 uppercase tracking-[0.15em] active:scale-95 flex items-center gap-2 cursor-pointer font-bold"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        View Document
                      </a>
                      <button
                        onClick={handleDownload}
                        className="px-5 py-3 bg-brand-500 hover:bg-brand-600 shadow-md hover:shadow-xl text-white rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.15em] active:scale-95 flex items-center gap-2 cursor-pointer border-0 font-bold"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Approval Action Panel */}
              <div className="mt-6 p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Administrative Status Actions</p>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-0.5">Approve or reject this service listing for active publication</p>
                </div>
                <div className="flex gap-2.5">
                  {(service.approvalStatus === 'pending' || !service.approvalStatus || service.approvalStatus === 'rejected') && (
                    <button
                      disabled={approvalLoading}
                      onClick={() => handleApproval("approve")}
                      className="px-5 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-[10px] font-black rounded-2xl shadow-lg shadow-green-500/20 uppercase tracking-[0.12em] transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer font-bold border-0"
                    >
                      {approvalLoading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      Approve
                    </button>
                  )}
                  {(service.approvalStatus === 'pending' || !service.approvalStatus || service.approvalStatus === 'approved') && (
                    <button
                      disabled={approvalLoading}
                      onClick={() => setRejectionModalOpen(true)}
                      className="px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-[10px] font-black rounded-2xl shadow-lg shadow-red-500/20 uppercase tracking-[0.12em] transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer font-bold border-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {service.approvalStatus === 'approved' ? 'Revoke Approval' : 'Reject'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard title="Operating Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Availability Schedule</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <div className="p-3 bg-brand-50 dark:bg-brand-500/10 text-brand-500 rounded-xl">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Working Hours</p>
                        <p className="text-sm font-black dark:text-white uppercase tracking-wider">{service.workingHours?.start} - {service.workingHours?.end}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <div className="p-3 bg-brand-50 dark:bg-brand-500/10 text-brand-500 rounded-xl">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Working Days</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {service.workingDays?.map((day, i) => (
                            <span key={i} className="text-[9px] font-black uppercase px-2 py-0.5 bg-white dark:bg-gray-800 text-brand-600 rounded-md border border-brand-100 dark:border-brand-900/30">
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Session Metrics</h4>
                  <div className="bg-white dark:bg-gray-800/40 p-6 rounded-[2rem] border border-gray-50 dark:border-gray-800 shadow-sm flex items-center justify-around">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mb-1.5">Duration</span>
                      <span className="text-2xl font-black text-gray-900 dark:text-white">{formatDuration(service.duration)}</span>
                    </div>
                    <div className="w-px h-12 bg-gray-100 dark:bg-gray-700"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-brand-500 font-black uppercase tracking-widest mb-1.5">Price Type</span>
                      <span className="text-2xl font-black text-gray-900 dark:text-white uppercase">{service.priceType || 'FLAT'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>


        {/* Sidebar Info */}
        <div className="space-y-6 lg:sticky lg:top-6 h-fit">
          <ComponentCard title="Provider Details">
            <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100 dark:border-gray-800 mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-500/20 p-1 mb-4 relative">
                <img
                  src={`${baseURL}/uploads/users/${service.provider?.profile}`}
                  alt="Provider"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => e.target.src = "/images/user/user-01.jpg"}
                />
                {service.provider?.isVerified && (
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full border-2 border-white dark:border-gray-900">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-lg dark:text-white capitalize">
                {service.provider?.name || `${service.provider?.firstName || ""} ${service.provider?.lastName || ""}`.trim() || "Unknown Provider"}
              </h3>
              <p className="text-sm text-gray-500">
                {service.provider?.isVerified ? "Verified Provider" : "Registered Provider"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={18} />
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{service.provider?.email || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="text-gray-400" size={18} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{service.provider?.phone || "Not provided"}</span>
              </div>
            </div>

            <div className="mt-8">
              <Button variant="outline" className="w-full" size="sm" onClick={() => navigate(`/vendor-details/${service.provider?._id}`)}>
                View Provider Profile
              </Button>
            </div>
          </ComponentCard>

          <ComponentCard title="Location">
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">City:</span>
                <span className="font-bold text-gray-900 dark:text-white capitalize">{service.location?.city || "N/A"}</span>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      <div className="mt-8">
        <ServiceBookingListComp serviceId={id} />
      </div>

      <div className="mt-8">
        <ReviewListComp type="service" id={id} />
      </div>

      {/* Rejection Reason Modal */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold dark:text-white">
                  {service.approvalStatus === 'approved' ? 'Revoke Approval' : 'Reject Service'}
                </h4>
                <p className="text-xs text-gray-500">
                  {service.approvalStatus === 'approved'
                    ? 'Please provide a reason for revoking approval.'
                    : 'Please provide a reason for rejection.'}
                </p>
              </div>
            </div>

            <textarea
              className="w-full h-32 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.03] p-4 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-gray-100"
              placeholder="Example: Service description is not detailed enough..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRejectionModalOpen(false)}
                className="flex-1 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer border-0 bg-transparent"
              >
                Cancel
              </button>
              <button
                disabled={!rejectionReason.trim() || approvalLoading}
                onClick={() => handleApproval("reject", rejectionReason)}
                className="flex-1 py-3 rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer border-0"
              >
                {approvalLoading ? "Processing..." : (service.approvalStatus === 'approved' ? "Revoke Approval" : "Reject Service")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceDetails;
