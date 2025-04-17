/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  },
  // Fast Refresh 설정
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: ['**/.git/**', '**/node_modules/**', '**/.next/**']
    }
    return config
  },
  // 개발 서버 안정성 설정
  webpack: (config, { dev, isServer }) => {
    if (!isServer && dev) {
      // 클라이언트 사이드 개발 설정
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          name: false,
        },
      }

      // 파일 시스템 감시 설정
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/.git/**', '**/node_modules/**', '**/.next/**'],
      }
    }
    return config
  },
  // 개발 서버 표시기
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