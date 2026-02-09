import { apiClient } from '../api-client';
import { RegisterDto } from '../auth/types/register.dto';
import { LoginDto } from '../auth/types/login.dto';

export interface AuthResponse {
    access_token: string;
    user: AuthUser;
}

export interface AuthUser {
    id: number;
    email: string;
    name: string;
    role: 'user' | 'admin';
    isAdminVerified: boolean;
}

class AuthService {
    async register(data: RegisterDto): Promise<AuthResponse | undefined> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.success ? response.data : undefined;
    }

    async login(data: LoginDto): Promise<AuthResponse | undefined> {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        return response.success ? response.data : undefined;
    }
}

export const authService = new AuthService();

export type { LoginDto };
