import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
  DefaultValuePipe,
  NotFoundException,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductFilterDto } from "./dto/filter-product.dto";
import { ProductType } from "../entities/products.entities";

@Controller("products")
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productsService.create(createProductDto);
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
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

  @Get()
  async findAll(@Query() filterDto: ProductFilterDto) {
    try {
      return await this.productsService.findAll(filterDto);
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

  @Get("featured")
  async getFeatured(
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    try {
      return await this.productsService.getFeatured(limit);
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

  @Get("type/:type")
  async findByType(@Param("type") type: ProductType) {
    try {
      // Validate product type
      if (!Object.values(ProductType).includes(type)) {
        throw new BadRequestException(
          `Invalid product type: ${type}. Allowed types: ${Object.values(ProductType).join(", ")}`,
        );
      }
      return await this.productsService.findByType(type);
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
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

  @Get("category/:categoryId")
  async findByCategory(@Param("categoryId", ParseIntPipe) categoryId: number) {
    try {
      if (categoryId <= 0) {
        throw new BadRequestException("Category ID must be a positive number");
      }
      return await this.productsService.findByCategory(categoryId);
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
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

  @Get("category/:categoryId/count")
  async countByCategory(@Param("categoryId", ParseIntPipe) categoryId: number) {
    try {
      if (categoryId <= 0) {
        throw new BadRequestException("Category ID must be a positive number");
      }
      const count = await this.productsService.countByCategory(categoryId);
      return {
        category_id: categoryId,
        product_count: count,
      };
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
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

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    try {
      if (id <= 0) {
        throw new BadRequestException("Product ID must be a positive number");
      }
      return await this.productsService.findOne(id);
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
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

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      if (id <= 0) {
        throw new BadRequestException("Product ID must be a positive number");
      }
      return await this.productsService.update(id, updateProductDto);
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
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

  @Patch(":id/stock")
  async updateStock(
    @Param("id", ParseIntPipe) id: number,
    @Body("quantity", ParseIntPipe) quantity: number,
  ) {
    try {
      if (id <= 0) {
        throw new BadRequestException("Product ID must be a positive number");
      }
      if (quantity < 0) {
        throw new BadRequestException("Stock quantity cannot be negative");
      }
      return await this.productsService.updateStock(id, quantity);
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
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

  @Patch(":id/rating")
  async updateRating(
    @Param("id", ParseIntPipe) id: number,
    @Body("rating") rating: number,
  ) {
    try {
      if (id <= 0) {
        throw new BadRequestException("Product ID must be a positive number");
      }

      // Validate rating
      const ratingNum = Number(rating);
      if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
        throw new BadRequestException(
          "Rating must be a number between 0 and 5",
        );
      }

      return await this.productsService.updateRating(id, ratingNum);
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

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id", ParseIntPipe) id: number) {
    try {
      if (id <= 0) {
        throw new BadRequestException("Product ID must be a positive number");
      }
      await this.productsService.remove(id);
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
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

  @Delete(":id/soft")
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param("id", ParseIntPipe) id: number) {
    try {
      if (id <= 0) {
        throw new BadRequestException("Product ID must be a positive number");
      }
      await this.productsService.softDelete(id);
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
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

  @Patch(":id/restore")
  async restore(@Param("id", ParseIntPipe) id: number) {
    try {
      if (id <= 0) {
        throw new BadRequestException("Product ID must be a positive number");
      }
      await this.productsService.restore(id);
      return await this.productsService.findOne(id);
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
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
}
