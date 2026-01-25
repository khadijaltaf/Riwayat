-- Create a table for public profiles (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  phone text unique,
  owner_name text,
  email text,
  role text default 'OWNER', -- OWNER, AGENT, CUSTOMER
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Create a table for kitchens (linked to profiles)
create table public.kitchens (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  address text,
  city text,
  area text,
  location_lat float,
  location_lng float,
  is_online boolean default false,
  rating float default 5.0,
  total_orders int default 0,
  total_sales float default 0.0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for kitchens
alter table public.kitchens enable row level security;

create policy "Kitchens are viewable by everyone."
  on public.kitchens for select
  using ( true );

create policy "Users can insert their own kitchen."
  on public.kitchens for insert
  with check ( auth.uid() = owner_id );

create policy "Users can update own kitchen."
  on public.kitchens for update
  using ( auth.uid() = owner_id );

-- Function to handle new user signup (auto-create profile if needed, though we do it manually in flow)
-- For now, we manually handle profile creation after OTP verification
