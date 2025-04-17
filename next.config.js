/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  },
  poweredByHeader: false,
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        followSymlinks: true,
        ignored: ['**/node_modules', '**/.next'],
        poll: 1000,
      };
    }

    return config;
  },
  // 개발 서버 설정
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  // 페이지 새로고침 설정
  onDemandEntries: {
    // 페이지를 메모리에 유지하는 시간
    maxInactiveAge: 1000 * 60 * 60,
    // 동시에 유지할 수 있는 페이지 수
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig; 