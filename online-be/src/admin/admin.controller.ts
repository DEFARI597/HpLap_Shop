import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AdminGuard } from '../admin/guards/admin.guards';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  async adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminService.adminLogin(
      adminLoginDto.email,
      adminLoginDto.password,
    );
  }

  @Get('users')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.adminService.getAllUsers(page, limit);
  }

  @Put('users/:id/role')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user role (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid role' })
  async updateUserRole(
    @Param('id') userId: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.usersService.updateRole(userId, updateRoleDto.role);
  }

  @Post('users/:id/promote-to-admin')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Promote user to admin (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User promoted to admin' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async promoteToAdmin(@Param('id') userId: number) {
    return this.usersService.promoteToAdmin(userId);
  }

  @Post('users/:id/demote-to-user')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Demote admin to regular user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User demoted to regular user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async demoteToUser(@Param('id') userId: number) {
    return this.usersService.demoteToUser(userId);
  }

  @Delete('users/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') userId: number) {
    return this.usersService.remove(userId);
  }

  @Get('users/admins')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all admin users (Admin only)' })
  async getAdmins() {
    return this.usersService.findAdmins();
  }

  @Get('users/regular')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all regular users (Admin only)' })
  async getRegularUsers() {
    return this.usersService.findRegularUsers();
  }

  @Get('statistics')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get system statistics (Admin only)' })
  async getStatistics() {
    return this.adminService.getStatistics();
  }
  @Get('logs')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get system logs' })
  async getLogs() {}
}
