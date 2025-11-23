"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/contexts/loading-context';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configurazione NProgress
NProgress.configure({
	showSpinner: false,
	trickleSpeed: 200,
	minimum: 0.08,
	easing: 'ease',
	speed: 300,
});

export function TopLoader() {
	const { isLoading } = useLoading();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const timeoutRef = useRef<NodeJS.Timeout>();
	const isLoadingRef = useRef(false);

	// Track route changes (fallback per navigazioni non gestite da LoadingLink)
	useEffect(() => {
		// Se stiamo già tracciando via context, non fare nulla
		if (isLoading) return;

		// Altrimenti, avvia il loading per cambio route
		if (!isLoadingRef.current) {
			NProgress.start();
			isLoadingRef.current = true;

			// Completa dopo un delay
			timeoutRef.current = setTimeout(() => {
				NProgress.done();
				isLoadingRef.current = false;
			}, 500);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [pathname, searchParams, isLoading]);

	// Track context loading state
	useEffect(() => {
		if (isLoading) {
			// Avvia la barra di caricamento
			NProgress.start();
			isLoadingRef.current = true;
		} else if (isLoadingRef.current) {
			// Aspetta un po' prima di completare per animazione smooth
			timeoutRef.current = setTimeout(() => {
				NProgress.done();
				isLoadingRef.current = false;
			}, 300);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [isLoading]);

	return (
		<style jsx global>{`
			#nprogress {
				pointer-events: none;
			}

			#nprogress .bar {
				background: linear-gradient(
					90deg,
					hsl(var(--primary)) 0%,
					hsl(var(--primary) / 0.8) 50%,
					hsl(var(--primary)) 100%
				);
				position: fixed;
				z-index: 9999;
				top: 0;
				left: 0;
				width: 100%;
				height: 3px;
				box-shadow: 0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary));
			}

			#nprogress .peg {
				display: block;
				position: absolute;
				right: 0px;
				width: 100px;
				height: 100%;
				box-shadow: 0 0 15px hsl(var(--primary)), 0 0 8px hsl(var(--primary));
				opacity: 1;
				transform: rotate(3deg) translate(0px, -4px);
			}

			#nprogress .spinner {
				display: none;
			}
		`}</style>
	);
}
