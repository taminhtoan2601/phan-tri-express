'use client';

import React, { createContext, useContext, useState } from 'react';
import { Route } from '@/types/system-configuration';

interface DrawerContextProps {
  isOpen: boolean;
  route?: Route;
  openDrawer: (route?: Route) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [route, setRoute] = useState<Route | undefined>(undefined);

  const openDrawer = (routeData?: Route) => {
    setRoute(routeData);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    // Optional: Reset route data after drawer closes
    setTimeout(() => {
      setRoute(undefined);
    }, 300); // Small delay to allow drawer close animation
  };

  return (
    <DrawerContext.Provider value={{ isOpen, route, openDrawer, closeDrawer }}>
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
