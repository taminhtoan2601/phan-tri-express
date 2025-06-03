/**
 * Drawer Context for Commodity Types
 * Manages the drawer state and the commodity type being edited
 */
'use client';

import React, { createContext, useContext, useState } from 'react';
import { InsurancePackage } from '@/types/system-configuration';

interface DrawerContextType {
  isOpen: boolean;
  insurancePackage: InsurancePackage | null;
  openDrawer: (insurancePackage?: InsurancePackage) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [insurancePackage, setInsurancePackage] =
    useState<InsurancePackage | null>(null);

  const openDrawer = (insurancePackage?: InsurancePackage) => {
    if (insurancePackage) {
      setInsurancePackage(insurancePackage);
    } else {
      setInsurancePackage(null);
    }
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setTimeout(() => setInsurancePackage(null), 300); // Clear after drawer close animation
  };

  return (
    <DrawerContext.Provider
      value={{ isOpen, insurancePackage, openDrawer, closeDrawer }}
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
