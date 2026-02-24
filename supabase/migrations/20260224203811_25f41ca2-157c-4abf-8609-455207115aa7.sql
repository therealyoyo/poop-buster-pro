-- Allow anonymous users to submit prospect via the quote form
CREATE POLICY "Anyone can submit prospect"
ON public.clients
FOR INSERT
WITH CHECK (status = 'prospect' AND pipeline_stage = 'new');