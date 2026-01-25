-- 1. Profiles Table (Enhanced)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  pin_hash TEXT, -- Storing hashed PIN
  owner_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'OWNER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Onboarding Sessions (Staging)
CREATE TABLE IF NOT EXISTS public.onboarding_sessions (
  phone TEXT PRIMARY KEY,
  step TEXT,
  last_otp TEXT,
  temp_pin_hash TEXT,
  owner_name TEXT,
  owner_email TEXT,
  is_agent BOOLEAN,
  relationship TEXT,
  kitchen_name TEXT,
  kitchen_description TEXT,
  kitchen_data JSONB, -- Stores address, lat, lng, etc.
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.onboarding_sessions ENABLE ROW LEVEL SECURITY;
-- For onboarding, we might need a looser policy or a server-side function if doing unauth updates
-- BUT since we are using "Mock Auth", the user IS authenticated as a temp user during onboarding.
CREATE POLICY "Users can manage their own onboarding session" ON public.onboarding_sessions
  USING (true) WITH CHECK (true); 
  -- NOTE: In production, verify phone matches auth.uid() metadata

-- 3. Kitchens Table (1:1 Constraint)
CREATE TABLE IF NOT EXISTS public.kitchens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE, -- 1 Kitchen per User
  name TEXT NOT NULL,
  description TEXT,
  banner_image_url TEXT,
  address TEXT,
  city TEXT,
  area TEXT,
  location_lat FLOAT,
  location_lng FLOAT,
  is_online BOOLEAN DEFAULT FALSE,
  rating FLOAT DEFAULT 5.0,
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.kitchens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kitchens viewable by everyone" ON public.kitchens FOR SELECT USING (true);
CREATE POLICY "Owners update own kitchen" ON public.kitchens FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners insert own kitchen" ON public.kitchens FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- 4. Menus
CREATE TABLE IF NOT EXISTS public.menus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kitchen_id UUID REFERENCES public.kitchens(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view menus" ON public.menus FOR SELECT USING (true);
CREATE POLICY "Owners manage menus" ON public.menus FOR ALL USING (
  EXISTS (SELECT 1 FROM public.kitchens WHERE id = menus.kitchen_id AND owner_id = auth.uid())
);

-- 5. Menu Items
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

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Owners manage items" ON public.menu_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.kitchens WHERE id = menu_items.kitchen_id AND owner_id = auth.uid())
);

-- 6. Storage Buckets (Execute via SQL requires pgnet or extension usually, but we define Policies here)
-- Assuming buckets 'kitchen_media' and 'avatars' are created in Dashboard.

-- Policies for Storage (Generic example for 'kitchen_media')
-- insert into storage.buckets (id, name, public) values ('kitchen_media', 'kitchen_media', true);

-- create policy "Public Access"
--   on storage.objects for select
--   using ( bucket_id = 'kitchen_media' );

-- create policy "Owners Upload"
--   on storage.objects for insert
--   with check ( bucket_id = 'kitchen_media' AND auth.role() = 'authenticated' );
