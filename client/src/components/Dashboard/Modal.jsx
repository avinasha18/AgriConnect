// Modal.js

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ onClose, onSubmit, selectedDate }) => {
  const [activities, setActivities] = useState([
    { name: 'Irrigation', hours: 0 },
    { name: 'Fertilization', hours: 0 },
    { name: 'Harvesting', hours: 0 },
    { name: 'Other', hours: 0 },
  ]);

  const handleInputChange = (index, value) => {
    const newActivities = [...activities];
    newActivities[index].hours = parseFloat(value) || 0;
    setActivities(newActivities);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(activities.filter(activity => activity.hours > 0));
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-8 w-96"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
  Farming Activities for {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Unknown Date'}
</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {activities.map((activity, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{activity.name}</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={activity.hours}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
              />
            </div>
          ))}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Submit
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Modal;