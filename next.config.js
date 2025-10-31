// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["raw.githubusercontent.com"],
  }
}

module.exports = nextConfig
