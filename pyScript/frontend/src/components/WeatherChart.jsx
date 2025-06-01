// src/components/WeatherChart.js
import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export default function WeatherChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            tooltip: {
              callbacks: {
                title: (context) => 'Time: ' + context[0].label,
                label: (context) => `${context.dataset.label}: ${context.parsed.y}`
              }
            },
            legend: {
              labels: {
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                boxWidth: 12,
                font: { size: 14 }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time',
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                font: { size: 14 }
              },
              grid: {
                color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Sensor Values',
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                font: { size: 14 }
              },
              grid: {
                color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
}