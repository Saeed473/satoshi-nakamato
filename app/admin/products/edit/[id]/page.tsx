"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Upload, X, Save, Eye, Loader2 } from "lucide-react";
import { apiRequest } from "@/utils/api";
import Link from "next/link";

export default function CreateEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string | undefined;
  const isEditMode = !!productId;

  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    category: string;
    price: string;
    discountType: string;
    discountValue: string;
    status: string;
    sizes: string[];
    isNewArrival: boolean; 
  }>({
    name: "",
    slug: "",
    description: "",
    category: "",
    price: "",
    discountType: "percentage",
    discountValue: "",
    status: "active",
    sizes: [],
     isNewArrival: true,
  });

  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  const categories = [
    "T-Shirt",
    "Hoodie",
    "Crewnecks",
    "Jacket",
    "SweatsPants",
    "Shorts",
    "Hats",
    "Sports",
    "Beauty",
    "Home & Garden",
    "Photography",
    "Wearables",
  ];
  
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode && productId) {
      fetchProduct();
    }
  }, [productId, isEditMode]);

  const fetchProduct = async () => {
    setIsLoadingProduct(true);
    try {
      const response = await apiRequest(`/api/admin/products/${productId}`);
      
      if (response.success && response.data) {
        const product = response.data;
        setFormData({
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          category: product.category || "",
          price: product.price?.toString() || "",
          discountType: product.discount_type || "percentage",
          discountValue: product.discount_value?.toString() || "",
          status: product.status || "active",
          sizes: product.sizes || [],
          isNewArrival: product.is_new_arrival ?? true,
        });
        setImages(product.images || []);
      } else {
        alert("Failed to load product");
        router.push("/admin/products");
      }
    } catch (error: any) {
      alert("Error loading product: " + (error.message || "Unknown error"));
      router.push("/admin/products");
    } finally {
      setIsLoadingProduct(false);
    }
  };

  // Auto-generate slug from product name (only in create mode)
  useEffect(() => {
    if (!isEditMode) {
      const slug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    // Debug: Check what we're sending
    console.log("Form data being sent:", { ...formData, images });

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // Update existing product
        await apiRequest(`/api/admin/products/${productId}`, {
          method: "PUT",
          body: {
            ...formData,
            images,
          },
        });
        alert("Product updated successfully!");
      } else {
        // Create new product
        await apiRequest("/api/admin/products/create", {
          method: "POST",
          body: {
            ...formData,
            images,
          },
        });
        alert("Product created successfully!");
      }

      router.push("/admin/products");
    } catch (error: any) {
      alert(
        `Error ${isEditMode ? "updating" : "creating"} product: ` +
          (error.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];
    const failedUploads: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        failedUploads.push(`${file.name} (not an image)`);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        failedUploads.push(`${file.name} (exceeds 5MB)`);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        } else {
          failedUploads.push(`${file.name}: ${data.message || "Unknown error"}`);
        }
      } catch (error) {
        failedUploads.push(`${file.name}: Network error`);
      }
    }

    if (uploadedUrls.length > 0) {
      setImages((prev) => [...prev, ...uploadedUrls]);
    }

    if (failedUploads.length > 0) {
      alert("Some uploads failed:\n" + failedUploads.join("\n"));
    }

    setIsUploading(false);

    // Reset input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoadingProduct) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-white" />
          <p className="text-white">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-[32px] font-bold text-white">
              {isEditMode ? "Edit Product" : "Create Product"}
            </h1>
            <p className="text-white/90">
              {isEditMode
                ? "Update product information"
                : "Add a new product to your inventory"}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-white/15 px-6 py-3 text-white transition-colors hover:bg-white/25"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#667eea] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditMode ? "Update Product" : "Save Product"}
              </>
            )}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-xl font-bold">Basic Information</h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#667eea] focus:outline-none focus:ring-2 focus:ring-[#667eea]/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Slug {isEditMode ? "" : "(Auto-generated)"}
                </label>
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  readOnly={!isEditMode}
                  placeholder="auto-generated-from-name"
                  className={`w-full rounded-xl border px-4 py-3 text-sm ${
                    isEditMode
                      ? "border-gray-300 focus:border-[#667eea] focus:outline-none focus:ring-2 focus:ring-[#667eea]/20"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#667eea] focus:outline-none focus:ring-2 focus:ring-[#667eea]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#667eea] focus:outline-none focus:ring-2 focus:ring-[#667eea]/20"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-xl font-bold">Pricing</h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price ($) *
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#667eea] focus:outline-none focus:ring-2 focus:ring-[#667eea]/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#667eea] focus:outline-none focus:ring-2 focus:ring-[#667eea]/20"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Discount Value
                </label>
                <input
                  name="discountValue"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#667eea] focus:outline-none focus:ring-2 focus:ring-[#667eea]/20"
                />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-xl font-bold">Available Sizes</h2>
            
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`rounded-xl border-2 px-6 py-3 font-semibold transition-all ${
                    formData.sizes.includes(size)
                      ? "border-[#667eea] bg-[#667eea] text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-[#667eea]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {formData.sizes.length > 0 && (
              <p className="mt-3 text-sm text-gray-600">
                Selected sizes: {formData.sizes.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Images */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Product Images *</h2>

            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-[#667eea] hover:bg-[#667eea]/5">
              {isUploading ? (
                <>
                  <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-[#667eea]" />
                  <p className="text-sm text-gray-600">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload images
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG up to 5MB
                  </p>
                </>
              )}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="group relative">
                    <img
                      src={img}
                      alt={`Product ${i + 1}`}
                      className="h-32 w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-2 top-2 rounded-lg bg-red-500 p-1.5 text-white opacity-0 shadow-lg transition-opacity hover:bg-red-600 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && (
              <p className="mt-3 text-center text-xs text-gray-500">
                No images uploaded yet
              </p>
            )}
          </div>

          {/* Status */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Product Status</h2>

            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#667eea] focus:outline-none focus:ring-2 focus:ring-[#667eea]/20"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>

            <p className="mt-2 text-xs text-gray-500">
              {formData.status === "active"
                ? "Product will be visible to customers"
                : "Product will be saved as draft"}
            </p>
          </div>
          {/* New Arrival */}
<div className="mt-4 flex items-center gap-3">
  <input
    type="checkbox"
    id="newArrival"
    checked={formData.isNewArrival}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        isNewArrival: e.target.checked,
      }))
    }
    className="h-5 w-5 rounded border-gray-300 text-[#667eea] focus:ring-[#667eea]"
  />
  <label htmlFor="newArrival" className="text-sm font-medium text-gray-700">
    Mark as New Arrival
  </label>
</div>

        </div>
      </form>
    </div>
  );
}