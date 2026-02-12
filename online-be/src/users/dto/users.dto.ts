import { UserRole } from "../../entity/users.entity";

interface UserDto {
  id: string | number;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;           
  createdAt: string | Date;
}

export interface UsersPaginatedDto {
  data: UserDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetUsersQueryDto {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
}

export interface UsersFilterDto {
  email?: string;
  name?: string;
  role?: string;
  startDate?: Date;
  endDate?: Date;
}
