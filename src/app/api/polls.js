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

export const votePoll = async (slug, optionId) => {
  const voterKey = getVoterKey();
  const res = await turboverseAxios.post(
    `/v1/polls/${encodeURIComponent(slug)}/vote`,
    { optionId, voterKey }
  );
  return res.data;
};
