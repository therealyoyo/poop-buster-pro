
-- Pipeline history table
CREATE TABLE IF NOT EXISTS public.pipeline_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  from_stage text,
  to_stage text NOT NULL,
  changed_by text DEFAULT 'admin',
  changed_at timestamptz DEFAULT now(),
  note text
);

ALTER TABLE public.pipeline_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage pipeline_history" ON public.pipeline_history
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Promo flags on clients
ALTER TABLE public.clients 
  ADD COLUMN IF NOT EXISTS referral_discount_used boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS first_free_used boolean DEFAULT false;
