// Stepper.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { UilUpload, UilSpinnerAlt, UilCheckCircle, UilExclamationCircle } from '@iconscout/react-unicons';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-center mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="relative flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-300 rounded-full">
            {index < currentStep ? (
              <UilCheckCircle className="text-green-500" />
            ) : (
              <span className="text-gray-500">{index + 1}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div className="w-16 h-0.5 bg-gray-300"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
