"use client";

import React, { useState } from 'react';
import OrderCard from '../components/OrderCard';
import { orders } from '../data/mockData';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const pendingOrders = orders.filter(order => order.status === 'Pending');
  const deliveredOrders = orders.filter(order => order.status === 'Delivered');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Orders</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Orders ({pendingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'delivered'
                ? 'border-purple-500 text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Delivered Orders ({deliveredOrders.length})
          </button>
        </nav>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === 'pending' ? (
          pendingOrders.length > 0 ? (
            pendingOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No pending orders
            </div>
          )
        ) : (
          deliveredOrders.length > 0 ? (
            deliveredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No delivered orders
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Orders; 