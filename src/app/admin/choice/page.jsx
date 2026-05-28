"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { listChoice } from "@/app/api/admin/choice";
import { CHOICE_CATEGORIES } from "@/app/choice/categories";
import {
  Card,
  EmptyState,
  PageHeader,
  Pill,
  StatCard,
} from "@/components/admin/ui";

// Map the backend poll slug (`vc-<category-slug>`) back to the public category
// config so the admin list shows the same titles/labels fans see.
const META_BY_SLUG = new Map(
  CHOICE_CATEGORIES.map((c) => [`vc-${c.slug}`, c]),
);

export default function AdminChoiceListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await listChoice();
        if (!cancelled) setCategories(res.categories || []);
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const totalVotes = categories.reduce((s, c) => s + (c.total_votes || 0), 0);
    const live = categories.filter((c) => c.status === "active").length;
    return { count: categories.length, totalVotes, live };
  }, [categories]);

  return (
    <>
      <PageHeader
        eyebrow="Season awards"
        title="Viewers' Choice"
        subtitle="Curate the nominee shortlist for each award category and watch the fan vote come in live."
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <StatCard label="Categories" value={stats.count} accent="default" />
        <StatCard label="Open for voting" value={stats.live} accent="emerald" />
        <StatCard
          label="Total votes"
          value={stats.totalVotes.toLocaleString("en-IN")}
          accent="gold"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <EmptyState
            title="No categories seeded"
            hint="Run `npm run seed:viewer-choice` in the backend to create the award categories, then refresh."
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const meta = META_BY_SLUG.get(c.slug);
            const title = meta?.label || c.question;
            return (
              <Link
                key={c.id}
                href={`/admin/choice/${c.id}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-[#0A1438]/85 p-5 shadow-[0_18px_44px_-26px_rgba(0,0,0,0.75)] transition hover:border-[#F68323]/40 hover:bg-[#0A1438]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-oswald text-xl font-extrabold uppercase italic leading-tight text-white">
                    {title}
                  </h2>
                  <Pill tone={c.status === "active" ? "emerald" : "default"}>
                    {c.status === "active" ? "Open" : c.status}
                  </Pill>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                      Nominees
                    </div>
                    <div className="mt-1 font-oswald text-2xl font-extrabold italic tabular-nums text-white">
                      {c.nominee_count}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                      Votes
                    </div>
                    <div className="mt-1 font-oswald text-2xl font-extrabold italic tabular-nums text-white">
                      {(c.total_votes || 0).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/10 pt-3 text-xs text-white/55">
                  {c.leading ? (
                    <>
                      Leading:{" "}
                      <span className="font-semibold text-[#F2A23A]">
                        {c.leading.label}
                      </span>{" "}
                      ({c.leading.votes})
                    </>
                  ) : c.nominee_count === 0 ? (
                    <span className="text-white/40">No nominees yet — add some →</span>
                  ) : (
                    <span className="text-white/40">No votes yet</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
