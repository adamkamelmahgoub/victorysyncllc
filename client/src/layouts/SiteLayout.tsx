
import React from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/footer';

interface SiteLayoutProps {
  children: React.ReactNode;
  onCartClick?: () => void;
  showCart?: boolean;
}

export function SiteLayout({ children, onCartClick, showCart = true }: SiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartClick={onCartClick} showCart={showCart} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
