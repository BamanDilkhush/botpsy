import React from 'react';
import { BrainCircuit } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface shadow-inner mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-text-light">
        <div className="flex justify-center items-center mb-2">
          <BrainCircuit className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold text-lg text-text">BotPsych</span>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} BotPsych. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Disclaimer: This tool is for informational purposes only and is not a substitute for professional medical advice.
        </p>
      </div>
    </footer>
  );
};

export default Footer;