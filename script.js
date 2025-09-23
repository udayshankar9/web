// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Select the canvas element from the HTML
    const ctx = document.getElementById('myChart').getContext('2d');

    // URL for the public data source (NASA GISTEMP v4)
    // This data shows the global temperature deviation from the 1951-1980 average.
    const dataUrl = 'https://data.giss.nasa.gov/gistemp/graphs/graph_data/Global_Mean_Estimates_based_on_Land_and_Ocean_Data/graph.json';

    /**
     * An asynchronous function to fetch and display the chart data.
     */
    async function getChartData() {
        try {
            // Fetch the data from the URL
            const response = await fetch(dataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawData = await response.json();

            // Process the raw data into a format Chart.js understands
            const labels = rawData.x_data; // Years
            const dataPoints = rawData.y_data; // Temperature anomalies

            // Create the chart
            createChart(labels, dataPoints);

        } catch (error) {
            console.error("Could not fetch or process data:", error);
        }
    }

    /**
     * Creates a new line chart using Chart.js
     * @param {string[]} labels - The labels for the X-axis (years).
     * @param {number[]} data - The data points for the Y-axis (temperatures).
     */
    function createChart(labels, data) {
        new Chart(ctx, {
            type: 'line', // The type of chart we want to create
            data: {
                labels: labels,
                datasets: [{
                    label: 'Global Temperature Anomaly (°C)',
                    data: data,
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1 // Makes the line slightly curved
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false, // Allows the y-axis to not start at 0
                        title: {
                            display: true,
                            text: 'Temperature Anomaly (°C)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    }
                }
            }
        });
    }

    // Call the function to fetch data and create the chart when the page loads
    getChartData();

});