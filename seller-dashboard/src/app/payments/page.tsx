"use client";

import React from 'react';
import { CreditCard, DollarSign, TrendingUp } from 'lucide-react';

const Payments = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold">Total Earnings</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">₹45,250</p>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold">Pending Amount</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">₹12,800</p>
          <p className="text-sm text-gray-500 mt-2">To be processed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold">Growth</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">+15%</p>
          <p className="text-sm text-gray-500 mt-2">vs last month</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="font-medium">Order #ORD123</p>
              <p className="text-sm text-gray-500">Red Saree</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-600">+₹1,250</p>
              <p className="text-sm text-gray-500">2024-07-10</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="font-medium">Order #ORD124</p>
              <p className="text-sm text-gray-500">Blue Kurti</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-600">+₹850</p>
              <p className="text-sm text-gray-500">2024-07-09</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments; 