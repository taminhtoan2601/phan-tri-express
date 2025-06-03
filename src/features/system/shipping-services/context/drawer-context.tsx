/**
 * Drawer Context for Payment Types
 * Manages the drawer state and the payment type being edited
 */
'use client';

import React, { createContext, useContext, useState } from 'react';
import { ShippingService } from '@/types/system-configuration';

interface DrawerContextType {
  isOpen: boolean;
  shippingService: ShippingService | null;
  openDrawer: (shippingService?: ShippingService) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

/**
 * Provider component for payment type drawer state
 */
export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shippingService, setShippingService] =
    useState<ShippingService | null>(null);

  const openDrawer = (shippingService?: ShippingService) => {
    if (shippingService) {
      setShippingService(shippingService);
    } else {
      setShippingService(null);
    }
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setTimeout(() => setShippingService(null), 300); // Clear after drawer close animation
  };

  return (
    <DrawerContext.Provider
      value={{ isOpen, shippingService, openDrawer, closeDrawer }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

/**
 * Hook for accessing the drawer context
 */
export function useDrawer() {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
}
