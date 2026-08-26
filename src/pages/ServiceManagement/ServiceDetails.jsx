import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Tag,
  User,
  Mail,
  Smartphone,
  Star,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Download,
  Eye,
  Timer,
  CalendarCheck,
  AlertTriangle,
  Layers,
  Wrench,
  Globe
} from "lucide-react";
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
  const baseURL = import.meta.env.VITE_API_URL || "";
  const baseImgUrl = baseURL.replace(/\/$/, "");

  const [approvalLoading, setApprovalLoading] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

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

  useEffect(() => {
    if (service?.schedule && service.schedule.length > 0 && !selectedDay) {
      const firstEnabled = service.schedule.find(s => s.enabled) || service.schedule[0];
      setSelectedDay(firstEnabled?.day || service.schedule[0].day);
    }
  }, [service]);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!service?.document) return;
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
    } catch (err) {
      console.error("Failed to download file:", err);
      window.open(`${baseImgUrl}/uploads/propertyDocument/${service.document}`, "_blank");
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
    } catch (err) {
      toast.error(err?.message || "Failed to update service status");
    } finally {
      setApprovalLoading(false);
    }
  };

  const formatTime12h = (time24) => {
    if (!time24) return "N/A";
    const parts = time24.split(":");
    if (parts.length < 2) return time24;
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    if (isNaN(hours)) return time24;
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-gray-500 font-medium">Loading service details...</p>
      </div>
    );
  }

  if (!service) return null;

  // Compute total weekly slots count
  const totalSlotsCount = service.schedule?.reduce((acc, curr) => {
    return curr.enabled ? acc + (curr.slots?.length || 0) : acc;
  }, 0) || 0;

  const coordinates = service.location?.coordinates?.coordinates || service.location?.coordinates;
  const hasCoordinates = Array.isArray(coordinates) && coordinates.length === 2;
  const [longitude, latitude] = hasCoordinates ? coordinates : [null, null];

  const currentScheduleDay = service.schedule?.find(s => s.day === selectedDay);

  return (
    <>
      <PageMeta title={`Service: ${service.name} | Out Admin`} />
      <PageBreadcrumb pageTitle="Service Details" />

      <div className="space-y-6 w-full pb-10">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition mt-0.5"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                    {service.name}
                  </h1>
                  {service.category?.name && (
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700">
                      {service.category.name}
                    </span>
                  )}
                  {service.avgRating > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200/50">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {service.avgRating} ({service.totalReviews || 0} reviews)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 font-mono flex-wrap">
                  <span className="flex items-center gap-1">
                    ID: {service._id}
                    <button
                      onClick={() => handleCopy(service._id, "serviceId")}
                      className="hover:text-brand-500 transition"
                      title="Copy Service ID"
                    >
                      {copiedKey === "serviceId" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    {service.location?.city}, {service.location?.state}, {service.location?.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Right Action & Badges */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                service.isActive
                  ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200/50"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200/50"
              }`}>
                ● {service.isActive ? "Active" : "Inactive"}
              </span>

              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                service.approvalStatus === "approved"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50"
                  : service.approvalStatus === "rejected"
                  ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200/50"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50"
              }`}>
                {service.approvalStatus || "Pending Approval"}
              </span>

              <Link to={`/service-calendar/${id}`}>
                <Button className="bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
                  <CalendarCheck className="w-4 h-4" />
                  Calendar
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4-Grid Metric Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Service Fee</span>
              <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500">
                <Tag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {formatCurrency(service.price || 0)}
            </p>
            <p className="mt-1 text-xs text-gray-500 capitalize">
              Rate: {service.priceType ? service.priceType.replace(/_/g, " ") : "Per Person"}
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Session Duration</span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500">
                <Timer className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {formatDuration(service.duration)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {service.duration} Minutes per session
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Rating & Reviews</span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500">
                <Star className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-1.5">
              {service.avgRating || 0} <span className="text-sm font-normal text-gray-400">/ 5.0</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {service.totalReviews || 0} Customer {service.totalReviews === 1 ? "Review" : "Reviews"}
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Weekly Schedule</span>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-500">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {totalSlotsCount} <span className="text-sm font-normal text-gray-400">Slots</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Across {service.schedule?.filter(s => s.enabled).length || 0} active operating days
            </p>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Details, Gallery, Schedule) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Service Overview Card */}
            <ComponentCard title="Service Overview & Media">
              <div className="space-y-6">
                {/* Media Gallery */}
                {service.media?.images?.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                      Gallery Images ({service.media.images.length})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {service.media.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 shadow-sm transition-transform hover:scale-[1.02] duration-300"
                        >
                          <img
                            src={`${baseImgUrl}/uploads/serviceMedia/${img}`}
                            alt={`Service Media ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.parentElement.innerHTML =
                                '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs p-2 text-center">Image Not Available</div>';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Description
                  </h4>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {service.description || "No description provided for this service."}
                  </div>
                </div>

                {/* Verification Document */}
                {service.document && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Service Verification Document
                    </h4>
                    <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-md">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {service.document}
                          </p>
                          <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">
                            Verification Document Attached
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`${baseImgUrl}/uploads/propertyDocument/${service.document}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-brand-500 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </a>
                        <button
                          onClick={handleDownload}
                          className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Approval Control Panel */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      Administrative Approval Actions
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Current status: <strong className="uppercase text-brand-500">{service.approvalStatus || "Pending"}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(service.approvalStatus === "pending" || !service.approvalStatus || service.approvalStatus === "rejected") && (
                      <button
                        disabled={approvalLoading}
                        onClick={() => handleApproval("approve")}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                      >
                        {approvalLoading ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Approve Service
                      </button>
                    )}
                    {(service.approvalStatus === "pending" || !service.approvalStatus || service.approvalStatus === "approved") && (
                      <button
                        disabled={approvalLoading}
                        onClick={() => setRejectionModalOpen(true)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        {service.approvalStatus === "approved" ? "Revoke Approval" : "Reject Service"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </ComponentCard>

            {/* Operating Availability Schedule & Slots */}
            <ComponentCard title="Weekly Availability & Time Slots">
              {service.schedule && service.schedule.length > 0 ? (
                <div className="space-y-5">
                  {/* Day Selection Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {service.schedule.map((sch) => {
                      const isSelected = selectedDay === sch.day;
                      return (
                        <button
                          key={sch._id || sch.day}
                          onClick={() => setSelectedDay(sch.day)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                            isSelected
                              ? "bg-brand-500 text-white shadow-sm"
                              : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-800"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${sch.enabled ? (isSelected ? "bg-white" : "bg-green-500") : "bg-gray-300"}`} />
                          <span>{sch.day}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? "bg-white/20 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
                            {sch.enabled ? `${sch.slots?.length || 0}` : "Off"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Day Slots List */}
                  {currentScheduleDay ? (
                    <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-gray-900 dark:text-white">
                            {currentScheduleDay.day} Schedule
                          </h4>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            currentScheduleDay.enabled
                              ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                              : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                          }`}>
                            {currentScheduleDay.enabled ? "Operating" : "Closed / Day Off"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          {currentScheduleDay.slots?.length || 0} Slots Available
                        </span>
                      </div>

                      {currentScheduleDay.enabled && currentScheduleDay.slots?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {currentScheduleDay.slots.map((slot, idx) => (
                            <div
                              key={slot._id || idx}
                              className="p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-xs flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-500">
                                  <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                                    {formatTime12h(slot.start)} - {formatTime12h(slot.end)}
                                  </p>
                                  <p className="text-[10px] text-gray-400 font-mono">
                                    Slot #{idx + 1}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded-md">
                                Active
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-gray-400 text-xs italic">
                          No active operating slots scheduled for {currentScheduleDay.day}.
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 text-xs italic">
                  No availability schedule provided.
                </div>
              )}
            </ComponentCard>
          </div>

          {/* Right Column (Provider, Location, Metadata) */}
          <div className="space-y-6">
            {/* Provider Details Card */}
            <ComponentCard title="Service Provider">
              <div className="flex flex-col items-center text-center pb-5 border-b border-gray-100 dark:border-gray-800">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-500/20 mb-3 bg-brand-50 dark:bg-brand-950/40 relative shadow-sm flex items-center justify-center">
                  {service.provider?.profile ? (
                    <img
                      src={`${baseImgUrl}/uploads/users/${service.provider.profile}`}
                      alt="Provider Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-2xl font-black text-brand-500 uppercase">
                      {service.provider?.name?.charAt(0) || "P"}
                    </span>
                  )}
                  {service.provider?.isVerified && (
                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full border-2 border-white dark:border-gray-900" title="Verified Provider">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white capitalize">
                  {service.provider?.name || "Unknown Provider"}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  {service.provider?.isVerified ? "Verified Provider" : "Registered Provider"}
                </p>
              </div>

              <div className="space-y-3.5 pt-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-1.5 font-medium">
                    <Smartphone className="w-3.5 h-3.5" /> Phone
                  </span>
                  {service.provider?.phone ? (
                    <a
                      href={`tel:${service.provider.phone}`}
                      className="font-semibold text-gray-900 dark:text-white hover:text-brand-500 transition"
                    >
                      {service.provider.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-1.5 font-medium">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </span>
                  <a
                    href={`mailto:${service.provider?.email}`}
                    className="font-semibold text-gray-900 dark:text-white hover:text-brand-500 transition truncate max-w-[180px]"
                  >
                    {service.provider?.email || "N/A"}
                  </a>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                    Provider ID
                  </span>
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg font-mono text-[11px] text-gray-600 dark:text-gray-300">
                    <span className="truncate mr-2">{service.provider?._id || "N/A"}</span>
                    <button
                      onClick={() => handleCopy(service.provider?._id, "providerId")}
                      className="text-gray-400 hover:text-brand-500"
                      title="Copy Provider ID"
                    >
                      {copiedKey === "providerId" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {service.provider?._id && (
                  <div className="pt-3">
                    <Button
                      variant="outline"
                      className="w-full py-2.5 text-xs font-semibold"
                      onClick={() => navigate(`/vendor-details/${service.provider._id}`)}
                    >
                      View Provider Profile
                    </Button>
                  </div>
                )}
              </div>
            </ComponentCard>

            {/* Location & GPS Map */}
            <ComponentCard title="Service Location">
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>City:</span>
                  <span className="font-bold text-gray-900 dark:text-white capitalize">
                    {service.location?.city || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>State:</span>
                  <span className="font-bold text-gray-900 dark:text-white capitalize">
                    {service.location?.state || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Country:</span>
                  <span className="font-bold text-gray-900 dark:text-white capitalize">
                    {service.location?.country || "N/A"}
                  </span>
                </div>

                {hasCoordinates && (
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-gray-400 uppercase font-semibold text-[10px] tracking-wider block mb-1.5">
                      GPS Coordinates
                    </span>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl font-mono text-[11px]">
                      <span>[{latitude?.toFixed(4)}, {longitude?.toFixed(4)}]</span>
                      <a
                        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-500 hover:underline font-sans font-bold text-xs"
                      >
                        Google Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </ComponentCard>

            {/* System Metadata & Dates */}
            <ComponentCard title="System Metadata">
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Created At:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {service.createdAt ? new Date(service.createdAt).toLocaleString() : "N/A"}
                  </span>
                </div>

                {service.approvedAt && (
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Approved At:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(service.approvedAt).toLocaleString()}
                    </span>
                  </div>
                )}

                {service.cancellationPolicy?._id && (
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Policy ID:</span>
                    <span className="font-mono text-[11px] text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
                      {service.cancellationPolicy._id}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-gray-500">
                  <span>Category ID:</span>
                  <span className="font-mono text-[11px] text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
                    {service.category?._id || "N/A"}
                  </span>
                </div>
              </div>
            </ComponentCard>
          </div>
        </div>

        {/* Bookings associated with this service */}
        <div className="mt-8">
          <ServiceBookingListComp serviceId={id} />
        </div>

        {/* Reviews associated with this service */}
        <div className="mt-8">
          <ReviewListComp type="service" id={id} />
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold dark:text-white">
                  {service.approvalStatus === "approved" ? "Revoke Approval" : "Reject Service"}
                </h4>
                <p className="text-xs text-gray-500">
                  {service.approvalStatus === "approved"
                    ? "Please provide a reason for revoking approval."
                    : "Please provide a reason for rejection."}
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
                {approvalLoading ? "Processing..." : (service.approvalStatus === "approved" ? "Revoke Approval" : "Reject Service")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceDetails;
