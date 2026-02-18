/** @type {import('next').NextConfig} */
const backendOrigin = process.env.BACKEND_ORIGIN || "http://127.0.0.1:8000";

const config = {
  /**
   * Dev-friendly proxying:
   * - Browser calls go to http://localhost:3000/api/v1/* (Next)
   * - Next rewrites them to the real backend http://127.0.0.1:8000/api/v1/*
   *
   * This avoids CORS issues and keeps the frontend code using relative URLs like "/api/v1".
   */
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
      },
      {
        source: "/file/:path*",
        destination: `${backendOrigin}/file/:path*`,
      },
    ];
  },
};

module.exports = config;
