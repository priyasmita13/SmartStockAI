import React from 'react';
import { motion } from 'framer-motion';

const AnimatedHeader = ({ text }) => {
  return (
    <h1 className="text-2xl font-bold text-gray-800 mb-1 flex gap-1">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 * i, duration: 0.3 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </h1>
  );
};

export default AnimatedHeader; 