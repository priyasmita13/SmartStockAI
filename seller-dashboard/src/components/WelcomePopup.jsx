"use client";

import React from 'react';

const WelcomePopup = ({ open, onClose, user }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-sm w-full text-center relative">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-2 text-purple-700">Welcome back, {user?.name || 'Seller'}!</h2>
        <p className="text-gray-600 dark:text-gray-300">Hope you have a productive day managing your store 🚀</p>
      </div>
    </div>
  );
};

export default WelcomePopup;