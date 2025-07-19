"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaBullhorn, FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import AnimatedHeader from '../components/AnimatedHeader.jsx';

const advertisements = [
  {
    id: 1,
    title: 'Festival Sale',
    description: 'Boost your sales with our upcoming festival sale campaign!',
    status: 'Active',
    date: '2024-07-20',
  },
  {
    id: 2,
    title: 'Clearance Offer',
    description: 'Clear old stock with special discounts.',
    status: 'Scheduled',
    date: '2024-08-01',
  },
];

const Advertisements = () => {
  return (
    <div>
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
        <AnimatedHeader text="Advertisements" />
        <div className="flex items-center justify-between mb-8">
          {/* Removed the 'Manage Your Campaigns' line as requested */}
          <div></div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-blue-700 transition-colors cursor-pointer">
            <FaPlusCircle />
            New Campaign
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advertisements.map(ad => (
            <motion.div
              key={ad.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-2xl transition cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: ad.id * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <FaBullhorn className="text-pink-600 text-xl" />
                <span className="font-bold text-lg text-white">{ad.title}</span>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${ad.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{ad.status}</span>
              </div>
              <p className="text-gray-900 dark:text-gray-100 mb-2">{ad.description}</p>
              <div className="flex items-center gap-4 mt-auto">
                <span className="text-xs text-gray-400">{ad.date}</span>
                <button className="ml-auto text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"><FaEdit /></button>
                <button className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"><FaTrash /></button>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Notification Example */}
        <motion.div
          className="fixed bottom-8 right-8 bg-white rounded-xl shadow-lg px-6 py-4 flex items-center gap-3 border-l-4 border-blue-500 z-50"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
        >
          <FaBullhorn className="text-blue-500 text-2xl" />
          <span className="text-gray-800 font-medium">Your new campaign is live!</span>
          <button className="ml-auto text-gray-400 hover:text-gray-700 transition-colors cursor-pointer text-xl">×</button>
        </motion.div>
      </div>
    </div>
  );
};

export default Advertisements; 