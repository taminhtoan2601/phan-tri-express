'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Building, Globe, MapPin } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  getBranches,
  getCities,
  getCountries,
  getZones
} from '@/lib/api/system-configuration-api';
import { Branch, City, Country, Zone } from '@/types/system-configuration';

/**
 * Administrative overview page component
 * Displays card-based navigation to administrative configuration pages
 */
export default function AdministrativeOverview() {
  // Fetch data for counters
  const { data: zones = [] } = useQuery<Zone[]>({
    queryKey: ['zones'],
    queryFn: () => getZones(),
    staleTime: 60000 // 1 minute
  });

  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ['branches'],
    queryFn: () => getBranches(),
    staleTime: 60000 // 1 minute
  });

  const { data: countries = [] } = useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: () => getCountries(),
    staleTime: 60000 // 1 minute
  });

  const { data: cities = [] } = useQuery<City[]>({
    queryKey: ['cities'],
    queryFn: () => getCities(),
    staleTime: 60000 // 1 minute
  });

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Administrative Configuration</h1>
        <p className='text-muted-foreground mt-2'>
          Manage branches, countries, and other administrative settings
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Zones Card */}
        <Link
          href='/system-configuration/administrative/zones'
          className='block transition-transform hover:scale-105'
        >
          <Card className='h-full'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Zones</CardTitle>
                <MapPin className='text-primary h-6 w-6' />
              </div>
              <CardDescription>
                Manage shipping zones for pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Configure geographic zones used for pricing calculations</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Total Zones</span>
                <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-lg font-medium'>
                  {zones?.length || 0}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>
        {/* Countries Card */}
        <Link
          href='/system-configuration/administrative/countries'
          className='block transition-transform hover:scale-105'
        >
          <Card className='h-full'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Countries</CardTitle>
                <Globe className='text-primary h-6 w-6' />
              </div>
              <CardDescription>
                Manage shipping destination countries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Configure and manage countries where shipments can be sent to
              </p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Total Countries</span>
                <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-lg font-medium'>
                  {countries?.length || 0}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>

        {/* Cities Card */}
        <Link
          href='/system-configuration/administrative/cities'
          className='block transition-transform hover:scale-105'
        >
          <Card className='h-full'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Cities</CardTitle>
                <MapPin className='text-primary h-6 w-6' />
              </div>
              <CardDescription>
                Manage shipping destination cities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Configure and manage cities where shipments can be sent to</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Total Cities</span>
                <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-lg font-medium'>
                  {cities?.length || 0}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>
        {/* Branches Card */}
        <Link
          href='/system-configuration/administrative/branches'
          className='block transition-transform hover:scale-105'
        >
          <Card className='h-full'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Branches</CardTitle>
                <Building className='text-primary h-6 w-6' />
              </div>
              <CardDescription>
                Manage company branches and offices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Configure branch locations, contact information, and operational
                settings
              </p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Active Branches</span>
                <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-lg font-medium'>
                  {branches?.length || 0}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
}
