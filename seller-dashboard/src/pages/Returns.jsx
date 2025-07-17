"use client";

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedHeader from '../components/AnimatedHeader.jsx';
import { returns } from '../data/mockData';
import { Undo2, Calendar, AlertCircle } from 'lucide-react';

const Returns = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <AnimatedHeader text="Returns" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {returns.map((ret, idx) => (
          <motion.div
            key={ret.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border border-gray-200 dark:border-gray-700 cursor-pointer flex flex-col min-h-[260px] group transition-all"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
            whileHover={{ y: -10, scale: 1.03, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.10), 0 10px 10px -5px rgba(0,0,0,0.04)' }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full flex items-center justify-center shadow-sm">
                {ret.productImage && (
                  <img src={ret.productImage} alt={ret.product} className="w-10 h-10 object-cover rounded-full border border-pink-200 dark:border-pink-800" />
                )}
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white truncate max-w-[120px]">{ret.product}</span>
              <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${ret.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 animate-pulse' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>{ret.status}</span>
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Order ID: <span className="font-medium text-gray-700 dark:text-gray-200">{ret.orderId}</span></span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Customer: <span className="font-medium text-gray-700 dark:text-gray-200">{ret.customerName}</span></span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Contact: <span className="font-medium text-gray-700 dark:text-gray-200">{ret.contact}</span></span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 flex-1">{ret.reason}</p>
            <div className="flex items-center gap-4 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><Calendar className="inline-block text-blue-500" size={16} /> {ret.date}</span>
              <span className="text-xs text-green-600 dark:text-green-300 font-semibold ml-2">₹{ret.refundAmount} refunded</span>
              <span className="ml-auto text-red-500 hover:text-red-700 transition-colors cursor-pointer flex items-center gap-1 group-hover:scale-110"><AlertCircle size={18} /> Report</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Returns;