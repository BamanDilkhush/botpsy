import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      className={`bg-surface rounded-2xl shadow-lg p-6 transition-shadow duration-300 hover:shadow-xl ${className}`}
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;