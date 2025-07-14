"use client";

import React from 'react';
import { Undo2, Calendar, AlertCircle } from 'lucide-react';
import { returns } from '../data/mockData';

const Returns = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Processed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Returns</h1>
      </div>

      {returns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {returns.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Undo2 size={20} className="text-red-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">{item.product}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <AlertCircle size={16} />
                  <span className="font-medium">Reason: {item.reason}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar size={16} />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Undo2 size={48} className="mx-auto mb-4 text-gray-400" />
          <p>No returns found</p>
        </div>
      )}
    </div>
  );
};

export default Returns; 