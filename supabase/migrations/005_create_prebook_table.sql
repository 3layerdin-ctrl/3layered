-- Create prebook_requests table for storing product prebook submissions
-- This table stores user interest in prebook-only products

CREATE TABLE IF NOT EXISTS prebook_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),

-- Prevent duplicate prebook requests from same email for same product
CONSTRAINT unique_email_product UNIQUE (email, product_id) );

-- Create index for faster lookups by product
CREATE INDEX idx_prebook_product_id ON prebook_requests (product_id);

-- Create index for faster lookups by email
CREATE INDEX idx_prebook_email ON prebook_requests (email);

-- Enable Row Level Security
ALTER TABLE prebook_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (submit prebook request)
CREATE POLICY "Allow public prebook submissions" ON prebook_requests FOR
INSERT
    TO public
WITH
    CHECK (true);

-- Policy: Only authenticated users can view prebook requests (for admin panel)
CREATE POLICY "Allow authenticated users to view prebook requests" ON prebook_requests FOR
SELECT TO authenticated USING (true);

-- Policy: Only authenticated users can delete prebook requests (for admin panel)
CREATE POLICY "Allow authenticated users to delete prebook requests" ON prebook_requests FOR DELETE TO authenticated USING (true);