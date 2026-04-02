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
    };

    const categories = data?.topProperties?.map(p => p.name) || ['N/A'];
    const counts = data?.topProperties?.map(p => p.totalBookings) || [0];

    const optionsWithData = {
        ...options,
        xaxis: {
            ...options.xaxis,
            categories: categories
        }
    };

    const series = [{
        name: 'Bookings',
        data: counts
    }];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Top Performing Properties
            </h3>
            <div className="max-w-full overflow-hidden">
                <Chart options={optionsWithData} series={series} type="bar" height={310} />
            </div>
        </div>
    );
}
