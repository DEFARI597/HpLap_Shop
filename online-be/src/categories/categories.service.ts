import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CategoriesEntity } from '../entity/categories.entity';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/categories-update.dto';
import { CategoryResponseDto } from './dto/categories-response.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoriesEntity)
        private categoriesRepository: Repository<CategoriesEntity>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
        if (createCategoryDto.parent_category_id) {
            const parentExists = await this.categoriesRepository.findOne({
                where: { category_id: createCategoryDto.parent_category_id }
            });

            if (!parentExists) {
                throw new BadRequestException('Parent category not found');
            }
        }

        const category = this.categoriesRepository.create({
            category_name: createCategoryDto.category_name,
            parent_category_id: createCategoryDto.parent_category_id,
            category_image: createCategoryDto.category_image,
            is_active: createCategoryDto.is_active ?? true,
        });

        const savedCategory = await this.categoriesRepository.save(category);
        return new CategoryResponseDto(savedCategory);
    }

    async findAll(): Promise<CategoryResponseDto[]> {
        const categories = await this.categoriesRepository.find({
            relations: ['children'],
        });

        return categories.map(category => new CategoryResponseDto(category));
    }

    async findAllWithHierarchy(): Promise<CategoryResponseDto[]> {
        const categories = await this.categoriesRepository.find({
            relations: ['children', 'children.children'],
        });

        const rootCategories = categories.filter(cat => !cat.parent_category_id);

        return rootCategories.map(category => new CategoryResponseDto(category));
    }

    async findOne(id: number): Promise<CategoryResponseDto> {
        const category = await this.categoriesRepository.findOne({
            where: { category_id: id },
            relations: ['parent', 'children'],
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return new CategoryResponseDto(category);
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
        await this.findOne(id);

        // Prevent circular reference
        if (updateCategoryDto.parent_category_id) {
            // Check if trying to set self as parent
            if (updateCategoryDto.parent_category_id === id) {
                throw new BadRequestException('Category cannot be its own parent');
            }

            // Check if new parent exists
            const parentExists = await this.categoriesRepository.findOne({
                where: { category_id: updateCategoryDto.parent_category_id }
            });

            if (!parentExists) {
                throw new BadRequestException('Parent category not found');
            }

            // Check for circular reference (if new parent is a descendant of current category)
            const isDescendant = await this.isDescendant(id, updateCategoryDto.parent_category_id);
            if (isDescendant) {
                throw new BadRequestException('Cannot set a descendant as parent (circular reference)');
            }
        }

        await this.categoriesRepository.update(id, {
            category_name: updateCategoryDto.category_name,
            parent_category_id: updateCategoryDto.parent_category_id,
            category_image: updateCategoryDto.category_image,
            is_active: updateCategoryDto.is_active,
        });

        const updatedCategory = await this.findOne(id);
        return updatedCategory;
    }

    // Helper method to check if a category is a descendant of another
    private async isDescendant(categoryId: number, potentialDescendantId: number): Promise<boolean> {
        if (categoryId === potentialDescendantId) {
            return true;
        }

        const children = await this.categoriesRepository.find({
            where: { parent_category_id: categoryId }
        });

        for (const child of children) {
            if (await this.isDescendant(child.category_id, potentialDescendantId)) {
                return true;
            }
        }

        return false;
    }

    async remove(id: number): Promise<void> {
        // Check if category exists
        await this.findOne(id);

        // Check if category has children
        const hasChildren = await this.categoriesRepository.count({
            where: { parent_category_id: id }
        });

        if (hasChildren > 0) {
            throw new BadRequestException('Cannot delete category with subcategories');
        }

        await this.categoriesRepository.delete(id);
    }

    async findActive(): Promise<CategoryResponseDto[]> {
        const categories = await this.categoriesRepository.find({
            where: { is_active: true },
            relations: ['children'],
        });

        return categories.map(category => new CategoryResponseDto(category));
    }

    async findSubcategories(id: number): Promise<CategoryResponseDto[]> {
        // Check if category exists
        await this.findOne(id);

        const subcategories = await this.categoriesRepository.find({
            where: { parent_category_id: id },
        });

        return subcategories.map(sub => new CategoryResponseDto(sub));
    }

    // Additional useful methods
    async findPathToRoot(id: number): Promise<CategoriesEntity[]> {
        const path: CategoriesEntity[] = [];
        let currentId = id;

        while (currentId) {
            const category = await this.categoriesRepository.findOne({
                where: { category_id: currentId },
                relations: ['parent']
            });

            if (!category) break;

            path.unshift(category);
            currentId = category.parent_category_id;
        }

        return path;
    }

    async bulkUpdateStatus(ids: number[], isActive: boolean): Promise<void> {
        await this.categoriesRepository.update(
            { category_id: In(ids) },
            { is_active: isActive }
        );
    }
}