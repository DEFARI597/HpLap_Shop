'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '@/lib/icons'

const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Icons.Home },
    { name: 'Categories', href: '/admin/categories', icon: Icons.Folder },
    { name: 'Users', href: '/admin/users', icon: Icons.Users }
]

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()

    return (
        <aside className={`flex flex-col h-screen bg-background text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
            {/* Logo */}
            <div className="p-6 border-b border-secondary">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <h1 className="text-lg font-semibold text-primary">CMS Admin</h1>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-lg bg-primary"
                    >
                        {collapsed ? <Icons.ChevronRight size={20} /> : <Icons.ChevronLeft size={20} />}
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center text-primary p-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-secondary'
                                            : 'hover:bg-secondary inset-x-0 bottom-0'
                                        }`}
                                >
                                    <Icon size={20} />
                                    {!collapsed && (
                                        <span className="ml-3">{item.name}</span>
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-secondary">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-semibold">A</span>
                    </div>
                    {!collapsed && (
                        <div className="ml-3">
                            <p className="text-sm font-medium text-primary">Admin User</p>
                            <p className="text-xs text-gray-400">admin@example.com</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    )
}