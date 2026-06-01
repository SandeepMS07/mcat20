"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  closePoll,
  getPoll,
  getPollWinner,
  pickPollWinner,
  pollVoters,
} from "@/app/api/admin/polls";
import {
  Button,
  Card,
  ConfirmDialog,
  PageHeader,
  Pill,
  StatCard,
} from "@/components/admin/ui";

function useCopyUrl(url) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return { copied, copy };
}

function CopyUrlBar({ id }) {
  const revealUrl = typeof window !== "undefined"
    ? `${window.location.origin}/fan-poll/reveal/${encodeURIComponent(id)}`
    : `/fan-poll/reveal/${encodeURIComponent(id)}`;
  const { copied, copy } = useCopyUrl(revealUrl);

  return (
    <div className="mb-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
        Reveal URL
      </span>
      <span className="flex-1 truncate font-mono text-[11px] text-white/65">
        {revealUrl}
      </span>
      <button
        type="button"
        onClick={copy}
        className={`shrink-0 rounded px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] transition ${
          copied
            ? "bg-emerald-400/20 text-emerald-300"
            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
        }`}
      >
        {copied ? "Copied!" : "Copy URL"}
      </button>
    </div>
  );
}

export default function PollWinnerPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [winner, setWinner] = useState(null);
  const [voterCount, setVoterCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const reload = async () => {
    const [pollRes, votersRes, winnerRes] = await Promise.all([
      getPoll(id),
      pollVoters(id),
      getPollWinner(id).catch(() => ({ winner: null })),
    ]);
    if (!mountedRef.current) return;
    setPoll(pollRes.poll);
    setVoterCount(votersRes.totals?.all ?? votersRes.voters?.length ?? 0);
    setWinner(winnerRes.winner ?? null);
  };

  useEffect(() => {
    (async () => {
      try {
        await reload();
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleClose = async () => {
    setClosing(true);
    setConfirmClose(false);
    setError(null);
    try {
      await closePoll(id);
      await reload();
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err?.response?.data?.error || "Failed to close poll.");
    } finally {
      if (mountedRef.current) setClosing(false);
    }
  };

  const handlePick = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await pickPollWinner(id);
      if (!mountedRef.current) return;
      setWinner(res.winner);
    } catch (err) {
      if (!mountedRef.current) return;
      const code = err?.response?.data?.error;
      if (code === "no_voters") setError("No eligible voters yet for this poll.");
      else if (code === "poll_not_closed") setError("Close the poll before picking a winner.");
      else setError("Failed to pick a winner. Try again.");
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center py-24 text-sm uppercase tracking-[0.22em] text-white/55">
        Loading…
      </div>
    );
  }

  const isClosed = poll?.status === "closed";

  return (
    <>
      <ConfirmDialog
        open={confirmClose}
        title="Close poll?"
        message="Fans will no longer be able to vote. Existing votes are preserved."
        confirmLabel="Close poll"
        confirmVariant="danger"
        onConfirm={handleClose}
        onCancel={() => setConfirmClose(false)}
      />

      <PageHeader
        eyebrow="Winner draw"
        title={poll?.question ?? "Pick winner"}
        subtitle={
          winner
            ? "Winner picked. Open the TV reveal or re-draw if needed."
            : isClosed
            ? "Poll is closed. Ready to pick a winner."
            : "Close the poll first, then pick a winner."
        }
        actions={
          <Button as={Link} href={`/admin/polls/${id}/edit`} variant="ghost" size="sm">
            ← Back to poll
          </Button>
        }
      />

      {/* Reveal URL bar — always visible so the venue screen can be set up early */}
      <CopyUrlBar id={id} />

      {error ? (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-md border border-red-400/40 bg-red-400/10 px-4 py-2.5 text-sm text-red-200">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-200/70 hover:text-red-200"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Total voters"
          value={voterCount.toLocaleString("en-IN")}
          accent="default"
        />
        <StatCard
          label="Poll status"
          value={poll?.status ?? "—"}
          accent={isClosed ? "emerald" : "default"}
        />
        <StatCard
          label="Winner"
          value={winner ? "Picked" : "Pending"}
          accent={winner ? "gold" : "default"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <Card title="Steps">
          {/* Step 1: Close the poll */}
          <div className={`rounded-xl border p-5 transition ${isClosed ? "border-emerald-400/40 bg-emerald-400/[0.05]" : "border-white/15 bg-white/[0.02]"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${isClosed ? "bg-emerald-400/20 text-emerald-300" : "bg-white/10 text-white/60"}`}>
                    1
                  </span>
                  <span className="text-sm font-bold uppercase tracking-wide text-white">
                    Close poll
                  </span>
                  {isClosed ? <Pill tone="emerald">Done</Pill> : null}
                </div>
                <p className="mt-2 text-sm text-white/60">
                  Closing the poll stops new votes from being accepted. Existing votes are preserved.
                </p>
              </div>
              {!isClosed ? (
                <Button
                  type="button"
                  onClick={() => setConfirmClose(true)}
                  disabled={closing}
                  variant="secondary"
                  size="md"
                >
                  {closing ? "Closing…" : "Close poll"}
                </Button>
              ) : null}
            </div>
          </div>

          {/* Step 2: Pick winner */}
          <div className={`mt-4 rounded-xl border p-5 transition ${!isClosed ? "opacity-50" : "border-white/15 bg-white/[0.02]"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${winner ? "bg-[#F2A23A]/20 text-[#F2A23A]" : "bg-white/10 text-white/60"}`}>
                    2
                  </span>
                  <span className="text-sm font-bold uppercase tracking-wide text-white">
                    Pick random winner
                  </span>
                  {winner ? <Pill tone="gold">Done</Pill> : null}
                </div>
                <p className="mt-2 text-sm text-white/60">
                  Draws uniformly at random from all {voterCount} voters. You can re-draw after picking.
                </p>
              </div>
              <Button
                type="button"
                onClick={handlePick}
                disabled={submitting || !isClosed || voterCount === 0}
                size="md"
              >
                {submitting ? "Drawing…" : winner ? "Re-draw" : "Pick winner"}
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Result">
          {winner ? (
            <WinnerResult id={id} winner={winner} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-white/[0.04] text-2xl">
                🎲
              </div>
              <div className="text-base font-bold text-white">No winner drawn yet</div>
              <p className="max-w-xs text-sm text-white/55">
                Complete the steps on the left to pick and reveal the winner.
              </p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function WinnerResult({ id, winner }) {
  const revealUrl = typeof window !== "undefined"
    ? `${window.location.origin}/fan-poll/reveal/${encodeURIComponent(id)}`
    : `/fan-poll/reveal/${encodeURIComponent(id)}`;
  const { copied, copy } = useCopyUrl(revealUrl);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#F2A23A]/15 text-2xl">
          🏆
        </span>
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F2A23A]/80">
            Winner
          </div>
          <div className="mt-1 truncate font-oswald text-2xl font-extrabold italic uppercase text-white">
            {winner.name || "Anonymous"}
          </div>
          {winner.mobile ? (
            <div className="mt-0.5 font-mono text-xs text-white/65">{winner.mobile}</div>
          ) : null}
        </div>
      </div>

      {winner.picked_at ? (
        <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white/65">
          <span className="font-bold uppercase tracking-[0.15em] text-white/40">Picked at</span>
          <div className="mt-1">{new Date(winner.picked_at).toLocaleString()}</div>
        </div>
      ) : null}

      <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
        <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
          Reveal URL
        </div>
        <div className="flex items-center gap-2">
          <span className="flex-1 truncate font-mono text-[11px] text-white/70">
            {revealUrl}
          </span>
          <button
            type="button"
            onClick={copy}
            className={`shrink-0 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] transition ${
              copied
                ? "bg-emerald-400/20 text-emerald-300"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <Button
        as="a"
        href={`${revealUrl}?admin=1`}
        target="_blank"
        rel="noreferrer"
        variant="success"
        size="lg"
        className="w-full"
      >
        Open TV reveal ↗
      </Button>
      <p className="text-center text-xs text-white/45">
        Share the reveal URL on the venue screen — it updates automatically when the winner is picked.
      </p>
    </div>
  );
}
