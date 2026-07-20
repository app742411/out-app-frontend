import React from "react";
import Chart from "react-apexcharts";

export default function OccupancyStats({ data }) {
    const occupancy = data?.stats?.occupancyRate || 0;
    const available = 100 - occupancy;

    const options = {
        colors: ["#4f46e5"],
        chart: {
            fontFamily: "Instrument Sans, sans-serif",
            type: "radialBar",
            height: 240,
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                hollow: {
                    size: "72%",
                    background: "transparent",
                },
                track: {
                    background: "rgba(226, 232, 240, 0.4)",
                    strokeWidth: "97%",
                },
                dataLabels: {
                    show: true,
                    name: {
                        show: true,
                        fontSize: "12px",
                        fontWeight: 600,
                        offsetY: -8,
                        color: "#9ca3af",
                        textTransform: "uppercase",
                    },
                    value: {
                        show: true,
                        fontSize: "26px",
                        fontWeight: 800,
                        offsetY: 4,
                        color: "#111827",
                        formatter: (val) => `${val}%`,
                    },
                },
            },
        },
        stroke: {
            lineCap: "round",
        },
    };

    const series = [occupancy]; 

    return (
        <div className="h-full rounded-3xl border border-gray-250 bg-white/70 p-6 dark:border-gray-800/80 dark:bg-gray-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.012)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_15px_40px_rgba(70,95,255,0.03)] sm:p-6 flex flex-col justify-between">
            <div>
                <h3 className="mb-2 text-base font-bold text-gray-800 dark:text-white/90">
                    Current Occupancy
                </h3>
            </div>
            <div className="flex flex-col items-center flex-grow justify-center py-2">
                <Chart options={options} series={series} type="radialBar" height={220} />
            </div>
            <div className="grid grid-cols-2 gap-3 w-full mt-1">
                <div className="text-center p-3 rounded-2xl bg-green-500/8 border border-green-500/12 dark:bg-green-500/5">
                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Available</p>
                    <p className="text-lg font-extrabold text-gray-850 dark:text-white mt-0.5">{available}%</p>
                </div>
                <div className="text-center p-3 rounded-2xl bg-brand-500/8 border border-brand-500/12 dark:bg-brand-500/5">
                    <p className="text-[10px] text-brand-600 font-bold uppercase tracking-wider">Booked</p>
                    <p className="text-lg font-extrabold text-gray-850 dark:text-white mt-0.5">{occupancy}%</p>
                </div>
            </div>
        </div>
    );
}
