"use client";

import React from 'react';
import { Package, Calendar, Clock } from 'lucide-react';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package size={20} className="text-purple-600" />
          <span className="font-semibold text-gray-900 dark:text-white">{order.id}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-gray-700 dark:text-gray-300 font-medium">{order.product}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar size={16} />
          <span>{new Date(order.date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard; 