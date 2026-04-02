import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import { CloudinaryConfig } from "./cloudinary.config";
import { Readable } from "stream";

export enum ImageFolder {
  MAIN_PRODUCT = "products/main",
  ADDITIONAL_PRODUCT = "products/additional",
  CATEGORIES = "categories",
}

export class CloudinaryService {
  constructor() {
    CloudinaryConfig();
  }

  async uploadImage(
    file: Express.Multer.File,
    subFolder: ImageFolder,
  ): Promise<UploadApiResponse> {
    if (!file || !file.buffer) {
      throw new Error(
        "Buffer file not found, please upload it properly",
      );
    }
    const fileName = file.originalname
      .split(".")[0]
      .replace(/[^a-zA-Z0-9]/g, "_");

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `${subFolder}`,
          public_id: `${fileName}_${Date.now()}`,
          use_filename: true,
          filename_override: fileName,
          unique_filename: false,
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(upload);
    });
  }
}
