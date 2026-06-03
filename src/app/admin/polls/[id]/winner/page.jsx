"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  closePoll,
  getPoll,
  getPollWinner,
  pickPollWinner,
  pickPollWinnerManual,
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
  const [voters, setVoters] = useState([]);
  const [voterCount, setVoterCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [confirmManual, setConfirmManual] = useState(null); // voter object or null
  const [pickingManual, setPickingManual] = useState(null); // user_id being picked
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voterSearch, setVoterSearch] = useState("");

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
    const list = votersRes.voters ?? [];
    setVoters(list);
    setVoterCount(votersRes.totals?.all ?? list.length ?? 0);
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
      else if (code === "no_correct_voters") setError("No voters with the correct answer — mark a correct option first or draw from all voters.");
      else if (code === "poll_not_closed") setError("Close the poll before picking a winner.");
      else setError("Failed to pick a winner. Try again.");
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  };

  const handlePickManual = async (voter) => {
    if (!voter?.user_id) {
      setError("Cannot select this voter — missing user ID.");
      setConfirmManual(null);
      return;
    }
    setConfirmManual(null);
    setPickingManual(voter.user_id);
    setError(null);
    try {
      const res = await pickPollWinnerManual(id, voter.user_id);
      if (!mountedRef.current) return;
      setWinner(res.winner);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err?.response?.data?.error || "Failed to select winner. Try again.");
    } finally {
      if (mountedRef.current) setPickingManual(null);
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

  const filteredVoters = voters.filter((v) => {
    if (!voterSearch.trim()) return true;
    const q = voterSearch.toLowerCase();
    return (
      v.name?.toLowerCase().includes(q) ||
      v.mobile?.toLowerCase().includes(q) ||
      v.option_label?.toLowerCase().includes(q)
    );
  });

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

      <ConfirmDialog
        open={!!confirmManual}
        title={`Select ${confirmManual?.name || "this voter"} as winner?`}
        message="This will override any previously drawn winner. The TV reveal will update immediately."
        confirmLabel="Select as winner"
        confirmVariant="primary"
        onConfirm={() => handlePickManual(confirmManual)}
        onCancel={() => setConfirmManual(null)}
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

      {/* Voters list with manual selection */}
      {voters.length > 0 && (
        <div className="mt-8">
          <Card title={`Voters (${voterCount})`}>
            <div className="mb-4">
              <input
                type="text"
                value={voterSearch}
                onChange={(e) => setVoterSearch(e.target.value)}
                placeholder="Search by name, mobile, or vote…"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">#</th>
                    <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Name</th>
                    <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Mobile</th>
                    <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Voted for</th>
                    <th className="pb-2 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredVoters.map((voter, i) => {
                    const isCurrentWinner = winner && winner.mobile === voter.mobile && winner.name === voter.name;
                    const isPicking = pickingManual === voter.user_id;
                    return (
                      <tr
                        key={voter.user_id ?? i}
                        className={`transition ${isCurrentWinner ? "bg-[#F2A23A]/[0.07]" : "hover:bg-white/[0.02]"}`}
                      >
                        <td className="py-2.5 pr-3 font-mono text-xs text-white/30">{i + 1}</td>
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-2">
                            {isCurrentWinner && (
                              <span className="text-base leading-none">🏆</span>
                            )}
                            <span className="font-medium text-white">
                              {voter.name || <span className="text-white/35 italic">Anonymous</span>}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-4 font-mono text-xs text-white/55">
                          {voter.mobile || "—"}
                        </td>
                        <td className="py-2.5 pr-4">
                          <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/70">
                            {voter.option_label || "—"}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          {isCurrentWinner ? (
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#F2A23A]">
                              Winner
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={!isClosed || isPicking}
                              onClick={() => setConfirmManual(voter)}
                              className="rounded border border-white/15 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/60 transition hover:border-[#F2A23A]/50 hover:bg-[#F2A23A]/10 hover:text-[#F2A23A] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              {isPicking ? "Selecting…" : "Select winner"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredVoters.length === 0 && (
                <div className="py-8 text-center text-sm text-white/40">
                  No voters match your search.
                </div>
              )}
            </div>

            {!isClosed && (
              <p className="mt-4 text-center text-xs text-white/35">
                Close the poll first to enable manual winner selection.
              </p>
            )}
          </Card>
        </div>
      )}
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
