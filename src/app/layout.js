import Footer from "@/components/layout/footer/footer";
import "./globals.css";
import Navbar from "@/components/layout/navbar/navbar";
import MixpanelProvider from "@/components/tracking/MixpanelProvider";

export const metadata = {
  title: "T20 Mumbai League - Season 3 2025",
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
