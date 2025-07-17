"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
// framer-motion import removed for MeeshoIntroPopup

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, type: 'spring', stiffness: 120 } },
  exit: { opacity: 0, scale: 0.8, y: 40, transition: { duration: 0.3 } }
};

const WelcomePopup = ({ open, onClose, user }) => {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #BE779E 0%, #7931A4 100%)',
        backdropFilter: 'blur(4px)',
      }}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.img
        src="/meesho.jpeg"
        alt="Meesho Logo"
        className="absolute top-6 right-6 w-16 h-16 rounded-full z-50 shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
      <motion.div
        className="rounded-2xl shadow-2xl p-10 max-w-sm w-full text-center relative"
        style={{
          background: 'rgba(255,255,255,0.65)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.3)',
          fontFamily: 'Poppins, Arial, sans-serif',
        }}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <button
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/90 shadow transition text-purple-700 text-2xl font-bold"
          style={{ border: 'none', outline: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(80,0,120,0.08)' }}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-3xl font-extrabold mb-3 drop-shadow-sm" style={{ fontFamily: 'inherit', color: '#222222' }}>Welcome back Seller</h2>
        <p className="text-lg" style={{ fontFamily: 'inherit', color: '#222222' }}>{t('Hope you have a productive day managing your store ✨📈🚀')}</p>
      </motion.div>
    </motion.div>
  );
};

export const MeeshoIntroPopup = ({ open, onClose }) => (
  open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#580A46' }}>
      <motion.h1
        className="text-8xl md:text-9xl font-extrabold text-center select-none z-10"
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
        initial={{ opacity: 1, scale: 1, y: 0 }}
        animate={{ opacity: 1, scale: 1, y: [0, -25, 0] }}
        transition={{ duration: 2, ease: [0.45, 0, 0.55, 1], repeat: 2 }}
      >
         meesho
      </motion.h1>
    </div>
  ) : null
);

export default WelcomePopup;