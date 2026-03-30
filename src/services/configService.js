import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function getSchoolConfig() {
  if (!isSupabaseConfigured) return null;

  const [configRes, gradeLevelsRes, sectionsRes, subjectsRes] = await Promise.all([
    supabase.from('school_config').select('*').eq('id', 1).single(),
    supabase.from('grade_levels').select('*').order('sort_order'),
    supabase.from('sections').select('*, grade_levels(name)').order('id'),
    supabase.from('subjects').select('*').order('sort_order'),
  ]);

  if (configRes.error) console.error('school_config error:', configRes.error.message);
  if (gradeLevelsRes.error) console.error('grade_levels error:', gradeLevelsRes.error.message);
  if (sectionsRes.error) console.error('sections error:', sectionsRes.error.message);
  if (subjectsRes.error) console.error('subjects error:', subjectsRes.error.message);

  const config = configRes.data;
  const gradeLevels = gradeLevelsRes.data;
  const sections = sectionsRes.data;
  const subjects = subjectsRes.data;

  return {
    schoolYear: config?.school_year || '2025-2026',
    quarters: config?.quarters || ['Q1', 'Q2', 'Q3', 'Q4'],
    gradeLevels: (gradeLevels || []).map(g => g.name),
    gradeLevelRows: gradeLevels || [],
    sections: (sections || []).map(s => ({
      id: s.id,
      name: s.name,
      gradeLevel: s.grade_levels?.name,
      gradeLevelId: s.grade_level_id,
    })),
    subjects: (subjects || []).map(s => s.name),
    subjectRows: subjects || [],
  };
}

export async function updateSchoolConfig(updates) {
  if (!isSupabaseConfigured) return;

  if (updates.schoolYear || updates.quarters) {
    const payload = {};
    if (updates.schoolYear) payload.school_year = updates.schoolYear;
    if (updates.quarters) payload.quarters = updates.quarters;

    await supabase.from('school_config').update(payload).eq('id', 1);
  }
}

export async function addGradeLevel(name) {
  if (!isSupabaseConfigured) return null;
  const { data: existing } = await supabase
    .from('grade_levels')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.sort_order || 0) + 1;

  const { data, error } = await supabase
    .from('grade_levels')
    .insert({ name, sort_order: nextOrder })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeGradeLevel(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('grade_levels').delete().eq('id', id);
  if (error) throw error;
}

export async function addSection(name, gradeLevelId) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('sections')
    .insert({ name, grade_level_id: gradeLevelId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeSection(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('sections').delete().eq('id', id);
  if (error) throw error;
}

export async function addSubject(name) {
  if (!isSupabaseConfigured) return null;
  const { data: existing } = await supabase
    .from('subjects')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.sort_order || 0) + 1;

  const { data, error } = await supabase
    .from('subjects')
    .insert({ name, sort_order: nextOrder })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeSubject(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('subjects').delete().eq('id', id);
  if (error) throw error;
}
