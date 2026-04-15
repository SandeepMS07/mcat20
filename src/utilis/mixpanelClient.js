export const initMixpanel = () => {
  if (typeof window === "undefined") return;

  import("mixpanel-browser")
    .then(({ default: mixpanel }) => {
      mixpanel.init("7efcdff383b20dd11013e3914fe0df66", {
        autocapture: true,
      });
    })
    .catch((error) => {
      console.error("Failed to load Mixpanel:", error);
    });
};
