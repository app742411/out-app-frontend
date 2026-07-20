import React from "react";
import Chart from "react-apexcharts";

export default function BookingStatusChart({ data }) {
    const options = {
        colors: ["#10b981", "#f59e0b", "#f43f5e"],
        chart: {
            fontFamily: "Instrument Sans, sans-serif",
            type: "donut",
        },
        labels: ["Confirmed", "Pending", "Cancelled"],
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
        plotOptions: {
            pie: {
                donut: {
                    size: "72%",
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#9ca3af",
                            offsetY: -4,
                        },
                        value: {
                            show: true,
                            fontSize: "24px",
                            fontWeight: 800,
                            color: "#111827",
                            offsetY: 6,
                            formatter: (val) => val
                        },
                        total: {
                            show: true,
                            label: "Total",
                            color: "#9ca3af",
                            fontSize: "11px",
                            fontWeight: 600,
                            formatter: function (w) {
                                return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                            }
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 3,
            colors: ["transparent"]
        },
        tooltip: {
            
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: "100%"
                    },
                    legend: {
                        position: "bottom"
                    }
                }
            }
        ]
    };

    const series = data?.bookingStatus 
        ? [data.bookingStatus.confirmed || 0, data.bookingStatus.pending || 0, data.bookingStatus.cancelled || 0]
        : [0, 0, 0];

    return (
        <div className="rounded-3xl border border-gray-250 bg-white/70 p-6 dark:border-gray-800/80 dark:bg-gray-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.012)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_15px_40px_rgba(70,95,255,0.03)] sm:p-6 flex flex-col justify-between h-full">
            <h3 className="mb-4 text-base font-bold text-gray-800 dark:text-white/90">
                Booking Status
            </h3>
            <div className="flex justify-center items-center flex-grow py-3">
                <Chart options={options} series={series} type="donut" width="100%" height={260} />
            </div>
        </div>
    );
}
