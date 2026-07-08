"use client";

import { useState } from "react";
import type { Player, MatchType } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { APP_CONSTANTS } from "@/constants/appConstants";
import { getRequiredPlayerCount, buildMatchSides, getSidePlayerIds } from "@/lib/utils";
import type { CreateQueuedMatchPayload } from "@/services/matchService";

const M = MESSAGES;

type CreateMatchFormProps = {
  players: Player[];
  onSubmit: (payload: CreateQueuedMatchPayload) => void;
  onCancel: () => void;
};

const STATE_BADGE_STYLES: Record<Player["state"], string> = {
  WAITING: "bg-yellow-100 text-yellow-800",
  PLAYING: "bg-green-100 text-green-800",
  UNAVAILABLE: "bg-gray-100 text-gray-600",
};

function getPlayerCountForType(type: MatchType): number {
  return type === "SINGLES"
    ? APP_CONSTANTS.SINGLES_PLAYER_COUNT
    : APP_CONSTANTS.DOUBLES_PLAYER_COUNT;
}

export function CreateMatchForm({
  players,
  onSubmit,
  onCancel,
}: CreateMatchFormProps) {
  const [matchType, setMatchType] = useState<MatchType>("DOUBLES");
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const requiredCount = getPlayerCountForType(matchType);
  const previewSides = buildMatchSides(selectedPlayerIds, matchType);
  const sideA = getSidePlayerIds(previewSides, "A");
  const sideB = getSidePlayerIds(previewSides, "B");

  function getPlayerName(id: string): string {
    return players.find((p) => p.id === id)?.name ?? id;
  }

  function handleMatchTypeChange(type: MatchType) {
    setMatchType(type);
    setSelectedPlayerIds([]);
    setValidationError(null);
  }

  function togglePlayer(playerId: string) {
    setValidationError(null);

    if (selectedPlayerIds.includes(playerId)) {
      setSelectedPlayerIds((prev) => prev.filter((id) => id !== playerId));
      return;
    }

    const maxCount = getRequiredPlayerCount(matchType);
    if (selectedPlayerIds.length >= maxCount) return;

    setSelectedPlayerIds((prev) => [...prev, playerId]);
  }

  function handleSubmit() {
    const uniqueIds = new Set(selectedPlayerIds);
    if (uniqueIds.size !== selectedPlayerIds.length) {
      setValidationError(M.QUEUE_DUPLICATE_PLAYER);
      return;
    }

    if (selectedPlayerIds.length !== requiredCount) {
      setValidationError(M.QUEUE_INVALID_PLAYER_COUNT);
      return;
    }

    onSubmit({
      type: matchType,
      matchSides: buildMatchSides(selectedPlayerIds, matchType),
    });
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Match type */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">{M.QUEUE_MATCH_TYPE}</legend>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="match-type"
              value="SINGLES"
              checked={matchType === "SINGLES"}
              onChange={() => handleMatchTypeChange("SINGLES")}
            />
            {M.QUEUE_SINGLES}
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="match-type"
              value="DOUBLES"
              checked={matchType === "DOUBLES"}
              onChange={() => handleMatchTypeChange("DOUBLES")}
            />
            {M.QUEUE_DOUBLES}
          </label>
        </div>
      </fieldset>

      {/* Side preview */}
      {(sideA.length > 0 || sideB.length > 0) && (
        <div className="text-sm space-y-2 bg-gray-50 rounded-lg p-3">
          {sideA.map((id) => (
            <p key={id}>{getPlayerName(id)}</p>
          ))}
          {sideA.length > 0 && sideB.length > 0 && (
            <p className="text-gray-400 font-medium">{M.QUEUE_VS}</p>
          )}
          {sideB.map((id) => (
            <p key={id}>{getPlayerName(id)}</p>
          ))}
        </div>
      )}

      {/* Player selection */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">{M.QUEUE_PLAYER_SELECTION}</p>
        <ul className="space-y-2">
          {players.map((player) => {
            const isSelected = selectedPlayerIds.includes(player.id);
            const isDisabled =
              !isSelected && selectedPlayerIds.length >= requiredCount;

            return (
              <li key={player.id}>
                <button
                  type="button"
                  onClick={() => togglePlayer(player.id)}
                  disabled={isDisabled}
                  className={`w-full flex items-center justify-between border rounded-lg px-4 py-3 text-sm transition-colors ${
                    isSelected
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200"
                  } ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                  aria-pressed={isSelected}
                >
                  <span className="font-medium">{player.name}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${STATE_BADGE_STYLES[player.state]}`}
                  >
                    {player.state}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {validationError && (
        <p role="alert" className="text-sm text-red-600">
          {validationError}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700"
        >
          {M.QUEUE_ADD_TO_QUEUE}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-gray-300 font-semibold rounded-lg hover:bg-gray-50"
        >
          {M.QUEUE_CANCEL}
        </button>
      </div>
    </div>
  );
}
