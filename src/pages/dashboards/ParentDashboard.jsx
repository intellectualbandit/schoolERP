import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import StatCard from '../../components/dashboard/StatCard';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import MOCK_USERS from '../../data/mockUsers';
import {
  Star, ClipboardCheck, Wallet, Megaphone, AlertTriangle, Users, FileText, Send,
} from 'lucide-react';

const EXCUSE_STORAGE_KEY = 'schoolerp_excuse_requests';

function loadExcuseRequests() {
  try { return JSON.parse(localStorage.getItem(EXCUSE_STORAGE_KEY)) || []; } catch { return []; }
}
function saveExcuseRequests(data) {
  localStorage.setItem(EXCUSE_STORAGE_KEY, JSON.stringify(data));
}

const childGrades = [
  { subject: 'Filipino', q1: 88, q2: 85, q3: 90 },
  { subject: 'English', q1: 82, q2: 80, q3: 78 },
  { subject: 'Mathematics', q1: 91, q2: 89, q3: 93 },
  { subject: 'Science', q1: 86, q2: 84, q3: 88 },
  { subject: 'Araling Panlipunan', q1: 90, q2: 88, q3: 91 },
];

const childAttendance = { present: 160, absent: 8, late: 12, total: 180 };

const feeBalance = [
  { type: 'Tuition', amount: 15000, paid: 15000, status: 'Paid' },
  { type: 'Miscellaneous', amount: 3500, paid: 3500, status: 'Paid' },
  { type: 'Laboratory', amount: 2000, paid: 1000, status: 'Partial' },
];

const behaviorLog = [
  { date: 'Mar 18', type: 'Positive', category: 'Leadership', note: 'Led group activity in Science class' },
  { date: 'Mar 10', type: 'Neutral', category: 'Parent Conference', note: 'Quarterly progress review' },
];

const announcements = [
  { id: 1, title: 'Final Examinations Schedule — March 30 to April 4', date: 'Mar 22' },
  { id: 2, title: 'Parent-Teacher Conference — April 2', date: 'Mar 20' },
];

const avgGrade = (childGrades.reduce((s, g) => s + g.q3, 0) / childGrades.length).toFixed(1);
const attendanceRate = ((childAttendance.present / childAttendance.total) * 100).toFixed(1);
const totalFees = feeBalance.reduce((s, f) => s + f.amount, 0);
const totalPaid = feeBalance.reduce((s, f) => s + f.paid, 0);

const reasonOptions = ['Illness', 'Family Emergency', 'Medical Appointment', 'Other'];

export default function ParentDashboard() {
  const { user } = useAuth();
  const { getNotificationsForUser, addNotification } = useNotifications();
  const recipientKey = user ? `parent_${user.id}` : '';
  const absenceAlerts = getNotificationsForUser(recipientKey).filter(n => n.type === 'absence_alert');

  const [showExcuseDialog, setShowExcuseDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [excuseReason, setExcuseReason] = useState('Illness');
  const [excuseNote, setExcuseNote] = useState('');

  function handleOpenExcuse(alert) {
    setSelectedAlert(alert);
    setExcuseReason('Illness');
    setExcuseNote('');
    setShowExcuseDialog(true);
  }

  function handleSubmitExcuse() {
    if (!selectedAlert) return;
    const data = selectedAlert.data;

    // Save excuse request to localStorage
    const excuses = loadExcuseRequests();
    const newExcuse = {
      id: `exc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      studentId: data.studentId,
      studentName: data.studentName,
      date: data.date,
      section: data.section,
      subject: data.subject,
      reason: excuseReason,
      note: excuseNote,
      parentUserId: user.id,
      parentName: `${user.firstName} ${user.lastName}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    excuses.push(newExcuse);
    saveExcuseRequests(excuses);

    // Notify teachers
    const teachers = MOCK_USERS.filter(u => u.role === 'teacher');
    teachers.forEach(teacher => {
      addNotification({
        recipientKey: `teacher_${teacher.id}`,
        type: 'excuse_request',
        title: `Excuse Request: ${data.studentName}`,
        message: `${user.firstName} ${user.lastName} submitted an excuse for ${data.studentName}'s absence on ${data.date}. Reason: ${excuseReason}`,
        data: { excuseId: newExcuse.id, studentId: data.studentId },
      });
    });

    setShowExcuseDialog(false);
    setSelectedAlert(null);
  }

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Parent Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome, {user?.firstName}. Viewing overview for <span className="font-medium text-foreground">{user?.childNames?.[0] || 'your child'}</span>
        </p>
      </div>

      {/* Child Overview Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-indigo-50 to-blue-50">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Users className="h-7 w-7 text-indigo-600" />
            </div>
            <div>
              <p className="text-lg font-bold">{user?.childNames?.[0] || 'Juan Dela Cruz'}</p>
              <p className="text-sm text-muted-foreground">Grade 7 - Rizal · LRN: 136482790001</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Current Average" value={avgGrade} icon={Star} color="text-amber-600" bgColor="bg-amber-50" />
        <StatCard label="Attendance" value={`${attendanceRate}%`} icon={ClipboardCheck} color="text-emerald-600" bgColor="bg-emerald-50" />
        <StatCard label="Fee Balance" value={`₱${(totalFees - totalPaid).toLocaleString()}`} icon={Wallet} color="text-blue-600" bgColor="bg-blue-50" />
        <StatCard label="Behavior" value={`${behaviorLog.length} entries`} icon={AlertTriangle} color="text-purple-600" bgColor="bg-purple-50" />
      </div>

      {/* Absence Alerts */}
      {absenceAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50/30 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <CardTitle className="text-sm font-semibold text-red-800">Absence Alerts ({absenceAlerts.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {absenceAlerts.slice(0, 5).map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-white border border-red-100">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{alert.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{alert.message}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(alert.createdAt)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenExcuse(alert)}
                  className="ml-3 gap-1.5 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Submit Excuse
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Child Grades */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Academic Grades</CardTitle>
            <CardDescription className="text-xs">Quarterly grades for current school year</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-xs font-medium text-muted-foreground py-2">Subject</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-2">Q1</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-2">Q2</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-2">Q3</th>
                </tr>
              </thead>
              <tbody>
                {childGrades.map(g => (
                  <tr key={g.subject} className="border-b last:border-0">
                    <td className="py-2 text-sm font-medium">{g.subject}</td>
                    <td className="py-2 text-center text-xs">{g.q1}</td>
                    <td className="py-2 text-center text-xs">{g.q2}</td>
                    <td className="py-2 text-center text-xs font-semibold">{g.q3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Fee Balance + Attendance Summary */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Fee Balance</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {feeBalance.map(f => (
                <div key={f.type} className="flex items-center justify-between p-2.5 rounded-lg bg-muted">
                  <div>
                    <p className="text-xs font-semibold">{f.type}</p>
                    <p className="text-[11px] text-muted-foreground">₱{f.amount.toLocaleString()}</p>
                  </div>
                  <Badge className={`text-xs ${f.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {f.status === 'Paid' ? 'Paid' : `₱${(f.amount - f.paid).toLocaleString()} due`}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded-lg bg-emerald-50">
                  <p className="text-lg font-bold text-emerald-600">{childAttendance.present}</p>
                  <p className="text-[10px] text-muted-foreground">Present</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-50">
                  <p className="text-lg font-bold text-amber-600">{childAttendance.late}</p>
                  <p className="text-[10px] text-muted-foreground">Late</p>
                </div>
                <div className="p-2 rounded-lg bg-red-50">
                  <p className="text-lg font-bold text-red-600">{childAttendance.absent}</p>
                  <p className="text-[10px] text-muted-foreground">Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Behavior + Announcements */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Behavior Log</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {behaviorLog.map((b, i) => (
              <div key={i} className={`p-3 rounded-lg border ${b.type === 'Positive' ? 'border-emerald-100 bg-emerald-50/30' : 'border-border/60'}`}>
                <div className="flex items-center justify-between mb-1">
                  <Badge className={`text-xs ${b.type === 'Positive' ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-foreground/90'}`}>{b.category}</Badge>
                  <span className="text-[11px] text-muted-foreground">{b.date}</span>
                </div>
                <p className="text-xs text-foreground/90">{b.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Announcements</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {announcements.map(a => (
              <div key={a.id} className="p-3 rounded-lg hover:bg-muted/50 border border-border/60">
                <p className="text-xs font-semibold">{a.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{a.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Excuse Submit Dialog */}
      <Dialog open={showExcuseDialog} onOpenChange={setShowExcuseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Excuse</DialogTitle>
            <DialogDescription>
              {selectedAlert && `Submitting excuse for ${selectedAlert.data?.studentName}'s absence on ${selectedAlert.data?.date}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Reason</Label>
              <Select value={excuseReason} onChange={(e) => setExcuseReason(e.target.value)} className="mt-1">
                {reasonOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Additional Notes (optional)</Label>
              <Input
                value={excuseNote}
                onChange={(e) => setExcuseNote(e.target.value)}
                placeholder="Any additional details..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowExcuseDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitExcuse} className="gap-2">
              <Send className="h-4 w-4" />Submit Excuse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
