'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Mail,
    Phone,
    Calendar,
    UserCheck,
    UserX,
    Download,
    Shield,
    User as UserIcon,
    RefreshCw
} from 'lucide-react'
import CMSLayout from '@/components/Layout/AdminCMSLayout'
import { adminService } from '@/services/admin/admin.service'
import { UserDto } from '@/services/admin/types/users/users.dto'

interface UIUser {
    id: string | number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    createdAt: Date | string;
}

const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-800',
    moderator: 'bg-blue-100 text-blue-800',
    user: 'bg-gray-100 text-gray-800',
    customer: 'bg-green-100 text-green-800',
}

const ITEMS_PER_PAGE = 10

export default function UsersPage() {
    const [users, setUsers] = useState<UIUser[]>([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<(string | number)[]>([])
    const [isDeleting, setIsDeleting] = useState(false)

    const [search, setSearch] = useState('')
    const [selectedRole, setSelectedRole] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(ITEMS_PER_PAGE)


    const transformToUIUser = (user: UserDto): UIUser => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
    });

    useEffect(() => {
        let isMounted = true;

        const fetchUsers = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await adminService.getAllUsers({
                    page: currentPage,
                    limit: limit,
                    search: search || undefined,
                    role: selectedRole !== 'all' ? selectedRole : undefined,
                    sortBy: 'createdAt',
                    sortOrder: 'DESC'
                });

                if (!isMounted) return;

                if (response?.data) {
                    const transformedUsers = response.data.map(transformToUIUser);
                    setUsers(transformedUsers);
                    setTotalUsers(response.meta.total);
                    setTotalPages(response.meta.totalPages || 1);
                }
            } catch (err) {
                if (!isMounted) return;
                setError(err instanceof Error ? err.message : 'Failed to load users');
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchUsers();

        return () => {
            isMounted = false;
        };
    }, [currentPage, search, selectedRole, limit]); 

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        setCurrentPage(1); 
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value;
        setSelectedRole(newRole);
        setCurrentPage(1);
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(e.target.value);
        setLimit(newLimit);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        if (page === currentPage) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetFilters = () => {
        setSearch('');
        setSelectedRole('all');
        setLimit(ITEMS_PER_PAGE);
        setCurrentPage(1);
        setSelectedUsers([]);
    };

    const toggleUserSelection = (userId: string | number) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const selectAllUsers = () => {
        if (selectedUsers.length === users.length && users.length > 0) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user.id));
        }
    };

    const deleteUser = async (userId: string | number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setIsDeleting(true);
            try {
                const success = await adminService.deleteUser(userId);
                if (success) {
                    setCurrentPage(1);
                    setSelectedUsers(prev => prev.filter(id => id !== userId));
                } else {
                    alert('Failed to delete user');
                }
            } catch (err) {
                alert('Error deleting user');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const deleteSelectedUsers = async () => {
        if (selectedUsers.length === 0) return;

        if (confirm(`Delete ${selectedUsers.length} selected users?`)) {
            setIsDeleting(true);
            try {
                await Promise.all(selectedUsers.map(userId => adminService.deleteUser(userId)));
                setCurrentPage(1);
                setSelectedUsers([]);
            } catch (err) {
                alert('Error deleting users');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const formatDate = (date: Date | string): string => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const generateAvatar = (name: string): string => {
        if (!name) return '??';
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getShowingRange = () => {
        if (users.length === 0) return '0';
        const start = (currentPage - 1) * limit + 1;
        const end = Math.min(currentPage * limit, totalUsers);
        return `${start} to ${end}`;
    };

    if (error) {
        return (
            <CMSLayout>
                <div className="p-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h3 className="text-red-800 font-semibold mb-2">Error Loading Users</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => {
                                setCurrentPage(1);
                                setError(null);
                            }}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </CMSLayout>
        );
    }

    return (
        <CMSLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                        <p className="text-gray-600 mt-1">
                            {isLoading ? 'Loading...' : `Manage ${totalUsers} user accounts and roles`}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <button
                            onClick={() => alert('Export feature coming soon')}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            disabled={isLoading}
                        >
                            <Download size={16} />
                            Export
                        </button>   
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{totalUsers}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <UserCheck className="text-blue-600" size={24} />
                            </div>
                        </div>
                        <p className="text-green-600 text-sm mt-2">
                            {users.length} on this page
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Current Page</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {currentPage}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Shield className="text-purple-600" size={24} />
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-2">
                            Page {currentPage} of {totalPages || 1}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Selected Users</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {selectedUsers.length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                                <UserX className="text-yellow-600" size={24} />
                            </div>
                        </div>
                        <p className="text-red-600 text-sm mt-2">
                            {selectedUsers.length > 0
                                ? `${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} selected`
                                : 'Click to select users'}
                        </p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search users by name, email, or phone... (instant search)"
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                                disabled={isLoading}
                            />
                            {search && (
                                <button
                                    onClick={() => {
                                        setSearch('');
                                        setCurrentPage(1);
                                    }}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={limit}
                                onChange={handleLimitChange}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                                disabled={isLoading}
                            >
                                <option value="10">10 per page</option>
                                <option value="25">25 per page</option>
                                <option value="50">50 per page</option>
                                <option value="100">100 per page</option>
                            </select>

                            {/* Role filter */}
                            <select
                                value={selectedRole}
                                onChange={handleRoleChange}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                                disabled={isLoading}
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Administrator</option>
                                <option value="moderator">Moderator</option>
                                <option value="user">User</option>
                                <option value="customer">Customer</option>
                            </select>

                            {/* Reset button */}
                            {(search || selectedRole !== 'all' || limit !== ITEMS_PER_PAGE) && (
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    disabled={isLoading}
                                >
                                    <Filter size={16} />
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(search || selectedRole !== 'all') && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-600">Active filters:</span>
                            {search && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                    Search: {search}
                                    <button
                                        onClick={() => {
                                            setSearch('');
                                            setCurrentPage(1);
                                        }}
                                        className="hover:text-blue-900 ml-1"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {selectedRole !== 'all' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                    Role: {selectedRole}
                                    <button
                                        onClick={() => {
                                            setSelectedRole('all');
                                            setCurrentPage(1);
                                        }}
                                        className="hover:text-blue-900 ml-1"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Bulk Actions */}
                    {selectedUsers.length > 0 && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-blue-700 font-medium">
                                    {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                                </span>
                                <button
                                    onClick={deleteSelectedUsers}
                                    disabled={isDeleting || isLoading}
                                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 disabled:opacity-50 flex items-center gap-1"
                                >
                                    {isDeleting && <RefreshCw size={12} className="animate-spin" />}
                                    Delete Selected
                                </button>
                            </div>
                            <button
                                onClick={() => setSelectedUsers([])}
                                className="text-blue-700 hover:text-blue-800 text-sm"
                                disabled={isDeleting}
                            >
                                Clear Selection
                            </button>
                        </div>
                    )}
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {isLoading ? (
                        <div className="py-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                            <p className="text-gray-600 mt-2">Loading users...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.length === users.length && users.length > 0}
                                                    onChange={selectAllUsers}
                                                    className="rounded border-gray-300 text-accent focus:ring-accent"
                                                    disabled={isLoading || users.length === 0}
                                                />
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                                User
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                                Role
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                                Joined
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                                Contact
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {users.map((user) => {
                                            const userAvatar = generateAvatar(user.name);
                                            return (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUsers.includes(user.id)}
                                                            onChange={() => toggleUserSelection(user.id)}
                                                            className="rounded border-gray-300 text-accent focus:ring-accent"
                                                            disabled={isLoading || isDeleting}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-semibold">
                                                                {userAvatar}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                                <div className="text-sm text-gray-500">ID: {user.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role] || 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                                            <Calendar size={14} />
                                                            {formatDate(user.createdAt)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Mail size={12} />
                                                                {user.email}
                                                            </div>
                                                            {user.phone && (
                                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                    <Phone size={12} />
                                                                    {user.phone}
                                                                </div>
                                                            )}
                                                        </div>
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
                                                                disabled={isDeleting}
                                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-50"
                                                                title="Delete User"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Empty State */}
                            {users.length === 0 && !isLoading && (
                                <div className="py-12 text-center">
                                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <UserIcon className="text-gray-400" size={24} />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        {search || selectedRole !== 'all'
                                            ? 'No users match your search criteria. Try adjusting your filters.'
                                            : 'No users in the database yet.'}
                                    </p>
                                    {(search || selectedRole !== 'all') && (
                                        <button
                                            onClick={resetFilters}
                                            className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            )}

                            {totalPages > 1 && users.length > 0 && (
                                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-700 order-2 sm:order-1">
                                        Showing {getShowingRange()} of {totalUsers} users
                                    </div>

                                    <div className="flex items-center gap-2 order-1 sm:order-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1 || isLoading}
                                            className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                let pageNum: number;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        disabled={isLoading}
                                                        className={`px-3 py-1 rounded ${currentPage === pageNum
                                                            ? 'bg-accent text-white'
                                                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages || isLoading}
                                            className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </CMSLayout>
    );
}