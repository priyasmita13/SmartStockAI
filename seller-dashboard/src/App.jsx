import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const App = ({ children }) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">{children}</main>
    </div>
  </div>
);

export default App; 