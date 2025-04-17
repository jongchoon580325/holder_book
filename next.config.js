/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  },
  webpack: (config, { dev, isServer }) => {
    // 개발 환경에서만 적용되는 설정
    if (dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all'
        }
      };
    }
    return config;
  }
};

module.exports = nextConfig; 