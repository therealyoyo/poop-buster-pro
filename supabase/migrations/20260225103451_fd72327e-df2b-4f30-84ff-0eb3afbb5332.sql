
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS gate_location text,
  ADD COLUMN IF NOT EXISTS gate_location_other text,
  ADD COLUMN IF NOT EXISTS dog_names jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS payment_intent text,
  ADD COLUMN IF NOT EXISTS payment_question text,
  ADD COLUMN IF NOT EXISTS additional_comments text,
  ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS quarterly_billing boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS promo_code text;

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS gate_location text,
  ADD COLUMN IF NOT EXISTS gate_location_other text,
  ADD COLUMN IF NOT EXISTS dog_names jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS payment_intent text,
  ADD COLUMN IF NOT EXISTS payment_question text,
  ADD COLUMN IF NOT EXISTS additional_comments text,
  ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS quarterly_billing boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS promo_code text;
