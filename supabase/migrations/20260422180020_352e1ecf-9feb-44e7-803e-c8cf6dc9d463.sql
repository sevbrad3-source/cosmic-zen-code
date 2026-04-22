-- =======================================================================
-- Lock down RLS: replace permissive USING(true) with authenticated-only.
-- For user_presence, scope writes to the owner using auth.uid()::text = user_id.
-- =======================================================================

-- Helper: drop a policy if exists (Postgres lacks IF EXISTS for DROP POLICY in older versions; use DO block).
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'security_events','iocs','investigations','network_assets',
        'attack_campaigns','threat_actors','ai_decisions','ai_hunts','user_presence'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- ----- security_events -----
CREATE POLICY "auth_select_security_events" ON public.security_events
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_security_events" ON public.security_events
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_security_events" ON public.security_events
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_security_events" ON public.security_events
  FOR DELETE TO authenticated USING (true);

-- ----- iocs -----
CREATE POLICY "auth_select_iocs" ON public.iocs
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_iocs" ON public.iocs
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_iocs" ON public.iocs
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_iocs" ON public.iocs
  FOR DELETE TO authenticated USING (true);

-- ----- investigations -----
CREATE POLICY "auth_select_investigations" ON public.investigations
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_investigations" ON public.investigations
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_investigations" ON public.investigations
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_investigations" ON public.investigations
  FOR DELETE TO authenticated USING (true);

-- ----- network_assets -----
CREATE POLICY "auth_select_network_assets" ON public.network_assets
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_network_assets" ON public.network_assets
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_network_assets" ON public.network_assets
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_network_assets" ON public.network_assets
  FOR DELETE TO authenticated USING (true);

-- ----- attack_campaigns -----
CREATE POLICY "auth_select_attack_campaigns" ON public.attack_campaigns
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_attack_campaigns" ON public.attack_campaigns
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_attack_campaigns" ON public.attack_campaigns
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_attack_campaigns" ON public.attack_campaigns
  FOR DELETE TO authenticated USING (true);

-- ----- threat_actors -----
CREATE POLICY "auth_select_threat_actors" ON public.threat_actors
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_threat_actors" ON public.threat_actors
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_threat_actors" ON public.threat_actors
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_threat_actors" ON public.threat_actors
  FOR DELETE TO authenticated USING (true);

-- ----- ai_decisions -----
CREATE POLICY "auth_select_ai_decisions" ON public.ai_decisions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_ai_decisions" ON public.ai_decisions
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_ai_decisions" ON public.ai_decisions
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_ai_decisions" ON public.ai_decisions
  FOR DELETE TO authenticated USING (true);

-- ----- ai_hunts -----
CREATE POLICY "auth_select_ai_hunts" ON public.ai_hunts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_ai_hunts" ON public.ai_hunts
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_ai_hunts" ON public.ai_hunts
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_ai_hunts" ON public.ai_hunts
  FOR DELETE TO authenticated USING (true);

-- ----- user_presence (owner-scoped) -----
-- Reads remain visible to authenticated users (so cursors render for all collaborators).
CREATE POLICY "auth_select_user_presence" ON public.user_presence
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_own_presence" ON public.user_presence
  FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "auth_update_own_presence" ON public.user_presence
  FOR UPDATE TO authenticated USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "auth_delete_own_presence" ON public.user_presence
  FOR DELETE TO authenticated USING (auth.uid()::text = user_id);
