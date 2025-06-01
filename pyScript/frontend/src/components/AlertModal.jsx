// src/components/AlertModal.js
import { useState } from 'react';

export default function AlertModal({ thresholds, onUpdate, onClose }) {
  const [formData, setFormData] = useState(thresholds);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: Number(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Set Alert Thresholds</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {[
              { id: 'temp', label: 'Temperature Threshold (°C)', placeholder: 'Enter temperature' },
              { id: 'hum', label: 'Humidity Threshold (%)', placeholder: 'Enter humidity' },
              { id: 'light', label: 'Light Threshold', placeholder: 'Enter light level' }
            ].map((field) => (
              <div key={field.id}>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                <input
                  type="number"
                  id={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full p-2 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600 rounded border"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}