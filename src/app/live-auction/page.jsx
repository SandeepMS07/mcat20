"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LIVE_AUCTION_EMBED_URL = "https://mca-auction.ken42.com/live-auction";
const MCA_AUCTION_NAVIGATE_HOME = "MCA_AUCTION_NAVIGATE_HOME";

export default function LiveAuctionPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuctionMessage = (event) => {
      const message = event?.data;
      if (!message || message.type !== MCA_AUCTION_NAVIGATE_HOME) return;
      router.push("/");
    };

    window.addEventListener("message", handleAuctionMessage);
    return () => window.removeEventListener("message", handleAuctionMessage);
  }, [router]);

  return (
    <main className="w-full min-h-screen bg-black">
      <iframe
        src={LIVE_AUCTION_EMBED_URL}
        title="Live Auction"
        className="w-full h-screen border-0"
        allowFullScreen
      />
    </main>
  );
}
