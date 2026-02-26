
-- Add billing_cycle column to quotes
ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS billing_cycle text DEFAULT 'monthly';

COMMENT ON COLUMN public.quotes.billing_cycle IS 'monthly or quarterly — determines Stripe billing interval';
