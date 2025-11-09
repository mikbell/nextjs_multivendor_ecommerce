"use client";

import { FC, Suspense } from "react";
import { Form } from "@/components/ui/form";
import { ClientOnly } from "@/components/ui/client-only";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import {
	CategoryImage,
	CategoryBasicInfo,
	CategoryDescription,
	CategorySettings,
	FormActions,
	FormProgress,
	useCategoryForm,
	CategoryDetailsProps,
	CategoryFormErrorBoundary,
} from "./category-details/index";
import { CategoryWithUrl } from "./category-details/types";
import Heading from "@/components/shared/heading";
import { Button } from "@/components/ui/button";

// Loading fallback component
const FormLoadingFallback: FC = () => (
	<div className="min-h-screen bg-background flex items-center justify-center">
		<div className="text-center space-y-4">
			<div className="relative">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
				<Loader2 className="h-6 w-6 absolute inset-0 m-auto text-primary animate-pulse" />
			</div>
			<div>
				<h2 className="text-lg font-semibold text-foreground mb-2">
					Caricamento modulo categoria
				</h2>
				<p className="text-sm text-muted-foreground">
					Preparazione del form in corso...
				</p>
			</div>
		</div>
	</div>
);

// Form content component with error boundary
const CategoryFormContent: FC<{ data?: CategoryWithUrl }> = ({ data }) => {
	const { form, onSubmit, isLoading, isEditMode, formProgress } =
		useCategoryForm({ data });

	try {
		return (
			<div className="space-y-6 max-w-full overflow-hidden">
				{/* Progress Tracking */}
				<FormProgress formProgress={formProgress} isEditMode={isEditMode} />

				<Form {...form}>
					<div className="space-y-6 pb-32">
						{" "}
						{/* Changed from form to div to avoid Server Action issues */}
						{/* Form Sections - Each wrapped in Suspense for better loading */}
						<Suspense
							fallback={
								<div className="h-48 bg-muted/30 rounded-lg animate-pulse" />
							}>
							<CategoryImage form={form} isLoading={isLoading} />
						</Suspense>
						<Suspense
							fallback={
								<div className="h-64 bg-muted/30 rounded-lg animate-pulse" />
							}>
							<CategoryBasicInfo form={form} isLoading={isLoading} />
						</Suspense>
						<Suspense
							fallback={
								<div className="h-56 bg-muted/30 rounded-lg animate-pulse" />
							}>
							<CategoryDescription form={form} isLoading={isLoading} />
						</Suspense>
						<Suspense
							fallback={
								<div className="h-48 bg-muted/30 rounded-lg animate-pulse" />
							}>
							<CategorySettings form={form} isLoading={isLoading} />
						</Suspense>
						{/* Form Actions - Always visible */}
						<FormActions
							isLoading={isLoading}
							{...(data && { data })}
							onSubmit={onSubmit}
						/>
					</div>
				</Form>
			</div>
		);
	} catch (error) {
		console.error("CategoryFormContent error:", error);
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center space-y-4">
					<Heading>Errore di caricamento</Heading>

					<p className="text-muted-foreground">
						Si è verificato un errore durante il caricamento del modulo
						categoria.
					</p>
					<Button onClick={() => window.location.reload()}>
						Ricarica pagina
					</Button>
				</div>
			</div>
		);
	}
};

// Main component with error boundary
const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
	return (
		<CategoryFormErrorBoundary
			onError={(error, errorInfo) => {
				// Log error for monitoring
				console.error("Category form error:", { error, errorInfo, data });
				// You could send this to your error monitoring service here
			}}>
			<div className="min-h-screen bg-background category-form-container">
				<div className="w-full">
					<div className="container mx-auto max-w-7xl px-4 py-8">
						{/* Enhanced Header Section */}
						<header className="mb-8">
							<div className="flex items-center gap-4 mb-6">
								{/* Animated icon */}
								<div className="relative">
									<div className="absolute inset-0 bg-primary rounded-xl blur-lg opacity-20 animate-pulse"></div>
									<div className="relative p-3 bg-primary rounded-xl shadow-lg hover:shadow-xl transition-shadow">
										<ArrowRight className="h-7 w-7 text-primary-foreground" />
									</div>
								</div>

								{/* Title and description */}
								<div className="flex-1">
									<Heading>
										{data?.id ? (
											<>
												Modifica categoria
												{data.name && (
													<span className="block text-xl font-medium text-muted-foreground mt-1">
														{data.name}
													</span>
												)}
											</>
										) : (
											"Nuova categoria"
										)}
									</Heading>
									<p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
										{data?.id
											? "Aggiorna i dettagli della categoria esistente"
											: "Crea una nuova categoria per organizzare e presentare i tuoi prodotti"}
									</p>
								</div>

								{/* Success indicator */}
								<div className="hidden lg:block">
									<div className="animate-bounce">
										<CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
									</div>
								</div>
							</div>
						</header>

						{/* Form Container with Error Boundary and Loading States */}
						<main>
							<ClientOnly fallback={<FormLoadingFallback />}>
								<CategoryFormContent {...(data && { data })} />
							</ClientOnly>
						</main>
					</div>
				</div>
			</div>
		</CategoryFormErrorBoundary>
	);
};

export default CategoryDetails;
