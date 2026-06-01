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
