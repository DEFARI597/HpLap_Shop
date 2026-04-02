import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { CloudinaryService } from "./cloudinary/cloudinary.service";
import { ProductEntity } from "../entities/products.entities";
import { CategoriesEntity } from "../entities/categories.entities";

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
    TypeOrmModule.forFeature([ProductEntity, CategoriesEntity]),
  ],
  controllers: [UploadController],
  providers: [UploadService, CloudinaryService],
})
export class UploadModule {}
