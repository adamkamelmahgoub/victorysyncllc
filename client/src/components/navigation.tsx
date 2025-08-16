import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import CartModal from './cart-modal';
import SmartLink from './SmartLink';
import NavButton from './NavButton';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const { getItemCount } = useCart();
  const cartItemCount = getItemCount();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <SmartLink to="/" className="flex items-center space-x-2" onClick={scrollToTop}>
            <img src="/LOGO_VS.png" alt="VictorySync" className="h-8 w-8" />
            <span className="text-xl font-bold text-black">VictorySync</span>
          </SmartLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `text-gray-700 hover:text-purple-600 transition-colors ${isActive ? 'text-purple-600 font-medium' : ''}`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `text-gray-700 hover:text-purple-600 transition-colors ${isActive ? 'text-purple-600 font-medium' : ''}`
              }
            >
              Pricing
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-gray-700 hover:text-purple-600 transition-colors ${isActive ? 'text-purple-600 font-medium' : ''}`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-gray-700 hover:text-purple-600 transition-colors ${isActive ? 'text-purple-600 font-medium' : ''}`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <NavButton onClick={() => setIsCartModalOpen(true)} className="relative p-2 victory-gray hover:victory-purple transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-victory-purple text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </NavButton>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <SmartLink to="/dashboard" className="flex items-center w-full">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </SmartLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <SmartLink to="/signin" className="btn btn-md btn-secondary">Sign In</SmartLink>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <NavButton onClick={() => setIsCartModalOpen(true)} className="relative p-2 victory-gray hover:victory-purple transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-victory-purple text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </NavButton>
            <Button variant="ghost" onClick={toggleMobileMenu} className="p-2 victory-gray hover:victory-purple transition-colors">
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="flex flex-col space-y-2 p-4">
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `text-gray-700 hover:text-purple-600 transition-colors py-2 ${isActive ? 'text-purple-600 font-medium' : ''}`
                }
                onClick={closeMobileMenu}
              >
                Services
              </NavLink>
              <NavLink
                to="/pricing"
                className={({ isActive }) =>
                  `text-gray-700 hover:text-purple-600 transition-colors py-2 ${isActive ? 'text-purple-600 font-medium' : ''}`
                }
                onClick={closeMobileMenu}
              >
                Pricing
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-gray-700 hover:text-purple-600 transition-colors py-2 ${isActive ? 'text-purple-600 font-medium' : ''}`
                }
                onClick={closeMobileMenu}
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-gray-700 hover:text-purple-600 transition-colors py-2 ${isActive ? 'text-purple-600 font-medium' : ''}`
                }
                onClick={closeMobileMenu}
              >
                Contact
              </NavLink>

              <div className="border-t pt-4 space-y-2">
                {user ? (
                  <>
                    <SmartLink
                      to="/dashboard"
                      className="block text-gray-700 hover:text-purple-600 transition-colors py-2"
                      onClick={closeMobileMenu}
                    >
                      Dashboard
                    </SmartLink>
                    <Button variant="ghost" onClick={logout} className="w-full justify-start">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <SmartLink to="/signin" className="btn btn-md btn-secondary w-full justify-start" onClick={closeMobileMenu}>Sign In</SmartLink>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      <CartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
    </nav>
  );
}