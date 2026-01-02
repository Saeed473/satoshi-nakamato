'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import HoverCloseButton from './HoverCloseButton';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  original_price?: number;
  image: string;
  images?: string[];
  category?: string;
  slug?: string;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const categories = [
    'All Categories',
    'T-Shirt',
    'Hoodie',
    'Crewnecks',
    'Jacket',
    'Sweatpants',
    'Shorts',
    'Hats',
  ];

  // Get products from Redux
  const { items: allProducts } = useSelector(
    (state: RootState) => state.products
  );

  // Real-time search filtering
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Debounce search for better performance
    const timeoutId = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      
      const results = allProducts.filter((product: any) => {
        const matchesSearch = product.name?.toLowerCase().includes(query);
        const matchesCategory = 
          selectedCategory === 'All Categories' || 
          product.category?.toLowerCase() === selectedCategory.toLowerCase();
        
        return matchesSearch && matchesCategory;
      }).map((p: any) => ({
        ...p,
        originalPrice: p.original_price ?? p.originalPrice,
        image: Array.isArray(p.images) ? p.images[0] : p.image,
      }));

      setFilteredProducts(results.slice(0, 8)); // Show max 8 results
      setIsSearching(false);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, allProducts]);

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
    onClose();
    setSearchQuery('');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-stone-300/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Search Dropdown - slides from top */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white shadow-md z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 sm:py-16 relative">
          {/* Close Button - Right Corner */}
          <div className="absolute top-6 sm:top-10 right-6 sm:right-12 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors flex items-center justify-center cursor-pointer">
            <HoverCloseButton 
              onClick={onClose}
              size={22}
              color="#666666"
            />
          </div>

          {/* Search Bar Container */}
          <div className="max-w-3xl mx-auto">
            {/* Search Bar with Category Dropdown */}
            <div className="flex items-center gap-0 border-b-2 border-[#666] pb-1">
              {/* Search Icon with Loading Spinner */}
              <div className="pr-3">
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                ) : (
                  <Search size={20} strokeWidth={1.5} className="text-[#b3b3b3]" />
                )}
              </div>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-3 text-[26px] text-gray-600 placeholder-[#b3b3b3] focus:outline-none bg-transparent"
                autoFocus
              />

              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-8 sm:px-6 py-3 text-[13px] text-[#888888] hover:text-[#333333] transition-colors"
                >
                  <span className="whitespace-nowrap">{selectedCategory}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`text-[#888888] transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 shadow-lg z-10 rounded-md">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md ${
                          selectedCategory === category
                            ? 'text-[#333333] bg-gray-50 font-medium'
                            : 'text-[#666666]'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="mt-8 max-h-100 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="group cursor-pointer bg-white hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden border border-gray-100"
                      >
                        <div className="aspect-3/4 relative overflow-hidden bg-gray-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="text-xs font-medium text-gray-800 uppercase tracking-wide line-clamp-2 mb-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {product.originalPrice && (
                              <span className="text-gray-400 line-through text-xs">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                            <span className="text-gray-900 font-semibold text-sm">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                          {product.category && (
                            <span className="inline-block mt-2 text-[10px] text-gray-500 uppercase tracking-wider">
                              {product.category}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Try searching with different keywords or category
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Initial State - No Search */}
            {!searchQuery && (
              <div className="mt-8 text-center py-12">
                <Search size={48} className="text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-gray-500 text-sm">
                  Start typing to search products...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchDropdown;