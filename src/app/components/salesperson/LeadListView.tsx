import React, { useState } from 'react';
import { Lead } from '../../types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Search,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  Zap
} from 'lucide-react';

interface LeadListViewProps {
  leads: Lead[];
  onOpenQuotation: (lead: Lead) => void;
}

export function LeadListView({ leads, onOpenQuotation }: LeadListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-blue-100 text-blue-700 border-blue-200',
      'contacted': 'bg-purple-100 text-purple-700 border-purple-200',
      'quoted': 'bg-amber-100 text-amber-700 border-amber-200',
      'negotiating': 'bg-orange-100 text-orange-700 border-orange-200',
      'closed-won': 'bg-green-100 text-green-700 border-green-200',
      'closed-lost': 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return colors[status] || colors.new;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'new': 'New Lead',
      'contacted': 'Contacted',
      'quoted': 'Quoted',
      'negotiating': 'Negotiating',
      'closed-won': 'Won',
      'closed-lost': 'Lost',
    };
    return labels[status] || status;
  };

  const getStatusBadgeClasses = (status: string) => {
    const base =
      'inline-flex items-center rounded-sm px-2.5 py-0.5 text-[11px] font-medium border';
    const variants: Record<string, string> = {
      new: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      contacted: 'bg-sky-50 text-sky-700 border-sky-100',
      quoted: 'bg-amber-50 text-amber-700 border-amber-100',
      negotiating: 'bg-orange-50 text-orange-700 border-orange-100',
      'closed-won': 'bg-green-50 text-green-700 border-green-100',
      'closed-lost': 'bg-slate-50 text-slate-600 border-slate-100',
    };
    return `${base} ${variants[status] || variants.new}`;
  };

  return (
    <div>
      {/* Search and Filter */}
      <div className="mb-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by customer name, phone, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="quoted">Quoted</SelectItem>
            <SelectItem value="negotiating">Negotiating</SelectItem>
            <SelectItem value="closed-won">Won</SelectItem>
            <SelectItem value="closed-lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lead Cards - Dashboard Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredLeads.map(lead => (
          <Card
            key={lead.id}
            className="p-5 md:p-4 hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer group border border-slate-200 rounded-sm bg-white"
            onClick={() => onOpenQuotation(lead)}
          >
            <div className="flex flex-col flex-1">
              {/* Header with Avatar, Name & Status */}
              <div className="flex items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[#0F2647] flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
                    {lead.customerName.charAt(0)}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 text-sm md:text-base truncate">
                        {lead.customerName}
                      </h3>
                      <span className={getStatusBadgeClasses(lead.status)}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact + Address block with fixed height for consistent cards */}
              <div className="space-y-2  min-h-[72px] md:min-h-[80px] flex flex-col justify-start">
                <div className="flex flex-wrap items-center gap-x-5 pb-3 text-xs md:text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#0F2647]" />
                    <span className="whitespace-nowrap">{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Mail className="w-4 h-4 text-[#0F2647] hidden sm:inline" />
                    <span className="truncate max-w-[220px] hidden sm:inline">
                      {lead.email}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs md:text-sm text-slate-600 truncate">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#0F2647] flex-shrink-0" />
                  <span className="line-clamp-2">
                    {lead.propertyAddress}
                  </span>
                </div>
              </div>

              {/* Bill / System / Quote panel */}
              <div className="bg-[#F4F7FA] border border-[#EFEFEF] rounded-sm px-4 py-3 md:px-6 md:py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between md:justify-start gap-3 md:gap-12 text-sm">
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-500">Bill:</span>
                    <span className="font-semibold text-[#003066]">
                      ₹{lead.avgMonthlyBill.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-500">System:</span>
                    <span className="font-semibold text-[#003066]">
                      {lead.systemSize > 0 ? `${lead.systemSize}kW` : '-'}
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 text-sm">
                  <span className="text-slate-500">Quote:</span>
                  <span className="font-semibold text-emerald-600">
                    {lead.quoteValue > 0 ? `₹${(lead.quoteValue / 100000).toFixed(2)}L` : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button - pinned to bottom */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onOpenQuotation(lead);
              }}
              className="w-full gap-2 h-11 text-sm bg-[#0F2647] hover:bg-[#051329] text-white mt-auto"
            >
              <FileText className="w-4 h-4" />
              View Full Quotation
            </Button>
          </Card>
        ))}

        {filteredLeads.length === 0 && (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <div className="text-slate-400 mb-2">
                <Search className="w-12 h-12 mx-auto mb-3" />
              </div>
              <p className="text-slate-600">No leads found matching your criteria.</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
