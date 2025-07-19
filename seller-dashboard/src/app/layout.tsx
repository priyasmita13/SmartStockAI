import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Seller Dashboard",
  description: "Meesho Seller Dashboard with SmartStock AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
