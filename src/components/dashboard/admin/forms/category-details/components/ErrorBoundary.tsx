"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Heading from "@/components/shared/heading";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
}

export class CategoryFormErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
    };
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error('CategoryForm Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
    });

    this.setState({
      error,
      errorInfo,
      errorId: this.generateErrorId(),
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: this.generateErrorId(),
      });
    }
  };

  private handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private getErrorType(error: Error | null): string {
    if (!error) return 'Unknown Error';
    
    if (error.name === 'ChunkLoadError') return 'Loading Error';
    if (error.message.includes('Network Error')) return 'Network Error';
    if (error.message.includes('TypeError')) return 'Type Error';
    if (error.message.includes('ReferenceError')) return 'Reference Error';
    if (error.message.includes('ValidationError')) return 'Validation Error';
    
    return error.name || 'Application Error';
  }

  private getErrorSeverity(error: Error | null): 'low' | 'medium' | 'high' {
    if (!error) return 'medium';
    
    if (error.name === 'ChunkLoadError' || error.message.includes('Network Error')) {
      return 'medium';
    }
    if (error.message.includes('TypeError') || error.message.includes('ReferenceError')) {
      return 'high';
    }
    
    return 'medium';
  }

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorType = this.getErrorType(this.state.error);
      const errorSeverity = this.getErrorSeverity(this.state.error);
      const canRetry = this.retryCount < this.maxRetries;

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Header */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-destructive/10 rounded-full animate-pulse"></div>
                <AlertTriangle className="w-10 h-10 text-destructive relative z-10" />
              </div>
              <Heading>
                Oops! Qualcosa è andato storto
              </Heading>
              <p className="text-muted-foreground text-lg">
                Si è verificato un errore durante il caricamento del modulo categoria
              </p>
            </div>

            {/* Error Details Card */}
            <div className="bg-card border border-border rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bug className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Dettagli errore</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={errorSeverity === 'high' ? 'destructive' : errorSeverity === 'medium' ? 'secondary' : 'outline'}>
                    {errorType}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ID: {this.state.errorId}
                  </Badge>
                </div>
              </div>

              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Errore rilevato</AlertTitle>
                <AlertDescription>
                  {this.state.error?.message || 'Errore sconosciuto nel caricamento del form categoria'}
                </AlertDescription>
              </Alert>

              {/* Troubleshooting suggestions */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-medium text-sm mb-2">Possibili soluzioni:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Controlla la connessione internet</li>
                  <li>• Ricarica la pagina</li>
                  <li>• Svuota la cache del browser</li>
                  <li>• Prova a tornare indietro e riaccedere</li>
                  {errorType === 'Loading Error' && <li>• Controlla se ci sono aggiornamenti dell'applicazione</li>}
                </ul>
              </div>

              {/* Development details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                    Stack trace (solo in sviluppo)
                  </summary>
                  <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-48">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-32">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {canRetry && (
                <Button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  Riprova ({this.maxRetries - this.retryCount} tentativi rimasti)
                </Button>
              )}
              
              <Button
                onClick={this.handleGoBack}
                variant="outline"
                className="flex items-center gap-2"
                size="lg"
              >
                <ArrowLeft className="w-4 h-4" />
                Torna indietro
              </Button>

              <Button
                onClick={this.handleReload}
                variant={canRetry ? "ghost" : "default"}
                className="flex items-center gap-2"
                size="lg"
              >
                <RefreshCw className="w-4 h-4" />
                Ricarica pagina
              </Button>
            </div>

            {/* Support info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Se il problema persiste, contatta il supporto tecnico con il codice errore: 
                <code className="ml-1 px-2 py-1 bg-muted rounded text-xs font-mono">
                  {this.state.errorId}
                </code>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export a wrapper component for easier usage
export const withCategoryFormErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WithErrorBoundaryComponent: React.FC<P> = (props) => (
    <CategoryFormErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </CategoryFormErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withCategoryFormErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
};