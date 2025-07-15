import React from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
];

const LanguageModal = ({ open, onSelect }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-xs w-full text-center relative">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Select Language</h2>
        <div className="flex flex-col gap-4">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg font-medium transition"
              onClick={() => onSelect(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageModal; 