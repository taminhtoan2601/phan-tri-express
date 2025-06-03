'use client';

import React, { createContext, useContext, useState } from 'react';
import { Price } from '@/types/system-configuration';

interface DrawerContextProps {
  isOpen: boolean;
  price?: Price;
  openDrawer: (price?: Price) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState<Price | undefined>(undefined);

  const openDrawer = (priceData?: Price) => {
    setPrice(priceData);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    // Optional: Reset price data after drawer closes
    setTimeout(() => {
      setPrice(undefined);
    }, 300); // Small delay to allow drawer close animation
  };

  return (
    <DrawerContext.Provider value={{ isOpen, price, openDrawer, closeDrawer }}>
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
