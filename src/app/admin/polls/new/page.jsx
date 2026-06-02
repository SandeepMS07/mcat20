"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPoll, listMatches } from "@/app/api/admin/polls";
import { SQUAD_API_PATH } from "@/app/api/admin/localPlayers";
import PollForm from "@/components/admin/PollForm";
import { Button, Card, PageHeader } from "@/components/admin/ui";

export default function NewPollPage() {
  const router = useRouter();
  const search = useSearchParams();
  const preselectMatch = search.get("matchId") || "";

  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listMatches()
      .then((res) => setMatches(res.matches || []))
      .catch(() => setMatches([]));
    fetch(SQUAD_API_PATH).then(r => r.json()).then(json => setPlayers(json?.players ?? [])).catch(() => setPlayers([]));
  }, []);

  const handleSubmit = async (body) => {
    setSubmitting(true);
    try {
      await createPoll(body);
      router.replace("/admin/polls?toast=Poll+created+successfully");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="New poll"
        title="Create a fan poll"
        subtitle="Attach the poll to a fixture so winner draws can include it, or leave it as a season-wide poll."
        actions={
          <Button as={Link} href="/admin/polls" variant="ghost" size="sm">
            ← All polls
          </Button>
        }
      />
      <div className="max-w-3xl">
        <Card title="Poll details">
          <PollForm
            mode="create"
            matches={matches}
            players={players}
            initial={preselectMatch ? { match_id: preselectMatch } : null}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </>
  );
}
