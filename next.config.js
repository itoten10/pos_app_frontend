/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Azure App Service用設定
  images: {
    unoptimized: true
  },
}

module.exports = nextConfig
