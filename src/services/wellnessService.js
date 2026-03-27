import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function getMoods(filters = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('wellness_moods')
    .select('*, students(id, first_name, last_name, section_id, sections(name))')
    .order('date', { ascending: false });

  if (filters.studentId) query = query.eq('student_id', filters.studentId);
  if (filters.studentIds) query = query.in('student_id', filters.studentIds);
  if (filters.date) query = query.eq('date', filters.date);
  if (filters.startDate) query = query.gte('date', filters.startDate);
  if (filters.endDate) query = query.lte('date', filters.endDate);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(m => ({
    id: m.id,
    studentId: m.student_id,
    studentName: m.students ? `${m.students.first_name} ${m.students.last_name}` : '',
    section: m.students?.sections?.name,
    date: m.date,
    mood: m.mood,
  }));
}

export async function setMood(studentId, date, mood) {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('wellness_moods')
    .upsert(
      { student_id: studentId, date, mood },
      { onConflict: 'student_id,date' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCounselorNotes(filters = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('counselor_notes')
    .select('*')
    .order('date', { ascending: false });

  if (filters.studentId) query = query.eq('student_id', filters.studentId);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(n => ({
    id: n.id,
    studentId: n.student_id,
    text: n.text,
    date: n.date,
    counselor: n.counselor,
  }));
}

export async function addCounselorNote(note) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('counselor_notes')
    .insert({
      student_id: note.studentId,
      text: note.text,
      date: note.date || new Date().toISOString().split('T')[0],
      counselor: note.counselor,
      counselor_id: note.counselorId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
