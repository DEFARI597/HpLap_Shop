'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth/auth.service';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^\d+]/g, '');

        let formattedValue = numericValue;
        if (numericValue.length > 3 && numericValue.length <= 6) {
            formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
        } else if (numericValue.length > 6) {
            formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6, 13)}`;
        }

        setPhone(formattedValue);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!name || !email || !password) {
            setError('Name, email, and password are required');
            setLoading(false);
            return;
        }

        const cleanPhone = phone.replace(/[^\d+]/g, '');

        if (cleanPhone && cleanPhone.length < 10) {
            setError('Phone number must be at least 10 digits');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.register({
                name,
                email,
                password,
                phone: cleanPhone || ''
            });

            if (response) {
                router.push('/login');
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '400px',
            margin: '0 auto'
        }}>
            <h1 style={{ textAlign: 'center' }}>Register</h1>

            {error && (
                <div style={{
                    color: 'red',
                    backgroundColor: '#ffebee',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '4px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '4px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div>
                    <label htmlFor="phone">
                        Phone Number <small style={{ color: '#666' }}>(Optional)</small>
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="0812-3456-7890"
                        value={phone}
                        onChange={handlePhoneChange}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '4px',
                            boxSizing: 'border-box'
                        }}
                    />
                    <small style={{ color: '#666', fontSize: '0.8rem' }}>
                        Format: 0812-3456-7890 or +6281234567890
                    </small>
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '4px',
                            boxSizing: 'border-box'
                        }}
                    />
                    <small style={{ color: '#666', fontSize: '0.8rem' }}>
                        Minimum 6 characters
                    </small>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '12px',
                        backgroundColor: loading ? '#ccc' : '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: '#0070f3' }}>
                    Login here
                </a>
            </p>
        </div>
    );
}