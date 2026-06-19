-- ═══════════════════════════════════════════════════════════════
-- SALES COPILOT — AUTH MIGRATION (individual login accounts)
-- Paste this into Supabase → SQL Editor → Run
--
-- Run this IN ADDITION to schema.sql (which you've already run).
-- This adds a `login` table that stores real per-person accounts
-- (name, email, hashed password) used for signing in. It is
-- separate from the `companies` / `analyses` / `outreach_saves`
-- tables, which continue to store the shared team workspace data —
-- every signed-in person reads/writes the same workspace data,
-- only the login credentials are individual.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS login (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Case-insensitive unique emails (so "A@x.com" and "a@x.com" can't both sign up)
CREATE UNIQUE INDEX IF NOT EXISTS idx_login_email_unique ON login (LOWER(email));

-- Defensive: enable RLS with no policies on this table. The backend always
-- uses the Supabase service-role key (which bypasses RLS), so this has no
-- effect on how the app works — it just blocks any accidental access to
-- this table if an anon/public key were ever used against it directly.
ALTER TABLE login ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════
-- DONE — re-run anytime, all statements are idempotent (IF NOT EXISTS).
--
-- Handy query to see who has signed up:
--   SELECT id, name, email, created_at, last_login_at FROM login ORDER BY created_at DESC;
-- ═══════════════════════════════════════════════════════════════
