import React from 'react';
import Link from 'next/link';

const AppRoutes = () => (
  <nav className="flex flex-col gap-2">
    <Link href="/pages/Home">Home</Link>
    <Link href="/pages/Orders">Orders</Link>
    <Link href="/pages/Returns">Returns</Link>
    <Link href="/pages/Advertisements">Advertisements</Link>
    <Link href="/pages/Inventory">Inventory</Link>
  </nav>
);

export default AppRoutes; 