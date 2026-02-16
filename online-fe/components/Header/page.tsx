'use client'

import { Icons } from '@/lib/icons'
import { useState } from 'react'

export default function Header() {
    const [search, setSearch] = useState('')

    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left side */}
                <div className="flex items-center space-x-4">
                    <div className="hidden md:block">
                        <h2 className="text-lg font-semibold text-primary">Dashboard</h2>
                        <p className="text-sm text-secondary">Welcome to your CMS admin panel</p>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icons.Search size={18} className="text-secondary" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none w-64"
                        />
                    </div>

                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg hover:bg-background">
                        <Icons.Bell size={20} className="text-secondary" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Mobile menu button */}
                    <button className="md:hidden p-2 rounded-lg hover:bg-background">
                        <Icons.Menu size={20} className="text-secondary" />
                    </button>
                </div>
            </div>
        </header>
    )
}