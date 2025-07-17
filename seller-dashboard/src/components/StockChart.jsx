"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StockChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  const data = [
    { name: 'Jan', Sales: 400, Revenue: 240, Orders: 240 },
    { name: 'Feb', Sales: 300, Revenue: 139, Orders: 221 },
    { name: 'Mar', Sales: 200, Revenue: 980, Orders: 229 },
    { name: 'Apr', Sales: 278, Revenue: 390, Orders: 200 },
    { name: 'May', Sales: 189, Revenue: 480, Orders: 218 },
    { name: 'Jun', Sales: 239, Revenue: 380, Orders: 250 },
    { name: 'Jul', Sales: 349, Revenue: 430, Orders: 210 },
  ];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setChartData(data);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            className="flex items-center justify-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-[#FFB6D9] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              className="ml-4 text-white text-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading chart data...
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="chart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="w-full"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fff" />
                <XAxis 
                  dataKey="name" 
                  stroke="#fff" 
                  tick={{ fill: '#fff' }}
                  axisLine={{ stroke: '#fff' }}
                />
                <YAxis 
                  stroke="#fff" 
                  tick={{ fill: '#fff' }}
                  axisLine={{ stroke: '#fff' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#2c0821', 
                    color: '#fff', 
                    border: '1px solid #FFB6D9',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                  }} 
                  itemStyle={{ color: '#FFB6D9' }} 
                  labelStyle={{ color: '#FFE066' }} 
                />
                <Legend 
                  wrapperStyle={{ 
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                  iconType="circle"
                  iconSize={12}
                />
                <Line 
                  type="monotone" 
                  dataKey="Revenue" 
                  stroke="#FFB6D9" 
                  activeDot={{ r: 8 }}
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#FFB6D9' }}
                  name="Revenue (₹)"
                />
                <Line 
                  type="monotone" 
                  dataKey="Sales" 
                  stroke="#FFE066"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#FFE066' }}
                  name="Sales (Units)"
                />
                <Line 
                  type="monotone" 
                  dataKey="Orders" 
                  stroke="#A84370"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#A84370' }}
                  name="Orders (Count)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating chart indicators */}
      <motion.div
        className="absolute top-4 right-4 w-3 h-3 bg-[#FFB6D9] rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-4 left-4 w-2 h-2 bg-[#FFE066] rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </motion.div>
  );
};

export default StockChart; 