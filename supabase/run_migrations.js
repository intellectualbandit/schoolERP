/**
 * Migration runner — connects to Supabase Postgres and runs all migration files in order.
 *
 * Usage (pick one):
 *   SUPABASE_SERVICE_ROLE_KEY=<jwt>  node supabase/run_migrations.js   (JWT via session pooler)
 *   SUPABASE_DB_PASSWORD=<password>  node supabase/run_migrations.js   (DB password via pooler or direct)
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'wxbshmsjzjmehcyimxcd';

if (!SERVICE_ROLE_KEY && !DB_PASSWORD) {
  console.error('Provide either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_DB_PASSWORD');
  process.exit(1);
}

function buildConfigs() {
  const configs = [];
  const regions = ['ap-southeast-1', 'us-east-1', 'us-west-1', 'eu-central-1'];

  if (DB_PASSWORD) {
    // Direct DB host (works when not behind NAT/firewall)
    configs.push({
      host: `db.${PROJECT_REF}.supabase.co`,
      port: 5432,
      user: 'postgres',
      password: DB_PASSWORD,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
    });
    // Transaction pooler with DB password (port 6543)
    for (const region of regions) {
      configs.push({
        host: `aws-0-${region}.pooler.supabase.com`,
        port: 6543,
        user: `postgres.${PROJECT_REF}`,
        password: DB_PASSWORD,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
      });
    }
    // Session pooler with DB password (port 5432)
    for (const region of regions) {
      configs.push({
        host: `aws-0-${region}.pooler.supabase.com`,
        port: 5432,
        user: `postgres.${PROJECT_REF}`,
        password: DB_PASSWORD,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
      });
    }
  }

  if (SERVICE_ROLE_KEY) {
    // Session pooler with JWT as password
    for (const region of regions) {
      configs.push({
        host: `aws-0-${region}.pooler.supabase.com`,
        port: 5432,
        user: `postgres.${PROJECT_REF}`,
        password: SERVICE_ROLE_KEY,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
      });
    }
  }

  return configs;
}

const CONNECTION_CONFIGS = buildConfigs();
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const MIGRATION_FILES = ['001_schema.sql', '002_rls_policies.sql', '003_seed_data.sql', '004_functions.sql'];

async function tryConnect() {
  for (const config of CONNECTION_CONFIGS) {
    const client = new Client({ ...config, connectionTimeoutMillis: 8000 });
    try {
      await client.connect();
      console.log(`Connected via ${config.host}:${config.port}`);
      return client;
    } catch (err) {
      console.log(`  ${config.host}:${config.port} — ${err.message}`);
      try { await client.end(); } catch {}
    }
  }
  return null;
}

async function runMigrations() {
  console.log('Connecting to Supabase...');
  const client = await tryConnect();

  if (!client) {
    console.error('\nCould not connect to any endpoint.');
    console.error('Get your DB password from: Supabase Dashboard → Settings → Database → Database password');
    console.error('Then run:  SUPABASE_DB_PASSWORD=<password> node supabase/run_migrations.js');
    process.exit(1);
  }

  for (const file of MIGRATION_FILES) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${file} (not found)`);
      continue;
    }

    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`\nRunning ${file}...`);
    try {
      await client.query(sql);
      console.log(`  OK`);
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('duplicate')) {
        console.log(`  Already applied (skipping): ${err.message.split('\n')[0]}`);
      } else {
        console.error(`  ERROR: ${err.message}`);
        await client.end();
        process.exit(1);
      }
    }
  }

  await client.end();
  console.log('\nAll migrations complete!');
}

runMigrations().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
