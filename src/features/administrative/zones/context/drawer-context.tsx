'use client';

import React, { createContext, useContext, useState } from 'react';
import { Zone } from '@/types/system-configuration';

interface DrawerContextProps {
  isOpen: boolean;
  zone?: Zone;
  openDrawer: (zone?: Zone) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zone, setZone] = useState<Zone | undefined>(undefined);

  const openDrawer = (zoneData?: Zone) => {
    setZone(zoneData);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    // Optional: Reset zone data after drawer closes
    setTimeout(() => {
      setZone(undefined);
    }, 300); // Small delay to allow drawer close animation
  };

  return (
    <DrawerContext.Provider value={{ isOpen, zone, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};
