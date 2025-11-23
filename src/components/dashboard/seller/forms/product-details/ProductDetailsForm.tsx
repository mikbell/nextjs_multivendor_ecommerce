"use client";

// React, Next.js
import { FC } from "react";

// UI Components
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/ui/client-only";
import { ArrowRight, CheckCircle } from "lucide-react";

// Custom hooks and types
import { useProductForm } from "./hooks/useProductForm";
import { ProductDetailsProps } from "./types";

// Components
import {
	FormProgress,
	ProductBasicInfo,
	ProductImages,
	DebugPanel,
	ProductTechnicalDetails,
	VariantDetails,
	ProductSpecs,
	ProductQuestions,
	ShippingSettings,
	ValidationErrors,
} from "./components";
import Heading from "@/components/shared/heading";

const ProductDetailsForm: FC<ProductDetailsProps> = ({
	data,
	categories,
	subcategories,
	storeUrl,
	countries,
}) => {
	// Use the custom hook for all form logic
	const {
		form,
		onSubmit,
		isLoading,
		isNewVariantPage,
		formProgress,
		subCategories,
		...hookData
	} = useProductForm({
		...(data && { data }),
		storeUrl,
		countries,
	});

	return (
		<div className="min-h-screen bg-background product-form-container">
			<div className="w-full">
				<div className="container mx-auto max-w-7xl px-4 py-8">
					{/* Modern Header Section */}
					<div className="mb-8">
						<div className="flex items-center gap-4 mb-6">
							<div className="relative">
								<div className="absolute inset-0 bg-primary rounded-xl blur-lg opacity-20 animate-pulse"></div>
								<div className="relative p-3 bg-primary rounded-xl shadow-lg">
									<ArrowRight className="h-7 w-7 text-primary-foreground" />
								</div>
							</div>
							<div>
								<Heading>
									{isNewVariantPage
										? "Nuova Variante Prodotto"
										: data?.productId
										? "Modifica Prodotto"
										: "Nuovo Prodotto"}
								</Heading>
								<p className="text-lg text-muted-foreground">
									{isNewVariantPage
										? `Crea una nuova variante per ${
												data?.name || "il prodotto"
										  }`
										: data?.productId
										? "Modifica i dettagli del tuo prodotto"
										: "Aggiungi un nuovo prodotto al tuo negozio"}
								</p>
							</div>
							{formProgress === 100 && (
								<div className="ml-auto">
									<div className="animate-bounce">
										<CheckCircle className="h-10 w-10 text-green-600" />
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Debug Panel - Only in development */}
					<DebugPanel
						form={form}
						isLoading={isLoading}
						isNewVariantPage={isNewVariantPage}
					/>

					{/* Form Container - Wrapped with ClientOnly to avoid SSR hydration issues */}
					<ClientOnly
						fallback={
							<div className="space-y-6 max-w-full overflow-hidden animate-pulse">
								<div className="h-96 bg-muted rounded-lg flex items-center justify-center">
									<div className="text-center">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
										<p className="text-muted-foreground">
											Caricamento form prodotto...
										</p>
									</div>
								</div>
							</div>
						}>
						<div className="space-y-6 max-w-full overflow-hidden">
							{/* Enhanced Progress Card */}
							<FormProgress
								formProgress={formProgress}
								isNewVariantPage={isNewVariantPage}
							/>

							<Form {...form}>
								<form onSubmit={onSubmit} className="space-y-6">
									{/* Product Basic Information */}
									<ProductBasicInfo
										form={form}
										isLoading={isLoading}
										isNewVariantPage={isNewVariantPage}
										data={data}
										categories={categories}
										subcategories={subcategories}
										subCategories={subCategories}
									/>

									{/* Product Images */}
									<ProductImages
										form={form}
										isLoading={isLoading}
										isNewVariantPage={isNewVariantPage}
									/>

									{/* Product Technical Details (SKU, Weight) */}
									<ProductTechnicalDetails
										form={form}
										isLoading={isLoading}
										isNewVariantPage={isNewVariantPage}
									/>

									{/* Variant Details (Colors, Sizes, Keywords, Variant Image) */}
									<VariantDetails
										form={form}
										isLoading={isLoading}
										isNewVariantPage={isNewVariantPage}
										colors={hookData.colors}
										setColors={hookData.setColors}
										sizes={hookData.sizes}
										setSizes={hookData.setSizes}
										keywords={hookData.keywords}
										setKeywords={hookData.setKeywords}
										handleAddition={hookData.handleAddition}
										handleDeleteKeyword={hookData.handleDeleteKeyword}
									/>

									{/* Product Specifications */}
									<ProductSpecs
										form={form}
										isLoading={isLoading}
										isNewVariantPage={isNewVariantPage}
										productSpecs={hookData.productSpecs}
										setProductSpecs={hookData.setProductSpecs}
										variantSpecs={hookData.variantSpecs}
										setVariantSpecs={hookData.setVariantSpecs}
										questions={hookData.questions}
										setQuestions={hookData.setQuestions}
									/>

									{/* Product Questions (FAQ) */}
									<ProductQuestions
										form={form}
										isLoading={isLoading}
										isNewVariantPage={isNewVariantPage}
										questions={hookData.questions}
										setQuestions={hookData.setQuestions}
									/>

									{/* Shipping Settings */}
									<ShippingSettings
										form={form}
										isLoading={isLoading}
										isNewVariantPage={isNewVariantPage}
										countries={countries}
										countryOptions={hookData.countryOptions}
										handleDeleteCountryFreeShipping={
											hookData.handleDeleteCountryFreeShipping
										}
									/>

									{/* Validation Errors Summary */}
									<ValidationErrors form={form} />

									{/* Submit Button */}
									<div className="sticky bottom-0 z-10 bg-background/90 backdrop-blur-sm border-t border-border p-6 mt-8">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-4">
												<div className="text-sm text-muted-foreground">
													Progresso:{" "}
													<span className="font-semibold">{formProgress}%</span>
												</div>
												{formProgress >= 100 && (
													<div className="flex items-center text-green-600 text-sm">
														<CheckCircle className="h-4 w-4 mr-1" />
														Pronto per la pubblicazione!
													</div>
												)}
											</div>
											<Button
												size="lg"
												type="submit"
												disabled={isLoading}
												className="font-semibold px-8">
												{isLoading ? (
													<div className="flex items-center">
														<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
														Salvando...
													</div>
												) : data?.productId && data?.variantId ? (
													"Aggiorna Prodotto"
												) : (
													"Crea Prodotto"
												)}
											</Button>
										</div>
									</div>
								</form>
							</Form>
						</div>
					</ClientOnly>
				</div>
			</div>
		</div>
	);
};

export default ProductDetailsForm;
