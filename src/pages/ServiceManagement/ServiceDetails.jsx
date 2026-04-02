import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { ArrowLeft, MapPin, Calendar, Clock, Tag, User, Mail, Smartphone } from "lucide-react";
import { getSingleServiceAdmin } from "../../api/authApi";
import toast from "react-hot-toast";
import ReviewListComp from "../../components/Reviews/ReviewListComp";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await getSingleServiceAdmin(id);
        setService(res.data);
      } catch (error) {
        toast.error("Failed to load service details");
        navigate("/service-management");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id, navigate]);

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
          <ComponentCard title="General Information">
            <div className="space-y-6">
              {/* Media Gallery */}
              {service.media?.images?.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {service.media.images.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                      <img
                        src={`${baseURL}/uploads/serviceIcon/${img}`}
                        alt={`Gallery ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">{service.name}</h2>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Tag size={18} />
                    <span className="text-sm">{service.category?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <MapPin size={18} />
                    <span className="text-sm">{service.location?.city}, {service.location?.state}, {service.location?.country}</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">
                    "{service.description}"
                  </p>
                </div>

                {service.document && (
                  <div className="mt-8 p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2rem] border-2 border-indigo-100/50 dark:border-indigo-900/20 flex items-center justify-between group transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Service Documentation</p>
                        <p className="text-[9px] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-[0.2em] mt-0.5">Verification PDF Attached</p>
                      </div>
                    </div>
                    <a
                      href={`${baseURL}/uploads/serviceDocument/${service.document}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md rounded-2xl text-[10px] font-black text-brand-600 hover:bg-brand-500 hover:text-white transition-all border border-brand-100 dark:border-brand-900/40 uppercase tracking-widest active:scale-95"
                    >
                      View Document
                    </a>
                  </div>
                )}
              </div>
            </div>
          </ComponentCard>

          <ComponentCard title="Operating Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-50 dark:bg-brand-500/10 text-brand-500 rounded-lg">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Working Hours</p>
                    <p className="text-sm font-semibold dark:text-white">{service.workingHours?.start} - {service.workingHours?.end}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-50 dark:bg-brand-500/10 text-brand-500 rounded-lg">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Working Days</p>
                    <p className="text-sm font-semibold dark:text-white">{service.workingDays?.join(", ")}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-l dark:border-gray-800 pl-8 hidden md:block">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Pricing</p>
                    <span className="text-[10px] bg-brand-50 text-brand-600 px-2 py-0.5 rounded font-bold uppercase">{service.priceType || 'FLAT'}</span>
                  </div>
                  <p className="text-2xl font-bold text-brand-500">₹{service.price}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Session Duration</p>
                  <p className="text-sm font-bold dark:text-white flex items-center gap-1.5 mt-0.5">
                    <Clock size={14} className="text-brand-500" />
                    {service.duration || 0} Minutes
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-2">Listing Status</p>
                  <span className={`mt-1 inline-block px-3 py-1 text-xs font-semibold rounded-full ${service.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {service.isActive ? "Active on Platform" : "Hidden from Platform"}
                  </span>
                </div>
              </div>
            </div>
          </ComponentCard>
          
          <div className="mt-8">
            <ReviewListComp type="service" id={id} />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <ComponentCard title="Vendor Details">
            <div className="flex flex-col items-center text-center pb-4 border-b dark:border-gray-800 mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-500/20 p-1 mb-4">
                <img
                  src={`${baseURL}/uploads/users/${service.user?.profile}`}
                  alt="Vendor"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => e.target.src = "/images/user/user-01.jpg"}
                />
              </div>
              <h3 className="font-bold text-lg dark:text-white capitalize">{service.user?.firstName} {service.user?.lastName}</h3>
              <p className="text-sm text-gray-500">Registered Vendor</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={18} />
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{service.user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="text-gray-400" size={18} />
                <span className="text-sm text-gray-600 dark:text-gray-400">Not provided</span>
              </div>
            </div>

            <div className="mt-8">
              <Button variant="outline" className="w-full" size="sm" onClick={() => navigate(`/user-details/${service.user?._id}`)}>
                View Vendor Profile
              </Button>
            </div>
          </ComponentCard>
        </div>
      </div>
    </>
  );
};

export default ServiceDetails;
