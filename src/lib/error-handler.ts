import { toast } from "sonner";
import { ZodError } from "zod";
import { ApiClientError } from "./api-client";

export interface AppError extends Error {
	code?: string;
	statusCode?: number;
	field?: string;
}

export class ValidationError extends Error {
	public field: string;

	constructor(message: string, field: string) {
		super(message);
		this.name = "ValidationError";
		this.field = field;
	}
}

export class NetworkError extends Error {
	constructor(message: string = "Errore di connessione") {
		super(message);
		this.name = "NetworkError";
	}
}

export const handleError = (
	error: unknown,
	context?: string,
	showToast: boolean = true
): AppError => {
	console.error(`Error in ${context}:`, error);

	let processedError: AppError;

	if (error instanceof ApiClientError) {
		processedError = {
			name: "ApiError",
			message: error.message,
			code: error.code,
			statusCode: error.status,
		} as AppError;
	} else if (error instanceof ZodError) {
		const firstError = error.errors[0];
		processedError = new ValidationError(
			firstError.message,
			firstError.path.join(".")
		) as AppError;
	} else if (error instanceof TypeError && error.message.includes("fetch")) {
		processedError = new NetworkError() as AppError;
	} else if (error instanceof Error) {
		processedError = {
			name: error.name,
			message: error.message,
		} as AppError;
	} else {
		processedError = {
			name: "UnknownError",
			message: "Si è verificato un errore imprevisto",
		} as AppError;
	}

	if (showToast) {
		showErrorToast(processedError, context);
	}

	return processedError;
};

export const showErrorToast = (error: AppError, context?: string) => {
	const title = context
		? `Errore ${context}`
		: error.name === "ValidationError"
		? "Errore di validazione"
		: error.name === "NetworkError"
		? "Errore di connessione"
		: "Errore";

	toast.error(title, {
		description: error.message,
		duration: 5000,
	});
};

export const handleFormError = (
	error: unknown,
	context: string = "nel form"
): AppError => {
	return handleError(error, context, true);
};

export const handleApiError = (
	error: unknown,
	context: string = "API"
): AppError => {
	return handleError(error, context, true);
};

// Utility to safely extract error messages
export const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === "string") {
		return error;
	}
	return "Si è verificato un errore imprevisto";
};

// Success toast helper
export const showSuccessToast = (message: string, description?: string) => {
	toast.success(message, {
		description,
		duration: 4000,
	});
};