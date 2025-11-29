-- Create table for tracking user presence and cursors
CREATE TABLE IF NOT EXISTS public.user_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  panel_id TEXT NOT NULL,
  cursor_x FLOAT,
  cursor_y FLOAT,
  color TEXT NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_user_presence_panel ON public.user_presence(panel_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_user ON public.user_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_last_seen ON public.user_presence(last_seen);

-- Enable RLS
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read presence (for collaboration features)
CREATE POLICY "Anyone can view presence"
  ON public.user_presence
  FOR SELECT
  USING (true);

-- Allow users to insert their own presence
CREATE POLICY "Users can insert their own presence"
  ON public.user_presence
  FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own presence
CREATE POLICY "Users can update their own presence"
  ON public.user_presence
  FOR UPDATE
  USING (true);

-- Allow users to delete their own presence
CREATE POLICY "Users can delete their own presence"
  ON public.user_presence
  FOR DELETE
  USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;

-- Create function to clean up old presence records
CREATE OR REPLACE FUNCTION public.cleanup_old_presence()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.user_presence
  WHERE last_seen < NOW() - INTERVAL '5 minutes';
END;
$$;