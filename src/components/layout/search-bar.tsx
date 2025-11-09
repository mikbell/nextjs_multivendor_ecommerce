"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
	const [search, setSearch] = useState("");
	const router = useRouter();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (search.trim()) {
			router.push(`/products?search=${encodeURIComponent(search.trim())}`);
			setSearch("");
		}
	};

	return (
		<form onSubmit={handleSearch} className="relative w-full max-w-md">
			<Input
				type="text"
				placeholder="Cerca prodotti..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="pr-10"
			/>
			<Button
				type="submit"
				size="icon"
				variant="ghost"
				className="absolute right-0 top-0 h-full">
				<Search className="h-4 w-4" />
			</Button>
		</form>
	);
}
