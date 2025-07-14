"use client";

import React from 'react';
import { Package, Tag, AlertTriangle } from 'lucide-react';

const ProductCard = ({ product }) => {
  const getStockStatus = (stock) => {
    if (stock === 0) {
      return { text: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: <AlertTriangle size={16} /> };
    } else if (stock < 5) {
      return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle size={16} /> };
    } else {
      return { text: 'In Stock', color: 'bg-green-100 text-green-800', icon: <Package size={16} /> };
    }
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSA0MEg3NVY2MEgyNVY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
          }}
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Tag size={16} />
          <span>{product.category}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">ID: {product.catalogId}</span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
            {stockStatus.icon}
            <span>{stockStatus.text}</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Stock: {product.stock} units
        </div>
      </div>
    </div>
  );
};

export default ProductCard;