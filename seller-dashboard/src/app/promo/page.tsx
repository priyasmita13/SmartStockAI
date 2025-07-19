"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

const Promo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-4 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Promotional Campaigns</h1>
          <p className="text-gray-600">Discover exciting promotional opportunities and boost your sales</p>
        </motion.div>

        {/* Promo Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* First Promo Card */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative">
              <img 
                src="/meesho-banner2.jpg" 
                alt="Meesho Promotional Banner 1" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">Premium Campaign</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Summer Collection Launch</h3>
              <p className="text-gray-600 mb-4">
                Showcase your summer collection with our premium promotional campaign. 
                Reach millions of customers and boost your sales with targeted advertising.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>High Reach</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Targeted</span>
                  </div>
                </div>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </motion.div>

          {/* Second Promo Card */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative">
              <img 
                src="/meesho-banner3.jpg" 
                alt="Meesho Promotional Banner 2" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                New
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">Special Offer</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Festival Season Sale</h3>
              <p className="text-gray-600 mb-4">
                Make the most of the festival season with our exclusive promotional package. 
                Special discounts and enhanced visibility for your products during peak shopping times.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Peak Season</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>High Traffic</span>
                  </div>
                </div>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Info Section */}
        <motion.div 
          className="mt-12 bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Why Choose Our Promotional Campaigns?</h2>
            <p className="text-gray-600">Maximize your reach and boost sales with our proven promotional strategies</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Increased Visibility</h3>
              <p className="text-gray-600">Get your products in front of millions of potential customers</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Targeted Audience</h3>
              <p className="text-gray-600">Reach the right customers who are most likely to buy your products</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Proven Results</h3>
              <p className="text-gray-600">Join thousands of sellers who have successfully grown their business</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Promo; 