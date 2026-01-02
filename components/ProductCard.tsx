// components/ProductCard.tsx
'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  original_price?: number;
  image: string;
  image2?: string;
  description?: string;
  additionalInfo?: string;
  additional_info?: string;
  sizes?: string[];
  images?: string[];
  category?: string;
  slug?: string;
  status?: string;
  discount_type?: string;
  discount_value?: number;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid-4' | 'grid-5' | 'list';
  onQuickView?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  showHoverIcons?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  viewMode = 'grid-4',
  onQuickView,
  onAddToWishlist,
  onAddToCart,
  showHoverIcons = true 
}) => {
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Load wishlist from localStorage
  const loadWishlist = () => {
    if (typeof window === 'undefined') return [];
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  };

  // Save wishlist to localStorage
  const saveWishlist = (wishlist: any[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  // Check if product is in wishlist
  const checkWishlistStatus = () => {
    const wishlist = loadWishlist();
    const exists = wishlist.some((item: any) => item.id === product.id);
    setIsInWishlist(exists);
  };

  useEffect(() => {
    checkWishlistStatus();
    
    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      checkWishlistStatus();
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, [product.id]);

  const handleProductClick = () => {
    router.push(`/product/${product.id}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const wishlist = loadWishlist();
    const existingIndex = wishlist.findIndex((item: any) => item.id === product.id);

    if (existingIndex > -1) {
      // Remove from wishlist
      wishlist.splice(existingIndex, 1);
      saveWishlist(wishlist);
      setIsInWishlist(false);
    } else {
      // Add to wishlist
      const wishlistItem = {
        id: product.id,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price || 0,
        product_image: product.image,
        created_at: new Date().toISOString()
      };
      wishlist.push(wishlistItem);
      saveWishlist(wishlist);
      setIsInWishlist(true);
    }

    // Call the optional callback if provided
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      handleProductClick();
    }
  };

  // LIST VIEW LAYOUT - Simple version with title, price, description only
  if (viewMode === 'list') {
    return (
      <div 
        className="flex gap-6 bg-white p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={handleProductClick}
      >
        {/* Product Image */}
        <div className="shrink-0 w-55 h-70 relative  overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details - Only Title, Price, Description */}
        <div className="flex-1 py-2">
          <h3 
            className="font-semibold text-gray-900 mb-3 uppercase text-sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {product.name}
          </h3>
          
          <div className="flex items-center gap-3 mb-4">
            <span 
              className="text-sm font-semibold text-gray-500"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              ${product.price.toFixed(2)}
            </span>
          </div>

          {(product.description || product.additionalInfo || product.additional_info) && (
            <p className="text-gray-600 text-xs leading-relaxed">
              {product.description || product.additionalInfo || product.additional_info}
            </p>
          )}
        </div>
      </div>
    );
  }

  // GRID VIEW LAYOUT (Original)
  return (
    <div className="group cursor-pointer">
      {/* Product Image */}
      <div 
        className="relative bg-gray-100 mb-3 sm:mb-4 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        onClick={handleProductClick}
      >
        <div className="aspect-3/4 relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-2" 
          />
        </div>
        
        {/* Icons overlay */}
        {showHoverIcons && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Add to Wishlist */}
            <div className="flex items-center gap-1 sm:gap-2 group/icon justify-end">
              <span className="hidden lg:block text-xs sm:text-sm font-medium text-white bg-black/50 z-50 px-2 sm:px-3 py-1 rounded-md opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
                {isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              </span>
              <button 
                onClick={handleWishlistClick}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-md shrink-0 ${
                  isInWishlist 
                    ? 'bg-red-500 group-hover/icon:bg-red-600' 
                    : 'bg-gray-200 group-hover/icon:bg-white'
                }`}
              >
                <svg 
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                    isInWishlist 
                      ? 'text-white' 
                      : 'text-gray-400 group-hover/icon:text-gray-700'
                  }`}
                  fill={isInWishlist ? "currentColor" : "none"}
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Quick View */}
            {onQuickView && (
              <div className="flex items-center gap-1 sm:gap-2 group/icon justify-end">
                <span className="hidden lg:block text-xs sm:text-sm font-medium text-white bg-black/80 z-50 px-2 sm:px-3 py-1 rounded-md opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
                  Quick view
                </span>
                <button 
                  onClick={handleQuickViewClick}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center group-hover/icon:bg-white transition-all shadow-md shrink-0"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover/icon:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            )}

            {/* Add to Cart / Select Options */}
            <div className="flex items-center gap-1 sm:gap-2 group/icon justify-end">
              <span className="hidden lg:block text-xs sm:text-sm font-medium text-white bg-black/80 z-50 px-2 sm:px-3 py-1 rounded-md opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
                Select options
              </span>
              <button 
                onClick={handleCartClick}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center group-hover/icon:bg-white transition-all shadow-md shrink-0"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover/icon:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="text-left px-1">
        <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-1 sm:mb-2 uppercase tracking-wide line-clamp-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {(product.originalPrice || product.original_price) && (
            <span className="text-gray-400 line-through text-xs sm:text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              ${(product.originalPrice || product.original_price)?.toFixed(2)}
            </span>
          )}
          <span className="text-gray-900 font-medium text-sm sm:text-base" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;