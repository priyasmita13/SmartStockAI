"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import SmartStockAI from './SmartStockAI';
import IntroExperience from './IntroExperience';
import FloatingElements from './FloatingElements';
import { MeeshoIntroPopup } from './WelcomePopup';

const ENCOURAGING_MESSAGES = [
  "You're doing amazing work! Keep it up!",
  "Every order is a step toward success.",
  "Your dedication is inspiring!",
  "Great things are coming your way.",
  "Your store is growing stronger every day!",
  "Keep pushing boundaries, Seller!",
  "Your hard work is paying off.",
  "Stay positive and keep selling!",
  "You make shopping better for everyone.",
  "Believe in yourself—success is near!"
];

const WelcomeFlash = ({ open, onClose }) => {
  const [msg] = useState(ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)]);
  if (!open) return null;
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #BE779E 0%, #7931A4 100%)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="rounded-2xl shadow-2xl p-10 max-w-sm w-full text-center relative"
        style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.3)', fontFamily: 'Poppins, Arial, sans-serif' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.img
          src="/meesho.jpeg"
          alt="Meesho Logo"
          className="w-20 h-20 rounded-full mx-auto mb-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
        <h2 className="text-2xl font-extrabold mb-1 drop-shadow-sm" style={{ color: '#222222' }}>Welcome back Seller</h2>
        <p className="text-lg text-gray-700 dark:text-gray-900">{msg}</p>
      </motion.div>
    </motion.div>
  );
};

const LayoutWrapper = ({ children }) => {
  const [showIntro, setShowIntro] = useState(false);
  const [showMeeshoIntro, setShowMeeshoIntro] = useState(false);
  const [showWelcomeFlash, setShowWelcomeFlash] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Check if this is the first time the app is loaded (hard reload)
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    const hasSeenMeeshoIntro = sessionStorage.getItem('hasSeenMeeshoIntro');
    const hasSeenWelcomeFlash = sessionStorage.getItem('hasSeenWelcomeFlash');
    if (!hasSeenIntro) {
      setShowIntro(true);
    } else if (!hasSeenMeeshoIntro) {
      setShowMeeshoIntro(true);
      setTimeout(() => {
        setShowMeeshoIntro(false);
        sessionStorage.setItem('hasSeenMeeshoIntro', 'true');
        setShowWelcomeFlash(true);
        setTimeout(() => {
          setShowWelcomeFlash(false);
          sessionStorage.setItem('hasSeenWelcomeFlash', 'true');
        }, 1500);
      }, 2200); // Meesho splash duration (bounce/explode)
    }
  }, []);

  // Listen for custom event to open SmartStock AI from other components
  useEffect(() => {
    const handleOpenSmartStockAI = () => {
      setAiOpen(true);
    };

    window.addEventListener('openSmartStockAI', handleOpenSmartStockAI);

    return () => {
      window.removeEventListener('openSmartStockAI', handleOpenSmartStockAI);
    };
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('hasSeenIntro', 'true');
    setShowMeeshoIntro(true);
    setTimeout(() => {
      setShowMeeshoIntro(false);
      sessionStorage.setItem('hasSeenMeeshoIntro', 'true');
      setShowWelcomeFlash(true);
      setTimeout(() => {
        setShowWelcomeFlash(false);
        sessionStorage.setItem('hasSeenWelcomeFlash', 'true');
      }, 1500);
    }, 2200);
  };

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FloatingElements />
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroExperience key="intro" onComplete={handleIntroComplete} />
        ) : showMeeshoIntro ? (
          <MeeshoIntroPopup key="meesho-intro" open={showMeeshoIntro} onClose={() => setShowMeeshoIntro(false)} />
        ) : showWelcomeFlash ? (
          <WelcomeFlash open={showWelcomeFlash} onClose={() => setShowWelcomeFlash(false)} />
        ) : (
          <motion.div
            key="dashboard"
            className="flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sidebar 
              aiOpen={aiOpen} 
              setAiOpen={setAiOpen} 
              onToggle={handleSidebarToggle}
            />
            <motion.div 
              className="flex-1"
              animate={{ 
                marginLeft: sidebarCollapsed ? '4rem' : '16rem',
                x: aiOpen ? -300 : 0,
                opacity: aiOpen ? 0.3 : 1
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.6
              }}
            >
              <Header />
              <main className="p-6">
                {children}
              </main>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {aiOpen && (
          <SmartStockAI 
            open={aiOpen} 
            onClose={() => setAiOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LayoutWrapper; 