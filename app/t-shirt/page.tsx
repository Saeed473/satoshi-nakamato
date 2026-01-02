'use client'
import { useState, useMemo } from 'react';
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

const Shirts = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(getCartFromStorage());
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<'grid-4' | 'grid-5' | 'list'>('grid-4');

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'T-Shirts' }
  ];

  const { items: allProducts, loading } = useSelector(
    (state: RootState) => state.products
  );

  const shirtsProducts: Product[] = allProducts
    .filter((product: any) => product.category?.toLowerCase() === "t-shirt")
    .map((p: any) => ({
      ...p,
      originalPrice: p.original_price ?? p.originalPrice,
      image: Array.isArray(p.images) ? p.images[0] : p.image,
    }));

  // Sort products based on selected sort option
  const sortedProducts = useMemo(() => {
    const products = [...shirtsProducts];
    
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
  }, [shirtsProducts, sortBy]);

  // Grid class based on view mode
  const getGridClass = () => {
    if (viewMode === 'list') return 'grid grid-cols-3 gap-6';
    if (viewMode === 'grid-5') return 'grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6';
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
          <p className="mt-4 text-gray-600">Loading t-shirts...</p>
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
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No T-Shirts Available</h3>
            <p className="text-gray-500">Check back soon for new shirts.</p>
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
        <h1 className="text-3xl font-semibold mb-6">T-Shirt</h1>
        
        <div className="mb-10">
          <h2 className="text-2xl font-medium mb-4">SATOSHI NAKAMOTO SHIRTS</h2>
          <p className="text-sm text-gray-700 mb-6">
            Every shirt in this collection is a cypher—where fabric, fit, and message converge. 
            Inspired by the enigma that is Satoshi Nakamoto, this line explores the grey area 
            between identity and anonymity, control and chaos, legacy and disruption.
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-2xl font-medium mb-4">CORE COLLECTIONS</h3>
          
          <div className="mb-8">
            <h4 className="text-lg font-medium mb-3">Satoshi Nakamoto T-Shirts</h4>
            <p className="text-gray-700 mb-4 text-sm">
              Minimalist code. Maximal energy. From the classic Satoshi Nakamoto T-Shirt to the 
              I Am Satoshi Nakamoto Tee, each piece tells a story—without needing to shout.
            </p>
            <div className="ml-6">
              <h5 className="font-semibold mb-2 text-sm">Products:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Satoshi Nakamoto T-Shirt</li>
                <li>Satoshi Nakamoto Tee Shirt</li>
                <li>Satoshi Nakamoto T-Shirts</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-medium mb-3">Plaid & Flannel</h4>
            <p className="text-gray-700 mb-4">
              Disrupt the grid with cuts that feel both engineered and accidental. 
              Flannel textures were redefined in Nakamoto's grayscale.
            </p>
            <div className="ml-6">
              <h5 className="font-medium mb-2">Products:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Satoshi Nakamoto Flannel Shirt</li>
                <li>Satoshi Nakamoto Shirt Flannel</li>
                <li>Satoshi Nakamoto Plaid Shirt</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-medium mb-3">Studded Editions</h4>
            <p className="text-gray-700 mb-4">
              Built with precision. Finished in threat. Metal detailing and layered edge, 
              for those who dress like encryption.
            </p>
            <div className="ml-6">
              <h5 className="font-medium mb-2">Products:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Satoshi Nakamoto Studded Shirt</li>
                <li>Satoshi Nakamoto Shirt Studded</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-medium mb-3">Statement Shirts</h4>
            <p className="text-gray-700 mb-4">
              You're not just wearing a name—you're challenging one.
            </p>
            <div className="ml-6">
              <h5 className="font-medium mb-2">Products:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>I Am Satoshi Nakamoto Shirt</li>
                <li>I Am Not Satoshi Nakamoto T Shirt</li>
                <li>I Am The Real Satoshi Nakamoto T-Shirt</li>
                <li>Satoshi Nakamoto Is Shirt</li>
                <li>Satoshi Nakamoto Shirt Jack Dorsey</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-medium mb-3">Button-Ups & Greyscale Essentials</h4>
            <p className="text-gray-700 mb-4">
              Sharpen the fit. Blur the rules.
            </p>
            <p className="text-gray-700 mb-4">
              Crisp lines and button-up elegance are all filtered through a crypto lens.
            </p>
            <div className="ml-6">
              <h5 className="font-medium mb-2">Products:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Satoshi Nakamoto Button Up Shirt</li>
                <li>Grey Satoshi Nakamoto Shirt</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">FEATURES</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Premium cotton & structured streetwear cuts</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Oversized and true-fit silhouettes available</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Direct-to-fabric prints, rhinestone and studded detailing</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Designed & produced for drop culture—no restocks</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Trusted shipping. Global reach.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Shirts;