
-- Fix pipeline_stage constraint to allow all used values
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_pipeline_stage_check;

-- Fix service_frequency constraint to include twice_weekly
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_service_frequency_check;

-- Fix messages sender_id to be nullable (for inbound emails from clients without a portal account)
ALTER TABLE public.messages ALTER COLUMN sender_id DROP NOT NULL;
