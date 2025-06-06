'use client';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import React, { useState } from 'react';
import { ActiveThemeProvider } from '../active-theme';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  // Create a new QueryClient instance for React Query
  const [queryClient] = useState(() => new QueryClient());

  // NOTE: Mock server initialization with MSW disabled due to Service Worker issues
  // Using direct mock data from mock-system-config.ts instead
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     startMockServer();
  //     return () => {
  //       stopMockServer();
  //     };
  //   }
  // }, []);

  // we need the resolvedTheme value to set the baseTheme for clerk based on the dark or light theme
  const { resolvedTheme } = useTheme();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ActiveThemeProvider initialTheme={activeThemeValue}>
          <ClerkProvider
            appearance={{
              baseTheme: resolvedTheme === 'dark' ? dark : undefined
            }}
          >
            {children}
          </ClerkProvider>
        </ActiveThemeProvider>
      </QueryClientProvider>
    </>
  );
}
