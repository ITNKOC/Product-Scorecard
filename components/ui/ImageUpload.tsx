"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      onChange(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {value ? (
        // Image Preview
        <div className="relative group">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={value}
              alt="Product preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Upload Area
        <div
          onClick={openFileDialog}
          className={`
            w-full h-48 border-2 border-dashed border-gray-300 rounded-lg 
            flex flex-col items-center justify-center 
            hover:border-gray-400 hover:bg-gray-50 
            transition-all duration-200 cursor-pointer
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isUploading ? 'border-blue-400 bg-blue-50' : ''}
          `}
        >
          <div className="text-center p-6">
            {isUploading ? (
              <div className="space-y-3">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm font-medium text-blue-600">Upload en cours...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Cliquez pour ajouter une image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WebP jusqu'à 5MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!value && (
        <Button
          type="button"
          variant="outline"
          onClick={openFileDialog}
          disabled={disabled || isUploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Upload en cours...' : 'Choisir une image'}
        </Button>
      )}
    </div>
  );
}