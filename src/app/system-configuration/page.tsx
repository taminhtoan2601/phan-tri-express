'use client';

import { FC } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  FolderTree,
  Map,
  Globe,
  Building2,
  PackageOpen,
  Truck,
  TruckIcon,
  Scale,
  CircleDollarSign,
  Settings
} from 'lucide-react';

/**
 * System Configuration Overview Page
 * Provides navigation to all system configuration sub-modules
 */
export default function SystemConfigurationPage() {
  return (
    <div className='container mx-auto py-6'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold'>System Configuration</h1>
        <p className='text-muted-foreground'>
          Manage all system-wide configurations and settings for your logistics
          operations
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Administrative Section */}
        <SectionCard
          title='Administrative'
          description='Geographic and administrative settings'
          icon={<FolderTree className='h-6 w-6' />}
        >
          <ConfigLink
            href='/system-configuration/administrative/zones'
            title='Shipping Zones'
            icon={<Map className='h-5 w-5' />}
            description='Manage shipping zones and region groupings'
          />
          <ConfigLink
            href='/system-configuration/administrative/countries'
            title='Countries'
            icon={<Globe className='h-5 w-5' />}
            description='Configure supported countries and their settings'
          />
          <ConfigLink
            href='/system-configuration/administrative/cities'
            title='Cities'
            icon={<Building2 className='h-5 w-5' />}
            description='Manage cities and urban centers'
          />
          <ConfigLink
            href='/system-configuration/administrative/branches'
            title='Branches'
            icon={<Building2 className='h-5 w-5' />}
            description='Configure company branches and locations'
          />
        </SectionCard>

        {/* Pricing Section */}
        <SectionCard
          title='Pricing'
          description='Rates, services and pricing rules'
          icon={<CircleDollarSign className='h-6 w-6' />}
        >
          <ConfigLink
            href='/system-configuration/pricing/shipping-services'
            title='Shipping Services'
            icon={<Truck className='h-5 w-5' />}
            description='Configure shipping service levels and options'
          />
          <ConfigLink
            href='/system-configuration/pricing/pricing-rules'
            title='Pricing Rules'
            icon={<Scale className='h-5 w-5' />}
            description='Set up weight calculations and pricing formulas'
          />
          <ConfigLink
            href='/system-configuration/pricing/prices'
            title='Prices'
            icon={<CircleDollarSign className='h-5 w-5' />}
            description='Manage base rates for routes and services'
          />
        </SectionCard>

        {/* Logistics Section */}
        <SectionCard
          title='Logistics'
          description='Routes and shipment settings'
          icon={<TruckIcon className='h-6 w-6' />}
        >
          <ConfigLink
            href='/system-configuration/pricing/routes'
            title='Routes'
            icon={<Map className='h-5 w-5' />}
            description='Configure shipping routes between locations'
          />
          <ConfigLink
            href='/system-configuration/pricing/carriers'
            title='Carriers'
            icon={<Truck className='h-5 w-5' />}
            description='Manage third-party carriers and services'
          />
          <ConfigLink
            href='/system-configuration/system/commodity-types'
            title='Commodity Types'
            icon={<PackageOpen className='h-5 w-5' />}
            description='Configure types of goods and commodities'
          />
        </SectionCard>

        {/* System Section */}
        <SectionCard
          title='System'
          description='Core system settings'
          icon={<Settings className='h-6 w-6' />}
        >
          <ConfigLink
            href='/system-configuration/office'
            title='Office Settings'
            icon={<Building2 className='h-5 w-5' />}
            description='Configure office-specific settings'
          />
        </SectionCard>
      </div>
    </div>
  );
}

/**
 * Section card component for grouping related configuration links
 */
interface SectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SectionCard: FC<SectionCardProps> = ({
  title,
  description,
  icon,
  children
}) => {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-2'>
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>{children}</div>
      </CardContent>
    </Card>
  );
};

/**
 * Configuration link component for individual section links
 */
interface ConfigLinkProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ConfigLink: FC<ConfigLinkProps> = ({
  href,
  title,
  description,
  icon
}) => {
  return (
    <Link href={href} className='group block'>
      <div className='group-hover:bg-muted flex items-start gap-3 rounded-md p-3 transition-colors'>
        <div className='text-muted-foreground mt-0.5'>{icon}</div>
        <div>
          <div className='group-hover:text-primary font-medium'>{title}</div>
          <div className='text-muted-foreground text-sm'>{description}</div>
        </div>
      </div>
    </Link>
  );
};
