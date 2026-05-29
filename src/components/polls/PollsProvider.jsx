"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { listPolls } from "@/app/api/polls";
import { useAuth } from "@/components/auth/AuthContext";

const PollsContext = createContext(null);

export const usePollsContext = () => {
  const ctx = useContext(PollsContext);
  if (!ctx) throw new Error("usePollsContext must be used inside PollsProvider");
  return ctx;
};

export const PollsProvider = ({ children }) => {
  const [polls, setPolls] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const { isAuthed } = useAuth();
  const isFirstMount = useRef(true);

  const fetchPolls = useCallback((reset = false) => {
    setLoadError(false);
    if (reset) setPolls(null);
    listPolls()
      .then((data) => setPolls(Array.isArray(data) ? data : []))
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    fetchPolls(isFirstMount.current);
    isFirstMount.current = false;
  }, [fetchPolls, isAuthed]);

  useEffect(() => {
    let id = null;

    const start = () => {
      if (id) return;
      id = setInterval(() => fetchPolls(false), 30000);
    };

    const stop = () => {
      clearInterval(id);
      id = null;
    };

    const onVisibility = () =>
      document.visibilityState === "visible" ? start() : stop();

    // Only poll while tab is visible
    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchPolls]);

  const updatePoll = useCallback((updated) => {
    setPolls((curr) =>
      curr ? curr.map((p) => (p.id === updated.id ? updated : p)) : curr
    );
  }, []);

  return (
    <PollsContext.Provider value={{ polls, loadError, refetch: fetchPolls, updatePoll }}>
      {children}
    </PollsContext.Provider>
  );
};
