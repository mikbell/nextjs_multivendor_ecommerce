import type { Metadata } from "next";
import { Inter, Barlow } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { ConditionalRootHeader } from "@/components/shared/conditional-root-header";

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
		<ClerkProvider afterSignOutUrl="/">
			<html lang="it" className="dark scroll-smooth" suppressHydrationWarning>
				<body
					className={`${interFont.variable} ${barlowFont.variable} antialiased`}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<ConditionalRootHeader />
						{children}
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
