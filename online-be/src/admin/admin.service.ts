import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository, MoreThanOrEqual } from "typeorm";
import { User, UserRole } from "../entity/users.entity";
import { AuthService } from "../auth/auth.service";
import { UpdateRoleDto } from "../admin/dto/update-role.dto";
import { GetUsersQueryDto, UsersPaginatedDto } from "../users/dto/users.dto";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async adminLogin(email: string, password: string) {
    const result = await this.authService.login(email, password);

    const user = await this.usersRepository.findOne({
      where: { email },
      select: ["id", "email", "role", "name"],
    });

    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Admin access required");
    }

    return {
      ...result,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async getAllUsers(query: GetUsersQueryDto): Promise<UsersPaginatedDto> {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await this.usersRepository.findAndCount({
      select: ["id", "email", "name", "role", "createdAt"],
      where,
      skip,
      take: limit,
      order: { [sortBy]: sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC" },
    });

    return {
      data: users.map((user) => ({
        ...user,
        id: user.id,
        createdAt: user.createdAt.toISOString(),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserRole(userId: number, updateRoleDto: UpdateRoleDto) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if the role is valid
    if (!Object.values(UserRole).includes(updateRoleDto.role)) {
      throw new ForbiddenException(`Invalid role: ${updateRoleDto.role}`);
    }

    user.role = updateRoleDto.role;
    await this.usersRepository.save(user);

    return {
      message: `User ${user.email} role updated to ${updateRoleDto.role}`,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async deleteUser(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Prevent admin from deleting themselves
    if (user.role === UserRole.ADMIN) {
      // Optional: You might want to check if this is the only admin
      const adminCount = await this.usersRepository.count({
        where: { role: UserRole.ADMIN },
      });

      if (adminCount <= 1) {
        throw new ForbiddenException("Cannot delete the only admin user");
      }
    }

    await this.usersRepository.remove(user);

    return {
      message: `User ${user.email} deleted successfully`,
    };
  }

  async getStatistics() {
    const totalUsers = await this.usersRepository.count();
    const totalAdmins = await this.usersRepository.count({
      where: { role: UserRole.ADMIN },
    });

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const recentUsers = await this.usersRepository.count({
      where: {
        createdAt: MoreThanOrEqual(lastWeek),
      },
    });

    return {
      totalUsers,
      totalAdmins,
      recentUsers,
    };
  }
}
