"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X} from "lucide-react";
import { UploadDropzoneProps } from "@/services/upload/types/upload-response.type";


export default function UploadDropzone({
  label,
  onFileSelect,
}: UploadDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onFileSelect(file);
    },
    [onFileSelect],
  );

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: false,
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase italic">
        {label || "Pilih Gambar Produk"}
      </label>

      <div
        {...getRootProps()}
        className={`relative cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-blue-400"}
          ${preview ? "h-52" : "h-40"}
        `}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative w-full h-full flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="h-full object-contain rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-lg hover:bg-red-700"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <UploadCloud size={32} className="mx-auto text-gray-400 mb-2" />
          </div>
        )}
      </div>
    </div>
  );
}
