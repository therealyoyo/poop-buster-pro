
-- ============================================
-- LOT 1 — Migrations DB complètes
-- ============================================

-- Table clients (enrichissement CRM)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS form_part2_completed boolean DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS is_duplicate boolean DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS newsletter_sub boolean DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS inactivated_at timestamptz;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS winback_sent_at timestamptz;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS lead_source text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS follow_up_date date;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_interaction_at timestamptz;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS out_of_zone boolean DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES clients(id);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS assigned_technician_id uuid;

-- Table quotes
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS pdf_url text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS followup_sent_at timestamptz;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS valid_until date;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS agreement_type text DEFAULT 'recurring';
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS price_per_visit numeric;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS quarterly_price numeric;

-- Table messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS email_sent_at timestamptz;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_at timestamptz;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_user_id uuid;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_name text;

-- Table interventions
ALTER TABLE interventions ADD COLUMN IF NOT EXISTS client_notified_at timestamptz;
ALTER TABLE interventions ADD COLUMN IF NOT EXISTS portal_visible boolean DEFAULT true;

-- ============================================
-- Nouvelles tables
-- ============================================

-- Logs emails
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  email_type text NOT NULL,
  subject text,
  sent_at timestamptz DEFAULT now(),
  status text DEFAULT 'sent',
  error_message text
);
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage email_logs" ON email_logs FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Templates emails
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text UNIQUE NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage email_templates" ON email_templates FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Feedback
CREATE TABLE IF NOT EXISTS feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  rating integer,
  comment text,
  feedback_type text DEFAULT 'general',
  intervention_id uuid REFERENCES interventions(id),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage feedback" ON feedback FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Clients can submit feedback" ON feedback FOR INSERT
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));
CREATE POLICY "Clients can view own feedback" ON feedback FOR SELECT
  USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));

-- Codes promo
CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL,
  discount_value numeric NOT NULL,
  max_uses integer,
  used_count integer DEFAULT 0,
  valid_until date,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage promo_codes" ON promo_codes FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Public read active promo_codes" ON promo_codes FOR SELECT
  USING (active = true);

-- Accords / Contrats
CREATE TABLE IF NOT EXISTS agreements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  quote_id uuid REFERENCES quotes(id),
  agreement_type text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  terms_text text,
  signed_at timestamptz,
  signed_by_name text,
  status text DEFAULT 'active',
  monthly_amount numeric,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage agreements" ON agreements FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Clients view own agreements" ON agreements FOR SELECT
  USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));

-- Logs SMS
CREATE TABLE IF NOT EXISTS sms_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  intervention_id uuid REFERENCES interventions(id),
  sms_type text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  status text DEFAULT 'sent',
  twilio_sid text
);
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage sms_logs" ON sms_logs FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Referrals (parrainage)
CREATE TABLE IF NOT EXISTS referrals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  referred_client_id uuid REFERENCES clients(id),
  referral_code text UNIQUE NOT NULL,
  status text DEFAULT 'pending',
  referrer_discount_amount numeric,
  referred_discount_amount numeric,
  stripe_coupon_id text,
  rewarded_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage referrals" ON referrals FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Clients view own referrals" ON referrals FOR SELECT
  USING (referrer_client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    OR referred_client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));

-- PWA Check-ins
CREATE TABLE IF NOT EXISTS pwa_checkins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  intervention_id uuid REFERENCES interventions(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id),
  checked_in_at timestamptz DEFAULT now(),
  checked_out_at timestamptz,
  gps_lat numeric,
  gps_lng numeric,
  photo_urls jsonb DEFAULT '[]',
  signature_url text,
  technician_notes text,
  status text DEFAULT 'in_progress',
  checklist_completed jsonb DEFAULT '{}'
);
ALTER TABLE pwa_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage pwa_checkins" ON pwa_checkins FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Settings (clé-valeur)
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  label text,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage settings" ON settings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Public read settings" ON settings FOR SELECT
  USING (true);

-- Checklist items (terrain)
CREATE TABLE IF NOT EXISTS checklist_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,
  required boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  active boolean DEFAULT true
);
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage checklist_items" ON checklist_items FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone read checklist_items" ON checklist_items FOR SELECT
  USING (true);

-- Valeurs initiales settings
INSERT INTO settings (key, value, label) VALUES
  ('referral_referrer_discount_type', 'fixed', 'Type réduction parrain'),
  ('referral_referrer_discount_value', '10', 'Montant réduction parrain (€)'),
  ('referral_referred_discount_type', 'fixed', 'Type réduction filleul'),
  ('referral_referred_discount_value', '15', 'Montant réduction filleul (€)'),
  ('referral_trigger', 'first_payment', 'Déclencheur parrainage'),
  ('referral_active', 'true', 'Programme parrainage actif'),
  ('sms_reminder_active', 'true', 'SMS rappel actif'),
  ('sms_reminder_hour', '18', 'Heure envoi SMS rappel'),
  ('winback_discount_amount', '25', 'Montant promo win-back (€)'),
  ('quote_validity_days', '30', 'Validité devis (jours)')
ON CONFLICT (key) DO NOTHING;

-- Checklist items par défaut
INSERT INTO checklist_items (label, required, sort_order) VALUES
  ('J''ai bien fermé le portail / la barrière', true, 1),
  ('J''ai ramassé toutes les déjections visibles', true, 2),
  ('Je n''ai pas vu de chien en liberté dans le jardin', true, 3)
ON CONFLICT DO NOTHING;
