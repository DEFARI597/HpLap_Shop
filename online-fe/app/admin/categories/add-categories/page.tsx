'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Loader2,
    X,
    FolderPlus
} from 'lucide-react'
import CMSLayout from '@/components/Layout/AdminCMSLayout'
import UploadDropzone from '@/components/Upload/ImageUpload'
import { UploadService } from '@/services/upload/upload.service'
import { ImageFolder } from '@/services/upload/types/upload-response.type'
import { categoryService } from '@/services/categories/categories.service'

const uploadService = new UploadService();

export default function AddCategoryPage() {
    const router = useRouter();
    const [categoryImage, setCategoryImage] = useState<File | null>(null);
    const [categoryName, setCategoryName] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!categoryName.trim()) {
            setError('Category name is required');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await categoryService.createCategory({
                category_name: categoryName.trim(),
                is_active: isActive,
            }) as any;

            const newCategoryId = res.data?.category_id || res.category_id;

            if (!newCategoryId) {
                throw new Error("Category saved but ID not returned from server");
            }

            if (categoryImage) {
                await uploadService.UploadCategoriesImage(
                    categoryImage,
                    ImageFolder.CATEGORIES,
                    newCategoryId
                );
            }

            setSuccess('Category created successfully!');

            setTimeout(() => {
                router.push('/admin/categories');
                router.refresh();
            }, 2000);

        } catch (err: any) {
            console.error('Error creating category:', err);
            setError(err.message || 'Failed to create category');
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
                        <p className="text-sm text-gray-500 mt-1">Organize your HpLap products with a new category</p>
                    </div>
                </div>

                {/* Feedback Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                        <div className="flex-1 text-sm font-medium">{error}</div>
                        <button onClick={() => setError('')} className="p-1 hover:bg-red-100 rounded-lg"><X size={16} /></button>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium animate-in zoom-in-95">
                        {success} Redirecting...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        
                        {/* Section: Basic Info */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-2 mb-4 text-blue-600">
                                <FolderPlus size={20} />
                                <h2 className="text-lg font-semibold">Basic Information</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Category Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        placeholder="e.g., Laptops, Components, Accessories"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        disabled={isSubmitting}
                                    />
                                    <p className="text-[11px] text-gray-400 mt-2">Max 150 characters.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Visibility Status</label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsActive(true)}
                                            className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                                                isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 bg-gray-50 text-gray-500'
                                            }`}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                            <span className="text-sm font-medium">Active</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsActive(false)}
                                            className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                                                !isActive ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 bg-gray-50 text-gray-500'
                                            }`}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${!isActive ? 'bg-orange-500' : 'bg-gray-300'}`} />
                                            <span className="text-sm font-medium">Inactive</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Media */}
                        <div className="p-6 bg-gray-50/30">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Icon/Image</h2>
                            <div className="max-w-md">
                                <UploadDropzone
                                    label="Upload Category Image"
                                    onFileSelect={(file) => setCategoryImage(file)}
                                />
                                
                                {categoryImage && (
                                    <div className="mt-3 flex items-center justify-between p-3 bg-white border border-blue-100 rounded-xl shadow-sm animate-in slide-in-from-left-2">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <ImageIcon size={18} className="text-blue-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-gray-700 truncate max-w-[200px]">{categoryImage.name}</span>
                                                <span className="text-[10px] text-gray-400">Ready to upload</span>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => setCategoryImage(null)}
                                            className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pb-10">
                        <Link
                            href="/admin/categories"
                            className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting || !!success}
                            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-100 transition-all flex items-center justify-center gap-2 min-w-[160px]"
                        >
                            {isSubmitting ? (
                                <><Loader2 size={18} className="animate-spin" /><span>Saving...</span></>
                            ) : (
                                <><Save size={18} /><span>Create Category</span></>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </CMSLayout>
    );
}