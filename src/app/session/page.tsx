"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/constants/messages";
import { APP_CONSTANTS } from "@/constants/appConstants";
import { useSession } from "@/context/SessionContext";
import {
  isActiveSession,
  isCompletedSession,
} from "@/services/sessionService";

const M = MESSAGES;
const AC = APP_CONSTANTS;

export default function SetupPage() {
  const router = useRouter();
  const { session, dispatch } = useSession();

  useEffect(() => {
    if (isActiveSession(session)) {
      router.replace("/live");
      return;
    }

    if (isCompletedSession(session)) {
      router.replace("/sessionsummary");
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
    router.push("/live");
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold">{M.PAGE_TITLE}</h1>

      {/* Organiser */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">{M.ORGANISER_SECTION}</h2>
        <div className="space-y-1">
          <label htmlFor="organiser-name" className="block text-sm font-medium">
            {M.ORGANISER_NAME_LABEL} <span aria-hidden="true">*</span>
          </label>
          <input
            id="organiser-name"
            type="text"
            required
            value={organiserName}
            maxLength={AC.MAX_ORGANISER_NAME_LENGTH}
            onChange={(e) => setOrganiserName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder={M.ORGANISER_NAME_PLACEHOLDER}
          />
        </div>
      </section>

      {/* Courts */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">{M.COURTS_SECTION}</h2>
        <div className="space-y-1">
          <label htmlFor="court-count" className="block text-sm font-medium">
            {M.COURT_COUNT_LABEL}
          </label>
          <input
            id="court-count"
            type="number"
            min={AC.MIN_COURTS}
            max={AC.MAX_COURTS}
            value={courtCount}
            onChange={(e) =>
              setCourtCount(Math.max(AC.MIN_COURTS, parseInt(e.target.value, 10) || AC.MIN_COURTS))
            }
            className="w-24 border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
      </section>

      {/* Players */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">{M.PLAYERS_SECTION}</h2>
        <div className="space-y-1">
          <label htmlFor="player-name" className="block text-sm font-medium">
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
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder={M.PLAYER_NAME_PLACEHOLDER}
              aria-describedby={duplicateError ? "player-error" : undefined}
            />
            <button
              type="button"
              onClick={addPlayer}
              className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
            >
              {M.ADD_PLAYER_BUTTON}
            </button>
          </div>
          {duplicateError && (
            <p id="player-error" role="alert" className="text-sm text-red-600">
              {M.DUPLICATE_PLAYER_ERROR}
            </p>
          )}
        </div>

        {players.length > 0 && (
          <ul className="space-y-1 pt-2" aria-label={M.PLAYER_LIST}>
            {players.map((name, index) => (
              <li
                key={index}
                className="flex items-center justify-between border border-gray-200 rounded px-3 py-2 text-sm"
              >
                <span>{name}</span>
                <button
                  type="button"
                  onClick={() => removePlayer(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                  aria-label={`${M.REMOVE_PLAYER} ${name}`}
                >
                  {M.REMOVE_PLAYER}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Session Summary */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">{M.SUMMARY_SECTION}</h2>
        <dl className="space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="font-medium w-24">{M.SUMMARY_ORGANISER}</dt>
            <dd>{organiserName.trim() || <span className="text-gray-400">—</span>}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium w-24">{M.SUMMARY_COURTS}</dt>
            <dd>{courtCount}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium w-24">{M.SUMMARY_PLAYERS}</dt>
            <dd>{players.length}</dd>
          </div>
        </dl>
      </section>

      {/* Start Session */}
      <button
        type="button"
        disabled={!canStart}
        onClick={handleStartSession}
        className="w-full py-3 bg-gray-900 text-white font-semibold rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700"
      >
        {M.START_SESSION_BUTTON}
      </button>
    </main>
  );
}
