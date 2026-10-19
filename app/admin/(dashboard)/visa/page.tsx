import { VisaManager } from '@/components/admin/VisaManager';
import fs from 'fs';
import path from 'path';
import { INITIAL_VISAS_DATA } from '@/lib/visa-data';
import { requireAdmin } from '@/lib/auth/admin-auth';

export default async function AdminVisaPage() {
  await requireAdmin();

  let visas = INITIAL_VISAS_DATA;
  try {
    const dataPath = path.join(process.cwd(), 'data', 'visas.json');
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        visas = parsed;
      }
    }
  } catch (err) {
    console.error('Error loading visas on server:', err);
  }

  return <VisaManager initialVisas={visas} />;
}
