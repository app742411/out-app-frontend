import React from "react";
import Chart from "react-apexcharts";

export default function RevenueLineChart({ data }) {
    const options = {
        colors: ["#4f46e5"],
        chart: {
            fontFamily: "Instrument Sans, sans-serif",
            type: "area",
            height: 350,
            toolbar: {
                show: false,
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.02,
                stops: [0, 90, 100]
            }
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 3.5,
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: {
                    colors: "#9ca3af",
                    fontSize: "11px",
                    fontWeight: 500,
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#9ca3af",
                    fontSize: "11px",
                    fontWeight: 500,
                },
                formatter: (val) => `${val.toLocaleString()}`
            }
        },
        grid: {
            borderColor: "rgba(226, 232, 240, 0.5)",
            strokeDashArray: 5,
            yaxis: {
                lines: { show: true }
            }
        },
        tooltip: {
            
            y: {
                formatter: (val) => `SAR ${val.toLocaleString()}`
            }
        },
        markers: {
            size: 0,
            hover: {
                size: 5
            }
        }
    };

    const series = [
        {
            name: "Revenue",
            data: data?.revenueGraph?.map(item => item.revenue !== undefined ? item.revenue : item.total) || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
    ];

    const monthsLong = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (data?.revenueGraph) {
        options.xaxis.categories = data.revenueGraph.map(item => 
            item.month ? item.month : (monthsLong[item._id - 1] || "N/A")
        );
    }

    return (
        <div className="rounded-3xl border border-gray-250 bg-white/70 p-6 dark:border-gray-800/80 dark:bg-gray-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.012)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_15px_40px_rgba(70,95,255,0.03)] sm:p-6">
            <h3 className="mb-4 text-base font-bold text-gray-800 dark:text-white/90">
                Revenue Growth
            </h3>
            <div className="max-w-full overflow-hidden">
                <Chart options={options} series={series} type="area" height={310} />
            </div>
        </div>
    );
}
