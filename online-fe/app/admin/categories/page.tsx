'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Plus, Edit, Trash2, Eye, Folder, Loader2, ChevronDown, ChevronRight } from 'lucide-react'
import CMSLayout from '@/components/Layout/AdminCMSLayout'
import { categoryService } from '@/services/categories/categories.service'
import { CategoriesEntity } from '@/models/categories.model'

export default function CategoriesPage() {
    const router = useRouter();
    const [search, setSearch] = useState('')
    const [selectedCategories, setSelectedCategories] = useState<number[]>([])
    const [categories, setCategories] = useState<CategoriesEntity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionLoading, setActionLoading] = useState<number | null>(null)
    const [expandedCategories, setExpandedCategories] = useState<number[]>([])
    const [showHierarchy, setShowHierarchy] = useState(true)

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await categoryService.getAllCategories(showHierarchy)
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

    // Toggle category expansion in tree view
    const toggleExpand = (id: number, e: React.MouseEvent) => {
        e.stopPropagation()
        setExpandedCategories(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    // Delete category
    const deleteCategory = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            return
        }

        try {
            setActionLoading(id)
            await categoryService.deleteCategory(id)
            await fetchCategories() // Refresh list
            setSelectedCategories(prev => prev.filter(i => i !== id))
        } catch (err: any) {
            alert(err.message || 'Failed to delete category')
        } finally {
            setActionLoading(null)
        }
    }

    // Bulk delete
    const deleteSelected = async () => {
        if (selectedCategories.length === 0) return

        if (!confirm(`Are you sure you want to delete ${selectedCategories.length} categories?`)) {
            return
        }

        try {
            setActionLoading(-1) // Special loading state for bulk
            // Delete one by one since bulk delete might not be implemented
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

    // Bulk update status
    const bulkUpdateStatus = async (isActive: boolean) => {
        if (selectedCategories.length === 0) return

        try {
            setActionLoading(-1)
            await categoryService.bulkUpdateStatus({
                ids: selectedCategories,
                isActive
            })
            await fetchCategories()
            setSelectedCategories([])
        } catch (err: any) {
            alert(err.message || 'Failed to update categories')
        } finally {
            setActionLoading(null)
        }
    }

    // Toggle single category status
    const toggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            setActionLoading(id)
            await categoryService.toggleCategoryStatus(id, currentStatus)
            await fetchCategories()
        } catch (err: any) {
            alert(err.message || 'Failed to update category status')
        } finally {
            setActionLoading(null)
        }
    }

    // Get stats
    const stats = {
        total: categories.length,
        active: categories.filter(c => c.is_active).length,
        inactive: categories.filter(c => !c.is_active).length,
        topLevel: categories.filter(c => !c.parent_category_id).length
    }

    // Render category row with hierarchy
    const renderCategoryRow = (category: CategoriesEntity, level = 0) => {
        const hasChildren = category.children && category.children.length > 0
        const isExpanded = expandedCategories.includes(category.category_id)
        const isSelected = selectedCategories.includes(category.category_id)
        const isLoading = actionLoading === category.category_id

        return (
            <tbody key={category.category_id}>
                <tr className="border-t hover:bg-gray-50">
                    <td className="p-4" style={{ paddingLeft: `${level * 32 + 16}px` }}>
                        <div className="flex items-center">
                            {hasChildren ? (
                                <button
                                    onClick={(e) => toggleExpand(category.category_id, e)}
                                    className="p-1 hover:bg-gray-200 rounded mr-2"
                                >
                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>
                            ) : (
                                <span className="w-6 mr-2" />
                            )}
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelection(category.category_id)}
                                className="rounded mr-3"
                                disabled={actionLoading !== null}
                            />
                        </div>
                    </td>
                    <td className="p-4">
                        <div className="flex items-center gap-2">
                            {category.category_image ? (
                                <img
                                    src={category.category_image}
                                    alt={category.category_name}
                                    className="w-8 h-8 object-cover rounded"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder-category.png'
                                    }}
                                />
                            ) : (
                                <Folder size={20} className="text-yellow-500" />
                            )}
                            <div>
                                <div className="font-medium">{category.category_name}</div>
                                <div className="text-xs text-gray-500">ID: {category.category_id}</div>
                            </div>
                        </div>
                    </td>
                    <td className="p-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {category.category_name.toLowerCase().replace(/\s+/g, '-')}
                        </code>
                    </td>
                    <td className="p-4">
                        {category.children?.length || 0}
                    </td>
                    <td className="p-4">
                        <button
                            onClick={() => toggleStatus(category.category_id, category.is_active)}
                            disabled={isLoading}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${category.is_active
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
                    <td className="p-4">
                        <div className="flex gap-2">
                            <Link
                                href={`/admin/categories/${category.category_id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="View Details"
                            >
                                <Eye size={16} />
                            </Link>
                            <Link
                                href={`/admin/categories/${category.category_id}/edit`}
                                className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Edit Category"
                            >
                                <Edit size={16} />
                            </Link>
                            <button
                                onClick={() => deleteCategory(category.category_id)}
                                disabled={isLoading}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                title="Delete Category"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </td>
                </tr>
                {hasChildren && isExpanded && category.children?.map(child => renderCategoryRow(child, level + 1))}
            </tbody>
        )
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
                        <p className="text-gray-600 mt-1">Manage your product categories and hierarchy</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowHierarchy(!showHierarchy)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                            {showHierarchy ? 'Flat View' : 'Tree View'}
                        </button>
                        <Link
                            href="/admin/categories/add-categories"
                            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                        >
                            <Plus size={18} />
                            Add Category
                        </Link>
                    </div>
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
                                <p className="text-2xl font-bold text-gray-500">{stats.inactive}</p>
                            </div>
                            <div className="p-3 bg-gray-100 rounded-lg">
                                <Folder className="text-gray-500" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Top Level</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.topLevel}</p>
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
                                    onClick={() => bulkUpdateStatus(true)}
                                    disabled={actionLoading !== null}
                                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                                >
                                    Activate ({selectedCategories.length})
                                </button>
                                <button
                                    onClick={() => bulkUpdateStatus(false)}
                                    disabled={actionLoading !== null}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    Deactivate ({selectedCategories.length})
                                </button>
                                <button
                                    onClick={deleteSelected}
                                    disabled={actionLoading !== null}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                >
                                    Delete ({selectedCategories.length})
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
                                    <th className="p-4 text-left font-semibold">Subcategories</th>
                                    <th className="p-4 text-left font-semibold">Status</th>
                                    <th className="p-4 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            {filteredCategories.length > 0 ? (
                                showHierarchy ? (
                                    // Tree view
                                    filteredCategories
                                        .filter(cat => !cat.parent_category_id) // Only top-level categories
                                        .map(cat => renderCategoryRow(cat))
                                ) : (
                                    // Flat view
                                    <tbody>
                                        {filteredCategories.map((category) => (
                                            <tr key={category.category_id} className="border-t hover:bg-gray-50">
                                                <td className="p-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(category.category_id)}
                                                        onChange={() => toggleSelection(category.category_id)}
                                                        className="rounded"
                                                        disabled={actionLoading !== null}
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        {category.category_image ? (
                                                            <img
                                                                src={category.category_image}
                                                                alt={category.category_name}
                                                                className="w-8 h-8 object-cover rounded"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = '/placeholder-category.png'
                                                                }}
                                                            />
                                                        ) : (
                                                            <Folder size={20} className="text-yellow-500" />
                                                        )}
                                                        <div>
                                                            <div className="font-medium">{category.category_name}</div>
                                                            <div className="text-xs text-gray-500">ID: {category.category_id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                                        {category.category_name.toLowerCase().replace(/\s+/g, '-')}
                                                    </code>
                                                </td>
                                                <td className="p-4">
                                                    {category.children?.length || 0}
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => toggleStatus(category.category_id, category.is_active)}
                                                        disabled={actionLoading === category.category_id}
                                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${category.is_active
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {actionLoading === category.category_id ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            category.is_active ? 'Active' : 'Inactive'
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={`/admin/categories/${category.category_id}`}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>
                                                        <Link
                                                            href={`/admin/categories/${category.category_id}/edit`}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                            title="Edit Category"
                                                        >
                                                            <Edit size={16} />
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteCategory(category.category_id)}
                                                            disabled={actionLoading === category.category_id}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                                            title="Delete Category"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                )
                            ) : null}
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredCategories.length === 0 && (
                        <div className="py-16 text-center">
                            <Folder className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {search ? 'No categories found' : 'No categories yet'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {search
                                    ? `No results for "${search}". Try a different search term.`
                                    : 'Get started by creating your first category.'}
                            </p>
                            {!search && (
                                <Link
                                    href="/admin/categories/add"
                                    className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    <Plus size={18} />
                                    Create First Category
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </CMSLayout>
    )
}