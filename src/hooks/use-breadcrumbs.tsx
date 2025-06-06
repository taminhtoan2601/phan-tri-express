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
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Nhân viên', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Sản phẩm', link: '/dashboard/product' }
  ],
  '/system-configuration': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' }
  ],
  '/system-configuration/administrative': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    {
      title: 'Quản Lý Hành Chính',
      link: '/system-configuration/administrative'
    }
  ],
  '/system-configuration/administrative/zones': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    {
      title: 'Quản Lý Hành Chính',
      link: '/system-configuration/administrative'
    },
    { title: 'Khu Vực', link: '/system-configuration/administrative/zones' }
  ],
  '/system-configuration/administrative/countries': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    {
      title: 'Quản Lý Hành Chính',
      link: '/system-configuration/administrative'
    },
    {
      title: 'Quốc Gia',
      link: '/system-configuration/administrative/countries'
    }
  ],
  '/system-configuration/administrative/cities': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    {
      title: 'Quản Lý Hành Chính',
      link: '/system-configuration/administrative'
    },
    { title: 'Thành Phố', link: '/system-configuration/administrative/cities' }
  ],
  '/system-configuration/administrative/branches': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    {
      title: 'Quản Lý Hành Chính',
      link: '/system-configuration/administrative'
    },
    {
      title: 'Chi Nhánh',
      link: '/system-configuration/administrative/branches'
    }
  ],
  '/system-configuration/system': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    { title: 'Hệ Thống', link: '/system-configuration/system' }
  ],
  '/system-configuration/system/shipping-services': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    { title: 'Hệ Thống', link: '/system-configuration/system' },
    {
      title: 'Dịch Vụ Giao Hàng',
      link: '/system-configuration/system/shipping-services'
    }
  ],
  '/system-configuration/system/commodity-types': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    { title: 'Hệ Thống', link: '/system-configuration/system' },
    {
      title: 'Loại Hàng',
      link: '/system-configuration/system/commodity-types'
    }
  ],
  '/system-configuration/system/shipping-types': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    { title: 'Hệ Thống', link: '/system-configuration/system' },
    {
      title: 'Phương Thức Giao Hàng',
      link: '/system-configuration/system/shipping-types'
    }
  ],
  '/system-configuration/system/payment-types': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    { title: 'Hệ Thống', link: '/system-configuration/system' },
    {
      title: 'Phương Thức Thanh Toán',
      link: '/system-configuration/system/payment-types'
    }
  ],
  '/system-configuration/pricing': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    { title: 'Giá', link: '/system-configuration/pricing' }
  ],
  '/system-configuration/pricing/routes': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    { title: 'Giá', link: '/system-configuration/pricing' },
    { title: 'Tuyến Vận Chuyển', link: '/system-configuration/pricing/routes' }
  ],
  '/system-configuration/pricing/insurance-packages': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    { title: 'Giá', link: '/system-configuration/pricing' },
    {
      title: 'Bộ Phí Bảo Hiểm',
      link: '/system-configuration/pricing/insurance-packages'
    }
  ],
  '/system-configuration/pricing/carriers': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    { title: 'Giá', link: '/system-configuration/pricing' },
    {
      title: 'Đơn Vị Vận Chuyển',
      link: '/system-configuration/pricing/carriers'
    }
  ],
  '/system-configuration/pricing/prices': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Cấu Hình Hệ Thống', link: '/system-configuration' },
    { title: 'Giá', link: '/system-configuration/pricing' },
    { title: 'Cấu Hình Giá', link: '/system-configuration/pricing/prices' }
  ],
  '/shipping-orders': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Đơn Vận Chuyển', link: '/shipping-orders' }
  ],
  '/shipping-orders/list': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Đơn Vận Chuyển', link: '/shipping-orders' },
    { title: 'Danh Sách', link: '/shipping-orders/list' }
  ],
  '/shipping-orders/draft': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Đơn Vận Chuyển', link: '/shipping-orders' },
    { title: 'Đơn Mở', link: '/shipping-orders/draft' }
  ],
  '/shipping-orders/approval': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Đơn Vận Chuyển', link: '/shipping-orders' },
    { title: 'Duyệt Đơn', link: '/shipping-orders/approval' }
  ],
  '/shipping-orders/verification': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Đơn Vận Chuyển', link: '/shipping-orders' },
    { title: 'Xác Nhận Chứng Từ', link: '/shipping-orders/verification' }
  ],
  '/shipping-orders/warehouse': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Đơn Vận Chuyển', link: '/shipping-orders' },
    { title: 'Nhập/Xuất Kho', link: '/shipping-orders/warehouse' }
  ],
  '/shipping-orders/transit': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Đơn Vận Chuyển', link: '/shipping-orders' },
    { title: 'Đang Vận Chuyển', link: '/shipping-orders/transit' }
  ],
  '/shipping-orders/delivered': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Đơn Vận Chuyển', link: '/shipping-orders' },
    { title: 'Đã Giao', link: '/shipping-orders/delivered' }
  ],
  '/shipping-orders/cancelled': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Đơn Vận Chuyển', link: '/shipping-orders' },
    { title: 'Đã Hủy', link: '/shipping-orders/cancelled' }
  ],
  '/shipping-orders/:id': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Đơn Vận Chuyển', link: '/shipping-orders' },
    { title: 'Chi Tiết', link: '/shipping-orders/:id' }
  ],
  '/shipping/new': [
    { title: 'Bảng Theo Dõi', link: '/dashboard' },
    { title: 'Đơn Vận Chuyển', link: '/shipping-orders' },
    { title: 'Tạo Đơn', link: '/shipping/new' }
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
