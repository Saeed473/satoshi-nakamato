'use client'
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductDetailPage from "@/components/ProductDetailPage";
import { apiRequest } from "@/utils/api";

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

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const productId = resolvedParams.id; // Keep as string - could be UUID or number
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const [cartOpen, setCartOpen] = useState(false);
const handleOpenCart = () => {
  setCartOpen(true);
};
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all products and find the matching one by ID
        // Fetch all products and find the matching one by ID
        const response = await apiRequest('/api/admin/products');
        
        if (response.success && response.data) {
          // Find product by ID (handles both number and string IDs)
          const foundProduct = response.data.find((p: any) => 
            String(p.id) === String(productId)
          );
          
          if (foundProduct) {
            // Map database fields to component fields
            const mappedProduct = {
              ...foundProduct,
              originalPrice: foundProduct.original_price || foundProduct.originalPrice,
              additionalInfo: foundProduct.additional_info || foundProduct.additionalInfo,
              image: foundProduct.images?.[0] || foundProduct.image,
              image2: foundProduct.images?.[1] || foundProduct.image2,
            };
            
            setProduct(mappedProduct);
          } else {
            setError("Product not found");
          }
        } else {
          setError("Failed to load products");
        }
      } catch (error: any) {
        console.error("Error loading product:", error);
        setError(error.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Product not found</h1>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailPage 
      product={product} 
      onClose={() => router.push('/')} 
    />
  );
}