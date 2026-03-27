-- ============================================================
-- Seed Data — matches existing mock data in the app
-- Run after 001_schema.sql and 002_rls_policies.sql
-- NOTE: Run seed_auth_users.js FIRST to create auth users,
--       then update the UUIDs below to match.
-- ============================================================

-- ======================== SCHOOL CONFIG ========================

INSERT INTO school_config (id, school_year, quarters)
VALUES (1, '2025-2026', ARRAY['Q1','Q2','Q3','Q4'])
ON CONFLICT (id) DO NOTHING;

-- ======================== GRADE LEVELS ========================

INSERT INTO grade_levels (id, name, sort_order) VALUES
  (1, 'Grade 7', 1),
  (2, 'Grade 8', 2),
  (3, 'Grade 9', 3),
  (4, 'Grade 10', 4);

SELECT setval('grade_levels_id_seq', 4);

-- ======================== SECTIONS ========================

INSERT INTO sections (id, name, grade_level_id) VALUES
  (1, 'Rizal', 1),       -- Grade 7
  (2, 'Bonifacio', 2),   -- Grade 8
  (3, 'Mabini', 3),      -- Grade 9
  (4, 'Aguinaldo', 4);   -- Grade 10

SELECT setval('sections_id_seq', 4);

-- ======================== SUBJECTS ========================

INSERT INTO subjects (id, name, sort_order) VALUES
  (1, 'Filipino', 1),
  (2, 'English', 2),
  (3, 'Mathematics', 3),
  (4, 'Science', 4),
  (5, 'Araling Panlipunan', 5),
  (6, 'ESP', 6),
  (7, 'MAPEH', 7),
  (8, 'TLE', 8);

SELECT setval('subjects_id_seq', 8);

-- ======================== AUTH USERS ========================
-- Create auth accounts so the FK users.id → auth.users(id) is satisfied.
-- Password for all demo accounts: Demo1234!
-- pgcrypto lives in the extensions schema in Supabase

INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token,
  email_change_token_new, email_change
) VALUES
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','admin@school.edu.ph',        extensions.crypt('Demo1234!',extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','',''),
  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','principal@school.edu.ph',     extensions.crypt('Demo1234!',extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','',''),
  ('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','rosa.montoya@school.edu.ph',   extensions.crypt('Demo1234!',extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','',''),
  ('00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','carlos.santos@school.edu.ph',  extensions.crypt('Demo1234!',extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','',''),
  ('00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','juan.delacruz@student.school.edu.ph', extensions.crypt('Demo1234!',extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','',''),
  ('00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','maria.santos@student.school.edu.ph',  extensions.crypt('Demo1234!',extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','',''),
  ('00000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','maria.delacruz@parent.school.edu.ph', extensions.crypt('Demo1234!',extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','',''),
  ('00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated','registrar@school.edu.ph',      extensions.crypt('Demo1234!',extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','',''),
  ('00000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000000','authenticated','authenticated','cashier@school.edu.ph',        extensions.crypt('Demo1234!',extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','',''),
  ('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000000','authenticated','authenticated','counselor@school.edu.ph',      extensions.crypt('Demo1234!',extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','')
ON CONFLICT (id) DO NOTHING;

-- Auth identities required for email/password sign-in
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at) VALUES
  (gen_random_uuid(),'00000000-0000-0000-0000-000000000001','{"sub":"00000000-0000-0000-0000-000000000001","email":"admin@school.edu.ph"}',        'email','00000000-0000-0000-0000-000000000001',now(),now(),now()),
  (gen_random_uuid(),'00000000-0000-0000-0000-000000000002','{"sub":"00000000-0000-0000-0000-000000000002","email":"principal@school.edu.ph"}',     'email','00000000-0000-0000-0000-000000000002',now(),now(),now()),
  (gen_random_uuid(),'00000000-0000-0000-0000-000000000003','{"sub":"00000000-0000-0000-0000-000000000003","email":"rosa.montoya@school.edu.ph"}',   'email','00000000-0000-0000-0000-000000000003',now(),now(),now()),
  (gen_random_uuid(),'00000000-0000-0000-0000-000000000004','{"sub":"00000000-0000-0000-0000-000000000004","email":"carlos.santos@school.edu.ph"}',  'email','00000000-0000-0000-0000-000000000004',now(),now(),now()),
  (gen_random_uuid(),'00000000-0000-0000-0000-000000000005','{"sub":"00000000-0000-0000-0000-000000000005","email":"juan.delacruz@student.school.edu.ph"}','email','00000000-0000-0000-0000-000000000005',now(),now(),now()),
  (gen_random_uuid(),'00000000-0000-0000-0000-000000000006','{"sub":"00000000-0000-0000-0000-000000000006","email":"maria.santos@student.school.edu.ph"}', 'email','00000000-0000-0000-0000-000000000006',now(),now(),now()),
  (gen_random_uuid(),'00000000-0000-0000-0000-000000000007','{"sub":"00000000-0000-0000-0000-000000000007","email":"maria.delacruz@parent.school.edu.ph"}','email','00000000-0000-0000-0000-000000000007',now(),now(),now()),
  (gen_random_uuid(),'00000000-0000-0000-0000-000000000008','{"sub":"00000000-0000-0000-0000-000000000008","email":"registrar@school.edu.ph"}',      'email','00000000-0000-0000-0000-000000000008',now(),now(),now()),
  (gen_random_uuid(),'00000000-0000-0000-0000-000000000009','{"sub":"00000000-0000-0000-0000-000000000009","email":"cashier@school.edu.ph"}',        'email','00000000-0000-0000-0000-000000000009',now(),now(),now()),
  (gen_random_uuid(),'00000000-0000-0000-0000-000000000010','{"sub":"00000000-0000-0000-0000-000000000010","email":"counselor@school.edu.ph"}',      'email','00000000-0000-0000-0000-000000000010',now(),now(),now())
ON CONFLICT (provider_id, provider) DO NOTHING;

-- ======================== USERS ========================

INSERT INTO users (id, email, first_name, last_name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@school.edu.ph', 'Admin', 'User', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'principal@school.edu.ph', 'Dr. Elena', 'Reyes', 'principal'),
  ('00000000-0000-0000-0000-000000000003', 'rosa.montoya@school.edu.ph', 'Rosa Lina', 'Montoya', 'teacher'),
  ('00000000-0000-0000-0000-000000000004', 'carlos.santos@school.edu.ph', 'Carlos', 'Santos', 'teacher'),
  ('00000000-0000-0000-0000-000000000005', 'juan.delacruz@student.school.edu.ph', 'Juan', 'Dela Cruz', 'student'),
  ('00000000-0000-0000-0000-000000000006', 'maria.santos@student.school.edu.ph', 'Maria', 'Santos', 'student'),
  ('00000000-0000-0000-0000-000000000007', 'maria.delacruz@parent.school.edu.ph', 'Maria', 'Dela Cruz', 'parent'),
  ('00000000-0000-0000-0000-000000000008', 'registrar@school.edu.ph', 'Ana', 'Villanueva', 'registrar'),
  ('00000000-0000-0000-0000-000000000009', 'cashier@school.edu.ph', 'Carmen', 'Torres', 'cashier'),
  ('00000000-0000-0000-0000-000000000010', 'counselor@school.edu.ph', 'Sofia', 'Mendoza', 'counselor');

-- ======================== STUDENTS ========================

INSERT INTO students (id, user_id, lrn, first_name, middle_name, last_name, date_of_birth, gender, grade_level_id, section_id, status, guardian_name, guardian_contact, enrolled_date) VALUES
  (1, '00000000-0000-0000-0000-000000000005', '136482790001', 'Juan', 'Pedro', 'Dela Cruz', '2012-03-15', 'Male', 1, 1, 'Active', 'Maria Dela Cruz', '09171234567', '2024-06-15'),
  (2, '00000000-0000-0000-0000-000000000006', '136482790002', 'Maria', 'Ana', 'Santos', '2011-07-22', 'Female', 2, 2, 'Active', 'Jose Santos', '09181234568', '2024-06-15'),
  (3, NULL, '136482790003', 'Jose', 'Luis', 'Reyes', '2012-01-10', 'Male', 1, 1, 'Active', 'Elena Reyes', '09191234569', '2024-06-15'),
  (4, NULL, '136482790004', 'Ana', 'Marie', 'Garcia', '2011-11-05', 'Female', 2, 2, 'Active', 'Pedro Garcia', '09201234570', '2024-06-15'),
  (5, NULL, '136482790005', 'Pedro', 'Juan', 'Ramos', '2010-05-20', 'Male', 3, 3, 'Active', 'Rosa Ramos', '09211234571', '2024-06-15'),
  (6, NULL, '136482790006', 'Rosa', NULL, 'Lim', '2010-09-14', 'Female', 3, 3, 'Active', 'Carlos Lim', '09221234572', '2024-06-15'),
  (7, NULL, '136482790007', 'Carlos', 'Miguel', 'Torres', '2009-12-01', 'Male', 4, 4, 'Active', 'Carmen Torres', '09231234573', '2024-06-15'),
  (8, NULL, '136482790008', 'Sofia', 'Grace', 'Mendoza', '2009-08-18', 'Female', 4, 4, 'Active', 'Luis Mendoza', '09241234574', '2024-06-15'),
  (9, NULL, '136482790009', 'Luis', NULL, 'Villanueva', '2012-04-25', 'Male', 1, 1, 'Inactive', 'Ana Villanueva', '09251234575', '2024-06-15'),
  (10, NULL, '136482790010', 'Carmen', 'Rose', 'Cruz', '2011-06-30', 'Female', 2, 2, 'Active', 'Jose Cruz', '09261234576', '2024-06-15');

SELECT setval('students_id_seq', 10);

-- ======================== TEACHERS ========================

INSERT INTO teachers (id, user_id, employee_id, full_name, specialization, department, employment_type, status, date_hired, contact_number, email, base_salary, transport_allowance, rice_allowance, clothing_allowance) VALUES
  (1, '00000000-0000-0000-0000-000000000003', 'TCH-2020-001', 'Rosa Lina Montoya', 'Algebra & Geometry', 'Mathematics', 'Full-time', 'Active', '2020-06-01', '09171000001', 'rosa.montoya@school.edu.ph', 25000, 1500, 2000, 1000),
  (2, '00000000-0000-0000-0000-000000000004', 'TCH-2019-002', 'Carlos Santos', 'Biology & Chemistry', 'Science', 'Full-time', 'Active', '2019-06-01', '09171000002', 'carlos.santos@school.edu.ph', 27000, 1500, 2000, 1000),
  (3, NULL, 'TCH-2021-003', 'Elena Reyes', 'Philippine Literature', 'Filipino', 'Full-time', 'Active', '2021-06-01', '09171000003', 'elena.reyes@school.edu.ph', 24000, 1500, 2000, 1000),
  (4, NULL, 'TCH-2018-004', 'Jose Garcia', 'Grammar & Composition', 'English', 'Full-time', 'Active', '2018-06-01', '09171000004', 'jose.garcia@school.edu.ph', 28000, 1500, 2000, 1000),
  (5, NULL, 'TCH-2022-005', 'Ana Ramos', 'Philippine History', 'Araling Panlipunan', 'Full-time', 'Active', '2022-06-01', '09171000005', 'ana.ramos@school.edu.ph', 23000, 1500, 2000, 1000),
  (6, NULL, 'TCH-2020-006', 'Pedro Lim', 'Values Education', 'ESP', 'Part-time', 'Active', '2020-06-01', '09171000006', 'pedro.lim@school.edu.ph', 15000, 1000, 1500, 500),
  (7, NULL, 'TCH-2021-007', 'Maria Cruz', 'Music & Arts', 'MAPEH', 'Full-time', 'Active', '2021-06-01', '09171000007', 'maria.cruz@school.edu.ph', 24000, 1500, 2000, 1000),
  (8, NULL, 'TCH-2019-008', 'Luis Torres', 'Computer Technology', 'TLE', 'Full-time', 'Active', '2019-06-01', '09171000008', 'luis.torres@school.edu.ph', 26000, 1500, 2000, 1000);

SELECT setval('teachers_id_seq', 8);

-- ======================== PARENT CHILDREN ========================

INSERT INTO parent_children (parent_id, student_id) VALUES
  ('00000000-0000-0000-0000-000000000007', 1);  -- Maria Dela Cruz → Juan

-- ======================== TEACHER SECTIONS ========================
-- Rosa Montoya teaches Math in Rizal, Bonifacio, Mabini
-- Carlos Santos teaches Science in Mabini, Aguinaldo, Rizal, Bonifacio

INSERT INTO teacher_sections (teacher_id, section_id, subject_id) VALUES
  (1, 1, 3), (1, 2, 3), (1, 3, 3),           -- Rosa → Math in 3 sections
  (2, 3, 4), (2, 4, 4), (2, 1, 4), (2, 2, 4), -- Carlos → Science in 4 sections
  (3, 1, 1), (3, 2, 1),                        -- Elena → Filipino
  (4, 1, 2), (4, 2, 2), (4, 3, 2), (4, 4, 2), -- Jose → English
  (5, 1, 5), (5, 2, 5), (5, 3, 5),            -- Ana → AP
  (6, 1, 6), (6, 3, 6),                        -- Pedro → ESP
  (7, 1, 7), (7, 2, 7), (7, 3, 7), (7, 4, 7), -- Maria → MAPEH
  (8, 1, 8), (8, 2, 8), (8, 3, 8), (8, 4, 8); -- Luis → TLE

-- ======================== TEACHER SCHEDULES ========================

INSERT INTO teacher_schedules (teacher_id, section_id, subject_id, day_of_week, time_slot) VALUES
  (1, 1, 3, 'Monday', '07:30 - 08:30'),
  (1, 1, 3, 'Wednesday', '07:30 - 08:30'),
  (1, 2, 3, 'Monday', '08:30 - 09:30'),
  (1, 2, 3, 'Thursday', '08:30 - 09:30'),
  (1, 3, 3, 'Tuesday', '07:30 - 08:30'),
  (1, 3, 3, 'Friday', '07:30 - 08:30'),
  (2, 1, 4, 'Tuesday', '08:30 - 09:30'),
  (2, 1, 4, 'Thursday', '08:30 - 09:30'),
  (2, 2, 4, 'Monday', '09:30 - 10:30'),
  (2, 3, 4, 'Wednesday', '08:30 - 09:30'),
  (2, 4, 4, 'Friday', '08:30 - 09:30');

-- ======================== ATTENDANCE RECORDS + MARKS ========================
-- Sample: 2 days of attendance for section Rizal

INSERT INTO attendance_records (id, date, section_id, subject_id, saved_by, saved_at) VALUES
  (1, '2025-01-20', 1, 3, '00000000-0000-0000-0000-000000000003', '2025-01-20 08:30:00+08'),
  (2, '2025-01-21', 1, 3, '00000000-0000-0000-0000-000000000003', '2025-01-21 08:30:00+08');

SELECT setval('attendance_records_id_seq', 2);

INSERT INTO attendance_marks (attendance_record_id, student_id, status) VALUES
  -- Day 1
  (1, 1, 'present'), (1, 3, 'present'), (1, 9, 'absent'),
  -- Day 2
  (2, 1, 'late'), (2, 3, 'present'), (2, 9, 'absent');

-- ======================== GRADES ========================
-- Sample grades for Juan (student 1) and Maria (student 2)

INSERT INTO grades (student_id, subject_id, quarter, raw_score) VALUES
  -- Juan Dela Cruz (Grade 7 - Rizal)
  (1, 1, 'Q1', 85), (1, 1, 'Q2', 88), (1, 1, 'Q3', 82), (1, 1, 'Q4', 90),
  (1, 2, 'Q1', 90), (1, 2, 'Q2', 87), (1, 2, 'Q3', 92), (1, 2, 'Q4', 88),
  (1, 3, 'Q1', 78), (1, 3, 'Q2', 82), (1, 3, 'Q3', 80), (1, 3, 'Q4', 85),
  (1, 4, 'Q1', 88), (1, 4, 'Q2', 85), (1, 4, 'Q3', 90), (1, 4, 'Q4', 87),
  (1, 5, 'Q1', 92), (1, 5, 'Q2', 90), (1, 5, 'Q3', 88), (1, 5, 'Q4', 91),
  -- Maria Santos (Grade 8 - Bonifacio)
  (2, 1, 'Q1', 90), (2, 1, 'Q2', 92), (2, 1, 'Q3', 88), (2, 1, 'Q4', 95),
  (2, 2, 'Q1', 95), (2, 2, 'Q2', 93), (2, 2, 'Q3', 96), (2, 2, 'Q4', 94),
  (2, 3, 'Q1', 88), (2, 3, 'Q2', 90), (2, 3, 'Q3', 87), (2, 3, 'Q4', 92),
  (2, 4, 'Q1', 91), (2, 4, 'Q2', 89), (2, 4, 'Q3', 93), (2, 4, 'Q4', 90),
  (2, 5, 'Q1', 94), (2, 5, 'Q2', 96), (2, 5, 'Q3', 92), (2, 5, 'Q4', 95);

-- ======================== GRADE RELEASES ========================

INSERT INTO grade_releases (section_id, quarter, released) VALUES
  (1, 'Q1', true), (1, 'Q2', true), (1, 'Q3', false), (1, 'Q4', false),
  (2, 'Q1', true), (2, 'Q2', true), (2, 'Q3', false), (2, 'Q4', false),
  (3, 'Q1', true), (3, 'Q2', false), (3, 'Q3', false), (3, 'Q4', false),
  (4, 'Q1', true), (4, 'Q2', false), (4, 'Q3', false), (4, 'Q4', false);

-- ======================== FEE SCHEDULE ========================

INSERT INTO fee_schedule (grade_level_id, fee_type, amount, due_date, school_year) VALUES
  (1, 'Tuition', 5000, '2025-07-15', '2025-2026'),
  (1, 'Miscellaneous', 1500, '2025-07-15', '2025-2026'),
  (1, 'Laboratory', 800, '2025-07-15', '2025-2026'),
  (1, 'Computer Lab', 600, '2025-07-15', '2025-2026'),
  (1, 'Books & Modules', 2000, '2025-07-15', '2025-2026'),
  (1, 'ID & Card', 150, '2025-07-15', '2025-2026'),
  (2, 'Tuition', 5500, '2025-07-15', '2025-2026'),
  (2, 'Miscellaneous', 1500, '2025-07-15', '2025-2026'),
  (2, 'Laboratory', 900, '2025-07-15', '2025-2026'),
  (2, 'Computer Lab', 600, '2025-07-15', '2025-2026'),
  (2, 'Books & Modules', 2200, '2025-07-15', '2025-2026'),
  (2, 'ID & Card', 150, '2025-07-15', '2025-2026'),
  (3, 'Tuition', 6000, '2025-07-15', '2025-2026'),
  (3, 'Miscellaneous', 1500, '2025-07-15', '2025-2026'),
  (3, 'Laboratory', 1000, '2025-07-15', '2025-2026'),
  (3, 'Computer Lab', 700, '2025-07-15', '2025-2026'),
  (3, 'Books & Modules', 2500, '2025-07-15', '2025-2026'),
  (3, 'ID & Card', 150, '2025-07-15', '2025-2026'),
  (4, 'Tuition', 6500, '2025-07-15', '2025-2026'),
  (4, 'Miscellaneous', 1500, '2025-07-15', '2025-2026'),
  (4, 'Laboratory', 1000, '2025-07-15', '2025-2026'),
  (4, 'Computer Lab', 700, '2025-07-15', '2025-2026'),
  (4, 'Books & Modules', 2800, '2025-07-15', '2025-2026'),
  (4, 'ID & Card', 150, '2025-07-15', '2025-2026');

-- ======================== FEE RECORDS ========================

INSERT INTO fee_records (id, student_id, fee_type, amount_due, amount_paid, due_date, school_year) VALUES
  -- Juan (student 1, Grade 7)
  (1, 1, 'Tuition', 5000, 5000, '2025-07-15', '2025-2026'),
  (2, 1, 'Miscellaneous', 1500, 1500, '2025-07-15', '2025-2026'),
  (3, 1, 'Laboratory', 800, 0, '2025-07-15', '2025-2026'),
  -- Maria (student 2, Grade 8)
  (4, 2, 'Tuition', 5500, 3000, '2025-07-15', '2025-2026'),
  (5, 2, 'Miscellaneous', 1500, 1500, '2025-07-15', '2025-2026'),
  (6, 2, 'Laboratory', 900, 900, '2025-07-15', '2025-2026');

SELECT setval('fee_records_id_seq', 6);

-- ======================== FEE PAYMENTS ========================

INSERT INTO fee_payments (fee_record_id, amount, method, reference, date, recorded_by) VALUES
  (1, 5000, 'Cash', 'REF-001-ABC', '2025-07-10', '00000000-0000-0000-0000-000000000009'),
  (2, 1500, 'GCash', 'REF-002-DEF', '2025-07-10', '00000000-0000-0000-0000-000000000009'),
  (4, 3000, 'Bank Transfer', 'REF-003-GHI', '2025-07-12', '00000000-0000-0000-0000-000000000009'),
  (5, 1500, 'Cash', 'REF-004-JKL', '2025-07-12', '00000000-0000-0000-0000-000000000009'),
  (6, 900, 'Cash', 'REF-005-MNO', '2025-07-12', '00000000-0000-0000-0000-000000000009');

-- ======================== PAYSLIPS ========================

INSERT INTO payslips (teacher_id, period_id, period_label, gross_base, transport, rice, clothing, gross_pay, sss, philhealth, pagibig, tax, total_deductions, net_pay, status) VALUES
  (1, '2025-01-A', 'Jan 1-15, 2025', 12500, 750, 1000, 500, 14750, 562.50, 312.50, 100, 1250, 2225, 12525, 'released'),
  (1, '2025-01-B', 'Jan 16-31, 2025', 12500, 750, 1000, 500, 14750, 562.50, 312.50, 100, 1250, 2225, 12525, 'released'),
  (2, '2025-01-A', 'Jan 1-15, 2025', 13500, 750, 1000, 500, 15750, 607.50, 337.50, 100, 1350, 2395, 13355, 'released'),
  (2, '2025-01-B', 'Jan 16-31, 2025', 13500, 750, 1000, 500, 15750, 607.50, 337.50, 100, 1350, 2395, 13355, 'processed');

-- ======================== WELLNESS MOODS ========================

INSERT INTO wellness_moods (student_id, date, mood) VALUES
  (1, CURRENT_DATE, 'happy'),
  (1, CURRENT_DATE - 1, 'okay'),
  (1, CURRENT_DATE - 2, 'stressed'),
  (2, CURRENT_DATE, 'okay'),
  (2, CURRENT_DATE - 1, 'happy'),
  (3, CURRENT_DATE, 'sad'),
  (5, CURRENT_DATE, 'happy'),
  (7, CURRENT_DATE, 'angry');

-- ======================== BEHAVIOR INCIDENTS ========================

INSERT INTO behavior_incidents (id, student_id, type, category, description, action_taken, date, logged_by) VALUES
  (1, 1, 'Positive', 'Academic Excellence', 'Outstanding performance in Math quiz', 'Certificate of recognition', '2025-01-15', '00000000-0000-0000-0000-000000000003'),
  (2, 3, 'Negative', 'Tardiness', 'Late to class 3 times this week', 'Verbal warning issued', '2025-01-16', '00000000-0000-0000-0000-000000000003'),
  (3, 2, 'Positive', 'Leadership', 'Led group activity in Science class', 'Commendation noted', '2025-01-17', '00000000-0000-0000-0000-000000000004'),
  (4, 5, 'Negative', 'Disruptive Behavior', 'Talking during exam', 'Seat reassignment', '2025-01-18', '00000000-0000-0000-0000-000000000010'),
  (5, 1, 'Positive', 'Helpfulness', 'Assisted classmate with project', 'Positive note to parent', '2025-01-19', '00000000-0000-0000-0000-000000000003'),
  (6, 7, 'Neutral', 'Parent Conference', 'Scheduled meeting regarding academic performance', 'Conference set for Jan 25', '2025-01-20', '00000000-0000-0000-0000-000000000010');

SELECT setval('behavior_incidents_id_seq', 6);

-- ======================== COUNSELOR NOTES ========================

INSERT INTO counselor_notes (student_id, text, date, counselor, counselor_id) VALUES
  (1, 'Student shows strong academic motivation. Recommend advanced math program.', '2025-01-15', 'Sofia Mendoza', '00000000-0000-0000-0000-000000000010'),
  (3, 'Needs support with time management. Scheduled weekly check-ins.', '2025-01-16', 'Sofia Mendoza', '00000000-0000-0000-0000-000000000010'),
  (5, 'Discussed classroom behavior expectations. Student responsive.', '2025-01-18', 'Sofia Mendoza', '00000000-0000-0000-0000-000000000010');

-- ======================== ALUMNI ========================

INSERT INTO alumni (id, first_name, last_name, graduation_year, university, course, scholarship, profession, status, email, contact) VALUES
  (1, 'Angelo', 'Reyes', 2022, 'University of the Philippines', 'BS Computer Science', 'DOST Scholarship', 'Software Engineer', 'Employed', 'angelo.reyes@email.com', '09171112233'),
  (2, 'Patricia', 'Santos', 2022, 'Ateneo de Manila', 'AB Communication', 'None', NULL, 'In College', 'patricia.santos@email.com', '09181112244'),
  (3, 'Marco', 'Villanueva', 2021, 'De La Salle University', 'BS Accountancy', 'Academic Scholar', 'CPA', 'Employed', 'marco.v@email.com', '09191112255'),
  (4, 'Diana', 'Cruz', 2023, 'UST', 'BS Nursing', 'None', NULL, 'In College', 'diana.cruz@email.com', '09201112266'),
  (5, 'Rafael', 'Torres', 2020, 'PUP', 'BS Engineering', 'Merit Scholar', 'Civil Engineer', 'Employed', 'rafael.t@email.com', '09211112277');

SELECT setval('alumni_id_seq', 5);

-- ======================== ALUMNI ACHIEVEMENTS ========================

INSERT INTO alumni_achievements (alumni_id, achievement, date, type) VALUES
  (1, 'Promoted to Senior Developer at a major tech company', '2025-01-10', 'career'),
  (3, 'Passed CPA Board Exam with Top 10 ranking', '2024-11-15', 'board'),
  (5, 'Received Best Young Engineer Award', '2024-12-20', 'award'),
  (2, 'Dean''s List for 3 consecutive semesters', '2025-01-05', 'academic');

-- ======================== ANNOUNCEMENTS ========================

INSERT INTO announcements (id, title, body, audience, pinned, author, author_initials, author_id, read_count, expires_at, created_at) VALUES
  (1, 'Welcome Back to School Year 2025-2026',
    'Dear students, parents, and staff,\n\nWe are excited to welcome everyone back for the new school year. Classes begin on June 16, 2025.\n\nPlease ensure all enrollment requirements are submitted to the registrar''s office.\n\nGod bless!',
    'All', true, 'Dr. Elena Reyes', 'ER', '00000000-0000-0000-0000-000000000002', 245, '2025-07-31', '2025-06-01 08:00:00+08'),
  (2, 'Parent-Teacher Conference Schedule',
    'The first quarter parent-teacher conference will be held on October 18, 2025.\n\nTeachers will be available from 8:00 AM to 5:00 PM.\n\nPlease coordinate with your child''s adviser for appointment slots.',
    'Parents', false, 'Admin User', 'AU', '00000000-0000-0000-0000-000000000001', 180, '2025-10-20', '2025-10-01 09:00:00+08'),
  (3, 'Faculty Meeting - January 2025',
    'All teaching staff are required to attend the monthly faculty meeting on January 27, 2025 at 3:00 PM in the Conference Room.\n\nAgenda:\n1. Q2 grade submission deadline\n2. Science month preparations\n3. Professional development updates',
    'Teachers', false, 'Dr. Elena Reyes', 'ER', '00000000-0000-0000-0000-000000000002', 38, '2025-01-28', '2025-01-20 10:00:00+08'),
  (4, 'Intramurals 2025',
    'The annual intramurals will be held from February 10-14, 2025.\n\nAll students are encouraged to join. Sign up with your PE teacher.\n\nGo team!',
    'Students', true, 'Admin User', 'AU', '00000000-0000-0000-0000-000000000001', 195, '2025-02-15', '2025-01-25 14:00:00+08');

SELECT setval('announcements_id_seq', 4);

-- ======================== TIME LOGS ========================

INSERT INTO time_logs (user_id, role, user_name, date, time_in, time_out, status) VALUES
  ('00000000-0000-0000-0000-000000000003', 'teacher', 'Rosa Lina Montoya', CURRENT_DATE, '07:15', '16:30', 'on-time'),
  ('00000000-0000-0000-0000-000000000004', 'teacher', 'Carlos Santos', CURRENT_DATE, '07:45', '16:00', 'late'),
  ('00000000-0000-0000-0000-000000000003', 'teacher', 'Rosa Lina Montoya', CURRENT_DATE - 1, '07:20', '16:30', 'on-time'),
  ('00000000-0000-0000-0000-000000000004', 'teacher', 'Carlos Santos', CURRENT_DATE - 1, '07:28', '16:00', 'on-time');

-- ======================== NOTIFICATIONS ========================

INSERT INTO notifications (recipient_key, type, title, message, data, read) VALUES
  ('00000000-0000-0000-0000-000000000001', 'system', 'Welcome', 'Welcome to SchoolERP!', '{}', true),
  ('00000000-0000-0000-0000-000000000005', 'grade', 'Grades Released', 'Q1 grades for Grade 7 - Rizal have been released.', '{"quarter": "Q1", "section": "Rizal"}', false),
  ('00000000-0000-0000-0000-000000000007', 'attendance', 'Absence Alert', 'Your child Juan Dela Cruz was marked late on Jan 21.', '{"studentId": 1, "date": "2025-01-21"}', false);
