-- Update prebook_requests table to support new popup form fields
-- Add first_name, last_name, product_slug, and status columns

-- Add new columns
ALTER TABLE prebook_requests
ADD COLUMN IF NOT EXISTS first_name TEXT;

ALTER TABLE prebook_requests
ADD COLUMN IF NOT EXISTS last_name TEXT;

ALTER TABLE prebook_requests
ADD COLUMN IF NOT EXISTS product_slug TEXT;

ALTER TABLE prebook_requests
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

-- Update existing name column to be nullable (for backward compatibility)
ALTER TABLE prebook_requests ALTER COLUMN name DROP NOT NULL;

-- Create index on product_slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_prebook_product_slug ON prebook_requests (product_slug);