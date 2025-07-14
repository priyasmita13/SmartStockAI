"use client";

import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/mockData';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('all');

  const allProducts = products;
  const outOfStockProducts = products.filter(product => product.stock === 0);
  const lowStockProducts = products.filter(product => product.stock > 0 && product.stock < 5);

  const getTabData = () => {
    switch (activeTab) {
      case 'outOfStock':
        return outOfStockProducts;
      case 'lowStock':
        return lowStockProducts;
      default:
        return allProducts;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Stock ({allProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('outOfStock')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'outOfStock'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Out of Stock ({outOfStockProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('lowStock')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'lowStock'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Low Stock ({lowStockProducts.length})
          </button>
        </nav>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {getTabData().length > 0 ? (
          getTabData().map((product) => (
            <ProductCard key={product.catalogId} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No products found in this category
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory; 