'use client';

import { Branch } from '@/types/system-configuration';
import { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Interface for the DrawerContext state and methods
 */
interface DrawerContextType {
  isOpen: boolean;
  branch: Branch | undefined;
  openDrawer: (branch?: Branch) => void;
  closeDrawer: () => void;
}

/**
 * Create the DrawerContext with default values
 */
const DrawerContext = createContext<DrawerContextType>({
  isOpen: false,
  branch: undefined,
  openDrawer: () => {},
  closeDrawer: () => {}
});

/**
 * Props for DrawerProvider component
 */
interface DrawerProviderProps {
  children: ReactNode;
}

/**
 * Provider component for drawer state
 */
export const DrawerProvider = ({ children }: DrawerProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [branch, setBranch] = useState<Branch | undefined>(undefined);

  /**
   * Open the drawer and optionally set branch data for editing
   */
  const openDrawer = (data?: Branch) => {
    setBranch(data);
    setIsOpen(true);
  };

  /**
   * Close the drawer and reset branch data
   */
  const closeDrawer = () => {
    setIsOpen(false);
    setBranch(undefined);
  };

  return (
    <DrawerContext.Provider value={{ isOpen, branch, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};

/**
 * Custom hook to use the drawer context
 */
export const useDrawer = () => useContext(DrawerContext);
