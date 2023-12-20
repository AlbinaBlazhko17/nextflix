//@eslint-ignore
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},
};

module.exports = {
	...nextConfig,
	webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
		config.resolve.alias = {
			...config.resolve.alias,
			'@': path.resolve(__dirname),
			'@/components': path.resolve(__dirname, 'components'),
			'@/public': path.resolve(__dirname, 'public'),
		};
		return config;
	},
};
