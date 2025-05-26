import mixpanel from "mixpanel-browser";

export const initMixpanel = () => {
  mixpanel.init("7efcdff383b20dd11013e3914fe0df66", { autocapture: true });
};
