"use client";

import { FC, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

interface CloudinaryWidgetOptions {
  cloudName: string;
  uploadPreset: string;
  multiple?: boolean;
  maxFiles?: number;
  tags?: string[];
  clientAllowedFormats?: string[];
  maxFileSize?: number;
}

interface CloudinaryResult {
  event: string;
  info?: {
    secure_url: string;
    [key: string]: unknown;
  };
}

interface CloudinaryWidgetWrapperProps {
  options: CloudinaryWidgetOptions;
  onSuccess: (result: CloudinaryResult) => void;
  onError: (error: unknown) => void;
  children: (options: { open?: () => void }) => React.ReactNode;
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: CloudinaryWidgetOptions,
        callback: (error: unknown, result: CloudinaryResult) => void
      ) => {
        open: () => void;
        close: () => void;
        destroy: () => void;
      };
    };
  }
}

const CloudinaryWidgetWrapper: FC<CloudinaryWidgetWrapperProps> = ({
  options,
  onSuccess,
  onError,
  children,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [widget, setWidget] = useState<{ open: () => void; close: () => void; destroy: () => void } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const loadCloudinaryWidget = () => {
      // Check if script is already loaded
      if (window.cloudinary) {
        console.log('✅ [CloudinaryWidget] Cloudinary already loaded');
        setIsLoaded(true);
        setIsLoading(false);
        return;
      }

      // Check if script is already in DOM
      const existingScript = document.querySelector('script[src*="cloudinary.com"]');
      if (existingScript) {
        console.log('⏳ [CloudinaryWidget] Script already loading...');
        existingScript.addEventListener('load', () => {
          setIsLoaded(true);
          setIsLoading(false);
        });
        existingScript.addEventListener('error', () => {
          setError('Failed to load Cloudinary script');
          setIsLoading(false);
        });
        return;
      }

      console.log('📦 [CloudinaryWidget] Loading Cloudinary script...');
      
      // Create and load script
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      
      script.onload = () => {
        console.log('✅ [CloudinaryWidget] Script loaded successfully');
        setIsLoaded(true);
        setIsLoading(false);
      };
      
      script.onerror = () => {
        console.error('❌ [CloudinaryWidget] Failed to load script');
        setError('Failed to load Cloudinary script');
        setIsLoading(false);
      };
      
      scriptRef.current = script;
      document.head.appendChild(script);
    };

    loadCloudinaryWidget();

    // Cleanup
    return () => {
      if (widget) {
        try {
          widget.destroy();
        } catch (e) {
          console.warn('Warning destroying widget:', e);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && window.cloudinary && !widget) {
      console.log('🔧 [CloudinaryWidget] Creating widget with options:', options);
      
      try {
        const newWidget = window.cloudinary.createUploadWidget(
          options,
          (error: unknown, result: CloudinaryResult) => {
            if (error) {
              console.error('❌ [CloudinaryWidget] Widget error:', error);
              onError(error);
              return;
            }
            
            if (result) {
              console.log('📸 [CloudinaryWidget] Widget result:', result.event, result);
              onSuccess(result);
            }
          }
        );
        
        setWidget(newWidget);
        console.log('✅ [CloudinaryWidget] Widget created successfully');
      } catch (e) {
        console.error('❌ [CloudinaryWidget] Error creating widget:', e);
        setError('Failed to create upload widget');
      }
    }
  }, [isLoaded]);

  const handleOpen = () => {
    if (!widget) {
      console.error('❌ [CloudinaryWidget] Widget not available');
      onError(new Error('Upload widget not available'));
      return;
    }
    
    try {
      console.log('🖼️ [CloudinaryWidget] Opening widget...');
      widget.open();
    } catch (e) {
      console.error('❌ [CloudinaryWidget] Error opening widget:', e);
      onError(e);
    }
  };

  if (isLoading) {
    return (
      <Button disabled className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Caricamento widget...</span>
      </Button>
    );
  }

  if (error) {
    return (
      <Button disabled variant="destructive" className="flex items-center gap-2">
        <Upload className="h-4 w-4" />
        <span>Errore caricamento</span>
      </Button>
    );
  }

  // Se è caricato ma il widget non è ancora pronto, mostra loading
  if (isLoaded && !widget) {
    return (
      <Button disabled className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Inizializzazione widget...</span>
      </Button>
    );
  }

  return (
    <>
      {children({ 
        open: widget ? handleOpen : undefined 
      })}
    </>
  );
};

export default CloudinaryWidgetWrapper;