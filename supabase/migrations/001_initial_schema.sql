-- Subway Runners Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  display_name TEXT,
  avatar_url TEXT
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- LEADERBOARD_BEST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.leaderboard_best (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_id UUID,
  username TEXT,
  best_score BIGINT NOT NULL DEFAULT 0,
  best_distance BIGINT NOT NULL DEFAULT 0,
  best_coins INT NOT NULL DEFAULT 0,
  run_version TEXT NOT NULL DEFAULT '1.0.0',
  platform TEXT,
  
  -- Either user_id OR guest_id must be present
  CONSTRAINT user_or_guest CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL)
);

-- Unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS leaderboard_best_user_id_idx 
  ON public.leaderboard_best (user_id) 
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS leaderboard_best_guest_id_idx 
  ON public.leaderboard_best (guest_id) 
  WHERE guest_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.leaderboard_best ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Leaderboard is viewable by everyone" 
  ON public.leaderboard_best FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert own scores" 
  ON public.leaderboard_best FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own scores" 
  ON public.leaderboard_best FOR UPDATE 
  USING (auth.uid() = user_id);

-- ============================================
-- SUBMIT BEST SCORE RPC FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.submit_best_score(
  p_user_id UUID DEFAULT NULL,
  p_guest_id UUID DEFAULT NULL,
  p_username TEXT DEFAULT NULL,
  p_score BIGINT DEFAULT 0,
  p_distance BIGINT DEFAULT 0,
  p_coins INT DEFAULT 0,
  p_run_version TEXT DEFAULT '1.0.0',
  p_platform TEXT DEFAULT 'web'
)
RETURNS JSON AS $$
DECLARE
  v_existing_id UUID;
  v_existing_score BIGINT;
  v_result JSON;
BEGIN
  -- Validate input
  IF p_score < 0 OR p_score > 999999999 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid score');
  END IF;
  
  IF p_distance < 0 OR p_distance > 999999999 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid distance');
  END IF;
  
  IF p_coins < 0 OR p_coins > 999999 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid coins');
  END IF;
  
  IF p_user_id IS NULL AND p_guest_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Must provide user_id or guest_id');
  END IF;

  -- Check for existing entry
  IF p_user_id IS NOT NULL THEN
    SELECT id, best_score INTO v_existing_id, v_existing_score
    FROM public.leaderboard_best
    WHERE user_id = p_user_id;
  ELSE
    SELECT id, best_score INTO v_existing_id, v_existing_score
    FROM public.leaderboard_best
    WHERE guest_id = p_guest_id;
  END IF;

  -- Insert or update
  IF v_existing_id IS NULL THEN
    -- Insert new entry
    INSERT INTO public.leaderboard_best (
      user_id, guest_id, username, best_score, best_distance, best_coins, run_version, platform
    ) VALUES (
      p_user_id, p_guest_id, p_username, p_score, p_distance, p_coins, p_run_version, p_platform
    );
    
    v_result := json_build_object('success', true, 'action', 'inserted', 'score', p_score);
  ELSIF p_score > v_existing_score THEN
    -- Update if new score is better
    UPDATE public.leaderboard_best
    SET 
      best_score = p_score,
      best_distance = p_distance,
      best_coins = p_coins,
      run_version = p_run_version,
      platform = p_platform,
      username = COALESCE(p_username, username),
      updated_at = NOW()
    WHERE id = v_existing_id;
    
    v_result := json_build_object('success', true, 'action', 'updated', 'score', p_score);
  ELSE
    -- Score not better, no update needed
    v_result := json_build_object('success', true, 'action', 'no_update', 'existing_score', v_existing_score);
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anonymous users (for guest scores)
GRANT EXECUTE ON FUNCTION public.submit_best_score TO anon;
GRANT EXECUTE ON FUNCTION public.submit_best_score TO authenticated;
