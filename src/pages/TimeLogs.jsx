import { useState, useMemo } from 'react';
import { Timer, Clock, CheckCircle, AlertTriangle, Users, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useTimeLogs } from '../contexts/TimeLogContext';

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(timeStr) {
  if (!timeStr) return '--';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${display}:${m} ${ampm}`;
}

function computeDuration(timeIn, timeOut) {
  if (!timeIn || !timeOut) return '--';
  const [h1, m1] = timeIn.split(':').map(Number);
  const [h2, m2] = timeOut.split(':').map(Number);
  const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (diff <= 0) return '--';
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

export default function TimeLogs() {
  const { user } = useAuth();
  const { logs, getStats } = useTimeLogs();
  const isAdmin = user?.role === 'admin' || user?.role === 'principal';
  const [activeTab, setActiveTab] = useState('daily');
  const [filterDate, setFilterDate] = useState(todayStr());
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const visibleLogs = useMemo(() => {
    let filtered = isAdmin ? logs : logs.filter(l => l.userId === user?.id);
    if (filterDate) filtered = filtered.filter(l => l.date === filterDate);
    if (filterRole) filtered = filtered.filter(l => l.role === filterRole);
    if (filterStatus) filtered = filtered.filter(l => l.status === filterStatus);
    return filtered;
  }, [logs, isAdmin, user, filterDate, filterRole, filterStatus]);

  const statsLogs = useMemo(() => {
    return isAdmin ? logs : logs.filter(l => l.userId === user?.id);
  }, [logs, isAdmin, user]);

  const stats = getStats(statsLogs);

  const statCards = [
    { label: 'Total Logs', value: stats.total, icon: Users, bgClass: 'bg-indigo-50', borderClass: 'border-indigo-200', labelClass: 'text-indigo-600', countClass: 'text-indigo-700', iconBg: 'bg-indigo-100' },
    { label: 'On Time', value: stats.onTime, icon: CheckCircle, bgClass: 'bg-green-50', borderClass: 'border-green-200', labelClass: 'text-green-600', countClass: 'text-green-700', iconBg: 'bg-green-100' },
    { label: 'Late', value: stats.late, icon: AlertTriangle, bgClass: 'bg-amber-50', borderClass: 'border-amber-200', labelClass: 'text-amber-600', countClass: 'text-amber-700', iconBg: 'bg-amber-100' },
    { label: 'On-Time Rate', value: `${stats.rate}%`, icon: Timer, bgClass: 'bg-blue-50', borderClass: 'border-blue-200', labelClass: 'text-blue-600', countClass: 'text-blue-700', iconBg: 'bg-blue-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Time Logs</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="daily">Daily Logs</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={cn(stat.bgClass, stat.borderClass)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className={cn('text-sm font-medium', stat.labelClass)}>{stat.label}</p>
                  <div className={cn('h-8 w-8 rounded-full flex items-center justify-center', stat.iconBg)}>
                    <Icon className={cn('h-4 w-4', stat.labelClass)} />
                  </div>
                </div>
                <p className={cn('text-2xl font-bold mt-1', stat.countClass)}>{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {activeTab === 'daily' && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-auto"
            />
            {isAdmin && (
              <>
                <Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-auto">
                  <option value="">All Roles</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </Select>
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-auto">
                  <option value="">All Status</option>
                  <option value="on-time">On Time</option>
                  <option value="late">Late</option>
                </Select>
              </>
            )}
          </div>

          {/* Table */}
          {visibleLogs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-10 w-10 mx-auto mb-3 text-muted-foreground/60" />
                <p className="text-muted-foreground font-medium">No time logs found</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Clock in to start logging</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Time In</TableHead>
                    <TableHead className="text-center">Time Out</TableHead>
                    <TableHead className="text-center">Duration</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.userName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">{log.role}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(log.date)}</TableCell>
                      <TableCell className="text-center font-mono text-sm">{formatTime(log.timeIn)}</TableCell>
                      <TableCell className="text-center font-mono text-sm">{formatTime(log.timeOut)}</TableCell>
                      <TableCell className="text-center text-sm">{computeDuration(log.timeIn, log.timeOut)}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          'text-xs',
                          log.status === 'on-time'
                            ? 'bg-green-100 text-green-700 border-0'
                            : 'bg-amber-100 text-amber-700 border-0'
                        )}>
                          {log.status === 'on-time' ? 'On Time' : 'Late'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </>
      )}

      {activeTab === 'stats' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              {isAdmin ? 'All Users Statistics' : 'My Statistics'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <p className="text-4xl font-bold text-green-700">{stats.onTime}</p>
                <p className="text-sm text-green-600 mt-1">On-Time Arrivals</p>
              </div>
              <div className="text-center p-6 bg-amber-50 rounded-xl">
                <p className="text-4xl font-bold text-amber-700">{stats.late}</p>
                <p className="text-sm text-amber-600 mt-1">Late Arrivals</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <p className="text-4xl font-bold text-blue-700">{stats.rate}%</p>
                <p className="text-sm text-blue-600 mt-1">On-Time Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
