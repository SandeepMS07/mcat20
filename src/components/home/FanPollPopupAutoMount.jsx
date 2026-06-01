"use client";
import { useEffect, useRef, useState } from "react";
import FanPollPopup from "./FanPollPopup";
import { usePollsContext } from "@/components/polls/PollsProvider";
import { useAuth } from "@/components/auth/AuthContext";

const SHOW_DELAY_MS = 4000;

const votedKey = (userId) => `mca_fanpoll_last_voted_id_${userId ?? "guest"}`;

const getLastVotedPollId = (userId) => {
  try {
    const v = window.localStorage.getItem(votedKey(userId));
    return v ? parseInt(v, 10) : null;
  } catch {
    return null;
  }
};

const markPollVoted = (userId, pollId) => {
  try {
    window.localStorage.setItem(votedKey(userId), String(pollId));
  } catch {
    /* ignore */
  }
};

const FanPollPopupAutoMount = () => {
  const [open, setOpen] = useState(false);
  const { polls } = usePollsContext();
  const { user } = useAuth();
  const scheduledForId = useRef(null);

  useEffect(() => {
    if (!polls || polls.length === 0) return undefined;
    if (open) return undefined;

    const latestPoll = polls.reduce((max, p) => (p.id > max.id ? p : max), polls[0]);

    // Server says user already voted on this poll
    if (latestPoll.my_selection != null) return undefined;

    // Per-user check: hide until a newer poll is added by admin
    const lastVotedId = getLastVotedPollId(user?.id);
    if (lastVotedId != null && lastVotedId >= latestPoll.id) return undefined;

    // Already scheduled a timer for this exact poll id
    if (scheduledForId.current === latestPoll.id) return undefined;

    scheduledForId.current = latestPoll.id;
    const id = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    // No cleanup — let the timer fire even if polls re-renders
    return () => {};
  }, [polls, user?.id]);

  return (
    <FanPollPopup
      open={open}
      onClose={() => setOpen(false)}
      onVoted={(pollId) => markPollVoted(user?.id, pollId)}
    />
  );
};

export default FanPollPopupAutoMount;
