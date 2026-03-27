import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function getGrades(filters = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('grades')
    .select('*, subjects(id, name)')
    .order('student_id');

  if (filters.studentId) query = query.eq('student_id', filters.studentId);
  if (filters.subjectId) query = query.eq('subject_id', filters.subjectId);
  if (filters.quarter) query = query.eq('quarter', filters.quarter);
  if (filters.studentIds) query = query.in('student_id', filters.studentIds);

  const { data, error } = await query;
  if (error) throw error;
  return data.map(g => ({
    id: g.id,
    studentId: g.student_id,
    subjectId: g.subject_id,
    subject: g.subjects?.name,
    quarter: g.quarter,
    rawScore: parseFloat(g.raw_score),
  }));
}

/**
 * Build a gradeMap keyed by `${studentId}-${subject}-${quarter}` → rawScore
 */
export async function getGradeMap(studentIds, subjects, quarters) {
  if (!isSupabaseConfigured) return {};

  const { data, error } = await supabase
    .from('grades')
    .select('student_id, subject_id, quarter, raw_score, subjects(name)')
    .in('student_id', studentIds);

  if (error) throw error;

  const map = {};
  (data || []).forEach(g => {
    const key = `${g.student_id}-${g.subjects?.name}-${g.quarter}`;
    map[key] = parseFloat(g.raw_score);
  });
  return map;
}

export async function saveGrades(grades) {
  if (!isSupabaseConfigured) return;
  // grades: array of { studentId, subjectId, quarter, rawScore }

  const rows = grades.map(g => ({
    student_id: g.studentId,
    subject_id: g.subjectId,
    quarter: g.quarter,
    raw_score: g.rawScore,
  }));

  const { error } = await supabase
    .from('grades')
    .upsert(rows, { onConflict: 'student_id,subject_id,quarter' });

  if (error) throw error;
}

export async function getGradeReleases(sectionId) {
  if (!isSupabaseConfigured) return {};

  let query = supabase.from('grade_releases').select('*');
  if (sectionId) query = query.eq('section_id', sectionId);

  const { data, error } = await query;
  if (error) throw error;

  const map = {};
  (data || []).forEach(r => {
    map[`${r.section_id}-${r.quarter}`] = r.released;
  });
  return map;
}

export async function setGradeRelease(sectionId, quarter, released, releasedBy) {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('grade_releases')
    .upsert(
      {
        section_id: sectionId,
        quarter,
        released,
        released_by: releasedBy,
        released_at: released ? new Date().toISOString() : null,
      },
      { onConflict: 'section_id,quarter' }
    );

  if (error) throw error;
}

export async function getStudentGrades(studentId) {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase.rpc('get_student_grades', {
    p_student_id: studentId,
  });

  if (error) throw error;
  return data || [];
}
