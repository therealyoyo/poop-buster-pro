-- Allow clients to view their own financials
CREATE POLICY "Clients view own financials"
ON public.financials
FOR SELECT
USING (client_id IN (
  SELECT id FROM clients WHERE user_id = auth.uid()
));
