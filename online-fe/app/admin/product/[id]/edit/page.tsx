"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Loader2,
  X,
  Star,
  Trash2,
  Eye,
  LayoutGrid,
  Check,
} from "lucide-react";
import CMSLayout from "@/components/Layout/AdminCMSLayout";
import { productService } from "@/services/product/product.service";
import { categoryService } from "@/services/categories/categories.service";
import { ProductType, ProductModels } from "@/models/product.model";
import { CategoriesModels } from "@/models/categories.model";
import { rupiahFormat } from "@/lib/utils/format";
import UploadDropzone from "@/components/Upload/ImageUpload";
import { UploadService } from "@/services/upload/upload.service";
import { ImageFolder } from "@/services/upload/types/upload-response.type";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);
  const uploadService = useMemo(() => new UploadService(), []);

  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    product_type: ProductType.WINDOWS,
    product_main_image: "",
    product_additional_images: [] as string[],
    category_id: undefined as number | undefined,
    brand: "",
    is_active: true,
    is_featured: false,
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [stagedPreview, setStagedPreview] = useState<string | null>(null);

  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);

  const [product, setProduct] = useState<ProductModels | null>(null);
  const [categories, setCategories] = useState<CategoriesModels[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (productId) {
      Promise.all([fetchProduct(), fetchCategories()]);
    }
    return () => {
      if (mainImagePreview?.startsWith("blob:"))
        URL.revokeObjectURL(mainImagePreview);
      if (stagedPreview?.startsWith("blob:"))
        URL.revokeObjectURL(stagedPreview);
      additionalPreviews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
      setProduct(data);
      setFormData({
        product_name: data.product_name,
        description: data.description || "",
        price: data.price,
        stock_quantity: data.stock_quantity,
        product_type: data.product_type,
        product_main_image: data.product_main_image || "",
        product_additional_images: data.product_additional_image || [],
        category_id: data.category_id,
        brand: data.brand || "",
        is_active: data.is_active,
        is_featured: data.is_featured,
      });
      setMainImagePreview(data.product_main_image || null);
    } catch (err: any) {
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories(true);
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (name === "category_id") {
      const newCategoryId = value ? parseInt(value) : undefined;

      setFormData((prev) => ({
        ...prev,
        category_id: newCategoryId,
      }));

      try {
        await productService.updateProduct(productId, {
          category_id: newCategoryId,
        });

        console.log("Category updated in database");
      } catch (err: any) {
        setError("Failed to sync category to database");
      }
      return;
    }
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === "price" || name === "stock_quantity") {
      const rawValue = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: rawValue === "" ? 0 : parseFloat(rawValue),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectForStaging = (file: File) => {
    if (stagedPreview) URL.revokeObjectURL(stagedPreview);
    setStagedFile(file);
    setStagedPreview(URL.createObjectURL(file));
  };

  const acceptStagedFile = () => {
    if (stagedFile && stagedPreview) {
      setAdditionalFiles((prev) => [...prev, stagedFile]);
      setAdditionalPreviews((prev) => [...prev, stagedPreview]);
      setStagedFile(null);
      setStagedPreview(null);
    }
  };

  const cancelStaging = () => {
    if (stagedPreview) URL.revokeObjectURL(stagedPreview);
    setStagedFile(null);
    setStagedPreview(null);
  };

  const removeNewAdditional = (index: number) => {
    URL.revokeObjectURL(additionalPreviews[index]);
    setAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
    setAdditionalPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAdditional = async (index: number, imageUrl: string) => {
    const currentImages = [...formData.product_additional_images];
    setFormData((prev) => ({
      ...prev,
      product_additional_images: prev.product_additional_images.filter(
        (_, i) => i !== index,
      ),
    }));

    try {
      const response = await uploadService.DeleteProductAdditionalImage(
        productId,
        imageUrl,
      );
      if (!response.success) throw new Error(response.error);
    } catch (error) {
      alert("Gagal menghapus gambar dari server");
      setFormData((prev) => ({
        ...prev,
        product_additional_images: currentImages,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_name.trim())
      return setError("Product name is required");

    setIsSubmitting(true);
    setError("");

    try {
      let updatedMainImageUrl = formData.product_main_image;
      let updatedGalleryUrls = [...formData.product_additional_images];

      if (mainImageFile) {
        const res = await uploadService.UploadMainProductImage(
          mainImageFile,
          ImageFolder.MAIN_PRODUCT,
          productId,
        );
        updatedMainImageUrl = res.data.secure_url;
      }

      // 2. Upload Gallery Baru (Jika ada di antrean)
      if (additionalFiles.length > 0) {
        const uploadPromises = additionalFiles.map((file) =>
          uploadService.UploadAdditionalProductImage(
            file,
            ImageFolder.ADDITIONAL_PRODUCT,
            productId,
          ),
        );
        const results = await Promise.all(uploadPromises);
        const newUrls = results.map((r) => r.data.secure_url);
        updatedGalleryUrls = [...updatedGalleryUrls, ...newUrls];
      }

      const finalPayload = {
        ...formData,
        product_main_image: updatedMainImageUrl,
        product_additional_images: updatedGalleryUrls,
      };

      await productService.updateProduct(productId, finalPayload);
      setSuccess("Product updated successfully!");
      setTimeout(() => {
        router.push("/admin/product");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSoftDelete = async () => {
    try {
      setIsDeleting(true);
      await productService.softDeleteProduct(productId);
      router.push("/admin/product");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handlePermanentDelete = async () => {
    try {
      setIsDeleting(true);
      await productService.deleteProduct(productId);
      router.push("/admin/product");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading)
    return (
      <CMSLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      </CMSLayout>
    );

  return (
    <CMSLayout>
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/product"
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Edit Product
              </h1>
              <p className="text-xs font-mono text-gray-400">
                UUID: {productId}
              </p>
            </div>
          </div>
          <Link
            href={`/admin/product/${productId}`}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-sm font-semibold"
          >
            <Eye size={16} /> <span>Live Preview</span>
          </Link>
        </div>

        {/* Metadata Card */}
        {product && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8 shadow-sm">
            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-200 flex justify-between items-center">
              <span className="font-bold text-gray-800 text-sm uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid size={16} className="text-accent" /> Product Meta
              </span>
              <div
                className={`px-3 py-1 rounded-full text-[10px] font-black ${product.is_active ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}
              >
                {product.is_active ? "ACTIVE" : "INACTIVE"}
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <label className="text-gray-400 block mb-1">Store Rating</label>
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />{" "}
                  {product.rating.toFixed(1)}
                </div>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Created At</label>
                <p className="font-semibold">
                  {new Date(product.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Last Sync</label>
                <p className="font-semibold">
                  {new Date(product.updated_at).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Brand</label>
                <p className="font-semibold">{formData.brand || "HpLap"}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <X size={16} />
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl text-green-700 text-sm font-bold animate-pulse">
            {success} Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
          {/* Section: Content */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Product Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Product Name
                </label>
                <input
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  className="w-full mt-1.5 px-4 py-3 border border-gray-300 rounded-2xl outline-none font-medium"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full mt-1.5 px-4 py-3 border border-gray-300 rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={
                    formData.price === 0 ? "" : rupiahFormat(formData.price)
                  }
                  onChange={handleChange}
                  className="w-full mt-1.5 px-4 py-3 border border-gray-300 rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Stock Level
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity || ""}
                  onChange={handleChange}
                  className="w-full mt-1.5 px-4 py-3 border border-gray-300 rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Category
                </label>
                <select
                  name="category_id"
                  value={formData.category_id || ""}
                  onChange={handleChange}
                  className="w-full mt-1.5 px-4 py-3 border border-gray-300 rounded-2xl outline-none appearance-none"
                >
                  <option value="">Uncategorized</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-8 items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-5 h-5 rounded-lg text-accent border-gray-300 focus:ring-accent"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-accent transition">
                    Is Active
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded-lg text-accent border-gray-300 focus:ring-accent"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-accent transition">
                    Featured
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section: Media */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-accent" /> Product Media
            </h2>

            {/* Main Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-tighter">
                  Main Showcase Photo
                </label>
                <UploadDropzone
                  label="Swap Main Photo"
                  onFileSelect={(file) => {
                    if (file) {
                      setMainImageFile(file);
                      setMainImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
              <div className="md:col-span-2 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50 p-6 relative">
                {mainImagePreview ? (
                  <img
                    src={mainImagePreview}
                    className="max-h-52 object-contain drop-shadow-xl"
                    alt="Preview"
                  />
                ) : (
                  <div className="text-gray-300 text-center">
                    <ImageIcon size={48} className="mx-auto mb-2 opacity-10" />
                    <p className="text-xs">Waiting for selection...</p>
                  </div>
                )}
                {mainImageFile && (
                  <span className="absolute top-4 right-4 bg-accent text-white text-[10px] px-3 py-1 rounded-full font-black animate-bounce shadow-lg">
                    NEW SELECTION
                  </span>
                )}
              </div>
            </div>

            {/* Additional Images (Gallery) */}
            <div className="pt-8 border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-tighter">
                    Gallery Images
                  </label>
                  <p className="text-xs text-gray-400">
                    Manage multiple angles of the product
                  </p>
                </div>
                <div className="w-44">
                  <UploadDropzone
                    label="Add to gallery"
                    onFileSelect={(file) =>
                      file && handleSelectForStaging(file)
                    }
                  />
                </div>
              </div>

              {/* STAGING AREA (Accept Button) */}
              {stagedPreview && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-3xl flex items-center gap-6 animate-in slide-in-from-top-2">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                    <img
                      src={stagedPreview}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-blue-900">
                      Confirm new image?
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={acceptStagedFile}
                        className="bg-accent text-white px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-blue-700 transition"
                      >
                        <Check size={14} /> Accept
                      </button>
                      <button
                        type="button"
                        onClick={cancelStaging}
                        className="bg-white text-gray-400 px-4 py-1.5 rounded-xl text-xs font-bold border border-blue-100 hover:text-red-500 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* GALLERY GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {/* Gambar Lama di Server */}
                {formData.product_additional_images.map((url, index) => (
                  <div
                    key={`old-${index}`}
                    className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white hover:ring-2 hover:ring-red-500 transition-all"
                  >
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      alt="Saved"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingAdditional(index, url)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-gray-900/50 text-[8px] text-white rounded-md backdrop-blur-sm">
                      SAVED
                    </div>
                  </div>
                ))}
                {/* Gambar Baru di Antrean */}
                {additionalPreviews.map((url, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-accent/20 shadow-sm bg-white hover:ring-2 hover:ring-red-500 transition-all"
                  >
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      alt="New"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewAdditional(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-accent text-[8px] text-white rounded-md font-bold animate-pulse">
                      PENDING
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-gray-200 shadow-xl fixed bottom-6 left-4 right-4 md:left-auto md:right-auto md:w-[854px] z-40">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className={`px-6 py-3 rounded-2xl transition-all flex items-center gap-2 font-bold text-sm ${formData.is_active ? "text-orange-600 hover:bg-orange-50 border border-orange-100" : "text-red-600 hover:bg-red-50 border border-red-100"}`}
            >
              <Trash2 size={18} />{" "}
              <span>
                {formData.is_active ? "Archive Product" : "Delete Permanent"}
              </span>
            </button>
            <div className="flex gap-4 w-full sm:w-auto">
              <Link
                href="/admin/product"
                className="px-8 py-3 text-gray-500 font-bold hover:text-gray-900 transition text-sm"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-10 py-3 bg-accent text-white rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-accent/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-black tracking-wide"
              >
                {isSubmitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {isSubmitting ? "UPLOADING..." : "SAVE PRODUCT"}
              </button>
            </div>
          </div>
        </form>

        {/* Modal Konfirmasi Delete */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-[40px] max-w-md w-full p-10 shadow-2xl animate-in zoom-in duration-200 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <Trash2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                {formData.is_active ? "Archive this product?" : "Danger Zone!"}
              </h3>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                {formData.is_active
                  ? "Product will be hidden from the store but can be restored later."
                  : "This action is irreversible. All data and images associated will be purged."}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={
                    formData.is_active
                      ? handleSoftDelete
                      : handlePermanentDelete
                  }
                  className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition ${formData.is_active ? "bg-orange-500 shadow-orange-200" : "bg-red-600 shadow-red-200"}`}
                >
                  {isDeleting ? "Processing..." : "Confirm Action"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full py-4 text-gray-400 font-bold hover:text-gray-900 transition"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CMSLayout>
  );
}
