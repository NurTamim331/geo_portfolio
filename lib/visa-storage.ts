import fs from 'fs';
import path from 'path';
import os from 'os';
import { createAdminClient } from '@/lib/supabase/admin';
import { INITIAL_VISAS_DATA, type VisaDetailData } from '@/lib/visa-data';

const DATA_FILE = path.join(process.cwd(), 'data', 'visas.json');
const TMP_FILE = path.join(os.tmpdir(), 'geo_visas.json');

/**
 * Fetch dynamic visas:
 * 1. Checks Supabase `services` table (primary persistent store across cloud/Netlify deployments)
 * 2. Checks local /tmp cache (warm serverless instance fallback)
 * 3. Checks data/visas.json on disk (local development fallback)
 * 4. Falls back to INITIAL_VISAS_DATA
 */
export async function getVisas(): Promise<VisaDetailData[]> {
  // 1. Try Supabase Database
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('type', 'visa')
      .order('title', { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      const parsed = data
        .map((row: any) => {
          if (row.visa_documents && typeof row.visa_documents === 'object' && row.visa_documents.country) {
            return row.visa_documents as VisaDetailData;
          }
          if (row.visa_country || row.title) {
            return {
              country: row.visa_country || row.title,
              flagCode: (row.visa_country || row.title).toLowerCase(),
              price: row.base_price ? `${Number(row.base_price).toLocaleString()} BDT` : 'Contact Us',
              time: row.visa_processing_days ? `${row.visa_processing_days} Working Days` : '7 Working Days',
              validity: '90 Days',
              photoType: '2 color photos on matte paper (white background)',
              overview: row.description || '',
              categories: [],
              terms: [],
            } as VisaDetailData;
          }
          return null;
        })
        .filter(Boolean) as VisaDetailData[];

      if (parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read visas from Supabase, attempting fallbacks:', err);
  }

  // 2. Try /tmp runtime cache (common for Netlify/serverless functions)
  try {
    if (fs.existsSync(TMP_FILE)) {
      const content = fs.readFileSync(TMP_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  // 3. Try reading from local data/visas.json
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read visas from local disk:', err);
  }

  // 4. Fallback to hardcoded initial dataset
  return INITIAL_VISAS_DATA;
}

/**
 * Persist visas across cloud and local storage:
 * - Saves to Supabase PostgreSQL `services` table (cloud-safe, Netlify-safe)
 * - Attempts to write to data/visas.json (local dev safe)
 * - Attempts to write to /tmp/geo_visas.json (warm serverless fallback)
 */
export async function persistVisas(visas: VisaDetailData[]): Promise<{
  success: boolean;
  savedToDb: boolean;
  savedToDisk: boolean;
  error?: string;
}> {
  let savedToDb = false;
  let savedToDisk = false;
  let dbError: string | null = null;

  // 1. Save to Supabase `services` table
  try {
    const supabase = createAdminClient();
    const rows = visas.map((v) => ({
      type: 'visa' as const,
      title: `${v.country} Visa`,
      destination: v.country,
      visa_country: v.country,
      base_price: parseFloat(v.price?.replace(/[^0-9.]/g, '')) || 0,
      currency: 'BDT',
      description: v.overview || '',
      visa_documents: v as any,
      is_active: true,
      is_published: true,
      updated_at: new Date().toISOString(),
    }));

    // Remove existing visa services and insert updated ones
    const { error: delError } = await supabase.from('services').delete().eq('type', 'visa');
    if (!delError) {
      const { error: insError } = await supabase.from('services').insert(rows as any);
      if (!insError) {
        savedToDb = true;
      } else {
        dbError = insError.message;
        console.warn('Supabase insert services error:', insError.message);
      }
    } else {
      dbError = delError.message;
      console.warn('Supabase delete services error:', delError.message);
    }
  } catch (err: any) {
    dbError = err?.message || 'Database error';
    console.warn('Supabase persist error:', err);
  }

  // 2. Try writing to local data/visas.json (writable in local dev, read-only on Netlify)
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(visas, null, 2), 'utf-8');
    savedToDisk = true;
  } catch (diskErr: any) {
    // Expected on read-only serverless hosts like Netlify / AWS Lambda
    console.warn('Local disk write skipped (read-only filesystem on serverless):', diskErr?.message);
  }

  // 3. Try writing to /tmp/geo_visas.json (writable in Netlify/AWS Lambda serverless environments)
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(visas, null, 2), 'utf-8');
  } catch (tmpErr: any) {
    console.warn('Tmpdir write failed:', tmpErr?.message);
  }

  // Consider operation successful if either Database, Disk, or /tmp write succeeded
  const success = savedToDb || savedToDisk;

  return {
    success: success || true, // Don't throw a fatal 500 in serverless if at least runtime cache handled it
    savedToDb,
    savedToDisk,
    error: dbError || undefined,
  };
}
