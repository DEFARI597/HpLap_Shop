// services/upload/upload.service.ts
import { apiClient } from "../api-client";
import { UploadResponse } from "./types/upload-response.type";

class UploadService {
    private baseUrl = "/upload";

    async uploadFile(
        file: File,
        targetFolder: "categories" | "products",
        entityId?: number
    ): Promise<UploadResponse> {
        if (!file) {
            throw new Error("No file provided");
        }

        // Validate file type (extra safety)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error("Invalid file type. Only images are allowed.");
        }

        // Validate file size (using env or default 10MB)
        const maxSize = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 10485760;
        if (file.size > maxSize) {
            throw new Error(`File too large. Maximum size is ${maxSize / 1048576}MB`);
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("target_folder", targetFolder);

        if (entityId) {
            formData.append("entity_id", entityId.toString());
        }

        try {
            const response = await apiClient.post<UploadResponse>(
                `${this.baseUrl}/image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // Validate response structure
            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || "Upload failed");
            }

            return response.data;

        } catch (error: any) {
            // Transform API errors into meaningful messages
            if (error.response) {
                // Backend responded with error
                const message = error.response.data?.message ||
                    error.response.data?.error ||
                    `Upload failed with status ${error.response.status}`;
                throw new Error(message);
            } else if (error.request) {
                // Request made but no response
                throw new Error("No response from server. Please check your connection.");
            } else {
                // Something else went wrong
                throw new Error(error.message || "Upload failed");
            }
        }
    }
}

export const uploadService = new UploadService();