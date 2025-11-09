"use client";

import React, { Suspense, lazy, ComponentType, LazyExoticComponent } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Generic lazy loading wrapper
interface LazyLoadOptions {
  fallback?: React.ComponentType;
  errorBoundary?: React.ComponentType<{ error: Error; retry: () => void }>;
  delay?: number;
  timeout?: number;
}

interface LoadingFallbackProps {
  className?: string;
  height?: number | string;
  rows?: number;
}

// Default loading fallback
const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  className, 
  height = 200, 
  rows = 3 
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton 
        key={i} 
        className="w-full" 
        style={{ height: typeof height === 'number' ? `${height / rows}px` : height }} 
      />
    ))}
  </div>
);

// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class LazyErrorBoundary extends React.Component<
  React.PropsWithChildren<{ onRetry?: () => void }>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ onRetry?: () => void }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-destructive mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-sm font-medium">Failed to load component</p>
            <p className="text-xs text-muted-foreground mt-1">
              {this.state.error?.message}
            </p>
          </div>
          {this.props.onRetry && (
            <button
              onClick={() => {
                this.setState({ hasError: false });
                this.props.onRetry?.();
              }}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy component wrapper
export function createLazyComponent<T = {}>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  options: LazyLoadOptions = {}
): LazyExoticComponent<ComponentType<T>> {
  const LazyComponent = lazy(() => {
    let importPromise = importFunc();

    // Add artificial delay if specified
    if (options.delay) {
      importPromise = importPromise.then(module => {
        return new Promise(resolve => {
          setTimeout(() => resolve(module), options.delay);
        });
      });
    }

    // Add timeout if specified
    if (options.timeout) {
      importPromise = Promise.race([
        importPromise,
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Component load timeout')), options.timeout);
        })
      ]);
    }

    return importPromise;
  });

  const WrappedComponent: React.FC<T> = (props) => {
    const [retryKey, setRetryKey] = React.useState(0);

    const handleRetry = () => {
      setRetryKey(prev => prev + 1);
    };

    return (
      <LazyErrorBoundary onRetry={handleRetry}>
        <Suspense fallback={<LoadingFallback />} key={retryKey}>
          <LazyComponent {...props} />
        </Suspense>
      </LazyErrorBoundary>
    );
  };

  return WrappedComponent as LazyExoticComponent<ComponentType<T>>;
}

// Higher-order component for lazy loading
export function withLazyLoading<P = {}>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: LazyLoadOptions = {}
) {
  return createLazyComponent(importFunc, options);
}

// Intersection Observer based lazy loading for non-critical components
interface LazyIntersectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export const LazyIntersection: React.FC<LazyIntersectionProps> = ({
  children,
  fallback = <LoadingFallback />,
  rootMargin = '50px',
  threshold = 0.1,
  className,
  once = true,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasIntersected(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return (
    <div ref={ref} className={className}>
      {(isVisible || hasIntersected) ? children : fallback}
    </div>
  );
};

// Hook for lazy loading data
export function useLazyLoad<T>(
  loadFunction: () => Promise<T>,
  trigger: boolean = true
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!trigger) return;

    let cancelled = false;
    
    const load = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await loadFunction();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [trigger, loadFunction]);

  const retry = React.useCallback(() => {
    setError(null);
    setData(null);
    // Trigger re-load by changing a dependency
  }, []);

  return { data, loading, error, retry };
}

// Pre-defined lazy components for common use cases
export const LazyDashboard = createLazyComponent(
  () => import('@/components/dashboard'),
  { delay: 100 }
);

export const LazyDataTable = createLazyComponent(
  () => import('@/components/ui/data-table'),
  { delay: 50 }
);

export const LazyChart = createLazyComponent(
  () => import('@/components/ui/chart'),
  { delay: 200 }
);

export const LazyImageEditor = createLazyComponent(
  () => import('@/components/ui/image-editor'),
  { delay: 300 }
);

// Component for lazy loading images
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  blurDataURL?: string;
  priority?: boolean;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallback,
  errorFallback,
  blurDataURL,
  priority = false,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(priority);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  if (hasError && errorFallback) {
    return <>{errorFallback}</>;
  }

  return (
    <div className={cn("relative overflow-hidden", className)} ref={imgRef}>
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* Loading fallback */}
      {!isLoaded && !blurDataURL && fallback && (
        <div className="absolute inset-0 flex items-center justify-center">
          {fallback}
        </div>
      )}

      {/* Actual image */}
      {isVisible && (
        <img
          {...props}
          src={src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};