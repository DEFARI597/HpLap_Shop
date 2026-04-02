import { Injectable } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary/cloudinary.service";
import { UploadApiResponse } from "cloudinary";
import { ImageFolder } from "./cloudinary/cloudinary.service";
import { ProductEntity } from "../entities/products.entities";
import { CategoriesEntity } from "../entities/categories.entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,
    @InjectRepository(CategoriesEntity)
    private categoriesRepo: Repository<CategoriesEntity>,
  ) {}

  async uploadProductMainImage(
    file: Express.Multer.File,
    folder: ImageFolder.MAIN_PRODUCT,
    productId: number,
  ): Promise<UploadApiResponse> {
    try {
      const result = await this.cloudinaryService.uploadImage(file, folder);

      await this.productRepo.update(productId, {
        product_main_image: result.secure_url,
      });

      return result;
    } catch (error) {
      console.log("failed uploaded", error);
      throw error;
    }
  }

  async uploadProductAdditionalImage(
    file: Express.Multer.File,
    folder: ImageFolder.ADDITIONAL_PRODUCT,
    productId: number,
  ): Promise<UploadApiResponse> {
    try {
      const result = await this.cloudinaryService.uploadImage(file, folder);
      const product = await this.productRepo.findOneBy({
        product_id: productId,
      });

      const currentImage = product?.product_additional_image || [];
      const updatedImage = [...currentImage, result.secure_url];

      await this.productRepo.update(productId, {
        product_additional_image: updatedImage,
      });

      return result;
    } catch (error) {
      console.log("failed upload", error);
      throw error;
    }
  }

  async uploadCategoriesImage(
    file: Express.Multer.File,
    folder: ImageFolder.CATEGORIES,
    categoryId: number,
  ): Promise<UploadApiResponse> {
    try {
      const result = await this.cloudinaryService.uploadImage(file, folder);

      await this.categoriesRepo.update(categoryId, {
        category_image: result.secure_url,
      });

      return result;
    } catch (error) {
      console.log("failed upload", error);
      throw error;
    }
  }

  async deleteProductAdditionalImage(productId: number, imageUrl: string) {
    try {
      const product = await this.productRepo.findOneBy({product_id: productId});

      if (!product) {
        throw new Error("product not found");
      }

      const currentImage = product.product_additional_image || [];
      const updatedImage = currentImage.filter((img) => img !== imageUrl);

      await this.productRepo.update(productId, {
        product_additional_image: updatedImage
      })

      return {success: true, message: "image removed from database"};
    } catch (error) {
      console.log("failed to delete image")
      throw error;
    }
  }
}
