/**
 * Drawer Context for Payment Types
 * Manages the drawer state and the payment type being edited
 */
'use client';

import React, { createContext, useContext, useState } from 'react';
import { PaymentType } from '@/types/system-configuration';

interface DrawerContextType {
  isOpen: boolean;
  paymentType: PaymentType | null;
  openDrawer: (paymentType?: PaymentType) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

/**
 * Provider component for payment type drawer state
 */
export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType | null>(null);

  const openDrawer = (paymentType?: PaymentType) => {
    if (paymentType) {
      setPaymentType(paymentType);
    } else {
      setPaymentType(null);
    }
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setTimeout(() => setPaymentType(null), 300); // Clear after drawer close animation
  };

  return (
    <DrawerContext.Provider
      value={{ isOpen, paymentType, openDrawer, closeDrawer }}
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
