import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { SolaraLogo } from './SolaraLogo';
import { Lock, Mail, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, role: 'admin' | 'salesperson', name: string) => void;
}

// Static credentials
const CREDENTIALS = {
  admin: {
    email: 'admin@solarquote.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
  },
  salesperson: {
    email: 'sales@solarquote.com',
    password: 'sales123',
    name: 'Rajesh Kumar',
    role: 'salesperson' as const,
  },
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check credentials
    if (email === CREDENTIALS.admin.email && password === CREDENTIALS.admin.password) {
      onLogin(CREDENTIALS.admin.email, CREDENTIALS.admin.role, CREDENTIALS.admin.name);
    } else if (email === CREDENTIALS.salesperson.email && password === CREDENTIALS.salesperson.password) {
      onLogin(CREDENTIALS.salesperson.email, CREDENTIALS.salesperson.role, CREDENTIALS.salesperson.name);
    } else {
      setError('Invalid email or password');
    }
  };

  const handleQuickLogin = (type: 'admin' | 'salesperson') => {
    const cred = CREDENTIALS[type];
    onLogin(cred.email, cred.role, cred.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo with Animation */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4 transform hover:scale-105 transition-transform duration-300">
            <SolaraLogo size="lg" showText={true} />
          </div>
          <p className="text-slate-300 text-sm font-light">Solar Lead Management & Quotation System</p>
        </div>

        {/* Login Card with Enhanced Styling */}
        <Card className="p-8 shadow-2xl border-0 bg-white/95 backdrop-blur-sm animate-slide-up">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 text-center">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 mb-2 flex items-center gap-2 font-medium">
                <div className="p-1.5 rounded-lg bg-purple-100">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 pl-4 pr-4 border-2 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 mb-2 flex items-center gap-2 font-medium">
                <div className="p-1.5 rounded-lg bg-purple-100">
                  <Lock className="w-4 h-4 text-purple-600" />
                </div>
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pl-4 pr-4 border-2 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-sm animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-500 font-medium">Quick Login</span>
            </div>
          </div>

          {/* Demo Credentials - Enhanced */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 gap-2 border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
              onClick={() => handleQuickLogin('salesperson')}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold text-sm group-hover:scale-110 transition-transform">
                    S
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900">Salesperson</div>
                    <div className="text-xs text-slate-500">sales@solarquote.com</div>
                  </div>
                </div>
                <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 gap-2 border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
              onClick={() => handleQuickLogin('admin')}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm group-hover:scale-110 transition-transform">
                    A
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900">Admin</div>
                    <div className="text-xs text-slate-500">admin@solarquote.com</div>
                  </div>
                </div>
                <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </Button>
          </div>

          {/* Credentials Display - Enhanced */}
          <div className="mt-6 p-4 bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              Demo Credentials
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-600 font-medium">Salesperson:</span>
                <code className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">sales@solarquote.com / sales123</code>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-600 font-medium">Admin:</span>
                <code className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">admin@solarquote.com / admin123</code>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
}
