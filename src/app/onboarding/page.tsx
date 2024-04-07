'use client';
import React, { useState } from 'react';
import { Button } from '@/common/components/ui/Button'; // Assuming Button component is imported correctly

const steps = [
  { title: 'Welcome to Mockbird!', content: 'Step 1: Enter your basic information' },
  { title: 'Welcome to Mockbird!', content: 'Step 2: Upload a profile picture' },
  { title: 'Welcome to Mockbird!', content: 'Step 3: Choose your interests' },
  { title: 'Welcome to Mockbird!', content: 'Step 4: Review and confirm' }
];

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    setStep(step + 1);
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <h1 className='text-4xl mb-8'>{steps[step].title}</h1>
      <p className="text-lg mb-4">{steps[step].content}</p>
      <div className="flex justify-between w-1/2">
        {step > 0 && (
          <Button onClick={previousStep} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Previous
          </Button>
        )}
        <div className="flex justify-end w-full"> {/* Adjusted flex container to justify content to the end */}
          {step < steps.length - 1 && (
            <Button onClick={nextStep} className="bg-sxpurple hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Next
            </Button>
          )}
          {step === steps.length - 1 && (
            <Button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Finish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
