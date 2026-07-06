# Club Night Social – Tasks (Phase 1: Vertical Slice)

## Goal
Build a minimal end-to-end working system:
Session → Players → Match → Completion → Stats update

No UI polish. No abstractions. No advanced features.

---

# Task 1 — Supabase Client Setup

## Objective
Connect Next.js app to Supabase.

## Requirements
- Create Supabase client in `src/lib/supabase.ts`
- Use environment variables:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY

## Done when:
- This is already done.

---

# Task 2 — Session Creation

## Objective
Allow organiser to create a session.

## Requirements
- Simple input field for organiser name + session name
- Create session in Supabase
- Store returned session_id in frontend state

## Done when:
- Session is created and visible in Supabase

---

# Task 3 — Add Players

## Objective
Add players to a session.

## Requirements
- Input field for player name
- Insert player into `players` table with session_id
- Default values:
  - games_played = 0
  - games_won = 0

## Done when:
- Players appear in Supabase under correct session

---

# Task 4 — Display Players List

## Objective
Show session players in UI.

## Requirements
- Fetch players by session_id
- Display:
  - name
  - games_played
  - games_won

## Done when:
- UI reflects Supabase player data

---

# Task 5 — Create Match

## Objective
Allow manual match creation.

## Requirements
- Select 4 players from WAITING pool
- Assign court number (manual input)
- Create match in Supabase:
  - team_a (2 players)
  - team_b (2 players)
  - status = ACTIVE

## Done when:
- Match appears in Supabase

---

# Task 6 — Complete Match

## Objective
Close match and update stats.

## Requirements
- Select winner (A or B)
- On completion:
  - mark match COMPLETED
  - increment games_played for all 4 players
  - increment games_won for winners only
  - update Supabase

## Done when:
- Player stats update correctly in DB

---

# Task 7 — Verify End-to-End Flow

## Objective
Validate full system works.

## Flow:
1. Create session
2. Add players
3. Create match
4. Complete match
5. Verify stats update in Supabase

## Done when:
- No manual DB edits needed
- Full loop works from UI

---

# STOP CONDITION

Do NOT proceed to:
- UI polish
- advanced layouts
- partner history
- court visuals
- realtime updates

Until this is fully working.
