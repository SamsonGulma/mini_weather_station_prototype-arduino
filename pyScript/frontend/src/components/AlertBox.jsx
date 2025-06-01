// src/components/AlertBox.js
export default function AlertBox({ alerts }) {
    if (alerts.length === 0) return null;
  
    return (
      <div className="bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-100 text-yellow-800 p-4 rounded shadow mb-4">
        <h3 className="font-bold mb-2">Active Alerts</h3>
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div key={index} className="p-2 bg-yellow-200 dark:bg-yellow-900 rounded">
              ⚠️ <strong>{alert.type.toUpperCase()}</strong> alert at {alert.time}: 
              {alert.value} (Threshold: {alert.threshold})
            </div>
          ))}
        </div>
      </div>
    );
  }