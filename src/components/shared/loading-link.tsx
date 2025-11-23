"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { startTransition, useTransition, type ComponentProps, useEffect, useRef } from 'react';
import { useLoading } from '@/contexts/loading-context';

type LoadingLinkProps = ComponentProps<typeof Link>;

/**
 * Link component personalizzato che traccia il caricamento effettivo della pagina
 * Usa React useTransition per monitorare quando la navigazione è completamente finita
 */
export function LoadingLink({ href, onClick, ...props }: LoadingLinkProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();
	const { startLoading, stopLoading } = useLoading();
	const loadingTimeoutRef = useRef<NodeJS.Timeout>();
	const navigationStartedRef = useRef(false);

	// Quando la transition è pending, assicurati che il loading sia attivo
	useEffect(() => {
		if (isPending && !navigationStartedRef.current) {
			startLoading();
			navigationStartedRef.current = true;
		} else if (!isPending && navigationStartedRef.current) {
			// Quando la transition finisce, aspetta un po' per dare tempo al rendering
			loadingTimeoutRef.current = setTimeout(() => {
				stopLoading();
				navigationStartedRef.current = false;
			}, 300);
		}

		return () => {
			if (loadingTimeoutRef.current) {
				clearTimeout(loadingTimeoutRef.current);
			}
		};
	}, [isPending, startLoading, stopLoading]);

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		// Se c'è un onClick personalizzato, chiamalo prima
		if (onClick) {
			onClick(e);
		}

		// Se preventDefault è stato chiamato, non fare nulla
		if (e.defaultPrevented) {
			return;
		}

		// Se è un link esterno o un download, usa il comportamento default
		const isExternal = href.toString().startsWith('http');
		const isDownload = props.download !== undefined;
		const isNewTab = props.target === '_blank';

		if (isExternal || isDownload || isNewTab) {
			return;
		}

		// Se stiamo già sulla stessa pagina, non fare nulla
		if (href.toString() === pathname) {
			return;
		}

		// Previeni il comportamento default di Next.js Link
		e.preventDefault();

		// Avvia il loading manualmente
		startLoading();
		navigationStartedRef.current = true;

		// Usa startTransition per tracciare il completamento
		startTransition(() => {
			router.push(href.toString());
		});
	};

	return <Link href={href} onClick={handleClick} {...props} />;
}
