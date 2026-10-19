import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { INITIAL_VISAS_DATA } from '@/lib/visa-data';
import { createClient } from '@/lib/supabase/server';

const DATA_FILE = path.join(process.cwd(), 'data', 'visas.json');

function getVisasFromDisk() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading visas from disk:', err);
  }
  return INITIAL_VISAS_DATA;
}

function saveVisasToDisk(visas: any[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(visas, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing visas to disk:', err);
    return false;
  }
}

export async function GET() {
  const visas = getVisasFromDisk();
  return NextResponse.json({ visas });
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check admin permissions
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
      }
    }

    const body = await request.json();
    if (!body || !Array.isArray(body.visas)) {
      return NextResponse.json({ error: 'Invalid payload: visas array required.' }, { status: 400 });
    }

    const saved = saveVisasToDisk(body.visas);
    if (!saved) {
      return NextResponse.json({ error: 'Failed to write visas to storage.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, visas: body.visas });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
