import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import StatCard from '../../components/dashboard/StatCard';
import CustomTooltip from '../../components/dashboard/CustomTooltip';
import { useAuth } from '../../contexts/AuthContext';
import { Wallet, TrendingUp, AlertTriangle, CreditCard, Banknote, Smartphone, Building2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

const collectionTrend = [
  { month: 'Oct', collected: 285000 }, { month: 'Nov', collected: 310000 },
  { month: 'Dec', collected: 295000 }, { month: 'Jan', collected: 340000 },
  { month: 'Feb', collected: 325000 }, { month: 'Mar', collected: 298000 },
];

const overdueAccounts = [
  { name: 'Andres Bautista', grade: 'Grade 9', balance: 8500, months: 3 },
  { name: 'Emilio Aguinaldo', grade: 'Grade 9', balance: 12000, months: 2 },
  { name: 'Josefa Escoda', grade: 'Grade 8', balance: 5200, months: 1 },
  { name: 'Manuel Quezon', grade: 'Grade 7', balance: 3800, months: 1 },
];

const paymentMethods = [
  { name: 'Cash', value: 45, fill: '#6366f1' },
  { name: 'Bank Transfer', value: 30, fill: '#10b981' },
  { name: 'GCash/Maya', value: 20, fill: '#f59e0b' },
  { name: 'Check', value: 5, fill: '#94a3b8' },
];

export default function CashierDashboard() {
  const { user } = useAuth();
  const totalCollected = useMemo(() => collectionTrend.reduce((s, m) => s + m.collected, 0), []);
  const totalOverdue = overdueAccounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cashier Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome, {user?.firstName}. Fee collection overview.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Collected" value={`₱${(totalCollected / 1000).toFixed(0)}K`} icon={Wallet} color="text-emerald-600" bgColor="bg-emerald-50" change="+12%" changeType="up" />
        <StatCard label="This Month" value="₱298K" icon={TrendingUp} color="text-indigo-600" bgColor="bg-indigo-50" />
        <StatCard label="Overdue Accounts" value={overdueAccounts.length} icon={AlertTriangle} color="text-red-600" bgColor="bg-red-50" />
        <StatCard label="Total Overdue" value={`₱${(totalOverdue / 1000).toFixed(1)}K`} icon={CreditCard} color="text-amber-600" bgColor="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Collection Trend */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Collection Trend</CardTitle>
            <CardDescription className="text-xs">Monthly fee collections</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={collectionTrend}>
                <defs>
                  <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}K`} />
                <Tooltip content={<CustomTooltip formatter={v => `₱${v.toLocaleString()}`} />} />
                <Area type="monotone" dataKey="collected" stroke="#10b981" fill="url(#cashGrad)" strokeWidth={2.5} name="Collected" dot={{ r: 3, fill: '#10b981' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Method Breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Payment Methods</CardTitle>
            <CardDescription className="text-xs">Breakdown by payment type</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={paymentMethods} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {paymentMethods.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5 flex-1">
                {paymentMethods.map(p => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.fill }} />
                      <span className="text-xs text-muted-foreground">{p.name}</span>
                    </div>
                    <span className="text-xs font-semibold">{p.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Accounts */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Overdue Accounts</CardTitle>
          <CardDescription className="text-xs">Students with outstanding balances</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-xs font-medium text-muted-foreground py-2">Student</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2">Grade</th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-2">Balance</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-2">Months Overdue</th>
                </tr>
              </thead>
              <tbody>
                {overdueAccounts.map((a, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-2.5 font-medium">{a.name}</td>
                    <td className="py-2.5 text-muted-foreground text-xs">{a.grade}</td>
                    <td className="py-2.5 text-right font-semibold text-red-600">₱{a.balance.toLocaleString()}</td>
                    <td className="py-2.5 text-center">
                      <Badge className={`text-xs ${a.months >= 3 ? 'bg-red-100 text-red-700' : a.months >= 2 ? 'bg-amber-100 text-amber-700' : 'bg-muted text-foreground/90'}`}>
                        {a.months} mo
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
