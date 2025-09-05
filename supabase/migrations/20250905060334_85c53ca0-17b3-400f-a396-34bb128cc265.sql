-- Create storage bucket for unit photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('UNITS', 'UNITS', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the UNITS bucket
CREATE POLICY "Allow public access to UNITS bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'UNITS');

CREATE POLICY "Allow authenticated uploads to UNITS bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'UNITS' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates to UNITS bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'UNITS' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated deletes from UNITS bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'UNITS' AND auth.role() = 'authenticated');