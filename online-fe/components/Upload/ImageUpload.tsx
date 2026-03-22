"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { uploadService } from "@/services/upload/upload.service";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  onImageRemove?: () => void;
  currentImage?: string;
  folder?: "categories" | "products";
  entityId?: number; // Added entityId prop
  className?: string;
}

export default function ImageUpload({
  onImageUploaded,
  onImageRemove,
  currentImage,
  folder = "products",
  entityId, // Now using entityId
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Clean up blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          // Stop at 90% until actual completion
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    return interval;
  };

  // Handle file drop
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setError(null);
      setUploading(true);

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Simulate upload progress
      const interval = simulateProgress();

      try {
        // Use uploadService instead of direct fetch
        const response = await uploadService.uploadFile(
          file,
          folder,
          entityId, // Pass entityId if available
        );

        clearInterval(interval);
        setProgress(100);

        // Call the callback with the uploaded image URL
        onImageUploaded(response.data.url);

        setTimeout(() => {
          setProgress(0);
          setUploading(false);
        }, 500);
      } catch (err) {
        clearInterval(interval);
        setError(err instanceof Error ? err.message : "Failed to upload image");
        setUploading(false);
        setProgress(0);

        // Revert preview on error
        if (currentImage) {
          setPreview(currentImage);
        } else {
          setPreview(null);
          // Clean up the blob URL
          URL.revokeObjectURL(objectUrl);
        }
      }
    },
    [folder, onImageUploaded, currentImage, entityId], // Added entityId to deps
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const handleRemove = () => {
    // Clean up blob URL before removing
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const handleBrowseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onDrop([file]);
      }
    };
    input.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => {
                // If image fails to load, reset preview
                if (preview.startsWith("blob:")) {
                  URL.revokeObjectURL(preview);
                }
                setPreview(null);
              }}
            />

            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 size={32} className="animate-spin mx-auto mb-2" />
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs mt-1">{progress}%</p>
                </div>
              </div>
            )}

            {!uploading && (
              <>
                <button
                  onClick={handleBrowseClick}
                  className="absolute top-2 right-2 p-2 bg-accent text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Change Image"
                  type="button"
                >
                  <Upload size={16} />
                </button>
                <button
                  onClick={handleRemove}
                  className="absolute top-2 right-12 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Remove Image"
                  type="button"
                >
                  <X size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-accent bg-blue-50"
              : "border-gray-300 hover:border-accent hover:bg-gray-50"
          } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <div>
              <Loader2
                size={32}
                className="animate-spin text-accent mx-auto mb-2"
              />
              <p className="text-sm text-gray-600">Uploading... {progress}%</p>
            </div>
          ) : (
            <>
              <ImageIcon size={32} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                {isDragActive
                  ? "Drop image here"
                  : "Drag & drop or click to upload"}
              </p>
              <button
                type="button"
                onClick={handleBrowseClick}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Files
              </button>
              <p className="text-xs text-gray-400 mt-2">
                PNG, JPG, GIF, WebP up to 5MB
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle
            size={16}
            className="text-red-500 mt-0.5 flex-shrink-0"
          />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
