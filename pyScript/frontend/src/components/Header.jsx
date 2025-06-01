export default function Header({ onSetAlerts, onDownloadCSV, onToggleDarkMode, darkMode, unit, onUnitChange }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
      <h2 className="text-2xl sm:text-3xl font-bold">Mini Weather Station</h2>
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center">
          <label className="mr-2 text-gray-900 dark:text-gray-200">Unit:</label>
          <select
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
            className="p-2 border rounded text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="c">Celsius</option>
            <option value="f">Fahrenheit</option>
          </select>
        </div>
        <button 
          onClick={onSetAlerts}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Set Alerts
        </button>
        <button 
          onClick={onDownloadCSV}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Download CSV
        </button>
        <button 
          onClick={onToggleDarkMode}
          className="px-3 py-2 bg-gray-800 dark:bg-gray-600 text-white rounded"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  );
}