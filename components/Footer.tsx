'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribe:', email);
  };

  return (
    <footer className="w-full bg-black text-white py-8 md:py-16">
      <div className="mx-auto px-6 md:px-8">
        {/* Top border line */}
        <div className="border-t border-white mb-8 md:mb-16"></div>

        {/* Newsletter Section */}
        <div className="max-w-xs md:max-w-2xl mx-auto text-center mb-8 md:mb-12">
          <h2 className="text-[11px] md:text-sm tracking-wider md:tracking-widest uppercase mb-6 md:mb-8 font-normal leading-relaxed px-4">
            DON'T BE A DONUT. SIGN UP TO THE NEWSLETTER. DISCOUNTS, REMINDERS, ALL THE REST.
          </h2>
          
          <div className="space-y-3 md:space-y-4">
            <input
              type="email"
              placeholder="your@email.address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 md:py-4 bg-white text-black text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleSubscribe}
              className="w-full px-4 py-3 md:py-4 bg-yellow-400 text-white font-bold text-sm tracking-widest hover:bg-yellow-500 transition-colors uppercase"
            >
              SUBSCRIBE
            </button>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center items-center gap-8 md:gap-6 mb-8 md:mb-10">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={22} strokeWidth={1.5} className="md:w-6 md:h-6" />
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Pinterest"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="md:w-6 md:h-6"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12c0-2.5 2-4.5 4.5-4.5S17 9.5 17 12c0 2.5-1 4-2.5 4-1 0-1.5-.5-1.5-1.5 0-.8.5-1.5 1-2.5" />
              <path d="M12 15.5c-.5 1-1 2.5-1 3.5" />
            </svg>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="YouTube"
          >
            <Youtube size={22} strokeWidth={1.5} className="md:w-6 md:h-6" />
          </a>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-6 md:mb-8 text-[11px] md:text-xs px-4">
          <Link
            href="/terms-conditions"
            className="hover:text-gray-300 transition-colors whitespace-nowrap"
          >
            Terms And Conditions
          </Link>
          <Link
            href="/privacy-policy"
            className="hover:text-gray-300 transition-colors whitespace-nowrap"
          >
            Privacy Policy
          </Link>
          <Link
            href="/contact"
            className="hover:text-gray-300 transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/about"
            className="hover:text-gray-300 transition-colors"
          >
            About
          </Link>
        </div>

        {/* Payment Icons */}
        <div className="flex justify-center items-center mb-6 md:mb-8">
          <div className="px-2 py-1">
            <Image
              src="/amex.png"
              alt="Amex"
              width={30}
              height={10}
              className="w-auto"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-[10px] md:text-xs text-gray-400">
          <p>
            © <span className="font-semibold">SATOSHI NAKAMOTO</span>, Operations, LLC.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;