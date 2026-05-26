"use client";

// Shared admin-UI primitives. Imported by every /admin/* page so the visual
// language stays consistent.

export function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#F2A23A]">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="font-oswald text-3xl font-extrabold uppercase italic leading-none text-white sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-white/55">{subtitle}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function StatCard({ label, value, trend, accent = "default" }) {
  const accents = {
    default: "border-white/10 bg-[#0A1438]",
    gold: "border-[#F2A23A]/30 bg-[#F2A23A]/[0.08]",
    emerald: "border-emerald-400/30 bg-emerald-400/[0.07]",
    blue: "border-sky-400/30 bg-sky-400/[0.07]",
  };
  return (
    <div className={`rounded-2xl border p-5 ${accents[accent] ?? accents.default}`}>
      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
        {label}
      </div>
      <div className="mt-2 font-oswald text-3xl font-extrabold tabular-nums italic text-white">
        {value}
      </div>
      {trend ? (
        <div className="mt-1 text-xs text-white/55">{trend}</div>
      ) : null}
    </div>
  );
}

export function Card({ title, action, children, padding = "default" }) {
  const pad = padding === "tight" ? "p-4" : "p-5 sm:p-6";
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0A1438]/85">
      {title || action ? (
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 sm:px-6">
          {title ? (
            <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-white/70">
              {title}
            </h2>
          ) : <span />}
          {action ? <div>{action}</div> : null}
        </div>
      ) : null}
      <div className={pad}>{children}</div>
    </section>
  );
}

export function Button({
  as: As = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}) {
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-xs",
    lg: "px-5 py-2.5 text-sm",
  };
  const variants = {
    primary:
      "bg-[#F2A23A] text-[#02103D] hover:brightness-110 disabled:opacity-60",
    secondary:
      "border border-white/15 bg-white/[0.04] text-white/80 hover:border-white/40 hover:text-white disabled:opacity-60",
    ghost: "text-white/70 hover:bg-white/[0.06] hover:text-white",
    danger:
      "border border-red-400/40 bg-red-400/[0.08] text-red-200 hover:bg-red-400/15 disabled:opacity-60",
    success:
      "bg-emerald-400 text-[#02103D] hover:brightness-110 disabled:opacity-60",
  };
  return (
    <As
      className={`inline-flex items-center justify-center gap-2 rounded-md font-bold uppercase tracking-wide transition ${sizes[size] ?? sizes.md} ${variants[variant] ?? variants.primary} ${className}`}
      {...rest}
    >
      {children}
    </As>
  );
}

export function Pill({ tone = "default", children }) {
  const tones = {
    default: "border-white/15 bg-white/[0.05] text-white/70",
    gold: "border-[#F2A23A]/40 bg-[#F2A23A]/10 text-[#F2A23A]",
    emerald: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    red: "border-red-400/40 bg-red-400/10 text-red-200",
    sky: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${tones[tone] ?? tones.default}`}
    >
      {children}
    </span>
  );
}

const POLL_STATUS_TONES = {
  active: "emerald",
  draft: "default",
  closed: "gold",
};

export function PollStatusBadge({ status }) {
  const tone = POLL_STATUS_TONES[status] || "default";
  return (
    <Pill tone={tone}>
      {tone === "emerald" ? <Dot /> : null}
      {status}
    </Pill>
  );
}

const MATCH_STATUS_TONES = {
  upcoming: "sky",
  live: "emerald",
  completed: "gold",
  abandoned: "red",
};

export function MatchStatusBadge({ status }) {
  const tone = MATCH_STATUS_TONES[status] || "default";
  return (
    <Pill tone={tone}>
      {status === "live" ? <Dot pulse /> : null}
      {status}
    </Pill>
  );
}

function Dot({ pulse }) {
  return (
    <span
      className={`h-1.5 w-1.5 rounded-full bg-current ${pulse ? "animate-pulse" : ""}`}
    />
  );
}

export function EmptyState({ title, hint, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-white/[0.04] text-[#F2A23A]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <div className="text-base font-bold text-white">{title}</div>
      {hint ? <p className="max-w-md text-sm text-white/55">{hint}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
