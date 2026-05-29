"use client";

import { useState } from "react";
import { clearOtpRate } from "@/app/api/admin/support";
import { Button, Card, PageHeader } from "@/components/admin/ui";

// Operator escape hatch for users stuck behind the OTP rate-limit
// (3/10min sends, 10/day sends, or 5 failed verify attempts). Hits the
// existing DELETE /v1/admin/otp-rate/:mobile — see support.js for the
// keys that get wiped.

export default function SupportPage() {
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const sanitized = mobile.replace(/\D/g, "").slice(0, 10);
  const valid = /^\d{10}$/.test(sanitized);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!valid || submitting) return;
    if (
      !window.confirm(
        `Clear OTP rate-limit + cached OTP for ${sanitized}? This is audited.`,
      )
    ) {
      return;
    }
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await clearOtpRate(sanitized);
      setMsg({ ok: true, mobile: res.mobile, cleared: res.keys_cleared });
    } catch (err) {
      const data = err?.response?.data ?? {};
      setMsg({
        ok: false,
        error: data.error ?? err?.message ?? "Clear failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Clear OTP rate-limit"
        subtitle="Unstick a user behind the 3/10min, 10/day, or 5-attempts cap. Per-IP counters are not affected."
      />

      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 sm:max-w-md">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
              Mobile (10 digits)
            </span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="off"
              value={sanitized}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="9876543210"
              className="rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2.5 font-mono text-base text-white placeholder:text-white/30 focus:border-[#F2A23A]/60 focus:outline-none"
            />
            {sanitized && !valid ? (
              <span className="text-xs text-red-300">
                Enter a 10-digit mobile number.
              </span>
            ) : null}
          </label>

          <div>
            <Button type="submit" disabled={!valid || submitting} size="lg">
              {submitting ? "Clearing…" : "Clear rate-limit"}
            </Button>
          </div>
        </form>

        {msg ? (
          <div
            className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
              msg.ok
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                : "border-red-400/30 bg-red-400/10 text-red-200"
            }`}
          >
            {msg.ok ? (
              <>
                Cleared <span className="font-mono">{msg.mobile}</span> —{" "}
                {msg.cleared} Redis {msg.cleared === 1 ? "key" : "keys"} wiped.
                User can request a new OTP now.
              </>
            ) : (
              <>
                Failed — <span className="font-mono">{msg.error}</span>
              </>
            )}
          </div>
        ) : null}
      </Card>

      <div className="mt-6 text-xs text-white/45">
        Clears <span className="font-mono">otp:rate:mobile:*</span>,{" "}
        <span className="font-mono">otp:day:mobile:*</span>,{" "}
        <span className="font-mono">otp:attempts:*</span>, and{" "}
        <span className="font-mono">otp:*</span> for the given mobile. Every
        clear is recorded in the audit log.
      </div>
    </>
  );
}
