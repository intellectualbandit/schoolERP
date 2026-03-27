/**
 * Seed Supabase Auth Users
 *
 * Creates 10 demo accounts in Supabase Auth.
 * Run this BEFORE the 003_seed_data.sql migration.
 *
 * Usage:
 *   node supabase/seed_auth_users.js
 *
 * Prerequisites:
 *   npm install @supabase/supabase-js
 *
 * Set environment variables:
 *   SUPABASE_URL=https://your-project.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
 *
 * IMPORTANT: Use the SERVICE ROLE key (not the anon key) — this script needs
 * admin access to create auth users.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  console.error('Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node supabase/seed_auth_users.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_USERS = [
  { email: 'admin@school.edu.ph', password: 'admin123', first_name: 'Admin', last_name: 'User', role: 'admin' },
  { email: 'principal@school.edu.ph', password: 'principal123', first_name: 'Dr. Elena', last_name: 'Reyes', role: 'principal' },
  { email: 'rosa.montoya@school.edu.ph', password: 'teacher123', first_name: 'Rosa Lina', last_name: 'Montoya', role: 'teacher' },
  { email: 'carlos.santos@school.edu.ph', password: 'teacher123', first_name: 'Carlos', last_name: 'Santos', role: 'teacher' },
  { email: 'juan.delacruz@student.school.edu.ph', password: 'student123', first_name: 'Juan', last_name: 'Dela Cruz', role: 'student' },
  { email: 'maria.santos@student.school.edu.ph', password: 'student123', first_name: 'Maria', last_name: 'Santos', role: 'student' },
  { email: 'maria.delacruz@parent.school.edu.ph', password: 'parent123', first_name: 'Maria', last_name: 'Dela Cruz', role: 'parent' },
  { email: 'registrar@school.edu.ph', password: 'registrar123', first_name: 'Ana', last_name: 'Villanueva', role: 'registrar' },
  { email: 'cashier@school.edu.ph', password: 'cashier123', first_name: 'Carmen', last_name: 'Torres', role: 'cashier' },
  { email: 'counselor@school.edu.ph', password: 'counselor123', first_name: 'Sofia', last_name: 'Mendoza', role: 'counselor' },
];

async function seed() {
  console.log('Creating demo auth users...\n');

  const results = [];

  for (const user of DEMO_USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true, // auto-confirm so they can log in immediately
      user_metadata: {
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });

    if (error) {
      console.error(`  FAIL  ${user.email}: ${error.message}`);
      results.push({ email: user.email, id: null, error: error.message });
    } else {
      console.log(`  OK    ${user.email} → ${data.user.id}`);
      results.push({ email: user.email, id: data.user.id, role: user.role });
    }
  }

  console.log('\n--- Summary ---');
  console.log('Copy these UUIDs into 003_seed_data.sql, replacing the placeholder UUIDs:\n');

  const updateStatements = [];
  results.forEach((r, i) => {
    if (r.id) {
      const placeholder = `00000000-0000-0000-0000-${String(i + 1).padStart(12, '0')}`;
      console.log(`  ${r.email}`);
      console.log(`    ${placeholder} → ${r.id}\n`);
      updateStatements.push(
        `-- UPDATE users SET id = '${r.id}' WHERE id = '${placeholder}';`
      );
    }
  });

  console.log('\nAlternatively, run this SQL to update the placeholder UUIDs in the users table:');
  console.log('(Only needed if you already ran 003_seed_data.sql with placeholders)\n');

  results.forEach((r, i) => {
    if (r.id) {
      const placeholder = `00000000-0000-0000-0000-${String(i + 1).padStart(12, '0')}`;
      console.log(`UPDATE users SET id = '${r.id}' WHERE email = '${r.email}';`);
    }
  });

  console.log('\nDone! Created', results.filter(r => r.id).length, 'of', DEMO_USERS.length, 'users.');
}

seed().catch(console.error);
