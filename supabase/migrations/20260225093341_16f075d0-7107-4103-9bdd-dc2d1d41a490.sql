
-- Migration: pricing_rules, quotes, service_logs, financials tables + new columns on clients/interventions

-- 1. pricing_rules table
CREATE TABLE IF NOT EXISTS pricing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  garden_size text NOT NULL,
  dog_count_min int NOT NULL,
  dog_count_max int NOT NULL,
  frequency text NOT NULL,
  base_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage pricing" ON pricing_rules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read pricing" ON pricing_rules FOR SELECT TO anon USING (true);

INSERT INTO pricing_rules (garden_size, dog_count_min, dog_count_max, frequency, base_price) VALUES
  ('small',  1, 2,  'weekly',   35.00), ('small',  3, 99, 'weekly',   45.00),
  ('medium', 1, 2,  'weekly',   45.00), ('medium', 3, 99, 'weekly',   55.00),
  ('large',  1, 2,  'weekly',   55.00), ('large',  3, 99, 'weekly',   70.00),
  ('xl',     1, 2,  'weekly',   70.00), ('xl',     3, 99, 'weekly',   85.00),
  ('small',  1, 2,  'biweekly', 45.00), ('small',  3, 99, 'biweekly', 55.00),
  ('medium', 1, 2,  'biweekly', 55.00), ('medium', 3, 99, 'biweekly', 65.00),
  ('large',  1, 2,  'biweekly', 65.00), ('large',  3, 99, 'biweekly', 80.00),
  ('xl',     1, 2,  'biweekly', 80.00), ('xl',     3, 99, 'biweekly', 95.00),
  ('small',  1, 2,  'monthly',  55.00), ('small',  3, 99, 'monthly',  65.00),
  ('medium', 1, 2,  'monthly',  65.00), ('medium', 3, 99, 'monthly',  75.00),
  ('large',  1, 2,  'monthly',  75.00), ('large',  3, 99, 'monthly',  90.00),
  ('xl',     1, 2,  'monthly',  90.00), ('xl',     3, 99, 'monthly', 110.00),
  ('small',  1, 2,  'onetime',  65.00), ('small',  3, 99, 'onetime',  80.00),
  ('medium', 1, 2,  'onetime',  80.00), ('medium', 3, 99, 'onetime',  95.00),
  ('large',  1, 2,  'onetime',  95.00), ('large',  3, 99, 'onetime', 115.00),
  ('xl',     1, 2,  'onetime', 115.00), ('xl',     3, 99, 'onetime', 140.00);

-- 2. quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'draft',
  garden_size text NOT NULL,
  dog_count int NOT NULL,
  frequency text NOT NULL,
  base_price numeric(10,2) NOT NULL,
  line_items jsonb DEFAULT '[]',
  total_price numeric(10,2) NOT NULL,
  admin_notes text,
  terms_text text,
  accepted_at timestamptz,
  accepted_by_name text,
  preferred_day text,
  token uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  stripe_checkout_session_id text,
  stripe_customer_id text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage quotes" ON quotes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read quote by token" ON quotes FOR SELECT TO anon USING (true);
CREATE POLICY "Public can accept quote" ON quotes FOR UPDATE TO anon
  USING (status = 'sent') WITH CHECK (status IN ('accepted', 'declined'));

-- 3. service_logs table
CREATE TABLE IF NOT EXISTS service_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES interventions(id) ON DELETE CASCADE NOT NULL,
  photo_url text,
  completion_timestamp timestamptz DEFAULT now(),
  gate_closed_verified boolean DEFAULT false,
  tech_name text,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE service_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage service_logs" ON service_logs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients view own service_logs" ON service_logs FOR SELECT TO authenticated
  USING (
    job_id IN (
      SELECT id FROM interventions WHERE client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
      )
    )
  );

-- 4. financials table
CREATE TABLE IF NOT EXISTS financials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  stripe_event_id text UNIQUE,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'eur',
  type text NOT NULL,
  stripe_invoice_id text,
  stripe_subscription_id text,
  description text,
  paid_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE financials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage financials" ON financials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. New columns on clients
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS lat numeric(10,7),
  ADD COLUMN IF NOT EXISTS lng numeric(10,7),
  ADD COLUMN IF NOT EXISTS preferred_day text,
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS paused_until date;

-- 6. New columns on interventions
ALTER TABLE interventions
  ADD COLUMN IF NOT EXISTS job_started_at timestamptz;
