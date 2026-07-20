import React from "react";
import Chart from "react-apexcharts";

export default function EarningsChart({ graphData }) {
    const options = {
        colors: ["#4f46e5", "#3b82f6", "#10b981"],
        chart: {
            fontFamily: "Instrument Sans, sans-serif",
            type: "bar",
            height: 350,
            stacked: false,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '45%'
            }
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: [0, 0, 3],
            curve: 'smooth'
        },
        xaxis: {
            categories: graphData?.map(item => item.label) || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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
                formatter: (val) => `SAR ${val.toLocaleString()}`
            }
        },
        grid: {
            borderColor: "rgba(226, 232, 240, 0.4)",
            strokeDashArray: 5,
            yaxis: {
                lines: { show: true }
            }
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'left',
            fontFamily: 'Instrument Sans, sans-serif',
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
                horizontal: 12,
                vertical: 5
            }
        },
        tooltip: {
            
            y: {
                formatter: (val) => `SAR ${val.toLocaleString()}`
            }
        }
    };

    const series = [
        {
            name: "Gross Revenue",
            type: "column",
            data: graphData?.map(item => item.revenue) || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: "Provider Payouts",
            type: "column",
            data: graphData?.map(item => item.payouts) || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: "Net Platform Earnings",
            type: "line",
            data: graphData?.map(item => item.netEarnings) || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
    ];

    return (
        <div className="rounded-3xl border border-gray-250 bg-white/70 p-6 dark:border-gray-800/80 dark:bg-gray-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.012)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_15px_40px_rgba(70,95,255,0.03)] overflow-hidden">
            <h3 className="mb-6 text-base font-bold text-gray-800 dark:text-white/90">
                Revenue vs Payouts Trend
            </h3>
            <div className="overflow-hidden">
                <Chart options={options} series={series} type="line" height={320} width="100%" />
            </div>
        </div>
    );
}
