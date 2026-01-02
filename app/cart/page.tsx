'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  selectedSize?: string;
  quantity: number;
}

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCouponOpen, setIsCouponOpen] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const loadCart = () => {
      if (typeof window === 'undefined') return;
      const cart = localStorage.getItem('cart');
      if (cart) {
        setCartItems(JSON.parse(cart));
      }
    };
    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  const saveCart = (cart: CartItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const updateQuantity = (id: number, size: string | undefined, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item => 
      item.id === id && item.selectedSize === size 
        ? { ...item, quantity: newQuantity } 
        : item
    );
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const removeItem = (id: number, size: string | undefined) => {
    const updatedCart = cartItems.filter(
      item => !(item.id === id && item.selectedSize === size)
    );
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Title */}
      <div className="text-center py-10">
        <h1 className="text-5xl font-medium text-gray-900">Cart</h1>
      </div>

      <div className="max-w-350 mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Cart Items */}
          <div className="flex-1">
            {/* Table Header */}
            <div className="grid grid-cols-2 pb-5 border-b border-gray-200 mb-8">
              <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                PRODUCT
              </div>
              <div className="text-xs uppercase tracking-wide text-gray-500 font-medium text-right">
                TOTAL
              </div>
            </div>

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-6">Your cart is empty</p>
                <Link href="/shop">
                  <button className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            ) : (
              <div>
                {cartItems.map((item) => {
                  // Create unique key for items with same id but different sizes
                  const itemKey = `${item.id}-${item.selectedSize || 'no-size'}`;
                  
                  return (
                    <div key={itemKey} className="pb-8 mb-8 border-b border-gray-100">
                      <div className="grid grid-cols-2 gap-8">
                        {/* Product Info */}
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <div className="w-24 h-24 shrink-0 rounded-sm overflow-hidden bg-gray-100">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <h3 className="text-[15px] text-gray-900 mb-2 leading-tight">
                              {item.name}
                            </h3>
                            <p className="text-[15px] text-gray-900 mb-2">
                              ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            {item.selectedSize && (
                              <p className="text-[13px] text-gray-600 mb-6">
                                size: {item.selectedSize}
                              </p>
                            )}

                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 w-fit mb-4">
                              <button
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                −
                              </button>
                              <div className="w-12 h-10 flex items-center justify-center border-x border-gray-300 text-gray-900 text-sm">
                                {item.quantity}
                              </div>
                              <button
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg"
                              >
                                +
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item.id, item.selectedSize)}
                              className="text-[13px] text-gray-600 underline hover:text-gray-900 transition-colors"
                            >
                              Remove item
                            </button>
                          </div>
                        </div>

                        {/* Total Price */}
                        <div className="text-right">
                          <p className="text-[15px] text-gray-900">
                            ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column - Cart Totals */}
          <div className="w-full lg:w-112.5">
            <div className="border-t border-r border-l border-gray-900 bg-white">
              {/* Cart Totals Header */}
              <div className="px-8 py-6 border-b border-gray-200">
                <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                  CART TOTALS
                </h2>
              </div>

              <div className="px-8 py-6">
                {/* Coupon Section */}
                <div className="mb-6">
                  <button
                    onClick={() => setIsCouponOpen(prev => !prev)}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className="text-[15px] text-gray-600">Add coupons</span>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      {isCouponOpen ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 15l-7-7-7 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 9l7 7 7-7"
                        />
                      )}
                    </svg>
                  </button>         
                  
                  {isCouponOpen && (
                    <div className="mt-4 animate-slideDown">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter code"
                          className="flex-1 px-4 py-3 border border-gray-300 text-[14px] text-gray-700 focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
                        />
                        <button className="px-8 bg-black text-white text-[14px] font-medium hover:bg-gray-800 transition-colors">
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                  <span className="text-[15px] text-gray-600">Free shipping</span>
                  <span className="text-[14px] font-semibold text-gray-900 uppercase tracking-wide">FREE</span>
                </div>

                {/* Estimated Total */}
                <div className="flex items-center justify-between py-5 border-t border-gray-200">
                  <span className="text-[16px] text-gray-700 font-medium">Estimated total</span>
                  <span className="text-[22px] font-medium text-gray-900">
                    ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Checkout Button */}
            <Link href={'/checkout'}>
              <button 
                className="w-full bg-black text-white py-4 mt-6 text-[15px] font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ShoppingCart;