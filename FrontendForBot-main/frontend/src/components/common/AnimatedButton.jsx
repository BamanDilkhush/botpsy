import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({ children, onClick, className = '', variant = 'primary', type = 'button', disabled = false }) => {
  const baseClasses = 'px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-4 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300',
    secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-300',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-300',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;