import {apiClient} from '../api-client';
import { AdminLoginDto } from './types/admin-login.dto';
import {UsersPaginatedDto, GetUsersQueryDto} from './types/users/users.dto'

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
        const response = await apiClient.post<AuthResponse>('/api/admin/login', data);
        return response.success ? response.data : undefined;
    }

    async getAllUsers(data: GetUsersQueryDto): Promise<UsersPaginatedDto | undefined> {
    const queryParts: string[] = [];

    if (data.page !== undefined) queryParts.push(`page=${data.page}`);
    if (data.limit !== undefined) queryParts.push(`limit=${data.limit}`);
    if (data.search) queryParts.push(`search=${encodeURIComponent(data.search)}`);
    if (data.role && data.role !== 'all') queryParts.push(`role=${data.role}`);
    if (data.sortBy) queryParts.push(`sortBy=${data.sortBy}`);
    if (data.sortOrder) queryParts.push(`sortOrder=${data.sortOrder}`);

    const queryString = queryParts.join('&');
    const url = `/admin/users${queryString ? `?${queryString}` : ''}`;

    try {
        const response = await apiClient.get<any>(url);
        
        if (response.success && response.data) {
            if (Array.isArray(response.data)) {
                
                const page = data.page;
                const limit = data.limit || 10;
                const total = response.data.length;
                const totalPages = Math.ceil(total / limit);
                
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedData = response.data.slice(startIndex, endIndex);
                
                return {
                    data: paginatedData,
                    meta: {
                        total: total,
                        page: page,
                        limit: limit,
                        totalPages: totalPages
                    }
                };
            }
            else if (response.data.data && Array.isArray(response.data.data)) {
                return response.data as UsersPaginatedDto;
            }
        }
        
        return undefined;
    } catch (error) {
        console.error('Error fetching users:', error);
        return undefined;
    }
}

    async deleteUser(userId: string | number): Promise<boolean> {
        try {
            const response = await apiClient.delete(`/admin/users/${userId}`);
            return response.success;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    }

    async updateUserRole(userId: string | number): Promise<boolean> {
        try {

            const response = await apiClient.delete<void>(`/admin/users/${userId}`);
            return response.success;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    }
}

export const adminService = new AdminService();