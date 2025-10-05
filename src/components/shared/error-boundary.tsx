"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	resetError = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				const FallbackComponent = this.props.fallback;
				return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
			}

			return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />;
		}

		return this.props.children;
	}
}

interface ErrorFallbackProps {
	error: Error;
	resetError: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
	return (
		<div className="flex items-center justify-center min-h-[400px] p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
						<AlertTriangle className="h-6 w-6 text-red-600" />
					</div>
					<CardTitle className="text-lg">Si è verificato un errore</CardTitle>
					<CardDescription>
						Qualcosa è andato storto. Prova a ricaricare la pagina o contatta l&apos;assistenza se il problema persiste.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{process.env.NODE_ENV === "development" && (
						<div className="rounded-md bg-gray-100 p-3">
							<p className="text-sm font-mono text-gray-800">{error.message}</p>
						</div>
					)}
					<Button onClick={resetError} className="w-full">
						<RefreshCw className="mr-2 h-4 w-4" />
						Riprova
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

const SimpleErrorFallback: React.FC<ErrorFallbackProps> = ({ resetError }) => {
	return (
		<div className="flex items-center justify-center p-4">
			<div className="text-center space-y-3">
				<AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
				<p className="text-sm text-muted-foreground">Errore nel caricamento</p>
				<Button variant="outline" size="sm" onClick={resetError}>
					Riprova
				</Button>
			</div>
		</div>
	);
};

export { ErrorBoundary, DefaultErrorFallback, SimpleErrorFallback };
export type { ErrorFallbackProps };