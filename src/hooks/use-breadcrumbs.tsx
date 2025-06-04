'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/employee': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employee', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Product', link: '/dashboard/product' }
  ],
  '/system-configuration': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' }
  ],
  '/system-configuration/administrative': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'Administrative', link: '/system-configuration/administrative' }
  ],
  '/system-configuration/administrative/zones': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'Administrative', link: '/system-configuration/administrative' },
    { title: 'Zones', link: '/system-configuration/administrative/zones' }
  ],
  '/system-configuration/administrative/countries': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'Administrative', link: '/system-configuration/administrative' },
    {
      title: 'Countries',
      link: '/system-configuration/administrative/countries'
    }
  ],
  '/system-configuration/administrative/cities': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'Administrative', link: '/system-configuration/administrative' },
    { title: 'Cities', link: '/system-configuration/administrative/cities' }
  ],
  '/system-configuration/administrative/branches': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'Administrative', link: '/system-configuration/administrative' },
    { title: 'Branches', link: '/system-configuration/administrative/branches' }
  ],
  '/system-configuration/system': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'System', link: '/system-configuration/system' }
  ],
  '/system-configuration/system/shipping-services': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'System', link: '/system-configuration/system' },
    {
      title: 'Shipping Services',
      link: '/system-configuration/system/shipping-services'
    }
  ],
  '/system-configuration/system/commodity-types': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'System', link: '/system-configuration/system' },
    {
      title: 'Commodity Types',
      link: '/system-configuration/system/commodity-types'
    }
  ],
  '/system-configuration/system/shipping-types': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'System', link: '/system-configuration/system' },
    {
      title: 'Shipping Types',
      link: '/system-configuration/system/shipping-types'
    }
  ],
  '/system-configuration/system/payment-types': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'System', link: '/system-configuration/system' },
    {
      title: 'Payment Types',
      link: '/system-configuration/system/payment-types'
    }
  ],
  '/system-configuration/pricing': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'Pricing', link: '/system-configuration/pricing' }
  ],
  '/system-configuration/pricing/routes': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'Pricing', link: '/system-configuration/pricing' },
    { title: 'Routes', link: '/system-configuration/pricing/routes' }
  ],
  '/system-configuration/pricing/insurance-packages': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'Pricing', link: '/system-configuration/pricing' },
    {
      title: 'Insurance Packages',
      link: '/system-configuration/pricing/insurance-packages'
    }
  ],
  '/system-configuration/pricing/carriers': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'Pricing', link: '/system-configuration/pricing' },
    { title: 'Carriers', link: '/system-configuration/pricing/carriers' }
  ],
  '/system-configuration/pricing/prices': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'System Configuration', link: '/system-configuration' },
    { title: 'Pricing', link: '/system-configuration/pricing' },
    { title: 'Prices', link: '/system-configuration/pricing/prices' }
  ]
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
