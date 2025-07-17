"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Package, Calendar, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const OrderCard = ({ order, index = 0 }) => {
  const { t } = useTranslation();
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 cursor-pointer"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div 
        className="flex items-center justify-between mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Package size={20} className="text-blue-600" />
          </motion.div>
          <span className="font-semibold text-gray-900 dark:text-white">{order.product}</span>
        </motion.div>
        <motion.span 
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={order.status === 'Pending' ? {
            scale: [1, 1.05, 1],
            boxShadow: ["0 0 0 0 rgba(245, 158, 11, 0.4)", "0 0 0 10px rgba(245, 158, 11, 0)", "0 0 0 0 rgba(245, 158, 11, 0)"]
          } : {}}
          transition={{ 
            duration: 2,
            repeat: order.status === 'Pending' ? Infinity : 0,
            repeatDelay: 1
          }}
        >
          {order.status}
        </motion.span>
      </motion.div>
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              y: [0, -1, 0]
            }}
            transition={{ 
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Calendar size={16} />
          </motion.div>
          <span className="cursor-pointer">{new Date(order.date).toLocaleDateString()}</span>
        </motion.div>
        <motion.div 
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 1, 0]
            }}
            transition={{ 
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <MapPin size={16} />
          </motion.div>
          <span className="cursor-pointer">{order.location}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default OrderCard; 