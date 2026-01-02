-- Security Events Table
CREATE TABLE public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
  source_ip TEXT,
  destination_ip TEXT,
  protocol TEXT,
  port INTEGER,
  description TEXT NOT NULL,
  raw_data JSONB,
  mitre_technique TEXT,
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- IOC (Indicators of Compromise) Table
CREATE TABLE public.iocs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ioc_type TEXT NOT NULL CHECK (ioc_type IN ('ip', 'domain', 'hash', 'url', 'email', 'file_path', 'registry', 'mutex')),
  value TEXT NOT NULL,
  threat_level TEXT NOT NULL CHECK (threat_level IN ('unknown', 'low', 'medium', 'high', 'critical')),
  source TEXT,
  description TEXT,
  tags TEXT[],
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Investigations Table
CREATE TABLE public.investigations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'pending', 'closed', 'escalated')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to TEXT,
  mitre_tactics TEXT[],
  related_iocs UUID[],
  related_events UUID[],
  findings TEXT,
  timeline JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Threat Actors Table
CREATE TABLE public.threat_actors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  aliases TEXT[],
  description TEXT,
  motivation TEXT,
  sophistication TEXT CHECK (sophistication IN ('none', 'minimal', 'intermediate', 'advanced', 'expert', 'innovator')),
  country_of_origin TEXT,
  target_industries TEXT[],
  known_ttps TEXT[],
  related_iocs UUID[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  first_observed TIMESTAMP WITH TIME ZONE,
  last_activity TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Attack Campaigns Table
CREATE TABLE public.attack_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  threat_actor_id UUID REFERENCES public.threat_actors(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'detected')),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  targets JSONB,
  objectives TEXT[],
  techniques_used TEXT[],
  tools_used TEXT[],
  related_events UUID[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Network Assets Table
CREATE TABLE public.network_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hostname TEXT,
  ip_address TEXT NOT NULL,
  mac_address TEXT,
  asset_type TEXT NOT NULL,
  operating_system TEXT,
  services JSONB,
  vulnerabilities JSONB,
  risk_score INTEGER DEFAULT 0,
  zone TEXT,
  is_compromised BOOLEAN NOT NULL DEFAULT false,
  last_scan TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iocs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attack_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_assets ENABLE ROW LEVEL SECURITY;

-- Create public read policies (for demo purposes - in production, these would be more restrictive)
CREATE POLICY "Anyone can view security events" ON public.security_events FOR SELECT USING (true);
CREATE POLICY "Anyone can insert security events" ON public.security_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view IOCs" ON public.iocs FOR SELECT USING (true);
CREATE POLICY "Anyone can manage IOCs" ON public.iocs FOR ALL USING (true);

CREATE POLICY "Anyone can view investigations" ON public.investigations FOR SELECT USING (true);
CREATE POLICY "Anyone can manage investigations" ON public.investigations FOR ALL USING (true);

CREATE POLICY "Anyone can view threat actors" ON public.threat_actors FOR SELECT USING (true);
CREATE POLICY "Anyone can manage threat actors" ON public.threat_actors FOR ALL USING (true);

CREATE POLICY "Anyone can view attack campaigns" ON public.attack_campaigns FOR SELECT USING (true);
CREATE POLICY "Anyone can manage attack campaigns" ON public.attack_campaigns FOR ALL USING (true);

CREATE POLICY "Anyone can view network assets" ON public.network_assets FOR SELECT USING (true);
CREATE POLICY "Anyone can manage network assets" ON public.network_assets FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_security_events_severity ON public.security_events(severity);
CREATE INDEX idx_security_events_detected_at ON public.security_events(detected_at);
CREATE INDEX idx_iocs_type ON public.iocs(ioc_type);
CREATE INDEX idx_iocs_threat_level ON public.iocs(threat_level);
CREATE INDEX idx_investigations_status ON public.investigations(status);
CREATE INDEX idx_network_assets_ip ON public.network_assets(ip_address);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.security_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.iocs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.investigations;