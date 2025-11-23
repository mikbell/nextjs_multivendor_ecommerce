import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
	// Enable experimental features
	experimental: {
		optimizePackageImports: [
			"@radix-ui/react-icons",
			"lucide-react",
			"@clerk/nextjs",
			"recharts",
			"@tremor/react",
		],
	},

	// Server external packages (moved from experimental)
	serverExternalPackages: ["@prisma/client"],

	// Compiler optimizations
	compiler: {
		removeConsole: isProd ? { exclude: ["error", "warn"] } : false,
	},

	// Image optimization
	images: {
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		formats: ["image/avif", "image/webp"],
		minimumCacheTTL: 60 * 60 * 24 * 60, // 60 days
		dangerouslyAllowSVG: true,
		contentDispositionType: "attachment",
		unoptimized: false,
		loader: "default",
		contentSecurityPolicy:
			"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://widget.cloudinary.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';",
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "widget.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "api.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "placehold.co",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
			},
			{
				protocol: "https",
				hostname: "img.clerk.com",
			},
			{
				protocol: "https",
				hostname: "images.clerk.dev",
			},
		],
	},

	// Bundle analyzer
	...(process.env.ANALYZE === "true" && {
		webpack: (config: any, { isServer }: { isServer: boolean }) => {
			if (!isServer) {
				config.resolve.fallback = {
					...config.resolve.fallback,
					fs: false,
					net: false,
					tls: false,
				};
			}

			// Bundle analyzer
			if (process.env.ANALYZE === "true") {
				try {
					// Dynamic import for webpack-bundle-analyzer
					// eslint-disable-next-line @typescript-eslint/no-require-imports
					const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
					config.plugins.push(
						new BundleAnalyzerPlugin({
							analyzerMode: "static",
							openAnalyzer: false,
							reportFilename: isServer
								? "../analyze/server.html"
								: "./analyze/client.html",
						})
					);
				} catch {
					console.warn(
						"webpack-bundle-analyzer not installed. Run: npm install --save-dev webpack-bundle-analyzer"
					);
				}
			}

			return config;
		},
	}),

	// Headers for security and performance
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
				],
			},
			{
				source: "/api/(.*)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, s-maxage=60, stale-while-revalidate=300",
					},
				],
			},
			{
				source: "/_next/static/(.*)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},

	// Redirects for SEO
	async redirects() {
		return [
			{
				source: "/home",
				destination: "/",
				permanent: true,
			},
		];
	},

	// Rewrites for clean URLs
	async rewrites() {
		return {
			beforeFiles: [
				{
					source: "/sitemap.xml",
					destination: "/api/sitemap",
				},
				{
					source: "/robots.txt",
					destination: "/api/robots",
				},
			],
			afterFiles: [],
			fallback: [],
		};
	},

	// Compress responses
	compress: true,

	// Output configuration
	output: "standalone",

	// Disable x-powered-by header
	poweredByHeader: false,

	// Generate ETags for pages
	generateEtags: true,

	// React strict mode
	reactStrictMode: true,

	// TypeScript configuration
	typescript: {
		ignoreBuildErrors: false,
	},
};

export default nextConfig;
