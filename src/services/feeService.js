import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function getFeeSchedule(gradeLevelId) {
  if (!isSupabaseConfigured) return [];

  let query = supabase.from('fee_schedule').select('*, grade_levels(name)');
  if (gradeLevelId) query = query.eq('grade_level_id', gradeLevelId);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getFeeRecords(filters = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('fee_records')
    .select('*, students(id, first_name, last_name, lrn, grade_level_id, section_id, grade_levels(name), sections(name))')
    .order('student_id');

  if (filters.studentId) query = query.eq('student_id', filters.studentId);
  if (filters.studentIds) query = query.in('student_id', filters.studentIds);
  if (filters.feeType) query = query.eq('fee_type', filters.feeType);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(r => ({
    id: r.id,
    studentId: r.student_id,
    studentName: r.students ? `${r.students.first_name} ${r.students.last_name}` : '',
    lrn: r.students?.lrn,
    gradeLevel: r.students?.grade_levels?.name,
    section: r.students?.sections?.name,
    feeType: r.fee_type,
    amountDue: parseFloat(r.amount_due),
    amountPaid: parseFloat(r.amount_paid),
    dueDate: r.due_date,
    schoolYear: r.school_year,
  }));
}

export async function getFeePayments(feeRecordId) {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('fee_payments')
    .select('*')
    .eq('fee_record_id', feeRecordId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data.map(p => ({
    id: p.id,
    feeRecordId: p.fee_record_id,
    amount: parseFloat(p.amount),
    method: p.method,
    reference: p.reference,
    date: p.date,
    recordedBy: p.recorded_by,
  }));
}

export async function createFeeRecord(record) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('fee_records')
    .insert({
      student_id: record.studentId,
      fee_type: record.feeType,
      amount_due: record.amountDue,
      amount_paid: record.amountPaid || 0,
      due_date: record.dueDate,
      school_year: record.schoolYear || '2025-2026',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addPayment({ feeRecordId, amount, method, reference, recordedBy }) {
  if (!isSupabaseConfigured) return null;

  // Insert payment
  const { data: payment, error: payErr } = await supabase
    .from('fee_payments')
    .insert({
      fee_record_id: feeRecordId,
      amount,
      method: method || 'Cash',
      reference,
      recorded_by: recordedBy,
    })
    .select()
    .single();

  if (payErr) throw payErr;

  // Update fee_record amount_paid
  const { data: record } = await supabase
    .from('fee_records')
    .select('amount_paid')
    .eq('id', feeRecordId)
    .single();

  if (record) {
    await supabase
      .from('fee_records')
      .update({ amount_paid: parseFloat(record.amount_paid) + amount })
      .eq('id', feeRecordId);
  }

  return payment;
}

export async function getFeeSummary(studentId) {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase.rpc('get_fee_summary', {
    p_student_id: studentId,
  });

  if (error) throw error;
  return data || [];
}
