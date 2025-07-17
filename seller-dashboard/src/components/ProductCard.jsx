"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Boxes, TrendingUp, TrendingDown } from 'lucide-react';

const ProductCard = ({ product, index = 0 }) => {
  const getStockColor = (stock) => {
    if (stock === 0) return 'text-red-600';
    if (stock < 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStockIcon = (stock) => {
    if (stock === 0) return <TrendingDown size={16} />;
    if (stock < 5) return <TrendingDown size={16} />;
    return <TrendingUp size={16} />;
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
        className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <motion.img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain rounded-lg"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSA0MEg3NVY2MEgyNVY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
          }}
        />
      </motion.div>
      <div className="space-y-2">
        <motion.h3 
          className="font-semibold text-gray-900 dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {product.name}
        </motion.h3>
        <motion.div 
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 8, -8, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {getStockIcon(product.stock)}
          </motion.div>
          <span className="cursor-pointer">Stock Level: {product.stock}</span>
        </motion.div>
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer">ID: {product.catalogId}</span>
          <motion.div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStockColor(product.stock)}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={product.stock === 0 ? { 
                scale: [1, 1.2, 1],
                x: [-1, 1, -1]
              } : product.stock < 5 ? {
                scale: [1, 1.1, 1],
                y: [0, -1, 0]
              } : {}}
              transition={{ 
                duration: 1.5,
                repeat: (product.stock === 0 || product.stock < 5) ? Infinity : 0,
                repeatDelay: 1
              }}
            >
              <Boxes size={16} />
            </motion.div>
            <span>{product.stock === 0 ? 'Out of Stock' : product.stock < 5 ? 'Low Stock' : 'In Stock'}</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductCard;