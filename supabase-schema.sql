-- Bullet Studios: Script Scoring Prototype
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Create the scripts table
CREATE TABLE IF NOT EXISTS scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  file_url TEXT,
  genre TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'analyzing' CHECK (status IN ('analyzing', 'scored', 'deal_offered')),
  overall_score INTEGER,
  plot_score INTEGER,
  pacing_score INTEGER,
  hook_score INTEGER,
  characters_score INTEGER,
  dialogue_score INTEGER,
  binge_factor_score INTEGER,
  decision TEXT CHECK (decision IN ('rights_purchase', 'revenue_share', 'marketplace', 'feedback')),
  good_feedback JSONB DEFAULT '[]',
  improvement_feedback JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Users can view own scripts"
  ON scripts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scripts"
  ON scripts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scripts"
  ON scripts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view marketplace scripts"
  ON scripts FOR SELECT
  USING (decision = 'marketplace');

-- 4. Allow the scoring API to update scripts (uses anon key)
CREATE POLICY "Anon can update scripts for scoring"
  ON scripts FOR UPDATE
  USING (true);

-- IMPORTANT: For the Storage bucket, do this manually in the Supabase Dashboard:
--   1. Go to Storage in the left sidebar
--   2. Click "New Bucket"
--   3. Name it "scripts"
--   4. Check "Public bucket"
--   5. Click "Create bucket"
--   6. Go to the bucket's Policies tab and add:
--      - INSERT policy for "authenticated" role
--      - SELECT policy for all users (public read)
