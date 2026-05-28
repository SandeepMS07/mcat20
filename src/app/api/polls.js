import turboverseAxios from "./turboverseAxios";

const VOTER_KEY_STORAGE = "mca_voter_key";

export const clearVoterKey = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(VOTER_KEY_STORAGE);
  } catch {
    /* ignore */
  }
};

export const getVoterKey = () => {
  if (typeof window === "undefined") return null;
  try {
    let k = window.localStorage.getItem(VOTER_KEY_STORAGE);
    if (!k) {
      k =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      window.localStorage.setItem(VOTER_KEY_STORAGE, k);
    }
    return k;
  } catch {
    return null;
  }
};

export const listPolls = async () => {
  const voterKey = getVoterKey();
  const res = await turboverseAxios.get("/v1/polls", {
    params: voterKey ? { voterKey } : undefined,
  });
  return res.data;
};

export const getPoll = async (slug) => {
  const voterKey = getVoterKey();
  const res = await turboverseAxios.get(`/v1/polls/${encodeURIComponent(slug)}`, {
    params: voterKey ? { voterKey } : undefined,
  });
  return res.data;
};

// Voting always requires an authenticated user (axios attaches the JWT).
// The voterKey is still passed in the body for backwards compatibility with
// older builds, but the backend ignores it for new votes.
export const votePoll = async (slug, optionId) => {
  const body = { optionId };
  const voterKey = getVoterKey();
  if (voterKey) body.voterKey = voterKey;
  const res = await turboverseAxios.post(
    `/v1/polls/${encodeURIComponent(slug)}/vote`,
    body,
  );
  return res.data;
};

// Viewers' Choice categories reuse the fan_poll infra: each category is a poll
// with slug `vc-<category-slug>` (see backend seed-viewer-choice.ts). These thin
// wrappers map a category slug (from app/choice/categories.js) onto that poll,
// so the public Choice page gets real options + tallies + my_selection.
export const getChoicePoll = (categorySlug) => getPoll(`vc-${categorySlug}`);
export const voteChoice = (categorySlug, optionId) =>
  votePoll(`vc-${categorySlug}`, optionId);

// Fetches polls attached to a specific match plus the winner banner payload.
// Shape: { polls: [...], winner: { firstName, fullName } | null }
// Passes voterKey when present so the backend can claim any pre-login anon
// votes from this device for the now-signed-in user.
export const listMatchPolls = async (matchId) => {
  const voterKey = getVoterKey();
  const res = await turboverseAxios.get(
    `/v1/polls/match/${encodeURIComponent(matchId)}`,
    { params: voterKey ? { voterKey } : undefined },
  );
  return res.data;
};

// Public payload used by the TV-screen reveal animation.
// Shape: { participants: string[], winner: { name } | null }
export const getRevealPayload = async (matchId) => {
  const res = await turboverseAxios.get(
    `/v1/polls/reveal/${encodeURIComponent(matchId)}`,
  );
  return res.data;
};

// Public matches list — used by the fan-poll page to identify which match's
// polls to render at the top of the page.
export const listMatches = async () => {
  const res = await turboverseAxios.get("/v1/matches");
  return res.data;
};
