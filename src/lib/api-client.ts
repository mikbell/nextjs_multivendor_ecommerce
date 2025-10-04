export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface ApiError {
	message: string;
	status?: number;
	code?: string;
}

export class ApiClientError extends Error {
	public status?: number;
	public code?: string;

	constructor(message: string, status?: number, code?: string) {
		super(message);
		this.name = 'ApiClientError';
		this.status = status;
		this.code = code;
	}
}

export async function apiRequest<T = unknown>(
	url: string,
	options: RequestInit = {}
): Promise<T> {
	try {
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
			...options,
		});

		let responseData;
		try {
			responseData = await response.json();
		} catch {
			responseData = {};
		}

		if (!response.ok) {
			throw new ApiClientError(
				responseData?.error || responseData?.message || 'Errore del server',
				response.status,
				responseData?.code
			);
		}

		return responseData?.data || responseData;
	} catch (error) {
		if (error instanceof ApiClientError) {
			throw error;
		}

		throw new ApiClientError(
			error instanceof Error ? error.message : 'Errore di connessione'
		);
	}
}

export const apiClient = {
	get: <T>(url: string, options?: RequestInit) =>
		apiRequest<T>(url, { ...options, method: 'GET' }),

	post: <T>(url: string, data?: unknown, options?: RequestInit) =>
		apiRequest<T>(url, {
			...options,
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined,
		}),

	put: <T>(url: string, data?: unknown, options?: RequestInit) =>
		apiRequest<T>(url, {
			...options,
			method: 'PUT',
			body: data ? JSON.stringify(data) : undefined,
		}),

	patch: <T>(url: string, data?: unknown, options?: RequestInit) =>
		apiRequest<T>(url, {
			...options,
			method: 'PATCH',
			body: data ? JSON.stringify(data) : undefined,
		}),

	delete: <T>(url: string, options?: RequestInit) =>
		apiRequest<T>(url, { ...options, method: 'DELETE' }),
};