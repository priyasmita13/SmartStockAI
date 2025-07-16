"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';

const WelcomePopup = ({ open, onClose, user }) => {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#DDA0DD' }}>
      <img src="/meesho.jpeg" alt="Meesho Logo" className="absolute top-6 right-6 w-14 h-14 rounded-full z-50" />
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-sm w-full text-center relative">
        <button className="absolute top-3 right-16 text-gray-400 hover:text-gray-700 dark:hover:text-white" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-2 text-purple-700">Welcome back Seller</h2>
        <p className="text-gray-600 dark:text-gray-300">{t('Hope you have a productive day managing your store 🚀')}</p>
      </div>
    </div>
  );
};

export default WelcomePopup;