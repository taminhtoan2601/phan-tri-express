'use client';

import React, { createContext, useContext, useState } from 'react';
import { City } from '@/types/system-configuration';

interface DrawerContextProps {
  isOpen: boolean;
  city?: City;
  openDrawer: (city?: City) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [city, setCity] = useState<City | undefined>(undefined);

  const openDrawer = (cityData?: City) => {
    setCity(cityData);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    // Optional: Reset city data after drawer closes
    setTimeout(() => {
      setCity(undefined);
    }, 300); // Small delay to allow drawer close animation
  };

  return (
    <DrawerContext.Provider value={{ isOpen, city, openDrawer, closeDrawer }}>
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
