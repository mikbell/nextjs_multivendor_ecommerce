"use client";

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            logger.error('Query error:', { error, queryKey: query.queryKey });
            
            // Show toast for specific errors
            if (error instanceof Error && !query.state.data) {
              toast.error(`Something went wrong: ${error.message}`);
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, variables, context, mutation) => {
            logger.error('Mutation error:', {
              error,
              variables,
              mutationKey: mutation.options.mutationKey,
            });
            
            // Show toast for mutation errors
            if (error instanceof Error) {
              toast.error(`Action failed: ${error.message}`);
            }
          },
          onSuccess: (data, variables, context, mutation) => {
            // Show success toast for mutations with meta.successMessage
            const meta = mutation.options.meta;
            if (meta?.successMessage) {
              toast.success(meta.successMessage as string);
            }
          },
        }),
        defaultOptions: {
          queries: {
            // Time before data is considered stale
            staleTime: 5 * 60 * 1000, // 5 minutes
            
            // Time before cache is garbage collected
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            
            // Retry configuration
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors
              if (error instanceof Error && error.message.includes('4')) {
                return false;
              }
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            
            // Refetch configuration
            refetchOnWindowFocus: false,
            refetchOnReconnect: 'always',
            refetchOnMount: 'always',
          },
          mutations: {
            // Retry configuration for mutations
            retry: (failureCount, error) => {
              // Don't retry on client errors
              if (error instanceof Error && error.message.includes('4')) {
                return false;
              }
              return failureCount < 2;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

// Hook to access query client
export function useQueryClientInstance() {
  const queryClient = React.useContext(QueryClientProvider as any);
  
  if (!queryClient) {
    throw new Error('useQueryClientInstance must be used within a QueryProvider');
  }
  
  return queryClient;
}