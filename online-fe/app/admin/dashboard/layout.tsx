'use client';

import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {/* Simple Header */}
            <div style={{
                backgroundColor: '#2c3e50',
                color: 'white',
                padding: '1rem',
                textAlign: 'center'
            }}>
                <h1>Admin Panel</h1>
                <p>Accessible at: http://localhost:3000/admin</p>
            </div>

            {/* Navigation */}
            <div style={{
                backgroundColor: '#ecf0f1',
                padding: '0.5rem',
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center'
            }}>
                <Link href="/admin">Dashboard</Link>
                <Link href="/admin/users">Users</Link>
                <Link href="/admin/settings">Settings</Link>
                <Link href="/">← Home</Link>
            </div>

            {/* Content */}
            <div style={{ padding: '2rem' }}>
                {children}
            </div>
        </div>
    );
}