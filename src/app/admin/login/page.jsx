"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminLogin } from "@/app/api/admin-auth";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

function sanitizeReturnTo(raw) {
  if (!raw) return "/admin/polls";
  if (!raw.startsWith("/admin/")) return "/admin/polls";
  if (raw.startsWith("/admin/login")) return "/admin/polls";
  return raw;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = sanitizeReturnTo(searchParams.get("returnTo"));
  const { adminUser, refresh } = useAdminAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminUser) router.replace(returnTo);
  }, [adminUser, returnTo, router]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminLogin({ username: username.trim(), password });
      await refresh();
      router.replace(returnTo);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 429) setError("Too many attempts. Try again in a minute.");
      else if (status === 401) setError("Invalid username or password.");
      else setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-[#02061A] lg:grid-cols-[1fr,1.1fr]">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#050C2A] via-[#02103D] to-[#02061A] p-12 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#F2A23A]/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
        />
        <div className="relative flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#F2A23A] text-xl font-extrabold italic text-[#02103D]">
            M
          </span>
          <div className="leading-tight">
            <div className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/45">
              MCA
            </div>
            <div className="font-oswald text-xl font-extrabold italic uppercase text-white">
              Admin Panel
            </div>
          </div>
        </div>

        <div className="relative space-y-6 text-white">
          <h2 className="font-oswald text-5xl font-extrabold uppercase italic leading-[0.95]">
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "1.5px #ffffff" }}
            >
              Run
            </span>{" "}
            the<br />
            Fan Polls
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-white/65">
            Author predictions, schedule them around match-day, watch the votes
            stream in, and draw a winning fan for the post-match presentation.
          </p>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Dot /> Match-by-match poll authoring
            </li>
            <li className="flex items-center gap-2">
              <Dot /> Live vote dashboards
            </li>
            <li className="flex items-center gap-2">
              <Dot /> Random winner draw + TV reveal
            </li>
          </ul>
        </div>

        <div className="relative text-[10px] uppercase tracking-[0.3em] text-white/35">
          T20 Mumbai · Season 4
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-[#F2A23A] text-xl font-extrabold italic text-[#02103D]">
              M
            </span>
            <h1 className="mt-4 font-oswald text-2xl font-extrabold uppercase italic text-white">
              MCA Admin
            </h1>
          </div>

          <div className="mb-8">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F2A23A]">
              Welcome back
            </div>
            <h1 className="mt-1 font-oswald text-3xl font-extrabold uppercase italic text-white sm:text-4xl">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-white/55">
              Use the admin credentials provided by your league ops lead.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <label className="block">
              <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                Username
              </span>
              <div className="mt-1.5 flex items-center rounded-md border border-white/15 bg-white/[0.04] px-3 focus-within:border-[#F2A23A]">
                <svg
                  className="text-white/40"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none"
                  placeholder="mca@admin"
                />
              </div>
            </label>

            <label className="block">
              <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                Password
              </span>
              <div className="mt-1.5 flex items-center rounded-md border border-white/15 bg-white/[0.04] px-3 focus-within:border-[#F2A23A]">
                <svg
                  className="text-white/40"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-[10px] font-bold uppercase tracking-wide text-white/55 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {error ? (
              <div className="rounded-md border border-red-400/40 bg-red-400/10 px-3 py-2 text-xs font-medium text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#F2A23A] px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-[#02103D] transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#02103D]" />
                  Signing in
                </>
              ) : (
                "Sign in to admin"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] text-white/40">
            Forgot your password? Contact your league ops lead — admin
            credentials are managed centrally.
          </p>
        </div>
      </main>
    </div>
  );
}

function Dot() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#F2A23A]/15 text-[10px] text-[#F2A23A]">
      ✓
    </span>
  );
}
