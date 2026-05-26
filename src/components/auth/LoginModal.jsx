"use client";
import { useEffect, useRef, useState } from "react";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { sendOtp, verifyOtp } from "@/app/api/auth";

const MOBILE_REGEX = /^\d{10}$/;

const STEP_DETAILS = "details";
const STEP_OTP = "otp";

const VARIANTS = {
  fanPoll: {
    badge: "TODAY'S FAN POLL",
    titleLines: ["Win A Chance To Join The", "Post-Match Ceremony"],
    subtitle:
      "Sign up and you could be on the field at the post-match presentation party.",
    perks: [
      { emoji: "🏆", label: "Trophy Photo" },
      { emoji: "⭐", label: "Meet Players" },
    ],
    layout: "centered",
  },
  viewersChoice: {
    badge: "VIEWERS CHOICE",
    titleLines: ["Win A Chance", "To Get The", "Signed Jersey"],
    subtitle: null,
    perks: null,
    heroImage: "/images/login/signed-jersey.png",
    layout: "split",
  },
  fantasy: {
    badge: "PLAY FANTASY",
    titleLines: ["Build Your", "Dream XI"],
    subtitle: "Pick your squad. Compete with friends. Win the trophy.",
    perks: null,
    layout: "centered",
  },
};

const initialState = {
  step: STEP_DETAILS,
  name: "",
  email: "",
  mobile: "",
  otp: "",
  loading: false,
  error: null,
  hint: null,
};

const LoginModal = ({ open, onClose, onSuccess, variant = "fanPoll" }) => {
  const [state, setState] = useState(initialState);
  const nameRef = useRef(null);
  const otpRef = useRef(null);

  const config = VARIANTS[variant] || VARIANTS.fanPoll;
  const isSplit = config.layout === "split";

  useEffect(() => {
    if (!open) {
      setState(initialState);
      return undefined;
    }
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      if (state.step === STEP_DETAILS) nameRef.current?.focus();
      else if (state.step === STEP_OTP) otpRef.current?.focus();
    }, 60);
    return () => clearTimeout(t);
  }, [open, state.step]);

  if (!open) return null;

  const update = (patch) => setState((s) => ({ ...s, ...patch }));

  const detailsValid =
    state.name.trim().length > 1 && MOBILE_REGEX.test(state.mobile);

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (state.loading) return;
    if (!state.name.trim()) {
      update({ error: "Please enter your full name." });
      return;
    }
    if (!MOBILE_REGEX.test(state.mobile)) {
      update({ error: "Enter a valid 10-digit mobile number." });
      return;
    }
    update({ loading: true, error: null, hint: null });
    try {
      const data = await sendOtp(state.mobile.trim());
      update({
        loading: false,
        step: STEP_OTP,
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
      update({ loading: false, error: msg });
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (state.loading) return;
    if (!state.otp.trim()) {
      update({ error: "Enter the OTP you received." });
      return;
    }
    update({ loading: true, error: null });
    try {
      const data = await verifyOtp({
        mobile: state.mobile.trim(),
        otp: state.otp.trim(),
        name: state.name.trim(),
        teamName: state.email.trim() || undefined,
      });
      update({ loading: false });
      onSuccess?.({ token: data.token, user: data.user });
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
        msg = "Please go back and enter your name.";
      }
      update({ loading: false, error: msg });
    }
  };

  const titleLast = config.titleLines[config.titleLines.length - 1];
  const titleHead = config.titleLines.slice(0, -1);

  const Header = (
    <>
      <div className={`mb-4 flex ${isSplit ? "justify-start" : "justify-center"}`}>
        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.06] px-4 py-1.5 text-[11px] font-extrabold tracking-[0.18em] text-white">
          {config.badge}
        </span>
      </div>
      <h2
        className={`${
          isSplit ? "text-left" : "text-center"
        } text-2xl font-extrabold italic leading-[1.1] text-white sm:text-[28px]`}
      >
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
        <p
          className={`mx-auto mt-3 max-w-[320px] ${
            isSplit ? "text-left mx-0" : "text-center"
          } text-sm leading-relaxed text-white/65`}
        >
          {config.subtitle}
        </p>
      )}
    </>
  );

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

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 cursor-pointer rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
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

        <div className="relative px-6 pb-7 pt-9 sm:px-8">
          {isSplit && config.heroImage ? (
            <div className="mb-5 grid grid-cols-[1fr_auto] items-start gap-4">
              <div>{Header}</div>
              <img
                src={config.heroImage}
                alt=""
                className="-mr-2 -mt-3 h-32 w-auto object-contain sm:h-36"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : (
            <>{Header}</>
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
                <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-4 py-3 focus-within:border-[#F2A23A]">
                  <FiUser className="h-4 w-4 shrink-0 text-white/55" aria-hidden />
                  <input
                    ref={nameRef}
                    type="text"
                    autoComplete="name"
                    maxLength={60}
                    value={state.name}
                    onChange={(e) =>
                      update({ name: e.target.value, error: null })
                    }
                    placeholder="Full Name"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-4 py-3 focus-within:border-[#F2A23A]">
                  <FiMail className="h-4 w-4 shrink-0 text-white/55" aria-hidden />
                  <input
                    type="email"
                    autoComplete="email"
                    maxLength={100}
                    value={state.email}
                    onChange={(e) => update({ email: e.target.value })}
                    placeholder="Email (optional)"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-4 py-3 focus-within:border-[#F2A23A]">
                  <FiPhone className="h-4 w-4 shrink-0 text-white/55" aria-hidden />
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
                    className="w-full bg-transparent text-sm tracking-wider text-white placeholder:text-white/45 placeholder:tracking-normal focus:outline-none"
                  />
                </div>

                {state.error && (
                  <p className="text-center text-xs text-red-300" role="alert">
                    {state.error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={state.loading || !detailsValid}
                  className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-b from-[#FFB066] via-[#F68323] to-[#E07E27] px-4 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_10px_30px_-8px_rgba(246,131,35,0.7)] transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state.loading ? "Sending OTP..." : "Verify & Proceed"}
                </button>

                <p className="pt-1 text-center text-[11px] text-white/55">
                  By joining, you agree to the{" "}
                  <span className="font-semibold text-white/80 underline-offset-2 hover:underline">
                    Terms of Play
                  </span>
                </p>
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
                maxLength={6}
                value={state.otp}
                onChange={(e) =>
                  update({
                    otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                    error: null,
                  })
                }
                placeholder="------"
                className="w-full rounded-full border border-white/15 bg-white/[0.04] px-4 py-3.5 text-center text-lg font-bold tracking-[0.6em] text-white placeholder:tracking-[0.4em] placeholder:text-white/30 focus:border-[#F2A23A] focus:outline-none"
              />
              {state.hint && !state.error && (
                <p className="text-center text-xs text-[#F2A23A]" role="status">
                  {state.hint}
                </p>
              )}
              {state.error && (
                <p className="text-center text-xs text-red-300" role="alert">
                  {state.error}
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
                onClick={() =>
                  update({ step: STEP_DETAILS, otp: "", error: null, hint: null })
                }
                className="block w-full cursor-pointer text-center text-xs font-semibold text-white/60 underline-offset-4 hover:text-white hover:underline"
              >
                Change details
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
