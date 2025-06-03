/**
 * Drawer Context for Commodity Types
 * Manages the drawer state and the commodity type being edited
 */
'use client';

import React, { createContext, useContext, useState } from 'react';
import { CommodityType } from '@/types/system-configuration';

interface DrawerContextType {
  isOpen: boolean;
  commodityType: CommodityType | null;
  openDrawer: (commodityType?: CommodityType) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [commodityType, setCommodityType] = useState<CommodityType | null>(
    null
  );

  const openDrawer = (commodityType?: CommodityType) => {
    if (commodityType) {
      setCommodityType(commodityType);
    } else {
      setCommodityType(null);
    }
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setTimeout(() => setCommodityType(null), 300); // Clear after drawer close animation
  };

  return (
    <DrawerContext.Provider
      value={{ isOpen, commodityType, openDrawer, closeDrawer }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
}
