'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Plus, Edit, Folder, Loader2 } from 'lucide-react'
import CMSLayout from '@/components/Layout/AdminCMSLayout'
import { categoryService } from '@/services/categories/categories.service'
import { CategoriesModels } from '@/models/categories.model'

export default function CategoriesPage() {
    const [search, setSearch] = useState('')
    const [selectedCategories, setSelectedCategories] = useState<number[]>([])
    const [categories, setCategories] = useState<CategoriesModels[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionLoading, setActionLoading] = useState<number | null>(null)


    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await categoryService.getAllCategories()
            setCategories(data)
        } catch (err: any) {
            setError(err.message || 'Failed to load categories')
            console.error('Error fetching categories:', err)
        } finally {
            setLoading(false)
        }
    }

    // Filter categories based on search
    const filteredCategories = categories.filter(cat => {
        if (!search) return true
        const searchLower = search.toLowerCase()
        return (
            cat.category_name.toLowerCase().includes(searchLower) ||
            cat.category_id.toString().includes(search)
        )
    })

    // Toggle selection
    const toggleSelection = (id: number) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    // Toggle all selection
    const toggleAllSelection = () => {
        if (selectedCategories.length === filteredCategories.length) {
            setSelectedCategories([])
        } else {
            setSelectedCategories(filteredCategories.map(c => c.category_id))
        }
    }

    // Delete category permanently
    const deleteCategory = async (id: number) => {
        if (!confirm('Are you sure you want to permanently delete this category? This action cannot be undone.')) {
            return
        }

        try {
            setActionLoading(id)
            await categoryService.deleteCategory(id)
            await fetchCategories()
            setSelectedCategories(prev => prev.filter(i => i !== id))
        } catch (err: any) {
            alert(err.message || 'Failed to delete category')
        } finally {
            setActionLoading(null)
        }
    }

    // Soft delete category
    const softDeleteCategory = async (id: number) => {
        if (!confirm('Are you sure you want to move this category to trash?')) {
            return
        }

        try {
            setActionLoading(id)
            await categoryService.softDeleteCategory(id)
            await fetchCategories()
            setSelectedCategories(prev => prev.filter(i => i !== id))
        } catch (err: any) {
            alert(err.message || 'Failed to move category to trash')
        } finally {
            setActionLoading(null)
        }
    }

    // Restore category
    const restoreCategory = async (id: number) => {
        try {
            setActionLoading(id)
            await categoryService.restoreCategory(id)
            await fetchCategories()
        } catch (err: any) {
            alert(err.message || 'Failed to restore category')
        } finally {
            setActionLoading(null)
        }
    }

    // Bulk delete permanently
    const bulkDeletePermanent = async () => {
        if (selectedCategories.length === 0) return

        if (!confirm(`Are you sure you want to permanently delete ${selectedCategories.length} categories? This action cannot be undone.`)) {
            return
        }

        try {
            setActionLoading(-1)
            for (const id of selectedCategories) {
                await categoryService.deleteCategory(id)
            }
            await fetchCategories()
            setSelectedCategories([])
        } catch (err: any) {
            alert(err.message || 'Failed to delete categories')
        } finally {
            setActionLoading(null)
        }
    }

    // Bulk soft delete
    const bulkSoftDelete = async () => {
        if (selectedCategories.length === 0) return

        if (!confirm(`Are you sure you want to move ${selectedCategories.length} categories to trash?`)) {
            return
        }

        try {
            setActionLoading(-1)
            for (const id of selectedCategories) {
                await categoryService.softDeleteCategory(id)
            }
            await fetchCategories()
            setSelectedCategories([])
        } catch (err: any) {
            alert(err.message || 'Failed to move categories to trash')
        } finally {
            setActionLoading(null)
        }
    }

    // Bulk restore
    const bulkRestore = async () => {
        if (selectedCategories.length === 0) return

        try {
            setActionLoading(-1)
            for (const id of selectedCategories) {
                await categoryService.restoreCategory(id)
            }
            await fetchCategories()
            setSelectedCategories([])
        } catch (err: any) {
            alert(err.message || 'Failed to restore categories')
        } finally {
            setActionLoading(null)
        }
    }

    // Toggle single category status
    const toggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            setActionLoading(id)
            await categoryService.updateCategory(id, { is_active: !currentStatus })
            await fetchCategories()
        } catch (err: any) {
            alert(err.message || 'Failed to update category status')
        } finally {
            setActionLoading(null)
        }
    }

    // Get stats
    const getStats = async () => {
        try {
            return await categoryService.getCategoryStats()
        } catch (err) {
            console.error('Error fetching stats:', err)
            return { total: categories.length, active: 0 }
        }
    }

    const [stats, setStats] = useState({ total: 0, active: 0 })

    useEffect(() => {
        getStats().then(setStats)
    }, [categories])

    // Format date
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <CMSLayout>
                <div className="p-6 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Loader2 size={40} className="animate-spin text-accent mx-auto mb-4" />
                        <p className="text-gray-600">Loading categories...</p>
                    </div>
                </div>
            </CMSLayout>
        )
    }

    return (
        <CMSLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Categories</h1>
                        <p className="text-gray-600 mt-1">Manage your product categories</p>
                    </div>
                    <Link
                        href="/admin/categories/add-categories"
                        className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                    >
                        <Plus size={18} />
                        Add Category
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Categories</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Folder className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Active Categories</p>
                                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Folder className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Inactive Categories</p>
                                <p className="text-2xl font-bold text-gray-500">{stats.total - stats.active}</p>
                            </div>
                            <div className="p-3 bg-gray-100 rounded-lg">
                                <Folder className="text-gray-500" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                                <p className="text-lg font-bold text-purple-600">
                                    {categories.length > 0
                                        ? formatDate(categories[0].updatedAt)
                                        : 'N/A'
                                    }
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Folder className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        <p className="font-medium">Error</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}


                {/* Search & Actions */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search categories by name or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                            />
                        </div>

                        {/* Bulk Actions */}
                        {selectedCategories.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={bulkSoftDelete}
                                    disabled={actionLoading !== null}
                                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors disabled:opacity-50"
                                >
                                    Move to Trash ({selectedCategories.length})
                                </button>
                                <button
                                    onClick={bulkRestore}
                                    disabled={actionLoading !== null}
                                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                                >
                                    Restore ({selectedCategories.length})
                                </button>
                                <button
                                    onClick={bulkDeletePermanent}
                                    disabled={actionLoading !== null}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                >
                                    Delete Permanently ({selectedCategories.length})
                                </button>
                                <button
                                    onClick={() => setSelectedCategories([])}
                                    disabled={actionLoading !== null}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Categories Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 w-12">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                                            onChange={toggleAllSelection}
                                            className="rounded"
                                            disabled={actionLoading !== null}
                                        />
                                    </th>
                                    <th className="p-4 text-left font-semibold">Category</th>
                                    <th className="p-4 text-left font-semibold">Slug</th>
                                    <th className="p-4 text-left font-semibold">Status</th>
                                    <th className="p-4 text-left font-semibold">Created At</th>
                                    <th className="p-4 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((category) => {
                                        const isSelected = selectedCategories.includes(category.category_id)
                                        const isLoading = actionLoading === category.category_id
                                        const slug = category.category_name.toLowerCase().replace(/\s+/g, '-')

                                        return (
                                            <tr key={category.category_id} className="border-t hover:bg-gray-50">
                                                <td className="p-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleSelection(category.category_id)}
                                                        className="rounded"
                                                        disabled={actionLoading !== null}
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {category.category_image ? (
                                                            <img
                                                                src={category.category_image}
                                                                alt={category.category_name}
                                                                className="w-10 h-10 object-cover rounded-lg"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = '/placeholder-category.png'
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                <Folder size={20} className="text-yellow-500" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium">{category.category_name}</div>
                                                            <div className="text-xs text-gray-500">ID: {category.category_id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                                        {slug}
                                                    </code>
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => toggleStatus(category.category_id, category.is_active)}
                                                        disabled={isLoading}
                                                        className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${category.is_active
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {isLoading ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            category.is_active ? 'Active' : 'Inactive'
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    {formatDate(category.createdAt)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={`/admin/categories/${category.category_id}/edit`}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                            title="Edit Category"
                                                        >
                                                            <Edit size={16} />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">
                                            No categories found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </CMSLayout>
    )
}