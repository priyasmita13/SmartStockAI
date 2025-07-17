"use client";

import { motion } from "framer-motion";

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating circles */}
      <motion.div
        className="absolute top-20 left-20 w-4 h-4 bg-[#FFB6D9] rounded-full opacity-30"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-32 w-6 h-6 bg-[#FFE066] rounded-full opacity-20"
        animate={{
          y: [0, 40, 0],
          x: [0, -25, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-32 left-40 w-3 h-3 bg-[#580A46] rounded-full opacity-25"
        animate={{
          y: [0, -20, 0],
          x: [0, 15, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-5 h-5 bg-[#A84370] rounded-full opacity-15"
        animate={{
          y: [0, 25, 0],
          x: [0, -10, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      
      {/* Floating squares */}
      <motion.div
        className="absolute top-60 left-10 w-2 h-2 bg-[#FFB6D9] opacity-20"
        animate={{
          rotate: [0, 360],
          y: [0, -15, 0],
        }}
        transition={{
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.div
        className="absolute top-80 right-16 w-3 h-3 bg-[#FFE066] opacity-15"
        animate={{
          rotate: [0, -360],
          y: [0, 20, 0],
        }}
        transition={{
          rotate: { duration: 12, repeat: Infinity, ease: "linear" },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
      />
    </div>
  );
};

export default FloatingElements; 