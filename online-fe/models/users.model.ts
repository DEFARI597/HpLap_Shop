export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

export interface UserEntity {
    id: number;
    email: string;
    name: string;
    phone: string;
    role: UserRole;
    isSuperAdmin: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}