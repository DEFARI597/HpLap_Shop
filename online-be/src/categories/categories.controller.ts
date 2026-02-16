import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/categories-update.dto';
import { CategoryResponseDto } from './dto/categories-response.dto';
import { CategoriesEntity } from '../entity/categories.entity';

@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(@Query('hierarchy') hierarchy?: string): Promise<CategoryResponseDto[]> {
    if (hierarchy === 'true') {
      return this.categoriesService.findAllWithHierarchy();
    }
    return this.categoriesService.findAll();
  }

  @Get('active')
  async findActive(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
    return this.categoriesService.findOne(id);
  }

  @Get(':id/subcategories')
  async findSubcategories(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findSubcategories(id);
  }

  @Get(':id/path')
  async findPathToRoot(@Param('id', ParseIntPipe) id: number): Promise<CategoriesEntity[]> {
    return this.categoriesService.findPathToRoot(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }

  @Patch('bulk/status')
  async bulkUpdateStatus(
    @Body() bulkUpdateDto: { ids: number[]; isActive: boolean },
  ): Promise<{ message: string }> {
    await this.categoriesService.bulkUpdateStatus(bulkUpdateDto.ids, bulkUpdateDto.isActive);
    return { message: 'Categories status updated successfully' };
  }
}