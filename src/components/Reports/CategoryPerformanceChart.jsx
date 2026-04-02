import React from "react";
import Chart from "react-apexcharts";

export default function CategoryPerformanceChart({ data }) {
    const options = {
        colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "pie",
        },
        legend: {
            show: true,
            position: "bottom",
            fontFamily: "Outfit",
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => val.toFixed(1) + "%"
        }
    };

    const labels = data?.map(i => i.name) || ["N/A"];
    const series = data?.map(i => i.value) || [0];

    const optionsWithLabels = {
        ...options,
        labels: labels
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Bookings by Category
            </h3>
            <div className="flex justify-center">
                <Chart options={optionsWithLabels} series={series} type="pie" width="100%" height={320} />
            </div>
        </div>
    );
}
