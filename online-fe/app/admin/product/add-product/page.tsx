"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  X,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import CMSLayout from "@/components/Layout/AdminCMSLayout";
import UploadDropzone from "@/components/Upload/ImageUpload";
import { ImageFolder } from "@/services/upload/types/upload-response.type";
import { productService } from "@/services/product/product.service";
import { categoryService } from "@/services/categories/categories.service";
import { UploadService } from "@/services/upload/upload.service";
import { ProductType } from "@/models/product.model";
import { rupiahFormat } from "@/lib/utils/format";
import { CategoriesModels } from "@/models/categories.model";

const uploadService = new UploadService();

export default function AddProductPage() {
  const router = useRouter();

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [showAdditionalUpload, setShowAdditionalUpload] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [uploadRefresh, setUploadRefresh] = useState(0);

  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    product_type: ProductType.WINDOWS,
    category_id: undefined as number | undefined,
    brand: "",
    is_active: true,
    is_featured: false,
  });

  const [categories, setCategories] = useState<CategoriesModels[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categoryService.getAllCategories(true);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "price" || name === "stock_quantity") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === "category_id") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCurrentFile = (file: File | null) => {
    setCurrentFile(file);
  };

  const handleAddAdditionalFile = () => {
    if (currentFile) {
      const previewURL = URL.createObjectURL(currentFile);
      setAdditionalImageFiles((prev) => [...prev, currentFile]);

      setCurrentFile(null);
      setUploadRefresh((prev) => prev + 1);
    } else {
      alert("pilih file terlebih dahulu");
    }
  };

  const removeAdditionalFile = (index: number) => {
    setAdditionalImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.product_name.trim()) {
      setError("Product name is required");
      return;
    }
    if (formData.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    if (!mainImageFile) {
      setError("Main image is required for the product thumbnail");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const productRes = (await productService.createProduct(formData)) as any;
      const newProductId = productRes.data?.product_id || productRes.product_id;

      if (!newProductId) {
        throw new Error(
          "Product saved but ID not returned. Check Backend Response.",
        );
      }
      await uploadService.UploadMainProductImage(
        mainImageFile,
        ImageFolder.MAIN_PRODUCT,
        newProductId,
      );

      if (additionalImageFiles.length > 0) {
        const uploadPromises = additionalImageFiles.map((file) =>
          uploadService.UploadAdditionalProductImage(
            file,
            ImageFolder.ADDITIONAL_PRODUCT,
            newProductId,
          ),
        );
        await Promise.all(uploadPromises);
      }

      setSuccess("Product and all images created successfully!");

      setTimeout(() => {
        router.push("/admin/product");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to process request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CMSLayout>
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/product"
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details to add a new product to HpLap
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3">
            <div className="flex-1 text-sm font-medium">{error}</div>
            <button
              onClick={() => setError("")}
              className="p-1 hover:bg-red-100 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium">
            {success} Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* SECTION 1: Basic Information */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    placeholder="e.g., Windows 11 Pro"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the product..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Price *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="price"
                      value={
                        formData.price === 0 ? "" : rupiahFormat(formData.price)
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        setFormData((prev) => ({
                          ...prev,
                          price: Number(rawValue),
                        }));
                      }}
                      placeholder="Rp 0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Product Type *
                  </label>
                  <select
                    name="product_type"
                    value={formData.product_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                    disabled={isSubmitting}
                  >
                    {Object.values(ProductType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g., Microsoft"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                    disabled={loadingCategories || isSubmitting}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-6 items-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="w-4 h-4 text-accent"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleChange}
                      className="w-4 h-4 text-accent"
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Media Management */}
            <div className="p-6 bg-gray-50/50">
              <div className="space-y-6">
                {/* MAIN IMAGE (WAJIB) */}
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Product Image *
                  </label>
                  <UploadDropzone
                    label="Upload Main Image"
                    onFileSelect={(file) => setMainImageFile(file)}
                  />
                  {mainImageFile && (
                    <div className="mt-2 flex items-center justify-between p-2 bg-white border border-blue-200 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <ImageIcon
                          size={16}
                          className="text-blue-500 shrink-0"
                        />
                        <span className="text-xs font-medium text-gray-600 truncate">
                          {mainImageFile.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMainImageFile(null)}
                        className="text-red-500 p-1 hover:bg-red-50 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. ADDITIONAL IMAGES (DENGAN BUTTON SHOW/HIDE) */}
                <div className="pt-4 border-t border-gray-200">
                  {!showAdditionalUpload ? (
                    <button
                      type="button"
                      onClick={() => setShowAdditionalUpload(true)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-all"
                    >
                      <Plus size={18} />
                      <span>
                        Add Additional Gallery Images (
                        {additionalImageFiles.length})
                      </span>
                    </button>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">
                          Gallery Images
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowAdditionalUpload(false)}
                          className="text-xs text-gray-400 hover:text-red-500"
                        >
                          Hide Section
                        </button>
                      </div>

                      <UploadDropzone
                        key={uploadRefresh}
                        label={
                          currentFile
                            ? `Selected: ${currentFile}`
                            : "Add more Images"
                        }
                        onFileSelect={handleCurrentFile}
                      />

                      <button
                        type="button"
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${currentFile ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                        onClick={handleAddAdditionalFile}
                        disabled={!currentFile}
                      >
                        Next & Accept Image
                      </button>

                      {/* List preview gallery */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {additionalImageFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-white border rounded-lg group"
                          >
                            <span className="text-xs text-gray-500 truncate">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeAdditionalFile(index)}
                              className="text-red-400 p-1 hover:bg-red-50 rounded"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pb-10">
            <Link
              href="/admin/product"
              className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !!success}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Create Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </CMSLayout>
  );
}
