"use client";

import React from 'react';
import { Megaphone, Plus, Eye, Calendar } from 'lucide-react';
import { ads } from '../data/mockData';

const Advertisements = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Advertisements</h1>
        <button className="flex items-center gap-2 px-4 py-2" style={{ background: '#8E4585', color: 'white', borderRadius: '0.5rem' }}>
          <Plus size={20} />
          Create New Ad
        </button>
      </div>

      {ads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
                <img 
                  src={ad.image} 
                  alt={ad.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzVIMzAwVjEyNUgxMDBWNzVaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg==';
                  }}
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  Active
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{ad.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>1.2k views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Ends: 2024-07-20</span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition">
                    Pause
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Megaphone size={64} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No advertisements yet</h3>
          <p className="text-gray-500 mb-4">Create your first advertisement to reach more customers</p>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            Create Your First Ad
          </button>
        </div>
      )}
    </div>
  );
};

export default Advertisements; 