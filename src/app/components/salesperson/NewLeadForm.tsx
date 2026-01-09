import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, UserPlus, Phone, Mail, MapPin, IndianRupee } from 'lucide-react';

interface NewLeadFormProps {
  onSubmit: (leadData: any) => void;
  onCancel: () => void;
}

export function NewLeadForm({ onSubmit, onCancel }: NewLeadFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    propertyAddress: '',
    avgMonthlyBill: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.propertyAddress.trim()) {
      newErrors.propertyAddress = 'Property address is required';
    }

    if (!formData.avgMonthlyBill || parseFloat(formData.avgMonthlyBill) <= 0) {
      newErrors.avgMonthlyBill = 'Enter a valid monthly bill amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        ...formData,
        avgMonthlyBill: parseFloat(formData.avgMonthlyBill),
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div>
      <Button 
        variant="ghost" 
        onClick={onCancel}
        className="mb-4 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      <Card className="max-w-3xl mx-auto p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Add New Lead</h2>
              <p className="text-sm text-slate-600">Capture customer details and energy usage information</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name */}
          <div>
            <Label htmlFor="customerName" className="text-slate-700 mb-2 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Customer Name *
            </Label>
            <Input
              id="customerName"
              placeholder="Enter full name"
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              className={errors.customerName ? 'border-red-500' : ''}
            />
            {errors.customerName && (
              <p className="text-sm text-red-600 mt-1">{errors.customerName}</p>
            )}
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-slate-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Property Address */}
          <div>
            <Label htmlFor="propertyAddress" className="text-slate-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Property Address *
            </Label>
            <Textarea
              id="propertyAddress"
              placeholder="Enter complete property address with city, state, and pincode"
              value={formData.propertyAddress}
              onChange={(e) => handleChange('propertyAddress', e.target.value)}
              className={errors.propertyAddress ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.propertyAddress && (
              <p className="text-sm text-red-600 mt-1">{errors.propertyAddress}</p>
            )}
          </div>

          {/* Monthly Bill */}
          <div>
            <Label htmlFor="avgMonthlyBill" className="text-slate-700 mb-2 flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Average Monthly Electricity Bill *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">₹</span>
              <Input
                id="avgMonthlyBill"
                type="number"
                placeholder="8500"
                value={formData.avgMonthlyBill}
                onChange={(e) => handleChange('avgMonthlyBill', e.target.value)}
                className={`pl-8 ${errors.avgMonthlyBill ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.avgMonthlyBill && (
              <p className="text-sm text-red-600 mt-1">{errors.avgMonthlyBill}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              This helps us recommend the right system size
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <UserPlus className="w-4 h-4 mr-2" />
              Create Lead
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
