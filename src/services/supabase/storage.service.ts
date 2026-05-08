import { supabase } from './client';

export async function getAudioReportUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('reports')
    .createSignedUrl(storagePath, 3600);

  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function getLatestAudioReport(businessId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('audio_reports')
    .select('storage_path')
    .eq('business_id', businessId)
    .order('generated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return getAudioReportUrl(data.storage_path);
}
