import React, { useState } from "react";
import { LogIn, LogOut } from "lucide-react";

export default function ArrivalsDepartures({ data: dashboardData }) {
    const [activeTab, setActiveTab] = useState("arrivals");
    const [data, setData] = useState({ arrivals: [], departures: [] });

    React.useEffect(() => {
        if (dashboardData?.todayMovement) {
            setData({
                arrivals: dashboardData.todayMovement.arrivals || [],
                departures: dashboardData.todayMovement.departures || [],
            });
        }
    }, [dashboardData]);

    const formatTime = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        } catch(e) {
            return "N/A";
        }
    };

    return (
        <div className="h-full rounded-3xl border border-gray-250 bg-white/70 p-6 dark:border-gray-800/80 dark:bg-gray-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.012)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_15px_40px_rgba(70,95,255,0.03)] sm:p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-gray-800 dark:text-white/90">
                    Today's Movement
                </h3>
                <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-0.5 rounded-xl border border-gray-200/30">
                    <button
                        onClick={() => setActiveTab("arrivals")}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 ${activeTab === "arrivals" ? "bg-white dark:bg-gray-700 shadow-xs text-brand-600" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        Arrivals
                    </button>
                    <button
                        onClick={() => setActiveTab("departures")}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 ${activeTab === "departures" ? "bg-white dark:bg-gray-700 shadow-xs text-brand-600" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        Departures
                    </button>
                </div>
            </div>

            <div className="flex-grow space-y-3.5">
                {(activeTab === "arrivals" ? data.arrivals : data.departures).length > 0 ? (
                    (activeTab === "arrivals" ? data.arrivals : data.departures).map((item) => (
                        <div key={item._id} className="flex items-center justify-between p-3 rounded-2xl border border-gray-100/60 dark:border-gray-800/40 hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-all duration-150">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${activeTab === "arrivals" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-orange-500/10 text-orange-600 dark:text-orange-400"}`}>
                                    {activeTab === "arrivals" ? <LogIn size={16} /> : <LogOut size={16} />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white capitalize truncate">{item.user?.firstName || "Unknown"}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[120px]">{item.property?.name || "N/A"}</p>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end shrink-0">
                                <p className="text-xs font-extrabold text-gray-800 dark:text-white">{activeTab === "arrivals" ? formatTime(item.checkIn) : formatTime(item.checkOut)}</p>
                                <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    item.bookingStatus?.includes('confirmed') 
                                        ? "bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/15 dark:text-green-400" 
                                        : "bg-gray-100 text-gray-500 border-gray-200/50 dark:bg-gray-800/30 dark:border-gray-700/30"
                                }`}>
                                    {item.bookingStatus || "Expected"}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm font-medium">
                        No {activeTab} scheduled for today.
                    </div>
                )}
            </div>
        </div>
    );
}
