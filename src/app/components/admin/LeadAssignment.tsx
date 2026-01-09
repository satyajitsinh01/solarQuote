import React, { useState } from 'react';
import { leads as initialLeads, unassignedLeads as initialUnassigned, salespeople } from '../../data/dummyData';
import { Lead } from '../../types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { UserPlus, Users, ArrowRight, RefreshCw } from 'lucide-react';

export function LeadAssignment() {
  const [unassignedLeads, setUnassignedLeads] = useState<Lead[]>(initialUnassigned);
  const [assignedLeads, setAssignedLeads] = useState<Lead[]>(initialLeads);

  const handleAssignLead = (leadId: string, salespersonId: string) => {
    const lead = unassignedLeads.find(l => l.id === leadId);
    if (lead) {
      const updatedLead = { ...lead, assignedTo: salespersonId };
      setUnassignedLeads(unassignedLeads.filter(l => l.id !== leadId));
      setAssignedLeads([...assignedLeads, updatedLead]);
    }
  };

  const handleReassignLead = (leadId: string, newSalespersonId: string) => {
    setAssignedLeads(assignedLeads.map(lead => 
      lead.id === leadId ? { ...lead, assignedTo: newSalespersonId } : lead
    ));
  };

  const getSalespersonName = (id: string) => {
    const salesperson = salespeople.find(sp => sp.id === id);
    return salesperson ? salesperson.name : 'Unknown';
  };

  const activeSalespeople = salespeople.filter(sp => sp.active);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Unassigned Leads */}
      <Card className="p-3 md:p-6">
        <div className="mb-3 md:mb-4">
          <h2 className="text-base md:text-lg font-semibold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
            Unassigned Leads
          </h2>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            New leads waiting to be assigned to sales team members
          </p>
        </div>

        {unassignedLeads.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <UserPlus className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p>No unassigned leads at the moment</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="min-w-[120px]">Customer Name</TableHead>
                  <TableHead className="min-w-[140px] hidden sm:table-cell">Contact</TableHead>
                  <TableHead className="min-w-[150px] hidden md:table-cell">Property Address</TableHead>
                  <TableHead className="min-w-[100px]">Monthly Bill</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Created</TableHead>
                  <TableHead className="min-w-[150px]">Assign To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unassignedLeads.map(lead => (
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
                    <TableCell className="hidden md:table-cell text-sm">{lead.propertyAddress}</TableCell>
                    <TableCell>
                      <span className="font-medium text-sm">₹{lead.avgMonthlyBill.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </TableCell>
                    <TableCell>
                      <select
                        onChange={(e) => handleAssignLead(lead.id, e.target.value)}
                        className="px-2 md:px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer w-full"
                        defaultValue=""
                      >
                        <option value="" disabled>Select...</option>
                        {activeSalespeople.map(sp => (
                          <option key={sp.id} value={sp.id}>
                            {sp.name} ({sp.leadsAssigned})
                          </option>
                        ))}
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Reassign Existing Leads */}
      <Card className="p-3 md:p-6">
        <div className="mb-3 md:mb-4">
          <h2 className="text-base md:text-lg font-semibold text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            Reassign Active Leads
          </h2>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Transfer leads between team members to balance workload
          </p>
        </div>

        <div className="border rounded-lg overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="min-w-[120px]">Customer Name</TableHead>
                <TableHead className="min-w-[120px] hidden sm:table-cell">Current Salesperson</TableHead>
                <TableHead className="min-w-[90px]">Status</TableHead>
                <TableHead className="min-w-[100px] hidden md:table-cell">Quote Value</TableHead>
                <TableHead className="min-w-[150px]">Reassign To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedLeads.slice(0, 5).map(lead => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium text-sm">{lead.customerName}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Users className="w-3 h-3" />
                      {getSalespersonName(lead.assignedTo)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'quoted' ? 'bg-amber-100 text-amber-700' :
                      lead.status === 'closed-won' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {lead.quoteValue > 0 ? (
                      <span className="font-medium text-green-600 text-sm">
                        ₹{(lead.quoteValue / 100000).toFixed(2)}L
                      </span>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <select
                      value={lead.assignedTo}
                      onChange={(e) => handleReassignLead(lead.id, e.target.value)}
                      className="px-2 md:px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer w-full"
                    >
                      {activeSalespeople.map(sp => (
                        <option key={sp.id} value={sp.id}>
                          {sp.name}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Workload Distribution */}
      <Card className="p-3 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-3 md:mb-4">Team Workload Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {activeSalespeople.map(sp => {
            const spLeads = assignedLeads.filter(l => l.assignedTo === sp.id);
            const activeLeads = spLeads.filter(l => !['closed-won', 'closed-lost'].includes(l.status));

            return (
              <Card key={sp.id} className="p-4 bg-slate-50">
                <div className="font-medium text-slate-900 mb-2">{sp.name}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Leads:</span>
                    <span className="font-semibold">{spLeads.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Active:</span>
                    <span className="font-semibold text-blue-600">{activeLeads.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Won:</span>
                    <span className="font-semibold text-green-600">
                      {spLeads.filter(l => l.status === 'closed-won').length}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
