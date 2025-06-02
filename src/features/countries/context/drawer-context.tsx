'use client';

import React, { createContext, useContext, useState } from 'react';
import { Country } from '@/types/system-configuration';

interface DrawerContextProps {
  isOpen: boolean;
  country?: Country;
  openDrawer: (country?: Country) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState<Country | undefined>(undefined);

  const openDrawer = (countryData?: Country) => {
    setCountry(countryData);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    // Optional: Reset country data after drawer closes
    setTimeout(() => {
      setCountry(undefined);
    }, 300); // Small delay to allow drawer close animation
  };

  return (
    <DrawerContext.Provider
      value={{ isOpen, country, openDrawer, closeDrawer }}
    >
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
