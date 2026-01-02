'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { Heart, User, Search, ShoppingCart, Menu, X } from 'lucide-react';
import LoginModal from '@/modal/LoginModal';
import CartSidebar from './CartSidebar';
import SearchDropdown from './SearchDropdown';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
const [isCartOpen, setIsCartOpen] = useState(false);
const [isSearchbarOpen, setIsSearchbarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    // { name: 'Shop', href: '/shop'},
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'T-Shirt', href: '/t-shirt' },
    { name: 'Hoodie', href: '/hoodie' },
    { name: 'Crewnecks', href: '/crewnecks' },
    { name: 'Jacket', href: '/jacket' },
    { name: 'Sweatpants', href: '/sweatpants' },
    { name: 'Shorts', href: '/shorts' },
    { name: 'Hats', href: '/hats' },
  ];

  return (
    <>
    <header className={`w-full bg-white sticky top-0 z-40 transition-shadow duration-300 ${
      isScrolled ? 'shadow-lg' : 'border-b border-gray-200'
    }`}>
      <div className="max-w-360 mx-auto px-6">
        {/* Top bar with icons and logo */}
        <div className="flex items-center justify-between h-20">
          {/* Left - Menu icon (mobile only) */}
          <div className="flex items-center gap-6">
            <button 
              className="md:hidden text-gray-800 hover:text-gray-900 transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open menu"
            >
              <Menu size={24} strokeWidth={1.6} />
            </button>
            
            {/* Desktop icons */}
            <Link href="/favourite" aria-label="Wishlist">
            <button 
              className="hidden md:block text-gray-800 hover:text-gray-900 transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart size={24} strokeWidth={1.6} />
            </button>
            </Link>
            
          <button 
           onClick={() => setIsLoginModalOpen(true)}
          className="hidden md:block text-gray-800 hover:text-gray-900 transition-colors cursor-pointer"
          aria-label="Account">
        <User size={24} strokeWidth={1.6} />
         </button>

          </div>

          {/* Center logo */}
          <Link href="/" className="shrink-0">
            <div className="text-center">
              <Image
                src="/satoshi-nakamoto.png"       
                alt="Satoshi Logo"
                width={125}           
                height={125}          
                className="mx-auto"
                priority   
              />
            </div>
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-6">
            <button 
            onClick={() => setIsSearchbarOpen(true)}
              className="hidden md:block text-gray-800 hover:text-gray-900 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search size={24} strokeWidth={1.6} />
            </button>
            <button 
             onClick={() => setIsCartOpen(true)}
              className="text-gray-800 hover:text-gray-900 transition-colors cursor-pointer"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={24} strokeWidth={1.6} />
            </button>
          </div>
        </div>

        {/* Desktop Navigation bar - No border */}
        <nav className="hidden md:block">
          <ul className="flex items-center justify-center gap-8">
            {navItems.slice(1).map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="relative text-[#5a5a5a] text-[14px] font-normal transition-colors hover:text-[#282828]
                             after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 
                             after:bg-[#282828] after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-50 md:hidden transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile menu header */}
          <div className="flex items-center justify-start px-6 h-16 border-b border-gray-200">
            <button 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          {/* Search bar */}
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 bg-white"
              />
            </div>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 overflow-y-auto px-6">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between py-3 text-gray-700 hover:text-gray-900 transition-colors text-base border-b border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile menu footer icons */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-around">
                  <Link href="/favourite" aria-label="Wishlist">
              <button 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={24} strokeWidth={1.6} />
              </button>
              </Link>
              <button 
              onClick={() => setIsLoginModalOpen(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Account"
              >
                <User size={24} strokeWidth={1.6} />
              </button>
              
              <button 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Search"
              >
                <Search size={24} strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

     <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}
      />
       <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        /> 
    <SearchDropdown 
    isOpen={isSearchbarOpen} 
    onClose={() => setIsSearchbarOpen(false)}
    />
    </>


  );
};

export default Header;