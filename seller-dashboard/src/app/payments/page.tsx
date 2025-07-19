"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, TrendingUp } from 'lucide-react';

const Payments = () => {
  return (
    <motion.div>
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-black cursor-pointer">Payments</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-2xl transition cursor-pointer"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <CreditCard className="text-purple-600" size={24} />
              </motion.div>
              <h3 className="text-lg font-semibold cursor-pointer text-white">Total Earnings</h3>
            </motion.div>
            <motion.p 
              className="text-3xl font-bold text-green-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              ₹45,250
            </motion.p>
            <p className="text-sm text-gray-500 mt-2 cursor-pointer">This month</p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-2xl transition cursor-pointer"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -4 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ 
                  x: [-2, 2, -2],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <DollarSign className="text-blue-600" size={24} />
              </motion.div>
              <h3 className="text-lg font-semibold cursor-pointer text-white">Pending Amount</h3>
            </motion.div>
            <motion.p 
              className="text-3xl font-bold text-yellow-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              ₹12,800
            </motion.p>
            <p className="text-sm text-gray-500 mt-2 cursor-pointer">To be processed</p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-2xl transition cursor-pointer"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.03, y: -4 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ 
                  x: [0, 3, 0],
                  y: [0, -3, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <TrendingUp className="text-green-600" size={24} />
              </motion.div>
              <h3 className="text-lg font-semibold cursor-pointer text-white">Growth</h3>
            </motion.div>
            <motion.p 
              className="text-3xl font-bold text-green-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              +15%
            </motion.p>
            <p className="text-sm text-gray-500 mt-2 cursor-pointer">vs last month</p>
          </motion.div>
        </div>

        <motion.div 
          className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition cursor-pointer mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.01 }}
        >
          <h3 className="text-lg font-semibold mb-4 cursor-pointer">Recent Transactions</h3>
          <div className="space-y-3">
            <motion.div 
              className="flex items-center justify-between py-2 border-b border-gray-200 cursor-pointer"
              whileHover={{ x: 5, backgroundColor: "rgba(0,0,0,0.02)" }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <p className="font-medium cursor-pointer">Order #ORD123</p>
                <p className="text-sm text-gray-500 cursor-pointer">Red Saree</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600 cursor-pointer">+₹1,250</p>
                <p className="text-sm text-gray-500 cursor-pointer">2024-07-10</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center justify-between py-2 border-b border-gray-200 cursor-pointer"
              whileHover={{ x: 5, backgroundColor: "rgba(0,0,0,0.02)" }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <p className="font-medium cursor-pointer">Order #ORD124</p>
                <p className="text-sm text-gray-500 cursor-pointer">Blue Kurti</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600 cursor-pointer">+₹850</p>
                <p className="text-sm text-gray-500 cursor-pointer">2024-07-09</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Payments; 