-- Fix search_path for cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_old_presence()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.user_presence
  WHERE last_seen < NOW() - INTERVAL '5 minutes';
END;
$$;