import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface ProductFormState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

export const useProductForm = () => {
  const [state, setState] = useState<ProductFormState>({
    isSubmitting: false,
    error: null,
    success: false,
  });

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting, error: null }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, isSubmitting: false }));
    toast.error(error);
  }, []);

  const setSuccess = useCallback((message?: string) => {
    setState({ isSubmitting: false, error: null, success: true });
    if (message) {
      toast.success(message);
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isSubmitting: false, error: null, success: false });
  }, []);

  return {
    ...state,
    setSubmitting,
    setError,
    setSuccess,
    reset,
  };
};

// Hook per la gestione delle immagini del prodotto
export const useProductImages = (initialImages: { url: string }[] = []) => {
  const [images, setImages] = useState<{ url: string }[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);

  const addImage = useCallback((url: string) => {
    const newImage = { url };
    setImages(prev => [...prev, newImage]);
    return newImage;
  }, []);

  const removeImage = useCallback((url: string) => {
    setImages(prev => prev.filter(img => img.url !== url));
  }, []);

  const updateImageOrder = useCallback((dragIndex: number, dropIndex: number) => {
    setImages(prev => {
      const updated = [...prev];
      const draggedItem = updated[dragIndex];
      if (!draggedItem) return updated; // Safety check for invalid dragIndex
      updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, draggedItem);
      return updated;
    });
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  return {
    images,
    isUploading,
    setIsUploading,
    addImage,
    removeImage,
    updateImageOrder,
    clearImages,
    setImages,
  };
};

// Hook per la gestione dei colori del prodotto
export const useProductColors = (initialColors: { color: string }[] = [{ color: '' }]) => {
  const [colors, setColors] = useState<{ color: string }[]>(initialColors);

  const addColor = useCallback(() => {
    setColors(prev => [...prev, { color: '' }]);
  }, []);

  const updateColor = useCallback((index: number, color: string) => {
    setColors(prev => prev.map((item, i) => i === index ? { color } : item));
  }, []);

  const removeColor = useCallback((index: number) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  }, []);

  const resetColors = useCallback(() => {
    setColors([{ color: '' }]);
  }, []);

  return {
    colors,
    setColors,
    addColor,
    updateColor,
    removeColor,
    resetColors,
  };
};

// Hook per la gestione delle taglie del prodotto
export const useProductSizes = (initialSizes: { size: string; price: number; quantity: number; discount: number }[] = [
  { size: '', quantity: 1, price: 0.01, discount: 0 }
]) => {
  const [sizes, setSizes] = useState(initialSizes);

  const addSize = useCallback(() => {
    setSizes(prev => [...prev, { size: '', quantity: 1, price: 0.01, discount: 0 }]);
  }, []);

  const updateSize = useCallback((index: number, updates: Partial<typeof initialSizes[0]>) => {
    setSizes(prev => prev.map((item, i) => i === index ? { ...item, ...updates } : item));
  }, []);

  const removeSize = useCallback((index: number) => {
    setSizes(prev => prev.filter((_, i) => i !== index));
  }, []);

  const resetSizes = useCallback(() => {
    setSizes([{ size: '', quantity: 1, price: 0.01, discount: 0 }]);
  }, []);

  return {
    sizes,
    setSizes,
    addSize,
    updateSize,
    removeSize,
    resetSizes,
  };
};