"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import StockChart from '../components/StockChart';
import { orders, products } from '../data/mockData';
import { useRouter } from 'next/navigation';
import { FaClipboardList, FaFileDownload, FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa';
import AnimatedHeader from '../components/AnimatedHeader.jsx';

const WELCOME_MESSAGES = [
  "Welcome to Meesho Seller! Ready to grow your business?",
  "Hello Seller! Let's make today productive.",
  "Welcome aboard! Your dashboard awaits.",
  "Hi there! Ready to manage your orders?",
  "Welcome! Let's get your products selling.",
  "Hello! Wishing you great sales today.",
  "Welcome to your SmartStock dashboard!",
  "Hi Seller! Let's check your business insights.",
  "Welcome! Your inventory is just a click away.",
  "Hello! Let's make your business shine on Meesho."
];

const Home = () => {
  const router = useRouter();
  // To-Do summary counts
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const downloadLabels = pendingOrders; // For demo, same as pending orders
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 5).length;

  return (
    <motion.div 
      style={{ background: '#D7BFDC', minHeight: '100vh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Header */}
      <div className="px-6 py-4">
        <AnimatedHeader text="Welcome back, Seller" />
        <p className="text-gray-600">Manage and grow your business with Meesho</p>
      </div>

      {/* To do list container */}
      <section className="bg-white rounded-xl shadow px-6 py-4 mb-8 mx-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">To do list</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard icon={<FaClipboardList className="text-yellow-700 text-xl" />} label="Pending Orders" count={pendingOrders} color="bg-yellow-100 text-yellow-800" />
          <SummaryCard icon={<FaFileDownload className="text-blue-700 text-xl" />} label="Download Labels" count={downloadLabels} color="bg-blue-100 text-blue-800" />
          <SummaryCard icon={<FaBoxOpen className="text-red-700 text-xl" />} label="Out of Stock" count={outOfStock} color="bg-red-100 text-red-800" />
          <SummaryCard icon={<FaExclamationTriangle className="text-orange-700 text-xl" />} label="Low Stock" count={lowStock} color="bg-orange-100 text-orange-800" />
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
        {/* Left Column - Business Insights */}
        <div className="lg:col-span-2">
          <section className="rounded-xl shadow p-6 cursor-pointer" style={{ background: '#2c0821' }}>
            <h3 className="text-lg font-semibold mb-4 text-white cursor-pointer">Business Insights</h3>
            <StockChart />
            <BusinessInsightsDetails />
            <div className="mt-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                onClick={() => router.push('/orders')}
              >
                View More Details
              </button>
            </div>
          </section>
        </div>

        {/* Right Column - DailyDeals Banner + Announcements/Links */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <DailyDealsBanner />
          <AnimatedAnnouncements />
          <AnimatedUsefulLinks />
        </div>
      </div>

      {/* Banner Film at the base, larger */}
      <div className="w-full flex flex-col items-center mt-16 pb-8">
        <BannerFilm large />
      </div>
    </motion.div>
  );
};

// DailyDeals Banner Component
const DailyDealsBanner = () => {
  return (
    <motion.div 
      className="rounded-xl shadow-lg cursor-pointer relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <div className="p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Meesho DailyDeals</h3>
        <p className="text-blue-100 mb-4 text-sm">Exclusive Program for Extra Orders</p>
        <button className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors cursor-pointer">
          Participate Now
        </button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-2 right-2 w-16 h-16 bg-white opacity-10 rounded-full"></div>
      <div className="absolute bottom-2 left-2 w-12 h-12 bg-white opacity-10 rounded-full"></div>
    </motion.div>
  );
};

// Animated Useful Links Component (no animation, YouTube icon)
const AnimatedUsefulLinks = () => {
  return (
    <div className="rounded-xl p-4 shadow cursor-pointer relative overflow-hidden bg-white">
      <h4 className="font-bold mb-2 text-gray-700 cursor-pointer relative z-10">Useful Links</h4>
      <p className="text-gray-700 mb-4 text-sm relative z-10">
        Learn to operate and grow your business on meesho.
      </p>
      <ul className="space-y-3 relative z-10">
        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors text-gray-700">
          <span className="text-red-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.228 3.5 12 3.5 12 3.5s-7.228 0-9.386.566A2.994 2.994 0 0 0 .502 6.186C0 8.344 0 12 0 12s0 3.656.502 5.814a2.994 2.994 0 0 0 2.112 2.12C4.772 20.5 12 20.5 12 20.5s7.228 0 9.386-.566a2.994 2.994 0 0 0 2.112-2.12C24 15.656 24 12 24 12s0-3.656-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </span>
          <span className="text-sm">Supplier Hub on Meesho app</span>
          <span className="ml-auto">→</span>
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors text-gray-700">
          <span className="text-blue-500">🏷️</span>
          <span className="text-sm">Pricing & Commission</span>
          <span className="ml-auto">→</span>
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors text-gray-700">
          <span className="text-green-500">%</span>
          <span className="text-sm">Delivery & Returns</span>
          <span className="ml-auto">→</span>
        </li>
      </ul>
    </div>
  );
};

// Animated Announcements Component (no animation)
const AnimatedAnnouncements = () => {
  return (
    <div className="rounded-xl p-4 shadow cursor-pointer relative overflow-hidden bg-white">
      <h4 className="font-bold mb-2 text-gray-700 cursor-pointer relative z-10">Important Announcements</h4>
      <ul className="space-y-3 relative z-10">
        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors text-gray-700">
          <span className="text-blue-500">📄</span>
          <span className="text-sm">Important Announcement | Meesho Maha Indian...</span>
          <span className="ml-auto">→</span>
        </li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors text-gray-700">
          <span className="text-blue-500">📄</span>
          <span className="text-sm">Important Announcement | Meesho Maha Indian...</span>
          <span className="ml-auto">→</span>
        </li>
      </ul>
    </div>
  );
};

// Business Insights Details (to be used inside Business Insights section)
const BusinessInsightsDetails = () => (
  <div className="w-full bg-white rounded-xl shadow p-4 flex flex-wrap justify-between items-center gap-6 mt-6">
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold text-blue-700">39,416</span>
      <span className="text-xs text-gray-500">Views (3 Mar)</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold text-blue-700">14</span>
      <span className="text-xs text-gray-500">Orders (3 Mar)</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold text-blue-700">412</span>
      <span className="text-xs text-gray-500">In Stock Listings</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold text-green-600">₹57,194.24</span>
      <span className="text-xs text-gray-500">Outstanding Payments</span>
    </div>
  </div>
);

// Update SummaryCard to accept icon prop and render it
const SummaryCard = ({ icon, label, count, color }) => (
  <motion.div 
    className={`rounded-xl shadow p-6 flex flex-col items-center ${color} border-2 cursor-pointer`}
    style={{
      borderColor: color.includes('yellow') ? '#92400e' : 
                   color.includes('blue') ? '#1e40af' : 
                   color.includes('red') ? '#991b1b' : 
                   color.includes('orange') ? '#ea580c' : '#000000'
    }}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    whileHover={{ 
      scale: 1.05,
      y: -5,
      transition: { duration: 0.2 }
    }}
  >
    {icon && <div className="mb-2">{icon}</div>}
    <motion.span 
      className="text-3xl font-bold mb-2 cursor-pointer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.2,
        type: "spring",
        stiffness: 200
      }}
    >
      {count}
    </motion.span>
    <span className="font-medium cursor-pointer">{label}</span>
  </motion.div>
);

// Update BannerFilm to accept 'large' prop and loop seamlessly
const BannerFilm = ({ large }) => {
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const [flowOffset, setFlowOffset] = useState(0);
  const [pausedOffset, setPausedOffset] = useState(0);

  // Banner images array
  const bannerImages = [
    '/banner.jpg',
    '/meesho-banner2.jpg',
    '/meesho-banner3.jpg',
    '/meesho-banner4.jpeg',
    '/meesho-banner3.webp',
    '/meesho-banner4.webp',
    '/meesho-Imp.webp'
  ];

  // Calculate total width for seamless looping
  const bannerWidth = 280 + 4; // maxWidth + padding*2
  const totalBanners = bannerImages.length * 3;
  const totalWidth = bannerWidth * totalBanners;

  useEffect(() => {
    let animationId;
    let startTime = Date.now();
    let pausedTime = 0;
    let lastOffset = 0;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const baseSpeed = 0.2; // Slow flow speed
      let newOffset;
      if (isHovering) {
        setFlowOffset(pausedOffset);
        pausedTime = elapsed;
        lastOffset = pausedOffset;
      } else {
        const adjustedElapsed = elapsed - pausedTime;
        newOffset = lastOffset - (adjustedElapsed * baseSpeed);
        // Loop seamlessly
        if (Math.abs(newOffset) > totalWidth / 3) {
          // Reset offset to 0 for seamless loop
          startTime = Date.now();
          pausedTime = 0;
          lastOffset = 0;
          setFlowOffset(0);
        } else {
          setFlowOffset(newOffset);
        }
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isHovering, pausedOffset, totalWidth]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    setPausedOffset(flowOffset);
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full ${large ? 'max-w-7xl h-64' : 'max-w-6xl h-48'} overflow-hidden rounded-xl shadow-2xl cursor-pointer`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ background: 'white' }}
    >
      {/* Flowing Banner Strip */}
      <div 
        className="relative w-full h-full flex items-center"
        style={{ transform: `translateX(${flowOffset}px)` }}
      >
        {[...bannerImages, ...bannerImages, ...bannerImages].map((banner, index) => (
          <div
            key={`${banner}-${index}`}
            className="flex-shrink-0 mx-2"
            style={{ height: '90%', maxWidth: '280px', padding: '2px' }}
          >
            <img
              src={banner}
              alt={`Banner ${(index % bannerImages.length) + 1}`}
              className="w-full h-full object-cover"
              style={{ borderRadius: '8px' }}
            />
          </div>
        ))}
      </div>
      {/* Floating elements with reduced bounce */}
      <motion.div
        className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full opacity-80 cursor-pointer"
        animate={{ y: [0, -8, 0], x: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400 rounded-full opacity-80 cursor-pointer"
        animate={{ y: [0, 6, 0], x: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </motion.div>
  );
};

export default Home; 