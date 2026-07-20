import React from "react";
import Chart from "react-apexcharts";

export default function PropertyBarChart({ data }) {
    const categories = data?.topProperties?.map(p => p.name) || ['N/A'];
    const counts = data?.topProperties?.map(p => p.totalBookings) || [0];

    const options = {
        colors: ["#4f46e5", "#3b82f6", "#10b981", "#f59e0b", "#f43f5e"],
        chart: {
            fontFamily: "Instrument Sans, sans-serif",
            type: 'bar',
            height: 350,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                horizontal: false,
                columnWidth: '28%',
                distributed: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false
        },
        xaxis: {
            categories: categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: {
                    colors: "#9ca3af",
                    fontSize: "11px",
                    fontWeight: 600,
                }
            }
        },
        yaxis: {
            tickAmount: 4,
            labels: {
                style: {
                    colors: "#9ca3af",
                    fontSize: "11px",
                    fontWeight: 500,
                },
                formatter: (val) => Math.round(val)
            }
        },
        grid: {
            borderColor: "rgba(226, 232, 240, 0.4)",
            strokeDashArray: 5,
            yaxis: {
                lines: { show: true }
            },
            xaxis: {
                lines: { show: false }
            }
        },
        tooltip: {
            
            y: {
                formatter: (val) => `${val} Bookings`
            }
        }
    };

    const series = [{
        name: 'Bookings',
        data: counts
    }];

    return (
        <div className="rounded-3xl border border-gray-250 bg-white/70 p-6 dark:border-gray-800/80 dark:bg-gray-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.012)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_15px_40px_rgba(70,95,255,0.03)] sm:p-6">
            <h3 className="mb-4 text-base font-bold text-gray-800 dark:text-white/90">
                Top Performing Properties
            </h3>
            <div className="max-w-full overflow-hidden">
                <Chart options={options} series={series} type="bar" height={310} />
            </div>
        </div>
    );
}
