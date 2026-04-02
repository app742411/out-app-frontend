import React from "react";
import Chart from "react-apexcharts";

export default function RevenueLineChart({ data }) {
    const options = {
        colors: ["#2d2d2d"],
        chart: {
            fontFamily: "Outfit, sans-serif",
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
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 90, 100]
            }
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            title: { text: "SAR" },
        },
        grid: {
            borderColor: "#e2e8f0",
            strokeDashArray: 4,
            yaxis: {
                lines: { show: true }
            }
        },
        tooltip: {
            y: {
                formatter: (val) => `SAR ${val}`
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
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Revenue Growth
            </h3>
            <div className="max-w-full overflow-hidden">
                <Chart options={options} series={series} type="area" height={310} />
            </div>
        </div>
    );
}
