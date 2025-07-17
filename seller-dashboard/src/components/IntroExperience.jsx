"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroExperience = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState('intro'); // 'intro' -> 'welcome' -> 'complete'
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has seen intro before
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    
    if (hasSeenIntro) {
      setIsVisible(false);
      onComplete();
      return;
    }

    // Intro sequence
    const introTimer = setTimeout(() => {
      setCurrentStep('welcome');
    }, 3000);

    const welcomeTimer = setTimeout(() => {
      setCurrentStep('complete');
      localStorage.setItem('hasSeenIntro', 'true');
    }, 6000);

    const finalTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 8000);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(welcomeTimer);
      clearTimeout(finalTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      {currentStep === 'intro' && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: '#580A46' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-8xl md:text-9xl font-extrabold text-center select-none"
            style={{
              color: '#FFA500',
              letterSpacing: '0.03em',
              fontWeight: 900,
              fontStretch: 'expanded',
              fontFamily: "'Poppins', Impact, 'Arial Black', Arial, sans-serif",
              WebkitTextStroke: '0.5px #FFA500',
              textStroke: '0.5px #FFA500',
              lineHeight: 1.3,
            }}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 2, 
              ease: [0.45, 0, 0.55, 1],
              rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            meesho
          </motion.h1>
        </motion.div>
      )}

      {currentStep === 'welcome' && (
        <motion.div
          key="welcome"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            duration: 0.8
          }}
          style={{
            background: 'linear-gradient(135deg, #BE779E 0%, #7931A4 100%)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            className="text-center max-w-2xl mx-auto px-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.img
              src="/meesho.jpeg"
              alt="Meesho Logo"
              className="w-24 h-24 rounded-full mx-auto mb-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <motion.h2 
              className="text-5xl font-extrabold mb-6 text-white drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Welcome back Seller! 🚀
            </motion.h2>
            <motion.p 
              className="text-xl text-white/90 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Ready to boost your business with SmartStock AI? 
              <br />
              Let's make today productive! ✨📈
            </motion.p>
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <motion.div
                className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {currentStep === 'complete' && (
        <motion.div
          key="complete"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ x: 0 }}
          animate={{ x: '-100%' }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            duration: 0.8
          }}
          style={{
            background: 'linear-gradient(135deg, #BE779E 0%, #7931A4 100%)',
          }}
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 border-4 border-white border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: 2, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroExperience; 