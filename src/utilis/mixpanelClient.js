"use client";

import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN =
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ||
  "7efcdff383b20dd11013e3914fe0df66";

let initialized = false;

export const initMixpanel = () => {
  if (typeof window === "undefined" || initialized || !MIXPANEL_TOKEN) return;

  mixpanel.init(MIXPANEL_TOKEN, {
    autocapture: true,
    track_pageview: false,
    persistence: "localStorage",
    debug: process.env.NODE_ENV !== "production",
  });

  initialized = true;
};

const ready = () => typeof window !== "undefined" && initialized;

export const trackEvent = (name, properties = {}) => {
  if (!ready()) return;
  mixpanel.track(name, properties);
};

export const trackPageView = (pathname, properties = {}) => {
  if (!ready() || !pathname) return;
  mixpanel.track("Page Viewed", {
    path: pathname,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    referrer: typeof document !== "undefined" ? document.referrer : undefined,
    ...properties,
  });
};

export const identifyUser = (userId, traits = {}) => {
  if (!ready() || !userId) return;
  mixpanel.identify(String(userId));
  if (Object.keys(traits).length > 0) {
    mixpanel.people.set(traits);
  }
};

export const resetMixpanel = () => {
  if (!ready()) return;
  mixpanel.reset();
};

export default mixpanel;
