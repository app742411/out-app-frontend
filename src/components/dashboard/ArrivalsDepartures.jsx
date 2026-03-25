import React, { useState } from "react";
import { LogIn, LogOut } from "lucide-react";

export default function ArrivalsDepartures() {
    const [activeTab, setActiveTab] = useState("arrivals");

    const data = {
        arrivals: [
            { id: 1, guest: "John Doe", property: "Sunset Villa", time: "11:00 AM", status: "Expected" },
            { id: 2, guest: "Jane Smith", property: "Ocean Suite", time: "02:00 PM", status: "Checked-in" },
            { id: 3, guest: "Ahmed Ali", property: "Desert Camp", time: "04:30 PM", status: "Expected" },
        ],
        departures: [
            { id: 1, guest: "Michael Ross", property: "Mountain Chalet", time: "10:00 AM", status: "Checked-out" },
            { id: 2, guest: "Harvey Specter", property: "City Loft", time: "11:00 AM", status: "In-room" },
            { id: 3, guest: "Donna Paulsen", property: "Penthouse", time: "12:00 PM", status: "Expected" },
        ]
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
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

            <div className="space-y-4">
                {(activeTab === "arrivals" ? data.arrivals : data.departures).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${activeTab === "arrivals" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"} dark:bg-opacity-10`}>
                                {activeTab === "arrivals" ? <LogIn size={18} /> : <LogOut size={18} />}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.guest}</p>
                                <p className="text-xs text-gray-400">{item.property}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-gray-800 dark:text-white">{item.time}</p>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                item.status.includes('Checked') ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            } dark:bg-opacity-20`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
