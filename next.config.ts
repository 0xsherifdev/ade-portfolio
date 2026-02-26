import type { NextConfig } from "next";

const directusHostname = process.env.DIRECTUS_URL
  ? new URL(process.env.DIRECTUS_URL).hostname
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      ...(directusHostname
        ? [{ hostname: directusHostname } as const]
        : []),
    ],
  },
};

export default nextConfig;
