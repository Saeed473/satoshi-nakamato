'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "@/utils/supabase";

// Product interface
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

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

interface ProductDetailPageProps {
  product: Product;
  onClose: () => void;
  onOpenCart?: () => void; // Callback to open cart sidebar
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onClose, onOpenCart }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeAccordion, setActiveAccordion] = useState<'description' | 'additional' | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
const [isInWishlist, setIsInWishlist] = useState(false);

  // Get all available images
  const allImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image, product.image2].filter(Boolean);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

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
    // Dispatch custom event to notify cart updates
    window.dispatchEvent(new Event('cartUpdated'));
  };

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

  const handleAddToCart = () => {
    // Check if size is required but not selected
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    // Create cart item
    const cartItem: CartItem = {
      ...product,
      quantity: quantity,
      selectedSize: selectedSize || undefined
    };

    // Get existing cart
    const existingCart = loadCart();

    // Check if item already exists (same id and size)
    const existingItemIndex = existingCart.findIndex(
      item => item.id === product.id && item.selectedSize === (selectedSize || undefined)
    );

    let updatedCart: CartItem[];

    if (existingItemIndex > -1) {
      // Item exists, update quantity
      updatedCart = [...existingCart];
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      // New item, add to cart
      updatedCart = [...existingCart, cartItem];
    }

    // Save to localStorage
    saveCart(updatedCart);
 alert('Added to cart');
  router.push('/cart');
    // Open cart sidebar automatically
    if (onOpenCart) {
      onOpenCart();
    }
    
    // Reset quantity and size
    setQuantity(1);
    setSelectedSize('');
  };

  const handleBuyNow = () => {
    // Check if size is required but not selected
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    // Create cart item
    const cartItem: CartItem = {
      ...product,
      quantity: quantity,
      selectedSize: selectedSize || undefined
    };

    // Get existing cart
    const existingCart = loadCart();

    // Check if item already exists (same id and size)
    const existingItemIndex = existingCart.findIndex(
      item => item.id === product.id && item.selectedSize === (selectedSize || undefined)
    );

    let updatedCart: CartItem[];

    if (existingItemIndex > -1) {
      // Item exists, update quantity
      updatedCart = [...existingCart];
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      // New item, add to cart
      updatedCart = [...existingCart, cartItem];
    }

    // Save to localStorage
    saveCart(updatedCart);

    // Navigate to checkout page
    router.push('/checkout');
  };

  const toggleAccordion = (section: 'description' | 'additional') => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };


useEffect(() => {
  checkWishlistStatus();
}, [product.id]);

const handleAddToWishlist = () => {
  const wishlist = loadWishlist();
  const existingIndex = wishlist.findIndex((item: any) => item.id === product.id);

  if (existingIndex > -1) {
    // Remove from wishlist
    wishlist.splice(existingIndex, 1);
    saveWishlist(wishlist);
    setIsInWishlist(false);
    alert('Removed from wishlist');
  } else {
    // Add to wishlist - FIXED VERSION
    const wishlistItem = {
      id: product.id,
      product_id: product.id,
      product_name: product.name,
      product_price: product.price || 0, // Safety check
      product_image: product.image,
      created_at: new Date().toISOString()
    };
    wishlist.push(wishlistItem);
    saveWishlist(wishlist);
    setIsInWishlist(true);
    alert('Added to wishlist!');
    router.push('/favourite')
  }
};
  

  return (
    <div className="w-full bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 py-8 lg:py-12">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
          {/* Left - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-gray-50 overflow-hidden relative group">
              <img 
                src={allImages[selectedImageIndex]} 
                alt={`${product.name} - view ${selectedImageIndex + 1}`}
                className="w-full h-auto object-cover transition-transform duration-300"
              />
            </div>

            {/* Thumbnail Gallery - Only show if there are multiple images */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`bg-gray-50 overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-gray-900' 
                        : 'border-transparent hover:border-gray-400'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover aspect-square"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <button onClick={onClose} className="hover:text-gray-600 cursor-pointer transition-colors">
                Home
              </button>
              <span>/</span>
              <span className="hover:text-gray-600 cursor-pointer transition-colors">
                {product.category || 'T-Shirt'}
              </span>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl lg:text-4xl font-normal text-gray-900 tracking-tight leading-tight uppercase">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3">
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through font-normal">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-2xl text-gray-900 font-normal">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="pt-2">
                <label className="block text-sm font-normal text-gray-900 mb-4">
                  Size
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2.5 border text-sm font-normal transition-all min-w-22.5 ${
                        selectedSize === size
                          ? 'border-gray-900 bg-white text-gray-900'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 bg-white w-fit">
              <button
                onClick={decreaseQuantity}
                className="px-5 py-3 hover:bg-gray-50 transition-colors text-gray-600 text-base font-light"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-6 py-3 border-l border-r border-gray-300 text-center min-w-15 text-gray-900 font-normal text-base">
                {quantity}
              </span>
              <button
                onClick={increaseQuantity}
                className="px-5 py-3 hover:bg-gray-50 transition-colors text-gray-600 text-base font-light"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-gray-900 text-white py-3 px-8 hover:bg-gray-800 transition-all duration-200 text-sm font-medium tracking-wide"
            >
              Add to cart
            </button>

            {/* Buy Now Button */}
            <button 
              onClick={handleBuyNow}
              className="w-full border-2 border-gray-900 text-gray-900 py-3 px-8 hover:bg-gray-900 hover:text-white transition-all duration-200 text-sm font-medium tracking-wide"
            >
              Buy Now
            </button>

            {/* Add to Wishlist */}
           <button 
  onClick={handleAddToWishlist}
  className={`w-full py-3 px-8 transition-all duration-200 text-sm font-normal flex items-center justify-center gap-2 ${
    isInWishlist 
      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
  }`}
>
  <svg 
    className="w-4 h-4" 
    fill={isInWishlist ? "currentColor" : "none"} 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
  {isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
</button>

            {/* Accordion - Description */}
            {product.description && (
              <div className="border-t border-gray-200">
                <button
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex items-center justify-between text-left py-5 group"
                >
                  <span className="text-base font-normal text-gray-900">Description</span>
                  <span className={`text-2xl text-gray-400 font-light leading-none transition-transform duration-300 ${
                    activeAccordion === 'description' ? 'rotate-180' : ''
                  }`}>
                    +
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeAccordion === 'description' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="pb-5">
                    <ul className="space-y-2.5 text-sm text-gray-600 leading-relaxed">
                      {product.description.split('\n').map((line, index) => (
                        line.trim() && (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-2 w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0"></span>
                            <span>{line.trim()}</span>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Accordion - Additional Information */}
            {(product.additionalInfo || product.additional_info) && (
              <div className="border-t border-gray-200">
                <button
                  onClick={() => toggleAccordion('additional')}
                  className="w-full flex items-center justify-between text-left py-5 group"
                >
                  <span className="text-base font-normal text-gray-900">Additional information</span>
                  <span className={`text-2xl text-gray-400 font-light leading-none transition-transform duration-300 ${
                    activeAccordion === 'additional' ? 'rotate-180' : ''
                  }`}>
                    +
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeAccordion === 'additional' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="pb-5">
                    <div className="flex border-t border-gray-200">
                      <div className="w-32 py-4 text-sm font-normal text-gray-900 bg-gray-50 px-6">
                        SIZE
                      </div>
                      <div className="flex-1 py-4 text-sm text-gray-600 px-6">
                        {product.sizes ? product.sizes.join(', ') : (product.additionalInfo || product.additional_info)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Features Section */}
        <div className="border-t mt-10">
          <div className="w-full flex justify-center mt-10">
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0"></span>
                <span className="text-base">Inspired by Satoshi's legacy</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0"></span>
                <span className="text-base">Sleek, future-forward style</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0"></span>
                <span className="text-base">Ultra-soft feel for daily wear</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0"></span>
                <span className="text-base">Discreet blockchain touches</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0"></span>
                <span className="text-base">Tailored for movement and ease</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0"></span>
                <span className="text-base">Made to outlast trends</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;