import React from "react";
import Chart from "react-apexcharts";

export default function OccupancyStats({ data }) {
    const options = {
        colors: ["#2d2d2d"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "radialBar",
            height: 350,
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: "70%",
                },
                dataLabels: {
                    show: true,
                    name: {
                        show: true,
                        fontSize: "16px",
                        fontWeight: 600,
                        offsetY: -10,
                        color: "#6b7280",
                    },
                    value: {
                        show: true,
                        fontSize: "30px",
                        fontWeight: 700,
                        offsetY: 10,
                        color: "#111827",
                        formatter: (val) => `${val}%`,
                    },
                },
            },
        },
        labels: ["Occupancy Rate"],
        stroke: {
            lineCap: "round",
        },
    };

    const series = [data?.stats?.occupancyRate || 0]; 
    const occupancy = data?.stats?.occupancyRate || 0;
    const available = 100 - occupancy;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Current Occupancy
            </h3>
            <div className="flex flex-col items-center">
                <Chart options={options} series={series} type="radialBar" height={300} />
                <div className="grid grid-cols-2 gap-4 w-full mt-2">
                    <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-500/5">
                        <p className="text-xs text-green-600 font-medium uppercase">Available</p>
                        <p className="text-xl font-bold text-gray-800 dark:text-white">{available}%</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-brand-50 dark:bg-brand-500/5">
                        <p className="text-xs text-brand-600 font-medium uppercase">Booked</p>
                        <p className="text-xl font-bold text-gray-800 dark:text-white">{occupancy}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
