const spreadChartData = {
    labels: ["14:01", "14:02", "14:03", "14:04", "14:05", "14:06", "14:07"],
    options: {
        responsive: true,
    },
    datasets: [
        {
            label: "Spread",
            data: [0.45, 0.71, 0.1, 0.4, 0.27, 1, 0.71],
            borderColor: "white",
            fill: true,
            tension: 0.2
        },
    ],
};

export default spreadChartData