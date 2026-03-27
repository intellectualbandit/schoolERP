import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function getPayslips(filters = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('payslips')
    .select('*, teachers(id, full_name, employee_id, department)')
    .order('created_at', { ascending: false });

  if (filters.teacherId) query = query.eq('teacher_id', filters.teacherId);
  if (filters.periodId) query = query.eq('period_id', filters.periodId);
  if (filters.status) query = query.eq('status', filters.status);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(p => ({
    id: p.id,
    teacherId: p.teacher_id,
    teacherName: p.teachers?.full_name,
    employeeId: p.teachers?.employee_id,
    dept: p.teachers?.department,
    periodId: p.period_id,
    periodLabel: p.period_label,
    grossBase: parseFloat(p.gross_base),
    transport: parseFloat(p.transport),
    rice: parseFloat(p.rice),
    clothing: parseFloat(p.clothing),
    grossPay: parseFloat(p.gross_pay),
    sss: parseFloat(p.sss),
    philhealth: parseFloat(p.philhealth),
    pagibig: parseFloat(p.pagibig),
    tax: parseFloat(p.tax),
    totalDeductions: parseFloat(p.total_deductions),
    netPay: parseFloat(p.net_pay),
    status: p.status,
    createdAt: p.created_at,
  }));
}

export async function createPayslip(payslip) {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('payslips')
    .insert({
      teacher_id: payslip.teacherId,
      period_id: payslip.periodId,
      period_label: payslip.periodLabel,
      gross_base: payslip.grossBase,
      transport: payslip.transport || 0,
      rice: payslip.rice || 0,
      clothing: payslip.clothing || 0,
      gross_pay: payslip.grossPay,
      sss: payslip.sss || 0,
      philhealth: payslip.philhealth || 0,
      pagibig: payslip.pagibig || 0,
      tax: payslip.tax || 0,
      total_deductions: payslip.totalDeductions || 0,
      net_pay: payslip.netPay,
      status: payslip.status || 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePayslipStatus(id, status) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('payslips')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function generatePayslips(periodId, periodLabel, teachers) {
  if (!isSupabaseConfigured) return [];

  const SSS_RATE = 0.045;
  const PHILHEALTH_RATE = 0.025;
  const PAGIBIG_FIXED = 100;
  const TAX_RATE = 0.10;

  const payslips = teachers.map(t => {
    const grossBase = t.baseSalary / 2; // semi-monthly
    const transport = (t.transportAllowance || 0) / 2;
    const rice = (t.riceAllowance || 0) / 2;
    const clothing = (t.clothingAllowance || 0) / 2;
    const grossPay = grossBase + transport + rice + clothing;
    const sss = Math.round(grossBase * SSS_RATE * 100) / 100;
    const philhealth = Math.round(grossBase * PHILHEALTH_RATE * 100) / 100;
    const pagibig = PAGIBIG_FIXED;
    const tax = Math.round(grossBase * TAX_RATE * 100) / 100;
    const totalDeductions = sss + philhealth + pagibig + tax;
    const netPay = grossPay - totalDeductions;

    return {
      teacher_id: t.id,
      period_id: periodId,
      period_label: periodLabel,
      gross_base: grossBase,
      transport,
      rice,
      clothing,
      gross_pay: grossPay,
      sss,
      philhealth,
      pagibig,
      tax,
      total_deductions: totalDeductions,
      net_pay: netPay,
      status: 'pending',
    };
  });

  const { data, error } = await supabase
    .from('payslips')
    .upsert(payslips, { onConflict: 'teacher_id,period_id' })
    .select();

  if (error) throw error;
  return data;
}
