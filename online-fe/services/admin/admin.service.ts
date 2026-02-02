import {apiClient} from '../api-client';
import { AdminLoginDto } from './types/admin-login.dto';
import { UpdateRoleDto } from './types/update-role.dto';

export interface AuthResponse {
    access_token: string;
    user: AuthAdmin;
}

export interface AuthAdmin {
    id: number;
    email: string;
    role: 'admin';
    isAdminVerified: boolean;
}

class AdminService {
    async adminLogin(data: AdminLoginDto): Promise<AuthResponse | undefined> {
        const response = await apiClient.post<AuthResponse>('/admin/login', data);
        return response.success ? response.data : undefined;
    }
}

export const adminService = new AdminService();