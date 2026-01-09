import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SalesTeamManagement } from './admin/SalesTeamManagement';
import { CompanyLeadOversight } from './admin/CompanyLeadOversight';
import { LeadAssignment } from './admin/LeadAssignment';
import { InventoryPricing } from './admin/InventoryPricing';
import { Card } from './ui/card';
import { 
  Users, 
  ClipboardList, 
  UserPlus, 
  Package,
  TrendingUp,
  IndianRupee,
  Target,
  Award
} from 'lucide-react';
import { salespeople, leads } from '../data/dummyData';

interface AdminDashboardProps {
  userName: string;
}

export function AdminDashboard({ userName }: AdminDashboardProps) {
  // Calculate overall stats
  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + lead.quoteValue, 0);
  const wonLeads = leads.filter(l => l.status === 'closed-won').length;
  const totalSalesTeam = salespeople.filter(sp => sp.active).length;
  const avgQuoteValue = totalValue / totalLeads;

  return (
    <div className="max-w-[1600px] mx-auto p-3 md:p-6">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-900 mb-1 md:mb-2">Admin Control Center</h1>
        <p className="text-sm md:text-base text-slate-600">Welcome {userName}, manage your sales team, leads, and business configurations.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
        <Card className="p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="text-xs md:text-sm text-slate-600">Total Leads</div>
              <div className="text-lg md:text-2xl font-bold text-slate-900">{totalLeads}</div>
            </div>
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Award className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <div className="text-xs md:text-sm text-slate-600">Won Deals</div>
              <div className="text-lg md:text-2xl font-bold text-green-600">{wonLeads}</div>
            </div>
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <IndianRupee className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <div className="text-xs md:text-sm text-slate-600">Total Pipeline</div>
              <div className="text-lg md:text-2xl font-bold text-amber-600">₹{(totalValue / 100000).toFixed(1)}L</div>
            </div>
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              <div className="text-xs md:text-sm text-slate-600">Active Team</div>
              <div className="text-lg md:text-2xl font-bold text-purple-600">{totalSalesTeam}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="oversight" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 h-auto">
          <TabsTrigger value="oversight" className="gap-1 md:gap-2 text-xs md:text-sm py-2 md:py-3 px-2 md:px-4">
            <ClipboardList className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Lead Oversight</span>
            <span className="sm:hidden">Oversight</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-1 md:gap-2 text-xs md:text-sm py-2 md:py-3 px-2 md:px-4">
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Sales Team</span>
            <span className="sm:hidden">Team</span>
          </TabsTrigger>
          <TabsTrigger value="assignment" className="gap-1 md:gap-2 text-xs md:text-sm py-2 md:py-3 px-2 md:px-4">
            <UserPlus className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Lead Assignment</span>
            <span className="sm:hidden">Assign</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-1 md:gap-2 text-xs md:text-sm py-2 md:py-3 px-2 md:px-4">
            <Package className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Inventory & Pricing</span>
            <span className="sm:hidden">Inventory</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="oversight">
          <CompanyLeadOversight />
        </TabsContent>

        <TabsContent value="team">
          <SalesTeamManagement />
        </TabsContent>

        <TabsContent value="assignment">
          <LeadAssignment />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryPricing />
        </TabsContent>
      </Tabs>
    </div>
  );
}