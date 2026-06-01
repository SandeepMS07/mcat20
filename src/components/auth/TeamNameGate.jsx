"use client";
import { useEffect, useState } from "react";
import { getMe } from "@/app/api/auth";
import { useAuth } from "./AuthContext";
import TeamNameModal from "./TeamNameModal";

// Mirrors fantasy-frontend/src/components/auth/TeamNameGate.jsx — a global
// gate that mounts the (non-dismissible) TeamNameModal whenever the
// signed-in user is missing team_name on the server. Covers two cases the
// in-LoginModal step doesn't:
//   1. Accounts created before the LoginModal collected a team name (the
//      previous code seeded teamName via verify-otp, which the backend
//      schema silently dropped, so team_name is NULL on those rows).
//   2. Sessions that were already authed when the user lands on the page —
//      AuthProvider.openLogin short-circuits, so the modal flow is skipped
//      entirely and the user would otherwise sneak past without a team name.

export default function TeamNameGate({ suppress = false }) {
  const { isAuthed, user, updateUser } = useAuth();
  const [needed, setNeeded] = useState(false);

  useEffect(() => {
    if (!isAuthed || suppress) {
      setNeeded(false);
      return undefined;
    }
    const cachedTn = user?.team_name ?? user?.teamName;
    if (cachedTn && String(cachedTn).trim()) {
      setNeeded(false);
      return undefined;
    }

    // Cached blob says no team_name. Confirm against the server — covers
    // legacy auth blobs that pre-date the team_name field and cases where
    // another tab already saved it.
    let cancelled = false;
    setNeeded(true);
    (async () => {
      try {
        const data = await getMe();
        if (cancelled) return;
        const serverTn = data?.team_name ?? data?.teamName;
        if (serverTn && String(serverTn).trim()) {
          updateUser?.({ ...user, teamName: serverTn, team_name: serverTn });
          setNeeded(false);
        }
      } catch {
        // Network / auth error — leave the gate up. If the token is
        // actually invalid, the axios refresh interceptor will clear auth
        // and isAuthed will flip false on the next render.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthed, user, updateUser]);

  return (
    <TeamNameModal
      open={needed}
      onSaved={(savedName) => {
        if (savedName) {
          updateUser?.({
            ...user,
            teamName: savedName,
            team_name: savedName,
          });
        }
        setNeeded(false);
      }}
    />
  );
}
