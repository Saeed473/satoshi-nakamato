"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import CategoryHeader from "@/components/CategoryHeader";
import ProductCard from "@/components/ProductCard";
import { QuickViewModal } from "@/modal/QuickViewModal";
import CartSidebar from "@/components/CartSidebar";
import { CartItem, addToCart, getCartFromStorage } from "@/utils/cartUtils";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  original_price?: number;
  image: string;
  images?: string[];
  description?: string;
  sizes?: string[];
  category?: string;
  slug?: string;
}

const Hoodies = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(getCartFromStorage());
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<'grid-4' | 'grid-5' | 'list'>('grid-4');

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Hoodies" },
  ];

  // Get products from Redux
  const { items: allProducts, loading } = useSelector(
    (state: RootState) => state.products
  );

  // Normalize and filter hoodies only
  const hoodieProducts: Product[] = allProducts
    .filter((product: any) => product.category?.toLowerCase() === "hoodie")
    .map((p: any) => ({
      ...p,
      originalPrice: p.original_price ?? p.originalPrice,
      image: Array.isArray(p.images) ? p.images[0] : p.image,
    }));

  // Sort products based on selected sort option
  const getSortedProducts = () => {
    const products = [...hoodieProducts];
    
    switch (sortBy) {
      case "price-low":
        return products.sort((a, b) => a.price - b.price);
      case "price-high":
        return products.sort((a, b) => b.price - a.price);
      case "latest":
        return products.reverse();
      case "popularity":
        return products;
      case "rating":
        return products;
      default:
        return products;
    }
  };
  
  const sortedProducts = getSortedProducts();

  // Grid class based on view mode
  const getGridClass = () => {
    if (viewMode === 'list') return 'grid grid-cols-1 gap-6';
    if (viewMode === 'grid-5') return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6';
    return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
  };

  const handleAddToCart = (item: CartItem) => {
    const updatedCart = addToCart(item);
    setCartItems(updatedCart);
    setCartOpen(true);
  };

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeQuickView = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="w-full bg-white">
        <CategoryHeader 
          breadcrumbs={breadcrumbs}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalItems={0}
        />
        <div className="px-10 py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading hoodies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <CategoryHeader 
        breadcrumbs={breadcrumbs}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalItems={sortedProducts.length}
      />

      {/* PRODUCTS GRID */}
      <div className={`px-10 mt-8 mb-16 ${getGridClass()}`}>
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
              onQuickView={openQuickView}
              onAddToWishlist={(product) => {
                console.log("Added to wishlist:", product.name);
              }}
              onAddToCart={(product) => {
                window.location.href = `/product/${product.id}`;
              }}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <svg
              className="w-20 h-20 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Hoodies Available
            </h3>
            <p className="text-gray-500">
              Check back soon for new hoodies in our collection.
            </p>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeQuickView}
        onAddToCart={handleAddToCart}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Product Description Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold mb-6">Hoodie</h1>
        
        <div className="mb-10">
          <h2 className="text-2xl font-medium mb-4">SATOSHI NAKAMOTO SHIRTS</h2>
          <p className="text-sm text-gray-700 mb-6">
           Crafted for the culture, built for the few. The Satoshi Nakamoto Hoodie collection combines heavyweight comfort with signature symbolism, drawing inspiration from blockchain rebellion, underground energy, and timeless design codes. This isn't hype. This is heritage.
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-2xl font-medium mb-4">NEW ARRIVALS</h3>
          
          <div className="mb-8">
            <h4 className="text-lg font-medium mb-3">SATOSHI NAKAMOTO RHINESTONE HOODIE</h4>
            <p className="text-gray-700 mb-4 text-sm">
             Bold stone detailing. Blacked-out structure. Signature sparkle meets encrypted energy.
            </p>
            <div className="ml-6">
              <h5 className="font-semibold mb-2 text-sm">Products:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Satoshi Nakamoto Rhinestone Hoodie</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-medium mb-3">SATOSHI NAKAMOTO STUDDED HOODIE</h4>
            <p className="text-gray-700 mb-4">
             Heavy studs. Minimalist aggression. Raw materials, refined silhouette.
            </p>
            <div className="ml-6">
              <h5 className="font-medium mb-2">Products:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Satoshi Nakamoto Rhinestone Hoodie</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-medium mb-3">SATOSHI NAKAMOTO ARMY HOODIE</h4>
            <p className="text-gray-700 mb-4">
             Tactical tones. Military edge. Crafted for movement, built with intent.
            </p>
            <div className="ml-6">
              <h5 className="font-medium mb-2">Products:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Satoshi Nakamoto Army Hoodie</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-medium mb-3">SATOSHI NAKAMOTO 21 SAVAGE COLLAB HOODIE</h4>
            <p className="text-gray-700 mb-4">
             Ultra-black. Limited cut. No reissue. A crossover of chaos and control.
            </p>
            <div className="ml-6">
              <h5 className="font-medium mb-2">Products:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>21 Savage Satoshi Nakamoto Black Hoodie</li>
                <li>21 Savage x Satoshi Nakamoto Hoodie</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-medium mb-3">SATOSHI NAKAMOTO SICKO DROP HOODIE</h4>
            <p className="text-gray-700 mb-4">
              Distressed lines. Abstract imprint. Crypto meets street insanity.
            </p>
            <div className="ml-6">
              <h5 className="font-medium mb-2 text-sm">Products:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Satoshi Nakamoto Sicko Hoodie</li>
                <li>Satoshi Nakamoto Hoodie Sicko</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">DETAILS THAT MATTER</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Premium cotton blend, fleece-lined interiors</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>True-to-size, street-cut silhouettes</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Signature Nakamoto neck tag & encrypted logo hits</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Global shipping. Limited releases only.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Drop archive: Fall/Winter '24, Sicko Editions, Black Capsule</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Hoodies;