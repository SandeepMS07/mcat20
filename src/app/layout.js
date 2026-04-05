import "./globals.css";
import MixpanelProvider from "@/components/tracking/MixpanelProvider";
import ClientChrome from "@/components/layout/ClientChrome";
export const metadata = {
  title: "T20 Mumbai League - Season 4 2026",
  description:
    "T20 Mumbai League is a T20 cricket league in Mumbai, India. It features local teams and players, promoting cricket in the region.",
  openGraph: {
    images: "/images/logo/dac-logo-2.svg",
  },
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
        <ClientChrome>{children}</ClientChrome>
      </body>
    </html>
  );
}
