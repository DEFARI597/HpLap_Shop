import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.repo.find({
      select: ['id', 'name', 'email', 'role', 'createdAt'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({
      where: { email },
    });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.repo.delete(id);

    if (!result.affected) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted' };
  }

  async updateRole(id: number, role: UserRole): Promise<User> {
    if (!Object.values(UserRole).includes(role)) {
      throw new BadRequestException(
        `Invalid role. Allowed roles: ${Object.values(UserRole).join(', ')}`,
      );
    }

    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = role;
    return this.repo.save(user);
  }

  async promoteToAdmin(id: number): Promise<User> {
    return this.updateRole(id, UserRole.ADMIN);
  }

  async demoteToUser(id: number): Promise<User> {
    return this.updateRole(id, UserRole.USER);
  }

  async findAdmins(): Promise<User[]> {
    return this.repo.find({
      where: { role: UserRole.ADMIN },
      select: ['id', 'name', 'email', 'role', 'createdAt'],
    });
  }

  async findRegularUsers(): Promise<User[]> {
    return this.repo.find({
      where: { role: UserRole.USER },
      select: ['id', 'name', 'email', 'role', 'createdAt'],
    });
  }

  async isAdmin(id: number): Promise<boolean> {
    const user = await this.repo.findOne({
      where: { id },
      select: ['role'],
    });

    return user?.role === UserRole.ADMIN;
  }

  async countAdmins(): Promise<number> {
    return this.repo.count({
      where: { role: UserRole.ADMIN },
    });
  }

  async count(where?: any): Promise<number> {
    return this.repo.count({ where });
  }
}
