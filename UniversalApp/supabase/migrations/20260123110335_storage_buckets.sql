
-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('kitchen_media', 'kitchen_media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for 'kitchen_media'
CREATE POLICY "Public Access to kitchen_media"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'kitchen_media' );

CREATE POLICY "Authenticated users can upload to kitchen_media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'kitchen_media' );

CREATE POLICY "Users can update their own kitchen_media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING ( bucket_id = 'kitchen_media' AND (auth.uid() = owner) );

CREATE POLICY "Users can delete their own kitchen_media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING ( bucket_id = 'kitchen_media' AND (auth.uid() = owner) );

-- 3. Storage Policies for 'avatars'
CREATE POLICY "Public Access to avatars"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Authenticated users can upload to avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING ( bucket_id = 'avatars' AND (auth.uid() = owner) );
