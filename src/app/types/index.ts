export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'negotiating' | 'closed-won' | 'closed-lost';

export interface Lead {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  avgMonthlyBill: number;
  status: LeadStatus;
  assignedTo: string;
  systemSize: number; // in kW
  quoteValue: number;
  lastActivity: string;
  createdAt: string;
}

export interface Salesperson {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  salesTarget: number;
  totalSales: number;
  leadsAssigned: number;
}

export interface HardwareItem {
  id: string;
  type: 'panel' | 'battery' | 'inverter';
  brand: string;
  model: string;
  capacity: number; // Watts for panels, kWh for batteries, kW for inverters
  price: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface QuotationConfig {
  panelCount: number;
  panelType: string;
  batteryBackup: boolean;
  batteryType: string;
  inverterType: string;
  birdNet: boolean;
  scaffoldingRequired: boolean;
  scaffoldingHeight: number; // in meters
}

export interface PricingRules {
  baseInstallationRate: number; // per kW
  labourCostPerDay: number;
  scaffoldingCostPerMeter: number;
  birdNetCostPerPanel: number;
}
