"use client";

import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = "e83859c679d152c00648d1ee7d2ec4e2";

const APP_VERSION =
  process.env.NEXT_PUBLIC_APP_VERSION ||
  process.env.npm_package_version ||
  "0.1.0";

const APP_ENVIRONMENT = "production";
// process.env.NEXT_PUBLIC_APP_ENV ||
// process.env.NODE_ENV ||
// "production";

let initialized = false;

export const initMixpanel = () => {
  if (typeof window === "undefined" || initialized || !MIXPANEL_TOKEN) return;

  mixpanel.init(MIXPANEL_TOKEN, {
    autocapture: false,
    track_pageview: false,
    persistence: "localStorage",
    debug: APP_ENVIRONMENT !== "production",
    ignore_dnt: false,
  });

  mixpanel.register({
    platform: "web",
    app_version: APP_VERSION,
    environment: APP_ENVIRONMENT,
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
  mixpanel.track("page_viewed", {
    path: pathname,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    referrer: typeof document !== "undefined" ? document.referrer : undefined,
    ...properties,
  });
};

export const registerSuperProperties = (properties = {}) => {
  if (!ready()) return;
  mixpanel.register(properties);
};

export const identifyUser = (userId, traits = {}, superProperties = {}) => {
  if (!ready() || userId === undefined || userId === null || userId === "") {
    return;
  }
  mixpanel.identify(String(userId));
  if (Object.keys(traits).length > 0) {
    mixpanel.people.set(traits);
  }
  if (Object.keys(superProperties).length > 0) {
    mixpanel.register(superProperties);
  }
};

export const resetMixpanel = () => {
  if (!ready()) return;
  mixpanel.reset();
};

export const optInTracking = () => {
  if (!ready()) return;
  mixpanel.opt_in_tracking();
};

export const optOutTracking = () => {
  if (!ready()) return;
  mixpanel.opt_out_tracking();
};

export default mixpanel;
