"use client";

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown } from 'lucide-react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Error types
export interface ErrorBoundaryError {
  message: string;
  stack?: string;
  componentStack?: string;
  name?: string;
  digest?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: ErrorBoundaryError;
  eventId?: string;
  retryCount: number;
}

// Error boundary props
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRetry?: boolean;
  maxRetries?: number;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number | boolean | null | undefined>;
  isolate?: boolean;
  level?: 'page' | 'section' | 'component';
}

// Error fallback props
export interface ErrorFallbackProps {
  error?: ErrorBoundaryError;
  resetError: () => void;
  retryCount: number;
  canRetry: boolean;
  level?: 'page' | 'section' | 'component';
}

// Base Error Boundary Component
export class BaseErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorBoundaryError: ErrorBoundaryError = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      name: error.name,
    };

    // Log error details
    logger.error('Error Boundary caught an error:', {
      error: errorBoundaryError,
      errorInfo,
      props: this.props,
      retryCount: this.state.retryCount,
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    this.setState({
      error: errorBoundaryError,
    });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && !prevProps.hasError) {
      // Reset on props change
      if (resetOnPropsChange) {
        this.resetErrorBoundary();
        return;
      }

      // Reset on key change
      if (resetKeys && resetKeys.length > 0) {
        const hasResetKeyChanged = resetKeys.some((key, idx) => {
          return prevProps.resetKeys?.[idx] !== key;
        });

        if (hasResetKeyChanged) {
          this.resetErrorBoundary();
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.setState({
      hasError: false,
      error: undefined,
      eventId: undefined,
    });
  };

  handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      logger.warn('Max retries reached', { retryCount, maxRetries });
      return;
    }

    this.setState(
      (prevState) => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1,
      }),
      () => {
        // Auto-reset retry count after successful render
        this.resetTimeoutId = window.setTimeout(() => {
          this.setState({ retryCount: 0 });
        }, 30000);
      }
    );
  };

  render() {
    const { hasError, error, retryCount } = this.state;
    const { 
      children, 
      fallback: Fallback = DefaultErrorFallback, 
      enableRetry = true,
      maxRetries = 3,
      level = 'component'
    } = this.props;

    if (hasError) {
      const canRetry = enableRetry && retryCount < maxRetries;

      return (
        <Fallback
          error={error}
          resetError={this.resetErrorBoundary}
          retryCount={retryCount}
          canRetry={canRetry}
          level={level}
        />
      );
    }

    return children;
  }
}

// Default Error Fallback Component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  retryCount,
  canRetry,
  level = 'component',
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  
  const getTitle = () => {
    switch (level) {
      case 'page':
        return 'Página não disponível';
      case 'section':
        return 'Seção não disponível';
      default:
        return 'Algo deu errado';
    }
  };

  const getDescription = () => {
    switch (level) {
      case 'page':
        return 'Desculpe, esta página encontrou um erro inesperado.';
      case 'section':
        return 'Esta seção não pôde ser carregada devido a um erro.';
      default:
        return 'Este componente encontrou um erro inesperado.';
    }
  };

  return (
    <Card className={cn(
      "border-destructive/50",
      level === 'page' && "min-h-[400px]",
      level === 'section' && "min-h-[200px]"
    )}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        <CardTitle className="text-destructive">{getTitle()}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {getDescription()}
        </p>
        {retryCount > 0 && (
          <p className="text-xs text-muted-foreground">
            Tentativa {retryCount + 1}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {canRetry && (
            <Button onClick={resetError} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          )}
          
          {level === 'page' && (
            <Button onClick={() => window.location.href = '/'} size="sm">
              <Home className="w-4 h-4 mr-2" />
              Ir para início
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            <ChevronDown className={cn(
              "w-4 h-4 mr-2 transition-transform",
              showDetails && "rotate-180"
            )} />
            {showDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
          </Button>
        </div>

        {showDetails && error && (
          <div className="mt-4 p-4 bg-muted rounded-md text-xs">
            <details>
              <summary className="cursor-pointer font-medium mb-2">
                Detalhes do erro
              </summary>
              <div className="space-y-2 text-muted-foreground">
                <div>
                  <strong>Mensagem:</strong> {error.message}
                </div>
                {error.name && (
                  <div>
                    <strong>Tipo:</strong> {error.name}
                  </div>
                )}
                {error.stack && (
                  <div>
                    <strong>Stack trace:</strong>
                    <pre className="mt-1 whitespace-pre-wrap break-all">
                      {error.stack}
                    </pre>
                  </div>
                )}
                {error.componentStack && (
                  <div>
                    <strong>Component stack:</strong>
                    <pre className="mt-1 whitespace-pre-wrap break-all">
                      {error.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Specialized Error Boundaries
export const PageErrorBoundary: React.FC<Omit<ErrorBoundaryProps, 'level'>> = (props) => (
  <BaseErrorBoundary {...props} level="page" />
);

export const SectionErrorBoundary: React.FC<Omit<ErrorBoundaryProps, 'level'>> = (props) => (
  <BaseErrorBoundary {...props} level="section" />
);

export const ComponentErrorBoundary: React.FC<Omit<ErrorBoundaryProps, 'level'>> = (props) => (
  <BaseErrorBoundary {...props} level="component" />
);

// HOC for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <BaseErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </BaseErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for error reporting
export function useErrorHandler() {
  return React.useCallback((error: Error, context?: Record<string, any>) => {
    logger.error('Manual error report:', { error, context });
    
    // In a real app, you might want to send this to a service like Sentry
    console.error('Error reported:', error, context);
  }, []);
}

// Global error handler hook
export function useGlobalErrorHandler() {
  React.useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    };

    // Handle general errors
    const handleError = (event: ErrorEvent) => {
      logger.error('Global error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);
}

// Type definitions
interface ComponentType<P = {}> {
  (props: P): ReactNode;
  displayName?: string;
  name?: string;
}

export {
  BaseErrorBoundary as ErrorBoundary,
  DefaultErrorFallback as ErrorFallback,
};