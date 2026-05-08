-- Fix: reemplaza extensions.http_post (no existe) con net.http_post (pg_net 0.20.0)
-- y agrega Authorization header requerido por la Edge Function
CREATE OR REPLACE FUNCTION notify_review_oracle()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://zocjplghlewzrgeoputs.supabase.co/functions/v1/review-reward-oracle',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvam9wbGdobGV3enJnZW9wdXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNjM2MTQsImV4cCI6MjA5MzgzOTYxNH0.s6E3MRUG13aTA3fXRdNCcqkkcUofawj-5Me4WsEmTPA'
    ),
    body := jsonb_build_object('record', row_to_json(NEW))::text
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Oracle notification failed: %', SQLERRM;
  RETURN NEW;
END;
$$;
