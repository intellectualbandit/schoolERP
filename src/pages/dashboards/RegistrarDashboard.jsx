import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import StatCard from '../../components/dashboard/StatCard';
import CustomTooltip from '../../components/dashboard/CustomTooltip';
import { useAuth } from '../../contexts/AuthContext';
import { Users, UserCheck, ClipboardList, TrendingUp, Clock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line, Area,
} from 'recharts';

const enrollmentTrend = [
  { month: 'Jun', enrolled: 980 }, { month: 'Jul', enrolled: 1050 },
  { month: 'Aug', enrolled: 1120 }, { month: 'Sep', enrolled: 1180 },
  { month: 'Oct', enrolled: 1210 }, { month: 'Nov', enrolled: 1230 },
  { month: 'Dec', enrolled: 1235 }, { month: 'Jan', enrolled: 1240 },
  { month: 'Feb', enrolled: 1245 }, { month: 'Mar', enrolled: 1248 },
];

const sectionOccupancy = [
  { section: 'G7-Rizal', capacity: 40, enrolled: 38 },
  { section: 'G8-Bonifacio', capacity: 40, enrolled: 36 },
  { section: 'G9-Mabini', capacity: 40, enrolled: 35 },
  { section: 'G10-Aguinaldo', capacity: 40, enrolled: 37 },
];

const recentEnrollments = [
  { name: 'Maria Santos', grade: 'Grade 7', date: 'Mar 22', type: 'New' },
  { name: 'Pedro Cruz', grade: 'Grade 8', date: 'Mar 20', type: 'Transferee' },
  { name: 'Ana Reyes', grade: 'Grade 7', date: 'Mar 18', type: 'New' },
  { name: 'Carlos Luna', grade: 'Grade 9', date: 'Mar 15', type: 'Returnee' },
];

export default function RegistrarDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Registrar Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome, {user?.firstName}. Enrollment and records overview.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Enrolled" value="1,248" icon={Users} color="text-indigo-600" bgColor="bg-indigo-50" change="+3.2%" changeType="up" />
        <StatCard label="New This Month" value="8" icon={UserCheck} color="text-emerald-600" bgColor="bg-emerald-50" />
        <StatCard label="Sections" value="4" icon={ClipboardList} color="text-purple-600" bgColor="bg-purple-50" />
        <StatCard label="Avg. Occupancy" value="91.3%" icon={TrendingUp} color="text-amber-600" bgColor="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Section Occupancy */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Section Occupancy</CardTitle>
            <CardDescription className="text-xs">Enrolled vs capacity per section</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {sectionOccupancy.map(s => {
              const pct = ((s.enrolled / s.capacity) * 100).toFixed(0);
              return (
                <div key={s.section} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{s.section}</span>
                    <span className="text-muted-foreground">{s.enrolled}/{s.capacity} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${Number(pct) > 95 ? 'bg-red-500' : Number(pct) > 85 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Enrollment Trend */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Enrollment Trend</CardTitle>
            <CardDescription className="text-xs">Monthly enrollment count</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={enrollmentTrend}>
                <defs>
                  <linearGradient id="regEnroll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[900, 1300]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="enrolled" stroke="#6366f1" fill="url(#regEnroll)" strokeWidth={2.5} name="Enrolled" dot={{ r: 3, fill: '#6366f1' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Enrollment Activity */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Recent Enrollment Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {recentEnrollments.map((e, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted/50">
              <div>
                <p className="text-sm font-semibold">{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.grade} · {e.date}</p>
              </div>
              <Badge className={`text-xs ${e.type === 'New' ? 'bg-emerald-100 text-emerald-700' : e.type === 'Transferee' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                {e.type}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
