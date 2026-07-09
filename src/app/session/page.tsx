"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/constants/messages";
import { APP_CONSTANTS } from "@/constants/appConstants";
import { useSession } from "@/context/SessionContext";
import { Button, useToast } from "@/components/ui";
import {
  isActiveSession,
  isCompletedSession,
} from "@/services/sessionService";

const M = MESSAGES;
const AC = APP_CONSTANTS;

const inputClass =
  "w-full border border-border bg-card rounded-[var(--radius)] px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-court-green/30 focus:border-court-green transition-colors duration-200";

export default function SetupPage() {
  const router = useRouter();
  const { session, dispatch } = useSession();
  const { showToast } = useToast();

  useEffect(() => {
    if (isActiveSession(session)) {
      router.replace("/live");
      return;
    }

    if (isCompletedSession(session)) {
      router.replace("/summary");
    }
  }, [session, router]);

  const [organiserName, setOrganiserName] = useState("");
  const [courtCount, setCourtCount] = useState(3);
  const [players, setPlayers] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState("");
  const [duplicateError, setDuplicateError] = useState(false);
  const playerInputRef = useRef<HTMLInputElement>(null);

  if (session) {
    return null;
  }

  function addPlayer() {
    const name = playerInput.trim();
    if (!name) return;

    if (players.some((p) => p.toLowerCase() === name.toLowerCase())) {
      setDuplicateError(true);
      return;
    }

    setPlayers((prev) => [...prev, name]);
    setPlayerInput("");
    setDuplicateError(false);
    playerInputRef.current?.focus();
  }

  function removePlayer(index: number) {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  }

  function handlePlayerInputChange(value: string) {
    setPlayerInput(value);
    setDuplicateError(false);
  }

  function handlePlayerInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addPlayer();
    }
  }

  const canStart =
    organiserName.trim().length > 0 &&
    courtCount >= AC.MIN_COURTS &&
    courtCount <= AC.MAX_COURTS &&
    players.length >= AC.MIN_PLAYERS_TO_START;

  function handleStartSession() {
    dispatch({
      type: "START_SESSION",
      payload: {
        organiserName: organiserName.trim(),
        numberOfCourts: courtCount,
        players,
      },
    });
    showToast(M.TOAST_SESSION_STARTED);
    router.push("/live");
  }

  return (
    <>
      <main className="max-w-lg mx-auto px-4 py-6 pb-28 space-y-6">
        <h1 className="text-2xl font-bold text-court-green tracking-tight">
          {M.PAGE_TITLE}
        </h1>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            {M.ORGANISER_SECTION}
          </h2>
          <div className="space-y-1">
            <label htmlFor="organiser-name" className="block text-sm font-medium text-foreground">
              {M.ORGANISER_NAME_LABEL} <span aria-hidden="true">*</span>
            </label>
            <input
              id="organiser-name"
              type="text"
              required
              value={organiserName}
              maxLength={AC.MAX_ORGANISER_NAME_LENGTH}
              onChange={(e) => setOrganiserName(e.target.value)}
              className={inputClass}
              placeholder={M.ORGANISER_NAME_PLACEHOLDER}
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">{M.COURTS_SECTION}</h2>
          <div className="space-y-1">
            <label htmlFor="court-count" className="block text-sm font-medium text-foreground">
              {M.COURT_COUNT_LABEL}
            </label>
            <input
              id="court-count"
              type="number"
              min={AC.MIN_COURTS}
              max={AC.MAX_COURTS}
              value={courtCount}
              onChange={(e) =>
                setCourtCount(
                  Math.max(AC.MIN_COURTS, parseInt(e.target.value, 10) || AC.MIN_COURTS)
                )
              }
              className={`${inputClass} w-24`}
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">{M.PLAYERS_SECTION}</h2>
          <div className="space-y-1">
            <label htmlFor="player-name" className="block text-sm font-medium text-foreground">
              {M.PLAYER_NAME_LABEL}
            </label>
            <div className="flex gap-2">
              <input
                id="player-name"
                ref={playerInputRef}
                type="text"
                value={playerInput}
                maxLength={AC.MAX_PLAYER_NAME_LENGTH}
                onChange={(e) => handlePlayerInputChange(e.target.value)}
                onKeyDown={handlePlayerInputKeyDown}
                className={inputClass}
                placeholder={M.PLAYER_NAME_PLACEHOLDER}
                aria-describedby={duplicateError ? "player-error" : undefined}
              />
              <Button variant="secondary" onClick={addPlayer}>
                {M.ADD_PLAYER_BUTTON}
              </Button>
            </div>
            {duplicateError && (
              <p id="player-error" role="alert" className="text-sm text-danger">
                {M.DUPLICATE_PLAYER_ERROR}
              </p>
            )}
          </div>

          {players.length > 0 && (
            <ul className="space-y-2 pt-2" aria-label={M.PLAYER_LIST}>
              {players.map((name, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-card border border-border rounded-[var(--radius-lg)] px-4 py-3 text-sm shadow-[var(--shadow-card)]"
                >
                  <span className="font-medium">{name}</span>
                  <button
                    type="button"
                    onClick={() => removePlayer(index)}
                    className="text-danger text-sm font-medium hover:underline"
                    aria-label={`${M.REMOVE_PLAYER} ${name}`}
                  >
                    {M.REMOVE_PLAYER}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <div className="fixed bottom-0 inset-x-0 border-t border-border bg-card/95 backdrop-blur-sm px-4 py-4">
        <div className="max-w-lg mx-auto">
          <Button
            variant="primary"
            fullWidth
            disabled={!canStart}
            onClick={handleStartSession}
          >
            {M.START_SESSION_BUTTON}
          </Button>
        </div>
      </div>
    </>
  );
}
