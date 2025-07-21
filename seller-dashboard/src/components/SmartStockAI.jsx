"use client";
import '../i18n';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Package, Undo2, Megaphone, CreditCard, Boxes, Upload, Percent, Image, Bot, ArrowLeft, UserCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiPost } from '../api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '') : 'http://localhost:5000';

const SidebarButton = ({ icon, label, href, active, disabled, onClick }) => {
  const Component = disabled ? 'button' : Link;
  const props = disabled ? { onClick } : { href };
  return (
    <motion.div
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      <Component
        {...props}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition text-gray-300 w-full
          ${active ? 'bg-[#580A46] text-white font-semibold' : 'hover:bg-gray-800 text-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed text-gray-600' : ''}`}
        disabled={disabled}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
        <span>{label}</span>
      </Component>
    </motion.div>
  );
};

// Typing animation component
const TypingAnimation = ({ text, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-purple-600 ml-1"
        />
      )}
    </motion.span>
  );
};

const SmartStockAI = ({ open, onClose }) => {
  const { t, i18n } = useTranslation();
  const PROMPTS = [
    { label: t('Inventory Health'), value: 'inventory health' },
    { label: t('Sales Report'), value: 'sales report' },
    { label: t('Generate a weekly or monthly report'), value: 'generate a weekly or monthly report' },
    { label: t('Your Monthly Restock Plan'), value: 'restock plan' },
    { label: t('Product listing assistance'), value: 'product listing assistance' },
    { label: t('Forecast Product Demand'), value: 'forecast product demand' },
    { label: t('Make More Profit'), value: 'make more profit' },
  ];
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]); // { prompt, response, pdfUrl }
  const [inputValue, setInputValue] = useState('');
  const [fileValue, setFileValue] = useState(null);
  const fileInputRef = useRef(null);
  const [listingDone, setListingDone] = useState(false);

  // Helper to determine the current product listing step based on the last non-empty response
  const getProductListingStep = () => {
    if (chat.length === 0) return null;
    // Find the last chat entry with a non-empty response
    let last = null;
    for (let i = chat.length - 1; i >= 0; i--) {
      if (chat[i].response && chat[i].response.trim() !== '') {
        last = chat[i];
        break;
      }
    }
    if (!last) return null;
    const resp = (last.response || '').toLowerCase();
    if (resp.includes('upload an image')) return 'image';
    if (resp.includes('what is the product name')) return 'name';
    if (resp.includes('what is the product category')) return 'category';
    if (resp.includes('what is the price of the product')) return 'price';
    if (resp.includes('this product has been listed')) return 'done';
    return null;
  };

  const productListingStep = getProductListingStep();

  // useEffect to set listingDone when product listing is done
  useEffect(() => {
    if (productListingStep === 'done') setListingDone(true);
    else setListingDone(false);
  }, [productListingStep]);

  // Hide page scrollbar when modal is open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  if (!open) return null;

  const handlePromptClick = async (promptObj) => {
    setLoading(true);
    setChat((prev) => [...prev, { prompt: promptObj.label, response: null, pdfUrl: null }]);
    try {
      const data = await apiPost('/api/chatbot/query', { message: promptObj.value, lang: i18n.language });
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          prompt: promptObj.label,
          response: data.response || 'No response',
          pdfUrl: data.pdf_url || null,
        };
        return updated;
      });
    } catch (err) {
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          prompt: promptObj.label,
          response: 'Error contacting SmartStock AI. Please try again.',
          pdfUrl: null,
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler for product listing input submit
  const handleProductListingSubmit = async (e) => {
    e.preventDefault();
    const step = getProductListingStep();
    let message = '';
    if (step === 'image') {
      if (fileValue) {
        message = fileValue.name;
      } else {
        message = 'uploaded';
      }
    } else if (step === 'name') {
      message = `Name: ${inputValue}`;
    } else if (step === 'category') {
      message = `Category: ${inputValue}`;
    } else if (step === 'price') {
      message = `Price: ${inputValue}`;
    }
    setInputValue('');
    setFileValue(null);
    setLoading(true);
    setChat((prev) => [...prev, { prompt: '', response: null, pdfUrl: null }]);
    try {
      const data = await apiPost('/api/chatbot/query', { message, lang: i18n.language });
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          prompt: '',
          response: data.response || 'No response',
          pdfUrl: data.pdf_url || null,
        };
        return updated;
      });
    } catch (err) {
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          prompt: '',
          response: 'Error contacting SmartStock AI. Please try again.',
          pdfUrl: null,
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  // When the product listing is done, show Yes/No options
  const handleListAnother = () => {
    setListingDone(false);
    setChat((prev) => [...prev, { prompt: 'Product listing assistance', response: null, pdfUrl: null }]);
    handlePromptClick({ label: 'Product listing assistance', value: 'product listing assistance' });
  };
  const handleFinish = () => {
    setListingDone(true);
  };

  const getPdfLink = (pdfUrl) => {
    if (!pdfUrl) return null;
    if (pdfUrl.startsWith('http')) return pdfUrl;
    // Use the same env var as api.js for consistency
    const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL
      ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api$/, '')
      : 'http://localhost:5000';
    return `${backendBase}${pdfUrl}`;
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center min-h-screen min-w-full bg-gradient-to-br from-purple-200 via-pink-100 to-purple-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{ background: 'linear-gradient(135deg, #DDA0DD 0%, #F3E6F5 100%)' }}
    >
      {/* Language Selector - fixed to top left of viewport, visually matching close button */}
      <div className="fixed top-6 left-8 z-[1001] flex items-center gap-2 bg-gray-900/95 dark:bg-gray-900 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-2 backdrop-blur-md" style={{ minWidth: '120px' }}>
        <label htmlFor="language-select" className="text-sm font-medium text-gray-100 dark:text-gray-200 mr-1">Lang:</label>
        <select
          id="language-select"
          value={i18n.language}
          onChange={e => i18n.changeLanguage(e.target.value)}
          className="border-none outline-none bg-transparent text-gray-100 dark:text-gray-100 text-sm cursor-pointer"
          style={{ background: '#18181b', color: '#f3f4f6' }}
        >
          <option value="en" style={{ background: '#18181b', color: '#f3f4f6' }}>EN</option>
          <option value="hi" style={{ background: '#18181b', color: '#f3f4f6' }}>हिन्दी</option>
          <option value="bn" style={{ background: '#18181b', color: '#f3f4f6' }}>বাংলা</option>
        </select>
      </div>
      {/* Close Button - fixed to top right of viewport, outside modal container */}
      <div className="fixed top-6 right-8 z-[1001] group">
        <button
          onClick={onClose}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white/90 hover:bg-red-100 text-red-700 shadow-lg border border-red-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
          aria-label="Close SmartStock AI"
        >
          <X size={26} />
        </button>
        <span className="absolute right-0 top-12 scale-0 group-hover:scale-100 transition-all bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg z-50 whitespace-nowrap">Close SmartStock AI</span>
      </div>
      <div className="relative flex flex-col items-center w-full max-w-6xl mx-auto p-0 sm:p-8 bg-gradient-to-br from-purple-900 via-pink-700 to-purple-400 bg-[length:200%_200%] bg-no-repeat rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700"
        style={{ boxShadow: '0 8px 32px 0 rgba(88,10,70,0.18)' }}>
        {/* Header */}
        <div className="w-full text-center mt-10 mb-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-purple-400 drop-shadow-lg tracking-tight">SmartStock AI</h1>
          <p className="text-base text-gray-100 dark:text-gray-200 mt-1">Your AI-powered business assistant</p>
        </div>
        {/* Prompt Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 mb-8 w-full px-4 md:px-16">
          {PROMPTS.map((prompt, index) => (
            <button
              key={prompt.label}
              className="px-4 py-3 rounded-2xl font-semibold text-base shadow-xl border border-white/30 bg-white/20 backdrop-blur-md text-white hover:bg-white/30 hover:text-purple-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 relative overflow-hidden group"
              style={{ minHeight: '56px', WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}
              onClick={() => handlePromptClick(prompt)}
              disabled={loading}
            >
              <span className="relative z-10">{prompt.label}</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-200/40 via-pink-200/40 to-purple-400/40 rounded-2xl" />
            </button>
          ))}
        </div>
        {/* Chat Area */}
        <div className="relative w-full max-w-5xl bg-white/95 dark:bg-gray-900 rounded-2xl shadow p-6 mb-4 min-h-[200px] max-h-[340px] overflow-y-auto border border-gray-100 dark:border-gray-700 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100 dark:scrollbar-thumb-purple-700 dark:scrollbar-track-gray-800">
          {/* User Avatar/Icon */}
          <div className="absolute top-4 right-4 flex items-center">
            <UserCircle size={32} className="text-purple-400 bg-white dark:bg-gray-800 rounded-full shadow" />
          </div>
          {/* Chat Content */}
          <div className="flex flex-col w-full">
            {chat.length === 0 && (
              <div className="text-gray-400 text-center text-base mt-8">Select a prompt to get started.</div>
            )}
            <AnimatePresence>
              {chat.map((entry, idx) => (
                <motion.div
                  key={idx}
                  className="mb-6"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {entry.prompt && (
                    <div className="font-semibold text-purple-700 dark:text-purple-300 mb-1 text-base">You: {entry.prompt}</div>
                  )}
                  <div className="whitespace-pre-line text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm text-base">
                    {entry.response ? (
                      <TypingAnimation text={entry.response} speed={30} />
                    ) : (
                      loading && idx === chat.length - 1 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                          <span className="text-base">Thinking...</span>
                        </div>
                      ) : ''
                    )}
                  </div>
                  {entry.pdfUrl && (
                    <a
                      href={getPdfLink(entry.pdfUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer text-sm"
                      download
                    >
                      Download PDF Report
                    </a>
                  )}
                  {entry.response && entry.response.includes('Want more suggestions?') && idx === chat.length - 1 && (
                    <button
                      className="mt-3 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg font-medium transition cursor-pointer text-sm"
                      onClick={() => handlePromptClick({ label: 'More suggestions', value: 'make more profit' })}
                      disabled={loading}
                    >
                      More suggestions
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && chat.length === 0 && (
              <div className="text-center text-purple-700 font-medium text-base mt-4">SmartStock AI is thinking...</div>
            )}
            {/* Product Listing Assistance Input Fields */}
            <AnimatePresence>
              {productListingStep && productListingStep !== 'done' && !loading && !listingDone && (
                <motion.form
                  className="mt-4 flex gap-2 items-center"
                  onSubmit={handleProductListingSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {productListingStep === 'image' && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={e => setFileValue(e.target.files[0])}
                        className="block border rounded px-2 py-1 cursor-pointer text-sm"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer text-sm"
                      >
                        {t('Upload')}
                      </button>
                    </>
                  )}
                  {productListingStep === 'name' && (
                    <>
                      <input
                        type="text"
                        placeholder={t('Enter product name')}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        className="block border rounded px-2 py-1 cursor-pointer text-sm"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer text-sm"
                      >
                        {t('Submit')}
                      </button>
                    </>
                  )}
                  {productListingStep === 'category' && (
                    <>
                      <input
                        type="text"
                        placeholder={t('Enter product category')}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        className="block border rounded px-2 py-1 cursor-pointer text-sm"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer text-sm"
                      >
                        {t('Submit')}
                      </button>
                    </>
                  )}
                  {productListingStep === 'price' && (
                    <>
                      <input
                        type="number"
                        placeholder={t('Enter product price')}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        className="block border rounded px-2 py-1 cursor-pointer text-sm"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer text-sm"
                      >
                        {t('Submit')}
                      </button>
                    </>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
            {/* After done, show Yes/No options */}
            <AnimatePresence>
              {productListingStep === 'done' && !loading && !inputValue && (
                <motion.div
                  className="mt-4 flex gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <button
                    onClick={handleListAnother}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer text-sm"
                  >
                    {t('List another product')}
                  </button>
                  <button
                    onClick={handleFinish}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 transition cursor-pointer text-sm"
                  >
                    {t('Finish')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SmartStockAI; 