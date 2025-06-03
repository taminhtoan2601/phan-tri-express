/**
 * Drawer Context for Commodity Types
 * Manages the drawer state and the commodity type being edited
 */
'use client';

import React, { createContext, useContext, useState } from 'react';
import { Carrier } from '@/types/system-configuration';

interface DrawerContextType {
  isOpen: boolean;
  carrier: Carrier | null;
  openDrawer: (carrier?: Carrier) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [carrier, setCarrier] = useState<Carrier | null>(null);

  const openDrawer = (carrier?: Carrier) => {
    if (carrier) {
      setCarrier(carrier);
    } else {
      setCarrier(null);
    }
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setTimeout(() => setCarrier(null), 300); // Clear after drawer close animation
  };

  return (
    <DrawerContext.Provider
      value={{ isOpen, carrier, openDrawer, closeDrawer }}
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
