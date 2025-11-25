import type { Metadata } from "next";
import { Inter, Barlow } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import ConditionalRootNavbar from "@/components/layout/conditional-root-navbar";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { TopLoader } from "@/components/shared/top-loader";
import { LoadingProvider } from "@/contexts/loading-context";

const interFont = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
	preload: true,
});

const barlowFont = Barlow({
	variable: "--font-barlow",
	subsets: ["latin"],
	weight: ["500", "700"],
	display: "swap",
	preload: true,
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: "Adesso - La piattaforma di e-commerce italiana",
	description:
		"Benvenuto su Adesso, la piattaforma di e-commerce che ti permette di comprare online con facilità e comodità.",
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
	keywords: ["e-commerce", "shop online", "negozio online", "marketplace", "vendita online"],
	authors: [{ name: "Adesso" }],
	openGraph: {
		type: "website",
		locale: "it_IT",
		siteName: "Adesso",
		title: "Adesso - La piattaforma di e-commerce italiana",
		description:
			"Benvenuto su Adesso, la piattaforma di e-commerce che ti permette di comprare online con facilità e comodità.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Adesso - La piattaforma di e-commerce italiana",
		description:
			"Benvenuto su Adesso, la piattaforma di e-commerce che ti permette di comprare online con facilità e comodità.",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			afterSignOutUrl="/"

			appearance={{
				elements: {
					rootBox: "flex justify-center items-center",
				},
			}}>
			<html lang="it" className="dark" suppressHydrationWarning>
				<body
					className={`${interFont.variable} ${barlowFont.variable} antialiased`}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<LoadingProvider>
							<TopLoader />
							<div className="flex min-h-screen flex-col">
								<ConditionalRootNavbar />
								<main className="container mx-auto my-8 md:my-12 grow">
									{children}
								</main>
								<Footer />
								<Toaster position="bottom-right" />
							</div>
						</LoadingProvider>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
