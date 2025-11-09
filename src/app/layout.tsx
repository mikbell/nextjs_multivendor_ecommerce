import type { Metadata } from "next";
import { Inter, Barlow } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import ConditionalRootNavbar from "@/components/layout/conditional-root-navbar";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

const interFont = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const barlowFont = Barlow({
	variable: "--font-barlow",
	subsets: ["latin"],
	weight: ["500", "700"],
});

export const metadata: Metadata = {
	title: "GoShop",
	description:
		"Benvenuto su GoShop, la piattaforma di e-commerce che ti permette di comprare online con facilità e comodità.",
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
						<div className="flex min-h-screen flex-col">
							<ConditionalRootNavbar />
							<main className="container mx-auto my-8 md:my-12 grow">
								{children}
							</main>
							<Footer />
							<Toaster position="bottom-right" />
						</div>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
