import React, { useState } from 'react';
import { hardwareItems as initialHardware, pricingRules as initialPricing } from '../../data/dummyData';
import { HardwareItem, PricingRules } from '../../types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Package, Battery, Zap, IndianRupee, Settings, Shield, Hammer, Users, Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export function InventoryPricing() {
  const [hardwareItems, setHardwareItems] = useState<HardwareItem[]>(initialHardware);
  const [pricingRules, setPricingRules] = useState<PricingRules>(initialPricing);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingInventory, setIsEditingInventory] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItemType, setNewItemType] = useState<'panel' | 'battery' | 'inverter'>('panel');
  const [newItem, setNewItem] = useState<Partial<HardwareItem>>({
    brand: '',
    model: '',
    capacity: 0,
    price: 0,
    dimensions: { width: 0, height: 0, depth: 0 },
  });

  const panels = hardwareItems.filter(item => item.type === 'panel');
  const batteries = hardwareItems.filter(item => item.type === 'battery');
  const inverters = hardwareItems.filter(item => item.type === 'inverter');

  const handleUpdatePricing = (field: keyof PricingRules, value: string) => {
    setPricingRules({
      ...pricingRules,
      [field]: parseFloat(value) || 0,
    });
  };

  const handleUpdateInventoryItem = (itemId: string, field: keyof HardwareItem, value: string | number) => {
    setHardwareItems(hardwareItems.map(item => 
      item.id === itemId 
        ? { ...item, [field]: value }
        : item
    ));
  };

  const handleUpdateDimensions = (itemId: string, dimension: 'width' | 'height' | 'depth', value: string) => {
    setHardwareItems(hardwareItems.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            dimensions: { 
              ...item.dimensions, 
              [dimension]: parseFloat(value) || 0 
            } 
          }
        : item
    ));
  };

  const handleAddNewItem = () => {
    if (!newItem.brand || !newItem.model || !newItem.capacity || !newItem.price) {
      return;
    }

    const itemId = `${newItemType}-${Date.now()}`;
    const newHardwareItem: HardwareItem = {
      id: itemId,
      type: newItemType,
      brand: newItem.brand,
      model: newItem.model,
      capacity: newItem.capacity || 0,
      price: newItem.price || 0,
      dimensions: newItem.dimensions || { width: 0, height: 0, depth: 0 },
    };

    setHardwareItems([...hardwareItems, newHardwareItem]);
    setNewItem({
      brand: '',
      model: '',
      capacity: 0,
      price: 0,
      dimensions: { width: 0, height: 0, depth: 0 },
    });
    setShowAddDialog(false);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setHardwareItems(hardwareItems.filter(item => item.id !== itemId));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'panel':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'battery':
        return <Battery className="w-4 h-4 text-green-500" />;
      case 'inverter':
        return <Package className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Pricing Rules Configuration */}
      <Card className="p-3 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Settings className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
              Pricing Rules & Surcharges
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Configure base rates and additional costs (Read-only for salespeople)
            </p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? 'default' : 'outline'}
            className="w-full sm:w-auto"
            size="sm"
          >
            {isEditing ? 'Save Changes' : 'Edit Pricing'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <Card className="p-5 bg-amber-50 border-amber-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-white" />
              </div>
              <Label className="font-semibold text-slate-900">Base Installation Rate</Label>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600">₹</span>
              <Input
                type="number"
                value={pricingRules.baseInstallationRate}
                onChange={(e) => handleUpdatePricing('baseInstallationRate', e.target.value)}
                disabled={!isEditing}
                className="pl-8 font-medium"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-600">
                per kW
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2">Standard installation cost per kilowatt</p>
          </Card>

          <Card className="p-5 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <Label className="font-semibold text-slate-900">Labour Cost Per Day</Label>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600">₹</span>
              <Input
                type="number"
                value={pricingRules.labourCostPerDay}
                onChange={(e) => handleUpdatePricing('labourCostPerDay', e.target.value)}
                disabled={!isEditing}
                className="pl-8 font-medium"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-600">
                per day
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2">Daily labour charges for installation crew</p>
          </Card>

          <Card className="p-5 bg-orange-50 border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <Hammer className="w-4 h-4 text-white" />
              </div>
              <Label className="font-semibold text-slate-900">Scaffolding Cost</Label>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600">₹</span>
              <Input
                type="number"
                value={pricingRules.scaffoldingCostPerMeter}
                onChange={(e) => handleUpdatePricing('scaffoldingCostPerMeter', e.target.value)}
                disabled={!isEditing}
                className="pl-8 font-medium"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-600">
                per meter
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2">Cost per meter of scaffolding height</p>
          </Card>

          <Card className="p-5 bg-purple-50 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <Label className="font-semibold text-slate-900">Bird Net Cost</Label>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600">₹</span>
              <Input
                type="number"
                value={pricingRules.birdNetCostPerPanel}
                onChange={(e) => handleUpdatePricing('birdNetCostPerPanel', e.target.value)}
                disabled={!isEditing}
                className="pl-8 font-medium"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-600">
                per panel
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2">Bird protection net per solar panel</p>
          </Card>
        </div>
      </Card>

      {/* Hardware Inventory */}
      <Card className="p-3 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              Hardware Inventory
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Manage solar panels, batteries, and inverters with specifications and pricing
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setShowAddDialog(true)}
              variant="default"
              className="gap-2 w-full sm:w-auto"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New Item</span>
              <span className="sm:hidden">Add Item</span>
            </Button>
            <Button
              onClick={() => setIsEditingInventory(!isEditingInventory)}
              variant={isEditingInventory ? 'default' : 'outline'}
              className="w-full sm:w-auto"
              size="sm"
            >
              {isEditingInventory ? 'Save Changes' : 'Edit Inventory'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="panels">
          <TabsList className="grid w-full grid-cols-3 gap-1 md:gap-2 h-auto">
            <TabsTrigger value="panels" className="gap-1 md:gap-2 text-xs md:text-sm py-2 md:py-3 px-2 md:px-4">
              <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Solar Panels</span>
              <span className="sm:hidden">Panels</span>
              <span className="hidden md:inline"> ({panels.length})</span>
            </TabsTrigger>
            <TabsTrigger value="batteries" className="gap-1 md:gap-2 text-xs md:text-sm py-2 md:py-3 px-2 md:px-4">
              <Battery className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Batteries</span>
              <span className="sm:hidden">Batteries</span>
              <span className="hidden md:inline"> ({batteries.length})</span>
            </TabsTrigger>
            <TabsTrigger value="inverters" className="gap-1 md:gap-2 text-xs md:text-sm py-2 md:py-3 px-2 md:px-4">
              <Package className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Inverters</span>
              <span className="sm:hidden">Inverters</span>
              <span className="hidden md:inline"> ({inverters.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="panels" className="mt-4">
            <div className="border rounded-lg overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="min-w-[150px]">Brand & Model</TableHead>
                    <TableHead className="min-w-[90px]">Capacity</TableHead>
                    <TableHead className="min-w-[100px]">Price</TableHead>
                    <TableHead className="min-w-[150px] hidden md:table-cell">Dimensions (mm)</TableHead>
                    {isEditingInventory && <TableHead className="min-w-[60px]">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {panels.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <div className="flex-1">
                            {isEditingInventory ? (
                              <div className="space-y-1">
                                <Input
                                  value={item.brand}
                                  onChange={(e) => handleUpdateInventoryItem(item.id, 'brand', e.target.value)}
                                  className="h-7 text-sm"
                                  placeholder="Brand"
                                />
                                <Input
                                  value={item.model}
                                  onChange={(e) => handleUpdateInventoryItem(item.id, 'model', e.target.value)}
                                  className="h-7 text-sm"
                                  placeholder="Model"
                                />
                              </div>
                            ) : (
                              <>
                                <div className="font-medium">{item.brand}</div>
                                <div className="text-xs text-slate-500">{item.model}</div>
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isEditingInventory ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={item.capacity}
                              onChange={(e) => handleUpdateInventoryItem(item.id, 'capacity', parseFloat(e.target.value) || 0)}
                              className="h-7 w-20 text-sm"
                            />
                            <span className="text-xs text-slate-500">W</span>
                          </div>
                        ) : (
                          <Badge variant="outline">{item.capacity}W</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditingInventory ? (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-600">₹</span>
                            <Input
                              type="number"
                              value={item.price}
                              onChange={(e) => handleUpdateInventoryItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                              className="h-7 w-28 text-sm"
                            />
                          </div>
                        ) : (
                          <span className="font-semibold text-green-600">
                            ₹{item.price.toLocaleString()}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 hidden md:table-cell">
                        {isEditingInventory ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={item.dimensions.width}
                              onChange={(e) => handleUpdateDimensions(item.id, 'width', e.target.value)}
                              className="h-7 w-16 text-xs"
                              placeholder="W"
                            />
                            <span>×</span>
                            <Input
                              type="number"
                              value={item.dimensions.height}
                              onChange={(e) => handleUpdateDimensions(item.id, 'height', e.target.value)}
                              className="h-7 w-16 text-xs"
                              placeholder="H"
                            />
                            <span>×</span>
                            <Input
                              type="number"
                              value={item.dimensions.depth}
                              onChange={(e) => handleUpdateDimensions(item.id, 'depth', e.target.value)}
                              className="h-7 w-16 text-xs"
                              placeholder="D"
                            />
                          </div>
                        ) : (
                          <span>{item.dimensions.width} × {item.dimensions.height} × {item.dimensions.depth}</span>
                        )}
                      </TableCell>
                      {isEditingInventory && (
                        <TableCell>
                          <Button
                            onClick={() => handleDeleteItem(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="batteries" className="mt-4">
            <div className="border rounded-lg overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="min-w-[150px]">Brand & Model</TableHead>
                    <TableHead className="min-w-[90px]">Capacity</TableHead>
                    <TableHead className="min-w-[100px]">Price</TableHead>
                    <TableHead className="min-w-[150px] hidden md:table-cell">Dimensions (mm)</TableHead>
                    {isEditingInventory && <TableHead className="min-w-[60px]">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batteries.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <div className="flex-1">
                            {isEditingInventory ? (
                              <div className="space-y-1">
                                <Input
                                  value={item.brand}
                                  onChange={(e) => handleUpdateInventoryItem(item.id, 'brand', e.target.value)}
                                  className="h-7 text-sm"
                                  placeholder="Brand"
                                />
                                <Input
                                  value={item.model}
                                  onChange={(e) => handleUpdateInventoryItem(item.id, 'model', e.target.value)}
                                  className="h-7 text-sm"
                                  placeholder="Model"
                                />
                              </div>
                            ) : (
                              <>
                                <div className="font-medium">{item.brand}</div>
                                <div className="text-xs text-slate-500">{item.model}</div>
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isEditingInventory ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={item.capacity}
                              onChange={(e) => handleUpdateInventoryItem(item.id, 'capacity', parseFloat(e.target.value) || 0)}
                              className="h-7 w-20 text-sm"
                            />
                            <span className="text-xs text-slate-500">kWh</span>
                          </div>
                        ) : (
                          <Badge variant="outline">{item.capacity}kWh</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditingInventory ? (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-600">₹</span>
                            <Input
                              type="number"
                              value={item.price}
                              onChange={(e) => handleUpdateInventoryItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                              className="h-7 w-28 text-sm"
                            />
                          </div>
                        ) : (
                          <span className="font-semibold text-green-600">
                            ₹{item.price.toLocaleString()}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 hidden md:table-cell">
                        {isEditingInventory ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={item.dimensions.width}
                              onChange={(e) => handleUpdateDimensions(item.id, 'width', e.target.value)}
                              className="h-7 w-16 text-xs"
                              placeholder="W"
                            />
                            <span>×</span>
                            <Input
                              type="number"
                              value={item.dimensions.height}
                              onChange={(e) => handleUpdateDimensions(item.id, 'height', e.target.value)}
                              className="h-7 w-16 text-xs"
                              placeholder="H"
                            />
                            <span>×</span>
                            <Input
                              type="number"
                              value={item.dimensions.depth}
                              onChange={(e) => handleUpdateDimensions(item.id, 'depth', e.target.value)}
                              className="h-7 w-16 text-xs"
                              placeholder="D"
                            />
                          </div>
                        ) : (
                          <span>{item.dimensions.width} × {item.dimensions.height} × {item.dimensions.depth}</span>
                        )}
                      </TableCell>
                      {isEditingInventory && (
                        <TableCell>
                          <Button
                            onClick={() => handleDeleteItem(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="inverters" className="mt-4">
            <div className="border rounded-lg overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="min-w-[150px]">Brand & Model</TableHead>
                    <TableHead className="min-w-[90px]">Capacity</TableHead>
                    <TableHead className="min-w-[100px]">Price</TableHead>
                    <TableHead className="min-w-[150px] hidden md:table-cell">Dimensions (mm)</TableHead>
                    {isEditingInventory && <TableHead className="min-w-[60px]">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inverters.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <div className="flex-1">
                            {isEditingInventory ? (
                              <div className="space-y-1">
                                <Input
                                  value={item.brand}
                                  onChange={(e) => handleUpdateInventoryItem(item.id, 'brand', e.target.value)}
                                  className="h-7 text-sm"
                                  placeholder="Brand"
                                />
                                <Input
                                  value={item.model}
                                  onChange={(e) => handleUpdateInventoryItem(item.id, 'model', e.target.value)}
                                  className="h-7 text-sm"
                                  placeholder="Model"
                                />
                              </div>
                            ) : (
                              <>
                                <div className="font-medium">{item.brand}</div>
                                <div className="text-xs text-slate-500">{item.model}</div>
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isEditingInventory ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={item.capacity}
                              onChange={(e) => handleUpdateInventoryItem(item.id, 'capacity', parseFloat(e.target.value) || 0)}
                              className="h-7 w-20 text-sm"
                            />
                            <span className="text-xs text-slate-500">kW</span>
                          </div>
                        ) : (
                          <Badge variant="outline">{item.capacity}kW</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditingInventory ? (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-600">₹</span>
                            <Input
                              type="number"
                              value={item.price}
                              onChange={(e) => handleUpdateInventoryItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                              className="h-7 w-28 text-sm"
                            />
                          </div>
                        ) : (
                          <span className="font-semibold text-green-600">
                            ₹{item.price.toLocaleString()}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 hidden md:table-cell">
                        {isEditingInventory ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={item.dimensions.width}
                              onChange={(e) => handleUpdateDimensions(item.id, 'width', e.target.value)}
                              className="h-7 w-16 text-xs"
                              placeholder="W"
                            />
                            <span>×</span>
                            <Input
                              type="number"
                              value={item.dimensions.height}
                              onChange={(e) => handleUpdateDimensions(item.id, 'height', e.target.value)}
                              className="h-7 w-16 text-xs"
                              placeholder="H"
                            />
                            <span>×</span>
                            <Input
                              type="number"
                              value={item.dimensions.depth}
                              onChange={(e) => handleUpdateDimensions(item.id, 'depth', e.target.value)}
                              className="h-7 w-16 text-xs"
                              placeholder="D"
                            />
                          </div>
                        ) : (
                          <span>{item.dimensions.width} × {item.dimensions.height} × {item.dimensions.depth}</span>
                        )}
                      </TableCell>
                      {isEditingInventory && (
                        <TableCell>
                          <Button
                            onClick={() => handleDeleteItem(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Add New Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>
              Add a new {newItemType} to your inventory
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Item Type</Label>
              <Select 
                value={newItemType} 
                onValueChange={(value) => setNewItemType(value as 'panel' | 'battery' | 'inverter')}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="panel">Solar Panel</SelectItem>
                  <SelectItem value="battery">Battery</SelectItem>
                  <SelectItem value="inverter">Inverter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Brand</Label>
              <Input
                value={newItem.brand}
                onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                placeholder="Enter brand name"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Model</Label>
              <Input
                value={newItem.model}
                onChange={(e) => setNewItem({ ...newItem, model: e.target.value })}
                placeholder="Enter model number"
                className="mt-1"
              />
            </div>

            <div>
              <Label>
                Capacity ({newItemType === 'panel' ? 'W' : newItemType === 'battery' ? 'kWh' : 'kW'})
              </Label>
              <Input
                type="number"
                value={newItem.capacity || ''}
                onChange={(e) => setNewItem({ ...newItem, capacity: parseFloat(e.target.value) || 0 })}
                placeholder="Enter capacity"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={newItem.price || ''}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                placeholder="Enter price"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Dimensions (mm)</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div>
                  <Input
                    type="number"
                    value={newItem.dimensions?.width || ''}
                    onChange={(e) => setNewItem({
                      ...newItem,
                      dimensions: {
                        ...newItem.dimensions,
                        width: parseFloat(e.target.value) || 0,
                        height: newItem.dimensions?.height || 0,
                        depth: newItem.dimensions?.depth || 0,
                      }
                    })}
                    placeholder="Width"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={newItem.dimensions?.height || ''}
                    onChange={(e) => setNewItem({
                      ...newItem,
                      dimensions: {
                        ...newItem.dimensions,
                        width: newItem.dimensions?.width || 0,
                        height: parseFloat(e.target.value) || 0,
                        depth: newItem.dimensions?.depth || 0,
                      }
                    })}
                    placeholder="Height"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={newItem.dimensions?.depth || ''}
                    onChange={(e) => setNewItem({
                      ...newItem,
                      dimensions: {
                        ...newItem.dimensions,
                        width: newItem.dimensions?.width || 0,
                        height: newItem.dimensions?.height || 0,
                        depth: parseFloat(e.target.value) || 0,
                      }
                    })}
                    placeholder="Depth"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setNewItem({
                  brand: '',
                  model: '',
                  capacity: 0,
                  price: 0,
                  dimensions: { width: 0, height: 0, depth: 0 },
                });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddNewItem}
              disabled={!newItem.brand || !newItem.model || !newItem.capacity || !newItem.price}
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
