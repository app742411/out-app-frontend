import React from "react";
import Chart from "react-apexcharts";

export default function BookingStatusChart({ data }) {
    const options = {
        colors: ["#22c55e", "#f59e0b", "#ef4444"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "donut",
        },
        labels: ["Confirmed", "Pending", "Cancelled"],
        legend: {
            show: true,
            position: "bottom",
            fontFamily: "Outfit",
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Total",
                            color: "#6b7280"
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 0
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
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
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Booking Status
            </h3>
            <div className="flex justify-center">
                <Chart options={options} series={series} type="donut" width="100%" height={320} />
            </div>
        </div>
    );
}
