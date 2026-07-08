"use client";

import type { Match, Player } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { getSidePlayerIds } from "@/lib/utils";

const M = MESSAGES;

type CompletedMatchCardProps = {
  match: Match;
  players: Player[];
  onEditWinner: (matchId: string) => void;
};

function getMatchTypeLabel(type: Match["type"]): string {
  return type === "SINGLES"
    ? M.QUEUE_MATCH_TYPE_SINGLES
    : M.QUEUE_MATCH_TYPE_DOUBLES;
}

function getWinnerLabel(
  match: Match,
  players: Player[]
): string {
  if (!match.winner) return "—";

  if (match.type === "SINGLES") {
    const winnerId = getSidePlayerIds(match.matchSides, match.winner)[0];
    return winnerId
      ? players.find((p) => p.id === winnerId)?.name ?? match.winner
      : match.winner;
  }

  return match.winner === "A" ? M.LIVE_SIDE_1 : M.LIVE_SIDE_2;
}

export function CompletedMatchCard({
  match,
  players,
  onEditWinner,
}: CompletedMatchCardProps) {
  function getPlayerName(id: string): string {
    return players.find((p) => p.id === id)?.name ?? id;
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <p className="text-sm font-semibold">{getMatchTypeLabel(match.type)}</p>
      <div className="text-sm space-y-1">
        {getSidePlayerIds(match.matchSides, "A").map((id) => (
          <p key={id}>{getPlayerName(id)}</p>
        ))}
        <p className="text-gray-400 font-medium py-1">{M.QUEUE_VS}</p>
        {getSidePlayerIds(match.matchSides, "B").map((id) => (
          <p key={id}>{getPlayerName(id)}</p>
        ))}
      </div>
      <p className="text-sm">
        Winner: <span className="font-medium">{getWinnerLabel(match, players)}</span>
      </p>
      <button
        type="button"
        onClick={() => onEditWinner(match.id)}
        className="w-full py-3 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        {M.LIVE_EDIT_WINNER}
      </button>
    </div>
  );
}

type CompletedMatchListProps = {
  matches: Match[];
  players: Player[];
  onEditWinner: (matchId: string) => void;
};

export function CompletedMatchList({
  matches,
  players,
  onEditWinner,
}: CompletedMatchListProps) {
  if (matches.length === 0) {
    return <p className="text-sm text-gray-500">{M.LIVE_NO_COMPLETED_MATCHES}</p>;
  }

  return (
    <ul className="space-y-3">
      {matches.map((match) => (
        <li key={match.id}>
          <CompletedMatchCard
            match={match}
            players={players}
            onEditWinner={onEditWinner}
          />
        </li>
      ))}
    </ul>
  );
}
