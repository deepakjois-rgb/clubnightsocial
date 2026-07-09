"use client";

import { useState } from "react";
import type { Player, MatchType } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { APP_CONSTANTS } from "@/constants/appConstants";
import { Badge, Button } from "@/components/ui";
import { getPlayerStateBadgeClass, getPlayerStateLabel } from "@/lib/labels";
import {
  getRequiredPlayerCount,
  buildMatchSides,
  getSidePlayerIds,
} from "@/lib/utils";
import type { CreateQueuedMatchPayload } from "@/services/matchService";

const M = MESSAGES;

type CreateMatchFormProps = {
  players: Player[];
  onSubmit: (payload: CreateQueuedMatchPayload) => void;
  onCancel: () => void;
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
    <div className="space-y-5">
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-foreground">
          {M.QUEUE_MATCH_TYPE}
        </legend>
        <div className="flex gap-2">
          {(["SINGLES", "DOUBLES"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleMatchTypeChange(type)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-[var(--radius)] border transition-colors duration-200 ${
                matchType === type
                  ? "bg-court-green text-white border-court-green"
                  : "bg-card text-foreground border-border hover:bg-surface"
              }`}
            >
              {type === "SINGLES" ? M.QUEUE_SINGLES : M.QUEUE_DOUBLES}
            </button>
          ))}
        </div>
      </fieldset>

      <p className="text-xs text-muted leading-relaxed">
        {M.QUEUE_SIDE_ASSIGNMENT_HELP}
      </p>

      {(sideA.length > 0 || sideB.length > 0) && (
        <div className="flex rounded-[var(--radius)] bg-shuttle-lime-muted/50 border border-border overflow-hidden text-sm">
          <div className="flex-1 p-3 space-y-1 text-center">
            {sideA.map((id) => (
              <p key={id} className="font-medium">
                {getPlayerName(id)}
              </p>
            ))}
          </div>
          <div className="w-px bg-border shrink-0" aria-hidden="true" />
          <div className="flex-1 p-3 space-y-1 text-center">
            {sideB.map((id) => (
              <p key={id} className="font-medium">
                {getPlayerName(id)}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">
          {M.QUEUE_PLAYER_SELECTION}
        </p>
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
                  className={`w-full flex items-center justify-between border rounded-[var(--radius-lg)] px-4 py-3 text-sm transition-all duration-200 ${
                    isSelected
                      ? "border-court-green bg-shuttle-lime-muted/40 shadow-sm"
                      : "border-border bg-card"
                  } ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"}`}
                  aria-pressed={isSelected}
                >
                  <span className="font-medium">{player.name}</span>
                  <Badge className={getPlayerStateBadgeClass(player.state)}>
                    {getPlayerStateLabel(player.state)}
                  </Badge>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {validationError && (
        <p role="alert" className="text-sm text-danger">
          {validationError}
        </p>
      )}

      <div className="flex gap-2">
        <Button variant="primary" fullWidth onClick={handleSubmit}>
          {M.QUEUE_ADD_TO_QUEUE}
        </Button>
        <Button variant="secondary" fullWidth onClick={onCancel}>
          {M.QUEUE_CANCEL}
        </Button>
      </div>
    </div>
  );
}
