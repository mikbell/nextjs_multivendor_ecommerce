"use client";

import { useQuery, useMutation, useQueryClient, QueryKey, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { ApiResponse } from '@/lib/api/types';
import { logger } from '@/lib/logger';

// Base API query hook
export interface UseApiQueryOptions<TData, TError = Error> extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  endpoint: string;
  params?: Record<string, any>;
  queryKey?: QueryKey;
}

export function useApiQuery<TData = any, TError = Error>({
  endpoint,
  params,
  queryKey,
  ...options
}: UseApiQueryOptions<TData, TError>) {
  const finalQueryKey = queryKey || [endpoint, params];
  
  return useQuery({
    queryKey: finalQueryKey,
    queryFn: async () => {
      const url = new URL(endpoint, window.location.origin);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Request failed');
      }

      const data: ApiResponse<TData> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Request failed');
      }

      return data.data;
    },
    ...options,
  });
}

// Base API mutation hook
export interface UseApiMutationOptions<TData, TVariables, TError = Error> extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  endpoint: string;
  method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  invalidateQueries?: QueryKey[];
}

export function useApiMutation<TData = any, TVariables = any, TError = Error>({
  endpoint,
  method = 'POST',
  invalidateQueries = [],
  ...options
}: UseApiMutationOptions<TData, TVariables, TError>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variables),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Request failed');
      }

      const data: ApiResponse<TData> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Request failed');
      }

      return data.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });

      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      logger.error('API mutation error:', { error, endpoint, method, variables });
      options.onError?.(error, variables, context);
    },
    ...options,
  });
}

// Paginated query hook
export interface UsePaginatedQueryOptions<TData, TError = Error> extends UseApiQueryOptions<TData, TError> {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function usePaginatedQuery<TData = any, TError = Error>({
  page = 1,
  limit = 10,
  sortBy,
  sortOrder,
  params = {},
  ...options
}: UsePaginatedQueryOptions<TData, TError>) {
  const paginationParams = {
    ...params,
    page,
    limit,
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  };

  return useApiQuery<TData, TError>({
    ...options,
    params: paginationParams,
    queryKey: [options.endpoint, paginationParams],
  });
}

// Infinite query hook for scroll pagination
export interface UseInfiniteQueryOptions<TData, TError = Error> extends Omit<UseApiQueryOptions<TData, TError>, 'params'> {
  params?: Record<string, any>;
  limit?: number;
}

export function useInfiniteApiQuery<TData = any, TError = Error>({
  limit = 10,
  params = {},
  ...options
}: UseInfiniteQueryOptions<TData, TError>) {
  return useQuery({
    queryKey: [options.endpoint, 'infinite', params, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const url = new URL(options.endpoint, window.location.origin);
      
      const queryParams = {
        ...params,
        page: pageParam,
        limit,
      };

      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });

      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Request failed');
      }

      const data: ApiResponse<TData> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Request failed');
      }

      return {
        data: data.data,
        pagination: data.pagination,
      };
    },
    ...options,
  });
}

// Optimistic update utilities
export function useOptimisticUpdate() {
  const queryClient = useQueryClient();

  const updateOptimistically = <TData>(
    queryKey: QueryKey,
    updater: (oldData: TData | undefined) => TData,
    rollbackData?: TData
  ) => {
    // Cancel any outgoing refetches
    queryClient.cancelQueries({ queryKey });

    // Snapshot the previous value
    const previousData = queryClient.getQueryData<TData>(queryKey);

    // Optimistically update to the new value
    queryClient.setQueryData(queryKey, updater);

    // Return rollback function
    return () => {
      queryClient.setQueryData(queryKey, rollbackData || previousData);
    };
  };

  return { updateOptimistically };
}

// Cache management utilities
export function useCacheManager() {
  const queryClient = useQueryClient();

  const prefetchQuery = async <TData>(
    endpoint: string,
    params?: Record<string, any>
  ) => {
    const queryKey = [endpoint, params];
    
    await queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        const url = new URL(endpoint, window.location.origin);
        
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              url.searchParams.append(key, String(value));
            }
          });
        }

        const response = await fetch(url.toString());
        const data: ApiResponse<TData> = await response.json();
        
        return data.success ? data.data : null;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const invalidateCache = (queryKey: QueryKey) => {
    queryClient.invalidateQueries({ queryKey });
  };

  const clearCache = () => {
    queryClient.clear();
  };

  const getCachedData = <TData>(queryKey: QueryKey): TData | undefined => {
    return queryClient.getQueryData<TData>(queryKey);
  };

  const setCachedData = <TData>(queryKey: QueryKey, data: TData) => {
    queryClient.setQueryData(queryKey, data);
  };

  return {
    prefetchQuery,
    invalidateCache,
    clearCache,
    getCachedData,
    setCachedData,
  };
}