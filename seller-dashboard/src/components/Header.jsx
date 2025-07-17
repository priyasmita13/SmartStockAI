"use client";

import React from 'react';
import { Bell, User, Settings, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="bg-[#580A46] border-b border-gray-200 px-6 py-4 rounded-lg">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white tracking-wide hover:underline">Meesho</Link>
        <div className="flex items-center gap-4">
          <button className="p-2 transition">
            <Bell size={20} className="text-white" />
          </button>
          <button className="p-2 transition">
            <Settings size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#580A46] rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 