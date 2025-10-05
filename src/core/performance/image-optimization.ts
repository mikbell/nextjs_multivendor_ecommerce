import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { cn } from "@/core/utils";

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Automatically detects if image is from Cloudinary and applies appropriate optimization
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = "empty",
  blurDataURL,
  sizes,
  fill = false,
  loading = "lazy",
  onLoad,
  onError,
}: OptimizedImageProps) {
  const isCloudinary = src.includes('cloudinary');
  
  const commonProps = {
    alt,
    className: cn("transition-opacity duration-200", className),
    onLoad,
    onError,
  };

  if (isCloudinary) {
    // Use Cloudinary optimization
    const cloudinaryProps = {
      ...commonProps,
      src,
      width,
      height,
      quality,
      loading,
      priority,
      sizes: sizes || `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`,
      crop: "fill" as const,
      gravity: "auto" as const,
      format: "auto" as const,
    };

    if (fill) {
      return (
        <CldImage
          {...cloudinaryProps}
          fill
          style={{ objectFit: "cover" }}
        />
      );
    }

    return (
      <CldImage
        {...cloudinaryProps}
        width={width || 800}
        height={height || 600}
      />
    );
  }

  // Use Next.js Image optimization for other sources
  const nextImageProps = {
    ...commonProps,
    src,
    width,
    height,
    quality,
    priority,
    placeholder,
    blurDataURL,
    sizes: sizes || `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`,
  };

  if (fill) {
    return (
      <Image
        {...nextImageProps}
        fill
        style={{ objectFit: "cover" }}
      />
    );
  }

  return (
    <Image
      {...nextImageProps}
      width={width || 800}
      height={height || 600}
    />
  );
}

/**
 * Generate optimized image URLs for different screen sizes
 */
export function generateImageSrcSet(
  src: string,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1600]
): string {
  if (!src.includes('cloudinary')) {
    return src; // Return original if not Cloudinary
  }

  const srcSet = sizes
    .map(size => {
      // Modify Cloudinary URL to include size transformation
      const transformedUrl = src.replace(
        '/upload/',
        `/upload/w_${size},f_auto,q_auto/`
      );
      return `${transformedUrl} ${size}w`;
    })
    .join(', ');

  return srcSet;
}

/**
 * Generate blur placeholder for images
 */
export async function generateBlurPlaceholder(
  src: string,
  width: number = 10,
  height: number = 10
): Promise<string> {
  if (!src.includes('cloudinary')) {
    // For non-Cloudinary images, return a simple base64 placeholder
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";
  }

  try {
    // Generate a small blurred version using Cloudinary
    const blurUrl = src.replace(
      '/upload/',
      `/upload/w_${width},h_${height},f_auto,q_auto,e_blur:1000/`
    );
    
    // In a real implementation, you might want to fetch this and convert to base64
    // For now, return the Cloudinary blur URL
    return blurUrl;
  } catch (error) {
    console.error('Error generating blur placeholder:', error);
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";
  }
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, as: "image" = "image"): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Image optimization utilities
 */
export const ImageUtils = {
  /**
   * Check if image is in viewport
   */
  isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const threshold = 200; // Load images 200px before they enter viewport
    
    return (
      rect.bottom >= -threshold &&
      rect.right >= -threshold &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth) + threshold
    );
  },

  /**
   * Get optimal image size based on container
   */
  getOptimalSize(container: HTMLElement): { width: number; height: number } {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    return {
      width: Math.ceil(rect.width * dpr),
      height: Math.ceil(rect.height * dpr),
    };
  },

  /**
   * Format image URL for different qualities
   */
  formatImageUrl(src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}): string {
    if (!src.includes('cloudinary')) return src;

    const { width, height, quality = 75, format = 'auto' } = options;
    
    let transformation = `f_${format},q_${quality}`;
    
    if (width) transformation += `,w_${width}`;
    if (height) transformation += `,h_${height}`;
    
    return src.replace('/upload/', `/upload/${transformation}/`);
  },

  /**
   * Create responsive image sizes attribute
   */
  createSizesAttribute(breakpoints: { [key: string]: string }): string {
    return Object.entries(breakpoints)
      .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
      .join(', ');
  },
};