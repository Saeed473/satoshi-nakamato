'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductDetailPage from '@/components/ProductDetailPage'; // Adjust path as needed

interface WishlistItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  product_image: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  // Add other product fields you need
}

const Wishlist: React.FC = () => {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  // Load wishlist from localStorage
  const loadWishlist = () => {
    if (typeof window === 'undefined') return [];
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  };

  // Save wishlist to localStorage
  const saveWishlist = (wishlist: WishlistItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  // Fetch wishlist items
  const fetchWishlist = () => {
    setIsLoading(true);
    const items = loadWishlist();
    setWishlistItems(items);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWishlist();

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      fetchWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  // Remove item from wishlist
  const handleRemove = (id: number) => {
    const wishlist = loadWishlist();
    const updatedWishlist = wishlist.filter((item: WishlistItem) => item.id !== id);
    saveWishlist(updatedWishlist);
    setWishlistItems(updatedWishlist);
  };

  // Fetch full product details and open modal
  const handleSelectOptions = async (productId: number) => {
    try {
      // Fetch product details from your API or Supabase
      const response = await fetch(`/api/products/${productId}`);
      const product = await response.json();
      
      setSelectedProduct(product);
      setShowProductDetail(true);
    } catch (error) {
      console.error('Error fetching product:', error);
      // Fallback: Navigate to product page
      router.push(`/product/${productId}`);
    }
  };

  return (
    <>
      <div className="w-full bg-white min-h-screen">
        {/* Title Section */}
        <div className='flex justify-center items-center pt-20 pb-12'>
          <h1 className='text-5xl font-light text-gray-900 tracking-tight'>
            Wishlist
          </h1>
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          
          {/* My wishlist Section */}
          <div className="pb-4">
            <h2 className="text-sm font-normal text-gray-500">
              My wishlist
            </h2>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="border-t border-gray-200 py-16 text-center">
              <p className="text-sm text-gray-400">Loading...</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            /* Empty State */
            <div className="border-t border-gray-200 py-16 text-center">
              <p className="text-sm text-gray-400">
                No products added to the wishlist
              </p>
            </div>
          ) : (
            /* Wishlist Items */
            <div className="border-t border-gray-200">
              {wishlistItems.map((item) => (
                <div 
                  key={`wishlist-${item.id}-${item.created_at}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 py-8 border-b border-gray-200"
                >
                  {/* Remove Button (X icon) */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-gray-400 hover:text-gray-700 transition-colors order-1 sm:order-1"
                    aria-label="Remove from wishlist"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>

                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-40 sm:h-32 bg-gray-50 shrink-0 overflow-hidden order-2 sm:order-2">
                    <img 
                      src={item.product_image} 
                      alt={item.product_name}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => handleSelectOptions(item.product_id)}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.png';
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 order-3 sm:order-3">
                    <h3 
                      className="text-base font-normal text-gray-900 uppercase tracking-wide cursor-pointer hover:text-gray-600 transition-colors"
                      onClick={() => handleSelectOptions(item.product_id)}
                    >
                      {item.product_name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="text-lg font-normal text-gray-900 shrink-0 order-4 sm:order-4">
                    ${item.product_price ? item.product_price.toFixed(2) : '0.00'}
                  </div>

                  {/* Stock Status */}
                  <div className="shrink-0 order-5 sm:order-5">
                    <span className="text-xs text-teal-600 border border-teal-600 px-3 py-1.5 rounded-full font-normal">
                      In Stock
                    </span>
                  </div>

                  {/* Select Options Button */}
                  <button
                    onClick={() => handleSelectOptions(item.product_id)}
                    className="w-full sm:w-auto bg-black text-white px-8 py-3 text-sm font-normal hover:bg-gray-800 transition-colors shrink-0 order-6 sm:order-6"
                  >
                    Select options
                  </button>

                  {/* Remove Text Link */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-sm text-gray-500 hover:text-gray-800 underline shrink-0 order-7 sm:order-7"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Share Section */}
          {wishlistItems.length > 0 && (
            <div className="mt-16 text-center">
              <p className="text-sm text-gray-600 mb-6">Share on:</p>
              <div className="flex justify-center items-center gap-6">
                {/* Social icons remain the same */}
                <button className="text-gray-500 hover:text-gray-900 transition-colors" aria-label="Share on Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                  </svg>
                </button>
                {/* Add other social icons */}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {showProductDetail && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div className="relative bg-white w-full max-w-7xl rounded-lg shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setShowProductDetail(false)}
                className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 bg-white rounded-full p-2 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Product Detail Component */}
              <ProductDetailPage
                product={selectedProduct}
                onClose={() => setShowProductDetail(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Wishlist;