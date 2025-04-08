
-- Create a storage bucket for employee documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'employee_documents', 'Employee Documents', FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'employee_documents'
);

-- RLS policies for employee_documents bucket
-- Allow authenticated users to upload documents
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'employee_documents');

-- Allow authenticated users to read their own documents
CREATE POLICY "Allow authenticated users to read documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'employee_documents');
