import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AlertModal from './components/AlertModal';


function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'enabled');
  const [unit, setUnit] = useState('c');
  const [range, setRange] = useState(100);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [thresholds, setThresholds] = useState({ temp: 30, hum: 80, light: 800 });
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      { 
        label: 'Temperature (°C)', 
        data: [], 
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.3,
        hidden: false
      },
      { 
        label: 'Humidity (%)', 
        data: [], 
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3,
        hidden: false
      },
      { 
        label: 'Light', 
        data: [], 
        borderColor: 'rgb(238, 255, 0)',
        backgroundColor: 'rgba(173, 175, 30, 0.1)',
        fill: true,
        tension: 0.3,
        hidden: false
      }
    ]
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode ? 'enabled' : 'disabled');
  }, [darkMode]);

  // Fetch data periodically
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [historyRes, alertsRes] = await Promise.all([
          axios.get(`/history?limit=${range}`),
          axios.get('/alerts')
        ]);
        
        // Validate and transform API responses
        const historyData = validateHistoryData(historyRes?.data);
        const alertsData = validateAlertsData(alertsRes?.data);
        
        const sliced = historyData.slice(-range);
        setChartData(prev => ({
          ...prev,
          labels: sliced.map(d => d.time),
          datasets: [
            { ...prev.datasets[0], data: sliced.map(d => unit === 'f' ? celsiusToFahrenheit(d.temp) : d.temp) },
            { ...prev.datasets[1], data: sliced.map(d => d.hum) },
            { ...prev.datasets[2], data: sliced.map(d => d.light) }
          ]
        }));
        
        setAlerts(alertsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        setChartData(prev => ({
          ...prev,
          labels: [],
          datasets: prev.datasets.map(d => ({ ...d, data: [] }))
        }));
        setAlerts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [range, unit]);

  // Data validation functions
  const validateHistoryData = (data) => {
    if (!Array.isArray(data)) {
      console.warn('Expected array for history data, got:', data);
      return [];
    }
    
    return data.map(item => ({
      time: item?.time || new Date().toLocaleTimeString(),
      temp: typeof item?.temp === 'number' ? item.temp : 0,
      hum: typeof item?.hum === 'number' ? Math.min(Math.max(item.hum, 0), 100) : 0,
      light: typeof item?.light === 'number' ? Math.max(item.light, 0) : 0
    }));
  };

  const validateAlertsData = (data) => {
    if (!Array.isArray(data)) {
      console.warn('Expected array for alerts data, got:', data);
      return [];
    }
    
    return data.filter(alert => 
      alert && 
      ['temp', 'hum', 'light'].includes(alert.type) &&
      typeof alert.value === 'number' &&
      alert.time
    );
  };

  const celsiusToFahrenheit = (celsius) => {
    return parseFloat((celsius * 9/5 + 32).toFixed(1));
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const updateThresholds = async (newThresholds) => {
    try {
      await axios.post('/thresholds', newThresholds);
      setThresholds(newThresholds);
      setShowAlertModal(false);
    } catch (err) {
      console.error("Error updating thresholds:", err);
      setError("Failed to update thresholds");
    }
  };

  const downloadCSV = () => {
    window.location.href = '/export';
  };

  const toggleDataset = (type) => {
    setChartData(prev => ({
      ...prev,
      datasets: prev.datasets.map(d => 
        d.label.toLowerCase().includes(type.toLowerCase()) ? 
        { ...d, hidden: !d.hidden } : d
      )
    }));
  };

  return (
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-sans min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          <Header 
            onSetAlerts={() => setShowAlertModal(true)}
            onDownloadCSV={downloadCSV}
            onToggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
            unit={unit}
            onUnitChange={setUnit}
          />
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 p-4 rounded mb-4">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Dashboard 
              chartData={chartData}
              range={range}
              onRangeChange={setRange}
              onToggleDataset={toggleDataset}
              alerts={alerts}
            />
          )}
          
          {showAlertModal && (
            <AlertModal 
              thresholds={thresholds}
              onUpdate={updateThresholds}
              onClose={() => setShowAlertModal(false)}
            />
          )}
        </div>
      </div>
  );
}

export default App;