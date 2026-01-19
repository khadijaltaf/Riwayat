-- Conversation Table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1 TEXT NOT NULL, -- User's phone or ID
  participant_2 TEXT NOT NULL, -- Other user's phone or ID
  last_message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_phone TEXT NOT NULL,
  content TEXT, -- Text message
  image_url TEXT,
  audio_url TEXT,
  location_data JSONB, -- { lat, lng }
  metadata JSONB, -- For order snapshots, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Realtime
-- Note: You also need to enable this in the Supabase UI under Database -> Publications
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
