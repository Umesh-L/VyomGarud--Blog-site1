import type { NextConfig } from "next";

const remotePatterns: NextConfig["images"] extends { remotePatterns: infer R } ? NonNullable<R> : never = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
  {
    protocol: "http",
    hostname: "localhost",
    port: "1337",
  },
];

if (process.env.NEXT_PUBLIC_STRAPI_URL) {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_STRAPI_URL);
    const pattern = {
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      port: url.port || undefined,
    } as typeof remotePatterns[number];
    if (!remotePatterns.some((entry) => entry.hostname === pattern.hostname && entry.port === pattern.port)) {
      remotePatterns.push(pattern);
    }
  } catch (error) {
    console.warn("Invalid NEXT_PUBLIC_STRAPI_URL for image remote pattern", error);
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
