/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        port: '',
      }
    ]
  },
  experimental: {
    serverMinification: false
  }
};

export default nextConfig;
