import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function getAttendanceRecords(filters = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('attendance_records')
    .select(`
      *,
      sections(id, name),
      subjects(id, name),
      attendance_marks(id, student_id, status)
    `)
    .order('date', { ascending: false });

  if (filters.sectionId) query = query.eq('section_id', filters.sectionId);
  if (filters.date) query = query.eq('date', filters.date);
  if (filters.subjectId) query = query.eq('subject_id', filters.subjectId);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(r => ({
    id: r.id,
    date: r.date,
    section: r.sections?.name,
    sectionId: r.section_id,
    subject: r.subjects?.name,
    subjectId: r.subject_id,
    savedBy: r.saved_by,
    savedAt: r.saved_at,
    records: Object.fromEntries(
      (r.attendance_marks || []).map(m => [m.student_id, m.status])
    ),
  }));
}

export async function saveAttendance({ date, sectionId, subjectId, marks, savedBy }) {
  if (!isSupabaseConfigured) return null;

  // Upsert the attendance record
  const { data: record, error: recErr } = await supabase
    .from('attendance_records')
    .upsert(
      { date, section_id: sectionId, subject_id: subjectId, saved_by: savedBy },
      { onConflict: 'date,section_id,subject_id' }
    )
    .select()
    .single();

  if (recErr) throw recErr;

  // Delete existing marks for this record, then insert new ones
  await supabase
    .from('attendance_marks')
    .delete()
    .eq('attendance_record_id', record.id);

  const markRows = Object.entries(marks).map(([studentId, status]) => ({
    attendance_record_id: record.id,
    student_id: parseInt(studentId),
    status,
  }));

  if (markRows.length > 0) {
    const { error: markErr } = await supabase
      .from('attendance_marks')
      .insert(markRows);
    if (markErr) throw markErr;
  }

  return record;
}

export async function getAttendanceStats(studentId, startDate, endDate) {
  if (!isSupabaseConfigured) return { total_days: 0, present_count: 0, late_count: 0, absent_count: 0, excused_count: 0 };

  const { data, error } = await supabase
    .rpc('get_attendance_stats', {
      p_student_id: studentId,
      p_start_date: startDate || null,
      p_end_date: endDate || null,
    });

  if (error) throw error;
  return data?.[0] || { total_days: 0, present_count: 0, late_count: 0, absent_count: 0, excused_count: 0 };
}

export async function getExcuseRequests(filters = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('excuse_requests')
    .select('*, students(first_name, last_name), sections(name), subjects(name)')
    .order('created_at', { ascending: false });

  if (filters.sectionId) query = query.eq('section_id', filters.sectionId);
  if (filters.studentId) query = query.eq('student_id', filters.studentId);
  if (filters.parentId) query = query.eq('parent_id', filters.parentId);
  if (filters.status) query = query.eq('status', filters.status);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(e => ({
    id: e.id,
    studentId: e.student_id,
    studentName: `${e.students?.first_name} ${e.students?.last_name}`,
    date: e.date,
    section: e.sections?.name,
    sectionId: e.section_id,
    subject: e.subjects?.name,
    reason: e.reason,
    note: e.note,
    status: e.status,
    parentId: e.parent_id,
  }));
}

export async function createExcuseRequest(request) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('excuse_requests')
    .insert({
      student_id: request.studentId,
      date: request.date,
      section_id: request.sectionId,
      subject_id: request.subjectId,
      reason: request.reason,
      note: request.note,
      parent_id: request.parentId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateExcuseStatus(id, status, reviewedBy) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('excuse_requests')
    .update({ status, reviewed_by: reviewedBy })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
