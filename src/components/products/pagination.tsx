"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalCount: number;
}

export function Pagination({
	currentPage,
	totalPages,
	totalCount,
}: PaginationProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const goToPage = (page: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());
		router.push(`/products?${params.toString()}`);
	};

	if (totalPages <= 1) return null;

	const renderPageNumbers = () => {
		const pages = [];
		const maxPagesToShow = 5;
		let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
		let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

		if (endPage - startPage < maxPagesToShow - 1) {
			startPage = Math.max(1, endPage - maxPagesToShow + 1);
		}

		// First page
		if (startPage > 1) {
			pages.push(
				<Button
					key={1}
					variant="outline"
					size="sm"
					onClick={() => goToPage(1)}>
					1
				</Button>
			);
			if (startPage > 2) {
				pages.push(
					<span key="dots-start" className="px-2">
						...
					</span>
				);
			}
		}

		// Page numbers
		for (let i = startPage; i <= endPage; i++) {
			pages.push(
				<Button
					key={i}
					variant={i === currentPage ? "default" : "outline"}
					size="sm"
					onClick={() => goToPage(i)}>
					{i}
				</Button>
			);
		}

		// Last page
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				pages.push(
					<span key="dots-end" className="px-2">
						...
					</span>
				);
			}
			pages.push(
				<Button
					key={totalPages}
					variant="outline"
					size="sm"
					onClick={() => goToPage(totalPages)}>
					{totalPages}
				</Button>
			);
		}

		return pages;
	};

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
			<div className="text-sm text-muted-foreground">
				Pagina {currentPage} di {totalPages} ({totalCount} prodotti totali)
			</div>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}>
					<ChevronLeft className="h-4 w-4" />
					<span className="hidden sm:inline ml-2">Precedente</span>
				</Button>

				<div className="hidden md:flex items-center gap-1">
					{renderPageNumbers()}
				</div>

				<Button
					variant="outline"
					size="sm"
					onClick={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}>
					<span className="hidden sm:inline mr-2">Successiva</span>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
