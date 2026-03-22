'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Edit,
    Trash2,
    Package,
    Star,
    Calendar,
    DollarSign,
    Layers,
    Image as ImageIcon,
    Loader2,
    ShoppingCart,
    Eye,
    Share2,
    Smartphone,
    Monitor,
    Tablet,
    Cpu
} from 'lucide-react'
import CMSLayout from '@/components/Layout/AdminCMSLayout'
import { productService } from '@/services/product/product.service'
import { ProductModels, ProductType } from '@/models/product.model'

export default function ViewProductPage() {
    const router = useRouter()
    const params = useParams()
    const productId = Number(params.id)

    const [product, setProduct] = useState<ProductModels | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [activeImage, setActiveImage] = useState<string>('')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (productId) {
            fetchProduct()
        }
    }, [productId])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await productService.getProductById(productId)
            setProduct(data)
            setActiveImage(data.product_main_image || '')
        } catch (err: any) {
            setError(err.message || 'Failed to load product')
            console.error('Error fetching product:', err)
        } finally {
            setLoading(false)
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

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price)
    }

    // Get product type icon
    const getTypeIcon = (type: ProductType) => {
        switch (type) {
            case ProductType.WINDOWS:
                return <Monitor size={20} className="text-blue-600" />
            case ProductType.ANDROID:
                return <Smartphone size={20} className="text-green-600" />
            case ProductType.IOS:
                return <Tablet size={20} className="text-gray-600" />
            case ProductType.MAC:
                return <Cpu size={20} className="text-purple-600" />
            default:
                return <Package size={20} />
        }
    }

    // Get product type badge color
    const getTypeBadgeColor = (type: ProductType) => {
        const colors = {
            [ProductType.WINDOWS]: 'bg-blue-100 text-blue-800 border-blue-200',
            [ProductType.ANDROID]: 'bg-green-100 text-green-800 border-green-200',
            [ProductType.IOS]: 'bg-gray-100 text-gray-800 border-gray-200',
            [ProductType.MAC]: 'bg-purple-100 text-purple-800 border-purple-200'
        }
        return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200'
    }

    // Get stock status
    const getStockStatus = (quantity: number) => {
        if (quantity > 10) {
            return {
                label: 'In Stock',
                color: 'text-green-600 bg-green-100',
                icon: <Package size={16} className="text-green-600" />
            }
        } else if (quantity > 0) {
            return {
                label: 'Low Stock',
                color: 'text-yellow-600 bg-yellow-100',
                icon: <Package size={16} className="text-yellow-600" />
            }
        } else {
            return {
                label: 'Out of Stock',
                color: 'text-red-600 bg-red-100',
                icon: <Package size={16} className="text-red-600" />
            }
        }
    }

    if (loading) {
        return (
            <CMSLayout>
                <div className="p-6 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Loader2 size={40} className="animate-spin text-accent mx-auto mb-4" />
                        <p className="text-gray-600">Loading product details...</p>
                    </div>
                </div>
            </CMSLayout>
        )
    }

    if (error || !product) {
        return (
            <CMSLayout>
                <div className="p-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <Package size={48} className="mx-auto text-red-400 mb-4" />
                        <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Product</h2>
                        <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
                        <Link
                            href="/admin/product"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Products
                        </Link>
                    </div>
                </div>
            </CMSLayout>
        )
    }

    const stockStatus = getStockStatus(product.stock_quantity)

    return (
        <CMSLayout>
            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/product"
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.product_name}</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Product ID: {product.product_id} | SKU: {product.product_name.substring(0, 3).toUpperCase()}-{product.product_id}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/admin/product/${productId}/edit`}
                            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Edit size={16} />
                            Edit Product
                        </Link>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${product.is_active
                                    ? 'border border-orange-300 text-orange-700 hover:bg-orange-50'
                                    : 'border border-red-300 text-red-700 hover:bg-red-50'
                                }`}
                        >
                            <Trash2 size={16} />
                            {product.is_active ? 'Move to Trash' : 'Delete'}
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {product.is_active ? 'Move to Trash' : 'Delete Permanently'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {product.is_active
                                    ? `Are you sure you want to move "${product.product_name}" to trash? You can restore it later.`
                                    : `Are you sure you want to permanently delete "${product.product_name}"? This action cannot be undone.`
                                }
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={product.is_active ? handleSoftDelete : handlePermanentDelete}
                                    disabled={isDeleting}
                                    className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${product.is_active
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
                                            <span>{product.is_active ? 'Move to Trash' : 'Delete Permanently'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Banner for Inactive Products */}
                {!product.is_active && (
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Package size={20} className="text-orange-600" />
                            <span className="text-orange-700">
                                This product is currently inactive and not visible in the store.
                            </span>
                        </div>
                        <button
                            onClick={handleRestore}
                            disabled={isDeleting}
                            className="px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                        >
                            Restore Product
                        </button>
                    </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-6">
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="font-semibold text-gray-900">Product Images</h2>
                            </div>

                            {/* Main Image */}
                            <div className="p-4">
                                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                                    {activeImage ? (
                                        <img
                                            src={activeImage}
                                            alt={product.product_name}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/placeholder-product.png'
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon size={48} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Gallery */}
                                {product.product_additional_images?.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Additional Images</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {product.product_main_image && (
                                                <button
                                                    onClick={() => setActiveImage(product.product_main_image!)}
                                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${activeImage === product.product_main_image
                                                            ? 'border-accent'
                                                            : 'border-transparent hover:border-gray-300'
                                                        }`}
                                                >
                                                    <img
                                                        src={product.product_main_image}
                                                        alt="Main"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            )}
                                            {product.product_additional_images.map((img, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setActiveImage(img)}
                                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${activeImage === img
                                                            ? 'border-accent'
                                                            : 'border-transparent hover:border-gray-300'
                                                        }`}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Additional ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Info Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="font-semibold text-gray-900">Product Information</h2>
                            </div>
                            <div className="p-4">
                                {/* Description */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {product.description || 'No description provided.'}
                                    </p>
                                </div>

                                {/* Key Details Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <DollarSign size={16} className="text-gray-500" />
                                            <span className="text-xs text-gray-500">Price</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Package size={16} className="text-gray-500" />
                                            <span className="text-xs text-gray-500">Stock</span>
                                        </div>
                                        <p className={`text-lg font-bold ${stockStatus.color.split(' ')[0]}`}>
                                            {product.stock_quantity}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Star size={16} className="text-gray-500" />
                                            <span className="text-xs text-gray-500">Rating</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg font-bold text-gray-900">{product.rating.toFixed(1)}</span>
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Layers size={16} className="text-gray-500" />
                                            <span className="text-xs text-gray-500">Type</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {getTypeIcon(product.product_type)}
                                            <span className="text-sm font-medium text-gray-900">
                                                {product.product_type.charAt(0).toUpperCase() + product.product_type.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Table */}
                                <div className="border-t border-gray-200 pt-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Product Details</h3>
                                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <dt className="text-sm text-gray-500">Brand</dt>
                                            <dd className="text-sm font-medium text-gray-900">{product.brand || 'N/A'}</dd>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <dt className="text-sm text-gray-500">Category</dt>
                                            <dd className="text-sm font-medium text-gray-900">
                                                {product.category?.category_name || 'Uncategorized'}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <dt className="text-sm text-gray-500">Product Type</dt>
                                            <dd className="text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(product.product_type)}`}>
                                                    {product.product_type}
                                                </span>
                                            </dd>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <dt className="text-sm text-gray-500">Status</dt>
                                            <dd className="text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </dd>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <dt className="text-sm text-gray-500">Featured</dt>
                                            <dd className="text-sm">
                                                {product.is_featured ? (
                                                    <span className="text-yellow-600 flex items-center gap-1">
                                                        <Star size={14} className="fill-yellow-400" /> Featured
                                                    </span>
                                                ) : (
                                                    'No'
                                                )}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <dt className="text-sm text-gray-500">Stock Status</dt>
                                            <dd className={`text-sm font-medium ${stockStatus.color.split(' ')[0]}`}>
                                                {stockStatus.label}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="font-semibold text-gray-900">Additional Information</h2>
                            </div>
                            <div className="p-4">
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 py-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <div>
                                            <dt className="text-xs text-gray-500">Created At</dt>
                                            <dd className="text-sm font-medium text-gray-900">{formatDate(product.created_at)}</dd>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 py-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <div>
                                            <dt className="text-xs text-gray-500">Last Updated</dt>
                                            <dd className="text-sm font-medium text-gray-900">{formatDate(product.updated_at)}</dd>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 py-2">
                                        <Eye size={16} className="text-gray-400" />
                                        <div>
                                            <dt className="text-xs text-gray-500">Views</dt>
                                            <dd className="text-sm font-medium text-gray-900">0</dd>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 py-2">
                                        <ShoppingCart size={16} className="text-gray-400" />
                                        <div>
                                            <dt className="text-xs text-gray-500">Orders</dt>
                                            <dd className="text-sm font-medium text-gray-900">0</dd>
                                        </div>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CMSLayout>
    )
}