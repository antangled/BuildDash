/**
 * Setup Supabase database tables for BuildDash.
 * Run with: npx tsx scripts/setup-db.ts
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wlxlrfjqaxmtsuxttbdd.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  // Read from .env.local
  const fs = require('fs');
  const envPath = require('path').join(__dirname, '..', '.env.local');
  const env = fs.readFileSync(envPath, 'utf8');
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  }
}

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function runSQL(sql: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  // Use the SQL endpoint directly
  const sqlRes = await fetch(`${SUPABASE_URL}/pg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  return sqlRes;
}

async function setupTables() {
  console.log('Creating tables via Supabase Management API...');

  // We'll use the SQL editor API endpoint
  const sql = `
    -- Machines catalog (reference database of 330+ machines)
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

    -- User profiles
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

    -- Seller machine listings (what sellers actually offer)
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

    -- Orders
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

    -- Enable RLS but allow anon read on catalog
    ALTER TABLE machines_catalog ENABLE ROW LEVEL SECURITY;
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE seller_machines ENABLE ROW LEVEL SECURITY;
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

    -- Policies: anyone can read the machine catalog
    CREATE POLICY IF NOT EXISTS "Anyone can read machines_catalog"
      ON machines_catalog FOR SELECT USING (true);

    -- Policies: anyone can read seller machines (for buyer search)
    CREATE POLICY IF NOT EXISTS "Anyone can read seller_machines"
      ON seller_machines FOR SELECT USING (true);

    -- Policies: anyone can read profiles (for display)
    CREATE POLICY IF NOT EXISTS "Anyone can read profiles"
      ON profiles FOR SELECT USING (true);

    -- For demo: allow anon insert/update on all tables
    CREATE POLICY IF NOT EXISTS "Anon can insert profiles"
      ON profiles FOR INSERT WITH CHECK (true);
    CREATE POLICY IF NOT EXISTS "Anon can update profiles"
      ON profiles FOR UPDATE USING (true);

    CREATE POLICY IF NOT EXISTS "Anon can insert seller_machines"
      ON seller_machines FOR INSERT WITH CHECK (true);
    CREATE POLICY IF NOT EXISTS "Anon can update seller_machines"
      ON seller_machines FOR UPDATE USING (true);
    CREATE POLICY IF NOT EXISTS "Anon can delete seller_machines"
      ON seller_machines FOR DELETE USING (true);

    CREATE POLICY IF NOT EXISTS "Anon can insert orders"
      ON orders FOR INSERT WITH CHECK (true);
    CREATE POLICY IF NOT EXISTS "Anon can update orders"
      ON orders FOR UPDATE USING (true);
    CREATE POLICY IF NOT EXISTS "Anyone can read orders"
      ON orders FOR SELECT USING (true);
  `;

  console.log('SQL ready. Please run this in your Supabase SQL Editor:');
  console.log('Dashboard → SQL Editor → New Query → Paste & Run\n');
  console.log(sql);
}

setupTables();
