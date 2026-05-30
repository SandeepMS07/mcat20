import turboverseAxios from "../turboverseAxios";

// Admin Viewers' Choice. Categories reuse the fan_poll tables (kind='viewer_choice');
// nominee curation reuses the existing poll option CRUD against the category's
// poll id — so we just add the summary list here and re-export the rest.

export const listChoice = async () => {
  const res = await turboverseAxios.get("/v1/admin/choice");
  return res.data;
};

export {
  getPoll,
  updatePoll,
  addOption,
  updateOption,
  deleteOption,
  listSquadPlayers,
  pollVoters,
} from "./polls";
