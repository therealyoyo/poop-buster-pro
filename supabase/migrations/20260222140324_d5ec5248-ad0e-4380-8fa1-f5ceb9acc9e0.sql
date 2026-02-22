
-- Service zones (dynamic)
CREATE TABLE public.service_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.service_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage zones" ON public.service_zones FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated read zones" ON public.service_zones FOR SELECT TO authenticated USING (true);

-- Insert default zones
INSERT INTO public.service_zones (name) VALUES ('Bruxelles'), ('Brabant Wallon');

-- Clients table
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  address text,
  zone_id uuid REFERENCES public.service_zones(id),
  dog_count integer NOT NULL DEFAULT 1,
  garden_size text, -- petit / moyen / grand
  gate_code text,
  status text NOT NULL DEFAULT 'prospect' CHECK (status IN ('prospect', 'active', 'paused', 'cancelled', 'inactive')),
  pipeline_stage text NOT NULL DEFAULT 'new' CHECK (pipeline_stage IN ('new', 'quote_sent', 'active', 'inactive')),
  service_frequency text CHECK (service_frequency IN ('weekly', 'biweekly', 'monthly', 'one_time')),
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage clients" ON public.clients FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients read own profile" ON public.clients FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Interventions table
CREATE TABLE public.interventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  scheduled_date date NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  completed_at timestamptz,
  photo_url text,
  completion_message text,
  admin_id uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage interventions" ON public.interventions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients read own interventions" ON public.interventions FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- Messages table (admin-client)
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id),
  sender_role text NOT NULL CHECK (sender_role IN ('admin', 'client')),
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  intervention_id uuid REFERENCES public.interventions(id),
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage messages" ON public.messages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients read own messages" ON public.messages FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));
CREATE POLICY "Clients send messages" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    sender_role = 'client' AND
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON public.interventions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for intervention photos
INSERT INTO storage.buckets (id, name, public) VALUES ('intervention-photos', 'intervention-photos', true);

CREATE POLICY "Admins upload photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'intervention-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone view photos" ON storage.objects FOR SELECT
  USING (bucket_id = 'intervention-photos');
CREATE POLICY "Admins delete photos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'intervention-photos' AND public.has_role(auth.uid(), 'admin'));
