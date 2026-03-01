/**
 * Seed a demo seller profile into Supabase.
 * Run with: node scripts/seed-demo-seller.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const DEMO_SELLER_ID = '00000000-0000-0000-0000-000000000001';

async function seed() {
  // Upsert demo seller profile
  const profile = {
    id: DEMO_SELLER_ID,
    name: 'Demo User',
    email: 'demo@builddash.local',
    role: 'both',
    tier: 'basic',
    location_lat: 37.7749,
    location_lng: -122.4194,
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94105',
    rating: 5.0,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify(profile),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed to create profile (${res.status}): ${text}`);
    return;
  }

  console.log(`✅ Demo seller profile created (id: ${DEMO_SELLER_ID})`);
}

seed().catch(console.error);
