import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like, FindOptionsWhere } from "typeorm";
import { ProductEntity, ProductType } from "../entities/products.entities";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductFilterDto } from "./dto/filter-product.dto";

interface DatabaseError {
  code?: string;
  message?: string;
  detail?: string;
  table?: string;
  constraint?: string;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    try {
      const product = this.productsRepository.create(createProductDto);
      return await this.productsRepository.save(product);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;

      if (dbError.code === "ER_DUP_ENTRY" || dbError.code === "23505") {
        throw new BadRequestException(
          "Product with this name or SKU already exists",
        );
      }

      if (dbError.code) {
        throw new BadRequestException(
          `Database error: ${dbError.message || "Unknown error"}`,
        );
      }

      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to create product: ${error.message}`,
        );
      }

      throw new BadRequestException(
        "Failed to create product: Unknown error occurred",
      );
    }
  }

  async findAll(filterDto: ProductFilterDto): Promise<{
    data: ProductEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const {
        category_id,
        product_type,
        is_active,
        is_featured,
        search,
        page = 1,
        limit = 10,
        sort_by = "created_at",
        sort_order = "DESC",
      } = filterDto;

      const where: FindOptionsWhere<ProductEntity> = {};

      if (category_id) where.category_id = category_id;
      if (product_type) where.product_type = product_type;
      if (is_active !== undefined) where.is_active = is_active;
      if (is_featured !== undefined) where.is_featured = is_featured;
      if (search) {
        where.product_name = Like(`%${search}%`);
      }

      const [data, total] = await this.productsRepository.findAndCount({
        where,
        relations: ["category"],
        order: { [sort_by]: sort_order },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to fetch products: ${error.message}`,
        );
      }
      throw new BadRequestException(
        "Failed to fetch products: Unknown error occurred",
      );
    }
  }

  async findOne(id: number): Promise<ProductEntity> {
    try {
      const product = await this.productsRepository.findOne({
        where: { product_id: id },
        relations: ["category"],
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      product.rating = Number(product.rating) || 0;

      await this.productsRepository.save(product);

      return product;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to fetch product: ${error.message}`,
        );
      }
      throw new BadRequestException(
        "Failed to fetch product: Unknown error occurred",
      );
    }
  }

  async findByCategory(categoryId: number): Promise<ProductEntity[]> {
    try {
      return await this.productsRepository.find({
        where: {
          category_id: categoryId,
          is_active: true,
        },
        relations: ["category"],
        order: { created_at: "DESC" },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to fetch products by category: ${error.message}`,
        );
      }
      throw new BadRequestException(
        "Failed to fetch products by category: Unknown error occurred",
      );
    }
  }

  async findByType(productType: ProductType): Promise<ProductEntity[]> {
    try {
      return await this.productsRepository.find({
        where: {
          product_type: productType,
          is_active: true,
        },
        relations: ["category"],
        order: { created_at: "DESC" },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to fetch products by type: ${error.message}`,
        );
      }
      throw new BadRequestException(
        "Failed to fetch products by type: Unknown error occurred",
      );
    }
  }

  async getFeatured(limit: number = 10): Promise<ProductEntity[]> {
    try {
      return await this.productsRepository.find({
        where: {
          is_featured: true,
          is_active: true,
        },
        relations: ["category"],
        take: limit,
        order: { rating: "DESC" },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to fetch featured products: ${error.message}`,
        );
      }
      throw new BadRequestException(
        "Failed to fetch featured products: Unknown error occurred",
      );
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    try {
      const product = await this.findOne(id);
      Object.assign(product, updateProductDto);

      return await this.productsRepository.save(product);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (dbError.code === "ER_DUP_ENTRY" || dbError.code === "23505") {
        throw new BadRequestException(
          "Product with this name or SKU already exists",
        );
      }

      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to update product: ${error.message}`,
        );
      }

      throw new BadRequestException(
        "Failed to update product: Unknown error occurred",
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const product = await this.findOne(id);
      await this.productsRepository.remove(product);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to delete product: ${error.message}`,
        );
      }
      throw new BadRequestException(
        "Failed to delete product: Unknown error occurred",
      );
    }
  }

  async softDelete(id: number): Promise<void> {
    try {
      const product = await this.findOne(id);
      product.is_active = false;
      await this.productsRepository.save(product);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to soft delete product: ${error.message}`,
        );
      }
      throw new BadRequestException(
        "Failed to soft delete product: Unknown error occurred",
      );
    }
  }

  async restore(id: number): Promise<void> {
    try {
      const product = await this.productsRepository.findOne({
        where: { product_id: id },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      product.is_active = true;
      await this.productsRepository.save(product);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to restore product: ${error.message}`,
        );
      }
      throw new BadRequestException(
        "Failed to restore product: Unknown error occurred",
      );
    }
  }

  async updateStock(id: number, quantity: number): Promise<ProductEntity> {
    try {
      const product = await this.findOne(id);
      product.stock_quantity = quantity;
      return await this.productsRepository.save(product);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to update stock: ${error.message}`,
        );
      }
      throw new BadRequestException(
        "Failed to update stock: Unknown error occurred",
      );
    }
  }

  async updateRating(id: number, rating: number): Promise<ProductEntity> {
    try {
      const product = await this.findOne(id);

      if (rating < 0 || rating > 5) {
        throw new BadRequestException("Rating must be between 0 and 5");
      }

      product.rating = rating;
      return await this.productsRepository.save(product);
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to update rating: ${error.message}`,
        );
      }
      throw new BadRequestException(
        "Failed to update rating: Unknown error occurred",
      );
    }
  }

  async countByCategory(categoryId: number): Promise<number> {
    try {
      return await this.productsRepository.count({
        where: {
          category_id: categoryId,
          is_active: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to count products: ${error.message}`,
        );
      }
      throw new BadRequestException(
        "Failed to count products: Unknown error occurred",
      );
    }
  }

  private generateSku(productName: string): string {
    const prefix = productName.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}-${timestamp}-${random}`;
  }
}
