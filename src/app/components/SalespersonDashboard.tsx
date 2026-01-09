import React, { useState } from 'react';
import { LeadListView } from './salesperson/LeadListView';
import { QuotationBuilder } from './salesperson/QuotationBuilder';
import { NewLeadForm } from './salesperson/NewLeadForm';
import { Lead } from '../types';
import { leads } from '../data/dummyData';
import { LayoutDashboard, UserPlus, ClipboardList, BarChart3, Inbox, FileText, CheckCircle2, IndianRupee, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface SalespersonDashboardProps {
  userName: string;
}

export function SalespersonDashboard({ userName }: SalespersonDashboardProps) {
  const [allLeads, setAllLeads] = useState<Lead[]>(leads);
  const [activeView, setActiveView] = useState<'dashboard' | 'new-lead' | 'quotation'>('dashboard');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Filter leads for the current salesperson (demo: sp-001)
  const currentSalespersonId = 'sp-001';
  const myLeads = allLeads.filter(lead => lead.assignedTo === currentSalespersonId);

  const handleCreateLead = (leadData: Partial<Lead>) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      customerName: leadData.customerName || '',
      email: leadData.email || '',
      phone: leadData.phone || '',
      propertyAddress: leadData.propertyAddress || '',
      avgMonthlyBill: leadData.avgMonthlyBill || 0,
      status: 'new',
      assignedTo: currentSalespersonId,
      systemSize: 0,
      quoteValue: 0,
      lastActivity: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAllLeads([...allLeads, newLead]);
    // Directly open quotation for the new lead
    setSelectedLead(newLead);
    setActiveView('quotation');
  };

  const handleOpenQuotation = (lead: Lead) => {
    setSelectedLead(lead);
    setActiveView('quotation');
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setAllLeads(allLeads.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
    setSelectedLead(updatedLead);
  };

  const handleBackToDashboard = () => {
    setActiveView('dashboard');
    setSelectedLead(null);
  };

  // Calculate stats
  const stats = {
    total: myLeads.length,
    new: myLeads.filter(l => l.status === 'new').length,
    quoted: myLeads.filter(l => l.status === 'quoted').length,
    won: myLeads.filter(l => l.status === 'closed-won').length,
    totalValue: myLeads.reduce((sum, l) => sum + l.quoteValue, 0),
  };

  return (
    <div className="max-w-[1800px] mx-auto p-4 md:p-6">
      {activeView === 'dashboard' && (
        <>
          {/* Header */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-slate-900 mb-1">My Sales Dashboard</h1>
                <p className="text-sm md:text-base text-slate-600">Welcome back, {userName}! Here's your lead pipeline.</p>
              </div>
              <Button onClick={() => setActiveView('new-lead')} className="gap-2" size="sm">
                <UserPlus className="w-4 h-4" />
                Add New Lead
              </Button>
            </div>
          </div>

          {/* Stats Cards - Dashboard Style */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 mb-4 md:mb-5">
            <Card className="p-3 md:p-4 hover:shadow-md transition-shadow relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-[#0F2647]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm text-slate-600 mb-0.5">Total Leads</div>
                  <div className="text-xl md:text-2xl font-bold text-[#0F2647]">{stats.total}</div>
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-emerald-50 text-emerald-700 text-[10px] md:text-xs font-medium px-1.5 py-0.5 rounded">
                +3.4%
              </div>
            </Card>
            <Card className="p-3 md:p-4 hover:shadow-md transition-shadow relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <Inbox className="w-5 h-5 text-[#0F2647]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm text-slate-600 mb-0.5">New</div>
                  <div className="text-xl md:text-2xl font-bold text-[#0F2647]">{stats.new}</div>
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-emerald-50 text-emerald-700 text-[10px] md:text-xs font-medium px-1.5 py-0.5 rounded">
                +3.4%
              </div>
            </Card>
            <Card className="p-3 md:p-4 hover:shadow-md transition-shadow relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-[#0F2647]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm text-slate-600 mb-0.5">Quoted</div>
                  <div className="text-xl md:text-2xl font-bold text-[#0F2647]">{stats.quoted}</div>
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-emerald-50 text-emerald-700 text-[10px] md:text-xs font-medium px-1.5 py-0.5 rounded">
                +3.4%
              </div>
            </Card>
            <Card className="p-3 md:p-4 hover:shadow-md transition-shadow relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#0F2647]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm text-slate-600 mb-0.5">Won</div>
                  <div className="text-xl md:text-2xl font-bold text-[#0F2647]">{stats.won}</div>
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-emerald-50 text-emerald-700 text-[10px] md:text-xs font-medium px-1.5 py-0.5 rounded">
                +3.4%
              </div>
            </Card>
            <Card className="p-3 md:p-4 hover:shadow-md transition-shadow relative col-span-2 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <IndianRupee className="w-5 h-5 text-[#0F2647]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm text-slate-600 mb-0.5">Total Value</div>
                  <div className="text-xl md:text-2xl font-bold text-[#0F2647]">₹{(stats.totalValue / 100000).toFixed(1)}L</div>
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-emerald-50 text-emerald-700 text-[10px] md:text-xs font-medium px-1.5 py-0.5 rounded">
                +3.4%
              </div>
            </Card>
          </div>

          {/* Lead List */}
          <LeadListView 
            leads={myLeads} 
            onOpenQuotation={handleOpenQuotation}
          />
        </>
      )}

      {activeView === 'new-lead' && (
        <NewLeadForm 
          onSubmit={handleCreateLead}
          onCancel={handleBackToDashboard}
        />
      )}

      {activeView === 'quotation' && selectedLead && (
        <QuotationBuilder 
          lead={selectedLead}
          onUpdateLead={handleUpdateLead}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}