import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import StatCard from '../../components/dashboard/StatCard';
import CustomTooltip from '../../components/dashboard/CustomTooltip';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, AlertTriangle, Users, TrendingUp, Shield } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

const atRiskStudents = [
  { name: 'Andres Bautista', section: 'Grade 9 - Mabini', risk: 'High', reason: '5 consecutive negative mood days', mood: 'stressed' },
  { name: 'Emilio Aguinaldo', section: 'Grade 9 - Mabini', risk: 'High', reason: '3 consecutive absences + low mood', mood: 'sad' },
  { name: 'Josefa Escoda', section: 'Grade 8 - Bonifacio', risk: 'Medium', reason: 'Academic decline + stressed mood', mood: 'stressed' },
  { name: 'Jose Rizal', section: 'Grade 7 - Rizal', risk: 'Medium', reason: 'Behavioral incidents (2 this month)', mood: 'angry' },
];

const moodDistribution = [
  { name: 'Happy', value: 42, fill: '#10b981' },
  { name: 'Okay', value: 28, fill: '#f59e0b' },
  { name: 'Sad', value: 12, fill: '#38bdf8' },
  { name: 'Stressed', value: 11, fill: '#8b5cf6' },
  { name: 'Angry', value: 7, fill: '#f43f5e' },
];

const behaviorTrend = [
  { week: 'W1', positive: 15, negative: 8 }, { week: 'W2', positive: 18, negative: 6 },
  { week: 'W3', positive: 12, negative: 10 }, { week: 'W4', positive: 20, negative: 5 },
  { week: 'W5', positive: 16, negative: 7 }, { week: 'W6', positive: 22, negative: 4 },
];

const sectionWellness = [
  { section: 'G7-Rizal', score: 78, students: 38 },
  { section: 'G8-Bonifacio', score: 72, students: 36 },
  { section: 'G9-Mabini', score: 65, students: 35 },
  { section: 'G10-Aguinaldo', score: 81, students: 37 },
];

export default function CounselorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Counselor Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome, {user?.firstName}. Student wellness and behavior overview.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="At-Risk Students" value={atRiskStudents.length} icon={AlertTriangle} color="text-red-600" bgColor="bg-red-50" />
        <StatCard label="Avg Wellness Score" value="74" icon={Heart} color="text-pink-600" bgColor="bg-pink-50" change="-2" changeType="down" subtitle="vs last week" />
        <StatCard label="Behavior Incidents" value="12" icon={Shield} color="text-amber-600" bgColor="bg-amber-50" subtitle="this month" />
        <StatCard label="Check-in Rate" value="89%" icon={Users} color="text-emerald-600" bgColor="bg-emerald-50" change="+3%" changeType="up" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* At-Risk Students */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">At-Risk Students</CardTitle>
            <CardDescription className="text-xs">Students requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {atRiskStudents.map((s, i) => (
              <div key={i} className={`p-3 rounded-lg border ${s.risk === 'High' ? 'border-red-100 bg-red-50/30' : 'border-amber-100 bg-amber-50/30'}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold">{s.name}</p>
                  <Badge className={`text-xs ${s.risk === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{s.risk}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{s.section}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mood Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Mood Distribution</CardTitle>
            <CardDescription className="text-xs">Today's school-wide mood check-in results</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={moodDistribution} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {moodDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {moodDistribution.map(m => (
                  <div key={m.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.fill }} />
                      <span className="text-xs text-muted-foreground">{m.name}</span>
                    </div>
                    <span className="text-xs font-semibold">{m.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Behavior Incidents Trend */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Behavior Incidents Trend</CardTitle>
            <CardDescription className="text-xs">Positive vs negative incidents by week</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={behaviorTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="positive" fill="#10b981" name="Positive" radius={[4, 4, 0, 0]} />
                <Bar dataKey="negative" fill="#f43f5e" name="Negative" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Section Wellness Summary */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Section Wellness Summary</CardTitle>
            <CardDescription className="text-xs">Average wellness score by section</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {sectionWellness.map(s => (
              <div key={s.section} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{s.section}</span>
                  <span className={`font-semibold ${s.score >= 80 ? 'text-emerald-600' : s.score >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                    {s.score}/100
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${s.score >= 80 ? 'bg-emerald-500' : s.score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
