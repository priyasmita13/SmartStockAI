"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Package, Undo2, Megaphone, CreditCard, Boxes, Upload, Percent, Image, Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ aiOpen, setAiOpen, onToggle }) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) {
      onToggle(newState);
    }
  }, [isCollapsed, onToggle]);

  // Notify parent on initial load
  useEffect(() => {
    if (onToggle) {
      onToggle(isCollapsed);
    }
  }, [isCollapsed, onToggle]);

  const sidebarWidth = useMemo(() => isCollapsed ? 'w-16' : 'w-64', [isCollapsed]);
  const sidebarPadding = useMemo(() => isCollapsed ? 'px-2' : 'px-4', [isCollapsed]);

  return (
    <motion.aside 
      className={`flex flex-col justify-between h-screen bg-black border-r border-gray-800 fixed left-0 top-0 z-20 ${sidebarWidth}`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic-bezier for smooth ease
      }}
    >
      <div className={`${sidebarPadding} py-4`}>
        <motion.button 
          className="flex items-center justify-center mb-8 gap-3 cursor-pointer w-full group"
          onClick={toggleSidebar}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 0.1, 
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          whileTap={{ 
            scale: 0.95,
            transition: { duration: 0.1, ease: "easeIn" }
          }}
        >
          <motion.img 
            src="/girl.png" 
            alt="Girl" 
            className="w-10 h-10 rounded-full bg-white cursor-pointer shadow-lg"
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.h2 
                key="title"
                className="text-2xl font-bold text-left cursor-pointer whitespace-nowrap" 
                style={{ color: '#FFB6D9', fontFamily: 'Canva Sans, sans-serif', fontWeight: 'bold' }}
                initial={{ opacity: 0, width: 0, x: -20 }}
                animate={{ opacity: 1, width: 'auto', x: 0 }}
                exit={{ opacity: 0, width: 0, x: -20 }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                Roshni Mishra
              </motion.h2>
            )}
          </AnimatePresence>
        </motion.button>
        <nav className="flex flex-col gap-2">
          <SidebarButton icon={<Home />} label={t('Home')} href="/" active={pathname === '/'} isCollapsed={isCollapsed} />
          <SidebarButton icon={<Package />} label={t('Orders')} href="/orders" active={pathname === '/orders'} isCollapsed={isCollapsed} />
          <SidebarButton icon={<Undo2 />} label={t('Returns')} href="/returns" active={pathname === '/returns'} isCollapsed={isCollapsed} />
          <SidebarButton icon={<Megaphone />} label={t('Advertisements')} href="/advertisements" active={pathname === '/advertisements'} isCollapsed={isCollapsed} />
          <SidebarButton icon={<CreditCard />} label={t('Payments')} href="/payments" active={pathname === '/payments'} isCollapsed={isCollapsed} />
          <SidebarButton icon={<Boxes />} label={t('Inventory')} href="/inventory" active={pathname === '/inventory'} isCollapsed={isCollapsed} />
          <SidebarButton icon={<Upload />} label={t('Add Catalogue')} href="/add-catalogue" active={pathname === '/add-catalogue'} isCollapsed={isCollapsed} />
          <SidebarButton icon={<Percent />} label={t('Promo')} href="/promo" active={pathname === '/promo'} isCollapsed={isCollapsed} />
        </nav>
        <AnimatePresence mode="wait">
          {!aiOpen ? (
            <motion.button
              key="open-ai"
              className={`px-4 py-2 bg-[#580A46] text-white rounded-lg hover:bg-[#580A46] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer w-full mt-2`}
              onClick={() => setAiOpen(true)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1, ease: "easeIn" }
              }}
              transition={{ 
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <motion.img 
                src="/AI.jpeg" 
                alt="AI Logo" 
                className="w-7 h-7 rounded-full bg-white cursor-pointer"
                animate={{ 
                  scale: [1, 1.1, 1],
                  y: [0, -2, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span 
                    key="ai-text"
                    className="cursor-pointer whitespace-nowrap"
                    initial={{ opacity: 0, width: 0, x: -10 }}
                    animate={{ opacity: 1, width: 'auto', x: 0 }}
                    exit={{ opacity: 0, width: 0, x: -10 }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    {t('Open SmartStock AI')}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ) : (
            <motion.button
              key="close-ai"
              className={`px-4 py-2 bg-[#580A46] text-white rounded-lg hover:bg-[#580A46] transition disabled:opacity-50 flex items-center justify-center cursor-pointer w-full mt-2`}
              onClick={() => setAiOpen(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1, ease: "easeIn" }
              }}
              transition={{ 
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span 
                    key="close-text"
                    className="cursor-pointer whitespace-nowrap"
                    initial={{ opacity: 0, width: 0, x: -10 }}
                    animate={{ opacity: 1, width: 'auto', x: 0 }}
                    exit={{ opacity: 0, width: 0, x: -10 }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    {t('Close SmartStock AI')}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

const SidebarButton = React.memo(({ icon, label, href, active, disabled, onClick, isCollapsed }) => {
  const Component = disabled ? 'button' : Link;
  const props = disabled ? {} : { href };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ 
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={disabled ? {} : { 
        x: isCollapsed ? 0 : 5,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <Component
        {...props}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition relative overflow-hidden
          ${active ? 'bg-[#580A46] text-white font-semibold cursor-pointer' : 'hover:bg-gray-800 text-white cursor-pointer'}
          ${disabled ? 'opacity-50 cursor-not-allowed text-gray-600 hover:bg-transparent' : ''}
          ${isCollapsed ? 'justify-center px-2' : ''}`}
        disabled={disabled}
        onClick={disabled ? undefined : onClick}
        title={isCollapsed ? label : undefined}
      >
        {active && !disabled && (
          <motion.div
            className="absolute inset-0 bg-[#580A46]"
            layoutId="activeTab"
            initial={false}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              mass: 0.8
            }}
          />
        )}
        <motion.div
          className={`relative z-10 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          whileHover={disabled ? {} : { 
            scale: 1.1,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {icon}
        </motion.div>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.span 
              key="label"
              className={`relative z-10 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} whitespace-nowrap`}
              initial={{ opacity: 0, width: 0, x: -10 }}
              animate={{ opacity: 1, width: 'auto', x: 0 }}
              exit={{ opacity: 0, width: 0, x: -10 }}
              transition={{ 
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </Component>
    </motion.div>
  );
});

SidebarButton.displayName = 'SidebarButton';

export default Sidebar;