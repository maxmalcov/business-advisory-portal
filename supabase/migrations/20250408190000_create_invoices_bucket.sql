
-- Create a storage bucket for invoices if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'invoices', 'Invoices', FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'invoices'
);

-- RLS policies for invoices bucket
-- Allow authenticated users to upload invoice files
CREATE POLICY "Allow authenticated users to upload invoices"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'invoices');

-- Allow authenticated users to read their own invoice files
CREATE POLICY "Allow authenticated users to read their own invoices"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'invoices' AND (storage.foldername(name))[1] = (auth.uid())::text);

-- Allow authenticated users to update their own invoice files
CREATE POLICY "Allow authenticated users to update their own invoices"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'invoices' AND (storage.foldername(name))[1] = (auth.uid())::text);

-- Allow authenticated users to delete their own invoice files
CREATE POLICY "Allow authenticated users to delete their own invoices"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'invoices' AND (storage.foldername(name))[1] = (auth.uid())::text);
