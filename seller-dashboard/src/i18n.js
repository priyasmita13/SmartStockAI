import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Seller Dashboard': 'Seller Dashboard',
      'Open SmartStock AI': 'Open SmartStock AI',
      'Close SmartStock AI': 'Close SmartStock AI',
      'Home': 'Home',
      'Orders': 'Orders',
      'Returns': 'Returns',
      'Advertisements': 'Advertisements',
      'Payments': 'Payments',
      'Inventory': 'Inventory',
      'Add Catalogue': 'Add Catalogue',
      'Promo': 'Promo',
      'Catalog Uploads': 'Catalog Uploads',
      'Promotions': 'Promotions',
      'Image Upload': 'Image Upload',
      'List another product': 'List another product',
      'Finish': 'Finish',
      'Welcome back, {{name}}': 'Welcome back, {{name}}',
      'Hope you have a productive day managing your store 🚀': 'Hope you have a productive day managing your store 🚀',
      'Seller': 'Seller',
      'Seller User': 'Seller User',
      'Your Monthly Restock Plan': 'Your Monthly Restock Plan',
      'Inventory Health': 'Inventory Health',
      'Sales Report': 'Sales Report',
      'Generate a weekly or monthly report': 'Generate a weekly or monthly report',
      'Product listing assistance': 'Product listing assistance',
      'Forecast Product Demand': 'Forecast Product Demand',
      'Make More Profit': 'Make More Profit',
      'SmartStock AI Chat': 'SmartStock AI Chat',
      'Select a prompt to get started.': 'Select a prompt to get started.',
      'SmartStock AI is thinking...': 'SmartStock AI is thinking...',
      'Upload': 'Upload',
      'Enter product name': 'Enter product name',
      'Enter product category': 'Enter product category',
      'Enter product price': 'Enter product price',
      'Submit': 'Submit',
      'Out of Stock': 'Out of Stock',
      'Low Stock': 'Low Stock',
      'In Stock': 'In Stock',
      'Stock': 'Stock',
      'ID': 'ID',
      'units': 'units',
      'Pending': 'Pending',
      'Delivered': 'Delivered',
      'Date': 'Date',
      // Add more keys as needed
    }
  },
  hi: {
    translation: {
      'Seller Dashboard': 'सेलर डैशबोर्ड',
      'Open SmartStock AI': 'स्मार्टस्टॉक एआई खोलें',
      'Close SmartStock AI': 'स्मार्टस्टॉक एआई बंद करें',
      'Home': 'होम',
      'Orders': 'ऑर्डर',
      'Returns': 'रिटर्न',
      'Advertisements': 'विज्ञापन',
      'Payments': 'भुगतान',
      'Inventory': 'इन्वेंटरी',
      'Add Catalogue': 'कैटलॉग जोड़ें',
      'Promo': 'प्रोमो',
      'Catalog Uploads': 'कैटलॉग अपलोड',
      'Promotions': 'प्रमोशन',
      'Image Upload': 'इमेज अपलोड',
      'List another product': 'एक और उत्पाद सूचीबद्ध करें',
      'Finish': 'समाप्त',
      'Welcome back, {{name}}': 'वापसी पर स्वागत है, {{name}}',
      'Hope you have a productive day managing your store 🚀': 'आशा है कि आपका दिन उत्पादक हो! 🚀',
      'Seller': 'विक्रेता',
      'Seller User': 'विक्रेता उपयोगकर्ता',
      'Your Monthly Restock Plan': 'मासिक रिस्टॉक योजना',
      'Inventory Health': 'इन्वेंटरी स्वास्थ्य',
      'Sales Report': 'बिक्री रिपोर्ट',
      'Generate a weekly or monthly report': 'साप्ताहिक या मासिक रिपोर्ट बनाएं',
      'Product listing assistance': 'उत्पाद सूची सहायता',
      'Forecast Product Demand': 'उत्पाद मांग का पूर्वानुमान',
      'Make More Profit': 'अधिक लाभ कमाएँ',
      'SmartStock AI Chat': 'स्मार्टस्टॉक एआई चैट',
      'Select a prompt to get started.': 'शुरू करने के लिए एक प्रॉम्प्ट चुनें।',
      'SmartStock AI is thinking...': 'स्मार्टस्टॉक एआई सोच रहा है...',
      'Upload': 'अपलोड करें',
      'Enter product name': 'उत्पाद का नाम दर्ज करें',
      'Enter product category': 'उत्पाद श्रेणी दर्ज करें',
      'Enter product price': 'उत्पाद मूल्य दर्ज करें',
      'Submit': 'सबमिट करें',
      'Out of Stock': 'स्टॉक समाप्त',
      'Low Stock': 'कम स्टॉक',
      'In Stock': 'स्टॉक में',
      'Stock': 'स्टॉक',
      'ID': 'आईडी',
      'units': 'यूनिट',
      'Pending': 'लंबित',
      'Delivered': 'डिलीवर किया गया',
      'Date': 'तारीख',
      // Add more keys as needed
    }
  },
  bn: {
    translation: {
      'Seller Dashboard': 'বিক্রেতা ড্যাশবোর্ড',
      'Open SmartStock AI': 'স্মার্টস্টক এআই খুলুন',
      'Close SmartStock AI': 'স্মার্টস্টক এআই বন্ধ করুন',
      'Home': 'হোম',
      'Orders': 'অর্ডার',
      'Returns': 'রিটার্ন',
      'Advertisements': 'বিজ্ঞাপন',
      'Payments': 'পেমেন্ট',
      'Inventory': 'ইনভেন্টরি',
      'Add Catalogue': 'ক্যাটালগ যোগ করুন',
      'Promo': 'প্রমো',
      'Catalog Uploads': 'ক্যাটালগ আপলোড',
      'Promotions': 'প্রমোশন',
      'Image Upload': 'ইমেজ আপলোড',
      'List another product': 'আরেকটি পণ্য তালিকাভুক্ত করুন',
      'Finish': 'শেষ',
      'Welcome back, {{name}}': 'ফিরে আসার জন্য স্বাগতম, {{name}}',
      'Hope you have a productive day managing your store 🚀': 'আশা করি আপনার দিনটি ফলপ্রসূ হবে! 🚀',
      'Seller': 'বিক্রেতা',
      'Seller User': 'বিক্রেতা ব্যবহারকারী',
      'Your Monthly Restock Plan': 'আপনার মাসিক রিস্টক পরিকল্পনা',
      'Inventory Health': 'ইনভেন্টরি স্বাস্থ্য',
      'Sales Report': 'বিক্রয় প্রতিবেদন',
      'Generate a weekly or monthly report': 'সাপ্তাহিক বা মাসিক প্রতিবেদন তৈরি করুন',
      'Product listing assistance': 'পণ্য তালিকা সহায়তা',
      'Forecast Product Demand': 'পণ্যের চাহিদার পূর্বাভাস',
      'Make More Profit': 'আরও বেশি লাভ করুন',
      'SmartStock AI Chat': 'স্মার্টস্টক এআই চ্যাট',
      'Select a prompt to get started.': 'শুরু করতে একটি প্রম্পট নির্বাচন করুন।',
      'SmartStock AI is thinking...': 'স্মার্টস্টক এআই ভাবছে...',
      'Upload': 'আপলোড',
      'Enter product name': 'পণ্যের নাম লিখুন',
      'Enter product category': 'পণ্যের ক্যাটাগরি লিখুন',
      'Enter product price': 'পণ্যের মূল্য লিখুন',
      'Submit': 'জমা দিন',
      'Out of Stock': 'স্টক শেষ',
      'Low Stock': 'কম স্টক',
      'In Stock': 'স্টকে আছে',
      'Stock': 'স্টক',
      'ID': 'আইডি',
      'units': 'ইউনিট',
      'Pending': 'বিচারাধীন',
      'Delivered': 'ডেলিভারড',
      'Date': 'তারিখ',
      // Add more keys as needed
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 