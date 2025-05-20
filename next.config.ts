import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'm.media-amazon.com',
			},
			{
				protocol: 'https',
				hostname: 'via.placeholder.com',
			},
		],
	},
}

export default nextConfig
