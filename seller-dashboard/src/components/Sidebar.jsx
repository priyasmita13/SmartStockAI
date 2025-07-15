"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Undo2, Megaphone, CreditCard, Boxes, Upload, Percent, Image, Bot } from 'lucide-react';
import SmartStockAI from './SmartStockAI';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="flex flex-col justify-between h-screen w-64 bg-black border-r border-gray-800 p-4 fixed left-0 top-0 z-20">
      <div>
        <h2 className="text-2xl font-bold mb-8 text-center text-[#4A148C]">{t('Seller Dashboard')}</h2>
        <nav className="flex flex-col gap-2">
          <SidebarButton icon={<Home />} label={t('Home')} href="/" active={pathname === '/'} />
          <SidebarButton icon={<Package />} label={t('Orders')} href="/orders" active={pathname === '/orders'} />
          <SidebarButton icon={<Undo2 />} label={t('Returns')} href="/returns" active={pathname === '/returns'} />
          <SidebarButton icon={<Megaphone />} label={t('Advertisements')} href="/advertisements" active={pathname === '/advertisements'} />
          <SidebarButton icon={<CreditCard />} label={t('Payments')} href="/payments" active={pathname === '/payments'} />
          <SidebarButton icon={<Boxes />} label={t('Inventory')} href="/inventory" active={pathname === '/inventory'} />
          <SidebarButton icon={<Upload />} label={t('Catalog Uploads')} href="#" disabled />
          <SidebarButton icon={<Percent />} label={t('Promotions')} href="#" disabled />
          <SidebarButton icon={<Image />} label={t('Image Upload')} href="#" disabled />
        </nav>
      </div>
      <div className="mb-2">
        {!aiOpen ? (
          <button
            className="w-full px-4 py-2 bg-[#4A148C] text-white rounded-lg hover:bg-[#6A1B9A] transition disabled:opacity-50 flex items-center justify-center"
            onClick={() => setAiOpen(true)}
          >
            {t('Open SmartStock AI')}
          </button>
        ) : (
          <button
            className="w-full px-4 py-2 bg-[#4A148C] text-white rounded-lg hover:bg-[#6A1B9A] transition disabled:opacity-50 flex items-center justify-center"
            onClick={() => setAiOpen(false)}
          >
            {t('Close SmartStock AI')}
          </button>
        )}
        {aiOpen && <SmartStockAI open={aiOpen} onClose={() => setAiOpen(false)} />}
      </div>
    </aside>
  );
};

const SidebarButton = ({ icon, label, href, active, disabled }) => {
  const Component = disabled ? 'button' : Link;
  const props = disabled ? {} : { href };

  return (
    <Component
      {...props}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition text-gray-300
        ${active ? 'bg-[#4A148C] text-white font-semibold' : 'hover:bg-gray-800 text-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed text-gray-600' : ''}`}
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
    </Component>
  );
};

export default Sidebar;