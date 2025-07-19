"use client";

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedHeader from '../components/AnimatedHeader.jsx';
import ProductCard from '../components/ProductCard';
import { products } from '../data/mockData';

const Inventory = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <AnimatedHeader text="Inventory" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {products.map((product, idx) => (
          <motion.div
            key={product.catalogId}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-2xl transition cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
          >
            <ProductCard product={product} index={idx} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Inventory; 