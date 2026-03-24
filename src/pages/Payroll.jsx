import { useState, useMemo } from 'react';
import { Banknote, FileText, Users, DollarSign, CheckCircle, Clock, ArrowRight, Eye, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../components/ui/sheet';
import { Separator } from '../components/ui/separator';
import { cn } from '../lib/utils';

const STORAGE_KEY = 'schoolerp_payroll';

const teacherProfiles = [
  { id: 1, name: 'Rosa Lina Montoya', employeeId: 'TCH-2024-001', dept: 'Mathematics', baseSalary: 25000, transport: 1500, rice: 2000, clothing: 500 },
  { id: 2, name: 'Carlos Andrade Santos', employeeId: 'TCH-2024-002', dept: 'Science', baseSalary: 25000, transport: 1500, rice: 2000, clothing: 500 },
  { id: 3, name: 'Maria Fe Dela Rosa', employeeId: 'TCH-2024-003', dept: 'Filipino', baseSalary: 25000, transport: 1500, rice: 2000, clothing: 500 },
  { id: 4, name: 'Jerome Pascual Bautista', employeeId: 'TCH-2024-004', dept: 'English', baseSalary: 25000, transport: 1500, rice: 2000, clothing: 500 },
  { id: 5, name: 'Lourdes Reyes Villanueva', employeeId: 'TCH-2024-005', dept: 'Social Studies', baseSalary: 25000, transport: 1500, rice: 2000, clothing: 500 },
  { id: 6, name: 'Ricardo Gabriel Mendoza', employeeId: 'TCH-2024-006', dept: 'MAPEH', baseSalary: 25000, transport: 1500, rice: 2000, clothing: 500 },
  { id: 7, name: 'Anna Patricia Cruz', employeeId: 'TCH-2024-007', dept: 'TLE', baseSalary: 25000, transport: 1500, rice: 2000, clothing: 500 },
  { id: 8, name: 'Fernando Jose Aguilar', employeeId: 'TCH-2024-008', dept: 'ESP', baseSalary: 25000, transport: 1500, rice: 2000, clothing: 500 },
];

const payPeriods = [
  { id: '2026-03-A', label: 'March 1-15, 2026' },
  { id: '2026-03-B', label: 'March 16-31, 2026' },
  { id: '2026-02-A', label: 'February 1-14, 2026' },
  { id: '2026-02-B', label: 'February 15-28, 2026' },
  { id: '2026-01-A', label: 'January 1-15, 2026' },
  { id: '2026-01-B', label: 'January 16-31, 2026' },
];

function computePayslip(profile) {
  const grossBase = profile.baseSalary / 2; // semi-monthly
  const allowances = (profile.transport + profile.rice + profile.clothing) / 2;
  const grossPay = grossBase + allowances;

  const sss = grossBase * 0.045;
  const philhealth = grossBase * 0.025;
  const pagibig = 100;
  const taxableIncome = grossBase - sss - philhealth - pagibig;
  const tax = taxableIncome * 0.10;
  const totalDeductions = sss + philhealth + pagibig + tax;
  const netPay = grossPay - totalDeductions;

  return {
    grossBase,
    allowances,
    transport: profile.transport / 2,
    rice: profile.rice / 2,
    clothing: profile.clothing / 2,
    grossPay,
    sss,
    philhealth,
    pagibig,
    tax,
    totalDeductions,
    netPay,
  };
}

function loadPayroll() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function savePayroll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function Payroll() {
  const [activeTab, setActiveTab] = useState('payslips');
  const [payslips, setPayslips] = useState(loadPayroll);
  const [selectedPeriod, setSelectedPeriod] = useState(payPeriods[0].id);
  const [viewPayslip, setViewPayslip] = useState(null);

  const periodPayslips = useMemo(() => {
    return payslips.filter(p => p.periodId === selectedPeriod);
  }, [payslips, selectedPeriod]);

  const hasGenerated = periodPayslips.length > 0;

  function handleGenerate() {
    if (hasGenerated) return;
    const newSlips = teacherProfiles.map(t => ({
      id: `ps_${Date.now()}_${t.id}`,
      periodId: selectedPeriod,
      periodLabel: payPeriods.find(p => p.id === selectedPeriod)?.label,
      teacherId: t.id,
      teacherName: t.name,
      employeeId: t.employeeId,
      dept: t.dept,
      ...computePayslip(t),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }));
    const updated = [...newSlips, ...payslips];
    setPayslips(updated);
    savePayroll(updated);
  }

  function handleProcess() {
    const updated = payslips.map(p =>
      p.periodId === selectedPeriod && p.status === 'pending' ? { ...p, status: 'processed' } : p
    );
    setPayslips(updated);
    savePayroll(updated);
  }

  function handleRelease() {
    const updated = payslips.map(p =>
      p.periodId === selectedPeriod && p.status === 'processed' ? { ...p, status: 'released' } : p
    );
    setPayslips(updated);
    savePayroll(updated);
  }

  const periodStatus = useMemo(() => {
    if (!hasGenerated) return 'none';
    if (periodPayslips.every(p => p.status === 'released')) return 'released';
    if (periodPayslips.every(p => p.status === 'processed' || p.status === 'released')) return 'processed';
    return 'pending';
  }, [periodPayslips, hasGenerated]);

  const summaryStats = useMemo(() => {
    const totalGross = periodPayslips.reduce((s, p) => s + p.grossPay, 0);
    const totalDeductions = periodPayslips.reduce((s, p) => s + p.totalDeductions, 0);
    const totalNet = periodPayslips.reduce((s, p) => s + p.netPay, 0);
    return { totalGross, totalDeductions, totalNet, count: periodPayslips.length };
  }, [periodPayslips]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Payroll</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="payslips">Payslips</TabsTrigger>
            <TabsTrigger value="profiles">Salary Profiles</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-indigo-600">Teachers</p>
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-indigo-700 mt-1">{teacherProfiles.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-green-600">Total Gross</p>
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-700 mt-1">₱{summaryStats.totalGross.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-red-600">Deductions</p>
              <FileText className="h-4 w-4 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-700 mt-1">₱{summaryStats.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-blue-600">Net Payout</p>
              <Banknote className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-700 mt-1">₱{summaryStats.totalNet.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          </CardContent>
        </Card>
      </div>

      {/* === PAYSLIPS TAB === */}
      {activeTab === 'payslips' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <Select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="w-auto">
              {payPeriods.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </Select>
            <div className="flex gap-2">
              {!hasGenerated && (
                <Button onClick={handleGenerate} className="gap-2"><FileText className="h-4 w-4" />Generate Payslips</Button>
              )}
              {periodStatus === 'pending' && (
                <Button onClick={handleProcess} variant="outline" className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50">
                  <ArrowRight className="h-4 w-4" />Process
                </Button>
              )}
              {periodStatus === 'processed' && (
                <Button onClick={handleRelease} variant="outline" className="gap-2 border-green-300 text-green-700 hover:bg-green-50">
                  <CheckCircle className="h-4 w-4" />Release
                </Button>
              )}
            </div>
            {hasGenerated && (
              <Badge className={cn('text-xs ml-auto',
                periodStatus === 'released' ? 'bg-green-100 text-green-700 border-0' :
                periodStatus === 'processed' ? 'bg-blue-100 text-blue-700 border-0' :
                'bg-amber-100 text-amber-700 border-0'
              )}>
                {periodStatus === 'released' ? 'Released' : periodStatus === 'processed' ? 'Processed' : 'Pending'}
              </Badge>
            )}
          </div>

          {!hasGenerated ? (
            <Card><CardContent className="p-12 text-center">
              <Banknote className="h-10 w-10 mx-auto mb-3 text-muted-foreground/60" />
              <p className="text-muted-foreground font-medium">No payslips generated for this period</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Click "Generate Payslips" to create payslips for all teachers</p>
            </CardContent></Card>
          ) : (
            <Card>
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Gross Pay</TableHead>
                    <TableHead className="text-right">Deductions</TableHead>
                    <TableHead className="text-right">Net Pay</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periodPayslips.map(slip => (
                    <TableRow key={slip.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{slip.teacherName}</p>
                          <p className="text-xs text-muted-foreground">{slip.employeeId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{slip.dept}</TableCell>
                      <TableCell className="text-right font-mono text-sm">₱{slip.grossPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-red-600">-₱{slip.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold">₱{slip.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn('text-xs',
                          slip.status === 'released' ? 'bg-green-100 text-green-700 border-0' :
                          slip.status === 'processed' ? 'bg-blue-100 text-blue-700 border-0' :
                          'bg-amber-100 text-amber-700 border-0'
                        )}>
                          {slip.status === 'released' ? 'Released' : slip.status === 'processed' ? 'Processed' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" onClick={() => setViewPayslip(slip)} className="gap-1 text-primary">
                          <Eye className="h-3.5 w-3.5" />View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      )}

      {/* === SALARY PROFILES TAB === */}
      {activeTab === 'profiles' && (
        <Card>
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Base Salary</TableHead>
                <TableHead className="text-right">Transport</TableHead>
                <TableHead className="text-right">Rice</TableHead>
                <TableHead className="text-right">Clothing</TableHead>
                <TableHead className="text-right">Total Monthly</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teacherProfiles.map(t => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.employeeId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{t.dept}</TableCell>
                  <TableCell className="text-right font-mono text-sm">₱{t.baseSalary.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">₱{t.transport.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">₱{t.rice.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">₱{t.clothing.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">₱{(t.baseSalary + t.transport + t.rice + t.clothing).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* === SUMMARY TAB === */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Payroll Summary by Period</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Period</TableHead>
                    <TableHead className="text-center">Payslips</TableHead>
                    <TableHead className="text-right">Total Gross</TableHead>
                    <TableHead className="text-right">Total Net</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payPeriods.map(period => {
                    const pSlips = payslips.filter(p => p.periodId === period.id);
                    if (pSlips.length === 0) return null;
                    const tGross = pSlips.reduce((s, p) => s + p.grossPay, 0);
                    const tNet = pSlips.reduce((s, p) => s + p.netPay, 0);
                    const allReleased = pSlips.every(p => p.status === 'released');
                    const allProcessed = pSlips.every(p => p.status === 'processed' || p.status === 'released');
                    return (
                      <TableRow key={period.id}>
                        <TableCell className="font-medium">{period.label}</TableCell>
                        <TableCell className="text-center">{pSlips.length}</TableCell>
                        <TableCell className="text-right font-mono">₱{tGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right font-mono font-semibold">₱{tNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn('text-xs', allReleased ? 'bg-green-100 text-green-700 border-0' : allProcessed ? 'bg-blue-100 text-blue-700 border-0' : 'bg-amber-100 text-amber-700 border-0')}>
                            {allReleased ? 'Released' : allProcessed ? 'Processed' : 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {payslips.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No payroll data yet. Generate payslips from the Payslips tab.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Deduction Breakdown</CardTitle>
              <CardDescription className="text-xs">Standard PH government deductions per semi-monthly period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-muted text-center">
                  <p className="text-xs text-muted-foreground font-medium">SSS (4.5%)</p>
                  <p className="text-lg font-bold mt-1">₱{(25000 / 2 * 0.045).toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted text-center">
                  <p className="text-xs text-muted-foreground font-medium">PhilHealth (2.5%)</p>
                  <p className="text-lg font-bold mt-1">₱{(25000 / 2 * 0.025).toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted text-center">
                  <p className="text-xs text-muted-foreground font-medium">Pag-IBIG</p>
                  <p className="text-lg font-bold mt-1">₱100.00</p>
                </div>
                <div className="p-4 rounded-lg bg-muted text-center">
                  <p className="text-xs text-muted-foreground font-medium">Tax (10%)</p>
                  <p className="text-lg font-bold mt-1">₱{((25000 / 2 - 25000 / 2 * 0.045 - 25000 / 2 * 0.025 - 100) * 0.10).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payslip Detail Sheet */}
      <Sheet open={!!viewPayslip} onOpenChange={(open) => { if (!open) setViewPayslip(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {viewPayslip && (
            <>
              <SheetHeader>
                <SheetTitle>Payslip Detail</SheetTitle>
                <SheetDescription>{viewPayslip.periodLabel}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Employee Info */}
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-bold">{viewPayslip.teacherName}</p>
                  <p className="text-xs text-muted-foreground">{viewPayslip.employeeId} · {viewPayslip.dept}</p>
                </div>

                {/* Earnings */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Earnings</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span>Base Salary (semi-monthly)</span><span className="font-mono">₱{viewPayslip.grossBase.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between text-sm"><span>Transportation Allowance</span><span className="font-mono">₱{viewPayslip.transport.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between text-sm"><span>Rice Allowance</span><span className="font-mono">₱{viewPayslip.rice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between text-sm"><span>Clothing Allowance</span><span className="font-mono">₱{viewPayslip.clothing.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                    <Separator />
                    <div className="flex justify-between text-sm font-bold"><span>Gross Pay</span><span className="font-mono text-green-700">₱{viewPayslip.grossPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Deductions</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span>SSS (4.5%)</span><span className="font-mono text-red-600">-₱{viewPayslip.sss.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between text-sm"><span>PhilHealth (2.5%)</span><span className="font-mono text-red-600">-₱{viewPayslip.philhealth.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between text-sm"><span>Pag-IBIG</span><span className="font-mono text-red-600">-₱{viewPayslip.pagibig.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between text-sm"><span>Withholding Tax (10%)</span><span className="font-mono text-red-600">-₱{viewPayslip.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                    <Separator />
                    <div className="flex justify-between text-sm font-bold"><span>Total Deductions</span><span className="font-mono text-red-700">-₱{viewPayslip.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                  </div>
                </div>

                <Separator className="my-2" />

                {/* Net Pay */}
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold">Net Pay</span>
                    <span className="text-xl font-bold text-primary">₱{viewPayslip.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <Badge className={cn('text-xs',
                  viewPayslip.status === 'released' ? 'bg-green-100 text-green-700 border-0' :
                  viewPayslip.status === 'processed' ? 'bg-blue-100 text-blue-700 border-0' :
                  'bg-amber-100 text-amber-700 border-0'
                )}>
                  {viewPayslip.status === 'released' ? 'Released' : viewPayslip.status === 'processed' ? 'Processed' : 'Pending'}
                </Badge>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
