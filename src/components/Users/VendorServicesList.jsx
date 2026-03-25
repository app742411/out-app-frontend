import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Eye } from "lucide-react";
import { getServicesByUserAdmin } from "../../api/authApi";
import toast from "react-hot-toast";

const VendorServicesList = ({ userId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchServices = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await getServicesByUserAdmin(userId);
        setServices(res.data || []);
      } catch (error) {
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [userId]);

  return (
    <ComponentCard title="Professional Services">
      <div className="overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-xs text-gray-500">Syncing services...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-white/2">
                   <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service</TableCell>
                   <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</TableCell>
                   <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Price</TableCell>
                   <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</TableCell>
                   <TableCell isHeader className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {services.length > 0 ? (
                  services.map((service) => (
                    <TableRow key={service._id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0">
                      <TableCell className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
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
                            <p className="text-sm font-bold text-gray-900 dark:text-white capitalize truncate max-w-[150px]">{service.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">SKU: {service._id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 border border-brand-100 dark:border-brand-500/20">
                          {service.category?.name}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-3 text-center">
                        <span className="text-sm font-black text-gray-900 dark:text-white">₹{service.price?.toLocaleString()}</span>
                      </TableCell>

                      <TableCell className="px-5 py-3 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${service.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                          {service.isActive ? "Online" : "Offline"}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-3 text-right">
                        <button
                          onClick={() => navigate(`/service-details/${service._id}`)}
                          className="p-2 rounded-xl text-gray-400 hover:text-brand-500 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                        >
                          <Eye size={16} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-400 text-xs italic">
                      No active service offerings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </ComponentCard>
  );
};

export default VendorServicesList;
