"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { sendOtp, verifyOtp, updateMe } from "@/app/api/auth";
import { setAccessToken } from "@/app/api/turboverseAxios";
import routes from "@/utilis/route";

const MOBILE_REGEX = /^\d{10}$/;

const STEP_DETAILS = "details";
const STEP_OTP = "otp";

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
  const isJersey = config.layout === "jersey";
  const isFanPoll = config.layout === "fanPoll";

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
        // Modal has no dedicated team-name field; seed teamName with the
        // user's full name so the fantasy header / leaderboard has
        // something sensible to display until the user customises it
        // from the fantasy profile screen. Email (optional) is persisted
        // separately via PATCH /v1/me below — it's neither a name nor a
        // team name, and conflating them was the previous bug.
        teamName: state.name.trim(),
      });

      // Best-effort: if the user filled in the optional email, save it on
      // their profile. We have to seed setAccessToken first because the
      // axios request interceptor reads the in-memory token, and onSuccess
      // (which is what AuthProvider uses to set it) hasn't fired yet —
      // without this, the PATCH would go out with no Authorization header
      // and 401. Fire-and-forget after that so a flaky PATCH doesn't
      // block the login UX.
      const email = state.email.trim();
      if (email) {
        setAccessToken(data.token);
        updateMe({ email }).catch((err) => {
          // eslint-disable-next-line no-console
          console.warn("[auth] couldn't save email on profile:", err?.response?.status, err?.response?.data || err?.message);
        });
      }

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

  // Shared form fields used by both layouts.
  const formFields = (
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
          maxLength={100}
          value={state.email}
          onChange={(e) => update({ email: e.target.value })}
          placeholder="Email (optional)"
          className="w-full bg-transparent text-base text-white placeholder:text-[#C6C5D1] focus:outline-none"
        />
      </div>

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
        {state.loading ? "Sending OTP..." : "Verify & Proceed"}
      </button>
    </div>
  );

  const termsFooter = (
    <p className="text-center text-xs text-[#C6C5D1]">
      By joining, you agree to the{" "}
      <Link
        href={routes.termsAndConditions}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className="font-medium text-[#B5C4FF] underline-offset-2 hover:underline"
      >
        Terms of Play
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

                {state.error && (
                  <p className="text-center text-xs text-red-300" role="alert">
                    {state.error}
                  </p>
                )}

                {submitButton}
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
                  maxLength={6}
                  value={state.otp}
                  onChange={(e) =>
                    update({
                      otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                      error: null,
                    })
                  }
                  placeholder="------"
                  className="w-full rounded-full border border-white/20 bg-white/[0.05] px-5 py-[15px] text-center text-lg font-bold tracking-[0.6em] text-white placeholder:tracking-[0.4em] placeholder:text-[#C6C5D1] focus:border-[#F2A23A] focus:outline-none"
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
        </div>
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

                {state.error && (
                  <p className="text-center text-xs text-red-300" role="alert">
                    {state.error}
                  </p>
                )}

                {submitButton}
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
                  maxLength={6}
                  value={state.otp}
                  onChange={(e) =>
                    update({
                      otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                      error: null,
                    })
                  }
                  placeholder="------"
                  className="w-full rounded-full border border-white/20 bg-white/[0.05] px-5 py-[15px] text-center text-lg font-bold tracking-[0.6em] text-white placeholder:tracking-[0.4em] placeholder:text-[#C6C5D1] focus:border-[#F2A23A] focus:outline-none"
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
        </div>
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

                {state.error && (
                  <p className="text-center text-xs text-red-300" role="alert">
                    {state.error}
                  </p>
                )}

                {submitButton}
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
