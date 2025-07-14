import 'reflect-metadata'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  eslint: {
    ignoreDuringBuilds: true
  },
  // Disable development overlay in production
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    reactCompiler: false,
  },
  // Disable error overlay
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  webpack: (config, { isServer, dev }) => {
    // Only apply externals for client-side builds
    if (!isServer) {
      config.externals = {
        ...config.externals,
        'mysql2': 'commonjs mysql2',
        'typeorm': 'commonjs typeorm',
        'reflect-metadata': 'commonjs reflect-metadata',
        'class-transformer': 'commonjs class-transformer',
        'class-validator': 'commonjs class-validator',
      }
    }

    // Disable error overlay in production
    if (!dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-dev-utils/webpackHotDevClient': false,
        'react-dev-utils/errorOverlayMiddleware': false,
      }
    }

    // Ignore files that cause issues with TypeORM for both client and server
    config.resolve.alias = {
      ...config.resolve.alias,
      '@sap/hana-client': false,
      'hdb-pool': false,
      'react-native-sqlite-storage': false,
      'react-native-sqlite-2': false,
      'typeorm-aurora-data-api-driver': false,
    }

    // Add fallback for client-side builds only
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'fs': false,
        'path': false,
        'os': false,
        'crypto': false,
        'stream': false,
        'util': false,
        'url': false,
        'zlib': false,
        'http': false,
        'https': false,
        'net': false,
        'tls': false,
        'child_process': false,
        'dns': false,
        'cluster': false,
        'module': false,
        'worker_threads': false,
        'perf_hooks': false,
        'v8': false,
        'vm': false,
        'async_hooks': false,
        'timers': false,
        'console': false,
        'process': false,
        'buffer': false,
        'querystring': false,
        'string_decoder': false,
        'constants': false,
        'events': false,
        'assert': false,
        'readline': false,
        'repl': false,
        'domain': false,
        'dgram': false,
        'tty': false,
        'punycode': false
      }
    }

    // Suppress specific warnings
    config.ignoreWarnings = [
      /Module not found: Can't resolve 'react-native-sqlite-storage'/,
      /Module not found: Can't resolve '@sap\/hana-client\/extension\/Stream'/,
      /Module not found: Can't resolve 'mysql'/,
      /Critical dependency: the request of a dependency is an expression/,
    ]

    return config
  }
}

export default nextConfig
