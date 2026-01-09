import React, { useState } from 'react';
import { SalespersonDashboard } from './components/SalespersonDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginPage } from './components/LoginPage';
import { Button } from './components/ui/button';
import { SolaraLogo } from './components/SolaraLogo';
import { LogOut } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<{ email: string; role: 'admin' | 'salesperson'; name: string } | null>(null);

  const handleLogin = (email: string, role: 'admin' | 'salesperson', name: string) => {
    setUser({ email, role, name });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-3 md:px-6 py-2 md:py-3 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <SolaraLogo size="sm" showText={true} className="flex-shrink-0" />
            <span className="text-xs md:text-sm text-slate-600 hidden lg:block truncate">Lead Management & Quotation System</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-xs md:text-sm font-medium text-slate-900">{user.name}</div>
              <div className="text-xs text-slate-500 capitalize">{user.role}</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleLogout}
              className="gap-1 md:gap-2 h-8 md:h-9 px-2 md:px-3"
            >
              <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {user.role === 'salesperson' ? (
        <SalespersonDashboard userName={user.name} />
      ) : (
        <AdminDashboard userName={user.name} />
      )}
    </div>
  );
}