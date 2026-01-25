-- Consolidate Schema for Supabase Cloud (Final V5)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  pin_hash TEXT,
  owner_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'OWNER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles viewable" ON public.profiles;
CREATE POLICY "Public profiles viewable" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users manage own profile" ON public.profiles;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

-- 2. Onboarding Sessions (FORCE RECREATE TO SYNC SCHEMA)
DROP TABLE IF EXISTS public.onboarding_sessions;
CREATE TABLE public.onboarding_sessions (
  phone TEXT PRIMARY KEY,
  step TEXT,
  last_otp TEXT,
  temp_pin_hash TEXT,
  full_name TEXT,
  owner_email TEXT,
  is_agent BOOLEAN,
  relationship TEXT,
  kitchen_name TEXT,
  kitchen_tagline TEXT,
  kitchen_description TEXT,
  kitchen_banner_url TEXT,
  address TEXT,
  area TEXT,
  city TEXT,
  cnic_number TEXT,
  cnic_image_url TEXT,
  ntn_number TEXT,
  has_food_license BOOLEAN,
  application_status TEXT DEFAULT 'PENDING',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.onboarding_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public handle onboarding" ON public.onboarding_sessions;
CREATE POLICY "Public handle onboarding" ON public.onboarding_sessions FOR ALL USING (true) WITH CHECK (true);

-- 3. Kitchens Table
CREATE TABLE IF NOT EXISTS public.kitchens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  banner_image_url TEXT,
  address TEXT,
  city TEXT,
  area TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  rating FLOAT DEFAULT 5.0,
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  schedule JSONB,
  chef_bio TEXT,
  chef_journey TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.kitchens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public kitchens viewable" ON public.kitchens;
CREATE POLICY "Public kitchens viewable" ON public.kitchens FOR SELECT USING (true);
DROP POLICY IF EXISTS "Owners manage own kitchen" ON public.kitchens;
CREATE POLICY "Owners manage own kitchen" ON public.kitchens FOR ALL USING (auth.uid() = owner_id);

-- 4. Menus & Items
CREATE TABLE IF NOT EXISTS public.menus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kitchen_id UUID REFERENCES public.kitchens(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_id UUID REFERENCES public.menus(id) ON DELETE CASCADE NOT NULL,
  kitchen_id UUID REFERENCES public.kitchens(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Updated At Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_kitchens_updated_at ON public.kitchens;
CREATE TRIGGER set_kitchens_updated_at BEFORE UPDATE ON public.kitchens FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_onboarding_updated_at ON public.onboarding_sessions;
CREATE TRIGGER set_onboarding_updated_at BEFORE UPDATE ON public.onboarding_sessions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
