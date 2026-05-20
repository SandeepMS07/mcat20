"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initMixpanel, trackPageView } from "@/utilis/mixpanelClient";

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams?.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;
    trackPageView(fullPath);
  }, [pathname, searchParams]);

  return null;
}

export default function MixpanelProvider() {
  useEffect(() => {
    initMixpanel();
  }, []);

  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  );
}
