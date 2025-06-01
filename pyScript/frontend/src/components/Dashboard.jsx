import WeatherChart from './WeatherChart';
import AlertBox from './AlertBox';

export default function Dashboard({ chartData, range, onRangeChange, onToggleDataset, alerts }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-4 mb-4 text-gray-900 dark:text-gray-200">
        {['Temperature', 'Humidity', 'Light'].map((type) => (
          <label key={type} className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={!chartData.datasets.find(d => d.label.includes(type))?.hidden}
              onChange={() => onToggleDataset(type)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            {type}
          </label>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <label className="text-gray-900 dark:text-gray-200">Filter (last N points): </label>
        <input 
          type="number" 
          value={range}
          onChange={(e) => onRangeChange(Number(e.target.value))}
          min="1" 
          max="1000" 
          className="p-1 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600 rounded border w-20"
        />
      </div>
      
      <div className="relative w-full h-[50vh]">
        <WeatherChart data={chartData} />
      </div>
      
      <AlertBox alerts={alerts} />
    </div>
  );
}