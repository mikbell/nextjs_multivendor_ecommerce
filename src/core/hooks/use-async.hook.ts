import { useState, useCallback, useRef, useEffect } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for managing async operations with loading, error, and success states
 */
export function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { immediate = false, onSuccess, onError } = options;
  
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const activeRequestRef = useRef<Promise<T> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const promise = asyncFunction(...args);
        activeRequestRef.current = promise;
        
        const data = await promise;
        
        // Only update state if this is still the active request and component is mounted
        if (activeRequestRef.current === promise && mountedRef.current) {
          setState({ data, loading: false, error: null });
          onSuccess?.(data);
          return data;
        }
        
        return null;
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        
        // Only update state if component is mounted
        if (mountedRef.current) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: errorObj 
          }));
          onError?.(errorObj);
        }
        
        throw errorObj;
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
    activeRequestRef.current = null;
  }, []);

  const cancel = useCallback(() => {
    activeRequestRef.current = null;
    setState(prev => ({ ...prev, loading: false }));
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
    cancel,
    isLoading: state.loading,
    isError: !!state.error,
    isSuccess: !state.loading && !state.error && state.data !== null,
  };
}