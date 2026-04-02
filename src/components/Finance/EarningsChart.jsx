import React from "react";
import Chart from "react-apexcharts";

export default function EarningsChart({ graphData }) {
    const options = {
        colors: ["#2d2d2d", "#3b82f6", "#10b981"],
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
            categories: graphData?.map(item => item.label) || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 shadow-sm overflow-hidden">
            <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
                Revenue vs Payouts Trend
            </h3>
            <div className="overflow-hidden">
                <Chart options={options} series={series} type="line" height={320} width="100%" />
            </div>
        </div>
    );
}
