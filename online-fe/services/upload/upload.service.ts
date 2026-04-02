import { apiClient } from "../api-client";
import { ApiResponse } from "../api-response";
import { ImageFolder } from "./types/upload-response.type";

export class UploadService {
  async UploadMainProductImage(
    file: File,
    folder: ImageFolder.MAIN_PRODUCT,
    productId: number,
  ): Promise<ApiResponse<any>> {
    return apiClient.upload<any>(`/upload/${folder}`, file, {
      productId: productId.toString(),
    });
  }

  async UploadAdditionalProductImage(
    file: File,
    folder: ImageFolder.ADDITIONAL_PRODUCT,
    productId: number,
  ): Promise<ApiResponse<any>> {
    return apiClient.upload(`/upload/${folder}`, file, {
      productId: productId.toString(),
    });
  }

  async UploadCategoriesImage(
    file: File,
    folder: ImageFolder.CATEGORIES,
    categoryId: number,
  ) {
    return apiClient.upload(`/upload/${folder}`, file, {
      categoryId: categoryId.toString(),
    });
  }

  async DeleteProductAdditionalImage(
    productId: number,
    imageUrl: string
  ) {
    return apiClient.patch(`/upload/${productId}/remove-additional-image`, {
      imageUrl: imageUrl
    })
  }
}
