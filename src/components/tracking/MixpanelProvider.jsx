"use client";

import { useEffect } from "react";
import { initMixpanel } from "@/utilis/mixpanelClient";

export default function MixpanelProvider() {
  useEffect(() => {
    initMixpanel();
  }, []);

  return null;
}
