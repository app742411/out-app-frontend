import React from "react";
import Chart from "react-apexcharts";

export default function EarningsChart({ data }) {
    const options = {
        colors: ["#2d2d2d", "#3b82f6", "#ef4444"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "bar",
            height: 350,
            stacked: false,
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: [1, 1, 4],
            curve: 'smooth'
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (val) => `SAR ${val.toLocaleString()}`
            }
        },
        grid: {
            borderColor: "#e2e8f0",
            strokeDashArray: 4,
            yaxis: {
                lines: { show: true }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            fontFamily: 'Outfit',
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
            data: data?.revenue || [31000, 40000, 28000, 51000, 42000, 109000, 100000, 85000, 95000, 110000, 120000, 150000],
        },
        {
            name: "Provider Payouts",
            type: "column",
            data: data?.payouts || [25000, 32000, 22000, 41000, 33000, 87000, 80000, 68000, 76000, 88000, 96000, 120000],
        },
        {
            name: "Net Platform Earnings",
            type: "line",
            data: data?.profit || [6000, 8000, 6000, 10000, 9000, 22000, 20000, 17000, 19000, 22000, 24000, 30000],
        }
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
                Revenue vs Payouts Trend
            </h3>
            <div className="overflow-hidden">
                <Chart options={options} series={series} type="line" height={320} width="100%" />
            </div>
        </div>
    );
}
