-- Persisted decisions from the autonomous SOC analyst
CREATE TABLE public.ai_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.security_events(id) ON DELETE SET NULL,
  investigation_id uuid REFERENCES public.investigations(id) ON DELETE SET NULL,
  agent text NOT NULL DEFAULT 'autonomous-soc-analyst',
  severity text NOT NULL,
  confidence numeric NOT NULL DEFAULT 0,
  mitre_technique_id text,
  mitre_technique_name text,
  correlated_ioc_ids text[] DEFAULT '{}',
  affected_asset_ids text[] DEFAULT '{}',
  playbook jsonb DEFAULT '[]'::jsonb,
  narrative text,
  auto_actions_executed jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view AI decisions"
  ON public.ai_decisions FOR SELECT USING (true);
CREATE POLICY "Anyone can manage AI decisions"
  ON public.ai_decisions FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX idx_ai_decisions_created_at ON public.ai_decisions (created_at DESC);
CREATE INDEX idx_ai_decisions_event_id ON public.ai_decisions (event_id);

-- Hypotheses produced by the autonomous Threat Hunter agent
CREATE TABLE public.ai_hunts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent text NOT NULL DEFAULT 'autonomous-threat-hunter',
  hypothesis text NOT NULL,
  rationale text,
  suggested_query text,
  related_technique_ids text[] DEFAULT '{}',
  related_event_ids text[] DEFAULT '{}',
  confidence numeric NOT NULL DEFAULT 0,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'open',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_hunts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view AI hunts"
  ON public.ai_hunts FOR SELECT USING (true);
CREATE POLICY "Anyone can manage AI hunts"
  ON public.ai_hunts FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX idx_ai_hunts_status_created ON public.ai_hunts (status, created_at DESC);

-- updated_at trigger for ai_hunts
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_ai_hunts_touch
  BEFORE UPDATE ON public.ai_hunts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_decisions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_hunts;