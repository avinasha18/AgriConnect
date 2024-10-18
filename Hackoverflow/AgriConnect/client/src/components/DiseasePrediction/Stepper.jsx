import React from 'react';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-center space-x-4 mb-6">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep > index ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            {currentStep > index ? <span className="text-white">✓</span> : <span className="text-gray-700">{index + 1}</span>}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-1 ${currentStep > index ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
