import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { UploadService } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageFolder } from "./cloudinary/cloudinary.service";

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("categories")
  @UseInterceptors(FileInterceptor("file"))
  uploadCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body("categoryId") categoryId: string,
  ) {
    return this.uploadService.uploadCategoriesImage(
      file,
      ImageFolder.CATEGORIES,
      Number(categoryId),
    );
  }

  @Post("products/main")
  @UseInterceptors(FileInterceptor("file"))
  uploadProductMain(
    @UploadedFile() file: Express.Multer.File,
    @Body("productId") productId: string,
  ) {
    return this.uploadService.uploadProductMainImage(
      file,
      ImageFolder.MAIN_PRODUCT,
      Number(productId),
    );
  }

  @Post("products/additional")
  @UseInterceptors(FileInterceptor("file"))
  UploadProductAdditional(
    @UploadedFile() file: Express.Multer.File,
    @Body("productId") productId: string,
  ) {
    return this.uploadService.uploadProductAdditionalImage(
      file,
      ImageFolder.ADDITIONAL_PRODUCT,
      Number(productId),
    );
  }

  @Patch(":id/remove-additional-image")
  async deleteProductAdditional(
    @Param("id") productId: number,
    @Body("imageUrl") imageUrl: string,
  ) {
    return this.uploadService.deleteProductAdditionalImage(
      Number(productId),
      imageUrl,
    );
  }
}
