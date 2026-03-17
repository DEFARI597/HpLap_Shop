// src/categories/categories.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoriesEntity } from "../entities/categories.entities";
import { CreateCategoryDto } from "./dto/create-categories.dto";
import { UpdateCategoryDto } from "./dto/categories-update.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoriesEntity> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async findAll(): Promise<CategoriesEntity[]> {
    return await this.categoriesRepository.find({
      order: {
        createdAt: "DESC",
      },
    });
  }

  async findActive(): Promise<CategoriesEntity[]> {
    return await this.categoriesRepository.find({
      where: { is_active: true },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async findOne(id: number): Promise<CategoriesEntity> {
    const category = await this.categoriesRepository.findOne({
      where: { category_id: id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoriesEntity> {
    const category = await this.findOne(id);

    Object.assign(category, updateCategoryDto);

    return await this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }

  async softDelete(id: number): Promise<void> {
    const category = await this.findOne(id);
    category.is_active = false;
    await this.categoriesRepository.save(category);
  }

  async restore(id: number): Promise<void> {
    const category = await this.categoriesRepository.findOne({
      where: { category_id: id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    category.is_active = true;
    await this.categoriesRepository.save(category);
  }

  async findByName(name: string): Promise<CategoriesEntity[]> {
    return await this.categoriesRepository
      .createQueryBuilder("category")
      .where("category.category_name ILIKE :name", { name: `%${name}%` })
      .getMany();
  }

  async countCategories(): Promise<number> {
    return await this.categoriesRepository.count();
  }

  async countActiveCategories(): Promise<number> {
    return await this.categoriesRepository.count({
      where: { is_active: true },
    });
  }
}
