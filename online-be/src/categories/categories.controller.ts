// src/categories/categories.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/categories-update.dto';
import { CategoryResponseDto } from './dto/categories-response.dto';
import { CategoriesEntity } from '../entity/categories.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    try {
      const category = await this.categoriesService.create(createCategoryDto);
      return this.transformToResponseDto(category);
    } catch (error: any) {
      // Check for duplicate entry error (example for MySQL/PostgreSQL)
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new BadRequestException('Category with this name already exists');
      }
      throw new BadRequestException(`Failed to create category: ${error.message}`);
    }
  }

  @Get()
  async findAll(@Query('active') active?: string): Promise<CategoryResponseDto[]> {
    try {
      let categories;

      if (active === 'true') {
        categories = await this.categoriesService.findActive();
      } else if (active === 'false') {
        categories = await this.categoriesService.findAll();
      } else {
        categories = await this.categoriesService.findAll();
      }

      return categories.map(category => this.transformToResponseDto(category));
    } catch (error: any) {
      throw new InternalServerErrorException(`Failed to fetch categories: ${error.message}`);
    }
  }

  @Get('active')
  async findActive(): Promise<CategoryResponseDto[]> {
    try {
      const categories = await this.categoriesService.findActive();
      return categories.map(category => this.transformToResponseDto(category));
    } catch (error: any) {
      throw new InternalServerErrorException(`Failed to fetch active categories: ${error.message}`);
    }
  }

  @Get('search')
  async search(@Query('name') name: string): Promise<CategoryResponseDto[]> {
    if (!name) {
      throw new BadRequestException('Search parameter "name" is required');
    }

    try {
      const categories = await this.categoriesService.findByName(name);
      return categories.map(category => this.transformToResponseDto(category));
    } catch (error: any) {
      throw new InternalServerErrorException(`Failed to search categories: ${error.message}`);
    }
  }

  @Get('stats')
  async getStats(): Promise<{ total: number; active: number }> {
    try {
      const [total, active] = await Promise.all([
        this.categoriesService.countCategories(),
        this.categoriesService.countActiveCategories()
      ]);

      return { total, active };
    } catch (error: any) {
      throw new InternalServerErrorException(`Failed to get category stats: ${error.message}`);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
    try {
      const category = await this.categoriesService.findOne(id);
      return this.transformToResponseDto(category);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch category: ${error.message}`);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    try {
      const category = await this.categoriesService.update(id, updateCategoryDto);
      return this.transformToResponseDto(category);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Check for duplicate entry error
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new BadRequestException('Category with this name already exists');
      }
      throw new BadRequestException(`Failed to update category: ${error.message}`);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.categoriesService.remove(id);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Check for foreign key constraint errors
      if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === '23503') {
        throw new BadRequestException('Cannot delete category because it is referenced by other records');
      }
      throw new InternalServerErrorException(`Failed to delete category: ${error.message}`);
    }
  }

  @Delete(':id/soft')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.categoriesService.softDelete(id);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to soft delete category: ${error.message}`);
    }
  }

  @Patch(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
    try {
      await this.categoriesService.restore(id);
      const category = await this.categoriesService.findOne(id);
      return this.transformToResponseDto(category);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to restore category: ${error.message}`);
    }
  }

  private transformToResponseDto(category: CategoriesEntity): CategoryResponseDto {
    return {
      category_id: category.category_id,
      category_name: category.category_name,
      category_image: category.category_image,
      is_active: category.is_active,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };
  }
}