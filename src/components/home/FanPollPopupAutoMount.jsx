"use client";
import { useEffect, useState } from "react";
import FanPollPopup, { hasFanPollPopupBeenDismissed } from "./FanPollPopup";

const SHOW_DELAY_MS = 4000;

const FanPollPopupAutoMount = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasFanPollPopupBeenDismissed()) return undefined;
    const id = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  return <FanPollPopup open={open} onClose={() => setOpen(false)} />;
};

export default FanPollPopupAutoMount;
