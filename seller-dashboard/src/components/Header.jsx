"use client";

import React from 'react';
import { Bell, User, Settings, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LanguageModal from './LanguageModal';

const NotificationModal = ({ open, onClose }) => open ? (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs w-full text-center relative">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Notifications</h2>
      <p className="mb-4 text-black">You have no new notifications.</p>
      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg" onClick={onClose}>Close</button>
    </div>
  </div>
) : null;

const ProfileModal = ({ open, onClose }) => open ? (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs w-full text-center relative">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">User Profile</h2>
      <div className="mb-4 text-black text-left">
        <div><span className="font-semibold">Name:</span> Roshni Yadav</div>
        <div><span className="font-semibold">GST No:</span> 8763421908</div>
        <div><span className="font-semibold">Registered on:</span> 15th June 2022</div>
      </div>
      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg" onClick={onClose}>Close</button>
    </div>
  </div>
) : null;

const SettingsModal = ({ open, onClose }) => {
  const [isDark, setIsDark] = useState(false);

  // Set default theme to light on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const html = document.querySelector('html');
      let theme = localStorage.getItem('theme');
      if (!theme) {
        theme = 'light';
        localStorage.setItem('theme', 'light');
      }
      if (theme === 'dark') {
        html.classList.add('dark');
        setIsDark(true);
      } else {
        html.classList.remove('dark');
        setIsDark(false);
      }
    }
  }, [open]);

  const setTheme = (theme) => {
    if (typeof window !== 'undefined') {
      const html = document.querySelector('html');
      if (theme === 'dark') {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        setIsDark(true);
      } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        setIsDark(false);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme');
      const html = document.querySelector('html');
      if (theme === 'dark') {
        html.classList.add('dark');
        setIsDark(true);
      } else {
        html.classList.remove('dark');
        setIsDark(false);
      }
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-[#0a0a0a] rounded-xl shadow-lg p-8 max-w-xs w-full text-center relative transition-colors">
        <h2 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-300">Settings</h2>
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${!isDark ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
            onClick={() => setTheme('light')}
          >
            Light
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isDark ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
            onClick={() => setTheme('dark')}
          >
            Dark
          </button>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

const Header = () => {
  const { t } = useTranslation();
  const [showNotification, setShowNotification] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="bg-[#580A46] border-b border-gray-200 px-6 py-4 rounded-lg">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white tracking-wide hover:underline">Seller Dashboard</Link>
        <div className="flex items-center gap-4">
          <button className="p-2 transition" onClick={() => setShowNotification(true)}>
            <Bell size={20} className="text-white" />
          </button>
          <button className="p-2 transition" onClick={() => setShowSettings(true)}>
            <Settings size={20} className="text-white" />
          </button>
          <button className="p-2 transition" onClick={() => setShowProfile(true)}>
            <div className="w-8 h-8 bg-[#580A46] rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </button>
        </div>
      </div>
      <NotificationModal open={showNotification} onClose={() => setShowNotification(false)} />
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
      <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} />
    </header>
  );
};

export default Header; 