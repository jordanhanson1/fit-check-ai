/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow data URLs (base64) for uploaded image previews
    dangerouslyAllowSVG: false,
    remotePatterns: [],
  },
  // Ensure API routes handle large base64 payloads
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
