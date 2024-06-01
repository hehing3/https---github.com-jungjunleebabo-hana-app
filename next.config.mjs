/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      /**
      {
        source: '/:path*',
        destination: 'http://localhost:8080/:path*',
      },
       */
      {
        source: '/login/:path*',
        destination: 'http://localhost:8080/login/:path*',
      },
      {
        source: '/cmm/:path*',
        destination: 'http://localhost:8080/cmm/:path*',
      },
      {
        source: '/frame/:path*',
        destination: 'http://localhost:8080/frame/:path*',
      },
      {
        source: '/admin/:path*',
        destination: 'http://localhost:8080/admin/:path*',
      },
    ];
  },
};

export default config;
