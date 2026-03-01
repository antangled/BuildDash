/**
 * Seed machines_catalog table in Supabase with 330 machines.
 * Run with: node scripts/seed-machines.mjs
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

// Load machines catalog
const catalogPath = join(__dirname, '..', 'src', 'data', 'machines-catalog.json');
const machines = JSON.parse(readFileSync(catalogPath, 'utf8'));

// Map JSON fields to database columns
function mapMachine(m) {
  return {
    id: m.id,
    name: m.name,
    manufacturer: m.manufacturer,
    type: m.type,
    build_volume: m.buildVolume || null,
    compatible_materials: m.supportedMaterials || [],
    tags: m.tags || [],
    specs: {
      ...(m.yearReleased ? { yearReleased: m.yearReleased } : {}),
      ...(m.msrp ? { msrp: m.msrp } : {}),
    },
  };
}

async function seed() {
  console.log(`Seeding ${machines.length} machines into Supabase...`);

  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < machines.length; i += BATCH_SIZE) {
    const batch = machines.slice(i, i + BATCH_SIZE).map(mapMachine);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/machines_catalog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`Batch ${i / BATCH_SIZE + 1} failed (${res.status}): ${text}`);
      continue;
    }

    inserted += batch.length;
    console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: inserted ${batch.length} machines (total: ${inserted})`);
  }

  console.log(`\n✅ Done! ${inserted}/${machines.length} machines seeded.`);

  // Verify count
  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/machines_catalog?select=id&limit=1`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Prefer': 'count=exact',
    },
  });
  const total = countRes.headers.get('content-range');
  console.log(`Supabase reports: ${total}`);
}

seed().catch(console.error);
