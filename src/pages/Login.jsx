import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ROLE_CONFIG from '../data/roleConfig';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { GraduationCap, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ROLE_DEMO_ORDER = ['admin', 'principal', 'teacher', 'student', 'parent', 'registrar', 'cashier', 'counselor'];

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(null); // role key or 'credentials'

  const handleDemoLogin = (role) => {
    setLoading(role);
    setError('');
    // Small delay for visual feedback
    setTimeout(() => {
      login(role);
      setLoading(null);
    }, 300);
  };

  const handleCredentialLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setLoading('credentials');
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error);
      }
      setLoading(null);
    }, 300);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Brand Panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex-col justify-between p-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">SchoolERP</h1>
          </div>
          <p className="text-sm text-white/50">Student Information System</p>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
            Manage your school<br />with confidence.
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-md">
            A comprehensive platform for administrators, teachers, students, and parents
            to collaborate and manage every aspect of school operations.
          </p>
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-2xl font-bold">1,248</p>
              <p className="text-white/50 text-xs">Students</p>
            </div>
            <div>
              <p className="text-2xl font-bold">86</p>
              <p className="text-white/50 text-xs">Teachers</p>
            </div>
            <div>
              <p className="text-2xl font-bold">42</p>
              <p className="text-white/50 text-xs">Classes</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/30">A.Y. 2025 &ndash; 2026 &middot; Third Quarter</p>
      </div>

      {/* Right: Login Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-muted/30">
        <div className="w-full max-w-lg space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-4">
            <div className="inline-flex items-center gap-2 mb-1">
              <GraduationCap className="h-6 w-6" />
              <h1 className="text-xl font-bold">SchoolERP</h1>
            </div>
            <p className="text-xs text-muted-foreground">Student Information System</p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to access your dashboard</p>
          </div>

          <Tabs defaultValue="demo" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-9">
              <TabsTrigger value="demo" className="text-xs">Quick Demo Access</TabsTrigger>
              <TabsTrigger value="credentials" className="text-xs">Email & Password</TabsTrigger>
            </TabsList>

            {/* Demo Role Cards */}
            <TabsContent value="demo" className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ROLE_DEMO_ORDER.map(roleKey => {
                  const cfg = ROLE_CONFIG[roleKey];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={roleKey}
                      onClick={() => handleDemoLogin(roleKey)}
                      disabled={loading !== null}
                      className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent bg-white shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 disabled:opacity-50 ${loading === roleKey ? 'ring-2 ring-primary' : ''}`}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${cfg.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{cfg.shortLabel}</span>
                      {loading === roleKey && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Click any role to instantly log in as a demo user
              </p>
            </TabsContent>

            {/* Credential Form */}
            <TabsContent value="credentials" className="mt-4">
              <form onSubmit={handleCredentialLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@school.edu.ph"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading !== null}
                >
                  {loading === 'credentials' ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-600 mb-2">Demo Credentials</p>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-500">
                  <span>admin@school.edu.ph</span><span>admin123</span>
                  <span>rosa.montoya@school.edu.ph</span><span>teacher123</span>
                  <span>juan.delacruz@student.school.edu.ph</span><span>student123</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
