import {
  Controller,
  Post,
  Body,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../entity/users.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const existingUser = await this.usersService.findByEmail(
        registerDto.email,
      );
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const userData = {
        ...registerDto,
        password: hashedPassword,
      };

      const result = await this.usersService.create(userData);

      const { ...userWithoutPassword } = result;

      return {
        success: true,
        message: 'User registered successfully',
        data: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto.email, loginDto.password);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  @Post('setup-first-admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Setup first admin (One-time use)',
    description: 'Creates the initial admin user. Can only be used once.',
  })
  @ApiResponse({ status: 201, description: 'First admin created' })
  @ApiResponse({ status: 400, description: 'Admin already exists' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async setupFirstAdmin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name?: string,
  ) {
    try {
      const adminCount = await this.usersService.countAdmins();

      if (adminCount > 0) {
        throw new ConflictException('Initial admin already exists');
      }

      if (!email || !email.includes('@')) {
        throw new BadRequestException('Valid email is required');
      }

      if (!password || password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters');
      }

      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await this.usersService.create({
        email,
        password: hashedPassword,
        name: name || 'System Administrator',
        role: UserRole.ADMIN,
        isSuperAdmin: true,
      });

      return {
        success: true,
        message: '🎉 First admin created successfully!',
        data: {
          instructions: [
            '1. Login at POST /admin/login with these credentials',
            '2. Change password immediately for security',
            '3. Create additional users through admin panel',
          ],
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create initial admin'  
      );
    }
  }
}
