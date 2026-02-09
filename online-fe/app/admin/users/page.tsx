'use client'

import { useState} from 'react'
import Link from 'next/link'
import {
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Mail,
    Phone,
    Calendar,
    UserCheck,
    UserX,
    Download,
    Plus
} from 'lucide-react'
import CMSLayout from '@/components/Layout/AdminCMSLayout'

// Mock user data - replace with API call
const mockUsers = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        role: 'Administrator',
        status: 'active',
        joinDate: '2024-01-15',
        lastLogin: '2024-03-20 14:30',
        avatar: 'JS',
        orders: 42,
        totalSpent: '$5,240.00'
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 987-6543',
        role: 'Customer',
        status: 'active',
        joinDate: '2024-02-10',
        lastLogin: '2024-03-19 10:15',
        avatar: 'SJ',
        orders: 18,
        totalSpent: '$2,150.00'
    },
    {
        id: 3,
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        phone: '+1 (555) 456-7890',
        role: 'Customer',
        status: 'inactive',
        joinDate: '2024-01-05',
        lastLogin: '2024-02-28 16:45',
        avatar: 'MC',
        orders: 5,
        totalSpent: '$680.00'
    },
    {
        id: 4,
        name: 'Emma Wilson',
        email: 'emma.wilson@example.com',
        phone: '+1 (555) 321-0987',
        role: 'Moderator',
        status: 'active',
        joinDate: '2024-03-01',
        lastLogin: '2024-03-20 09:20',
        avatar: 'EW',
        orders: 0,
        totalSpent: '$0.00'
    },
    {
        id: 5,
        name: 'David Brown',
        email: 'david.b@example.com',
        phone: '+1 (555) 654-3210',
        role: 'Customer',
        status: 'suspended',
        joinDate: '2024-02-20',
        lastLogin: '2024-03-10 11:30',
        avatar: 'DB',
        orders: 12,
        totalSpent: '$1,540.00'
    },
]

const roleColors = {
    Administrator: 'bg-purple-100 text-purple-800',
    Moderator: 'bg-blue-100 text-blue-800',
    Customer: 'bg-gray-100 text-gray-800',
    Vendor: 'bg-green-100 text-green-800',
}

const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800',
    pending: 'bg-orange-100 text-orange-800',
}

export default function UsersPage() {
    const [users, setUsers] = useState(mockUsers)
    const [search, setSearch] = useState('')
    const [selectedRole, setSelectedRole] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Filter users based on search, role, and status
    const filteredUsers = users.filter(user => {
        const matchesSearch = search === '' ||
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.phone.includes(search)

        const matchesRole = selectedRole === 'all' || user.role === selectedRole
        const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus

        return matchesSearch && matchesRole && matchesStatus
    })

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

    // Handle user selection
    const toggleUserSelection = (userId: number) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        )
    }

    const selectAllUsers = () => {
        if (selectedUsers.length === paginatedUsers.length) {
            setSelectedUsers([])
        } else {
            setSelectedUsers(paginatedUsers.map(user => user.id))
        }
    }

    // Actions
    const deleteUser = (userId: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(prev => prev.filter(user => user.id !== userId))
            setSelectedUsers(prev => prev.filter(id => id !== userId))
        }
    }

    const deleteSelectedUsers = () => {
        if (selectedUsers.length === 0) return
        if (confirm(`Delete ${selectedUsers.length} selected users?`)) {
            setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)))
            setSelectedUsers([])
        }
    }

    const toggleUserStatus = (userId: number, newStatus: string) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            )
        )
    }

    return (
        <CMSLayout>
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                    <p className="text-gray-600 mt-1">
                        Manage user accounts, permissions, and access
                    </p>
                </div>

                <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Download size={16} />
                        Export
                    </button>
                    <Link
                        href="/admin/users/new"
                        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add User
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <UserCheck className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <p className="text-green-600 text-sm mt-2">+12% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Active Users</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {users.filter(u => u.status === 'active').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                            <UserCheck className="text-green-600" size={24} />
                        </div>
                    </div>
                    <p className="text-green-600 text-sm mt-2">92% active rate</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">New This Month</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">28</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                            <UserCheck className="text-purple-600" size={24} />
                        </div>
                    </div>
                    <p className="text-green-600 text-sm mt-2">+8 from last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Pending</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {users.filter(u => u.status === 'pending').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <UserX className="text-yellow-600" size={24} />
                        </div>
                    </div>
                    <p className="text-red-600 text-sm mt-2">Requires attention</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users by name, email, or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                        >
                            <option value="all">All Roles</option>
                            <option value="Administrator">Administrator</option>
                            <option value="Moderator">Moderator</option>
                            <option value="Customer">Customer</option>
                            <option value="Vendor">Vendor</option>
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                            <option value="pending">Pending</option>
                        </select>

                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Filter size={16} />
                            More Filters
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-blue-700 font-medium">
                                {selectedUsers.length} users selected
                            </span>
                            <button
                                onClick={deleteSelectedUsers}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                            >
                                Delete Selected
                            </button>
                            <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                                Activate Selected
                            </button>
                            <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200">
                                Suspend Selected
                            </button>
                        </div>
                        <button
                            onClick={() => setSelectedUsers([])}
                            className="text-blue-700 hover:text-blue-800 text-sm"
                        >
                            Clear Selection
                        </button>
                    </div>
                )}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                                        onChange={selectAllUsers}
                                        className="rounded border-gray-300 text-accent focus:ring-accent"
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Joined
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Orders
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Total Spent
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => toggleUserSelection(user.id)}
                                            className="rounded border-gray-300 text-accent focus:ring-accent"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-semibold">
                                                {user.avatar}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                    <Mail size={12} />
                                                    {user.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                    <Phone size={12} />
                                                    {user.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role as keyof typeof roleColors]}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[user.status as keyof typeof statusColors]}`}>
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                            {user.status === 'active' ? (
                                                <button
                                                    onClick={() => toggleUserStatus(user.id, 'suspended')}
                                                    className="text-xs text-red-600 hover:text-red-700"
                                                >
                                                    Suspend
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => toggleUserStatus(user.id, 'active')}
                                                    className="text-xs text-green-600 hover:text-green-700"
                                                >
                                                    Activate
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Calendar size={14} />
                                            {new Date(user.joinDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{user.orders}</div>
                                        <div className="text-xs text-gray-500">orders</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{user.totalSpent}</div>
                                        <div className="text-xs text-gray-500">lifetime</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link
                                                href={`/admin/users/${user.id}/edit`}
                                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                                                title="Edit User"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {paginatedUsers.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <UserX className="text-gray-400" size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            No users match your search criteria. Try adjusting your filters or search term.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {filteredUsers.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{' '}
                            {filteredUsers.length} users
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded ${currentPage === page
                                        ? 'bg-accent text-white'
                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </CMSLayout>
    )
}