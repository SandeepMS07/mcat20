"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { checkTeamName, updateMe } from "@/app/api/auth";

// Mirrors fantasy-frontend/src/components/common/TeamNameModal.jsx — a
// non-dismissible prompt that captures the user's permanent fantasy team
// name. Mounted by TeamNameGate whenever the signed-in user's team_name
// is still NULL on the server (legacy accounts created before the
// LoginModal collected this field, or accounts whose signup flow was
// interrupted between verify-otp and the team-name PATCH).

const TEAM_NAME_ALLOWED = /^[A-Z0-9 _]+$/;
const TEAM_NAME_MIN = 3;
const TEAM_NAME_MAX = 24;

export default function TeamNameModal({ open, onSaved }) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle"); // idle | checking | available | taken | error
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const trimmed = value.trim();
    if (trimmed.length < TEAM_NAME_MIN || trimmed.length > TEAM_NAME_MAX) {
      setStatus("idle");
      return undefined;
    }
    setStatus("checking");
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const data = await checkTeamName(trimmed);
        if (cancelled) return;
        setStatus(data?.available ? "available" : "taken");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [value, open]);

  const submit = async (e) => {
    e?.preventDefault?.();
    setError("");
    const trimmed = value.trim();
    if (trimmed.length < TEAM_NAME_MIN || trimmed.length > TEAM_NAME_MAX) {
      setError(`Team name must be ${TEAM_NAME_MIN}–${TEAM_NAME_MAX} characters.`);
      return;
    }
    if (!TEAM_NAME_ALLOWED.test(trimmed)) {
      setError("Use uppercase letters, numbers, spaces, and underscores only.");
      return;
    }
    if (status === "taken") {
      setError("That team name is taken — pick another.");
      return;
    }
    if (status === "checking") return;

    setSaving(true);
    try {
      const data = await updateMe({ teamName: trimmed });
      onSaved?.(data?.team_name ?? data?.teamName ?? trimmed);
    } catch (e2) {
      const code = e2?.response?.data?.error;
      if (code === "team_name_taken") {
        setStatus("taken");
        setError("That team name was just taken — pick another.");
      } else {
        setError(code || "Couldn't save. Try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || !open) return null;

  const disabled =
    saving ||
    status === "checking" ||
    status === "taken" ||
    value.trim().length < TEAM_NAME_MIN;

  const ringByStatus = {
    available: "border-emerald-400/70 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]",
    taken: "border-red-400/70 shadow-[0_0_0_4px_rgba(248,113,113,0.18)]",
    checking: "border-[#F2A23A]/60 shadow-[0_0_0_4px_rgba(242,162,58,0.16)]",
    error: "border-white/15",
    idle: "border-white/15",
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-name-modal-title"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-[#071b55] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_70%_at_0%_0%,rgba(242,162,58,0.20)_0%,transparent_55%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_70%_at_100%_100%,rgba(13,55,169,0.45)_0%,transparent_60%)]"
        />

        <div className="relative px-7 pt-8 pb-6 sm:px-10 sm:pt-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F2A23A]" />
            One last step
          </div>

          <h2
            id="team-name-modal-title"
            className="mt-4 text-3xl font-extrabold uppercase italic leading-[0.95] tracking-tight sm:text-4xl"
          >
            <span
              className="block text-transparent"
              style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.92)" }}
            >
              NAME YOUR
            </span>
            <span className="block text-white">FANTASY TEAM</span>
          </h2>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            This is how you&apos;ll appear on every match leaderboard. Pick
            something bold — once you lock it in, it&apos;s your permanent
            identity and can&apos;t be changed.
          </p>
        </div>

        <div
          aria-hidden
          className="mx-7 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent sm:mx-10"
        />

        <div className="px-7 pb-7 pt-6 sm:px-10">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="h-5 w-1.5 -skew-x-12 rounded-sm bg-[#F2A23A]" />
            <label className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/65">
              Team Name
            </label>
            <span className="ml-auto text-[10px] font-semibold tabular-nums text-white/45">
              {value.length}/{TEAM_NAME_MAX}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 rounded-2xl border bg-white/[0.05] py-2.5 pl-4 pr-3 transition ${ringByStatus[status]}`}
          >
            <input
              ref={inputRef}
              value={value}
              onChange={(e) =>
                setValue(
                  e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9 _]/g, "")
                    .slice(0, TEAM_NAME_MAX),
                )
              }
              placeholder="E.G. WANKHEDE WARRIORS"
              maxLength={TEAM_NAME_MAX}
              className="min-w-0 flex-1 bg-transparent text-base font-semibold uppercase tracking-wide text-white outline-none placeholder:font-normal placeholder:text-white/35"
            />
            {status === "checking" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
                Checking
              </span>
            )}
            {status === "available" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Available
              </span>
            )}
            {status === "taken" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-400/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300">
                Taken
              </span>
            )}
          </div>

          <p className="mt-2 text-[11px] leading-relaxed text-white/45">
            3–24 characters. Uppercase letters, numbers, spaces, and underscores only.
          </p>

          {error && (
            <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2.5 text-xs text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={disabled}
            className="group mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F2A23A] to-[#f2b15a] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.18em] text-[#02103D] shadow-[0_10px_30px_rgba(242,162,58,0.35)] transition hover:from-[#f2b15a] hover:to-[#F2A23A] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {saving ? "Saving…" : "Lock In & Continue"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
