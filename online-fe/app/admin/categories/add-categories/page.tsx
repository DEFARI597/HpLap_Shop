'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Save,
    Folder,
    Image as ImageIcon,
    Loader2,
    X
} from 'lucide-react'
import CMSLayout from '@/components/Layout/AdminCMSLayout'
import { categoryService } from '@/services/categories/categories.service'

export default function AddCategoryPage() {
    const router = useRouter();

    // Form state
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isActive, setIsActive] = useState(true);

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle image URL change
    const handleImageUrlChange = (url: string) => {
        setCategoryImage(url);
        if (url && (url.startsWith('http') || url.startsWith('/'))) {
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    };

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
            await categoryService.createCategory({
                category_name: categoryName.trim(),
                category_image: categoryImage.trim() || 'https://via.placeholder.com/150',
                is_active: isActive,
            });

            setSuccess('Category created successfully!');

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/admin/categories');
                router.refresh();
            }, 2000);

        } catch (error: any) {
            console.error('Error creating category:', error);
            setError(error.message || 'Failed to create category');
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
                        href="/admin/categories"
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Category</h1>
                        <p className="text-sm text-gray-500 mt-1">Create a new category for your products</p>
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
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-start gap-3">
                        <div className="flex-1">
                            <p className="font-medium">Success</p>
                            <p className="text-sm mt-1">{success} Redirecting...</p>
                        </div>
                    </div>
                )}

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

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <Link
                            href="/admin/categories"
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
                            ) : success ? (
                                <>
                                    <span>Redirecting...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Create Category</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </CMSLayout>
    );
}