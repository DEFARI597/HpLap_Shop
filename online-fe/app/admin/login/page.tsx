'use client';

import { useState } from 'react';
import { adminService } from '@/services/admin/admin.service';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const result = await adminService.adminLogin({ email, password });

            if (result) {
                // Check if user is admin
                if (result.user.role === 'admin') {
                    // Save admin-specific data
                    localStorage.setItem('admin_token', result.access_token);
                    localStorage.setItem('admin_user', JSON.stringify(result.user));

                    // Show success message
                    setSuccess(true);

                    // Redirect to admin dashboard after 1.5 seconds
                    setTimeout(() => {
                        router.push('/admin/dashboard');
                    }, 1500);

                } else {
                    setError('Access denied. Admin privileges required.');
                    // STAY on login page for non-admin users
                }
            } else {
                setError('Invalid email or password.');
                // STAY on login page for failed login
            }
        } catch (_err) {
            setError('Login failed. Please try again.');
            // STAY on login page for errors
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Admin Login</h2>

            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    ✅ Login successful! Redirecting to dashboard...
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleAdminLogin}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Admin Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                        placeholder="admin@example.com"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Login as Admin'}
                </button>
            </form>

            <div className="mt-4 text-sm text-gray-600">
                <p>Note: Only users with admin role can access this panel.</p>
            </div>
        </div>
    );
}