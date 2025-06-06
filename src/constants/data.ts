import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Bảng Theo Dõi',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Đơn Vận Chuyển',
    url: '/shipping-orders',
    icon: 'package',
    shortcut: ['s', 'o'],
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  // {
  //   title: 'Product',
  //   url: '/dashboard/product',
  //   icon: 'product',
  //   shortcut: ['p', 'p'],
  //   isActive: false,
  //   items: [] // No child items
  // },
  // {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   shortcut: ['k', 'k'],
  //   isActive: false,
  //   items: [] // No child items
  // },
  {
    title: 'Cấu Hình Hệ Thống',
    url: '#',
    icon: 'settingsCog',
    shortcut: ['s', 's'],
    isActive: true,
    items: [
      // Administrative Section
      {
        title: 'Quản Lý Hành Chính',
        url: '/system-configuration/administrative',
        icon: 'office',
        items: [
          {
            title: 'Quốc Gia',
            url: '/system-configuration/administrative/countries',
            shortcut: ['c', 'o']
          },
          {
            title: 'Chi Nhánh',
            url: '/system-configuration/administrative/branches',
            shortcut: ['b', 'r']
          },
          {
            title: 'Khu Vực',
            url: '/system-configuration/administrative/zones',
            shortcut: ['z', 'n']
          }
        ]
      },
      // System Section
      {
        title: 'Hệ Thống',
        url: '/system-configuration/system',
        icon: 'settings',
        items: [
          {
            title: 'Loại Hàng',
            url: '/system-configuration/system/commodity-types',
            shortcut: ['c', 't']
          },
          {
            title: 'Phương Thức Giao Hàng',
            url: '/system-configuration/system/shipping-types',
            shortcut: ['s', 't']
          },
          {
            title: 'Phương Thức Thanh Toán',
            url: '/system-configuration/system/payment-types',
            shortcut: ['p', 't']
          },
          {
            title: 'Dịch Vụ Giao Hàng',
            url: '/system-configuration/system/shipping-services',
            shortcut: ['p', 't']
          }
        ]
      },
      // Pricing Section
      {
        title: 'Giá',
        url: '/system-configuration/pricing',
        icon: 'billing',
        items: [
          {
            title: 'Tuyến Vận Chuyển',
            url: '/system-configuration/pricing/routes',
            shortcut: ['r', 't']
          },
          {
            title: 'Đơn Vị Vận Chuyển',
            url: '/system-configuration/pricing/carriers',
            shortcut: ['c', 'a']
          },
          {
            title: 'Bộ Phí Bảo Hiểm',
            url: '/system-configuration/pricing/insurance-packages',
            shortcut: ['i', 'p']
          },
          {
            title: 'Cấu Hình Giá',
            url: '/system-configuration/pricing/prices',
            shortcut: ['p', 'c']
          }
        ]
      }
    ]
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
