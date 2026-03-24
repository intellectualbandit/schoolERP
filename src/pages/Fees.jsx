import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';
import {
  Wallet, TrendingUp, TrendingDown, AlertTriangle, Search, Filter,
  CreditCard, Send, ChevronDown, ChevronUp, Check, X, Plus,
  Receipt, Clock, Ban, CircleDollarSign, Banknote, Smartphone,
  Building2, FileCheck, Pencil, Trash2, Save, RotateCcw, Info
} from 'lucide-react';

// ──────────────────────────────────────────
// SAMPLE DATA
// ──────────────────────────────────────────

const classRoster = [
  { id: 1,  lrn: '136482790001', firstName: 'Juan',       middleName: 'Santos',       lastName: 'Dela Cruz',  gradeLevel: 'Grade 7',  section: 'Rizal',      guardianContact: '09171234567', guardianEmail: 'maria.delacruz@email.com' },
  { id: 2,  lrn: '136482790002', firstName: 'Maria',      middleName: 'Reyes',        lastName: 'Santos',     gradeLevel: 'Grade 8',  section: 'Bonifacio',  guardianContact: '09182345678', guardianEmail: 'pedro.santos@email.com' },
  { id: 3,  lrn: '136482790003', firstName: 'Andres',     middleName: 'Luna',         lastName: 'Bautista',   gradeLevel: 'Grade 9',  section: 'Mabini',     guardianContact: '09193456789', guardianEmail: 'rosa.bautista@email.com' },
  { id: 4,  lrn: '136482790004', firstName: 'Gabriela',   middleName: 'Aquino',       lastName: 'Reyes',      gradeLevel: 'Grade 10', section: 'Aguinaldo',  guardianContact: '09204567890', guardianEmail: 'carlos.reyes@email.com' },
  { id: 5,  lrn: '136482790005', firstName: 'Jose',       middleName: 'Garcia',       lastName: 'Rizal',      gradeLevel: 'Grade 7',  section: 'Rizal',      guardianContact: '09215678901', guardianEmail: 'teodora.rizal@email.com' },
  { id: 6,  lrn: '136482790006', firstName: 'Corazon',    middleName: 'Mercado',      lastName: 'Aquino',     gradeLevel: 'Grade 8',  section: 'Bonifacio',  guardianContact: '09226789012', guardianEmail: 'benigno.aquino@email.com' },
  { id: 7,  lrn: '136482790007', firstName: 'Emilio',     middleName: 'Jacinto',      lastName: 'Aguinaldo',  gradeLevel: 'Grade 9',  section: 'Mabini',     guardianContact: '09237890123', guardianEmail: 'hilaria.aguinaldo@email.com' },
  { id: 8,  lrn: '136482790008', firstName: 'Leni',       middleName: 'Gerona',       lastName: 'Robredo',    gradeLevel: 'Grade 10', section: 'Aguinaldo',  guardianContact: '09248901234', guardianEmail: 'jesse.robredo@email.com' },
  { id: 9,  lrn: '136482790009', firstName: 'Manuel',     middleName: 'Tinio',        lastName: 'Quezon',     gradeLevel: 'Grade 7',  section: 'Rizal',      guardianContact: '09259012345', guardianEmail: 'aurora.quezon@email.com' },
  { id: 10, lrn: '136482790010', firstName: 'Josefa',     middleName: 'Llanes',       lastName: 'Escoda',     gradeLevel: 'Grade 8',  section: 'Bonifacio',  guardianContact: '09260123456', guardianEmail: 'antonio.escoda@email.com' },
  { id: 11, lrn: '136482790011', firstName: 'Apolinario', middleName: 'De La Cruz',   lastName: 'Mabini',     gradeLevel: 'Grade 9',  section: 'Mabini',     guardianContact: '09271234567', guardianEmail: 'dionisia.mabini@email.com' },
  { id: 12, lrn: '136482790012', firstName: 'Teresa',     middleName: 'Magbanua',     lastName: 'Silang',     gradeLevel: 'Grade 10', section: 'Aguinaldo',  guardianContact: '09282345678', guardianEmail: 'diego.silang@email.com' },
];

const feeTypes = ['Tuition', 'Miscellaneous', 'Laboratory', 'Computer Lab', 'Books & Modules', 'ID & Card'];

const sectionGradeMap = { Rizal: 'Grade 7', Bonifacio: 'Grade 8', Mabini: 'Grade 9', Aguinaldo: 'Grade 10' };
const gradeOptions = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];

// Penalty: 2% per month on remaining balance if past due
const PENALTY_RATE = 0.02;

function monthsOverdue(dueDateStr) {
  const due = new Date(dueDateStr);
  const now = new Date();
  if (now <= due) return 0;
  const diffMs = now - due;
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30)));
}

function calcPenalty(balance, dueDateStr) {
  if (balance <= 0) return 0;
  const months = monthsOverdue(dueDateStr);
  return Math.round(balance * PENALTY_RATE * months * 100) / 100;
}

function buildInitialFeeRecords() {
  const records = [];
  let id = 1;

  // Default fee schedule per grade level
  const feeSchedule = {
    'Grade 7':  { Tuition: 5000, Miscellaneous: 1500, Laboratory: 800,  'Computer Lab': 600,  'Books & Modules': 2000, 'ID & Card': 250 },
    'Grade 8':  { Tuition: 5500, Miscellaneous: 1500, Laboratory: 900,  'Computer Lab': 600,  'Books & Modules': 2200, 'ID & Card': 250 },
    'Grade 9':  { Tuition: 6000, Miscellaneous: 1800, Laboratory: 1000, 'Computer Lab': 700,  'Books & Modules': 2500, 'ID & Card': 250 },
    'Grade 10': { Tuition: 6500, Miscellaneous: 1800, Laboratory: 1100, 'Computer Lab': 700,  'Books & Modules': 2800, 'ID & Card': 250 },
  };

  // Payment scenarios for variety
  const paymentStatuses = [
    // student 1: fully paid tuition, partial misc
    { 1:  { Tuition: 1.0, Miscellaneous: 0.5, Laboratory: 1.0, 'Computer Lab': 1.0, 'Books & Modules': 0.0, 'ID & Card': 1.0 }},
    // student 2: all paid
    { 2:  { Tuition: 1.0, Miscellaneous: 1.0, Laboratory: 1.0, 'Computer Lab': 1.0, 'Books & Modules': 1.0, 'ID & Card': 1.0 }},
    // student 3: nothing paid
    { 3:  { Tuition: 0.0, Miscellaneous: 0.0, Laboratory: 0.0, 'Computer Lab': 0.0, 'Books & Modules': 0.0, 'ID & Card': 0.0 }},
    // student 4: partial tuition
    { 4:  { Tuition: 0.6, Miscellaneous: 1.0, Laboratory: 0.0, 'Computer Lab': 1.0, 'Books & Modules': 0.5, 'ID & Card': 1.0 }},
    // student 5: mostly paid
    { 5:  { Tuition: 1.0, Miscellaneous: 1.0, Laboratory: 1.0, 'Computer Lab': 0.0, 'Books & Modules': 1.0, 'ID & Card': 1.0 }},
    { 6:  { Tuition: 0.75, Miscellaneous: 0.0, Laboratory: 1.0, 'Computer Lab': 1.0, 'Books & Modules': 0.0, 'ID & Card': 1.0 }},
    { 7:  { Tuition: 0.0, Miscellaneous: 0.0, Laboratory: 0.5, 'Computer Lab': 0.0, 'Books & Modules': 0.0, 'ID & Card': 0.0 }},
    { 8:  { Tuition: 1.0, Miscellaneous: 1.0, Laboratory: 1.0, 'Computer Lab': 1.0, 'Books & Modules': 1.0, 'ID & Card': 1.0 }},
    { 9:  { Tuition: 0.4, Miscellaneous: 0.3, Laboratory: 0.0, 'Computer Lab': 0.0, 'Books & Modules': 0.0, 'ID & Card': 1.0 }},
    { 10: { Tuition: 1.0, Miscellaneous: 1.0, Laboratory: 0.5, 'Computer Lab': 1.0, 'Books & Modules': 1.0, 'ID & Card': 1.0 }},
    { 11: { Tuition: 0.0, Miscellaneous: 0.0, Laboratory: 0.0, 'Computer Lab': 0.0, 'Books & Modules': 0.0, 'ID & Card': 0.0 }},
    { 12: { Tuition: 1.0, Miscellaneous: 0.8, Laboratory: 1.0, 'Computer Lab': 1.0, 'Books & Modules': 1.0, 'ID & Card': 1.0 }},
  ];

  const paymentMap = {};
  paymentStatuses.forEach(obj => {
    const sid = Object.keys(obj)[0];
    paymentMap[sid] = obj[sid];
  });

  classRoster.forEach(student => {
    const schedule = feeSchedule[student.gradeLevel];
    const studentPayments = paymentMap[student.id] || {};

    feeTypes.forEach(ft => {
      const amountDue = schedule[ft] || 0;
      const paidRatio = studentPayments[ft] ?? 0;
      const amountPaid = Math.round(amountDue * paidRatio);
      const dueDate = '2025-12-15'; // semester deadline

      records.push({
        id: id++,
        studentId: student.id,
        feeType: ft,
        amountDue,
        amountPaid,
        dueDate,
        payments: amountPaid > 0 ? [{
          id: 1,
          amount: amountPaid,
          method: ['Cash', 'GCash', 'Bank Transfer', 'Check'][Math.floor(Math.random() * 4)],
          reference: `REF-${String(student.id).padStart(3, '0')}-${ft.substring(0, 3).toUpperCase()}`,
          date: '2025-09-15',
          recordedBy: 'Admin',
        }] : [],
      });
    });
  });

  return records;
}

const initialFeeSchedule = {
  'Grade 7':  { Tuition: 5000, Miscellaneous: 1500, Laboratory: 800,  'Computer Lab': 600,  'Books & Modules': 2000, 'ID & Card': 250 },
  'Grade 8':  { Tuition: 5500, Miscellaneous: 1500, Laboratory: 900,  'Computer Lab': 600,  'Books & Modules': 2200, 'ID & Card': 250 },
  'Grade 9':  { Tuition: 6000, Miscellaneous: 1800, Laboratory: 1000, 'Computer Lab': 700,  'Books & Modules': 2500, 'ID & Card': 250 },
  'Grade 10': { Tuition: 6500, Miscellaneous: 1800, Laboratory: 1100, 'Computer Lab': 700,  'Books & Modules': 2800, 'ID & Card': 250 },
};

// ──────────────────────────────────────────
// FORMATTING HELPERS
// ──────────────────────────────────────────

function peso(val) {
  return '₱' + Number(val).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function studentName(s) {
  return `${s.lastName}, ${s.firstName} ${s.middleName ? s.middleName.charAt(0) + '.' : ''}`;
}

// ──────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────

export default function Fees() {
  const [feeRecords, setFeeRecords] = useState(buildInitialFeeRecords);
  const [feeSchedule, setFeeSchedule] = useState(initialFeeSchedule);
  const [activeTab, setActiveTab] = useState('ledger');

  // Filters
  const [search, setSearch] = useState('');
  const [filterGrade, setFilterGrade] = useState('All');
  const [filterFeeType, setFilterFeeType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  // Payment modal
  const [paymentModal, setPaymentModal] = useState({ open: false, record: null });
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'Cash', reference: '' });
  const [paymentError, setPaymentError] = useState('');

  // Reminder
  const [reminderModal, setReminderModal] = useState({ open: false, student: null });
  const [reminderChannel, setReminderChannel] = useState('sms');

  // Fee assignment editing
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editScheduleValues, setEditScheduleValues] = useState({});

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // ──────────────────────────────────────────
  // DERIVED DATA
  // ──────────────────────────────────────────

  // Group fee records by student for the ledger view
  const studentLedger = useMemo(() => {
    return classRoster.map(student => {
      const records = feeRecords.filter(r => r.studentId === student.id);
      const totalDue = records.reduce((s, r) => s + r.amountDue, 0);
      const totalPaid = records.reduce((s, r) => s + r.amountPaid, 0);
      const totalBalance = totalDue - totalPaid;
      const totalPenalty = records.reduce((s, r) => {
        const balance = r.amountDue - r.amountPaid;
        return s + calcPenalty(balance, r.dueDate);
      }, 0);
      const hasOverdue = records.some(r => {
        const balance = r.amountDue - r.amountPaid;
        return balance > 0 && monthsOverdue(r.dueDate) > 0;
      });
      const allPaid = totalBalance <= 0;

      return {
        ...student,
        records,
        totalDue,
        totalPaid,
        totalBalance,
        totalPenalty,
        hasOverdue,
        allPaid,
        status: allPaid ? 'Paid' : hasOverdue ? 'Overdue' : totalPaid > 0 ? 'Partial' : 'Unpaid',
      };
    });
  }, [feeRecords]);

  // Summary stats
  const summary = useMemo(() => {
    const totalExpected = feeRecords.reduce((s, r) => s + r.amountDue, 0);
    const totalCollected = feeRecords.reduce((s, r) => s + r.amountPaid, 0);
    const outstanding = totalExpected - totalCollected;
    const overdueCount = studentLedger.filter(s => s.hasOverdue).length;
    return { totalExpected, totalCollected, outstanding, overdueCount };
  }, [feeRecords, studentLedger]);

  // Filtered + sorted student list
  const filteredLedger = useMemo(() => {
    let list = [...studentLedger];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        `${s.firstName} ${s.middleName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.lrn.includes(q)
      );
    }
    if (filterGrade !== 'All') list = list.filter(s => s.gradeLevel === filterGrade);
    if (filterStatus !== 'All') list = list.filter(s => s.status === filterStatus);

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name': cmp = a.lastName.localeCompare(b.lastName); break;
        case 'grade': cmp = a.gradeLevel.localeCompare(b.gradeLevel); break;
        case 'balance': cmp = a.totalBalance - b.totalBalance; break;
        case 'penalty': cmp = a.totalPenalty - b.totalPenalty; break;
        case 'status': cmp = a.status.localeCompare(b.status); break;
        default: cmp = 0;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [studentLedger, search, filterGrade, filterStatus, sortField, sortDir]);

  // Filter individual records when fee type filter is active
  const getVisibleRecords = useCallback((records) => {
    if (filterFeeType === 'All') return records;
    return records.filter(r => r.feeType === filterFeeType);
  }, [filterFeeType]);

  // ──────────────────────────────────────────
  // HANDLERS
  // ──────────────────────────────────────────

  function handleSort(field) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  function SortIcon({ field }) {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 opacity-30 ml-1 inline" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 ml-1 inline text-foreground" />
      : <ChevronDown className="w-3 h-3 ml-1 inline text-foreground" />;
  }

  function openPaymentModal(record) {
    const balance = record.amountDue - record.amountPaid;
    setPaymentForm({ amount: String(balance), method: 'Cash', reference: '' });
    setPaymentError('');
    setPaymentModal({ open: true, record });
  }

  function submitPayment() {
    const { record } = paymentModal;
    const amount = parseFloat(paymentForm.amount);
    const balance = record.amountDue - record.amountPaid;

    if (!amount || amount <= 0) {
      setPaymentError('Enter a valid amount.');
      return;
    }
    if (amount > balance) {
      setPaymentError(`Amount exceeds balance of ${peso(balance)}.`);
      return;
    }
    if (!paymentForm.reference.trim()) {
      setPaymentError('Reference number is required.');
      return;
    }

    setFeeRecords(prev => prev.map(r => {
      if (r.id !== record.id) return r;
      return {
        ...r,
        amountPaid: r.amountPaid + amount,
        payments: [...r.payments, {
          id: r.payments.length + 1,
          amount,
          method: paymentForm.method,
          reference: paymentForm.reference.trim(),
          date: new Date().toISOString().split('T')[0],
          recordedBy: 'Admin',
        }],
      };
    }));

    setPaymentModal({ open: false, record: null });
    showToast(`Payment of ${peso(amount)} recorded successfully.`);
  }

  function openReminder(student) {
    setReminderChannel('sms');
    setReminderModal({ open: true, student });
  }

  function sendReminder() {
    const { student } = reminderModal;
    const channel = reminderChannel === 'sms' ? `SMS to ${student.guardianContact}` : `Email to ${student.guardianEmail}`;
    setReminderModal({ open: false, student: null });
    showToast(`Reminder sent via ${channel}.`);
  }

  function startEditSchedule(grade) {
    setEditingSchedule(grade);
    setEditScheduleValues({ ...feeSchedule[grade] });
  }

  function saveSchedule(grade) {
    const newVals = {};
    for (const ft of feeTypes) {
      const v = parseFloat(editScheduleValues[ft]);
      if (isNaN(v) || v < 0) {
        showToast(`Invalid amount for ${ft}.`, 'error');
        return;
      }
      newVals[ft] = v;
    }
    setFeeSchedule(prev => ({ ...prev, [grade]: newVals }));

    // Update all unpaid/partial records for students in this grade
    const studentIds = classRoster.filter(s => s.gradeLevel === grade).map(s => s.id);
    setFeeRecords(prev => prev.map(r => {
      if (!studentIds.includes(r.studentId)) return r;
      if (newVals[r.feeType] === undefined) return r;
      return { ...r, amountDue: newVals[r.feeType] };
    }));

    setEditingSchedule(null);
    showToast(`Fee schedule for ${grade} updated.`);
  }

  function cancelEditSchedule() {
    setEditingSchedule(null);
    setEditScheduleValues({});
  }

  // ──────────────────────────────────────────
  // EXPANDED ROWS
  // ──────────────────────────────────────────

  const [expandedStudents, setExpandedStudents] = useState(new Set());

  function toggleExpand(studentId) {
    setExpandedStudents(prev => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }

  // ──────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────

  const statusBadge = (status) => {
    switch (status) {
      case 'Paid':    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Paid</Badge>;
      case 'Partial': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Partial</Badge>;
      case 'Overdue': return <Badge className="bg-red-100 text-red-700 border-red-200">Overdue</Badge>;
      case 'Unpaid':  return <Badge className="bg-slate-100 text-slate-600 border-slate-200">Unpaid</Badge>;
      default:        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const feeStatusBadge = (record) => {
    const balance = record.amountDue - record.amountPaid;
    if (balance <= 0) return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[11px]">Paid</Badge>;
    if (monthsOverdue(record.dueDate) > 0 && balance > 0) return <Badge className="bg-red-100 text-red-700 border-red-200 text-[11px]">Overdue</Badge>;
    if (record.amountPaid > 0) return <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[11px]">Partial</Badge>;
    return <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[11px]">Unpaid</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* ─── TOAST ─── */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-[100] flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all animate-in slide-in-from-top-2 fade-in",
          toast.type === 'error'
            ? "bg-red-600 text-white"
            : "bg-emerald-600 text-white"
        )}>
          {toast.type === 'error' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* ─── SUMMARY CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Expected</p>
                <p className="text-2xl font-bold mt-1">{peso(summary.totalExpected)}</p>
                <p className="text-xs text-muted-foreground mt-1">{feeRecords.length} fee items</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <CircleDollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Collected</p>
                <p className="text-2xl font-bold mt-1 text-emerald-700">{peso(summary.totalCollected)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {summary.totalExpected > 0 ? Math.round(summary.totalCollected / summary.totalExpected * 100) : 0}% collection rate
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Outstanding</p>
                <p className="text-2xl font-bold mt-1 text-amber-700">{peso(summary.outstanding)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {studentLedger.filter(s => !s.allPaid).length} students with balance
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Overdue</p>
                <p className="text-2xl font-bold mt-1 text-red-600">{summary.overdueCount}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {summary.overdueCount === 1 ? 'student' : 'students'} past due date
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── TABS ─── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="ledger">Student Ledger</TabsTrigger>
          <TabsTrigger value="assignment">Fee Assignment</TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════ */}
        {/* TAB 1: STUDENT LEDGER                               */}
        {/* ═══════════════════════════════════════════════════ */}
        <TabsContent value="ledger">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <CardTitle className="text-base font-semibold">Student Fee Ledger</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search student or LRN..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="pl-9 h-9 w-56 text-sm"
                    />
                  </div>
                  <Select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} className="h-9 w-32 text-sm">
                    <option value="All">All Grades</option>
                    {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                  </Select>
                  <Select value={filterFeeType} onChange={e => setFilterFeeType(e.target.value)} className="h-9 w-40 text-sm">
                    <option value="All">All Fee Types</option>
                    {feeTypes.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                  </Select>
                  <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-9 w-32 text-sm">
                    <option value="All">All Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Overdue">Overdue</option>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-8"></TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('name')}>
                      Student Name <SortIcon field="name" />
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('grade')}>
                      Grade / Section <SortIcon field="grade" />
                    </TableHead>
                    <TableHead className="text-right">Total Due</TableHead>
                    <TableHead className="text-right">Total Paid</TableHead>
                    <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('balance')}>
                      Balance <SortIcon field="balance" />
                    </TableHead>
                    <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('penalty')}>
                      Penalty <SortIcon field="penalty" />
                    </TableHead>
                    <TableHead className="cursor-pointer select-none text-center" onClick={() => handleSort('status')}>
                      Status <SortIcon field="status" />
                    </TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLedger.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                        No students match the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredLedger.map(student => {
                    const isExpanded = expandedStudents.has(student.id);
                    const visibleRecords = getVisibleRecords(student.records);

                    return (
                      <React.Fragment key={student.id}>
                        {/* Main student row */}
                        <TableRow
                          className={cn(
                            "cursor-pointer transition-colors",
                            isExpanded && "bg-muted/30"
                          )}
                          onClick={() => toggleExpand(student.id)}
                        >
                          <TableCell className="pl-4 pr-0">
                            <ChevronDown className={cn(
                              "w-4 h-4 text-muted-foreground transition-transform",
                              isExpanded && "rotate-180"
                            )} />
                          </TableCell>
                          <TableCell className="font-medium">{studentName(student)}</TableCell>
                          <TableCell className="text-muted-foreground">{student.gradeLevel} - {student.section}</TableCell>
                          <TableCell className="text-right font-medium">{peso(student.totalDue)}</TableCell>
                          <TableCell className="text-right text-emerald-700 font-medium">{peso(student.totalPaid)}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {student.totalBalance > 0 ? peso(student.totalBalance) : <span className="text-emerald-600">{peso(0)}</span>}
                          </TableCell>
                          <TableCell className="text-right">
                            {student.totalPenalty > 0
                              ? <span className="text-red-600 font-semibold">{peso(student.totalPenalty)}</span>
                              : <span className="text-muted-foreground">-</span>
                            }
                          </TableCell>
                          <TableCell className="text-center">{statusBadge(student.status)}</TableCell>
                          <TableCell className="text-center" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1">
                              {!student.allPaid && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                      onClick={() => openReminder(student)}
                                    >
                                      <Send className="w-3.5 h-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Send Reminder</TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Expanded: individual fee records */}
                        {isExpanded && (
                          <TableRow className="bg-muted/20 hover:bg-muted/20">
                            <TableCell colSpan={9} className="p-0">
                              <div className="px-6 py-3 border-t border-dashed">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="text-xs">
                                      <TableHead className="h-8 text-xs">Fee Type</TableHead>
                                      <TableHead className="h-8 text-xs text-right">Amount Due</TableHead>
                                      <TableHead className="h-8 text-xs text-right">Amount Paid</TableHead>
                                      <TableHead className="h-8 text-xs text-right">Balance</TableHead>
                                      <TableHead className="h-8 text-xs text-right">Penalty</TableHead>
                                      <TableHead className="h-8 text-xs text-center">Status</TableHead>
                                      <TableHead className="h-8 text-xs text-center">Action</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {visibleRecords.map(record => {
                                      const balance = record.amountDue - record.amountPaid;
                                      const penalty = calcPenalty(balance, record.dueDate);
                                      const isOverdue = balance > 0 && monthsOverdue(record.dueDate) > 0;

                                      return (
                                        <TableRow key={record.id} className="text-sm">
                                          <TableCell className="py-2 font-medium">{record.feeType}</TableCell>
                                          <TableCell className="py-2 text-right">{peso(record.amountDue)}</TableCell>
                                          <TableCell className="py-2 text-right text-emerald-700">{peso(record.amountPaid)}</TableCell>
                                          <TableCell className={cn("py-2 text-right font-medium", balance > 0 && "text-amber-700")}>
                                            {peso(balance)}
                                          </TableCell>
                                          <TableCell className="py-2 text-right">
                                            {penalty > 0
                                              ? <span className="text-red-600 font-semibold">{peso(penalty)}</span>
                                              : <span className="text-muted-foreground">-</span>
                                            }
                                          </TableCell>
                                          <TableCell className="py-2 text-center">{feeStatusBadge(record)}</TableCell>
                                          <TableCell className="py-2 text-center">
                                            {balance > 0 && (
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 text-xs gap-1"
                                                onClick={() => openPaymentModal(record)}
                                              >
                                                <CreditCard className="w-3 h-3" />
                                                Record Payment
                                              </Button>
                                            )}
                                            {balance <= 0 && (
                                              <span className="text-emerald-600 text-xs flex items-center justify-center gap-1">
                                                <Check className="w-3 h-3" /> Settled
                                              </span>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>

                                {/* Payment history for this student */}
                                {visibleRecords.some(r => r.payments.length > 0) && (
                                  <div className="mt-3 pt-3 border-t">
                                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Payment History</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                      {visibleRecords.flatMap(r =>
                                        r.payments.map(p => (
                                          <div key={`${r.id}-${p.id}`} className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2 text-xs">
                                            <div className={cn(
                                              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                                              p.method === 'Cash' && "bg-emerald-50 text-emerald-600",
                                              p.method === 'GCash' && "bg-blue-50 text-blue-600",
                                              p.method === 'Bank Transfer' && "bg-violet-50 text-violet-600",
                                              p.method === 'Check' && "bg-slate-100 text-slate-600",
                                            )}>
                                              {p.method === 'Cash' && <Banknote className="w-4 h-4" />}
                                              {p.method === 'GCash' && <Smartphone className="w-4 h-4" />}
                                              {p.method === 'Bank Transfer' && <Building2 className="w-4 h-4" />}
                                              {p.method === 'Check' && <FileCheck className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center justify-between">
                                                <span className="font-semibold text-emerald-700">{peso(p.amount)}</span>
                                                <span className="text-muted-foreground">{p.date}</span>
                                              </div>
                                              <div className="flex items-center justify-between text-muted-foreground mt-0.5">
                                                <span>{r.feeType} &middot; {p.method}</span>
                                                <span>{p.reference}</span>
                                              </div>
                                            </div>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════ */}
        {/* TAB 2: FEE ASSIGNMENT                               */}
        {/* ═══════════════════════════════════════════════════ */}
        <TabsContent value="assignment">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Fee Schedule by Grade Level</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Set the fee amounts for each grade level. Changes apply to all students in the grade.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {gradeOptions.map(grade => {
                  const isEditing = editingSchedule === grade;
                  const schedule = feeSchedule[grade];
                  const gradeTotal = feeTypes.reduce((s, ft) => s + (schedule[ft] || 0), 0);
                  const studentCount = classRoster.filter(s => s.gradeLevel === grade).length;

                  return (
                    <Card key={grade} className={cn(
                      "transition-all",
                      isEditing && "ring-2 ring-blue-200 border-blue-300"
                    )}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-sm font-semibold">{grade}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {studentCount} students &middot; Total: {peso(gradeTotal)} per student
                            </p>
                          </div>
                          {!isEditing ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1 text-xs"
                              onClick={() => startEditSchedule(grade)}
                            >
                              <Pencil className="w-3 h-3" />
                              Edit
                            </Button>
                          ) : (
                            <div className="flex gap-1.5">
                              <Button
                                size="sm"
                                className="h-8 gap-1 text-xs"
                                onClick={() => saveSchedule(grade)}
                              >
                                <Save className="w-3 h-3" />
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1 text-xs"
                                onClick={cancelEditSchedule}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {feeTypes.map(ft => (
                            <div key={ft} className="flex items-center justify-between py-1.5 border-b border-dashed last:border-0">
                              <span className="text-sm text-muted-foreground">{ft}</span>
                              {isEditing ? (
                                <div className="relative w-28">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₱</span>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={editScheduleValues[ft] ?? ''}
                                    onChange={e => setEditScheduleValues(prev => ({ ...prev, [ft]: e.target.value }))}
                                    className="h-8 text-sm text-right pl-6 pr-2"
                                  />
                                </div>
                              ) : (
                                <span className="text-sm font-semibold">{peso(schedule[ft])}</span>
                              )}
                            </div>
                          ))}
                        </div>
                        {!isEditing && (
                          <div className="flex items-center justify-between mt-3 pt-2 border-t">
                            <span className="text-sm font-semibold">Total per Student</span>
                            <span className="text-sm font-bold text-blue-700">{peso(gradeTotal)}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ═══════════════════════════════════════════════════ */}
      {/* RECORD PAYMENT MODAL                                */}
      {/* ═══════════════════════════════════════════════════ */}
      <Dialog open={paymentModal.open} onOpenChange={(open) => { if (!open) setPaymentModal({ open: false, record: null }); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Record Payment
            </DialogTitle>
            <DialogDescription>
              {paymentModal.record && (() => {
                const student = classRoster.find(s => s.id === paymentModal.record.studentId);
                const balance = paymentModal.record.amountDue - paymentModal.record.amountPaid;
                return (
                  <>
                    {studentName(student)} &middot; {paymentModal.record.feeType}
                    <br />
                    Outstanding balance: <span className="font-semibold text-foreground">{peso(balance)}</span>
                  </>
                );
              })()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="pay-amount">Amount (₱)</Label>
              <Input
                id="pay-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={paymentForm.amount}
                onChange={e => { setPaymentForm(f => ({ ...f, amount: e.target.value })); setPaymentError(''); }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay-method">Payment Method</Label>
              <Select
                id="pay-method"
                value={paymentForm.method}
                onChange={e => setPaymentForm(f => ({ ...f, method: e.target.value }))}
              >
                <option value="Cash">Cash</option>
                <option value="GCash">GCash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Check</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay-ref">Reference Number</Label>
              <Input
                id="pay-ref"
                placeholder="e.g. OR-2025-001"
                value={paymentForm.reference}
                onChange={e => { setPaymentForm(f => ({ ...f, reference: e.target.value })); setPaymentError(''); }}
              />
            </div>

            {paymentError && (
              <p className="text-sm text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {paymentError}
              </p>
            )}

            {/* Penalty notice */}
            {paymentModal.record && (() => {
              const balance = paymentModal.record.amountDue - paymentModal.record.amountPaid;
              const penalty = calcPenalty(balance, paymentModal.record.dueDate);
              if (penalty <= 0) return null;
              return (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-red-700">Running Penalty</p>
                      <p className="text-red-600 mt-0.5">
                        <span className="text-lg font-bold">{peso(penalty)}</span>
                        <span className="text-xs ml-1.5">({PENALTY_RATE * 100}% / month &times; {monthsOverdue(paymentModal.record.dueDate)} months overdue)</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentModal({ open: false, record: null })}>Cancel</Button>
            <Button onClick={submitPayment} className="gap-1.5">
              <Check className="w-4 h-4" />
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════ */}
      {/* SEND REMINDER MODAL                                 */}
      {/* ═══════════════════════════════════════════════════ */}
      <Dialog open={reminderModal.open} onOpenChange={(open) => { if (!open) setReminderModal({ open: false, student: null }); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              Send Payment Reminder
            </DialogTitle>
            <DialogDescription>
              {reminderModal.student && (
                <>
                  Remind <span className="font-medium text-foreground">{studentName(reminderModal.student)}</span>'s guardian about outstanding balance of{' '}
                  <span className="font-semibold text-foreground">{peso(reminderModal.student.totalBalance)}</span>.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <Label>Send via</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={cn(
                  "flex items-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all",
                  reminderChannel === 'sms'
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-muted hover:border-blue-200"
                )}
                onClick={() => setReminderChannel('sms')}
              >
                <Smartphone className="w-4 h-4" />
                SMS
              </button>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all",
                  reminderChannel === 'email'
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-muted hover:border-blue-200"
                )}
                onClick={() => setReminderChannel('email')}
              >
                <Send className="w-4 h-4" />
                Email
              </button>
            </div>
            {reminderModal.student && (
              <p className="text-xs text-muted-foreground">
                {reminderChannel === 'sms'
                  ? `Will send to ${reminderModal.student.guardianContact}`
                  : `Will send to ${reminderModal.student.guardianEmail}`
                }
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReminderModal({ open: false, student: null })}>Cancel</Button>
            <Button onClick={sendReminder} className="gap-1.5">
              <Send className="w-4 h-4" />
              Send Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
