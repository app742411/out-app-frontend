import React from "react";
import Chart from "react-apexcharts";

export default function CategoryPerformanceChart({ data }) {
    const options = {
        colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b"],
        chart: {
            fontFamily: "Instrument Sans, sans-serif",
            type: "pie",
        },
        legend: {
            show: true,
            position: "bottom",
            fontFamily: "Instrument Sans, sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            labels: {
                colors: "#9ca3af"
            },
            markers: {
                width: 8,
                height: 8,
                radius: 12,
            },
            itemMargin: {
                horizontal: 10,
                vertical: 5
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => val.toFixed(1) + "%",
            style: {
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "Instrument Sans, sans-serif"
            }
        },
        stroke: {
            width: 2,
            colors: ["transparent"]
        },
        tooltip: {
            
        }
    };

    const labels = data?.map(i => i.name) || ["N/A"];
    const series = data?.map(i => i.value) || [0];

    const optionsWithLabels = {
        ...options,
        labels: labels
    };

    return (
        <div className="rounded-3xl border border-gray-250 bg-white/70 p-6 dark:border-gray-800/80 dark:bg-gray-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.012)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_15px_40px_rgba(70,95,255,0.03)] flex flex-col justify-between h-full">
            <h3 className="mb-4 text-base font-bold text-gray-800 dark:text-white/90">
                Bookings by Category
            </h3>
            <div className="flex justify-center items-center flex-grow py-3">
                <Chart options={optionsWithLabels} series={series} type="pie" width="100%" height={260} />
            </div>
        </div>
    );
}
