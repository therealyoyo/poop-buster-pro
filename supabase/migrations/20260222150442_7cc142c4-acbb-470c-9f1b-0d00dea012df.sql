
-- Create zones_service table for postal codes
CREATE TABLE public.zones_service (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code_postal TEXT NOT NULL,
  zone TEXT NOT NULL,
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.zones_service ENABLE ROW LEVEL SECURITY;

-- Public read for active postal codes (needed for the popup)
CREATE POLICY "Anyone can read active zones" ON public.zones_service FOR SELECT USING (true);

-- Admins manage zones
CREATE POLICY "Admins manage zones_service" ON public.zones_service FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create contact_requests table for out-of-zone contacts
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  code_postal TEXT NOT NULL,
  commentaire TEXT,
  status TEXT NOT NULL DEFAULT 'hors_zone',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "Anyone can submit contact request" ON public.contact_requests FOR INSERT WITH CHECK (true);

-- Admins can read/manage
CREATE POLICY "Admins manage contact_requests" ON public.contact_requests FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert Bruxelles postal codes
INSERT INTO public.zones_service (code_postal, zone) VALUES
('1000', 'Bruxelles'), ('1020', 'Bruxelles'), ('1030', 'Bruxelles'), ('1040', 'Bruxelles'),
('1050', 'Bruxelles'), ('1060', 'Bruxelles'), ('1070', 'Bruxelles'), ('1080', 'Bruxelles'),
('1081', 'Bruxelles'), ('1082', 'Bruxelles'), ('1083', 'Bruxelles'), ('1090', 'Bruxelles'),
('1120', 'Bruxelles'), ('1130', 'Bruxelles'), ('1140', 'Bruxelles'), ('1150', 'Bruxelles'),
('1160', 'Bruxelles'), ('1170', 'Bruxelles'), ('1180', 'Bruxelles'), ('1190', 'Bruxelles'),
('1200', 'Bruxelles'), ('1210', 'Bruxelles');

-- Insert Brabant Wallon postal codes
INSERT INTO public.zones_service (code_postal, zone) VALUES
('1300', 'Brabant Wallon'), ('1301', 'Brabant Wallon'), ('1310', 'Brabant Wallon'), ('1315', 'Brabant Wallon'),
('1320', 'Brabant Wallon'), ('1325', 'Brabant Wallon'), ('1330', 'Brabant Wallon'), ('1340', 'Brabant Wallon'),
('1341', 'Brabant Wallon'), ('1348', 'Brabant Wallon'), ('1350', 'Brabant Wallon'), ('1357', 'Brabant Wallon'),
('1360', 'Brabant Wallon'), ('1367', 'Brabant Wallon'), ('1370', 'Brabant Wallon'), ('1380', 'Brabant Wallon'),
('1390', 'Brabant Wallon'), ('1400', 'Brabant Wallon'), ('1401', 'Brabant Wallon'), ('1402', 'Brabant Wallon'),
('1404', 'Brabant Wallon'), ('1410', 'Brabant Wallon'), ('1420', 'Brabant Wallon'), ('1421', 'Brabant Wallon'),
('1428', 'Brabant Wallon'), ('1430', 'Brabant Wallon'), ('1435', 'Brabant Wallon'), ('1440', 'Brabant Wallon'),
('1450', 'Brabant Wallon'), ('1457', 'Brabant Wallon'), ('1460', 'Brabant Wallon'), ('1461', 'Brabant Wallon'),
('1470', 'Brabant Wallon'), ('1471', 'Brabant Wallon'), ('1472', 'Brabant Wallon'), ('1473', 'Brabant Wallon'),
('1474', 'Brabant Wallon'), ('1476', 'Brabant Wallon'), ('1480', 'Brabant Wallon'), ('1490', 'Brabant Wallon');
