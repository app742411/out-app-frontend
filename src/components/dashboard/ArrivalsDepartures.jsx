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
        <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Today's Movement
                </h3>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab("arrivals")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === "arrivals" ? "bg-white dark:bg-gray-700 shadow-sm text-brand-500" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Arrivals
                    </button>
                    <button
                        onClick={() => setActiveTab("departures")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === "departures" ? "bg-white dark:bg-gray-700 shadow-sm text-brand-500" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Departures
                    </button>
                </div>
            </div>

            <div className="flex-grow space-y-4">
                {(activeTab === "arrivals" ? data.arrivals : data.departures).length > 0 ? (
                    (activeTab === "arrivals" ? data.arrivals : data.departures).map((item) => (
                        <div key={item._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${activeTab === "arrivals" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"} dark:bg-opacity-10`}>
                                    {activeTab === "arrivals" ? <LogIn size={18} /> : <LogOut size={18} />}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white capitalize">{item.user?.firstName || "Unknown"}</p>
                                    <p className="text-xs text-gray-400 truncate w-32">{item.property?.name || "N/A"}</p>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <p className="text-xs font-bold text-gray-800 dark:text-white">{activeTab === "arrivals" ? formatTime(item.checkIn) : formatTime(item.checkOut)}</p>
                                <span className={`mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                    item.bookingStatus?.includes('confirmed') ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                } dark:bg-opacity-20`}>
                                    {item.bookingStatus || "Expected"}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                        No {activeTab} for today.
                    </div>
                )}
            </div>
        </div>
    );
}
