'use client';

import { useState } from 'react';
import { authService } from '@/services/auth/auth.service';
import { LoginDto } from '@/services/auth/auth.service';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const data: LoginDto = { email, password };
        const response = await authService.login(data);

        if (response) {
            localStorage.setItem('auth_token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));

            if (response.user.role === 'admin' && response.user.isAdminVerified) {
                window.location.href = '/admin/login';
            } else {
                window.location.href = '/';
            }
        }
    };

    return (
        <div>
            <h1>User Login</h1>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <p>For admin access, use admin credentials</p>
        </div>
    );
}