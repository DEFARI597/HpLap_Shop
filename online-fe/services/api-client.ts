import { ApiResponse } from '../services/api-response';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${API_BASE_URL}${endpoint}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (typeof window !== 'undefined') {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        const mergedHeaders = {
            ...headers,
            ...options.headers,
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers: mergedHeaders,
            });

            const contentType = response.headers.get('content-type');
            let data: Record<string, unknown> | string = {};

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else if (response.status === 204) {
                data = {};
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                const errorMsg = typeof data === 'string'
                    ? data
                    : (data as Record<string, unknown>).message || (data as Record<string, unknown>).error || `HTTP ${response.status}`;
                return {
                    success: false,
                    error: String(errorMsg),
                    status: response.status,
                };
            }

            
            return {
                success: true,
                data: (typeof data === 'string' ? data : (data as Record<string, unknown>).data || data) as T,
                message: typeof data === 'string' ? undefined : (data as Record<string, unknown>).message as string | undefined,
                meta: typeof data === 'string' ? undefined : (data as Record<string, unknown>).meta as { page?: number; limit?: number; total?: number; totalPages?: number } | undefined,
                status: response.status,
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Network error';
            return {
                success: false,
                error: errorMessage,
                status: 0,
            };
        }
    }

    
    private getToken(): string | null {
        if (typeof window === 'undefined') return null;

        return (
            localStorage.getItem('admin_token') ||
            localStorage.getItem('auth_token') ||
            null
        );
    }

    public clearTokens(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('admin_token');
            localStorage.removeItem('user');
            localStorage.removeItem('admin_user');
        }
    }

    async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> {
        const queryString = params ? `?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()}` : '';
        return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    async upload<T>(endpoint: string, file: File, fieldName = 'file'): Promise<ApiResponse<T>> {
        const formData = new FormData();
        formData.append(fieldName, file);

        const token = this.getToken();
        const headers: Record<string, string> = {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData,
            });

            const data = await response.json() as Record<string, unknown>;

            if (!response.ok) {
                return {
                    success: false,
                    error: String(data.message || `HTTP ${response.status}`),
                    status: response.status,
                };
            }

            return {
                success: true,
                data: (data.data || data) as T,
                message: data.message as string | undefined,
                status: response.status,
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            return {
                success: false,
                error: errorMessage,
                status: 0,
            };
        }
    }
}

export const apiClient = new ApiClient();