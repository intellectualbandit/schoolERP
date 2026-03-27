-- ============================================================
-- Postgres Functions
-- Run after 001-003
-- ============================================================

-- ======================== TRANSMUTE GRADE ========================
-- DepEd transmutation table: raw score (0-100) → transmuted grade (60-100)

CREATE OR REPLACE FUNCTION transmute_grade(raw_score NUMERIC)
RETURNS NUMERIC AS $$
DECLARE
  transmutation_table NUMERIC[][] := ARRAY[
    [100, 100], [98.40, 99], [96.80, 98], [95.20, 97], [93.60, 96],
    [92.00, 95], [90.40, 94], [88.80, 93], [87.20, 92], [85.60, 91],
    [84.00, 90], [82.40, 89], [80.80, 88], [79.20, 87], [77.60, 86],
    [76.00, 85], [74.40, 84], [72.80, 83], [71.20, 82], [69.60, 81],
    [68.00, 80], [66.40, 79], [64.80, 78], [63.20, 77], [61.60, 76],
    [60.00, 75], [56.00, 74], [52.00, 73], [48.00, 72], [44.00, 71],
    [40.00, 70], [36.00, 69], [32.00, 68], [28.00, 67], [24.00, 66],
    [20.00, 65], [16.00, 64], [12.00, 63], [8.00, 62], [4.00, 61],
    [0, 60]
  ];
  i INT;
BEGIN
  IF raw_score IS NULL THEN RETURN NULL; END IF;
  IF raw_score >= 100 THEN RETURN 100; END IF;
  IF raw_score <= 0 THEN RETURN 60; END IF;

  FOR i IN 1..array_length(transmutation_table, 1) LOOP
    IF raw_score >= transmutation_table[i][1] THEN
      RETURN transmutation_table[i][2];
    END IF;
  END LOOP;

  RETURN 60;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ======================== FEE PENALTY ========================
-- 2% monthly penalty on overdue balance

CREATE OR REPLACE FUNCTION calc_fee_penalty(
  balance NUMERIC,
  due_date DATE
)
RETURNS NUMERIC AS $$
DECLARE
  months_overdue INT;
  penalty NUMERIC;
BEGIN
  IF balance <= 0 OR due_date IS NULL OR CURRENT_DATE <= due_date THEN
    RETURN 0;
  END IF;

  months_overdue := GREATEST(1,
    (EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM due_date)) * 12 +
    (EXTRACT(MONTH FROM CURRENT_DATE) - EXTRACT(MONTH FROM due_date))
  );

  penalty := balance * 0.02 * months_overdue;
  RETURN ROUND(penalty, 2);
END;
$$ LANGUAGE plpgsql STABLE;

-- ======================== ATTENDANCE STATS ========================
-- Returns present/late/absent/excused counts for a student in a date range

CREATE OR REPLACE FUNCTION get_attendance_stats(
  p_student_id INT,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  total_days BIGINT,
  present_count BIGINT,
  late_count BIGINT,
  absent_count BIGINT,
  excused_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_days,
    COUNT(*) FILTER (WHERE am.status = 'present')::BIGINT AS present_count,
    COUNT(*) FILTER (WHERE am.status = 'late')::BIGINT AS late_count,
    COUNT(*) FILTER (WHERE am.status = 'absent')::BIGINT AS absent_count,
    COUNT(*) FILTER (WHERE am.status = 'excused')::BIGINT AS excused_count
  FROM attendance_marks am
  JOIN attendance_records ar ON ar.id = am.attendance_record_id
  WHERE am.student_id = p_student_id
    AND (p_start_date IS NULL OR ar.date >= p_start_date)
    AND (p_end_date IS NULL OR ar.date <= p_end_date);
END;
$$ LANGUAGE plpgsql STABLE;

-- ======================== STUDENT GRADE SUMMARY ========================
-- Returns all grades for a student with transmuted values

CREATE OR REPLACE FUNCTION get_student_grades(p_student_id INT)
RETURNS TABLE (
  subject_name TEXT,
  quarter quarter_label,
  raw_score NUMERIC,
  transmuted_grade NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.name AS subject_name,
    g.quarter,
    g.raw_score,
    transmute_grade(g.raw_score) AS transmuted_grade
  FROM grades g
  JOIN subjects s ON s.id = g.subject_id
  WHERE g.student_id = p_student_id
  ORDER BY s.sort_order, g.quarter;
END;
$$ LANGUAGE plpgsql STABLE;

-- ======================== FEE BALANCE SUMMARY ========================
-- Returns fee summary for a student with penalties

CREATE OR REPLACE FUNCTION get_fee_summary(p_student_id INT)
RETURNS TABLE (
  fee_type fee_type,
  amount_due NUMERIC,
  amount_paid NUMERIC,
  balance NUMERIC,
  penalty NUMERIC,
  total_owed NUMERIC,
  due_date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    fr.fee_type,
    fr.amount_due,
    fr.amount_paid,
    (fr.amount_due - fr.amount_paid) AS balance,
    calc_fee_penalty(fr.amount_due - fr.amount_paid, fr.due_date) AS penalty,
    (fr.amount_due - fr.amount_paid + calc_fee_penalty(fr.amount_due - fr.amount_paid, fr.due_date)) AS total_owed,
    fr.due_date
  FROM fee_records fr
  WHERE fr.student_id = p_student_id
  ORDER BY fr.fee_type;
END;
$$ LANGUAGE plpgsql STABLE;
