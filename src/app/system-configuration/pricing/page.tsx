'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Route as RouteIcon, Ship, Shield, DollarSign } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  getRoutes,
  getCarriers,
  getInsurancePackages
} from '@/lib/api/system-configuration-api';
import {
  Route as RouteData,
  Carrier,
  InsurancePackage
} from '@/types/system-configuration';

/**
 * Pricing overview page component
 * Displays card-based navigation to pricing configuration pages
 */
export default function PricingOverview() {
  // Fetch data for counters
  const { data: routes = [] } = useQuery<RouteData[]>({
    queryKey: ['routes'],
    queryFn: () => getRoutes(),
    staleTime: 60000 // 1 minute
  });

  const { data: carriers = [] } = useQuery<Carrier[]>({
    queryKey: ['carriers'],
    queryFn: () => getCarriers(),
    staleTime: 60000 // 1 minute
  });

  const { data: insurancePackages = [] } = useQuery<InsurancePackage[]>({
    queryKey: ['insurance-packages'],
    queryFn: () => getInsurancePackages(),
    staleTime: 60000 // 1 minute
  });

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Pricing Configuration</h1>
        <p className='text-muted-foreground mt-2'>
          Manage routes, carriers, insurance packages, and pricing
          configurations
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {/* Routes Card */}
        <Link
          href='/system-configuration/pricing/routes'
          className='block transition-transform hover:scale-105'
        >
          <Card className='h-full'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Routes</CardTitle>
                <RouteIcon className='text-primary h-6 w-6' />
              </div>
              <CardDescription>Manage shipping routes</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Configure origin and destination routes for shipments</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Active Routes</span>
                <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-lg font-medium'>
                  {routes?.length || 0}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>

        {/* Carriers Card */}
        <Link
          href='/system-configuration/pricing/carriers'
          className='block transition-transform hover:scale-105'
        >
          <Card className='h-full'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Carriers</CardTitle>
                <Ship className='text-primary h-6 w-6' />
              </div>
              <CardDescription>Manage shipping carriers</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Configure shipping carriers and service providers</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Active Carriers</span>
                <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-lg font-medium'>
                  {carriers?.length || 0}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>

        {/* Insurance Packages Card */}
        <Link
          href='/system-configuration/pricing/insurance-packages'
          className='block transition-transform hover:scale-105'
        >
          <Card className='h-full'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Insurance Packages</CardTitle>
                <Shield className='text-primary h-6 w-6' />
              </div>
              <CardDescription>
                Manage shipping insurance options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Configure insurance packages and coverage options</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Insurance Options</span>
                <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-lg font-medium'>
                  {insurancePackages?.length || 0}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>

        {/* Price Configurations Card */}
        <Link
          href='/system-configuration/pricing/prices'
          className='block transition-transform hover:scale-105'
        >
          <Card className='h-full'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Price Configurations</CardTitle>
                <DollarSign className='text-primary h-6 w-6' />
              </div>
              <CardDescription>
                Manage pricing rules and formulas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Configure pricing rules, surcharges, and discount options</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Price Rules</span>
                <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-lg font-medium'>
                  {/* No API call for price configurations yet */}0
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
}
