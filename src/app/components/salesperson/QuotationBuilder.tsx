import React, { useState, useEffect } from 'react';
import { Lead, QuotationConfig } from '../../types';
import { hardwareItems, pricingRules } from '../../data/dummyData';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  ArrowLeft, 
  Zap, 
  Battery, 
  Box, 
  Shield, 
  Hammer, 
  Users,
  FileText,
  Send,
  Download,
  IndianRupee,
  TrendingUp,
  Calendar,
  MapPin,
  CheckCircle2,
  Save
} from 'lucide-react';

interface QuotationBuilderProps {
  lead: Lead;
  onUpdateLead: (lead: Lead) => void;
  onBack: () => void;
}

export function QuotationBuilder({ lead, onUpdateLead, onBack }: QuotationBuilderProps) {
  const panels = hardwareItems.filter(item => item.type === 'panel');
  const batteries = hardwareItems.filter(item => item.type === 'battery');
  const inverters = hardwareItems.filter(item => item.type === 'inverter');

  const [config, setConfig] = useState<QuotationConfig>({
    panelCount: 10,
    panelType: panels[0]?.id || '',
    batteryBackup: false,
    batteryType: batteries[0]?.id || '',
    inverterType: inverters[0]?.id || '',
    birdNet: false,
    scaffoldingRequired: false,
    scaffoldingHeight: 3,
  });

  const [birdNetPanels, setBirdNetPanels] = useState(0);
  const [currentStatus, setCurrentStatus] = useState<Lead['status']>(lead.status);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Calculate costs
  const selectedPanel = hardwareItems.find(item => item.id === config.panelType);
  const selectedBattery = hardwareItems.find(item => item.id === config.batteryType);
  const selectedInverter = hardwareItems.find(item => item.id === config.inverterType);

  const systemSizeKW = selectedPanel ? (config.panelCount * selectedPanel.capacity) / 1000 : 0;
  
  const panelCost = selectedPanel ? selectedPanel.price * config.panelCount : 0;
  const batteryCost = config.batteryBackup && selectedBattery ? selectedBattery.price : 0;
  const inverterCost = selectedInverter ? selectedInverter.price : 0;
  
  // Fixed installation and labour costs based on system size
  const installationCost = systemSizeKW * pricingRules.baseInstallationRate;
  const labourCost = Math.ceil(systemSizeKW / 2) * pricingRules.labourCostPerDay; // 1 day per 2kW
  
  const birdNetCost = config.birdNet ? birdNetPanels * pricingRules.birdNetCostPerPanel : 0;
  const scaffoldingCost = config.scaffoldingRequired ? 
    config.scaffoldingHeight * pricingRules.scaffoldingCostPerMeter : 0;

  const totalProjectCost = panelCost + batteryCost + inverterCost + installationCost + 
                          birdNetCost + scaffoldingCost + labourCost;

  // Calculate savings (assuming ₹8/unit and 4.5 units per kW per day)
  const monthlyGeneration = systemSizeKW * 4.5 * 30; // units
  const monthlySavings = monthlyGeneration * 8; // ₹8 per unit
  const paybackMonths = totalProjectCost / monthlySavings;
  const paybackYears = paybackMonths / 12;

  useEffect(() => {
    // Auto-update lead when config changes (but don't auto-save, wait for explicit save)
    // This keeps the UI in sync but doesn't persist until user clicks Save
  }, [totalProjectCost, systemSizeKW]);

  const handleStatusChange = (newStatus: Lead['status']) => {
    setCurrentStatus(newStatus);
  };

  const handleSaveQuotation = () => {
    setIsSaving(true);
    setSaveMessage(null);

    // Simulate save operation
    setTimeout(() => {
      const updatedLead: Lead = {
        ...lead,
        systemSize: systemSizeKW,
        quoteValue: totalProjectCost,
        status: currentStatus,
        lastActivity: new Date().toISOString().split('T')[0],
      };
      
      onUpdateLead(updatedLead);
      setIsSaving(false);
      setSaveMessage({ type: 'success', text: 'Quotation saved successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }, 500);
  };

  const getStatusColor = (status: Lead['status']) => {
    const colors: Record<Lead['status'], string> = {
      'new': 'bg-blue-100 text-blue-700 border-blue-200',
      'contacted': 'bg-purple-100 text-purple-700 border-purple-200',
      'quoted': 'bg-amber-100 text-amber-700 border-amber-200',
      'negotiating': 'bg-orange-100 text-orange-700 border-orange-200',
      'closed-won': 'bg-green-100 text-green-700 border-green-200',
      'closed-lost': 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return colors[status] || colors.new;
  };

  const getStatusLabel = (status: Lead['status']) => {
    const labels: Record<Lead['status'], string> = {
      'new': 'New Lead',
      'contacted': 'Contacted',
      'quoted': 'Quoted',
      'negotiating': 'Negotiating',
      'closed-won': 'Won',
      'closed-lost': 'Lost',
    };
    return labels[status] || status;
  };

  const handleSendProposal = (method: 'email' | 'whatsapp') => {
    alert(`Proposal would be sent via ${method} to ${lead.customerName}`);
  };

  const handleDownloadPDF = () => {
    alert('PDF generation would happen here');
  };

  // Generate Google Maps static image URL (kept for future use)
  const getMapImageUrl = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    // Using a placeholder service for demo - in production, use Google Maps Static API with your API key
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=17&size=600x300&maptype=satellite&markers=color:red%7C${encodedAddress}&key=YOUR_API_KEY`;
  };

  // Custom demo rooftop layout image (add this file under /public/images if you want to customize)
  const roofLayoutDemo = '/images/image.png';

  // Fallback placeholder if the roof image is missing
  const mapPlaceholder = `https://via.placeholder.com/600x300/e2e8f0/475569?text=${encodeURIComponent('Location: ' + lead.propertyAddress.split(',')[0])}`;

  return (
    <div>
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer Info Card with Location */}
          <Card className="p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                {lead.customerName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h2 className="font-semibold text-slate-900">{lead.customerName}</h2>
                  <Badge className={getStatusColor(currentStatus)}>
                    {getStatusLabel(currentStatus)}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span>📞</span>
                    <span className="whitespace-nowrap">{lead.phone}</span>
                  </div>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <div className="flex items-center gap-1.5">
                    <span>✉️</span>
                    <span className="truncate max-w-[200px] sm:max-w-none">{lead.email}</span>
                  </div>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  {/* Monthly Bill on Right */}
              <div className="flex items-center gap-1.5 text-amber-600 font-medium text-sm whitespace-nowrap">
                <IndianRupee className="w-4 h-4 flex-shrink-0" />
                <span>Current Monthly Bill: ₹{lead.avgMonthlyBill.toLocaleString()}</span>
              </div>
                </div>
              </div>
              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <Label className="text-sm text-slate-700 font-medium">Status:</Label>
                <Select value={currentStatus} onValueChange={(value) => handleStatusChange(value as Lead['status'])}>
                  <SelectTrigger className={`w-[180px] ${getStatusColor(currentStatus)}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Lead</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="quoted">Quoted</SelectItem>
                    <SelectItem value="negotiating">Negotiating</SelectItem>
                    <SelectItem value="closed-won">Won</SelectItem>
                    <SelectItem value="closed-lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Property Location with Map Preview */}
            <div className="mb-4 pt-4 border-t border-slate-200">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-start gap-2 flex-1">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <Label className="text-slate-700 text-sm font-medium">Property Location</Label>
                    <p className="text-sm text-slate-600 mt-1">{lead.propertyAddress}</p>
                  </div>
                </div>
                <div className="bg-slate-100 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-medium text-slate-700 flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  Location Verified
                </div>
              </div>
              
              {/* Location Map / Roof Layout Preview */}
              <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <img 
                  src={roofLayoutDemo}
                  alt="Property Location"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = mapPlaceholder;
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Solar Panel Selection */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-slate-900">Solar Panels</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-slate-700 mb-2">Select Panel Brand & Model</Label>
                <Select value={config.panelType} onValueChange={(value) => setConfig({ ...config, panelType: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select panel" />
                  </SelectTrigger>
                  <SelectContent>
                    {panels.map(panel => (
                      <SelectItem key={panel.id} value={panel.id}>
                        {panel.brand} {panel.model} - {panel.capacity}W - ₹{panel.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-slate-700 font-medium">No. of Panels</Label>
                  <div className="bg-slate-100 px-3 py-1.5 rounded-md text-sm font-semibold text-slate-700">
                    {config.panelCount} panels = {systemSizeKW.toFixed(2)} kW
                  </div>
                </div>
                <Slider
                  value={[config.panelCount]}
                  onValueChange={(value) => {
                    setConfig({ ...config, panelCount: value[0] });
                    // Reset bird net panels when total panels change
                    if (birdNetPanels > value[0]) {
                      setBirdNetPanels(value[0]);
                    }
                  }}
                  min={4}
                  max={40}
                  step={1}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>4 panels (Min)</span>
                  <span>40 panels (Max)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Inverter and Battery Backup in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inverter Selection */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Box className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-slate-900">Inverter</h3>
              </div>

              <div>
                <Label className="text-slate-700 mb-2">Select Inverter</Label>
                <Select value={config.inverterType} onValueChange={(value) => setConfig({ ...config, inverterType: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select inverter" />
                  </SelectTrigger>
                  <SelectContent>
                    {inverters.map(inverter => (
                      <SelectItem key={inverter.id} value={inverter.id}>
                        {inverter.brand} {inverter.model} - {inverter.capacity}kW - ₹{inverter.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">
                  Recommended: {systemSizeKW.toFixed(1)}kW inverter for {systemSizeKW.toFixed(2)}kW system
                </p>
              </div>
            </Card>

            {/* Battery Backup */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Battery className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-slate-900">Battery Backup</h3>
                </div>
                <Switch
                  checked={config.batteryBackup}
                  onCheckedChange={(checked) => setConfig({ ...config, batteryBackup: checked })}
                />
              </div>

              <div className={config.batteryBackup ? '' : 'opacity-50'}>
                <Label className="text-slate-700 mb-2">Select Battery</Label>
                <Select 
                  value={config.batteryType} 
                  onValueChange={(value) => setConfig({ ...config, batteryType: value })}
                  disabled={!config.batteryBackup}
                >
                  <SelectTrigger className="w-full" disabled={!config.batteryBackup}>
                    <SelectValue placeholder="Select battery" />
                  </SelectTrigger>
                  <SelectContent>
                    {batteries.map(battery => (
                      <SelectItem key={battery.id} value={battery.id}>
                        {battery.brand} {battery.model} - {battery.capacity}kWh - ₹{battery.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className={`text-xs mt-2 ${config.batteryBackup ? 'text-green-600' : 'text-slate-400'}`}>
                  ✓ Store excess energy for use during night or power cuts
                </p>
              </div>
            </Card>
          </div>

          {/* Add-ons */}
          <Card className="p-5">
            <h3 className="font-semibold text-slate-900">Additional Services & Add-ons</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bird Net with Slider */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-slate-900">Bird Net Protection</div>
                      <div className="text-xs text-slate-600">Prevent bird nesting under panels</div>
                    </div>
                  </div>
                  <Switch
                    checked={config.birdNet}
                    onCheckedChange={(checked) => {
                      setConfig({ ...config, birdNet: checked });
                      if (!checked) setBirdNetPanels(0);
                      else setBirdNetPanels(config.panelCount);
                    }}
                  />
                </div>

                <div className={`mt-3 ${config.birdNet ? '' : 'opacity-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm text-slate-700">Panels to Cover</Label>
                    <span className={`text-sm font-medium ${config.birdNet ? '' : 'text-slate-400'}`}>
                      {birdNetPanels} of {config.panelCount} panels - ₹{(birdNetPanels * pricingRules.birdNetCostPerPanel).toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={[birdNetPanels]}
                    onValueChange={(value) => setBirdNetPanels(value[0])}
                    min={0}
                    max={config.panelCount}
                    step={1}
                    disabled={!config.birdNet}
                    className="my-2"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>None</span>
                    <span>All Panels</span>
                  </div>
                </div>
              </div>

              {/* Scaffolding */}
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Hammer className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="font-medium text-slate-900">Scaffolding Setup</div>
                      <div className="text-xs text-slate-600">Required for elevated installations</div>
                    </div>
                  </div>
                  <Switch
                    checked={config.scaffoldingRequired}
                    onCheckedChange={(checked) => setConfig({ ...config, scaffoldingRequired: checked })}
                  />
                </div>

                <div className={config.scaffoldingRequired ? '' : 'opacity-50'}>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm text-slate-700">Height (meters)</Label>
                    <span className={`text-sm font-medium ${config.scaffoldingRequired ? '' : 'text-slate-400'}`}>
                      {config.scaffoldingHeight}m - ₹{scaffoldingCost.toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={[config.scaffoldingHeight]}
                    onValueChange={(value) => setConfig({ ...config, scaffoldingHeight: value[0] })}
                    min={2}
                    max={15}
                    step={1}
                    disabled={!config.scaffoldingRequired}
                    className="my-2"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>2m</span>
                    <span>15m</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Sticky Financial Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            {/* Financial Summary Card */}
            <Card className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-amber-600" />
                Financial Summary
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Solar Panels ({config.panelCount})</span>
                  <span className="font-medium">₹{panelCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Inverter</span>
                  <span className="font-medium">₹{inverterCost.toLocaleString()}</span>
                </div>
                {config.batteryBackup && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Battery Backup</span>
                    <span className="font-medium">₹{batteryCost.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Installation & Labour</span>
                  <span className="font-medium">₹{(installationCost + labourCost).toLocaleString()}</span>
                </div>
                {config.birdNet && birdNetPanels > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Bird Net ({birdNetPanels})</span>
                    <span className="font-medium">₹{birdNetCost.toLocaleString()}</span>
                  </div>
                )}
                {config.scaffoldingRequired && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Scaffolding ({config.scaffoldingHeight}m)</span>
                    <span className="font-medium">₹{scaffoldingCost.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-amber-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-slate-900">Total Project Cost</span>
                  <span className="text-2xl font-bold text-amber-600">
                    ₹{(totalProjectCost / 100000).toFixed(2)}L
                  </span>
                </div>

                <div className="bg-white rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-slate-700">Monthly Savings</span>
                    </div>
                    <span className="font-semibold text-green-600">₹{monthlySavings.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-slate-700">Payback Period</span>
                    </div>
                    <span className="font-semibold text-blue-600">{paybackYears.toFixed(1)} years</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* System Details */}
            <Card className="p-5">
              <h4 className="font-semibold text-slate-900 mb-3">System Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">System Size</span>
                  <span className="font-medium">{systemSizeKW.toFixed(2)} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Daily Generation</span>
                  <span className="font-medium">{(systemSizeKW * 4.5).toFixed(1)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly Generation</span>
                  <span className="font-medium">{monthlyGeneration.toFixed(0)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Annual Savings</span>
                  <span className="font-medium text-green-600">₹{(monthlySavings * 12).toLocaleString()}</span>
                </div>
              </div>
            </Card>

            {/* Save Quotation Button */}
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Save className="w-4 h-4 text-blue-600" />
                Save Quotation
              </h4>
              {saveMessage && (
                <div className={`mb-3 p-3 rounded-lg text-sm flex items-center gap-2 ${
                  saveMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
                  {saveMessage.text}
                </div>
              )}
              <Button 
                className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveQuotation}
                disabled={isSaving}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Quotation'}
              </Button>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Saves quotation details and updates lead status
              </p>
            </Card>

            {/* Action Buttons */}
            <Card className="p-5">
              <h4 className="font-semibold text-slate-900 mb-3">Send Proposal</h4>
              <div className="space-y-2">
                <Button className="w-full gap-2" onClick={handleDownloadPDF}>
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button 
                  className="w-full gap-2 bg-green-600 hover:bg-green-700" 
                  onClick={() => handleSendProposal('whatsapp')}
                >
                  <Send className="w-4 h-4" />
                  Send via WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => handleSendProposal('email')}
                >
                  <Send className="w-4 h-4" />
                  Send via Email
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
