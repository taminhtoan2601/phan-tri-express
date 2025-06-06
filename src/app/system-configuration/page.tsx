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
        <h1 className='mb-2 text-3xl font-bold'>Cấu hình Hệ thống</h1>
        <p className='text-muted-foreground'>
          Quản lý tất cả các cấu hình hệ thống và cài đặt cho các hoạt động vận
          chuyển
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Administrative Section */}
        <SectionCard
          title='Quản lý Địa lý'
          description='Cài đặt địa lý và hành chính'
          icon={<FolderTree className='h-6 w-6' />}
        >
          <ConfigLink
            href='/system-configuration/administrative/zones'
            title='Shipping Zones'
            icon={<Map className='h-5 w-5' />}
            description='Quản lý vùng giao hàng và nhóm khu vực'
          />
          <ConfigLink
            href='/system-configuration/administrative/countries'
            title='Quốc Gia'
            icon={<Globe className='h-5 w-5' />}
            description='Cài đặt quốc gia và cài đặt quốc gia'
          />
          <ConfigLink
            href='/system-configuration/administrative/cities'
            title='Thành Phố'
            icon={<Building2 className='h-5 w-5' />}
            description='Quản lý thành phố và khu vực đô thị'
          />
          <ConfigLink
            href='/system-configuration/administrative/branches'
            title='Chi Nhánh'
            icon={<Building2 className='h-5 w-5' />}
            description='Cài đặt chi nhánh và vị trí'
          />
        </SectionCard>

        {/* System Section */}
        <SectionCard
          title='Hệ Thống'
          description='Cài đặt hệ thống'
          icon={<Settings className='h-6 w-6' />}
        >
          <ConfigLink
            href='/system-configuration/system/commodity-types'
            title='Loại Hàng'
            icon={<PackageOpen className='h-5 w-5' />}
            description='Cài đặt loại hàng'
          />
          <ConfigLink
            href='/system-configuration/system/shipping-types'
            title='Loại Giao Hàng'
            icon={<PackageOpen className='h-5 w-5' />}
            description='Cài đặt loại giao hàng'
          />
          <ConfigLink
            href='/system-configuration/system/shipping-services'
            title='Dịch vụ Giao Hàng'
            icon={<PackageOpen className='h-5 w-5' />}
            description='Cài đặt dịch vụ giao hàng'
          />
          <ConfigLink
            href='/system-configuration/system/payment-types'
            title='Loại Thanh Toán'
            icon={<PackageOpen className='h-5 w-5' />}
            description='Cài đặt loại thanh toán'
          />
        </SectionCard>

        {/* Pricing Section */}
        <SectionCard
          title='Giá Bảng'
          description='Giá, dịch vụ và quy tắc giá'
          icon={<CircleDollarSign className='h-6 w-6' />}
        >
          <ConfigLink
            href='/system-configuration/pricing/routes'
            title='Tuyến Vận Chuyển'
            icon={<Map className='h-5 w-5' />}
            description='Cài đặt các tuyến vận chuyển'
          />
          <ConfigLink
            href='/system-configuration/pricing/carriers'
            title='Đơn Vị Vận Chuyển'
            icon={<Truck className='h-5 w-5' />}
            description='Quản lý đơn vị vận chuyển và dịch vụ'
          />
          <ConfigLink
            href='/system-configuration/pricing/insurance-packages'
            title='Bao Hiểm'
            icon={<PackageOpen className='h-5 w-5' />}
            description='Cài đặt gói bảo hiểm và các tùy chọn bảo hiểm'
          />
          <ConfigLink
            href='/system-configuration/pricing/prices'
            title='Quy Tắc Giá'
            icon={<CircleDollarSign className='h-5 w-5' />}
            description='Quản lý các quy tắc giá'
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
