'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Package, Truck, CreditCard } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  getCommodityTypes,
  getPaymentTypes,
  getShippingServices,
  getShippingTypes
} from '@/lib/api/system-configuration-api';
import {
  CommodityType,
  PaymentType,
  ShippingService,
  ShippingType
} from '@/types/system-configuration';

/**
 * System overview page component
 * Displays card-based navigation to system configuration pages
 */
export default function SystemOverview() {
  // Fetch data for counters
  const { data: commodityTypes = [] } = useQuery<CommodityType[]>({
    queryKey: ['commodity-types'],
    queryFn: () => getCommodityTypes(),
    staleTime: 60000 // 1 minute
  });

  const { data: paymentTypes = [] } = useQuery<PaymentType[]>({
    queryKey: ['payment-types'],
    queryFn: () => getPaymentTypes(),
    staleTime: 60000 // 1 minute
  });

  const { data: shippingServices = [] } = useQuery<ShippingService[]>({
    queryKey: ['shipping-services'],
    queryFn: () => getShippingServices(),
    staleTime: 60000 // 1 minute
  });

  const { data: shippingTypes = [] } = useQuery<ShippingType[]>({
    queryKey: ['shipping-types'],
    queryFn: () => getShippingTypes(),
    staleTime: 60000 // 1 minute
  });

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Cài Đặt Hệ Thống</h1>
        <p className='text-muted-foreground mt-2'>
          Quản lý loại hàng, loại giao hàng, và phương thức thanh toán
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Commodity Types Card */}
        <Link
          href='/system-configuration/system/commodity-types'
          className='block transition-transform hover:scale-105'
        >
          <Card className='h-full'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Loại Hàng</CardTitle>
                <Package className='text-primary h-6 w-6' />
              </div>
            </CardHeader>
            <CardContent>
              <p>Cấu hình các loại hàng có thể vận chuyển</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Loại Hàng</span>
                <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-lg font-medium'>
                  {commodityTypes?.length || 0}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>

        {/* Shipping Types Card */}
        <Link
          href='/system-configuration/system/shipping-types'
          className='block transition-transform hover:scale-105'
        >
          <Card className='h-full'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Loại Giao Hàng</CardTitle>
                <Truck className='text-primary h-6 w-6' />
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Cấu hình các loại giao hàng với các tùy chọn tốc độ và chi phí
              </p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Loại Giao Hàng</span>
                <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-lg font-medium'>
                  {shippingTypes?.length || 0}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>
        {/* Shipping Services Card */}
        <Link
          href='/system-configuration/system/shipping-services'
          className='block transition-transform hover:scale-105'
        >
          <Card className='h-full'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Dịch vụ Giao Hàng</CardTitle>
                <Truck className='text-primary h-6 w-6' />
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Cấu hình các dịch vụ giao hàng với các tùy chọn tốc độ và chi
                phí
              </p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Service Types</span>
                <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-lg font-medium'>
                  {shippingServices?.length || 0}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>
        {/* Payment Types Card */}
        <Link
          href='/system-configuration/system/payment-types'
          className='block transition-transform hover:scale-105'
        >
          <Card className='h-full'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Loại Thanh Toán</CardTitle>
                <CreditCard className='text-primary h-6 w-6' />
              </div>
            </CardHeader>
            <CardContent>
              <p>Quản lý các loại thanh toán và các phương thức xử lý</p>
            </CardContent>
            <CardFooter>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>Loại Thanh Toán</span>
                <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-lg font-medium'>
                  {paymentTypes?.length || 0}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
}
