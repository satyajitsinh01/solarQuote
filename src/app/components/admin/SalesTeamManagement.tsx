import React, { useState } from 'react';
import { salespeople as initialSalespeople } from '../../data/dummyData';
import { Salesperson } from '../../types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { UserPlus, Edit, Ban, CheckCircle, TrendingUp, Target } from 'lucide-react';

export function SalesTeamManagement() {
  const [salespeople, setSalespeople] = useState<Salesperson[]>(initialSalespeople);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSalesperson, setEditingSalesperson] = useState<Salesperson | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    salesTarget: '500000',
  });

  const handleOpenDialog = (salesperson?: Salesperson) => {
    if (salesperson) {
      setEditingSalesperson(salesperson);
      setFormData({
        name: salesperson.name,
        email: salesperson.email,
        phone: salesperson.phone,
        salesTarget: salesperson.salesTarget.toString(),
      });
    } else {
      setEditingSalesperson(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        salesTarget: '500000',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSalesperson) {
      // Update existing
      setSalespeople(salespeople.map(sp => 
        sp.id === editingSalesperson.id 
          ? { ...sp, ...formData, salesTarget: parseFloat(formData.salesTarget) }
          : sp
      ));
    } else {
      // Create new
      const newSalesperson: Salesperson = {
        id: `sp-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        salesTarget: parseFloat(formData.salesTarget),
        totalSales: 0,
        leadsAssigned: 0,
        active: true,
      };
      setSalespeople([...salespeople, newSalesperson]);
    }

    setIsDialogOpen(false);
  };

  const toggleActive = (id: string) => {
    setSalespeople(salespeople.map(sp => 
      sp.id === id ? { ...sp, active: !sp.active } : sp
    ));
  };

  return (
    <Card className="p-3 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-slate-900">Sales Team Management</h2>
          <p className="text-xs md:text-sm text-slate-600 mt-1">Manage your sales team members and their targets</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2 w-full sm:w-auto">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Salesperson</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSalesperson ? 'Edit Salesperson' : 'Add New Salesperson'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-700 mb-2 flex items-center gap-2">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-700 mb-2 flex items-center gap-2">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-slate-700 mb-2 flex items-center gap-2">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="salesTarget" className="text-slate-700 mb-2 flex items-center gap-2">Monthly Sales Target (₹) *</Label>
                <Input
                  id="salesTarget"
                  type="number"
                  value={formData.salesTarget}
                  onChange={(e) => setFormData({ ...formData, salesTarget: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingSalesperson ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="min-w-[120px]">Name</TableHead>
              <TableHead className="min-w-[140px] hidden sm:table-cell">Contact</TableHead>
              <TableHead className="min-w-[80px]">Status</TableHead>
              <TableHead className="min-w-[100px] hidden md:table-cell">Leads Assigned</TableHead>
              <TableHead className="min-w-[110px] hidden lg:table-cell">Sales Target</TableHead>
              <TableHead className="min-w-[100px] hidden lg:table-cell">Total Sales</TableHead>
              <TableHead className="min-w-[100px] hidden xl:table-cell">Achievement</TableHead>
              <TableHead className="min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salespeople.map(sp => {
              const achievement = (sp.totalSales / sp.salesTarget) * 100;
              const achievementColor = achievement >= 100 ? 'text-green-600' : 
                                       achievement >= 75 ? 'text-amber-600' : 'text-red-600';

              return (
                <TableRow key={sp.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{sp.name}</div>
                      <div className="text-xs text-slate-500 sm:hidden mt-1">{sp.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="text-sm">
                      <div>{sp.email}</div>
                      <div className="text-slate-500 text-xs">{sp.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {sp.active ? (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-700 text-xs">
                        <Ban className="w-3 h-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="font-medium">{sp.leadsAssigned}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-sm">
                      <Target className="w-3.5 h-3.5 text-slate-400" />
                      ₹{(sp.salesTarget / 100000).toFixed(1)}L
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                      ₹{(sp.totalSales / 100000).toFixed(1)}L
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <span className={`font-semibold text-sm ${achievementColor}`}>
                      {achievement.toFixed(0)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 md:gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleOpenDialog(sp)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => toggleActive(sp.id)}
                        className="h-8 w-8 p-0"
                      >
                        {sp.active ? (
                          <Ban className="w-4 h-4 text-red-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
