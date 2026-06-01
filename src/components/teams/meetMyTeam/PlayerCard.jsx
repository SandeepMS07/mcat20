"use client";

import React from "react";
import "./style.css";

const splitSecondaryName = (restName = "") => {
  const parts = restName.split(" ").filter(Boolean);
  if (parts.length <= 1) return { outlined: "", solid: restName, isSingleWord: true };
  return {
    outlined: parts.slice(0, -1).join(" "),
    solid: parts[parts.length - 1],
    isSingleWord: false,
  };
};

const PlayerCard = ({
  player,
  voteState,
  onVoteClick,
  votePercent = 0,
  showProgress = false,
  isSelected = false,
}) => {
  const { outlined, solid, isSingleWord } = splitSecondaryName(player.restName);
  const pct = Math.max(0, Math.min(100, Math.round(votePercent)));

  return (
    <div className={`mtt-card ${isSelected ? "mtt-card-selected" : ""}`}>
      <div className="mtt-card-gradient" aria-hidden />
      <div className="mtt-card-stripes" aria-hidden />

      {player.img ? (
        <img
          src={player.img}
          alt={player.name}
          className="mtt-card-photo"
          loading="lazy"
        />
      ) : (
        <div className="mtt-card-photo-fallback">
          <span>{player.firstName?.charAt(0)}</span>
        </div>
      )}

      {voteState === "button" && (
        <button
          type="button"
          onClick={onVoteClick}
          className="mtt-card-vote-btn"
          aria-label={`Vote for ${player.name}`}
        >
          Vote Now
        </button>
      )}

      {voteState === "progress" && showProgress && (
        <div className="mtt-card-progress" aria-hidden={false}>
          <div className="mtt-card-progress-track">
            <div
              className="mtt-card-progress-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="mtt-card-progress-pct">{pct}%</span>
        </div>
      )}

      <div className="mtt-card-name">
        <span className="mtt-firstname">{player.firstName?.toUpperCase()}</span>
        {player.restName ? (
          <span className="mtt-restname">
            {outlined ? <span className="mtt-restname-outline">{outlined}</span> : null}
            {solid ? (
              <span
                className={
                  isSingleWord
                    ? "mtt-restname-outline mtt-restname-single"
                    : "mtt-restname-solid"
                }
              >
                {solid}
              </span>
            ) : null}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default PlayerCard;
