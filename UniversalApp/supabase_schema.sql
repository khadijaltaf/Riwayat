-- Create the onboarding_sessions table
create table public.onboarding_sessions (
  id uuid default gen_random_uuid() primary key,
  phone text unique not null,
  last_otp text,
  password_hash text,
  
  -- Owner Details
  owner_name text,
  owner_email text,
  is_agent boolean default false,
  relationship text,
  
  -- Kitchen Details
  kitchen_name text,
  kitchen_tagline text,
  
  -- Location
  address text,
  city text,
  area text,
  map_link text,
  
  -- ID Verification
  cnic_number text,
  cnic_image_url text, -- Storage path or public URL
  ntn_number text,
  has_food_license boolean,
  
  -- Metadata
  registration_complete boolean default false,
  application_status text default 'DRAFT', -- DRAFT, SUBMITTED, APPROVED, REJECTED
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.onboarding_sessions enable row level security;

-- Create a policy that allows anyone to insert/update based on phone (for demo purposes)
-- In production, you would use Supabase Auth and strictly limit this.
create policy "Allow public access for onboarding"
on public.onboarding_sessions
for all
using (true)
with check (true);
