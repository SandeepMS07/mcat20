/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    formats: ["image/webp"],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=3600",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/footer/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // /go/* is an escape hatch path NOT claimed by the iOS/Android app
      // (see public/.well-known/apple-app-site-association). Use this in
      // marketing/ticker links so a tap from WhatsApp/Mail/Instagram doesn't
      // open the app — the user lands in their browser, which then follows
      // this 302 to the real page. The redirect is the OS's get-out-of-jail
      // card: Universal Links are only checked on the initial tap, not on a
      // server-side redirect.
      {
        source: "/go/cl",
        destination: "/creatorsleague",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
