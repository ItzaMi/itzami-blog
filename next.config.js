/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/reading/library',
        destination: '/reading',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
