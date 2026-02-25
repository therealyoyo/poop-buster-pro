
-- 1. Add missing columns to clients
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS gate_entry_type text DEFAULT 'side_gate',
  ADD COLUMN IF NOT EXISTS gate_special_instructions text,
  ADD COLUMN IF NOT EXISTS dog_details jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT true;

-- 2. Add missing columns to interventions
ALTER TABLE interventions
  ADD COLUMN IF NOT EXISTS tech_name text,
  ADD COLUMN IF NOT EXISTS sms_sent_arrival boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS sms_sent_completion boolean DEFAULT false;

-- 3. Create service_photos table
CREATE TABLE IF NOT EXISTS service_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_id uuid REFERENCES interventions(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE service_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own photos" ON service_photos
  FOR SELECT USING (
    intervention_id IN (
      SELECT id FROM interventions WHERE client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins manage service_photos" ON service_photos
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4. Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  phone text,
  first_name text,
  last_name text,
  address text,
  gate_entry_type text,
  gate_special_instructions text,
  dog_details jsonb DEFAULT '[]',
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage leads" ON leads
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit lead" ON leads
  FOR INSERT WITH CHECK (status = 'new');
