"use client";

import React, { useState, useEffect } from 'react';
import WelcomePopup from '../components/WelcomePopup';
import StockChart from '../components/StockChart';
import { user, orders, products } from '../data/mockData';

const Home = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  // To-Do summary counts
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const downloadLabels = pendingOrders; // For demo, same as pending orders
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 5).length;

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <WelcomePopup open={showWelcome} onClose={() => setShowWelcome(false)} user={user} />
      {/* To-Do Summary */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Pending Orders" count={pendingOrders} color="bg-yellow-100 text-yellow-800" />
        <SummaryCard label="Download Labels" count={downloadLabels} color="bg-blue-100 text-blue-800" />
        <SummaryCard label="Out of Stock" count={outOfStock} color="bg-red-100 text-red-800" />
        <SummaryCard label="Low Stock" count={lowStock} color="bg-orange-100 text-orange-800" />
      </section>
      {/* Business Insights Chart */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700">Business Insights</h3>
        <StockChart />
      </section>
      {/* Meesho Ad Banner */}
      <section className="flex justify-center">
        <img src="/assets/ad1.jpg" alt="Meesho Ad Banner" className="rounded-xl shadow w-full max-w-2xl h-40 object-cover" />
      </section>
      {/* Useful Links & Announcements */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-50 dark:bg-purple-900 rounded-xl p-4 shadow">
          <h4 className="font-bold mb-2 text-purple-700">Useful Links</h4>
          <ul className="list-disc ml-5 text-purple-800 dark:text-purple-200">
            <li><a href="#" className="underline">How to process orders</a></li>
            <li><a href="#" className="underline">Inventory management tips</a></li>
            <li><a href="#" className="underline">Contact Seller Support</a></li>
          </ul>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-4 shadow">
          <h4 className="font-bold mb-2 text-blue-700">Announcements</h4>
          <ul className="list-disc ml-5 text-blue-800 dark:text-blue-200">
            <li>Festival Sale starts next week!</li>
            <li>New features coming soon to SmartStock AI.</li>
            <li>Update your product catalog for better visibility.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

const SummaryCard = ({ label, count, color }) => (
  <div className={`rounded-xl shadow p-6 flex flex-col items-center ${color}`}>
    <span className="text-3xl font-bold mb-2">{count}</span>
    <span className="font-medium">{label}</span>
  </div>
);

export default Home; 