-- Feedbacks Table
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kitchen_id UUID, -- If applicable
  order_id TEXT, -- REF: 515221
  customer_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[], -- Array of S3/Supabase URLs
  status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, DISPUTED
  reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Disputes Table
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedback_id UUID REFERENCES feedbacks(id) ON DELETE CASCADE,
  reason TEXT,
  explanation TEXT,
  status TEXT DEFAULT 'OPEN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Compensations Table
CREATE TABLE IF NOT EXISTS compensations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedback_id UUID REFERENCES feedbacks(id) ON DELETE CASCADE,
  type TEXT, -- DISCOUNT, REFUND, etc.
  amount DECIMAL,
  reason TEXT,
  status TEXT DEFAULT 'PROPOSED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Time Extensions Table
CREATE TABLE IF NOT EXISTS time_extensions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedback_id UUID REFERENCES feedbacks(id) ON DELETE CASCADE,
  extra_time TEXT, -- e.g. "30 mins", "1 hour"
  reason TEXT,
  status TEXT DEFAULT 'REQUESTED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE feedbacks;
