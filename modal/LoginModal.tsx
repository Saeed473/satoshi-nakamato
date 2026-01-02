'use client';

import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import HoverCloseButton from '@/components/HoverCloseButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted');
  };

  return (
   <div className="fixed inset-0 bg-stone-100/50 z-9999 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl w-full max-w-md relative animate-fadeIn">
        {/* Close Button */}
          <div className="absolute top-3 sm:top-4 sm:right-6 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors flex items-center justify-center">
            <HoverCloseButton 
              onClick={onClose}
              size={22}
              color="#666666"
            />
          </div>

        {/* Modal Content */}
        <div className="p-8 md:p-12">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900 text-center mb-8">
            Login
          </h2>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username/Email Field */}
            <div>
              <input
                type="text"
                placeholder="Username or email address *"
                className="w-full px-4 py-3 text-sm border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password *"
                className="w-full px-4 py-3 text-sm border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? (
                  <EyeOff size={20} strokeWidth={1.5} />
                ) : (
                  <Eye size={20} strokeWidth={1.5} />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border border-gray-300 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                Lost your password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 transition-colors text-sm font-normal"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;