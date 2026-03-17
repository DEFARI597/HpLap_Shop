'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Save,
    Loader2,
    X,
    Plus,
} from 'lucide-react'
import CMSLayout from '@/components/Layout/AdminCMSLayout'
import { productService } from '@/services/product/product.service'
import { categoryService } from '@/services/categories/categories.service'
import { ProductType } from '@/models/product.model'
import { CategoriesModels } from '@/models/categories.model'

export default function AddProductPage() {
    const router = useRouter()

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

    // Additional images input
    const [newImageUrl, setNewImageUrl] = useState('')

    // Categories state
    const [categories, setCategories] = useState<CategoriesModels[]>([])
    const [loadingCategories, setLoadingCategories] = useState(true)

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories()
    }, [])

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
            await productService.createProduct(formData)
            setSuccess('Product created successfully!')

            setTimeout(() => {
                router.push('/admin/product')
                router.refresh()
            }, 2000)
        } catch (err: any) {
            setError(err.message || 'Failed to create product')
        } finally {
            setIsSubmitting(false)
        }
    }

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
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Product</h1>
                        <p className="text-sm text-gray-500 mt-1">Create a new product for your store</p>
                    </div>
                </div>

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
                                        placeholder="e.g., Windows 11 Pro"
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
                                        placeholder="Product description..."
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
                                        placeholder="e.g., Microsoft, Apple"
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
                                    placeholder="https://example.com/main-image.jpg"
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

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <Link
                            href="/admin/product"
                            className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting || !!success}
                            className="px-6 py-2.5 bg-accent text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-w-[140px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Creating...</span>
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
    )
}