
-- Add address sub-fields and consent columns to clients
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS street_name text,
  ADD COLUMN IF NOT EXISTS street_number text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS mailing_consent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS data_processing_consent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS referral_source text;

-- Add same fields to leads table
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS street_name text,
  ADD COLUMN IF NOT EXISTS street_number text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS mailing_consent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS data_processing_consent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS referral_source text,
  ADD COLUMN IF NOT EXISTS garden_size text,
  ADD COLUMN IF NOT EXISTS dog_count int,
  ADD COLUMN IF NOT EXISTS service_frequency text;
