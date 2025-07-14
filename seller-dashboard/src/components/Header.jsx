"use client";

import React from 'react';
import { Bell, User, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-[#f5f5dc] dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Seller Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-white transition">
            <Bell size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-white transition">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4A148C] rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Seller User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 