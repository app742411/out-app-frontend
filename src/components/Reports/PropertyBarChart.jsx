import React from "react";
import Chart from "react-apexcharts";

export default function PropertyBarChart({ data }) {
    const options = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
                barHeight: '70%',
            }
        },
        colors: ['#000'],
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: data?.names || ['Beach Resort', 'City Hotel', 'Desert Camp', 'Mountain Villa', 'Luxury Suite', 'Family Home', 'Pool Villa'],
        },
        grid: {
            xaxis: {
                lines: {
                    show: true
                }
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
        data: data?.counts || [400, 430, 448, 470, 540, 580, 690]
    }];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Top Performing Properties
            </h3>
            <div className="max-w-full overflow-x-auto">
                <Chart options={options} series={series} type="bar" height={310} />
            </div>
        </div>
    );
}
