'use client';

import React, { useEffect, useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  sizes?: string[];
}

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage
  const loadCart = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  };

  // Save cart to localStorage
  const saveCart = (cart: CartItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  // Load cart when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setCartItems(loadCart());
    }
  }, [isOpen]);

  // Update quantity
  const onUpdateQuantity = (id: number, size: string | undefined, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item => {
      if (item.id === id && item.selectedSize === size) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  // Remove item from cart
  const onRemoveItem = (id: number, size: string | undefined) => {
    const updatedCart = cartItems.filter(
      item => !(item.id === id && item.selectedSize === size)
    );

    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-stone-300/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Cart Sidebar - slides from right */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-115 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 bg-[#f0f0f0]">
          <h2 className="text-lg font-normal text-[#4a4a4a]">
            Cart {cartItems.length > 0 && <span className="text-[#999999]">{cartItems.length}</span>}
          </h2>
          <div className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors flex items-center justify-center cursor-pointer">
            <button
              onClick={onClose}
              aria-label="Close cart"
            >
              <X size={22} color="#666666" />
            </button>
          </div>
        </div>

        {/* Cart Content */}
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <div className="w-16 h-16 mb-6 flex items-center justify-center bg-[#f0f0f0] rounded-full">
              <ShoppingCart size={30} strokeWidth={2} />
            </div>
            <p className="text-[#888888] text-sm text-center">
              No products in the cart.
            </p>
            <Link href='/shop'>
              <button
                onClick={onClose}
                className="w-full py-3 mt-10 px-6 border-2 border-[#2b2b2b] text-[#2b2b2b] hover:bg-[#2b2b2b] hover:text-white transition-all duration-200 text-sm font-normal"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          // Cart Items
          <div className="flex-1 overflow-y-auto px-7 py-6">
            {cartItems.map((item) => {
              // Create unique key for items with same id but different sizes
              const itemKey = `${item.id}-${item.selectedSize || 'no-size'}`;
              
              return (
                <div key={itemKey} className="flex gap-4 mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                  {/* Product Image */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-24 h-24 object-cover shrink-0"
                  />
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-normal text-gray-900 pr-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <button 
                        onClick={() => onRemoveItem(item.id, item.selectedSize)}
                        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    
                    {/* Size if available */}
                    {item.selectedSize && (
                      <p className="text-xs text-gray-500 mb-2">
                        Size: {item.selectedSize}
                      </p>
                    )}
                    
                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center border-x border-gray-300 text-sm text-gray-700">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Item Total Price */}
                      <span className="text-sm font-normal text-gray-700">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer with Buttons */}
        <div className="px-7 pb-6 border-t border-gray-200 pt-6">
          {/* Subtotal - only show when cart has items */}
          {cartItems.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-normal text-gray-700">Subtotal:</span>
              <span className="text-lg font-normal text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
          )}
          
          {/* Buttons */}
          <div className="space-y-2">
            <Link href='/cart'>
              <button
                onClick={onClose}
                className="w-full py-3.5 px-6 border-2 mb-6 border-[#2b2b2b] text-[#2b2b2b] hover:bg-[#2b2b2b] hover:text-white transition-all duration-200 text-sm font-normal"
              >
                View Cart
              </button>
            </Link>
            
            {cartItems.length > 0 && (
              <Link href='/checkout'>
                <button
                  onClick={onClose}
                  className="w-full py-3.5 px-6 bg-[#2b2b2b] text-white hover:bg-black transition-all duration-200 text-sm font-normal"
                >
                  Checkout
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;