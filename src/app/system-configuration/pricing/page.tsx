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
        <h1 className='text-3xl font-bold'>Cấu hình Giá</h1>
        <p className='text-muted-foreground mt-2'>
          Quản lý các tuyến giao hàng, các hãng vận chuyển, gói bảo hiểm và các
          cấu hình giá
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
                <CardTitle>Tuyến Vận Chuyển</CardTitle>
                <RouteIcon className='text-primary h-6 w-6' />
              </div>
            </CardHeader>
            <CardContent>
              <p>Cấu hình tuyến vận chuyển</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>
                  Tổng Tuyến Vận Chuyển
                </span>
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
                <CardTitle>Đơn Vị Vận Chuyển</CardTitle>
                <Ship className='text-primary h-6 w-6' />
              </div>
            </CardHeader>
            <CardContent>
              <p>Cấu hình đơn vị vận chuyển</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>
                  Tổng đơn vị vận chuyển
                </span>
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
                <CardTitle>Gói Bảo Hiểm</CardTitle>
                <Shield className='text-primary h-6 w-6' />
              </div>
            </CardHeader>
            <CardContent>
              <p>Cấu hình gói bảo hiểm</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Tổng gói bảo hiểm</span>
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
                <CardTitle>Cấu hình Giá</CardTitle>
                <DollarSign className='text-primary h-6 w-6' />
              </div>
            </CardHeader>
            <CardContent>
              <p>Cấu hình giá</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Tổng Cấu hình Giá</span>
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
