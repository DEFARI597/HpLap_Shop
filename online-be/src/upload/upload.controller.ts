import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from "@nestjs/common";
import { UploadService } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "../common/config/multer.config";

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post("image")
  @UseInterceptors(FileInterceptor(process.env.UPLOAD_FIELD_NAME || 'file', MulterOptions))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('target_folder') targetFolder: string,
    @Body('entity_id') entityId: number,
  ) {
    const result = await this.uploadService.uploadFile(file, targetFolder, entityId);
    console.log("🚀 ~ UploadController ~ uploadImage ~ result:", result)

    return {
      success: true,
      message: "File uploaded successfully",
      data: result,
    }
  }
}