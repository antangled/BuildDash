/**
 * Setup Supabase database tables for BuildDash.
 * Run with: node scripts/setup-db.mjs
 *
 * Uses the Supabase Management API to execute SQL directly.
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
const PROJECT_REF = 'wlxlrfjqaxmtsuxttbdd';

const sql = `
CREATE TABLE IF NOT EXISTS machines_catalog (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  type TEXT NOT NULL,
  build_volume JSONB,
  compatible_materials TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'both')),
  tier TEXT DEFAULT 'basic' CHECK (tier IN ('basic', 'pro', 'premium')),
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  rating DOUBLE PRECISION DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seller_machines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  catalog_machine_id TEXT REFERENCES machines_catalog(id),
  machine_name TEXT NOT NULL,
  machine_type TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  build_volume JSONB,
  materials TEXT[] DEFAULT '{}',
  price_per_hour DOUBLE PRECISION DEFAULT 0,
  min_price DOUBLE PRECISION DEFAULT 5,
  turnaround_days INTEGER DEFAULT 3,
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  seller_machine_id UUID REFERENCES seller_machines(id),
  material TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  delivery_method TEXT DEFAULT 'shipping' CHECK (delivery_method IN ('shipping', 'local_pickup')),
  distance_miles DOUBLE PRECISION DEFAULT 0,
  fabrication_cost DOUBLE PRECISION DEFAULT 0,
  material_cost DOUBLE PRECISION DEFAULT 0,
  platform_fee DOUBLE PRECISION DEFAULT 0,
  shipping_cost DOUBLE PRECISION DEFAULT 0,
  total DOUBLE PRECISION DEFAULT 0,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  tracking_number TEXT,
  stl_filename TEXT,
  stl_dimensions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE machines_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Anyone can read machines_catalog" ON machines_catalog FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anyone can read seller_machines" ON seller_machines FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anyone can read profiles" ON profiles FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anyone can read orders" ON orders FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anon can insert profiles" ON profiles FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anon can update profiles" ON profiles FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anon can insert seller_machines" ON seller_machines FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anon can update seller_machines" ON seller_machines FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anon can delete seller_machines" ON seller_machines FOR DELETE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anon can insert orders" ON orders FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anon can update orders" ON orders FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
`;

async function run() {
  console.log('Executing SQL via Supabase pg-meta API...\n');

  // Supabase exposes a /pg/ endpoint for the service role key
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
  });
  console.log('API reachable:', res.ok);

  // Execute SQL using the query endpoint
  const sqlRes = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (sqlRes.ok) {
    const data = await sqlRes.json();
    console.log('✅ Tables created successfully!');
    console.log(data);
  } else {
    const text = await sqlRes.text();
    console.log(`SQL endpoint returned ${sqlRes.status}: ${text}`);
    console.log('\nTrying alternative endpoint...');

    // Try the /rest/v1/rpc approach (needs a function)
    // If that fails too, we'll output SQL for manual paste
    console.log('\n⚠ Auto-setup not available. Please run the SQL manually:');
    console.log('1. Go to: https://supabase.com/dashboard/project/wlxlrfjqaxmtsuxttbdd/sql/new');
    console.log('2. Paste the SQL below and click "Run"\n');
    console.log(sql);
  }
}

run().catch(console.error);
