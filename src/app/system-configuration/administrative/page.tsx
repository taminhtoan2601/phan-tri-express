'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Building, Globe, MapPin } from 'lucide-react';
import {
  Card,
  CardContent,
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
        <h1 className='text-3xl font-bold'>Cấu Hình Hành Chính</h1>
        <p className='text-muted-foreground mt-2'>
          Quản lý các cài đặt hành chính
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
                <CardTitle>Khu Vực</CardTitle>
                <MapPin className='text-primary h-6 w-6' />
              </div>
            </CardHeader>
            <CardContent>
              <p>Cấu hình các khu vực giao hàng</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Tổng Số Khu Vực</span>
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
                <CardTitle>Quốc Gia</CardTitle>
                <Globe className='text-primary h-6 w-6' />
              </div>
            </CardHeader>
            <CardContent>
              <p>Cấu hình các quốc gia</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Tổng Số Quốc Gia</span>
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
                <CardTitle>Thành Phố</CardTitle>
                <MapPin className='text-primary h-6 w-6' />
              </div>
            </CardHeader>
            <CardContent>
              <p>Cấu hình các thành phố</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Tổng Số Thành Phố</span>
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
                <CardTitle>Chi Nhánh</CardTitle>
                <Building className='text-primary h-6 w-6' />
              </div>
            </CardHeader>
            <CardContent>
              <p>Cấu hình các chi nhánh</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Tổng Số Chi Nhánh</span>
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
