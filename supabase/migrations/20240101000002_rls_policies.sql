-- ============================================================
-- Row Level Security Policies
-- Run after 001_schema.sql
-- ============================================================

-- Helper: get current user's role from users table
CREATE OR REPLACE FUNCTION auth_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: get current user's teacher_id
CREATE OR REPLACE FUNCTION auth_teacher_id()
RETURNS INT AS $$
  SELECT id FROM teachers WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: get current user's student_id
CREATE OR REPLACE FUNCTION auth_student_id()
RETURNS INT AS $$
  SELECT id FROM students WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: get section IDs assigned to current teacher
CREATE OR REPLACE FUNCTION auth_teacher_section_ids()
RETURNS SETOF INT AS $$
  SELECT DISTINCT section_id FROM teacher_sections WHERE teacher_id = auth_teacher_id();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: get student IDs for current parent
CREATE OR REPLACE FUNCTION auth_parent_child_ids()
RETURNS SETOF INT AS $$
  SELECT student_id FROM parent_children WHERE parent_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ======================== ENABLE RLS ========================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE excuse_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselor_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- ======================== CONFIG TABLES (read by all, write by admin) ========================

-- school_config
CREATE POLICY "Anyone can read config" ON school_config FOR SELECT USING (true);
CREATE POLICY "Admin can update config" ON school_config FOR UPDATE USING (auth_role() = 'admin');
CREATE POLICY "Admin can insert config" ON school_config FOR INSERT WITH CHECK (auth_role() = 'admin');

-- grade_levels
CREATE POLICY "Anyone can read grade_levels" ON grade_levels FOR SELECT USING (true);
CREATE POLICY "Admin can manage grade_levels" ON grade_levels FOR ALL USING (auth_role() = 'admin');

-- sections
CREATE POLICY "Anyone can read sections" ON sections FOR SELECT USING (true);
CREATE POLICY "Admin can manage sections" ON sections FOR ALL USING (auth_role() = 'admin');

-- subjects
CREATE POLICY "Anyone can read subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Admin can manage subjects" ON subjects FOR ALL USING (auth_role() = 'admin');

-- ======================== USERS ========================

CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admin full access to users" ON users FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Principal can read all users" ON users FOR SELECT USING (auth_role() = 'principal');
CREATE POLICY "Staff can read users" ON users FOR SELECT USING (
  auth_role() IN ('teacher', 'registrar', 'cashier', 'counselor')
);

-- ======================== STUDENTS ========================

CREATE POLICY "Admin full access students" ON students FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Registrar manage students" ON students FOR ALL USING (auth_role() = 'registrar');
CREATE POLICY "Principal read students" ON students FOR SELECT USING (auth_role() = 'principal');
CREATE POLICY "Teacher read assigned students" ON students FOR SELECT USING (
  auth_role() = 'teacher' AND section_id IN (SELECT auth_teacher_section_ids())
);
CREATE POLICY "Student read own" ON students FOR SELECT USING (
  auth_role() = 'student' AND user_id = auth.uid()
);
CREATE POLICY "Parent read children" ON students FOR SELECT USING (
  auth_role() = 'parent' AND id IN (SELECT auth_parent_child_ids())
);
CREATE POLICY "Counselor read students" ON students FOR SELECT USING (auth_role() = 'counselor');
CREATE POLICY "Cashier read students" ON students FOR SELECT USING (auth_role() = 'cashier');

-- ======================== TEACHERS ========================

CREATE POLICY "Admin full access teachers" ON teachers FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Principal read teachers" ON teachers FOR SELECT USING (auth_role() = 'principal');
CREATE POLICY "Teacher read own" ON teachers FOR SELECT USING (
  auth_role() = 'teacher' AND user_id = auth.uid()
);
CREATE POLICY "Registrar read teachers" ON teachers FOR SELECT USING (auth_role() = 'registrar');
CREATE POLICY "Counselor read teachers" ON teachers FOR SELECT USING (auth_role() = 'counselor');

-- ======================== PARENT_CHILDREN ========================

CREATE POLICY "Admin full access parent_children" ON parent_children FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Parent read own links" ON parent_children FOR SELECT USING (parent_id = auth.uid());
CREATE POLICY "Registrar manage parent_children" ON parent_children FOR ALL USING (auth_role() = 'registrar');

-- ======================== TEACHER_SECTIONS ========================

CREATE POLICY "Admin full access teacher_sections" ON teacher_sections FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Teacher read own sections" ON teacher_sections FOR SELECT USING (
  auth_role() = 'teacher' AND teacher_id = auth_teacher_id()
);
CREATE POLICY "Principal read teacher_sections" ON teacher_sections FOR SELECT USING (auth_role() = 'principal');
CREATE POLICY "Anyone can read teacher_sections" ON teacher_sections FOR SELECT USING (true);

-- ======================== TEACHER_SCHEDULES ========================

CREATE POLICY "Admin full access schedules" ON teacher_schedules FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Teacher read own schedule" ON teacher_schedules FOR SELECT USING (
  auth_role() = 'teacher' AND teacher_id = auth_teacher_id()
);
CREATE POLICY "Anyone can read schedules" ON teacher_schedules FOR SELECT USING (true);

-- ======================== ATTENDANCE ========================

-- attendance_records
CREATE POLICY "Admin full access attendance_records" ON attendance_records FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Teacher manage assigned attendance" ON attendance_records FOR ALL USING (
  auth_role() = 'teacher' AND section_id IN (SELECT auth_teacher_section_ids())
);
CREATE POLICY "Principal read attendance" ON attendance_records FOR SELECT USING (auth_role() = 'principal');
CREATE POLICY "Registrar read attendance" ON attendance_records FOR SELECT USING (auth_role() = 'registrar');
CREATE POLICY "Student read own section attendance" ON attendance_records FOR SELECT USING (
  auth_role() = 'student' AND section_id = (SELECT section_id FROM students WHERE user_id = auth.uid())
);
CREATE POLICY "Parent read child section attendance" ON attendance_records FOR SELECT USING (
  auth_role() = 'parent' AND section_id IN (
    SELECT section_id FROM students WHERE id IN (SELECT auth_parent_child_ids())
  )
);
CREATE POLICY "Counselor read attendance" ON attendance_records FOR SELECT USING (auth_role() = 'counselor');

-- attendance_marks
CREATE POLICY "Admin full access attendance_marks" ON attendance_marks FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Teacher manage assigned marks" ON attendance_marks FOR ALL USING (
  auth_role() = 'teacher' AND attendance_record_id IN (
    SELECT id FROM attendance_records WHERE section_id IN (SELECT auth_teacher_section_ids())
  )
);
CREATE POLICY "Principal read marks" ON attendance_marks FOR SELECT USING (auth_role() = 'principal');
CREATE POLICY "Student read own marks" ON attendance_marks FOR SELECT USING (
  auth_role() = 'student' AND student_id = auth_student_id()
);
CREATE POLICY "Parent read child marks" ON attendance_marks FOR SELECT USING (
  auth_role() = 'parent' AND student_id IN (SELECT auth_parent_child_ids())
);
CREATE POLICY "Registrar read marks" ON attendance_marks FOR SELECT USING (auth_role() = 'registrar');
CREATE POLICY "Counselor read marks" ON attendance_marks FOR SELECT USING (auth_role() = 'counselor');

-- ======================== EXCUSE REQUESTS ========================

CREATE POLICY "Admin full access excuses" ON excuse_requests FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Parent manage own excuses" ON excuse_requests FOR ALL USING (
  auth_role() = 'parent' AND parent_id = auth.uid()
);
CREATE POLICY "Teacher read/update assigned excuses" ON excuse_requests FOR SELECT USING (
  auth_role() = 'teacher' AND section_id IN (SELECT auth_teacher_section_ids())
);
CREATE POLICY "Teacher update excuses" ON excuse_requests FOR UPDATE USING (
  auth_role() = 'teacher' AND section_id IN (SELECT auth_teacher_section_ids())
);
CREATE POLICY "Principal read excuses" ON excuse_requests FOR SELECT USING (auth_role() = 'principal');

-- ======================== GRADES ========================

CREATE POLICY "Admin full access grades" ON grades FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Teacher manage assigned grades" ON grades FOR ALL USING (
  auth_role() = 'teacher' AND student_id IN (
    SELECT s.id FROM students s WHERE s.section_id IN (SELECT auth_teacher_section_ids())
  )
);
CREATE POLICY "Principal read grades" ON grades FOR SELECT USING (auth_role() = 'principal');
CREATE POLICY "Registrar read grades" ON grades FOR SELECT USING (auth_role() = 'registrar');
CREATE POLICY "Student read own grades" ON grades FOR SELECT USING (
  auth_role() = 'student' AND student_id = auth_student_id()
);
CREATE POLICY "Parent read child grades" ON grades FOR SELECT USING (
  auth_role() = 'parent' AND student_id IN (SELECT auth_parent_child_ids())
);
CREATE POLICY "Counselor read grades" ON grades FOR SELECT USING (auth_role() = 'counselor');

-- grade_releases
CREATE POLICY "Admin full access grade_releases" ON grade_releases FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Teacher manage assigned releases" ON grade_releases FOR ALL USING (
  auth_role() = 'teacher' AND section_id IN (SELECT auth_teacher_section_ids())
);
CREATE POLICY "Anyone can read releases" ON grade_releases FOR SELECT USING (true);

-- ======================== FINANCE ========================

-- fee_schedule
CREATE POLICY "Anyone can read fee_schedule" ON fee_schedule FOR SELECT USING (true);
CREATE POLICY "Admin manage fee_schedule" ON fee_schedule FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Cashier manage fee_schedule" ON fee_schedule FOR ALL USING (auth_role() = 'cashier');

-- fee_records
CREATE POLICY "Admin full access fee_records" ON fee_records FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Cashier manage fee_records" ON fee_records FOR ALL USING (auth_role() = 'cashier');
CREATE POLICY "Principal read fee_records" ON fee_records FOR SELECT USING (auth_role() = 'principal');
CREATE POLICY "Student read own fees" ON fee_records FOR SELECT USING (
  auth_role() = 'student' AND student_id = auth_student_id()
);
CREATE POLICY "Parent read child fees" ON fee_records FOR SELECT USING (
  auth_role() = 'parent' AND student_id IN (SELECT auth_parent_child_ids())
);

-- fee_payments
CREATE POLICY "Admin full access fee_payments" ON fee_payments FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Cashier manage fee_payments" ON fee_payments FOR ALL USING (auth_role() = 'cashier');
CREATE POLICY "Principal read fee_payments" ON fee_payments FOR SELECT USING (auth_role() = 'principal');
CREATE POLICY "Student read own payments" ON fee_payments FOR SELECT USING (
  auth_role() = 'student' AND fee_record_id IN (
    SELECT id FROM fee_records WHERE student_id = auth_student_id()
  )
);
CREATE POLICY "Parent read child payments" ON fee_payments FOR SELECT USING (
  auth_role() = 'parent' AND fee_record_id IN (
    SELECT id FROM fee_records WHERE student_id IN (SELECT auth_parent_child_ids())
  )
);

-- ======================== PAYSLIPS ========================

CREATE POLICY "Admin full access payslips" ON payslips FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Teacher read own payslips" ON payslips FOR SELECT USING (
  auth_role() = 'teacher' AND teacher_id = auth_teacher_id()
);

-- ======================== WELLNESS ========================

CREATE POLICY "Admin full access moods" ON wellness_moods FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Counselor full access moods" ON wellness_moods FOR ALL USING (auth_role() = 'counselor');
CREATE POLICY "Student manage own mood" ON wellness_moods FOR ALL USING (
  auth_role() = 'student' AND student_id = auth_student_id()
);
CREATE POLICY "Teacher read assigned moods" ON wellness_moods FOR SELECT USING (
  auth_role() = 'teacher' AND student_id IN (
    SELECT s.id FROM students s WHERE s.section_id IN (SELECT auth_teacher_section_ids())
  )
);
CREATE POLICY "Principal read moods" ON wellness_moods FOR SELECT USING (auth_role() = 'principal');

-- counselor_notes
CREATE POLICY "Admin full access notes" ON counselor_notes FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Counselor manage notes" ON counselor_notes FOR ALL USING (auth_role() = 'counselor');
CREATE POLICY "Principal read notes" ON counselor_notes FOR SELECT USING (auth_role() = 'principal');

-- ======================== BEHAVIOR ========================

CREATE POLICY "Admin full access incidents" ON behavior_incidents FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Counselor manage incidents" ON behavior_incidents FOR ALL USING (auth_role() = 'counselor');
CREATE POLICY "Teacher manage assigned incidents" ON behavior_incidents FOR ALL USING (
  auth_role() = 'teacher' AND student_id IN (
    SELECT s.id FROM students s WHERE s.section_id IN (SELECT auth_teacher_section_ids())
  )
);
CREATE POLICY "Principal read incidents" ON behavior_incidents FOR SELECT USING (auth_role() = 'principal');
CREATE POLICY "Parent read child incidents" ON behavior_incidents FOR SELECT USING (
  auth_role() = 'parent' AND student_id IN (SELECT auth_parent_child_ids())
);

-- ======================== ALUMNI ========================

CREATE POLICY "Admin full access alumni" ON alumni FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Registrar manage alumni" ON alumni FOR ALL USING (auth_role() = 'registrar');
CREATE POLICY "Principal read alumni" ON alumni FOR SELECT USING (auth_role() = 'principal');
CREATE POLICY "Anyone can read alumni" ON alumni FOR SELECT USING (true);

CREATE POLICY "Admin full access achievements" ON alumni_achievements FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Registrar manage achievements" ON alumni_achievements FOR ALL USING (auth_role() = 'registrar');
CREATE POLICY "Anyone can read achievements" ON alumni_achievements FOR SELECT USING (true);

-- ======================== ANNOUNCEMENTS ========================

CREATE POLICY "Admin full access announcements" ON announcements FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Principal manage announcements" ON announcements FOR ALL USING (auth_role() = 'principal');
CREATE POLICY "Teacher create announcements" ON announcements FOR INSERT WITH CHECK (auth_role() = 'teacher');
CREATE POLICY "Teacher read announcements" ON announcements FOR SELECT USING (
  auth_role() = 'teacher' AND (audience IN ('All', 'Teachers') OR author_id = auth.uid())
);
CREATE POLICY "Student read announcements" ON announcements FOR SELECT USING (
  auth_role() = 'student' AND audience IN ('All', 'Students')
);
CREATE POLICY "Parent read announcements" ON announcements FOR SELECT USING (
  auth_role() = 'parent' AND audience IN ('All', 'Parents')
);
CREATE POLICY "Cashier read announcements" ON announcements FOR SELECT USING (
  auth_role() = 'cashier' AND audience IN ('All', 'Admin')
);
CREATE POLICY "Registrar read announcements" ON announcements FOR SELECT USING (
  auth_role() = 'registrar' AND audience IN ('All', 'Admin')
);
CREATE POLICY "Counselor read announcements" ON announcements FOR SELECT USING (
  auth_role() = 'counselor' AND audience IN ('All', 'Admin')
);

-- ======================== TIME LOGS ========================

CREATE POLICY "Admin full access time_logs" ON time_logs FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Principal read time_logs" ON time_logs FOR SELECT USING (auth_role() = 'principal');
CREATE POLICY "User manage own time_log" ON time_logs FOR ALL USING (user_id = auth.uid());

-- ======================== NOTIFICATIONS ========================

CREATE POLICY "Admin full access notifications" ON notifications FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "User read own notifications" ON notifications FOR SELECT USING (
  recipient_key = auth.uid()::text OR recipient_key = auth_role()::text
);
CREATE POLICY "User update own notifications" ON notifications FOR UPDATE USING (
  recipient_key = auth.uid()::text OR recipient_key = auth_role()::text
);
CREATE POLICY "Authenticated insert notifications" ON notifications FOR INSERT WITH CHECK (true);
