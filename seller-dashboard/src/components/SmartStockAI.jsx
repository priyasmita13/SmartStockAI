"use client";

import React from 'react';

const SmartStockAI = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      {/* Drawer */}
      <div className="relative w-80 h-full bg-white dark:bg-gray-900 shadow-lg p-6 flex flex-col gap-6 transform transition-transform duration-300 ease-in-out translate-x-0">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white" onClick={onClose}>&times;</button>
        <h3 className="text-xl font-bold mb-4 text-purple-700">SmartStock AI</h3>
        <div className="flex flex-col gap-4">
          <AIButton label="Get info about stock" />
          <AIButton label="Generate a weekly or monthly report" />
          <AIButton label="Get info about festival season demand" />
          <AIButton label="Product listing assistance" />
        </div>
      </div>
    </div>
  );
};

const AIButton = ({ label }) => (
  <button className="w-full px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg font-medium transition">
    {label}
  </button>
);

export default SmartStockAI; 