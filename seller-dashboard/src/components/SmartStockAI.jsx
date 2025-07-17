"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Package, Undo2, Megaphone, CreditCard, Boxes, Upload, Percent, Image, Bot, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_BASE = API_BASE.replace(/\/api$/, '');

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
    { label: t('Your Monthly Restock Plan'), value: 'restock plan' },
    { label: t('Inventory Health'), value: 'inventory health' },
    { label: t('Sales Report'), value: 'sales report' },
    { label: t('Generate a weekly or monthly report'), value: 'generate a weekly or monthly report' },
    { label: t('Product listing assistance'), value: 'product listing assistance' },
    { label: t('Forecast Product Demand'), value: 'forecast product demand' },
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

  if (!open) return null;

  const handlePromptClick = async (promptObj) => {
    setLoading(true);
    setChat((prev) => [...prev, { prompt: promptObj.label, response: null, pdfUrl: null }]);
    try {
      const res = await fetch(`${API_BASE}/chatbot/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptObj.value, lang: i18n.language }),
      });
      const data = await res.json();
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
      const res = await fetch(`${API_BASE}/chatbot/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, lang: i18n.language }),
      });
      const data = await res.json();
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
    return `${BACKEND_BASE}${pdfUrl}`;
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.6
      }}
      style={{ background: '#DDA0DD' }}
    >
      {/* Chat Area - Full Screen */}
      <motion.div 
        className="flex flex-col h-full w-full"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Header with Close Button */}
        <motion.div 
          className="flex items-center justify-between p-6 bg-[#580A46] shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h3 
            className="text-2xl font-bold text-white cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t('SmartStock AI Assistant')}
          </motion.h3>
          
          <motion.button
            className="flex items-center gap-2 px-6 py-3 bg-white text-[#580A46] rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            onClick={onClose}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </motion.button>
        </motion.div>

        <div className="flex flex-col items-center w-full max-w-4xl mx-auto py-8 px-4 h-full overflow-y-auto">
          <motion.div 
            className="flex flex-wrap gap-3 mb-8 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {PROMPTS.map((prompt, index) => (
              <motion.button
                key={prompt.label}
                className="px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg font-medium transition disabled:opacity-50 cursor-pointer"
                onClick={() => handlePromptClick(prompt)}
                disabled={loading}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {prompt.label}
              </motion.button>
            ))}
          </motion.div>
          <motion.div 
            className="flex-1 w-full overflow-y-auto bg-white dark:bg-gray-800 rounded-lg p-8 shadow min-h-[400px] max-h-[70vh]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {chat.length === 0 && (
              <motion.div 
                className="text-gray-400 text-center text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {t('Select a prompt to get started.')}
              </motion.div>
            )}
            <AnimatePresence>
              {chat.map((entry, idx) => (
                <motion.div 
                  key={idx} 
                  className="mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {entry.prompt && (
                    <motion.div 
                      className="font-semibold text-purple-700 mb-2 text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      You: {entry.prompt}
                    </motion.div>
                  )}
                  <motion.div 
                    className="whitespace-pre-line text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 rounded p-6 shadow text-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {entry.response ? (
                      <TypingAnimation text={entry.response} speed={30} />
                    ) : (
                      loading && idx === chat.length - 1 ? (
                        <motion.div className="flex items-center gap-2">
                          <motion.div
                            className="w-3 h-3 bg-purple-600 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-3 h-3 bg-purple-600 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-3 h-3 bg-purple-600 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          />
                          <span className="text-lg">Thinking...</span>
                        </motion.div>
                      ) : ''
                    )}
                  </motion.div>
                  {entry.pdfUrl && (
                    <motion.a
                      href={getPdfLink(entry.pdfUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer"
                      download
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Download PDF Report
                    </motion.a>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div 
                className="text-center text-purple-700 font-medium text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {t('SmartStock AI is thinking...')}
              </motion.div>
            )}
            {/* Product Listing Assistance Input Fields */}
            <AnimatePresence>
              {productListingStep && productListingStep !== 'done' && !loading && !listingDone && (
                <motion.form 
                  className="mt-6 flex gap-3 items-center" 
                  onSubmit={handleProductListingSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {productListingStep === 'image' && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={e => setFileValue(e.target.files[0])}
                        className="block border rounded px-3 py-2 cursor-pointer"
                      />
                      <motion.button 
                        type="submit" 
                        className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t('Upload')}
                      </motion.button>
                    </>
                  )}
                  {productListingStep === 'name' && (
                    <>
                      <input
                        type="text"
                        placeholder={t('Enter product name')}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        className="block border rounded px-3 py-2 cursor-pointer"
                        required
                      />
                      <motion.button 
                        type="submit" 
                        className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t('Submit')}
                      </motion.button>
                    </>
                  )}
                  {productListingStep === 'category' && (
                    <>
                      <input
                        type="text"
                        placeholder={t('Enter product category')}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        className="block border rounded px-3 py-2 cursor-pointer"
                        required
                      />
                      <motion.button 
                        type="submit" 
                        className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t('Submit')}
                      </motion.button>
                    </>
                  )}
                  {productListingStep === 'price' && (
                    <>
                      <input
                        type="number"
                        placeholder={t('Enter product price')}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        className="block border rounded px-3 py-2 cursor-pointer"
                        required
                      />
                      <motion.button 
                        type="submit" 
                        className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t('Submit')}
                      </motion.button>
                    </>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
            {/* After done, show Yes/No options */}
            <AnimatePresence>
              {productListingStep === 'done' && !loading && !inputValue && (
                <motion.div 
                  className="mt-6 flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <motion.button 
                    onClick={handleListAnother} 
                    className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('List another product')}
                  </motion.button>
                  <motion.button 
                    onClick={handleFinish} 
                    className="px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-600 transition cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('Finish')}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SmartStockAI; 