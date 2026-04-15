import { notFound } from "next/navigation";
import { PLAYER_REGISTRATION_SHARE_KEY } from "@/constant";
import PlayerRegistrationClient from "./PlayerRegistrationClient";

export default async function PlayerRegistrationSharePage({ params }) {
  const { shareKey } = await params;

  if (shareKey !== PLAYER_REGISTRATION_SHARE_KEY) {
    notFound();
  }

  return <PlayerRegistrationClient />;
}
