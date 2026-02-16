import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../entity/users.entity';
import { SetupFirstAdminDto } from './dto/admin/setup-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      name,
      email,
      phone: '',
      password: hashedPassword,
      role: UserRole.USER,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET || 'your-secret-key',
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  async adminLogin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Admin access required');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      isAdmin: true,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '24h',
      secret: process.env.JWT_SECRET || 'your-secret-key',
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 86400,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: true,
      },
    };
  }

// In your AuthService
async setupFirstAdmin(setupFirstAdminDto: SetupFirstAdminDto) {
  const { email, password, name, phone } = setupFirstAdminDto;

  const adminCount = await this.usersService.countAdmins();

  if (adminCount > 0) {
    throw new ConflictException('Initial admin already exists');
  }

  // Check if email already exists
  const existingUser = await this.usersService.findByEmail(email);
  if (existingUser) {
    throw new ConflictException('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = await this.usersService.create({
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    name: name?.trim() || 'System Administrator',
    phone: phone || '',
    role: UserRole.ADMIN,
    isSuperAdmin: true, // You might want to add this flag
  });

  const { password: result } = newAdmin;
  return result;
}
}
