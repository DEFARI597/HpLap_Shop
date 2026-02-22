'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Loader2,
    X,
    Trash2,
    Eye
} from 'lucide-react'
import CMSLayout from '@/components/Layout/AdminCMSLayout'
import { categoryService } from '@/services/categories/categories.service'

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = Number(params.id);

    // Form state
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isActive, setIsActive] = useState(true);

    // UI state
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Fetch category on mount
    useEffect(() => {
        if (categoryId) {
            fetchCategory();
        }
    }, [categoryId]);

    const fetchCategory = async () => {
        try {
            setLoading(true);
            setError('');
            const category = await categoryService.getCategoryById(categoryId);

            // Populate form
            setCategoryName(category.category_name);
            setCategoryImage(category.category_image || '');
            if (category.category_image) {
                setImagePreview(category.category_image);
            }
            setIsActive(category.is_active);

        } catch (err: any) {
            console.error('Error fetching category:', err);
            setError(err.message || 'Failed to load category');
        } finally {
            setLoading(false);
        }
    };

    // Handle image URL change
    const handleImageUrlChange = (url: string) => {
        setCategoryImage(url);
        if (url && (url.startsWith('http') || url.startsWith('/'))) {
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous messages
        setError('');
        setSuccess('');

        // Validation
        if (!categoryName.trim()) {
            setError('Category name is required');
            return;
        }

        if (categoryName.length > 150) {
            setError('Category name must be less than 150 characters');
            return;
        }

        setIsSubmitting(true);

        try {
            await categoryService.updateCategory(categoryId, {
                category_name: categoryName.trim(),
                category_image: categoryImage.trim() || 'https://via.placeholder.com/150',
                is_active: isActive,
            });

            setSuccess('Category updated successfully!');

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/admin/categories');
                router.refresh();
            }, 2000);

        } catch (error: any) {
            console.error('Error updating category:', error);
            setError(error.message || 'Failed to update category');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle soft delete
    const handleSoftDelete = async () => {
        try {
            setIsDeleting(true);
            setError('');

            if (isActive) {
                // If active, soft delete
                await categoryService.softDeleteCategory(categoryId);
                setSuccess('Category moved to trash successfully!');
            } else {
                // If inactive, restore
                await categoryService.restoreCategory(categoryId);
                setSuccess('Category restored successfully!');
            }

            // Refresh category data
            await fetchCategory();
            setShowDeleteConfirm(false);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess('');
            }, 3000);

        } catch (err: any) {
            console.error('Error updating category status:', err);
            setError(err.message || 'Failed to update category status');
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle permanent delete
    const handlePermanentDelete = async () => {
        try {
            setIsDeleting(true);
            setError('');

            await categoryService.deleteCategory(categoryId);

            // Redirect to categories list
            router.push('/admin/categories');
            router.refresh();

        } catch (err: any) {
            console.error('Error deleting category:', err);
            setError(err.message || 'Failed to delete category');
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    // Format date
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <CMSLayout>
                <div className="p-6 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Loader2 size={40} className="animate-spin text-accent mx-auto mb-4" />
                        <p className="text-gray-600">Loading category...</p>
                    </div>
                </div>
            </CMSLayout>
        );
    }

    return (
        <CMSLayout>
            <div className="p-4 md:p-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/categories"
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Category</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Editing category ID: {categoryId}
                            </p>
                        </div>
                    </div>

                    {/* View Category Link */}
                    <Link
                        href={`/admin/categories/${categoryId}`}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                    >
                        <Eye size={16} />
                        <span>View Category</span>
                    </Link>
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
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-start gap-3">
                        <div className="flex-1">
                            <p className="font-medium">Success</p>
                            <p className="text-sm mt-1">{success}</p>
                        </div>
                    </div>
                )}

                {/* Category Info Card */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="font-semibold text-gray-900">Category Information</h2>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Created:</span>
                            <p className="font-medium">{formatDate(new Date())}</p> {/* Replace with actual createdAt */}
                        </div>
                        <div>
                            <span className="text-gray-500">Last Updated:</span>
                            <p className="font-medium">{formatDate(new Date())}</p> {/* Replace with actual updatedAt */}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        {/* Basic Information */}
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

                            {/* Category Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="e.g., Electronics, Clothing, Books"
                                    className={`w-full px-4 py-2.5 border ${error && !categoryName.trim() ? 'border-red-500' : 'border-gray-300'
                                        } rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition`}
                                    disabled={isSubmitting}
                                />
                                <p className="text-xs text-gray-500 mt-1.5">
                                    Maximum 150 characters. Use clear, descriptive names.
                                </p>
                            </div>

                            {/* Status Toggle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Status
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={isActive}
                                            onChange={() => setIsActive(true)}
                                            className="w-4 h-4 text-accent focus:ring-accent"
                                        />
                                        <span className="text-sm">
                                            <span className="font-medium">Active</span>
                                            <span className="text-gray-500 ml-2 text-xs">Visible in store</span>
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={!isActive}
                                            onChange={() => setIsActive(false)}
                                            className="w-4 h-4 text-accent focus:ring-accent"
                                        />
                                        <span className="text-sm">
                                            <span className="font-medium">Inactive</span>
                                            <span className="text-gray-500 ml-2 text-xs">Hidden from store</span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Category Image */}
                        <div className="p-6 border-t border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Image</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={categoryImage}
                                        onChange={(e) => handleImageUrlChange(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
                                        disabled={isSubmitting}
                                    />
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        Provide a URL for the category image
                                    </p>
                                </div>

                                {/* Image Preview */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Preview
                                    </label>
                                    <div className="border border-gray-200 rounded-xl bg-gray-50 p-4 flex items-center justify-center min-h-[120px]">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="max-h-32 max-w-full object-contain rounded-lg"
                                                    onError={() => {
                                                        setImagePreview(null);
                                                        setError('Invalid image URL. Please check and try again.');
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCategoryImage('');
                                                        setImagePreview(null);
                                                    }}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center py-6">
                                                <ImageIcon size={32} className="mx-auto mb-2 text-gray-400" />
                                                <p className="text-sm text-gray-500">No image selected</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delete Confirmation Modal */}
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl max-w-md w-full p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    {isActive ? 'Move to Trash' : 'Delete Permanently'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {isActive
                                        ? 'Are you sure you want to move this category to trash? You can restore it later.'
                                        : 'Are you sure you want to permanently delete this category? This action cannot be undone.'
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
                                        onClick={isActive ? handleSoftDelete : handlePermanentDelete}
                                        disabled={isDeleting}
                                        className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${isActive
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
                                                <span>{isActive ? 'Move to Trash' : 'Delete Permanently'}</span>
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
                            className={`px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 ${isActive
                                ? 'border border-orange-300 text-orange-700 hover:bg-orange-50'
                                : 'border border-red-300 text-red-700 hover:bg-red-50'
                                }`}
                        >
                            <Trash2 size={18} />
                            <span>{isActive ? 'Move to Trash' : 'Delete Permanently'}</span>
                        </button>

                        <div className="flex gap-3">
                            <Link
                                href="/admin/categories"
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
                                ) : success ? (
                                    <>
                                        <span>Redirecting...</span>
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
    );
}