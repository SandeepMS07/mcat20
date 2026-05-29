"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { listMatches, listPolls } from "@/app/api/admin/polls";
import {
  Button,
  Card,
  EmptyState,
  PageHeader,
  PollStatusBadge,
  StatCard,
} from "@/components/admin/ui";

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "closed", label: "Closed" },
];

function fmtMatch(m) {
  if (!m) return "—";
  const a = m.team_a_short || m.team_a_name || "?";
  const b = m.team_b_short || m.team_b_name || "?";
  return `${a} vs ${b}`;
}

export default function AdminPollsListPage() {
  const [polls, setPolls] = useState([]);
  const [allPolls, setAllPolls] = useState([]);
  const [matches, setMatches] = useState([]);
  const [status, setStatus] = useState("all");
  const [matchId, setMatchId] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Stats + matches list don't depend on the active filters, so fetch them
  // once on mount instead of on every filter change.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [matchesRes, allRes] = await Promise.all([
          listMatches(),
          listPolls(),
        ]);
        if (cancelled) return;
        setMatches(matchesRes.matches || []);
        setAllPolls(allRes.polls || []);
      } catch {
        /* stats are non-critical; leave defaults */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filtered table re-fetches whenever the user changes status/match filters.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const pollsRes = await listPolls({
          status: status === "all" ? undefined : status,
          matchId: matchId === "all" ? undefined : matchId,
        });
        if (cancelled) return;
        setPolls(pollsRes.polls || []);
      } catch {
        if (!cancelled) setPolls([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, matchId]);

  const matchById = useMemo(() => {
    const map = new Map();
    matches.forEach((row) => map.set(row.id, row));
    return map;
  }, [matches]);

  const filtered = useMemo(() => {
    if (!search.trim()) return polls;
    const q = search.toLowerCase();
    return polls.filter(
      (p) =>
        p.question.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q),
    );
  }, [polls, search]);

  const stats = useMemo(() => {
    const active = allPolls.filter((p) => p.status === "active").length;
    const draft = allPolls.filter((p) => p.status === "draft").length;
    const closed = allPolls.filter((p) => p.status === "closed").length;
    const totalVotes = allPolls.reduce((s, p) => s + (p.vote_count || 0), 0);
    return { total: allPolls.length, active, draft, closed, totalVotes };
  }, [allPolls]);

  return (
    <>
      <PageHeader
        eyebrow="Fan polls"
        title="Polls"
        subtitle="Author, schedule and monitor every poll across the tournament."
        actions={
          <Button as={Link} href="/admin/polls/new" size="lg">
            <span>+</span>
            <span>Create poll</span>
          </Button>
        }
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total polls" value={stats.total} accent="default" />
        <StatCard label="Active" value={stats.active} accent="emerald" />
        <StatCard label="Drafts" value={stats.draft} accent="default" />
        <StatCard
          label="Total votes"
          value={stats.totalVotes.toLocaleString("en-IN")}
          accent="gold"
        />
      </div>

      <Card padding="tight">
        <div className="flex flex-col gap-3 px-1 py-1 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search question or slug…"
              className="w-full rounded-md border border-white/15 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-[#F2A23A] focus:outline-none"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-white/15 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-[#F2A23A] focus:outline-none"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#0A1438]">
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
            className="rounded-md border border-white/15 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-[#F2A23A] focus:outline-none"
          >
            <option value="all" className="bg-[#0A1438]">
              All matches
            </option>
            {matches.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#0A1438]">
                {fmtMatch(m)} ·{" "}
                {new Date(m.scheduled_at).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0A1438]/85">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
              <tr>
                <th className="px-5 py-3 text-left">Question</th>
                <th className="px-5 py-3 text-left">Match</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-right">Votes</th>
                <th className="px-5 py-3 text-left">Closes</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0">
                    <EmptyState
                      title="No polls yet"
                      hint="Create your first poll to start collecting fan predictions."
                      action={
                        <Button as={Link} href="/admin/polls/new">
                          + Create poll
                        </Button>
                      }
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const m = p.match_id ? matchById.get(p.match_id) : null;
                  return (
                    <tr
                      key={p.id}
                      className="group border-t border-white/5 transition hover:bg-white/[0.025]"
                    >
                      <td className="max-w-md px-5 py-4">
                        <div className="truncate text-sm font-semibold text-white">
                          {p.question}
                        </div>
                        <div className="mt-0.5 font-mono text-[11px] text-white/40">
                          {p.slug}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-white/75">
                        {p.match_id ? (
                          <span className="inline-flex flex-col">
                            <span>{fmtMatch(m)}</span>
                            {m?.scheduled_at ? (
                              <span className="text-[11px] text-white/40">
                                {new Date(m.scheduled_at).toLocaleDateString()}
                              </span>
                            ) : null}
                          </span>
                        ) : (
                          <span className="text-white/40">Season-wide</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <PollStatusBadge status={p.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-oswald text-lg font-extrabold italic tabular-nums text-white">
                          {p.vote_count}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-white/65">
                        {p.ends_at
                          ? new Date(p.ends_at).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            as={Link}
                            href={`/admin/polls/${p.id}/edit#voters`}
                            variant="secondary"
                            size="sm"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                            >
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            Voters
                            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white/70">
                              {p.vote_count}
                            </span>
                          </Button>
                          <Button
                            as={Link}
                            href={`/admin/polls/${p.id}/winner`}
                            variant="secondary"
                            size="sm"
                          >
                            🏆 Winner
                          </Button>
                          {p.status !== "closed" ? (
                            <Button
                              as={Link}
                              href={`/admin/polls/${p.id}/edit`}
                              variant="primary"
                              size="sm"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              Edit
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
