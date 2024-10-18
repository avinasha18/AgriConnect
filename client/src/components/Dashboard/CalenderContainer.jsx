// CalendarContainer.js

import React from 'react';
import { motion } from 'framer-motion';

const CalendarContainer = ({ month, year, activeDays, onDayClick }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isActiveDay = (day) => {
    return activeDays.some(activeDay => 
      new Date(activeDay).getDate() === day &&
      new Date(activeDay).getMonth() === month &&
      new Date(activeDay).getFullYear() === year
    );
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
        <div
          key={day}
          className="text-center text-xs font-medium text-gray-500"
        >
          {day}
        </div>
      ))}
      {Array(firstDay)
        .fill(null)
        .map((_, i) => (
          <div key={`empty-${i}`} className="h-8"></div>
        ))}
      {days.map((day) => (
        <motion.div
          key={day}
          className={`h-8 flex items-center justify-center rounded-full text-sm cursor-pointer
            ${
              isActiveDay(day)
                ? "bg-green-500 text-white"
                : "text-gray-700"
            }`}
          onClick={() => onDayClick(new Date(year, month, day).toISOString().split('T')[0])}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {day}
        </motion.div>
      ))}
    </div>
  );
};

export default CalendarContainer;