// app/admin/products/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Save,
    Package,
    Image as ImageIcon,
    Loader2,
    X,
    Plus,
    Star,
    Trash2,
    Eye
} from 'lucide-react'
import CMSLayout from '@/components/Layout/AdminCMSLayout'
import { productService } from '@/services/product/product.service'
import { categoryService } from '@/services/categories/categories.service'
import { ProductType, ProductModels } from '@/models/product.model'
import { CategoriesModels } from '@/models/categories.model'

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const productId = Number(params.id)

    // Form state
    const [formData, setFormData] = useState({
        product_name: '',
        description: '',
        price: 0,
        stock_quantity: 0,
        product_type: ProductType.WINDOWS,
        product_main_image: '',
        product_additional_images: [] as string[],
        category_id: undefined as number | undefined,
        brand: '',
        is_active: true,
        is_featured: false
    })

    // Original product data
    const [product, setProduct] = useState<ProductModels | null>(null)

    // Additional images input
    const [newImageUrl, setNewImageUrl] = useState('')

    // Categories state
    const [categories, setCategories] = useState<CategoriesModels[]>([])
    const [loadingCategories, setLoadingCategories] = useState(true)

    // UI state
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    // Fetch data on mount
    useEffect(() => {
        if (productId) {
            Promise.all([
                fetchProduct(),
                fetchCategories()
            ])
        }
    }, [productId])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            const data = await productService.getProductById(productId)
            setProduct(data)
            setFormData({
                product_name: data.product_name,
                description: data.description || '',
                price: data.price,
                stock_quantity: data.stock_quantity,
                product_type: data.product_type,
                product_main_image: data.product_main_image || '',
                product_additional_images: data.product_additional_images || [],
                category_id: data.category_id,
                brand: data.brand || '',
                is_active: data.is_active,
                is_featured: data.is_featured
            })
        } catch (err: any) {
            setError(err.message || 'Failed to load product')
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true)
            const data = await categoryService.getAllCategories(true)
            setCategories(data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setLoadingCategories(false)
        }
    }

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({ ...prev, [name]: checked }))
        } else if (name === 'price' || name === 'stock_quantity') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
        } else if (name === 'category_id') {
            setFormData(prev => ({ ...prev, [name]: value ? parseInt(value) : undefined }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    // Handle main image change
    const handleMainImageChange = (url: string) => {
        setFormData(prev => ({ ...prev, product_main_image: url }))
    }

    // Add additional image
    const addAdditionalImage = () => {
        if (newImageUrl && newImageUrl.trim()) {
            setFormData(prev => ({
                ...prev,
                product_additional_images: [...prev.product_additional_images, newImageUrl.trim()]
            }))
            setNewImageUrl('')
        }
    }

    // Remove additional image
    const removeAdditionalImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            product_additional_images: prev.product_additional_images.filter((_, i) => i !== index)
        }))
    }

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!formData.product_name.trim()) {
            setError('Product name is required')
            return
        }

        if (formData.price <= 0) {
            setError('Price must be greater than 0')
            return
        }

        setIsSubmitting(true)
        setError('')
        setSuccess('')

        try {
            await productService.updateProduct(productId, formData)
            setSuccess('Product updated successfully!')

            setTimeout(() => {
                router.push('/admin/product')
                router.refresh()
            }, 2000)
        } catch (err: any) {
            setError(err.message || 'Failed to update product')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle soft delete
    const handleSoftDelete = async () => {
        try {
            setIsDeleting(true)
            await productService.softDeleteProduct(productId)
            router.push('/admin/product')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to delete product')
            setIsDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    // Handle permanent delete
    const handlePermanentDelete = async () => {
        try {
            setIsDeleting(true)
            await productService.deleteProduct(productId)
            router.push('/admin/product')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to delete product')
            setIsDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    // Handle restore
    const handleRestore = async () => {
        try {
            setIsDeleting(true)
            await productService.restoreProduct(productId)
            await fetchProduct()
            setShowDeleteConfirm(false)
        } catch (err: any) {
            setError(err.message || 'Failed to restore product')
        } finally {
            setIsDeleting(false)
        }
    }

    // Format date
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <CMSLayout>
                <div className="p-6 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Loader2 size={40} className="animate-spin text-accent mx-auto mb-4" />
                        <p className="text-gray-600">Loading product...</p>
                    </div>
                </div>
            </CMSLayout>
        )
    }

    return (
        <CMSLayout>
            <div className="p-4 md:p-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/product"
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Product</h1>
                            <p className="text-sm text-gray-500 mt-1">Product ID: {productId}</p>
                        </div>
                    </div>
                    <Link
                        href={`/admin/product/${productId}`}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <Eye size={16} />
                        <span>View Product</span>
                    </Link>
                </div>

                {/* Product Info Card */}
                {product && (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h2 className="font-semibold text-gray-900">Product Information</h2>
                        </div>
                        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Created:</span>
                                <p className="font-medium">{formatDate(product.created_at)}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Last Updated:</span>
                                <p className="font-medium">{formatDate(product.updated_at)}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Rating:</span>
                                <p className="font-medium flex items-center gap-1">
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    {product.rating.toFixed(1)}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500">Status:</span>
                                <p className={`font-medium ${product.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                                    {product.is_active ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3">
                        <div className="flex-1">
                            <p className="font-medium">Error</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                        <button
                            onClick={() => setError('')}
                            className="p-1 hover:bg-red-100 rounded-lg transition"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                        <p className="font-medium">Success</p>
                        <p className="text-sm mt-1">{success} Redirecting...</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        {/* Basic Information */}
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Product Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="product_name"
                                        value={formData.product_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Price <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Stock Quantity */}
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
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Product Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Product Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="product_type"
                                        value={formData.product_type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                                        disabled={isSubmitting}
                                    >
                                        {Object.values(ProductType).map(type => (
                                            <option key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Brand */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Brand
                                    </label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Category
                                    </label>
                                    <select
                                        name="category_id"
                                        value={formData.category_id || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                                        disabled={loadingCategories || isSubmitting}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.category_id} value={cat.category_id}>
                                                {cat.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status Toggles */}
                                <div className="flex gap-6 items-center">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-accent focus:ring-accent"
                                        />
                                        <span className="text-sm">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_featured"
                                            checked={formData.is_featured}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-accent focus:ring-accent"
                                        />
                                        <span className="text-sm">Featured</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Product Images */}
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>

                            {/* Main Image */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Main Image URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.product_main_image}
                                    onChange={(e) => handleMainImageChange(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                                    disabled={isSubmitting}
                                />
                                {formData.product_main_image && (
                                    <div className="mt-2 relative w-32 h-32 border rounded-lg overflow-hidden">
                                        <img
                                            src={formData.product_main_image}
                                            alt="Main preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/placeholder-product.png'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Additional Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Additional Images
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="url"
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={addAdditionalImage}
                                        disabled={!newImageUrl || isSubmitting}
                                        className="px-4 py-2.5 bg-accent text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                {/* Image List */}
                                {formData.product_additional_images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-3 mt-3">
                                        {formData.product_additional_images.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`Additional ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/placeholder-product.png'
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeAdditionalImage(index)}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Delete Confirmation Modal */}
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl max-w-md w-full p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    {formData.is_active ? 'Move to Trash' : 'Delete Permanently'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {formData.is_active
                                        ? 'Are you sure you want to move this product to trash? You can restore it later.'
                                        : 'Are you sure you want to permanently delete this product? This action cannot be undone.'
                                    }
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={formData.is_active ? handleSoftDelete : handlePermanentDelete}
                                        disabled={isDeleting}
                                        className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${formData.is_active
                                                ? 'bg-orange-500 hover:bg-orange-600'
                                                : 'bg-red-500 hover:bg-red-600'
                                            } disabled:opacity-50`}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={16} />
                                                <span>{formData.is_active ? 'Move to Trash' : 'Delete Permanently'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={isSubmitting || isDeleting}
                            className={`px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 ${formData.is_active
                                    ? 'border border-orange-300 text-orange-700 hover:bg-orange-50'
                                    : 'border border-red-300 text-red-700 hover:bg-red-50'
                                }`}
                        >
                            <Trash2 size={18} />
                            <span>{formData.is_active ? 'Move to Trash' : 'Delete Permanently'}</span>
                        </button>

                        <div className="flex gap-3">
                            <Link
                                href="/admin/product"
                                className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-center"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting || !!success || isDeleting}
                                className="px-6 py-2.5 bg-accent text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-w-[140px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </CMSLayout>
    )
}