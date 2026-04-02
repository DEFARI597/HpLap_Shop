export enum ImageFolder {
  MAIN_PRODUCT = "products/main",
  ADDITIONAL_PRODUCT = "products/additional",
  CATEGORIES = "categories",
}

export interface UploadDropzoneProps {
  label?: string;
  onFileSelect: (file: File | null) => void;
}
