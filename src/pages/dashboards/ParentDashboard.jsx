import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import StatCard from '../../components/dashboard/StatCard';
import { useAuth } from '../../contexts/AuthContext';
import {
  Star, ClipboardCheck, Wallet, Megaphone, AlertTriangle, Users,
} from 'lucide-react';

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

export default function ParentDashboard() {
  const { user } = useAuth();

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
                <div key={f.type} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
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
              <div key={i} className={`p-3 rounded-lg border ${b.type === 'Positive' ? 'border-emerald-100 bg-emerald-50/30' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <Badge className={`text-xs ${b.type === 'Positive' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{b.category}</Badge>
                  <span className="text-[11px] text-muted-foreground">{b.date}</span>
                </div>
                <p className="text-xs text-gray-700">{b.note}</p>
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
              <div key={a.id} className="p-3 rounded-lg hover:bg-gray-50 border border-gray-100">
                <p className="text-xs font-semibold">{a.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{a.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
