export interface UserEntity {
    id: number;
    email: string;
    name: string;
    role: 'user' | 'admin';
    isSuperAdmin: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}