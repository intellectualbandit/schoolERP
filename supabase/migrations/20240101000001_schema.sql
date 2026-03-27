-- ============================================================
-- SchoolERP Database Schema
-- Run this first in Supabase SQL Editor
-- ============================================================

-- ======================== ENUMS ========================

CREATE TYPE user_role AS ENUM (
  'admin', 'principal', 'teacher', 'student', 'parent', 'registrar', 'cashier', 'counselor'
);

CREATE TYPE student_status AS ENUM ('Active', 'Inactive');

CREATE TYPE teacher_status AS ENUM ('Active', 'Inactive');

CREATE TYPE employment_type AS ENUM ('Full-time', 'Part-time');

CREATE TYPE attendance_status AS ENUM ('present', 'late', 'absent', 'excused');

CREATE TYPE excuse_status AS ENUM ('pending', 'approved', 'denied');

CREATE TYPE fee_type AS ENUM ('Tuition', 'Miscellaneous', 'Laboratory', 'Computer Lab', 'Books & Modules', 'ID & Card');

CREATE TYPE payment_method AS ENUM ('Cash', 'GCash', 'Bank Transfer', 'Check');

CREATE TYPE incident_type AS ENUM ('Positive', 'Negative', 'Neutral');

CREATE TYPE mood_key AS ENUM ('happy', 'okay', 'sad', 'stressed', 'angry');

CREATE TYPE alumni_status AS ENUM ('Employed', 'In College', 'Unemployed', 'Unknown');

CREATE TYPE announcement_audience AS ENUM ('All', 'Teachers', 'Parents', 'Students', 'Admin');

CREATE TYPE quarter_label AS ENUM ('Q1', 'Q2', 'Q3', 'Q4');

CREATE TYPE payslip_status AS ENUM ('pending', 'processed', 'released');

-- ======================== CONFIG TABLES ========================

CREATE TABLE school_config (
  id          INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- singleton row
  school_year TEXT NOT NULL DEFAULT '2025-2026',
  quarters    TEXT[] NOT NULL DEFAULT ARRAY['Q1','Q2','Q3','Q4'],
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE grade_levels (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,       -- 'Grade 7', 'Grade 8', etc.
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sections (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL UNIQUE,    -- 'Rizal', 'Bonifacio', etc.
  grade_level_id INT NOT NULL REFERENCES grade_levels(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subjects (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,        -- 'Filipino', 'English', etc.
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ======================== PEOPLE TABLES ========================

CREATE TABLE users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  role          user_role NOT NULL,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE students (
  id              SERIAL PRIMARY KEY,
  user_id         UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  lrn             TEXT NOT NULL UNIQUE,      -- Learner Reference Number
  first_name      TEXT NOT NULL,
  middle_name     TEXT,
  last_name       TEXT NOT NULL,
  date_of_birth   DATE,
  gender          TEXT,                       -- 'Male', 'Female'
  grade_level_id  INT NOT NULL REFERENCES grade_levels(id),
  section_id      INT NOT NULL REFERENCES sections(id),
  status          student_status NOT NULL DEFAULT 'Active',
  guardian_name   TEXT,
  guardian_contact TEXT,
  enrolled_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE teachers (
  id              SERIAL PRIMARY KEY,
  user_id         UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  employee_id     TEXT NOT NULL UNIQUE,       -- 'TCH-YYYY-###'
  full_name       TEXT NOT NULL,
  specialization  TEXT,
  department      TEXT,
  employment_type employment_type NOT NULL DEFAULT 'Full-time',
  status          teacher_status NOT NULL DEFAULT 'Active',
  date_hired      DATE,
  contact_number  TEXT,
  email           TEXT,
  base_salary     NUMERIC(10,2) DEFAULT 0,
  transport_allowance NUMERIC(10,2) DEFAULT 0,
  rice_allowance  NUMERIC(10,2) DEFAULT 0,
  clothing_allowance NUMERIC(10,2) DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE parent_children (
  id         SERIAL PRIMARY KEY,
  parent_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE(parent_id, student_id)
);

-- ======================== ACADEMIC TABLES ========================

CREATE TABLE teacher_sections (
  id         SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  section_id INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE(teacher_id, section_id, subject_id)
);

CREATE TABLE teacher_schedules (
  id         SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  section_id INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL,             -- 'Monday', 'Tuesday', etc.
  time_slot  TEXT NOT NULL               -- '07:30 - 08:30'
);

CREATE TABLE attendance_records (
  id         SERIAL PRIMARY KEY,
  date       DATE NOT NULL,
  section_id INT NOT NULL REFERENCES sections(id),
  subject_id INT REFERENCES subjects(id),
  saved_by   UUID REFERENCES users(id),
  saved_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(date, section_id, subject_id)
);

CREATE TABLE attendance_marks (
  id                   SERIAL PRIMARY KEY,
  attendance_record_id INT NOT NULL REFERENCES attendance_records(id) ON DELETE CASCADE,
  student_id           INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status               attendance_status NOT NULL DEFAULT 'present',
  UNIQUE(attendance_record_id, student_id)
);

CREATE TABLE excuse_requests (
  id            SERIAL PRIMARY KEY,
  student_id    INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date          DATE NOT NULL,
  section_id    INT NOT NULL REFERENCES sections(id),
  subject_id    INT REFERENCES subjects(id),
  reason        TEXT NOT NULL,
  note          TEXT,
  status        excuse_status NOT NULL DEFAULT 'pending',
  parent_id     UUID REFERENCES users(id),
  reviewed_by   UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE grades (
  id         SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  quarter    quarter_label NOT NULL,
  raw_score  NUMERIC(5,2),
  UNIQUE(student_id, subject_id, quarter)
);

CREATE TABLE grade_releases (
  id         SERIAL PRIMARY KEY,
  section_id INT NOT NULL REFERENCES sections(id),
  quarter    quarter_label NOT NULL,
  released   BOOLEAN NOT NULL DEFAULT false,
  released_by UUID REFERENCES users(id),
  released_at TIMESTAMPTZ,
  UNIQUE(section_id, quarter)
);

-- ======================== FINANCE TABLES ========================

CREATE TABLE fee_schedule (
  id             SERIAL PRIMARY KEY,
  grade_level_id INT NOT NULL REFERENCES grade_levels(id),
  fee_type       fee_type NOT NULL,
  amount         NUMERIC(10,2) NOT NULL,
  due_date       DATE,
  school_year    TEXT NOT NULL DEFAULT '2025-2026',
  UNIQUE(grade_level_id, fee_type, school_year)
);

CREATE TABLE fee_records (
  id          SERIAL PRIMARY KEY,
  student_id  INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_type    fee_type NOT NULL,
  amount_due  NUMERIC(10,2) NOT NULL,
  amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
  due_date    DATE,
  school_year TEXT NOT NULL DEFAULT '2025-2026',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE fee_payments (
  id            SERIAL PRIMARY KEY,
  fee_record_id INT NOT NULL REFERENCES fee_records(id) ON DELETE CASCADE,
  amount        NUMERIC(10,2) NOT NULL,
  method        payment_method NOT NULL DEFAULT 'Cash',
  reference     TEXT,                   -- 'REF-###-XXX'
  date          DATE NOT NULL DEFAULT CURRENT_DATE,
  recorded_by   UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payslips (
  id             SERIAL PRIMARY KEY,
  teacher_id     INT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  period_id      TEXT NOT NULL,          -- 'YYYY-MM-A' or 'YYYY-MM-B'
  period_label   TEXT NOT NULL,
  gross_base     NUMERIC(10,2) NOT NULL,
  transport      NUMERIC(10,2) DEFAULT 0,
  rice           NUMERIC(10,2) DEFAULT 0,
  clothing       NUMERIC(10,2) DEFAULT 0,
  gross_pay      NUMERIC(10,2) NOT NULL,
  sss            NUMERIC(10,2) DEFAULT 0,
  philhealth     NUMERIC(10,2) DEFAULT 0,
  pagibig        NUMERIC(10,2) DEFAULT 0,
  tax            NUMERIC(10,2) DEFAULT 0,
  total_deductions NUMERIC(10,2) DEFAULT 0,
  net_pay        NUMERIC(10,2) NOT NULL,
  status         payslip_status NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, period_id)
);

-- ======================== WELLNESS / BEHAVIOR ========================

CREATE TABLE wellness_moods (
  id         SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date       DATE NOT NULL DEFAULT CURRENT_DATE,
  mood       mood_key NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, date)
);

CREATE TABLE behavior_incidents (
  id           SERIAL PRIMARY KEY,
  student_id   INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type         incident_type NOT NULL,
  category     TEXT NOT NULL,
  description  TEXT,
  action_taken TEXT,
  date         DATE NOT NULL DEFAULT CURRENT_DATE,
  logged_by    UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE counselor_notes (
  id          SERIAL PRIMARY KEY,
  student_id  INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  counselor   TEXT,
  counselor_id UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ======================== OTHER TABLES ========================

CREATE TABLE alumni (
  id              SERIAL PRIMARY KEY,
  student_id      INT REFERENCES students(id) ON DELETE SET NULL,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  graduation_year INT NOT NULL,
  university      TEXT,
  course          TEXT,
  scholarship     TEXT DEFAULT 'None',
  profession      TEXT,
  status          alumni_status NOT NULL DEFAULT 'Unknown',
  email           TEXT,
  contact         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE alumni_achievements (
  id          SERIAL PRIMARY KEY,
  alumni_id   INT NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
  achievement TEXT NOT NULL,
  date        DATE,
  type        TEXT,              -- 'career', 'board', 'award', 'academic'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE announcements (
  id             SERIAL PRIMARY KEY,
  title          TEXT NOT NULL,
  body           TEXT NOT NULL,
  audience       announcement_audience NOT NULL DEFAULT 'All',
  pinned         BOOLEAN NOT NULL DEFAULT false,
  author         TEXT NOT NULL,
  author_initials TEXT,
  author_id      UUID REFERENCES users(id),
  read_count     INT NOT NULL DEFAULT 0,
  expires_at     DATE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE time_logs (
  id        SERIAL PRIMARY KEY,
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role      user_role NOT NULL,
  user_name TEXT NOT NULL,
  date      DATE NOT NULL DEFAULT CURRENT_DATE,
  time_in   TIME,
  time_out  TIME,
  status    TEXT NOT NULL DEFAULT 'on-time',  -- 'on-time', 'late'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE TABLE notifications (
  id             SERIAL PRIMARY KEY,
  recipient_key  TEXT NOT NULL,           -- user ID or role key
  type           TEXT NOT NULL,
  title          TEXT NOT NULL,
  message        TEXT,
  data           JSONB DEFAULT '{}',
  read           BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ======================== INDEXES ========================

-- Students
CREATE INDEX idx_students_grade ON students(grade_level_id);
CREATE INDEX idx_students_section ON students(section_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_user ON students(user_id);

-- Teachers
CREATE INDEX idx_teachers_user ON teachers(user_id);
CREATE INDEX idx_teachers_status ON teachers(status);

-- Parent-children
CREATE INDEX idx_parent_children_parent ON parent_children(parent_id);
CREATE INDEX idx_parent_children_student ON parent_children(student_id);

-- Teacher sections/schedules
CREATE INDEX idx_teacher_sections_teacher ON teacher_sections(teacher_id);
CREATE INDEX idx_teacher_sections_section ON teacher_sections(section_id);
CREATE INDEX idx_teacher_schedules_teacher ON teacher_schedules(teacher_id);

-- Attendance
CREATE INDEX idx_attendance_records_date ON attendance_records(date);
CREATE INDEX idx_attendance_records_section ON attendance_records(section_id);
CREATE INDEX idx_attendance_marks_student ON attendance_marks(student_id);
CREATE INDEX idx_attendance_marks_record ON attendance_marks(attendance_record_id);

-- Excuse requests
CREATE INDEX idx_excuse_requests_student ON excuse_requests(student_id);
CREATE INDEX idx_excuse_requests_status ON excuse_requests(status);
CREATE INDEX idx_excuse_requests_parent ON excuse_requests(parent_id);

-- Grades
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_subject ON grades(subject_id);
CREATE INDEX idx_grades_quarter ON grades(quarter);

-- Grade releases
CREATE INDEX idx_grade_releases_section ON grade_releases(section_id);

-- Fee records/payments
CREATE INDEX idx_fee_records_student ON fee_records(student_id);
CREATE INDEX idx_fee_payments_record ON fee_payments(fee_record_id);

-- Payslips
CREATE INDEX idx_payslips_teacher ON payslips(teacher_id);
CREATE INDEX idx_payslips_period ON payslips(period_id);

-- Wellness/behavior
CREATE INDEX idx_wellness_moods_student ON wellness_moods(student_id);
CREATE INDEX idx_wellness_moods_date ON wellness_moods(date);
CREATE INDEX idx_behavior_incidents_student ON behavior_incidents(student_id);
CREATE INDEX idx_behavior_incidents_type ON behavior_incidents(type);

-- Counselor notes
CREATE INDEX idx_counselor_notes_student ON counselor_notes(student_id);

-- Alumni
CREATE INDEX idx_alumni_year ON alumni(graduation_year);
CREATE INDEX idx_alumni_achievements_alumni ON alumni_achievements(alumni_id);

-- Announcements
CREATE INDEX idx_announcements_audience ON announcements(audience);
CREATE INDEX idx_announcements_pinned ON announcements(pinned);
CREATE INDEX idx_announcements_created ON announcements(created_at DESC);

-- Time logs
CREATE INDEX idx_time_logs_user ON time_logs(user_id);
CREATE INDEX idx_time_logs_date ON time_logs(date);

-- Notifications
CREATE INDEX idx_notifications_recipient ON notifications(recipient_key);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ======================== TRIGGERS ========================

-- Auto-update updated_at columns
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON school_config
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON fee_records
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON payslips
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON excuse_requests
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON alumni
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
