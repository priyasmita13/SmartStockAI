"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, Bot, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const AddCatalogue = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      // Here you would typically upload to your backend
      console.log('Image uploaded:', selectedImage.name);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
        setSelectedImage(null);
        setImagePreview(null);
      }, 3000);
    }, 2000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const openSmartStockAI = () => {
    // This would typically trigger the SmartStock AI modal
    // For now, we'll just log it
    console.log('Opening SmartStock AI');
    // You can implement this by dispatching a custom event or using a global state
    window.dispatchEvent(new CustomEvent('openSmartStockAI'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Add Catalogue</h1>
          <p className="text-gray-600">Upload product images and enhance your catalogue</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image size={32} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Upload Product Image</h2>
              <p className="text-gray-600">Select a high-quality image of your product</p>
            </div>

            {/* Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                selectedImage 
                  ? 'border-purple-400 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
              }`}
              onClick={triggerFileInput}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              
              <AnimatePresence mode="wait">
                {!imagePreview ? (
                  <motion.div
                    key="upload-prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">Click to upload image</p>
                      <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="image-preview"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="space-y-4"
                  >
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full h-48 object-contain rounded-lg mx-auto"
                    />
                    <p className="text-sm text-gray-600">{selectedImage?.name}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Upload Button */}
            {selectedImage && !uploadSuccess && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-6 bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </div>
                ) : (
                  'Upload Image'
                )}
              </motion.button>
            )}

            {/* Success Message */}
            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-semibold">Image uploaded successfully!</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Features Section */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot size={32} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">AI-Powered Features</h2>
              <p className="text-gray-600">Enhance your product listings with AI assistance</p>
            </div>

            <div className="space-y-6">
              {/* Image Refining */}
              <motion.div 
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Image Refining</h3>
                <p className="text-gray-600 mb-3">
                  Automatically enhance your product images with AI-powered editing tools. 
                  Improve lighting, remove backgrounds, and optimize for better presentation.
                </p>
                <button 
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
                  onClick={openSmartStockAI}
                >
                  Try with SmartStock AI
                  <Bot size={16} />
                </button>
              </motion.div>

              {/* SEO Assistance */}
              <motion.div 
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">SEO Assistance</h3>
                <p className="text-gray-600 mb-3">
                  Get AI-generated product titles, descriptions, and keywords optimized for search engines. 
                  Improve your product visibility and reach more customers.
                </p>
                <button 
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  onClick={openSmartStockAI}
                >
                  Get SEO help with SmartStock AI
                  <Bot size={16} />
                </button>
              </motion.div>

              {/* Product Details */}
              <motion.div 
                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Add Product Details</h3>
                <p className="text-gray-600 mb-3">
                  Let AI help you create comprehensive product descriptions, specifications, 
                  and pricing recommendations based on market analysis.
                </p>
                <button 
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium transition-colors"
                  onClick={openSmartStockAI}
                >
                  Generate details with SmartStock AI
                  <Bot size={16} />
                </button>
              </motion.div>
            </div>

            {/* SmartStock AI Link */}
            <motion.div 
              className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-xl font-bold mb-2">Need More AI Assistance?</h3>
              <p className="text-purple-100 mb-4">
                Access advanced AI features for inventory management, sales forecasting, and business insights.
              </p>
              <button 
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                onClick={openSmartStockAI}
              >
                <Bot size={20} />
                Open SmartStock AI
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddCatalogue; 