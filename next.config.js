// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true,
    domains: ['raw.githubusercontent.com'
    ],
   },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        encoding: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
