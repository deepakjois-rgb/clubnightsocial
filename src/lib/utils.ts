export function getElapsedMinutes(startedAt: number): number {
  return Math.floor((Date.now() - startedAt) / 60_000);
}
