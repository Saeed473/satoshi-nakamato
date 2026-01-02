import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HoverCloseButton from '@/components/HoverCloseButton';

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

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (item: CartItem) => void;
  onOpenCart?: () => void; // Add callback to open cart sidebar
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  onOpenCart 
}) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSelectedSize('');
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

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

  const handleAddToCart = () => {
    // Validate size selection if product has sizes
    if (product.sizes && !selectedSize) {
      alert('Please select a size');
      return;
    }

    const cartItem: CartItem = {
      ...product,
      quantity,
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

    // Call the onAddToCart callback if provided (for backwards compatibility)
    if (onAddToCart) {
      onAddToCart(cartItem);
    }

    // Open cart sidebar automatically
    if (onOpenCart) {
      onOpenCart();
    }

    // Close modal
    onClose();
  };

  const handleBuyNow = () => {
    // Validate size selection if product has sizes
    if (product.sizes && !selectedSize) {
      alert('Please select a size');
      return;
    }

    const cartItem: CartItem = {
      ...product,
      quantity,
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

    // Close modal
    onClose();

    // Navigate to checkout page
    router.push('/checkout');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-300/50 z-50 flex items-center justify-center p-2 sm:p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-sm w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-237.5 max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col md:flex-row shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Product Image */}
        <div className="w-full md:w-[50%] h-[45vh] sm:h-[50vh] md:h-auto bg-gray-50 relative flex items-center justify-center shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain md:object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-[50%] p-6 sm:p-8 md:p-10 overflow-y-auto relative bg-white">
          {/* Close Button */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
            <HoverCloseButton 
              onClick={onClose}
              size={24}
              color="#6b7280"
              className="hover:bg-gray-50 rounded-full transition-colors flex items-center justify-center"
            />
          </div>

          {/* Product Name */}
          <h2 className="text-lg sm:text-xl md:text-[22px] font-normal text-gray-900 mb-4 sm:mb-5 pr-10 sm:pr-12 uppercase tracking-wider leading-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', letterSpacing: '0.5px' }}>
            {product.name}
          </h2>

          {/* Price */}
          <div className="mb-6 sm:mb-8">
            <span className="text-lg sm:text-xl md:text-[20px] text-gray-500 font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Size Selection */}
          {product.sizes && (
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm sm:text-[15px] font-normal text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                {product.name.includes('HAT') ? 'Hat Size' : 'Size'}
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 sm:py-2.5 px-2 sm:px-4 border text-xs sm:text-[14px] transition-all ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center border border-gray-300 w-27.5 sm:w-30">
              <button 
                onClick={decrementQuantity}
                className="w-9 sm:w-10 h-10 sm:h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 text-base sm:text-lg"
              >
                −
              </button>
              <input 
                type="text" 
                value={quantity} 
                readOnly
                className="w-8 sm:w-10 h-10 sm:h-11 text-center border-x border-gray-300 focus:outline-none text-sm sm:text-[15px] text-gray-700"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
              />
              <button 
                onClick={incrementQuantity}
                className="w-9 sm:w-10 h-10 sm:h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 text-base sm:text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2.5 sm:space-y-3">
            <button 
              onClick={handleAddToCart}
              className="w-full py-3 sm:py-3.5 bg-[#3d3d3d] text-white text-sm sm:text-[15px] font-normal hover:bg-[#2d2d2d] transition-colors tracking-wide" 
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              Add to cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="w-full py-3 sm:py-3.5 border border-black text-black text-sm sm:text-[15px] font-normal hover:bg-black hover:text-white transition-colors tracking-wide" 
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};