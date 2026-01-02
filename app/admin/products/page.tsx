"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/utils/api";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  discount_type: string | null;
  discount_value: number | null;
  images: string[];
  status: string;
  stock?: number;
  sales?: number;
  sizes: string[];
  created_at: string;
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedFilter !== "all") params.append("filter", selectedFilter);

      const response = await apiRequest(
        `/api/admin/products?${params.toString()}`
      );

      if (response.success) {
        setProducts(response.data);
      } else {
        setError(response.message || "Failed to fetch products");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedFilter]);

  const filters = [
    { value: "all", label: "All Products" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
  ];

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Active",
      value: products.filter((p) => p.status === "active").length,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await apiRequest(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      
      fetchProducts();
      alert("Product deleted successfully");
    } catch (err: any) {
      alert("Error deleting product: " + err.message);
    }
  };

  const getDiscountedPrice = (product: Product) => {
    if (!product.discount_value) return product.price;

    if (product.discount_type === "percentage") {
      return product.price - (product.price * product.discount_value) / 100;
    } else {
      return product.price - product.discount_value;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-[32px] font-bold text-white drop-shadow-sm">
            Products
          </h1>
          <p className="text-[15px] text-white/90">
            Manage your product inventory and listings
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#667eea] transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="rounded-2xl border border-black/4 bg-white p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bg} ${stat.color} rounded-xl p-3`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="rounded-2xl border border-black/4 bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm transition-all focus:border-[#667eea] focus:outline-none focus:ring-3 focus:ring-[#667eea]/10"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                  selectedFilter === filter.value
                    ? "bg-linear-to-br from-[#667eea] to-[#764ba2] text-white shadow-lg shadow-[#667eea]/40"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-600" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-2xl border border-black/4 bg-white p-16 text-center shadow-lg">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[#667eea]" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Products Table */}
      {!isLoading && !error && (
        <div className="overflow-hidden rounded-2xl border border-black/4 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                    Product
                  </th>
                  <th className="px-8 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                    Category
                  </th>
                  <th className="px-8 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                    Price
                  </th>
                  <th className="px-8 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                    Sizes
                  </th>
                  <th className="px-8 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                    Sales
                  </th>
                  <th className="px-8 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                    Status
                  </th>
                  <th className="px-8 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const discountedPrice = getDiscountedPrice(product);
                  const hasDiscount = product.discount_value && discountedPrice !== product.price;

                  return (
                    <tr
                      key={product.id}
                      className="border-t border-gray-100 transition-colors hover:bg-gray-50"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded-xl bg-linear-to-br from-purple-100 to-pink-100">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-2xl">
                                📦
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {product.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-700">
                        {product.category}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            ${discountedPrice.toFixed(2)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-gray-500 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {product.sizes && product.sizes.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {product.sizes.map((size, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-700"
                              >
                                {size}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No sizes</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-700">
                        {product.sales || 0}
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold ${
                            product.status === "active"
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              product.status === "active"
                                ? "bg-green-600"
                                : "bg-gray-600"
                            }`}
                          />
                          {product.status === "active" ? "Active" : "Draft"}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-all hover:bg-blue-100"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-all hover:bg-purple-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-all hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="py-16 text-center">
              <Package className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <p className="mb-2 text-lg text-gray-600">No products found</p>
              <p className="text-sm text-gray-400">
                {searchQuery || selectedFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first product"}
              </p>
              {!searchQuery && selectedFilter === "all" && (
                <Link
                  href="/admin/products/create"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#667eea] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5568d3]"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Product
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}