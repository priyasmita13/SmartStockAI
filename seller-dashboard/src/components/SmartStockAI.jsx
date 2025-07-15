"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Home, Package, Undo2, Megaphone, CreditCard, Boxes, Upload, Percent, Image, Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_BASE = API_BASE.replace(/\/api$/, '');

const SidebarButton = ({ icon, label, href, active, disabled, onClick }) => {
  const Component = disabled ? 'button' : Link;
  const props = disabled ? { onClick } : { href };
  return (
    <Component
      {...props}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition text-gray-300 w-full
        ${active ? 'bg-[#4A148C] text-white font-semibold' : 'hover:bg-gray-800 text-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed text-gray-600' : ''}`}
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
    </Component>
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
    <div className="fixed inset-0 z-50 flex">
      {/* Sidebar (Task Pane) */}
      <aside className="flex flex-col justify-between h-full w-64 bg-black border-r border-gray-800 p-4">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center text-[#4A148C]">Seller Dashboard</h2>
          <nav className="flex flex-col gap-2">
            <SidebarButton icon={<Home />} label="Home" href="/" />
            <SidebarButton icon={<Package />} label="Orders" href="/orders" />
            <SidebarButton icon={<Undo2 />} label="Returns" href="/returns" />
            <SidebarButton icon={<Megaphone />} label="Advertisements" href="/advertisements" />
            <SidebarButton icon={<CreditCard />} label="Payments" href="/payments" />
            <SidebarButton icon={<Boxes />} label="Inventory" href="/inventory" />
            <SidebarButton icon={<Upload />} label="Catalog Uploads" href="#" disabled />
            <SidebarButton icon={<Percent />} label="Promotions" href="#" disabled />
            <SidebarButton icon={<Image />} label="Image Upload" href="#" disabled />
          </nav>
        </div>
        <div className="mb-2">
          <button
            className="flex items-center gap-2 w-full px-4 py-2 bg-[#4A148C] text-white rounded-lg hover:bg-[#6A1B9A] transition disabled:opacity-50"
            onClick={onClose}
          >
            <Bot size={20} />
            Close SmartStock AI
          </button>
        </div>
      </aside>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto py-8 px-4 h-full">
          <h3 className="text-3xl font-bold mb-6 text-purple-700 text-center">{t('SmartStock AI Chat')}</h3>
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {PROMPTS.map((prompt) => (
              <button
                key={prompt.label}
                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg font-medium transition disabled:opacity-50"
                onClick={() => handlePromptClick(prompt)}
                disabled={loading}
              >
                {prompt.label}
              </button>
            ))}
          </div>
          <div className="flex-1 w-full overflow-y-auto bg-white dark:bg-gray-800 rounded-lg p-6 shadow min-h-[300px] max-h-[60vh]">
            {chat.length === 0 && <div className="text-gray-400 text-center">{t('Select a prompt to get started.')}</div>}
            {chat.map((entry, idx) => (
              <div key={idx} className="mb-8">
                {entry.prompt && <div className="font-semibold text-purple-700 mb-1">You: {entry.prompt}</div>}
                <div className="whitespace-pre-line text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 rounded p-4 shadow">
                  {entry.response || (loading && idx === chat.length - 1 ? 'Thinking...' : '')}
                </div>
                {entry.pdfUrl && (
                  <a
                    href={getPdfLink(entry.pdfUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    download
                  >
                    Download PDF Report
                  </a>
                )}
              </div>
            ))}
            {loading && <div className="text-center text-purple-700 font-medium">{t('SmartStock AI is thinking...')}</div>}
            {/* Product Listing Assistance Input Fields */}
            {productListingStep && productListingStep !== 'done' && !loading && !listingDone && (
              <form className="mt-4 flex gap-2 items-center" onSubmit={handleProductListingSubmit}>
                {productListingStep === 'image' && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={e => setFileValue(e.target.files[0])}
                      className="block border rounded px-2 py-1"
                    />
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">{t('Upload')}</button>
                  </>
                )}
                {productListingStep === 'name' && (
                  <>
                    <input
                      type="text"
                      placeholder={t('Enter product name')}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      className="block border rounded px-2 py-1"
                      required
                    />
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">{t('Submit')}</button>
                  </>
                )}
                {productListingStep === 'category' && (
                  <>
                    <input
                      type="text"
                      placeholder={t('Enter product category')}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      className="block border rounded px-2 py-1"
                      required
                    />
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">{t('Submit')}</button>
                  </>
                )}
                {productListingStep === 'price' && (
                  <>
                    <input
                      type="number"
                      placeholder={t('Enter product price')}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      className="block border rounded px-2 py-1"
                      required
                    />
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">{t('Submit')}</button>
                  </>
                )}
              </form>
            )}
            {/* After done, show Yes/No options */}
            {productListingStep === 'done' && !loading && !inputValue && (
              <div className="mt-4 flex gap-4">
                <button onClick={handleListAnother} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">{t('List another product')}</button>
                <button onClick={handleFinish} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 transition">{t('Finish')}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartStockAI; 