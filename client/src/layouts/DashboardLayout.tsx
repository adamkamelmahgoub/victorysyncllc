
import React from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {sidebar && (
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {sidebar}
              </div>
            </div>
          )}
          <div className={sidebar ? "lg:col-span-3" : "lg:col-span-4"}>
            {children}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
