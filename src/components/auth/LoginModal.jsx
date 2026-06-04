"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import {
  sendOtp,
  verifyOtp,
  updateMe,
  mobileExists,
  checkTeamName,
} from "@/app/api/auth";
import { setAccessToken } from "@/app/api/turboverseAxios";
import routes from "@/utilis/route";

const MOBILE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Mirrors the fantasy frontend's TeamNameModal: 3–24 chars, uppercase letters,
// numbers, spaces, and underscores. Server still re-validates on PATCH /me.
const TEAM_NAME_ALLOWED = /^[A-Z0-9 _]+$/;
const TEAM_NAME_MIN = 3;
const TEAM_NAME_MAX = 24;

const STEP_DETAILS = "details";
const STEP_OTP = "otp";
// Only entered on first-time signup (the backend's verify-otp creates the user
// row with team_name = NULL, and the fantasy frontend blocks the app behind a
// "Name Your Fantasy Team" gate until it's set). We collect it here so the
// user never sees that gate.
const STEP_TEAM = "team";

const MODE_SIGNUP = "signup";
const MODE_SIGNIN = "signin";

const VARIANTS = {
  fanPoll: {
    badge: "TODAYS FANPOLL",
    titleLines: ["Win A Chance To Join The", "Post-Match Ceremony"],
    subtitle:
      "Signup and you could be on the field at the\npost-match Presentation party",
    perkImages: [
      "/images/login/perk-trophy.png",
      "/images/login/perk-meet-players.png",
    ],
    layout: "fanPoll",
  },
  viewersChoice: {
    badge: "VIEWERS CHOICE",
    titleLines: ["Win A Chance", "To Get The", "Signed Jersey"],
    heroImage: "/images/login/signed-jersey.png",
    layout: "jersey",
  },
  fantasy: {
    badge: "PLAY FANTASY",
    titleLines: ["Build Your", "Dream XI"],
    subtitle: "Pick your squad. Compete with friends. Win the trophy.",
    layout: "centered",
  },
};

function Toast({ message, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 3500);
    return () => clearTimeout(id);
  }, [onDone]);
  return (
    <>
      <style>{`@keyframes toastSlideUp{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
      <div
        role="alert"
        className="fixed bottom-6 left-1/2 z-[99999] -translate-x-1/2 rounded-xl border border-red-400/30 bg-[#1a0a0a] px-5 py-3 text-sm font-semibold text-red-300 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        style={{ whiteSpace: "nowrap", animation: "toastSlideUp 0.25s ease" }}
      >
        {message}
      </div>
    </>
  );
}

const makeInitialState = (mode = MODE_SIGNIN) => ({
  step: STEP_DETAILS,
  mode,
  name: "",
  email: "",
  mobile: "",
  otp: "",
  teamName: "",
  teamStatus: "idle",
  pendingAuth: null,
  loading: false,
  error: null,
  hint: null,
  resendIn: 0,
});

const RESEND_COOLDOWN_S = 30;

const LoginModal = ({ open, onClose, onSuccess, variant = "fanPoll", initialMode = MODE_SIGNIN }) => {
  const [state, setState] = useState(() => makeInitialState(initialMode));
  const [toast, setToast] = useState(null);
  const nameRef = useRef(null);
  const otpRef = useRef(null);
  const teamRef = useRef(null);

  const showToast = useCallback((msg) => setToast(msg), []);

  const config = VARIANTS[variant] || VARIANTS.fanPoll;
  const isJersey = config.layout === "jersey";
  const isFanPoll = config.layout === "fanPoll";

  useEffect(() => {
    if (!open) {
      setState(makeInitialState(initialMode));
      return undefined;
    }
    setState(makeInitialState(initialMode));
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, initialMode]);

  useEffect(() => {
    if (state.step !== STEP_OTP || state.resendIn <= 0) return undefined;
    const id = setInterval(() => {
      setState((s) => (s.resendIn > 0 ? { ...s, resendIn: s.resendIn - 1 } : s));
    }, 1000);
    return () => clearInterval(id);
  }, [state.step, state.resendIn]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      if (state.step === STEP_DETAILS) nameRef.current?.focus();
      else if (state.step === STEP_OTP) otpRef.current?.focus();
      else if (state.step === STEP_TEAM) teamRef.current?.focus();
    }, 60);
    return () => clearTimeout(t);
  }, [open, state.step]);

  // Debounced team-name availability check, only active on the team step.
  // Mirrors fantasy-frontend/TeamNameModal.jsx so the user sees the same
  // available/taken pill while typing.
  useEffect(() => {
    if (!open || state.step !== STEP_TEAM) return undefined;
    const trimmed = state.teamName.trim();
    if (trimmed.length < TEAM_NAME_MIN || trimmed.length > TEAM_NAME_MAX) {
      if (state.teamStatus !== "idle") update({ teamStatus: "idle" });
      return undefined;
    }
    let cancelled = false;
    update({ teamStatus: "checking" });
    const t = setTimeout(async () => {
      try {
        const data = await checkTeamName(trimmed);
        if (cancelled) return;
        update({ teamStatus: data?.available ? "available" : "taken" });
      } catch {
        if (!cancelled) update({ teamStatus: "error" });
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, state.step, state.teamName]);

  if (!open) return null;

  const update = (patch) => setState((s) => ({ ...s, ...patch }));

  const isSignIn = state.mode === MODE_SIGNIN;
  const detailsValid = isSignIn
    ? MOBILE_REGEX.test(state.mobile)
    : state.name.trim().length > 1 &&
      EMAIL_REGEX.test(state.email.trim()) &&
      MOBILE_REGEX.test(state.mobile);

  const switchMode = (mode) => {
    update({ mode, error: null, hint: null });
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (state.loading) return;
    if (!isSignIn && !state.name.trim()) {
      showToast("Please enter your full name.");
      return;
    }
    if (!isSignIn && !EMAIL_REGEX.test(state.email.trim())) {
      showToast("Please enter a valid email address.");
      return;
    }
    if (!MOBILE_REGEX.test(state.mobile)) {
      showToast("Enter a valid 10-digit mobile number.");
      return;
    }
    update({ loading: true, error: null, hint: null });

    // Mirror the fantasy-frontend pattern: precheck mobile-exists before
    // sending an OTP, so we don't burn an SMS on a number that's in the
    // wrong mode. Sign-in without an account → flip to sign-up. Sign-up
    // on an already-registered mobile → flip to sign-in. If the precheck
    // itself fails (network / rate-limit), fall through to send-otp so
    // the user isn't left at a dead end — the backend still enforces the
    // real rules at verify time.
    const mobile = state.mobile.trim();
    try {
      const existsResp = await mobileExists(mobile);
      const exists = !!existsResp?.exists;
      if (isSignIn && !exists) {
        update({ loading: false, mode: MODE_SIGNUP, hint: null });
        showToast("No account found for this number. Please sign up.");
        return;
      }
      if (!isSignIn && exists) {
        update({ loading: false, mode: MODE_SIGNIN, name: "", email: "", hint: null });
        showToast("An account already exists for this mobile. Please sign in.");
        return;
      }
    } catch {
      /* precheck unreachable — fall through */
    }

    try {
      const data = await sendOtp(mobile);
      update({
        loading: false,
        step: STEP_OTP,
        resendIn: RESEND_COOLDOWN_S,
        hint:
          data?.debugOtp != null
            ? `Dev OTP: ${data.debugOtp}`
            : "We just sent you a one-time code.",
      });
    } catch (err) {
      const status = err?.response?.status;
      const code = err?.response?.data?.error;
      let msg = "Couldn't send OTP. Please try again.";
      if (status === 429 || code === "rate_limited")
        msg = "Too many attempts. Try again in 10 minutes.";
      else if (code === "send_failed") msg = "Couldn't send OTP, retry.";
      update({ loading: false });
      showToast(msg);
    }
  };

  const handleResendOtp = async () => {
    if (state.loading || state.resendIn > 0) return;
    const mobile = state.mobile.trim();
    if (!MOBILE_REGEX.test(mobile)) return;
    update({ loading: true, otp: "", error: null });
    try {
      const data = await sendOtp(mobile);
      update({
        loading: false,
        resendIn: RESEND_COOLDOWN_S,
        hint:
          data?.debugOtp != null
            ? `Dev OTP: ${data.debugOtp}`
            : "New OTP sent.",
      });
    } catch (err) {
      const status = err?.response?.status;
      const code = err?.response?.data?.error;
      let msg = "Couldn't resend OTP. Please try again.";
      if (status === 429 || code === "rate_limited")
        msg = "Too many attempts. Try again in 10 minutes.";
      update({ loading: false });
      showToast(msg);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (state.loading) return;
    if (!state.otp.trim()) {
      showToast("Enter the OTP you received.");
      return;
    }
    update({ loading: true, error: null });
    try {
      // Sign-in mode = returning user. Don't send name so we don't accidentally
      // overwrite their existing profile. Sign-up mode = new account, so name
      // is sent for the INSERT. teamName is NOT sent — verify-otp ignores it
      // anyway; we collect it in the next step and save via PATCH /me, which
      // matches the fantasy-frontend signup flow.
      const verifyArgs = {
        mobile: state.mobile.trim(),
        otp: state.otp.trim(),
      };
      if (!isSignIn) {
        verifyArgs.name = state.name.trim();
        verifyArgs.email = state.email.trim();
      }
      const data = await verifyOtp(verifyArgs);

      // verify-otp returns the user row including team_name. The "needs team
      // name" decision is on the SERVER state, not on the form mode — an
      // existing user who signed up before this step existed has
      // team_name = NULL and must be routed to STEP_TEAM on sign-in too,
      // otherwise the fantasy app shows its own "Name Your Fantasy Team"
      // gate after the SSO handoff.
      const teamName =
        data?.user?.teamName ?? data?.user?.team_name ?? null;
      // Only block on missing team name for the fantasy portal — fan poll and
      // viewers choice don't use the fantasy leaderboard so they don't need it.
      const needsTeamName = !teamName && variant === "fantasy";

      // Seed the access token so PATCH /me (team name step) authenticates.
      setAccessToken(data.token);

      if (!needsTeamName) {
        update({ loading: false });
        onSuccess?.({ token: data.token, user: data.user });
        return;
      }

      update({
        loading: false,
        step: STEP_TEAM,
        pendingAuth: { token: data.token, user: data.user },
        error: null,
        hint: null,
      });
      return;
    } catch (err) {
      const status = err?.response?.status;
      const code = err?.response?.data?.error;
      const attemptsRemaining = err?.response?.data?.attemptsRemaining ?? null;
      let msg = "Could not verify OTP. Please try again.";
      if (status === 401 && code === "invalid_otp") {
        msg =
          attemptsRemaining != null
            ? `Invalid OTP. ${attemptsRemaining} attempt${
                attemptsRemaining === 1 ? "" : "s"
              } left.`
            : "Invalid OTP. Please try again.";
      } else if (status === 401 && code === "no_otp") {
        msg = "OTP expired. Please request a new one.";
      } else if (status === 423 || code === "otp_locked") {
        msg = "Too many wrong attempts. Try again in 15 minutes.";
      } else if (status === 400 && code === "name_required") {
        // Returning user flow tried to log in on a mobile that has no account
        // yet — flip them to sign-up so they can register.
        if (isSignIn) {
          update({ loading: false, step: STEP_DETAILS, mode: MODE_SIGNUP, otp: "", hint: null });
          showToast("No account found for this number. Please sign up.");
          return;
        }
        msg = "Please go back and enter your name.";
      }
      update({ loading: false, error: msg });
    }
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    if (state.loading) return;
    const trimmed = state.teamName.trim();
    if (trimmed.length < TEAM_NAME_MIN || trimmed.length > TEAM_NAME_MAX) {
      showToast(`Team name must be ${TEAM_NAME_MIN}–${TEAM_NAME_MAX} characters.`);
      return;
    }
    if (!TEAM_NAME_ALLOWED.test(trimmed)) {
      showToast("Use uppercase letters, numbers, spaces, and underscores only.");
      return;
    }
    if (state.teamStatus === "taken") {
      showToast("That team name is taken — pick another.");
      return;
    }
    if (state.teamStatus === "checking") return;

    update({ loading: true, error: null });
    try {
      // Access token was already seeded after verify-otp, so this PATCH
      // carries Authorization correctly.
      await updateMe({ teamName: trimmed });
      const auth = state.pendingAuth;
      update({ loading: false });
      // Hand the fully-formed user (with team name set) to AuthProvider.
      // We don't have the freshly-patched user object on hand, but the
      // fantasy app re-fetches /v1/me on mount, so passing the verify-otp
      // payload is fine.
      onSuccess?.(auth);
    } catch (err) {
      const code = err?.response?.data?.error;
      let msg = "Couldn't save team name. Please try again.";
      if (code === "team_name_taken") {
        update({ teamStatus: "taken" });
        msg = "That team name was just taken — pick another.";
      }
      update({ loading: false });
      showToast(msg);
    }
  };

  const titleLast = config.titleLines[config.titleLines.length - 1];
  const titleHead = config.titleLines.slice(0, -1);

  // Discreet mode-switch link rendered below the submit button. Default flow
  // is sign-in (mobile only); the link surfaces sign-up for new fans.
  const modeSwitch = (
    <p className="text-center text-xs text-[#C6C5D1]">
      {isSignIn ? "New user?" : "Already have an account?"}{" "}
      <button
        type="button"
        onClick={() => switchMode(isSignIn ? MODE_SIGNUP : MODE_SIGNIN)}
        className="font-bold text-[#F9A607] underline-offset-2 hover:underline"
      >
        {isSignIn ? "Sign up" : "Sign in"}
      </button>
    </p>
  );

  // Shared form fields. In sign-in mode we only ask for the mobile number;
  // sign-up keeps the full name + required email + mobile.
  const formFields = (
    <>
      {!isSignIn ? (
        <>
          <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.05] px-5 py-[15px] focus-within:border-[#F2A23A]">
            <FiUser className="h-4 w-4 shrink-0 text-[#C6C5D1]" aria-hidden />
            <input
              ref={nameRef}
              type="text"
              autoComplete="name"
              maxLength={60}
              value={state.name}
              onChange={(e) => update({ name: e.target.value, error: null })}
              placeholder="Full Name"
              className="w-full bg-transparent text-base text-white placeholder:text-[#C6C5D1] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.05] px-5 py-[15px] focus-within:border-[#F2A23A]">
            <FiMail className="h-4 w-4 shrink-0 text-[#C6C5D1]" aria-hidden />
            <input
              type="email"
              autoComplete="email"
              required
              maxLength={100}
              value={state.email}
              onChange={(e) => update({ email: e.target.value, error: null })}
              placeholder="Email Address"
              className="w-full bg-transparent text-base text-white placeholder:text-[#C6C5D1] focus:outline-none"
            />
          </div>
        </>
      ) : null}

      <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.05] px-5 py-[15px] focus-within:border-[#F2A23A]">
        <FiPhone className="h-4 w-4 shrink-0 text-[#C6C5D1]" aria-hidden />
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          value={state.mobile}
          onChange={(e) =>
            update({
              mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
              error: null,
            })
          }
          placeholder="Mobile Number"
          className="w-full bg-transparent text-base tracking-wider text-white placeholder:text-[#C6C5D1] placeholder:tracking-normal focus:outline-none"
        />
      </div>
    </>
  );

  const submitButton = (
    <div className="relative pt-2">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 inset-y-3 rounded-full bg-[#FF7A18]/15 blur-md"
      />
      <button
        type="submit"
        disabled={state.loading || !detailsValid}
        className="relative flex w-full cursor-pointer items-center justify-center rounded-full bg-[#FF7A18] py-4 text-[18px] font-extrabold uppercase tracking-[1px] text-white shadow-[0_0_7.5px_rgba(255,122,24,0.3)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.loading
          ? "Sending OTP..."
          : isSignIn
          ? "Send OTP"
          : "Verify & Proceed"}
      </button>
    </div>
  );

  // Shared team-name step. Identical across all three layouts so the user
  // gets the same UX whether they opened the modal from the fan poll, the
  // jersey, or the centered fantasy variant.
  const teamStep = (
    <form onSubmit={handleTeamSubmit} className="space-y-4">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/65">
          One last step
        </p>
        <h3 className="mt-2 text-xl font-extrabold italic text-white sm:text-2xl">
          Name Your{" "}
          <span className="text-[#F9A607]">Fantasy Team</span>
        </h3>
        <p className="mx-auto mt-2 max-w-[340px] text-xs leading-relaxed text-white/65">
          This is how you'll appear on every leaderboard. Once locked in it
          can't be changed.
        </p>
      </div>

      <div
        className={`flex items-center gap-2 rounded-full border bg-white/[0.05] pl-5 pr-3 py-[12px] transition ${
          state.teamStatus === "available"
            ? "border-emerald-400/60"
            : state.teamStatus === "taken"
            ? "border-red-400/60"
            : state.teamStatus === "checking"
            ? "border-[#F2A23A]/60"
            : "border-white/20 focus-within:border-[#F2A23A]"
        }`}
      >
        <input
          ref={teamRef}
          type="text"
          value={state.teamName}
          maxLength={TEAM_NAME_MAX}
          onChange={(e) =>
            update({
              teamName: e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9 _]/g, "")
                .slice(0, TEAM_NAME_MAX),
              error: null,
            })
          }
          placeholder="E.G. WANKHEDE WARRIORS"
          className="w-full bg-transparent text-base font-semibold uppercase tracking-wide text-white placeholder:font-normal placeholder:text-[#C6C5D1] focus:outline-none"
        />
        {state.teamStatus === "checking" && (
          <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
            Checking
          </span>
        )}
        {state.teamStatus === "available" && (
          <span className="shrink-0 rounded-full bg-emerald-400/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            Available
          </span>
        )}
        {state.teamStatus === "taken" && (
          <span className="shrink-0 rounded-full bg-red-400/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300">
            Taken
          </span>
        )}
      </div>
      <p className="text-[11px] text-white/45">
        {state.teamName.length}/{TEAM_NAME_MAX} · Uppercase letters, numbers,
        spaces, and underscores only.
      </p>

      <div className="relative pt-2">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 inset-y-3 rounded-full bg-[#FF7A18]/15 blur-md"
        />
        <button
          type="submit"
          disabled={
            state.loading ||
            state.teamStatus === "checking" ||
            state.teamStatus === "taken" ||
            state.teamName.trim().length < TEAM_NAME_MIN
          }
          className="relative flex w-full cursor-pointer items-center justify-center rounded-full bg-[#FF7A18] py-4 text-[18px] font-extrabold uppercase tracking-[1px] text-white shadow-[0_0_7.5px_rgba(255,122,24,0.3)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.loading ? "Saving…" : "Lock In & Continue"}
        </button>
      </div>
    </form>
  );

  const termsFooter = (
    <p className="text-center text-xs text-[#C6C5D1]">
      By joining, you agree to the{" "}
      <Link
        href={routes.privacyPolicy}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className="font-medium text-[#B5C4FF] underline-offset-2 hover:underline"
      >
        Privacy Policy
      </Link>
    </p>
  );

  const closeButton = (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="absolute right-4 top-4 z-20 cursor-pointer rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );

  if (isJersey) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[560px] overflow-hidden rounded-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Viewers Choice sign in"
          style={{
            backgroundImage:
              "linear-gradient(205deg, rgba(14, 0, 90, 0.4) 28%, rgba(28, 57, 142, 0.4) 85%), linear-gradient(90deg, #192A66 0%, #192A66 100%)",
          }}
        >
          {/* Diagonal accent square top-right */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[54px] -top-[55px] flex h-[152px] w-[152px] items-center justify-center"
          >
            <div className="h-32 w-32 rotate-12 bg-[rgba(23,63,159,0.3)]" />
          </div>

          {closeButton}

          {state.step === STEP_DETAILS && (
            <div className="relative px-8 pb-8 pt-8 sm:px-10 sm:pb-10 sm:pt-10">
              {/* Header row: badge + title on the left, jersey image overflowing right */}
              <div className="relative">
                <div className="max-w-[310px] space-y-4">
                  <span className="inline-flex items-center justify-center rounded-full border border-white bg-[#091D65] px-4 py-1.5 text-[13px] font-medium italic text-white">
                    {config.badge}
                  </span>
                  <h2 className="text-[32px] font-extrabold italic capitalize leading-[42px] text-[#E1E3E4] sm:text-[36px] sm:leading-[46px]">
                    {titleHead.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                    <span className="block text-[#F9A607]">{titleLast}</span>
                  </h2>
                </div>

                {/* Jersey hero — absolutely positioned, overflowing right edge */}
                <img
                  src={config.heroImage}
                  alt=""
                  className="pointer-events-none absolute -right-2 top-2 h-[210px] w-auto select-none drop-shadow-[18px_46px_47px_rgba(11,12,15,0.6)] sm:h-[230px]"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Divider beneath header */}
              <div
                aria-hidden
                className="my-7 h-px w-[calc(100%+80px)] -translate-x-10 bg-white/15"
              />

              <form onSubmit={handleDetailsSubmit} className="space-y-5">
                {formFields}

                {submitButton}
                {modeSwitch}
                {termsFooter}
              </form>
            </div>
          )}

          {state.step === STEP_OTP && (
            <div className="relative px-8 pb-8 pt-8 sm:px-10 sm:pb-10 sm:pt-10">
              <div className="max-w-[310px] space-y-4">
                <span className="inline-flex items-center justify-center rounded-full border border-white bg-[#091D65] px-4 py-1.5 text-[13px] font-medium italic text-white">
                  {config.badge}
                </span>
                <h2 className="text-[32px] font-extrabold italic leading-[42px] text-[#E1E3E4] sm:text-[36px] sm:leading-[46px]">
                  Enter <span className="text-[#F9A607]">OTP</span>
                </h2>
              </div>

              <img
                src={config.heroImage}
                alt=""
                className="pointer-events-none absolute right-3 top-6 h-[210px] w-auto select-none drop-shadow-[18px_46px_47px_rgba(11,12,15,0.6)] sm:h-[230px]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <div
                aria-hidden
                className="my-7 h-px w-[calc(100%+80px)] -translate-x-10 bg-white/15"
              />

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <p className="text-center text-sm text-white/75">
                  Sent to{" "}
                  <span className="font-bold text-white">+91 {state.mobile}</span>
                </p>
                <input
                  ref={otpRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={4}
                  value={state.otp}
                  onChange={(e) =>
                    update({
                      otp: e.target.value.replace(/\D/g, "").slice(0, 4),
                      error: null,
                    })
                  }
                  placeholder="----"
                  className={`w-full rounded-full border bg-white/[0.05] px-5 py-[15px] text-center text-lg font-bold tracking-[0.6em] text-white placeholder:tracking-[0.4em] placeholder:text-[#C6C5D1] focus:outline-none ${
                    state.error
                      ? "border-red-400/70 focus:border-red-400"
                      : "border-white/20 focus:border-[#F2A23A]"
                  }`}
                />
                {state.error && (
                  <p
                    className="text-center text-sm font-semibold text-red-400"
                    role="alert"
                  >
                    {state.error}
                  </p>
                )}
                {!state.error && state.hint && (
                  <p className="text-center text-xs text-[#F2A23A]" role="status">
                    {state.hint}
                  </p>
                )}
                <div className="relative pt-2">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-6 inset-y-3 rounded-full bg-[#FF7A18]/15 blur-md"
                  />
                  <button
                    type="submit"
                    disabled={state.loading || !state.otp.trim()}
                    className="relative flex w-full cursor-pointer items-center justify-center rounded-full bg-[#FF7A18] py-4 text-[18px] font-extrabold uppercase tracking-[1px] text-white shadow-[0_0_7.5px_rgba(255,122,24,0.3)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {state.loading ? "Verifying..." : "Verify & Continue"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={state.loading || state.resendIn > 0}
                  className="block w-full cursor-pointer text-center text-xs font-semibold text-[#F2A23A] underline-offset-4 hover:text-[#F9A607] hover:underline disabled:cursor-not-allowed disabled:text-white/50 disabled:no-underline"
                >
                  {state.resendIn > 0
                    ? `Resend OTP in ${state.resendIn}s`
                    : "Resend OTP"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    update({ step: STEP_DETAILS, otp: "", error: null, hint: null })
                  }
                  className="block w-full cursor-pointer text-center text-xs font-semibold text-[#C6C5D1] underline-offset-4 hover:text-white hover:underline"
                >
                  Change details
                </button>
              </form>
            </div>
          )}

          {state.step === STEP_TEAM && (
            <div className="relative px-8 pb-8 pt-8 sm:px-10 sm:pb-10 sm:pt-10">
              {teamStep}
            </div>
          )}
        </div>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </div>
    );
  }

  if (isFanPoll) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[460px] overflow-hidden rounded-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Sign in"
          style={{
            backgroundImage:
              "linear-gradient(212deg, rgba(14, 0, 90, 0.4) 28%, rgba(28, 57, 142, 0.4) 85%), linear-gradient(90deg, #192A66 0%, #192A66 100%)",
          }}
        >
          {/* Diagonal accent square top-right */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[54px] -top-[55px] flex h-[152px] w-[152px] items-center justify-center"
          >
            <div className="h-32 w-32 rotate-12 bg-[rgba(23,63,159,0.3)]" />
          </div>

          {closeButton}

          {state.step === STEP_DETAILS && (
            <div className="relative px-7 pb-7 pt-7 sm:px-8 sm:pb-8 sm:pt-8">
              <div className="flex flex-col items-center gap-4">
                <span className="inline-flex items-center justify-center rounded-full border border-white bg-[#091D65] px-4 py-1.5 text-[13px] font-medium italic text-white">
                  {config.badge}
                </span>
                <h2 className="text-center text-[26px] font-extrabold italic capitalize leading-[34px] text-[#E1E3E4] sm:text-[28px] sm:leading-[36px]">
                  {titleHead.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                  <span className="block text-[#F9A607]">{titleLast}</span>
                </h2>
                {config.subtitle && (
                  <p className="whitespace-pre-line text-center text-[15px] font-light leading-[22px] text-[#C6C5D1]">
                    {config.subtitle}
                  </p>
                )}
                {config.perkImages && config.perkImages.length > 0 && (
                  <div className="mt-1 flex items-center justify-center gap-[34px]">
                    {config.perkImages.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="h-[60px] w-auto select-none rounded-[10px]"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleDetailsSubmit} className="mt-6 space-y-5">
                {formFields}

                {submitButton}
                {modeSwitch}
                {termsFooter}
              </form>
            </div>
          )}

          {state.step === STEP_OTP && (
            <div className="relative px-7 pb-7 pt-7 sm:px-8 sm:pb-8 sm:pt-8">
              <div className="flex flex-col items-center gap-4">
                <span className="inline-flex items-center justify-center rounded-full border border-white bg-[#091D65] px-4 py-1.5 text-[13px] font-medium italic text-white">
                  {config.badge}
                </span>
                <h2 className="text-center text-[26px] font-extrabold italic leading-[34px] text-[#E1E3E4] sm:text-[28px] sm:leading-[36px]">
                  Enter <span className="text-[#F9A607]">OTP</span>
                </h2>
                <p className="text-center text-sm text-white/75">
                  Sent to{" "}
                  <span className="font-bold text-white">+91 {state.mobile}</span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="mt-6 space-y-5">
                <input
                  ref={otpRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={4}
                  value={state.otp}
                  onChange={(e) =>
                    update({
                      otp: e.target.value.replace(/\D/g, "").slice(0, 4),
                      error: null,
                    })
                  }
                  placeholder="----"
                  className={`w-full rounded-full border bg-white/[0.05] px-5 py-[15px] text-center text-lg font-bold tracking-[0.6em] text-white placeholder:tracking-[0.4em] placeholder:text-[#C6C5D1] focus:outline-none ${
                    state.error
                      ? "border-red-400/70 focus:border-red-400"
                      : "border-white/20 focus:border-[#F2A23A]"
                  }`}
                />
                {state.error && (
                  <p
                    className="text-center text-sm font-semibold text-red-400"
                    role="alert"
                  >
                    {state.error}
                  </p>
                )}
                {!state.error && state.hint && (
                  <p className="text-center text-xs text-[#F2A23A]" role="status">
                    {state.hint}
                  </p>
                )}
                <div className="relative pt-2">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-6 inset-y-3 rounded-full bg-[#FF7A18]/15 blur-md"
                  />
                  <button
                    type="submit"
                    disabled={state.loading || !state.otp.trim()}
                    className="relative flex w-full cursor-pointer items-center justify-center rounded-full bg-[#FF7A18] py-4 text-[18px] font-extrabold uppercase tracking-[1px] text-white shadow-[0_0_7.5px_rgba(255,122,24,0.3)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {state.loading ? "Verifying..." : "Verify & Continue"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={state.loading || state.resendIn > 0}
                  className="block w-full cursor-pointer text-center text-xs font-semibold text-[#F2A23A] underline-offset-4 hover:text-[#F9A607] hover:underline disabled:cursor-not-allowed disabled:text-white/50 disabled:no-underline"
                >
                  {state.resendIn > 0
                    ? `Resend OTP in ${state.resendIn}s`
                    : "Resend OTP"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    update({ step: STEP_DETAILS, otp: "", error: null, hint: null })
                  }
                  className="block w-full cursor-pointer text-center text-xs font-semibold text-[#C6C5D1] underline-offset-4 hover:text-white hover:underline"
                >
                  Change details
                </button>
              </form>
            </div>
          )}

          {state.step === STEP_TEAM && (
            <div className="relative px-7 pb-7 pt-7 sm:px-8 sm:pb-8 sm:pt-8">
              {teamStep}
            </div>
          )}
        </div>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </div>
    );
  }

  // Centered layout (fanPoll / fantasy)
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0E1B57] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#F2A23A]/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#1C398E]/45 blur-3xl"
        />

        {closeButton}

        <div className="relative px-6 pb-7 pt-9 sm:px-8">
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.06] px-4 py-1.5 text-[11px] font-extrabold tracking-[0.18em] text-white">
              {config.badge}
            </span>
          </div>
          <h2 className="text-center text-2xl font-extrabold italic leading-[1.1] text-white sm:text-[28px]">
            {titleHead.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
            <span className="block bg-gradient-to-r from-[#FFB85C] via-[#F68323] to-[#F2A23A] bg-clip-text text-transparent">
              {titleLast}
            </span>
          </h2>
          {config.subtitle && (
            <p className="mx-auto mt-3 max-w-[320px] text-center text-sm leading-relaxed text-white/65">
              {config.subtitle}
            </p>
          )}

          {state.step === STEP_DETAILS && (
            <>
              {config.perks && config.perks.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {config.perks.map((perk, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3.5"
                    >
                      <span aria-hidden className="text-2xl">
                        {perk.emoji}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/85">
                        {perk.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleDetailsSubmit} className="mt-5 space-y-3">
                {formFields}

                {submitButton}
                {modeSwitch}
                {termsFooter}
              </form>
            </>
          )}

          {state.step === STEP_OTP && (
            <form onSubmit={handleOtpSubmit} className="mt-5 space-y-4">
              <p className="text-center text-sm text-white/75">
                Enter the OTP sent to{" "}
                <span className="font-bold text-white">+91 {state.mobile}</span>
              </p>
              <input
                ref={otpRef}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={4}
                value={state.otp}
                onChange={(e) =>
                  update({
                    otp: e.target.value.replace(/\D/g, "").slice(0, 4),
                    error: null,
                  })
                }
                placeholder="----"
                className={`w-full rounded-full border bg-white/[0.04] px-4 py-3.5 text-center text-lg font-bold tracking-[0.6em] text-white placeholder:tracking-[0.4em] placeholder:text-white/30 focus:outline-none ${
                  state.error
                    ? "border-red-400/70 focus:border-red-400"
                    : "border-white/15 focus:border-[#F2A23A]"
                }`}
              />
              {state.error && (
                <p
                  className="text-center text-sm font-semibold text-red-400"
                  role="alert"
                >
                  {state.error}
                </p>
              )}
              {!state.error && state.hint && (
                <p className="text-center text-xs text-[#F2A23A]" role="status">
                  {state.hint}
                </p>
              )}
              <button
                type="submit"
                disabled={state.loading || !state.otp.trim()}
                className="flex w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-b from-[#FFB066] via-[#F68323] to-[#E07E27] px-4 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_10px_30px_-8px_rgba(246,131,35,0.7)] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state.loading ? "Verifying..." : "Verify & Continue"}
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={state.loading || state.resendIn > 0}
                className="block w-full cursor-pointer text-center text-xs font-semibold text-[#F2A23A] underline-offset-4 hover:text-[#F9A607] hover:underline disabled:cursor-not-allowed disabled:text-white/40 disabled:no-underline"
              >
                {state.resendIn > 0
                  ? `Resend OTP in ${state.resendIn}s`
                  : "Resend OTP"}
              </button>
              <button
                type="button"
                onClick={() =>
                  update({ step: STEP_DETAILS, otp: "", error: null, hint: null })
                }
                className="block w-full cursor-pointer text-center text-xs font-semibold text-white/60 underline-offset-4 hover:text-white hover:underline"
              >
                Change details
              </button>
            </form>
          )}

          {state.step === STEP_TEAM && (
            <div className="mt-5">{teamStep}</div>
          )}
        </div>
      </div>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
};

export default LoginModal;
