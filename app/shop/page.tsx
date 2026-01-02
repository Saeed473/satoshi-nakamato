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

const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(getCartFromStorage());
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<'grid-4' | 'grid-5' | 'list'>('grid-4');

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Shop" },
  ];

  // Get ALL products from Redux (no filtering)
  const { items: allProducts, loading } = useSelector(
    (state: RootState) => state.products
  );

  // Normalize ALL products (no category filter)
  const products: Product[] = allProducts.map((p: any) => ({
    ...p,
    originalPrice: p.original_price ?? p.originalPrice,
    image: Array.isArray(p.images) ? p.images[0] : p.image,
  }));

  // Sort products based on selected sort option
  const getSortedProducts = () => {
    const productsList = [...products];
    
    switch (sortBy) {
      case "price-low":
        return productsList.sort((a, b) => a.price - b.price);
      case "price-high":
        return productsList.sort((a, b) => b.price - a.price);
      case "latest":
        return productsList.reverse();
      case "popularity":
        return productsList;
      case "rating":
        return productsList;
      default:
        return productsList;
    }
  };
  
  const sortedProducts = getSortedProducts();

  // Grid class based on view mode
  const getGridClass = () => {
    if (viewMode === 'list') return 'grid grid-cols-3 gap-6';
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
          <p className="mt-4 text-gray-600">Loading products...</p>
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
              No Products Available
            </h3>
            <p className="text-gray-500">
              Check back soon for new items in our collection.
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

      {/* Shop Description */}
      <div className="mt-10 px-10">
        <h1 className="text-4xl font-semibold mb-6">Shop</h1>
      </div>
    </div>
  );
};

export default Shop;