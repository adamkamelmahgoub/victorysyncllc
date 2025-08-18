
import { ReactNode } from 'react';
import Navigation from '../navigation';
import Footer from '../footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation onCartClick={() => {}} cartItemCount={0} />
      {children}
      <Footer />
    </div>
  );
}
