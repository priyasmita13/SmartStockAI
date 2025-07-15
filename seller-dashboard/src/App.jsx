import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import WelcomePopup from './components/WelcomePopup';
import LanguageModal from './components/LanguageModal';
import { useTranslation } from 'react-i18next';
import { user } from './data/mockData';

const App = () => {
  const { i18n } = useTranslation();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem('lang');
    if (!lang) {
      setShowLangModal(true);
    } else {
      i18n.changeLanguage(lang);
    }
  }, [i18n]);

  const handleLanguageSelect = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    setShowLangModal(false);
  };

  return (
    <>
      <LanguageModal open={showLangModal} onSelect={handleLanguageSelect} />
      <Sidebar />
      <WelcomePopup open={showWelcome} onClose={() => setShowWelcome(false)} user={user} />
    </>
  );
};

export default App; 