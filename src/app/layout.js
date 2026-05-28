import "./globals.css";
import MixpanelProvider from "@/components/tracking/MixpanelProvider";
import ClientChrome from "@/components/layout/ClientChrome";
import AuthProvider from "@/components/auth/AuthProvider";
import { PollsProvider } from "@/components/polls/PollsProvider";
export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://t20mumbai.in"
  ),
  title: "T20 Mumbai League - Season 4 2026",
  description:
    "T20 Mumbai League is a T20 cricket league in Mumbai, India. It features local teams and players, promoting cricket in the region.",
  openGraph: {
    images: "/images/logo/dac-logo-2.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MixpanelProvider />
        <AuthProvider>
          <PollsProvider>
            <ClientChrome>{children}</ClientChrome>
          </PollsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
