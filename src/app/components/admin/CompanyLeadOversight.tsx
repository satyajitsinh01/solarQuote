import React, { useState } from 'react';
import { leads, salespeople } from '../../data/dummyData';
import { Lead } from '../../types';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Search, Filter, Eye, Calendar } from 'lucide-react';

export function CompanyLeadOversight() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [salespersonFilter, setSalespersonFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSalesperson = salespersonFilter === 'all' || lead.assignedTo === salespersonFilter;
    
    // Simple date filtering
    let matchesDate = true;
    if (dateRange === 'today') {
      matchesDate = lead.lastActivity === new Date().toISOString().split('T')[0];
    } else if (dateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(lead.lastActivity) >= weekAgo;
    } else if (dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(lead.lastActivity) >= monthAgo;
    }
    
    return matchesSearch && matchesStatus && matchesSalesperson && matchesDate;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-blue-100 text-blue-700',
      'contacted': 'bg-purple-100 text-purple-700',
      'quoted': 'bg-amber-100 text-amber-700',
      'negotiating': 'bg-orange-100 text-orange-700',
      'closed-won': 'bg-green-100 text-green-700',
      'closed-lost': 'bg-slate-100 text-slate-700',
    };
    return colors[status] || colors.new;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'new': 'New',
      'contacted': 'Contacted',
      'quoted': 'Quoted',
      'negotiating': 'Negotiating',
      'closed-won': 'Won',
      'closed-lost': 'Lost',
    };
    return labels[status] || status;
  };

  const getSalespersonName = (id: string) => {
    const salesperson = salespeople.find(sp => sp.id === id);
    return salesperson ? salesperson.name : 'Unassigned';
  };

  return (
    <Card className="p-3 md:p-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-3 md:mb-4">All Company Leads</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="negotiating">Negotiating</option>
            <option value="closed-won">Won</option>
            <option value="closed-lost">Lost</option>
          </select>

          <select
            value={salespersonFilter}
            onChange={(e) => setSalespersonFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Salespeople</option>
            {salespeople.map(sp => (
              <option key={sp.id} value={sp.id}>{sp.name}</option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-3 md:mb-4 text-xs md:text-sm text-slate-600">
        Showing {filteredLeads.length} of {leads.length} leads
      </div>

      {/* Table - Responsive */}
      <div className="border rounded-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="min-w-[120px]">Customer Name</TableHead>
              <TableHead className="min-w-[140px] hidden sm:table-cell">Contact</TableHead>
              <TableHead className="min-w-[100px] hidden md:table-cell">Salesperson</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[90px] hidden lg:table-cell">System Size</TableHead>
              <TableHead className="min-w-[100px] hidden lg:table-cell">Quote Value</TableHead>
              <TableHead className="min-w-[100px] hidden xl:table-cell">Last Activity</TableHead>
              <TableHead className="min-w-[60px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map(lead => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{lead.customerName}</div>
                    <div className="text-xs text-slate-500 sm:hidden mt-1">{lead.phone}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="text-sm">
                    <div>{lead.phone}</div>
                    <div className="text-slate-500 text-xs">{lead.email}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className="text-xs">{getSalespersonName(lead.assignedTo)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(lead.status)} text-xs`}>
                    {getStatusLabel(lead.status)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {lead.systemSize > 0 ? `${lead.systemSize} kW` : '-'}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {lead.quoteValue > 0 ? (
                    <span className="font-medium text-green-600 text-sm">
                      ₹{(lead.quoteValue / 100000).toFixed(2)}L
                    </span>
                  ) : '-'}
                </TableCell>
                <TableCell className="hidden xl:table-cell text-sm">
                  {new Date(lead.lastActivity).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          No leads found matching your filters.
        </div>
      )}
    </Card>
  );
}
