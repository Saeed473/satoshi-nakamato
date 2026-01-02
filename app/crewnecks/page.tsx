'use client'
import { useState } from 'react';
import CategoryHeader from '@/components/CategoryHeader';
import ProductCard from '@/components/ProductCard';
import { QuickViewModal } from '@/modal/QuickViewModal';
import CartSidebar from '@/components/CartSidebar';
import { CartItem, addToCart, getCartFromStorage } from '@/utils/cartUtils';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

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
}
const Crewnecks = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(getCartFromStorage());
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<'grid-4' | 'grid-5' | 'list'>('grid-4');

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Crewnecks" },
  ];

  const { items: allProducts, loading } = useSelector(
    (state: RootState) => state.products
  );

  const crewnecksProducts: Product[] = allProducts
    .filter((product: any) => product.category?.toLowerCase() === "crewnecks")
    .map((p: any) => ({
      ...p,
      originalPrice: p.original_price ?? p.originalPrice,
      image: Array.isArray(p.images) ? p.images[0] : p.image,
    }));

  // Sort products based on selected sort option
  const getSortedProducts = () => {
    const products = [...crewnecksProducts];
    
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
          <p className="mt-4 text-gray-600">Loading crewnecks...</p>
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
              No Crewnecks Available
            </h3>
            <p className="text-gray-500">
              Check back soon for new crewnecks in our collection.
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

      <div className="mt-10 px-10">
        <h1 className="text-4xl font-semibold mb-6">Crewnecks</h1>
      </div>
    </div>
  );
};

export default Crewnecks;