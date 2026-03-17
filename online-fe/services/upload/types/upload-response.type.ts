export interface UploadResponse {
    success: boolean;
    message: string;
    data: {
        filename: string;
        originalname: string;
        path: string;
        mimetype: string;
        size: number;
        url: string;
        folder: string;
    };
}

