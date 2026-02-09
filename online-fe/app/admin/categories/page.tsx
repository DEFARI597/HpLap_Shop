'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Edit, Trash2, Eye, Folder } from 'lucide-react'
import CMSLayout from '@/components/Layout/AdminCMSLayout'

// Simple mock data
const categories = [
    { id: 1, name: 'Smartphones', slug: 'smartphones', products: 42, status: 'active' },
    { id: 2, name: 'Laptops', slug: 'laptops', products: 28, status: 'active' },
    { id: 3, name: 'Tablets', slug: 'tablets', products: 15, status: 'active' },
    { id: 4, name: 'Accessories', slug: 'accessories', products: 67, status: 'active' },
    { id: 5, name: 'Gaming', slug: 'gaming', products: 23, status: 'inactive' },
]

export default function CategoriesPage() {
    const [search, setSearch] = useState('')
    const [selectedCategories, setSelectedCategories] = useState<number[]>([])

    // Filter categories
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.slug.includes(search)
    )

    // Toggle selection
    const toggleSelection = (id: number) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    // Delete category
    const deleteCategory = (id: number) => {
        if (confirm('Delete this category?')) {
            console.log('Deleted:', id)
        }
    }

    // Bulk delete
    const deleteSelected = () => {
        if (selectedCategories.length === 0) return
        if (confirm(`Delete ${selectedCategories.length} categories?`)) {
            console.log('Deleted:', selectedCategories)
            setSelectedCategories([])
        }
    }

    return (
        <CMSLayout>
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600">Manage product categories</p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Category
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600">Total Categories</p>
                            <p className="text-2xl font-bold mt-1">{categories.length}</p>
                        </div>
                        <Folder className="text-blue-600" size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600">Active Categories</p>
                            <p className="text-2xl font-bold mt-1">
                                {categories.filter(c => c.status === 'active').length}
                            </p>
                        </div>
                        <Folder className="text-green-600" size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold mt-1">
                                {categories.reduce((sum, cat) => sum + cat.products, 0)}
                            </p>
                        </div>
                        <Folder className="text-purple-600" size={24} />
                    </div>
                </div>
            </div>

            {/* Search & Actions */}
            <div className="bg-white p-6 rounded-lg border mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Bulk Actions */}
                    {selectedCategories.length > 0 && (
                        <div className="flex gap-3">
                            <button
                                onClick={deleteSelected}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                            >
                                Delete Selected ({selectedCategories.length})
                            </button>
                            <button
                                onClick={() => setSelectedCategories([])}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.length === filteredCategories.length}
                                        onChange={() => {
                                            if (selectedCategories.length === filteredCategories.length) {
                                                setSelectedCategories([])
                                            } else {
                                                setSelectedCategories(filteredCategories.map(c => c.id))
                                            }
                                        }}
                                        className="rounded"
                                    />
                                </th>
                                <th className="p-4 text-left font-semibold">Name</th>
                                <th className="p-4 text-left font-semibold">Slug</th>
                                <th className="p-4 text-left font-semibold">Products</th>
                                <th className="p-4 text-left font-semibold">Status</th>
                                <th className="p-4 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map((category) => (
                                <tr key={category.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={() => toggleSelection(category.id)}
                                            className="rounded"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium">{category.name}</div>
                                    </td>
                                    <td className="p-4">
                                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                            {category.slug}
                                        </code>
                                    </td>
                                    <td className="p-4">{category.products}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${category.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {category.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/categories/${category.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                title="View"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link
                                                href={`/admin/categories/${category.id}/edit`}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => deleteCategory(category.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredCategories.length === 0 && (
                    <div className="py-12 text-center">
                        <Folder className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No categories found</h3>
                        <p className="text-gray-600 mb-6">
                            {search ? 'Try a different search term' : 'Create your first category'}
                        </p>
                        <Link
                            href="/admin/categories/new"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            <Plus size={18} />
                            Add Category
                        </Link>
                    </div>
                )}
            </div>
        </div>
        </CMSLayout>
    )
}