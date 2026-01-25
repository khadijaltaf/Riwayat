-- 1. Ensure onboarding_sessions has correct structure for OTP and Step tracking
ALTER TABLE public.onboarding_sessions 
ADD COLUMN IF NOT EXISTS current_step_index INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS application_status TEXT DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS kitchen_banner_url TEXT,
ADD COLUMN IF NOT EXISTS kitchen_tagline TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS area TEXT,
ADD COLUMN IF NOT EXISTS cnic_number TEXT,
ADD COLUMN IF NOT EXISTS cnic_image_url TEXT,
ADD COLUMN IF NOT EXISTS ntn_number TEXT,
ADD COLUMN IF NOT EXISTS has_food_license BOOLEAN,
ADD COLUMN IF NOT EXISTS full_name TEXT; -- Used in some screens

-- 2. Refine RLS for Profiles (Allow upsert for the user themselves)
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles 
FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles 
FOR UPDATE USING (auth.uid() = id);

-- 3. Refine RLS for Kitchens (Allow upsert)
DROP POLICY IF EXISTS "Owners insert own kitchen" ON public.kitchens;
CREATE POLICY "Owners insert own kitchen" ON public.kitchens 
FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners update own kitchen" ON public.kitchens;
CREATE POLICY "Owners update own kitchen" ON public.kitchens 
FOR UPDATE USING (auth.uid() = owner_id);

-- 4. Set "Allow All" for onboarding sessions (Development ease)
-- In production, this should be restricted by phone/auth
DROP POLICY IF EXISTS "Users can manage their own onboarding session" ON public.onboarding_sessions;
CREATE POLICY "Users can manage their own onboarding session" ON public.onboarding_sessions
FOR ALL USING (true) WITH CHECK (true);

-- 5. Add Trigger for updated_at (Standard Practice)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_kitchens_updated_at ON public.kitchens;
CREATE TRIGGER set_kitchens_updated_at BEFORE UPDATE ON public.kitchens
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_onboarding_updated_at ON public.onboarding_sessions;
CREATE TRIGGER set_onboarding_updated_at BEFORE UPDATE ON public.onboarding_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
