/**
 * Next.js configuration
 * Adds security headers to allow embedding the app inside Miro.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		return [
			{
				// Apply to all routes
				source: '/:path*',
				headers: [
					// Allow being embedded by Miro (and keep it permissive otherwise)
					{
						key: 'Content-Security-Policy',
						value: "frame-ancestors 'self' https://miro.com https://*.miro.com;",
					},
					// Keep referrer minimal
					{ key: 'Referrer-Policy', value: 'no-referrer' },
				],
			},
		];
	},
};

module.exports = nextConfig;

