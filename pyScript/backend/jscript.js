
const ctx = document.getElementById('weatherChart').getContext('2d');
const unitToggle = document.getElementById('unitToggle');
const rangeInput = document.getElementById('range');
const alertsBox = document.getElementById('alertsBox');

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');  // toggles class on <html>
  }
const datasets = {
    temp: {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.3,
        hidden: false
    },
    hum: {
        label: 'Humidity (%)',
        data: [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3,
        hidden: false
    },
    light: {
        label: 'Light',
        data: [],
        borderColor: 'rgb(238, 255, 0)',
        backgroundColor: 'rgba(173, 175, 30, 0.1)',
        fill: true,
        tension: 0.3,
        hidden: false
    }
};

const weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: Object.values(datasets)
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: function (context) {
                        return 'Time: ' + context[0].label;
                    },
                    
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y}`;
                    }
                }
            },
            legend: {
                labels: {
                    boxWidth: 12,
                    font: {
                        size: 14
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time',
                    font: { size: 14 },
                    color: 'white',
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Sensor Values',
                    font: { size: 14 },
                    color: 'white',
                }
            }
        }
    }
});



function updateChart() {
    fetch('/history')
        .then(res => res.json())
        .then(data => {
            const range = parseInt(rangeInput.value);
            const sliced = data.slice(-range);
            const labels = sliced.map(d => d.time);
            const temps = sliced.map(d => convertTemp(d.temp));
            const hums = sliced.map(d => d.hum);
            const lights = sliced.map(d => d.light);

            weatherChart.data.labels = labels;
            datasets.temp.data = temps;
            datasets.hum.data = hums;
            datasets.light.data = lights;

            weatherChart.update();
        });
}

function fetchAlerts() {
    fetch('/alerts')
        .then(res => res.json())
        .then(alerts => {
            if (alerts.length > 0) {
                const recent = alerts[alerts.length - 1];
                alertsBox.innerText = `⚠️ ${recent.type.toUpperCase()} ALERT at ${recent.time}: ${recent.value}`;
                alertsBox.classList.remove('hidden');
            } else {
                alertsBox.classList.add('hidden');
            }
        });
}

function convertTemp(celsius) {
    return unitToggle.value === 'f'
        ? (celsius * 9 / 5 + 32).toFixed(1)
        : celsius;
}

function updateThresholds() {
    const temp = document.getElementById('tempThreshold').value;
    const hum = document.getElementById('humThreshold').value;
    const light = document.getElementById('lightThreshold').value;

    fetch('/thresholds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temp, hum, light })
    })
        .then(res => res.json())
        .then(data => {
            alert('Thresholds updated!');
        });
}

document.querySelectorAll('.data-toggle').forEach(input => {
    input.addEventListener('change', e => {
        datasets[e.target.dataset.type].hidden = !e.target.checked;
        weatherChart.update();
    });
});

unitToggle.addEventListener('change', updateChart);
rangeInput.addEventListener('change', updateChart);

function downloadCSV() {
    window.location.href = '/export';
}

setInterval(() => {
    updateChart();
    fetchAlerts();
}, 2000);