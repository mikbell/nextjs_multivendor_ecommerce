"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

interface SimpleImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onRemove: (url: string) => void;
  maxImages?: number;
  disabled?: boolean;
}

export default function SimpleImageUpload({
  value = [],
  onChange,
  onRemove,
  maxImages = 10,
  disabled = false
}: SimpleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - value.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    if (filesToUpload.length === 0) {
      toast.error(`Limite di ${maxImages} immagini raggiunto`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = filesToUpload.map(async (file, index) => {
        console.log(`📤 [SimpleUpload] Uploading file ${index + 1}/${filesToUpload.length}:`, file.name);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET!);
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`✅ [SimpleUpload] File ${index + 1} uploaded:`, result.secure_url);
        
        // Update progress
        setUploadProgress(((index + 1) / filesToUpload.length) * 100);
        
        return result.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newUrls = [...value, ...uploadedUrls];
      
      console.log('🎉 [SimpleUpload] All uploads completed:', uploadedUrls);
      onChange(newUrls);
      toast.success(`${uploadedUrls.length} immagini caricate con successo!`);
      
    } catch (error) {
      console.error('❌ [SimpleUpload] Upload error:', error);
      toast.error('Errore durante il caricamento: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const canAddMore = value.length < maxImages;
  const remainingSlots = maxImages - value.length;

  return (
    <div className="space-y-4">
      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div key={url} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
                sizes="200px"
              />
              <button
                type="button"
                onClick={() => onRemove(url)}
                disabled={disabled}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80 disabled:opacity-50"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Controls */}
      <div className="flex items-center gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={disabled || isUploading || !canAddMore}
          className="hidden"
        />
        
        <Button
          type="button"
          variant={value.length === 0 ? "default" : "outline"}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading || !canAddMore}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isUploading ? 'Caricamento...' : canAddMore ? 'Aggiungi Immagini' : 'Limite Raggiunto'}
        </Button>

        {canAddMore && (
          <span className="text-sm text-muted-foreground">
            {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} disponibili
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Caricamento in corso...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{value.length} / {maxImages} immagini</span>
        <span>Formati supportati: JPG, PNG, GIF, WebP</span>
      </div>
    </div>
  );
}