"use client";

import { useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions {
	onLoadMore: () => void;
	hasMore: boolean;
	isLoading: boolean;
	threshold?: number;
}

export function useInfiniteScroll({
	onLoadMore,
	hasMore,
	isLoading,
	threshold = 0.8,
}: UseInfiniteScrollOptions) {
	const observerRef = useRef<IntersectionObserver | null>(null);
	const sentinelRef = useRef<HTMLDivElement | null>(null);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted || !sentinelRef.current || !hasMore || isLoading) {
			return;
		}

		const options: IntersectionObserverInit = {
			root: null,
			rootMargin: "200px",
			threshold,
		};

		observerRef.current = new IntersectionObserver((entries) => {
			const [entry] = entries;
			if (entry.isIntersecting && hasMore && !isLoading) {
				onLoadMore();
			}
		}, options);

		observerRef.current.observe(sentinelRef.current);

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [isMounted, hasMore, isLoading, onLoadMore, threshold]);

	return { sentinelRef };
}
