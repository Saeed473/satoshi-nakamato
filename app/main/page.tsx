'use client'
import { useEffect, useState } from "react";
import { QuickViewModal } from "@/modal/QuickViewModal";
import CartSidebar from "@/components/CartSidebar";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/api";
import { 
  getCartFromStorage, 
  addToCart, 
  updateCartItemQuantity, 
  removeFromCart,
  CartItem 
} from "@/utils/cartUtils";

// Product interface (matches your database schema)
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

const SatoshiCollection: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch products using apiRequest
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await apiRequest("/api/admin/products");
        
        if (response.success && response.data) {
          const mappedProducts = response.data.map((product: any) => ({
            ...product,
            originalPrice: product.original_price || product.originalPrice,
            additionalInfo: product.additional_info || product.additionalInfo,
            image: product.images?.[0] || product.image,
            image2: product.images?.[1] || product.image2,
          }));
          
          setProducts(mappedProducts);
        } else {
          setError("Failed to load products");
        }
      } catch (error: any) {
        console.error("Error loading products:", error);
        setError(error.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Load cart from storage
  useEffect(() => {
    setCartItems(getCartFromStorage());
  }, []);

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeQuickView = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // ✅ Function to open cart sidebar
  const handleOpenCart = () => {
    console.log('Opening cart sidebar...'); // Debug log
    setCartOpen(true);
  };

  const handleAddToCart = (item: CartItem) => {
    const updatedCart = addToCart(item);
    setCartItems(updatedCart);
    setCartOpen(true); // This opens cart when using handleAddToCart
  };

  const handleUpdateQuantity = (id: number, size: string | undefined, newQuantity: number) => {
    const updatedCart = updateCartItemQuantity(id, size, newQuantity);
    setCartItems(updatedCart);
  };

  const handleRemoveItem = (id: number, size: string | undefined) => {
    const updatedCart = removeFromCart(id, size);
    setCartItems(updatedCart);
  };

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  // Loading State
  if (loading) {
    return (
      <div className="w-full bg-white py-8 sm:py-12 px-4">
        <div className="mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
              Latest Collection Of
            </h1>
            <div className="flex items-center justify-center">
              <div className="h-1 bg-linear-to-r from-transparent via-gray-400 to-transparent flex-1"></div>
              <span className="text-gray-700 text-sm sm:text-base px-3 sm:px-4 bg-white whitespace-nowrap" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '400' }}>
                Satoshi Nakamoto
              </span>
              <div className="h-1 bg-linear-to-l from-transparent via-gray-400 to-transparent flex-1"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-3/4 mb-3 sm:mb-4 rounded"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full bg-white py-8 sm:py-12 px-4">
        <div className="mx-auto text-center">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
              Latest Collection Of
            </h1>
            <div className="flex items-center justify-center">
              <div className="h-1 bg-linear-to-r from-transparent via-gray-400 to-transparent flex-1"></div>
              <span className="text-gray-700 text-sm sm:text-base px-3 sm:px-4 bg-white whitespace-nowrap" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '400' }}>
                Satoshi Nakamoto
              </span>
              <div className="h-1 bg-linear-to-l from-transparent via-gray-400 to-transparent flex-1"></div>
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Products</h3>
              <p className="text-red-600 text-sm mb-4">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="w-full bg-white py-8 sm:py-12 px-4">
        <div className="mx-auto text-center">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
              Latest Collection Of
            </h1>
            <div className="flex items-center justify-center">
              <div className="h-1 bg-linear-to-r from-transparent via-gray-400 to-transparent flex-1"></div>
              <span className="text-gray-700 text-sm sm:text-base px-3 sm:px-4 bg-white whitespace-nowrap" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '400' }}>
                Satoshi Nakamoto
              </span>
              <div className="h-1 bg-linear-to-l from-transparent via-gray-400 to-transparent flex-1"></div>
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600">Check back soon for new items in our collection.</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Product Grid
  return (
    <div className="w-full bg-white py-8 sm:py-12 px-4">
      <div className="mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
            Latest Collection Of
          </h1>
          <div className="flex items-center justify-center">
            <div className="h-1 bg-linear-to-r from-transparent via-gray-500 to-gray-400 flex-1 shadow-2xl"></div>
            <span className="text-gray-700 text-sm sm:text-base px-3 sm:px-4 bg-white whitespace-nowrap" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '400' }}>
              Satoshi Nakamoto
            </span>
            <div className="h-1 bg-linear-to-l from-transparent via-gray-500 to-gray-400 flex-1 shadow-sm"></div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              {/* Product Image */}
              <div 
                className="relative bg-gray-100 mb-3 sm:mb-4 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="aspect-3/4 relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-2" 
                  />
                </div>
                
                {/* Icons overlay */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Add to Wishlist */}
                  <div className="flex items-center gap-1 sm:gap-2 group/icon justify-end">
                    <span className="hidden lg:block text-xs sm:text-sm font-medium text-white bg-black/50 z-50 px-2 sm:px-3 py-1 rounded-md opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
                      Add to wishlist
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.id);
                      }}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center group-hover/icon:bg-white transition-all shadow-md shrink-0"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover/icon:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Quick View */}
                  <div className="flex items-center gap-1 sm:gap-2 group/icon justify-end">
                    <span className="hidden lg:block text-xs sm:text-sm font-medium text-white bg-black/80 z-50 px-2 sm:px-3 py-1 rounded-md opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
                      Quick view
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openQuickView(product);
                      }}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center group-hover/icon:bg-white transition-all shadow-md shrink-0"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover/icon:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <div className="flex items-center gap-1 sm:gap-2 group/icon justify-end">
                    <span className="hidden lg:block text-xs sm:text-sm font-medium text-white bg-black/80 z-50 px-2 sm:px-3 py-1 rounded-md opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
                      Select options
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.id);
                      }}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center group-hover/icon:bg-white transition-all shadow-md shrink-0"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover/icon:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-left px-1">
                <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-1 sm:mb-2 uppercase tracking-wide line-clamp-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {product.name}
                </h3>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-xs sm:text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-gray-900 font-medium text-sm sm:text-base" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick View Modal - ✅ ADDED onOpenCart prop */}
      <QuickViewModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeQuickView}
        onAddToCart={handleAddToCart}
        onOpenCart={handleOpenCart} // ✅ This will make cart sidebar open automatically
      />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </div>
  );
};

export default SatoshiCollection;