-- Add tracking_number and admin_notes columns to orders table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS tracking_number TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS admin_notes TEXT DEFAULT NULL;
